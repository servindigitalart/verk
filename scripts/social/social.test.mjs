// node --test scripts/social/   — all network is mocked; no real API is called.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { createInstagram } from './instagram.mjs';
import { createOpenAI, costUsd } from './openai.mjs';
import * as lib from './library.mjs';
import { parseLogoUse, applyLogo, referencePngs, TOKENS } from './logo.mjs';
import { checkCaption, checkCopy, compareText, verifyPublicUrl, checkImage } from './validate.mjs';
import { runSlot, localDate, slotTime } from './run.mjs';

const noWait = async () => {};
const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

/** fetch mock: handlers [(url, init) => Response | undefined], records every call. */
function mockFetch(handler) {
  const calls = [];
  const fn = async (url, init = {}) => {
    const call = { url: String(url), method: init.method ?? 'GET', body: init.body ? String(init.body) : '', headers: init.headers ?? {} };
    calls.push(call);
    const r = await handler(call, calls);
    if (!r) throw new Error(`unmocked ${call.method} ${call.url}`);
    return r;
  };
  fn.calls = calls;
  return fn;
}

const params = (c) => Object.fromEntries(new URLSearchParams(c.body));

// Simulated Graph API. statuses: container id → list of status_code answers.
function graph({ statuses = {}, publish = () => json(200, { id: 'MEDIA1' }), media = [], info } = {}) {
  let n = 0;
  return mockFetch((c) => {
    if (c.method === 'POST' && c.url.endsWith('/media')) return json(200, { id: `C${++n}` });
    if (c.method === 'POST' && c.url.endsWith('/media_publish')) return publish(c);
    const st = c.url.match(/\/(C\d+)\?fields=status_code/);
    if (st) return json(200, { status_code: (statuses[st[1]] ?? ['FINISHED']).shift() ?? 'FINISHED' });
    if (c.url.includes('/IGU/media?fields=')) return json(200, { data: media });
    if (c.url.includes('?fields=id,media_type')) {
      if (info instanceof Response) return info;
      const kids = n > 1 ? n - 1 : 0;
      return json(200, info ?? { id: 'MEDIA1', media_type: kids ? 'CAROUSEL_ALBUM' : 'IMAGE', permalink: 'https://www.instagram.com/p/TEST/', timestamp: '2026-11-12T01:00:00+0000', ...(kids && { children: { data: Array.from({ length: kids }, (_, i) => ({ id: `K${i}` })) } }) });
    }
    if (c.url.includes('/IGU?fields=id,username')) return json(200, { id: 'IGU', username: 'verk.digital' });
  });
}
const ig = (fetch, extra) => createInstagram({ token: 'SECRET', userId: 'IGU', fetch, wait: noWait, ...extra });

// ── Instagram ─────────────────────────────────────────────────────────────
test('single: container → polling until FINISHED → media_publish; token only in headers', async () => {
  const f = graph({ statuses: { C1: ['IN_PROGRESS', 'IN_PROGRESS', 'FINISHED'] } });
  const r = await ig(f).publishSingle({ imageUrl: 'https://x/a.jpg', caption: 'Hola.' });
  assert.equal(r.mediaId, 'MEDIA1');
  assert.deepEqual(r.containerIds, ['C1']);
  assert.equal(r.verification.ok, true);
  assert.equal(r.verification.mediaType, 'IMAGE');
  assert.deepEqual(params(f.calls[0]), { image_url: 'https://x/a.jpg', caption: 'Hola.' });
  assert.equal(f.calls.filter((c) => c.url.includes('status_code')).length, 3);
  assert.equal(params(f.calls.find((c) => c.url.endsWith('/media_publish'))).creation_id, 'C1');
  for (const c of f.calls) {
    assert.ok(!c.url.includes('SECRET') && !c.body.includes('SECRET'));
    assert.equal(c.headers.Authorization, 'Bearer SECRET');
  }
});

test('carousel: children first, parent only after every child is FINISHED, then publish', async () => {
  const f = graph({ statuses: { C2: ['IN_PROGRESS', 'FINISHED'] } });
  const urls = [1, 2, 3, 4, 5].map((i) => `https://x/${i}.jpg`);
  const r = await ig(f).publishCarousel({ imageUrls: urls, caption: 'Hook.' });
  assert.deepEqual(r.containerIds, ['C1', 'C2', 'C3', 'C4', 'C5', 'C6']);
  const creates = f.calls.filter((c) => c.url.endsWith('/media'));
  creates.slice(0, 5).forEach((c, i) => assert.deepEqual(params(c), { image_url: urls[i], is_carousel_item: 'true' }));
  assert.deepEqual(params(creates[5]), { media_type: 'CAROUSEL', children: 'C1,C2,C3,C4,C5', caption: 'Hook.' });
  const parentAt = f.calls.indexOf(creates[5]);
  assert.ok(f.calls.slice(0, parentAt).filter((c) => c.url.includes('status_code')).length >= 5);
  assert.equal(params(f.calls.find((c) => c.url.endsWith('/media_publish'))).creation_id, 'C6');
  assert.deepEqual([r.verification.ok, r.verification.mediaType, r.verification.children, r.verification.permalink], [true, 'CAROUSEL_ALBUM', 5, 'https://www.instagram.com/p/TEST/']);
});

test('partial publish protection: a child in ERROR → no parent, no media_publish', async () => {
  const f = graph({ statuses: { C3: ['ERROR'] } });
  await assert.rejects(ig(f).publishCarousel({ imageUrls: ['a', 'b', 'c', 'd', 'e'], caption: 'x' }), /C3 en ERROR/);
  assert.equal(f.calls.filter((c) => c.url.endsWith('/media')).length, 5);
  assert.ok(!f.calls.some((c) => c.url.endsWith('/media_publish')));
});

test('carousel size and polling timeout are enforced', async () => {
  await assert.rejects(ig(graph()).publishCarousel({ imageUrls: ['a'], caption: 'x' }), /2 a 10/);
  const f = graph({ statuses: { C1: Array(10).fill('IN_PROGRESS') } });
  await assert.rejects(ig(f, { maxPolls: 3 }).publishSingle({ imageUrl: 'a', caption: 'x' }), /no llegó a FINISHED/);
  assert.ok(!f.calls.some((c) => c.url.endsWith('/media_publish')));
});

test('dry run creates and checks containers but never publishes', async () => {
  const f = graph();
  const r = await ig(f).publishSingle({ imageUrl: 'a', caption: 'x', dryRun: true });
  assert.equal(r.dryRun, true);
  assert.ok(!f.calls.some((c) => c.url.endsWith('/media_publish')));
});

test('retries: 5xx/429 are retried, 4xx is not', async () => {
  let fails = 2;
  const f = mockFetch((c) => {
    if (c.url.endsWith('/media')) return fails-- > 0 ? json(fails ? 500 : 429, { error: { message: 'busy' } }) : json(200, { id: 'C1' });
    if (c.url.includes('status_code')) return json(200, { status_code: 'FINISHED' });
    if (c.url.endsWith('/media_publish')) return json(200, { id: 'M' });
  });
  assert.equal((await ig(f).publishSingle({ imageUrl: 'a', caption: 'x' })).mediaId, 'M');
  assert.equal(f.calls.filter((c) => c.url.endsWith('/media')).length, 3);

  const bad = mockFetch(() => json(400, { error: { message: 'Invalid image', code: 9004 } }));
  await assert.rejects(ig(bad).publishSingle({ imageUrl: 'a', caption: 'x' }), /HTTP 400 9004 — Invalid image/);
  assert.equal(bad.calls.length, 1);
});

test('media_publish: rejection is final, ambiguous failure is reconciled, never retried', async () => {
  const rejected = graph({ publish: () => json(400, { error: { message: 'limit' } }) });
  await assert.rejects(ig(rejected).publishSingle({ imageUrl: 'a', caption: 'x' }), /HTTP 400/);
  assert.equal(rejected.calls.filter((c) => c.url.endsWith('/media_publish')).length, 1);

  const t0 = Date.parse('2026-11-10T14:00:00Z');
  const found = graph({
    publish: () => json(502, {}),
    media: [{ id: 'OLD', caption: 'x', timestamp: '2026-11-09T14:00:00+0000' }, { id: 'NEW', caption: 'x', timestamp: '2026-11-10T14:00:30+0000' }],
  });
  assert.equal((await ig(found).publishSingle({ imageUrl: 'a', caption: 'x', startedAt: t0 })).mediaId, 'NEW');
  assert.equal(found.calls.filter((c) => c.url.endsWith('/media_publish')).length, 1);

  const lost = graph({ publish: () => { throw new TypeError('socket hang up'); } });
  await assert.rejects(ig(lost).publishSingle({ imageUrl: 'a', caption: 'x' }), (e) => e.code === 'UNCONFIRMED');
  assert.equal(lost.calls.filter((c) => c.url.endsWith('/media_publish')).length, 1);
});

// ── OpenAI ────────────────────────────────────────────────────────────────
test('openai: spend-limit 429 fails fast; usage is priced per call', async () => {
  const f = mockFetch(() => json(429, { error: { message: 'limit', code: 'project_spend_limit_exceeded' } }));
  const ai = createOpenAI({ apiKey: 'K', fetch: f, wait: noWait });
  await assert.rejects(ai.respond({ step: 's', model: 'gpt-6.1-sol', text: 'x' }), /project_spend_limit_exceeded/);
  assert.equal(f.calls.length, 1);

  assert.equal(costUsd('gpt-6.1-sol', { input_tokens: 1e6, output_tokens: 1e6, input_tokens_details: { cached_tokens: 0 } }), 12);
  assert.equal(costUsd('gpt-image-2.6-sunburst', { input_tokens: 2000, output_tokens: 10000, input_tokens_details: { image_tokens: 1000, text_tokens: 1000 } }), (1000 * 5 + 1000 * 8 + 10000 * 30) / 1e6);
  assert.equal(costUsd('unknown-model', { input_tokens: 1 }), null);
});

test('openai: image edit sends the literal prompt + references; usage reaches onUsage', async () => {
  const seen = [];
  const f = mockFetch((c) => (c.url.endsWith('/images/edits') ? json(200, { data: [{ b64_json: Buffer.from('img').toString('base64') }], usage: { input_tokens: 10, output_tokens: 20 } }) : undefined));
  const ai = createOpenAI({ apiKey: 'K', fetch: f, wait: noWait, onUsage: (u) => seen.push(u) });
  const out = await ai.generateImage({ step: 'i', model: 'gpt-image-2.6-sunburst', prompt: 'P', references: [Buffer.from('png')] });
  assert.equal(out.toString(), 'img');
  const body = JSON.parse(f.calls[0].body);
  assert.equal(body.prompt, 'P');
  assert.equal(body.size, '1088x1360');
  assert.equal(body.output_format, 'jpeg');
  assert.match(body.images[0].image_url, /^data:image\/png;base64,/);
  assert.equal(seen[0].usage.output_tokens, 20);
  assert.ok(seen[0].costUsd > 0);
});

// ── Library (07 examples are the fixtures) ────────────────────────────────
const ex = await lib.readDoc('07-VALIDATION-EXAMPLES.md');
const between = (a, b) => ex.slice(ex.indexOf(a), ex.indexOf(b));
const outA = between('## Salida esperada (una sola ejecución)', '## Evaluación de la Prueba A');
const outMaster = between('# CARRUSEL VERK —', '## Paso 2 ·');
const outSeg = between('## Paso 2 ·', '### A) Tabla de verificación');

test('fill: only ENTRADA lines change; output-format placeholders stay literal', async () => {
  const t = await lib.loadPrompt('01-INDIVIDUAL-IMAGE-MASTER-PROMPT.md');
  const f = lib.fill(t, { TEMA: 'Cotizaciones que salen tarde', OBJETIVO: 'conversión', SEGMENTO: '', HISTORIAL: 'Últimas piezas: T2 violeta' });
  const a = t.split('\n'), b = f.split('\n');
  assert.equal(a.length, b.length);
  assert.deepEqual(a.map((l, i) => (l === b[i] ? null : i)).filter((i) => i != null).length, 4);
  assert.ok(f.includes('TEMA: Cotizaciones que salen tarde\n'));
  assert.ok(f.includes('ATTACHED FOR THIS IMAGE: {{wordmark | isotipo | wordmark and isotipo}}'));
  assert.throws(() => lib.fill(t, { NOPE: 'x' }), /NOPE/);
  const t2 = await lib.loadPrompt('02-CAROUSEL-MASTER-PROMPT.md');
  assert.ok(lib.fill(t2, { 'NÚMERO DE SLIDES': '5' }).includes('máximo 8): 5\n'));
  assert.ok(lib.fill(t2, { TEMA: 'X' }).includes('# CARRUSEL VERK — {{TEMA}}'));
});

test('01 parser: copy, visual prompt and LOGO · USO from Prueba A', () => {
  const p = lib.parseIndividual(outA);
  assert.deepEqual(p.copy, {
    etiqueta: '23:14 · MENSAJE SIN RESPUESTA',
    titular: 'Te escribieron. Nadie contestó.',
    secundario: 'Conectamos tu WhatsApp, tus formularios y tu CRM para que cada mensaje quede registrado y tenga un siguiente paso.',
    cta: 'Solicitar auditoría',
    microcopy: 'AUDITORÍA GRATUITA Y PERSONALIZADA · POR WHATSAPP',
  });
  assert.equal(p.attach, 'lab/brand/wordmark-ink.png');
  assert.ok(p.prompt.startsWith('▶ ADJUNTAR AL GENERADOR: lab/brand/wordmark-ink.png\n'));
  assert.ok(p.prompt.endsWith('never draw a logo that is not attached.'));
  assert.equal(p.logoUse, 'wordmark, bottom-left, left edge at x 48, vertically centered at y 1257, 220 px wide, ink #0F0F0F');
  assert.match(p.territorio, /^T2/);
  assert.throws(() => lib.parseIndividual(outA.replace('Titular: «', 'Titular: ')), /titular/);
});

test('02/03 parsers: Prueba B master and segmented prompts match literally', () => {
  const m = lib.parseMaster(outMaster);
  assert.equal(m.total, 5);
  assert.equal(m.hook, 'Tienes las herramientas. No se hablan.');
  assert.equal(m.cta, 'Solicitar auditoría');
  assert.equal(m.slides[0].copy.cta, null);
  assert.equal(m.slides[0].copy.microcopy, 'SITIO · WHATSAPP · CRM · AGENDA');
  assert.equal(m.slides[4].attach, 'lab/brand/wordmark-ink.png + lab/brand/isotipo-ink.png');
  const prompts = lib.parseSegmented(outSeg, m);
  assert.equal(prompts.length, 5);
  assert.ok(prompts[1].includes('USE IN THIS IMAGE: wordmark, bottom-left, left edge at x 48, vertically centered at y 1257, 220 px wide, cream #F0EEE9'));
  // segmenter drift is caught
  assert.throws(() => lib.parseSegmented(outSeg.replace('El problema vive entre una y otra.', 'El problema vive entre ellas.'), m), /slide 2: copy «titular»/);
  assert.throws(() => lib.parseMaster(outMaster.replace('- COPY · CTA: «—»', '- COPY · CTA: «Solicitar auditoría»')), /CTA fuera del último slide/);
});

test('captions: library copy only, no hashtags, structure of 01 and 04', () => {
  const a = lib.captionIndividual(lib.parseIndividual(outA).copy);
  assert.equal(a, 'Te escribieron. Nadie contestó.\n\nConectamos tu WhatsApp, tus formularios y tu CRM para que cada mensaje quede registrado y tenga un siguiente paso.\n\nSolicitar auditoría · AUDITORÍA GRATUITA Y PERSONALIZADA · POR WHATSAPP');
  assert.deepEqual(checkCaption(a), []);
  const b = lib.captionCarousel(lib.parseMaster(outMaster));
  assert.equal(b, 'Tienes las herramientas. No se hablan.\n\nSolicitar auditoría · POR WHATSAPP');
  assert.deepEqual(checkCaption(b), []);
  const noCta = lib.captionIndividual({ titular: 'A.', secundario: 'B.', cta: null, microcopy: null });
  assert.equal(noCta, 'A.\n\nB.');
  assert.deepEqual(checkCaption('Hola #verk'), ['caption con hashtags']);
  assert.ok(checkCaption('Responde en 5 segundos').includes('caption con cifras'));
  assert.deepEqual(checkCopy(['Llevamos tu negocio al siguiente nivel']), ['palabra prohibida «siguiente nivel»']);
});

// ── Logo ──────────────────────────────────────────────────────────────────
test('LOGO · USO: placements follow each prompt, never a fixed position', async () => {
  const [wm] = await parseLogoUse('wordmark, bottom-left, left edge at x 48, vertically centered at y 1257, 220 px wide, ink #0F0F0F');
  assert.deepEqual(wm, { kind: 'wordmark', color: '#0F0F0F', x: 48, y: 1231, w: 220, h: 53 });
  const both = await parseLogoUse('wordmark, bottom-left, left edge at x 48, vertically centered at y 1257, 220 px wide, ink #0F0F0F; isotipo, inside the area x 760-1032, y 640-990, about 350 px tall, ink #0F0F0F; wordmark and isotipo stay separate elements');
  assert.equal(both.length, 2);
  const iso = both[1];
  assert.equal(iso.kind, 'isotipo');
  assert.equal(iso.h, 350);
  assert.equal(iso.w, 269); // 350 × 567/739: uniform scale
  assert.ok(iso.x >= 760 && iso.x + iso.w <= 1032 && iso.y >= 640 && iso.y + iso.h <= 990);
  const [top] = await parseLogoUse('wordmark, top-right, right edge at x 1032, top edge at y 48, 180 px wide, cream #F0EEE9');
  assert.deepEqual([top.x, top.y, top.w], [852, 48, 180]);
  assert.deepEqual(await parseLogoUse('no logo'), []);
  await assert.rejects(parseLogoUse('wordmark, bottom-left, 220 px wide, ink #0F0F0F'), /sin posición/);
  await assert.rejects(parseLogoUse('wordmark, left edge at x 48, top edge at y 100, 220 px wide, #FF0000'), /fuera de la paleta/);
  await assert.rejects(parseLogoUse('wordmark, left edge at x 1000, top edge at y 100, 220 px wide, ink #0F0F0F'), /fuera del lienzo/);
  await assert.rejects(parseLogoUse('somewhere nice'), /no interpretable/);
});

const flat = (hex, draw = []) => sharp({ create: { width: 1080, height: 1350, channels: 3, background: hex } })
  .composite(draw).jpeg({ quality: 95 }).toBuffer();
const rect = (x, y, w, h, color) => ({ input: { create: { width: w, height: h, channels: 3, background: color } }, left: x, top: y });

test('applyLogo: repaints the zone and composites the official wordmark in the declared color', async () => {
  const placements = await parseLogoUse('wordmark, left edge at x 48, vertically centered at y 1257, 220 px wide, ink #0F0F0F');
  // the generator drew "something" in the logo zone: it gets covered
  const img = await flat(TOKENS.violet, [rect(60, 1240, 150, 30, '#F0EEE9')]);
  const { buffer, surfaces } = await applyLogo(img, placements);
  assert.deepEqual(surfaces, ['violet']);
  assert.deepEqual(await checkImage(buffer), []);
  const { data } = await sharp(buffer).raw().toBuffer({ resolveWithObject: true });
  const at = (x, y) => [...data.subarray((y * 1080 + x) * 3, (y * 1080 + x) * 3 + 3)];
  const ink = (p) => p.every((v) => v < 40);
  let inkPx = 0;
  for (let y = 1231; y < 1284; y++) for (let x = 48; x < 268; x++) if (ink(at(x, y))) inkPx++;
  assert.ok(inkPx > 1500, `wordmark drawn (${inkPx} ink px)`);
  assert.ok(!ink(at(40, 1257)) && !ink(at(300, 1257)), 'nothing outside the box');
  const cream = at(205, 1255); // former cream junk is gone or covered
  assert.ok(!(cream[0] > 220 && cream[1] > 220 && cream[2] > 210));
});

test('applyLogo: a busy zone or a forbidden color combination is rejected (→ regenerate)', async () => {
  const wm = await parseLogoUse('wordmark, left edge at x 48, vertically centered at y 1257, 220 px wide, ink #0F0F0F');
  const busy = await flat(TOKENS.cream, [rect(0, 1190, 1080, 30, '#6B6AF4')]);
  await assert.rejects(applyLogo(busy, wm), /no es plana/);
  const creamOnLime = await parseLogoUse('wordmark, left edge at x 48, vertically centered at y 1257, 220 px wide, cream #F0EEE9');
  await assert.rejects(applyLogo(await flat(TOKENS.lime), creamOnLime), /no está permitido sobre lime/);
  await assert.rejects(applyLogo(await flat('#FF0000'), wm), /no es de la paleta/);
});

test('references: rendered from the tracked SVGs with the official ratio', async () => {
  const refs = await referencePngs('lab/brand/wordmark-ink.png + lab/brand/isotipo-ink-on-cream.png');
  assert.deepEqual(refs.map((r) => r.kind), ['wordmark', 'isotipo']);
  const [a, b] = await Promise.all(refs.map((r) => sharp(r.png).metadata()));
  assert.deepEqual([a.width, a.height, a.hasAlpha], [2048, 493, true]);
  assert.deepEqual([b.width, b.height], [1571, 2048]);
  assert.deepEqual(await referencePngs('ninguno'), []);
});

// ── Validation ────────────────────────────────────────────────────────────
test('text check: exact accents and punctuation; line breaks and labels tolerated', () => {
  const copy = ['Te escribieron. Nadie contestó.', 'SITIO · WHATSAPP · CRM'];
  assert.deepEqual(compareText(copy, ['Te escribieron.\nNadie contestó.', 'CRM', 'SITIO', 'WHATSAPP', 'verk']).missing, []);
  assert.deepEqual(compareText(copy, ['Te escribieron. Nadie contesto.', 'SITIO WHATSAPP CRM']).missing, ['Te escribieron. Nadie contestó.']);
  assert.deepEqual(compareText(copy, ['Te escribieron. Nadie contestó.', 'SITIO WHATSAPP CRM', 'Gratis']).extra, ['gratis']);
});

test('public URL check: HTML (login/viewer page with 200) is rejected, JPEG bytes accepted', async () => {
  const html = mockFetch(() => new Response('<!doctype html><title>Sign in</title>', { status: 200 }));
  assert.deepEqual(await verifyPublicUrl('https://u', { fetch: html, wait: noWait, attempts: 2 }), ['la URL pública no devuelve bytes JPEG']);
  const jpg = await flat(TOKENS.cream);
  const ok = mockFetch(() => new Response(jpg, { status: 200, headers: { 'Content-Type': 'application/octet-stream' } }));
  assert.deepEqual(await verifyPublicUrl('https://u', { fetch: ok, wait: noWait }), []);
});

// ── Slot run: idempotency and recovery ────────────────────────────────────
function fakeDrive(manifest) {
  const files = new Map(manifest ? [['M', structuredClone(manifest)]] : []);
  return {
    files,
    ensurePath: async () => 'F', folder: async (n) => `F/${n}`,
    findFile: async () => (files.has('M') ? 'M' : null),
    readJson: async (id) => structuredClone(files.get(id)),
    writeJson: async (id, d) => files.set(id, structuredClone(d)),
    upload: async (name, p, buf) => { if (name !== 'manifest.json') return `${p}/${name}`; files.set('M', JSON.parse(buf)); return 'M'; },
    recentManifests: async () => [],
    share: async () => 'P', unshare: async () => {},
  };
}
const boom = new Proxy({}, { get: () => () => { throw new Error('must not be called'); } });
const at = (iso) => () => new Date(iso);

test('duplicate prevention: a published slot does nothing (no generation, no Instagram)', async () => {
  const drive = fakeDrive({ status: 'published', key: '2026-11-10-0800' });
  const r = await runSlot({ slot: '0800', now: at('2026-11-10T13:20:00Z') }, { drive, ai: boom, ig: boom, models: {}, log: () => {} });
  assert.deepEqual(r, { status: 'skipped' });
});

test('interrupted publication is reconciled, never re-published', async () => {
  const m = { status: 'publishing', caption: 'C', errors: [], publication: { startedAt: '2026-11-10T14:00:00Z' } };
  const found = fakeDrive(m);
  const r = await runSlot({ slot: '0800', now: at('2026-11-10T14:05:00Z') }, { drive: found, ai: boom, ig: { findPublished: async () => 'MEDIA9' }, models: {}, log: () => {} });
  assert.deepEqual(r, { status: 'published', mediaId: 'MEDIA9' });
  assert.equal(found.files.get('M').status, 'published');

  const lost = fakeDrive(m);
  await assert.rejects(runSlot({ slot: '0800', now: at('2026-11-10T14:05:00Z') }, { drive: lost, ai: boom, ig: { findPublished: async () => null }, models: {}, log: () => {} }), /interrumpida/);
  assert.equal(lost.files.get('M').status, 'failed');
});

test('ready piece: shares, verifies, publishes at the slot and always removes public access', async () => {
  const jpg = await flat(TOKENS.cream);
  const drive = fakeDrive({ status: 'ready', type: 'individual', caption: 'C', errors: [], files: { final: ['F1'] } });
  const unshared = [];
  drive.unshare = async (id, p) => unshared.push([id, p]);
  const waits = [];
  const igCalls = [];
  const r = await runSlot({ slot: '0800', now: at('2026-11-10T13:30:00Z') }, {
    drive, ai: boom, models: {}, log: () => {}, wait: async (ms) => waits.push(ms),
    fetch: mockFetch(() => new Response(jpg)),
    ig: { publishSingle: async (o) => { igCalls.push(o); return { mediaId: 'M1', containerIds: ['C1'] }; } },
  });
  assert.equal(r.mediaId, 'M1');
  assert.deepEqual(waits, [30 * 60 * 1000]); // 13:30Z = 07:30 León → waits until 08:00
  assert.equal(igCalls[0].imageUrl, 'https://drive.usercontent.google.com/download?id=F1&export=download');
  assert.deepEqual(unshared, [['F1', 'P']]);
  assert.equal(drive.files.get('M').status, 'published');

  const failing = fakeDrive({ status: 'ready', type: 'individual', caption: 'C', errors: [], files: { final: ['F1'] } });
  const un2 = [];
  failing.unshare = async (id) => un2.push(id);
  await assert.rejects(runSlot({ slot: '0800', now: at('2026-11-10T15:00:00Z') }, {
    drive: failing, ai: boom, models: {}, log: () => {}, wait: noWait,
    fetch: mockFetch(() => new Response('<html>')), ig: boom,
  }), /no es un JPEG válido/);
  assert.deepEqual(un2, ['F1']);
  assert.equal(failing.files.get('M').status, 'ready'); // kept for a publish-only retry
});

test('dry run never shares or publishes', async () => {
  const drive = fakeDrive({ status: 'ready', type: 'individual', caption: 'C', errors: [], files: { final: ['F1'] } });
  drive.share = () => { throw new Error('must not share'); };
  assert.deepEqual(await runSlot({ slot: '1300', dryRun: true, now: at('2026-11-10T18:20:00Z') }, { drive, ai: boom, ig: boom, models: {}, log: () => {} }), { status: 'ready' });
});

test('local date and slot time use León time (UTC−6)', () => {
  assert.equal(localDate(new Date('2026-11-11T00:15:00Z')), '2026-11-10'); // 19:00 cron fires next UTC day
  assert.equal(slotTime('2026-11-10', '1900').toISOString(), '2026-11-11T01:00:00.000Z');
  assert.equal(slotTime('2026-07-01', '0800').toISOString(), '2026-07-01T14:00:00.000Z');
});

test('generation (dry run): library literal → image → official logo → text check, with one regeneration', async () => {
  const copyA = lib.parseIndividual(outA).copy;
  const prompts = [];
  let images = 0;
  const ai = {
    async respond({ step, text }) {
      prompts.push([step, text]);
      if (step === 'director') return { tema: 'Mensajes sin respuesta', objetivo: 'conversión', segmento: '' };
      if (step === '01') return outA;
      if (step.startsWith('texto')) return { blocks: [...lib.expectedTexts(copyA), 'verk'] };
      if (step.startsWith('identidad')) { assert.match(text, /## 8\. Control de calidad/); return { criterios: [{ criterio: 'Solo colores de la paleta', cumple: true, motivo: '' }] }; }
      throw new Error(step);
    },
    async generateImage({ prompt, references }) {
      assert.ok(prompt.startsWith('▶ ADJUNTAR AL GENERADOR: lab/brand/wordmark-ink.png'));
      assert.equal(references.length, 1);
      // 1st attempt: something crosses the logo zone → rejected; 2nd: clean surface
      const draw = images++ === 0 ? [rect(0, 1200, 1088, 40, '#0F0F0F')] : [];
      return sharp({ create: { width: 1088, height: 1360, channels: 3, background: TOKENS.violet } }).composite(draw).jpeg().toBuffer();
    },
  };
  const drive = fakeDrive(null);
  const r = await runSlot({ slot: '0800', dryRun: true, now: at('2026-11-10T13:20:00Z') }, { drive, ai, ig: boom, models: { image: 'i', text: 't', vision: 'v' }, log: () => {} });
  assert.deepEqual(r, { status: 'ready' });
  assert.equal(images, 2);
  const m = drive.files.get('M');
  assert.equal(m.status, 'ready');
  assert.equal(m.caption, lib.captionIndividual(copyA));
  assert.equal(m.files.final.length, 1);
  assert.ok(prompts.find(([s]) => s === '01')[1].includes('TEMA: Mensajes sin respuesta\n'));
});

// ── E3+: identity validation, verification, publish-ready, contact sheet ──
import { checkSurface, declaredSurface, dominantSurface } from './validate.mjs';
import { contactSheet } from './run.mjs';

test('instagram: account preflight; a failed post-publish verification never throws (no re-publish)', async () => {
  assert.deepEqual(await ig(graph()).account(), { id: 'IGU', username: 'verk.digital' });
  const wrongType = graph({ info: { id: 'MEDIA1', media_type: 'CAROUSEL_ALBUM', children: { data: [{ id: 'a' }, { id: 'b' }] } } });
  const r = await ig(wrongType).publishCarousel({ imageUrls: ['a', 'b', 'c'], caption: 'x' });
  assert.equal(r.mediaId, 'MEDIA1');
  assert.equal(r.verification.ok, false); // 2 children instead of 3
  const down = graph({ info: json(500, { error: { message: 'down' } }) });
  const r2 = await ig(down).publishSingle({ imageUrl: 'a', caption: 'x' });
  assert.equal(r2.mediaId, 'MEDIA1');
  assert.equal(r2.verification.ok, false);
  assert.equal(down.calls.filter((c) => c.url.endsWith('/media_publish')).length, 1);
});

test('02: contiguous slides with the same surface are rejected before any image is paid for', () => {
  const same = outMaster.replace('- SUPERFICIE: Ink #0F0F0F', '- SUPERFICIE: Cream #F0EEE9');
  assert.throws(() => lib.parseMaster(same), /slides 1 y 2 comparten superficie #F0EEE9/);
});

test('surface check: declared vs dominant token (cream ≠ cream-warm; near-blacks are one family; T8 skipped)', async () => {
  assert.equal(declaredSurface('violeta `#6B6AF4`.'), 'violet');
  assert.equal(declaredSurface('Cream-warm #E6E1D5'), 'cream-warm');
  assert.equal(declaredSurface('sin color'), null);
  const warm = await flat(TOKENS['cream-warm']);
  assert.equal((await dominantSurface(warm)).token, 'cream-warm');
  assert.deepEqual(await checkSurface(warm, { superficie: 'Cream-warm #E6E1D5' }), []);
  assert.match((await checkSurface(warm, { superficie: 'Cream #F0EEE9' }))[0], /cream-warm .* en vez de cream/);
  assert.deepEqual(await checkSurface(await flat('#0B0B0B'), { superficie: '#0B0B0B campo residual' }), []);
  assert.deepEqual(await checkSurface(await flat(TOKENS.ink), { superficie: 'Lime #BFEA00', territorio: 'T8 Antes intervenido' }), []);
});

test('contact sheet (04 §5): five slides in a row, unmodified order', async () => {
  const colors = ['cream', 'ink', 'violet', 'cream-warm', 'lime'].map((t) => TOKENS[t]);
  const sheet = await contactSheet(await Promise.all(colors.map((c) => flat(c))));
  const m = await sharp(sheet).metadata();
  assert.deepEqual([m.format, m.width, m.height], ['jpeg', 48 * 2 + 5 * 432 + 4 * 24, 540 + 96]);
  const { data } = await sharp(sheet).raw().toBuffer({ resolveWithObject: true });
  const mid = (i) => { const x = 48 + i * 456 + 216, y = 318, k = (y * m.width + x) * 3; return [data[k], data[k + 1], data[k + 2]]; };
  assert.ok(mid(1).every((v) => v < 40) && mid(4)[1] > 200 && mid(4)[2] < 60); // slide 2 ink, slide 5 lime
});

test('carousel generation: 02 → 03 literal, 5 slides with official logos, identity regeneration, contact sheet', async () => {
  const master = lib.parseMaster(outMaster);
  const surf = master.slides.map((s) => declaredSurface(s.superficie));
  let images = 0, identityCalls = 0;
  const steps = [];
  const ai = {
    async respond({ step, text }) {
      steps.push(step);
      if (step === 'director') return { tema: 'Herramientas desconectadas', objetivo: 'conversión', segmento: '' };
      if (step === '02') { assert.ok(text.includes('TEMA: Herramientas desconectadas\n') && text.includes('máximo 8): 5\n')); return outMaster; }
      if (step === '03') { assert.ok(text.includes('## A · ESTRATEGIA') && text.includes('REGLAS INVIOLABLES')); return outSeg; }
      const n = Number(step.split(' ')[1]);
      if (step.startsWith('texto')) return { blocks: lib.expectedTexts(master.slides[n - 1].copy) };
      if (step.startsWith('identidad')) {
        assert.match(text, /## 3\. Revisión de cada slide/);
        assert.ok(text.includes(`LOGO · USO: ${master.slides[n - 1].logoUse}`));
        const fail = n === 3 && identityCalls++ === 0; // slide 3 fails once → regenerated
        return { criterios: [{ criterio: 'Sin elementos prohibidos', cumple: !fail, motivo: fail ? 'aparece una persona' : '' }] };
      }
      throw new Error(step);
    },
    async generateImage({ prompt, references }) {
      images++;
      const n = Number(prompt.match(/· SLIDE (\d) \/ 5/)[1]);
      assert.equal(references.length, n === 5 ? 2 : 1); // slide 5 attaches wordmark + isotipo
      return sharp({ create: { width: 1088, height: 1360, channels: 3, background: TOKENS[surf[n - 1]] } }).jpeg().toBuffer();
    },
  };
  const drive = fakeDrive(null);
  const uploads = [];
  const up = drive.upload;
  drive.upload = async (name, p, buf, mime) => { uploads.push(name); return up(name, p, buf, mime); };
  const r = await runSlot({ slot: '1900', dryRun: true, now: at('2026-11-12T00:10:00Z') }, { drive, ai, ig: boom, models: { image: 'i', text: 't', vision: 'v' }, log: () => {} });
  assert.deepEqual(r, { status: 'ready' });
  assert.equal(images, 6);
  assert.deepEqual(steps.filter((s) => ['02', '03'].includes(s)), ['02', '03']); // one editorial execution
  const m = drive.files.get('M');
  assert.equal(m.files.final.length, 5);
  assert.ok(uploads.includes('hoja-de-contacto.jpg') && m.files.contactSheet);
  assert.equal(m.caption, 'Tienes las herramientas. No se hablan.\n\nSolicitar auditoría · POR WHATSAPP');
  assert.deepEqual(m.validation.rejections.map((x) => [x.image, x.attempt]), [[3, 1]]);
  assert.match(m.validation.rejections[0].reason, /identidad visual: Sin elementos prohibidos: aparece una persona/);
});

test('a malformed 02 answer stops the run: no retry, no images (one editorial execution)', async () => {
  let calls = 0;
  const ai = { async respond({ step }) { calls++; return step === 'director' ? { tema: 'x', objetivo: 'conversión', segmento: '' } : 'sin formato'; }, generateImage: () => { throw new Error('no'); } };
  const drive = fakeDrive(null);
  await assert.rejects(runSlot({ slot: '1900', dryRun: true, now: at('2026-11-12T00:10:00Z') }, { drive, ai, ig: boom, models: {}, log: () => {} }), /02: salida fuera de formato/);
  assert.equal(calls, 2);
  assert.equal(drive.files.get('M').status, 'failed');
});

test('publish-ready: only a «ready» piece of the given date, published now, never generated', async () => {
  for (const pre of [null, { status: 'generating', errors: [] }, { status: 'failed', errors: [] }]) {
    await assert.rejects(runSlot({ slot: '1900', publishOnly: true, date: '2026-11-11', now: at('2026-11-12T15:00:00Z') }, { drive: fakeDrive(pre), ai: boom, ig: boom, models: {}, log: () => {} }), /no hay una pieza «ready»/);
  }
  await assert.rejects(runSlot({ slot: '1900', publishOnly: true, date: '11/11/2026' }, { drive: fakeDrive(null), ai: boom, ig: boom, models: {}, log: () => {} }), /fecha inválida/);

  const jpg = await flat(TOKENS.cream);
  const drive = fakeDrive({ status: 'ready', type: 'carrusel', caption: 'C', errors: [], files: { final: ['F1', 'F2', 'F3', 'F4', 'F5'] } });
  const paths = [];
  const ens = drive.ensurePath; drive.ensurePath = async (p) => { paths.push(p); return ens(p); };
  const waits = [];
  const r = await runSlot({ slot: '1900', publishOnly: true, date: '2026-11-11', now: at('2026-11-12T15:00:00Z') }, {
    drive, ai: boom, models: {}, log: () => {}, wait: async (ms) => waits.push(ms), fetch: mockFetch(() => new Response(jpg)),
    ig: { publishCarousel: async ({ imageUrls }) => ({ mediaId: 'M5', containerIds: imageUrls.map((_, i) => `C${i}`), verification: { ok: true, permalink: 'https://www.instagram.com/p/TEST/' } }) },
  });
  assert.deepEqual(r, { status: 'published', mediaId: 'M5', verified: true, permalink: 'https://www.instagram.com/p/TEST/' });
  assert.deepEqual(paths[0], ['2026', '11', '2026-11-11', '1900-carrusel']);
  assert.deepEqual(waits.filter((ms) => ms > 60_000), []); // no waiting for the slot
  assert.equal(drive.files.get('M').publication.permalink, 'https://www.instagram.com/p/TEST/');
});

test('scheduled path: one run generates, waits for the exact slot, publishes and verifies', async () => {
  const copyA = lib.parseIndividual(outA).copy;
  const order = [];
  const ai = {
    async respond({ step }) {
      order.push(step);
      if (step === 'director') return { tema: 'Mensajes sin respuesta', objetivo: 'conversión', segmento: '' };
      if (step === '01') return outA;
      if (step.startsWith('texto')) return { blocks: lib.expectedTexts(copyA) };
      if (step.startsWith('identidad')) return { criterios: [{ criterio: 'ok', cumple: true, motivo: '' }] };
      throw new Error(step);
    },
    async generateImage() { order.push('imagen'); return sharp({ create: { width: 1088, height: 1360, channels: 3, background: TOKENS.violet } }).jpeg().toBuffer(); },
  };
  const drive = fakeDrive(null);
  const jpg = await flat(TOKENS.violet);
  const waits = [];
  const r = await runSlot({ slot: '0800', now: at('2026-11-12T12:35:00Z') }, { // cron 30 12 UTC, started 5 min late
    drive, ai, models: { image: 'i', text: 't', vision: 'v' }, log: () => {}, wait: async (ms) => { order.push('espera'); waits.push(ms); },
    fetch: mockFetch(() => new Response(jpg)),
    ig: { publishSingle: async ({ caption }) => { order.push('publica'); assert.equal(caption, lib.captionIndividual(copyA)); return { mediaId: 'M8', containerIds: ['C1'], verification: { ok: true, permalink: 'https://www.instagram.com/p/A/' } }; } },
  });
  assert.deepEqual(r, { status: 'published', mediaId: 'M8', verified: true, permalink: 'https://www.instagram.com/p/A/' });
  assert.deepEqual(order.slice(-2), ['espera', 'publica']);
  assert.ok(order.indexOf('imagen') < order.indexOf('publica'));
  assert.deepEqual(waits, [85 * 60 * 1000]); // 06:35 León → 08:00
  const m = drive.files.get('M');
  assert.equal(m.status, 'published');
  assert.ok(m.cost && Array.isArray(m.usage));
});

test('cron (UTC) → León slot on the same local date, 90 min ahead', () => {
  for (const [cron, slot] of [['2026-11-12T12:30:00Z', '0800'], ['2026-11-12T17:30:00Z', '1300'], ['2026-11-12T23:30:00Z', '1900']]) {
    const date = localDate(new Date(cron));
    assert.equal(date, '2026-11-12');
    assert.equal(slotTime(date, slot).getTime() - Date.parse(cron), 90 * 60 * 1000);
  }
});

test('backup trigger (--only-if-missing): any existing manifest → nothing; no manifest → normal run', async () => {
  for (const status of ['published', 'failed', 'generating', 'ready', 'publishing']) {
    const drive = fakeDrive({ status, key: '2026-11-12-1900', errors: [], caption: 'C', publication: { startedAt: '2026-11-12T01:00:00Z' } });
    const before = JSON.stringify(drive.files.get('M'));
    const r = await runSlot({ slot: '1900', onlyIfMissing: true, now: at('2026-11-13T00:05:00Z') }, { drive, ai: boom, ig: boom, models: {}, log: () => {} });
    assert.deepEqual(r, { status: 'skipped' }, status);
    assert.equal(JSON.stringify(drive.files.get('M')), before, `${status} untouched`);
  }
  // no manifest: the backup does the slot's normal work (here it reaches generation)
  await assert.rejects(runSlot({ slot: '1900', onlyIfMissing: true, now: at('2026-11-13T00:05:00Z') }, { drive: fakeDrive(null), ai: boom, ig: boom, models: {}, log: () => {} }), /must not be called/);
});

test('backup crons map to the same León date and slot, before the publication time', () => {
  for (const [cron, slot] of [['2026-11-12T13:00:00Z', '0800'], ['2026-11-12T18:00:00Z', '1300'], ['2026-11-13T00:00:00Z', '1900']]) {
    const date = localDate(new Date(cron));
    assert.equal(date, '2026-11-12', cron); // 00:00 UTC is still 18:00 of the previous day in León
    assert.equal(slotTime(date, slot).getTime() - Date.parse(cron), 60 * 60 * 1000);
  }
});

test('01 parser tolerates quote styles, Markdown and a two-line headline; content still required', () => {
  const canon = lib.parseIndividual(outA);
  const variant = outA
    .replace('- Titular: «Te escribieron. Nadie contestó.»', '- **Titular:** “Te escribieron.\nNadie contestó.”')
    .replace('- Etiqueta: «23:14 · MENSAJE SIN RESPUESTA»', '- `Etiqueta`: "23:14 · MENSAJE SIN RESPUESTA"');
  assert.notEqual(variant, outA);
  assert.deepEqual(lib.parseIndividual(variant).copy, canon.copy);
  assert.equal(lib.parseIndividual(variant).prompt, canon.prompt);
  assert.throws(() => lib.parseIndividual(outA.replace('- Titular: «Te escribieron. Nadie contestó.»', '- Titular: Te escribieron. Nadie contestó.')), /titular/);
});

test('02 parser tolerates separators, quotes, bullets, headings and a two-line headline; content still required', () => {
  const canon = lib.parseMaster(outMaster);
  const variant = outMaster
    .replace('### SLIDE 1 / 5', '## SLIDE 1/5')
    .replace('- COPY · TITULAR: «Tienes las herramientas. No se hablan.»', '* **COPY — TITULAR:** «Tienes las herramientas.\nNo se hablan.»')
    .replace('- COPY · ETIQUETA: «02 / 05 · LO QUE SE PIERDE»', '- COPY - ETIQUETA: “02 / 05 · LO QUE SE PIERDE”')
    .replace('- COPY · CTA: «Solicitar auditoría»', '- `COPY: CTA`: "Solicitar auditoría"');
  assert.notEqual(variant, outMaster);
  const v = lib.parseMaster(variant);
  assert.deepEqual(v.slides.map((s) => s.copy), canon.slides.map((s) => s.copy));
  assert.deepEqual([v.hook, v.cta, v.total], [canon.hook, canon.cta, canon.total]);
  assert.equal(lib.parseSegmented(outSeg, v).length, 5); // 03 literal check still passes (whitespace-insensitive)
  assert.throws(() => lib.parseMaster(outMaster.replace('- COPY · TITULAR: «Tienes las herramientas. No se hablan.»', '- COPY · TITULAR: Tienes las herramientas. No se hablan.')), /SLIDE 1 sin COPY · titular válido/);
  assert.throws(() => lib.parseMaster(outMaster.replace('- COPY · TITULAR: «Tienes las herramientas. No se hablan.»', '')), /SLIDE 1/);
});

test('a failed editorial step keeps the model answer in the manifest; a fixed objective constrains the director', async () => {
  const schemas = [];
  const ai = {
    async respond({ step, schema }) {
      if (step === 'director') { schemas.push(schema); this.onUsage({ step, costUsd: 0.01 }); return { tema: 'x', objetivo: 'reconocimiento del problema', segmento: '' }; }
      this.onUsage({ step, costUsd: 0.07 });
      return '# CARRUSEL VERK — x\n(respuesta incompleta)';
    },
  };
  const drive = fakeDrive({ status: 'failed', key: '2026-11-11-1900', createdAt: '2026-11-12T01:42:30Z', errors: [{ step: 'generate', message: '02: salida fuera de formato' }], usage: [{ costUsd: 0.0828 }], cost: { usd: 0.0828 } });
  await assert.rejects(runSlot({ slot: '1900', date: '2026-11-11', objetivo: 'reconocimiento del problema', now: at('2026-11-12T02:30:00Z'), waitForSlot: false }, { drive, ai, ig: boom, models: { image: 'i', text: 't', vision: 'v' }, log: () => {} }), /02: salida fuera de formato/);
  assert.deepEqual(schemas[0].properties.objetivo.enum, ['reconocimiento del problema']);
  const m = drive.files.get('M');
  assert.equal(m.key, '2026-11-11-1900');
  assert.equal(m.errors.at(-1).detail.raw, '# CARRUSEL VERK — x\n(respuesta incompleta)');
  assert.match(m.errors.at(-1).detail.message, /^02:/);
  assert.equal(m.attempts.length, 1);
  assert.equal(m.attempts[0].cost.usd, 0.0828);
  assert.deepEqual([m.cost.usd, m.cost.slotUsd], [0.08, 0.1628]);
});
