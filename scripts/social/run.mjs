#!/usr/bin/env node
// VERK Instagram publisher. One run = one slot of one local day (America/Mexico_City).
//   node scripts/social/run.mjs --slot 0800|1300|1900 [--dry-run] [--now]
//   node scripts/social/run.mjs --slot 0800|1300|1900 --publish-ready --date AAAA-MM-DD
//   node scripts/social/run.mjs --slot … --only-if-missing   (backup trigger: acts only if the slot has no manifest yet)
//   node scripts/social/run.mjs --check   (free preflights only: Instagram account, OpenAI models, Drive)
// --dry-run: generates, validates and stores in Drive; never shares files or publishes.
// --publish-ready: publishes a piece already «ready» in Drive, now; never generates. It is the manual,
//   human-confirmed path (workflow social-publish-ready) and works with SOCIAL_ENABLED=false.
// Otherwise (scheduled path), nothing at all happens unless SOCIAL_ENABLED=true.
// Logs are public (public repo): only ids, states and counts. Details go to the Drive manifest.
import { parseArgs } from 'node:util';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { sleep } from './http.mjs';
import { createInstagram } from './instagram.mjs';
import { createDrive, publicUrl } from './drive.mjs';
import { createOpenAI, PRICES_DATE } from './openai.mjs';
import * as lib from './library.mjs';
import { parseLogoUse, referencePngs, checkLogo, attachedKinds } from './logo.mjs';
import { checkCopy, checkCaption, checkImage, checkSurface, compareText, prepareForInstagram, verifyPublicUrl } from './validate.mjs';

export const OBJETIVOS = ['conversión', 'reconocimiento del problema', 'posicionamiento', 'educativa'];
export const SLOTS = { '0800': 'individual', '1300': 'individual', '1900': 'carrusel' };
const TZ = 'America/Mexico_City';
const OFFSET = '-06:00'; // ponytail: Mexico has no DST since 2022; derive from tzdata if that changes.
const IMAGE_ATTEMPTS = 3; // 1 generation + 2 regenerations
const TEXT_ATTEMPTS = 1;
const MAX_PIECE_USD = Number(process.env.MAX_PIECE_USD || 5); // per run: stop before more spending once exceeded // one editorial execution per piece: a malformed 01/02/03 answer stops the run

export const localDate = (now) => new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
export const slotTime = (date, slot) => new Date(`${date}T${slot.slice(0, 2)}:${slot.slice(2)}:00${OFFSET}`);

class PieceError extends Error {
  constructor(message, detail) { super(message); this.detail = detail; }
}

// ── Generation ────────────────────────────────────────────────────────────
async function direct({ ai, models, type, history, objetivo }) {
  const [ctx, copyRules] = await Promise.all([lib.readDoc('00-VERK-MASTER-CONTEXT.md'), lib.readDoc('05-ADVERTISING-COPY-GUIDELINES.md')]);
  const recent = history.map((h) => h.director?.tema).filter(Boolean).slice(0, 12);
  return ai.respond({
    step: 'director', model: models.text, effort: 'low',
    schema: {
      type: 'object', additionalProperties: false, required: ['tema', 'objetivo', 'segmento'],
      properties: {
        tema: { type: 'string' },
        objetivo: { type: 'string', enum: objetivo ? [objetivo] : OBJETIVOS },
        segmento: { type: 'string' },
      },
    },
    text: `Eres el director de contenido de VERK. Elige el TEMA de la próxima pieza (${type === 'carrusel' ? 'carrusel' : 'imagen individual'}) para Instagram.
Reglas: un tema concreto tomado de los problemas reales y del banco de situaciones de las guías; distinto de los temas recientes; sin cifras, clientes ni resultados inventados. OBJETIVO: ${objetivo ? `«${objetivo}» (fijado)` : 'uno de los cuatro'}. SEGMENTO: vacío salvo que el tema pida un sector concreto.
Temas recientes (no repetir): ${recent.length ? recent.join(' | ') : 'ninguno'}

=== CONTEXTO (00) ===
${ctx}

=== GUÍA DE COPY (05) ===
${copyRules}`,
  });
}

function historial(history) {
  const items = history.flatMap((h) => h.library?.visual ?? []).slice(0, 6);
  return items.length ? `Últimas piezas: ${items.join(', ')}` : '';
}

/** Runs one library prompt literally and parses it; a malformed answer is re-run once. */
async function textStep(ai, model, step, prompt, parse) {
  let last;
  for (let i = 0; i < TEXT_ATTEMPTS; i++) {
    const raw = await ai.respond({ step, model, text: prompt });
    try { return { raw, parsed: parse(raw) }; } catch (e) { last = { message: e.message, raw }; }
  }
  // The model's original answer goes to the manifest (Drive), never to the public log.
  throw new PieceError(`${step}: salida fuera de formato`, last);
}

function copyGate(copies, caption) {
  const problems = [...checkCopy(copies.flatMap(lib.expectedTexts)), ...checkCaption(caption)];
  if (problems.length) throw new PieceError('copy o caption no válidos', problems);
}

/**
 * DIAGNOSTIC ONLY (never blocks, never triggers a regeneration): a vision model notes, with the library's own
 * checklists verbatim (06 §8; 04 §3 for carousel slides), what it observes. The prompts are the creative authority;
 * these notes are stored in the manifest for analysis. Returns the criteria it marked as not met.
 */
async function reviewIdentity({ ai, models, image, references, piece, carousel, step, logoMeasure }) {
  const lists = [await lib.docSection('06-VISUAL-IDENTITY-GUIDELINES.md', '8. Control de calidad')];
  if (carousel) lists.push(await lib.docSection('04-CAROUSEL-ASSEMBLY-INSTRUCTIONS.md', '3. Revisión de cada slide'));
  const r = await ai.respond({
    step, model: models.vision, image, references,
    schema: {
      type: 'object', additionalProperties: false, required: ['criterios'],
      properties: { criterios: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['criterio', 'cumple', 'motivo'], properties: { criterio: { type: 'string' }, cumple: { type: 'boolean' }, motivo: { type: 'string' } } } } },
    },
    text: `Eres el control de calidad visual de VERK. Evalúa esta imagen con las listas de abajo, copiadas de la biblioteca de VERK, frente a lo declarado para esta pieza. Devuelve un criterio por cada punto de las listas.
La primera imagen es la pieza. ${references.length ? `Las ${references.length === 1 ? 'siguiente es la referencia oficial' : `${references.length} siguientes son las referencias oficiales`} del logo que recibió el generador (su fondo no forma parte del logo; el color puede cambiar al token indicado en LOGO · USO).` : 'Esta pieza no lleva logo: no debe aparecer ningún logo ni símbolo inventado.'}
No evalúes el copy ni la ortografía: se verifican aparte. No exijas precisión de píxeles: la posición y la escala del logo se midieron en código${logoMeasure ? ` (${logoMeasure})` : ''} y pequeñas diferencias respecto de las coordenadas declaradas son normales. Las «3 barras a 45°» describen solo el isotipo: no las busques en el wordmark.
Marca un criterio como no cumplido solo si la infracción es clara y visible; ante la duda, márcalo como cumplido y explica la duda en el motivo.

DECLARADO PARA ESTA PIEZA
Superficie: ${piece.superficie ?? 'no especificada'}
Territorio: ${piece.territorio ?? 'no especificado'}
LOGO · USO: ${piece.logoUse}

${lists.join('\n\n')}`,
  });
  return r.criterios.filter((c) => !c.cumple).map((c) => `${c.criterio}: ${c.motivo}`);
}

/** 04 §5 «Hoja de contacto»: the slides in a row, unmodified, for the final review. */
export async function contactSheet(finals) {
  const w = 432, h = 540, gap = 24, pad = 48;
  const tiles = await Promise.all(finals.map((f) => sharp(f).resize(w, h).toBuffer()));
  return sharp({ create: { width: pad * 2 + tiles.length * w + (tiles.length - 1) * gap, height: pad * 2 + h, channels: 3, background: '#E6E1D5' } })
    .composite(tiles.map((input, i) => ({ input, left: pad + i * (w + gap), top: pad })))
    .jpeg({ quality: 90 }).toBuffer();
}

/** Non-blocking observations stored in the manifest: logo measurement, surface, vision notes. Never rejects. */
async function diagnose({ ai, models, buffer, refs, pc, carousel, i }) {
  const soft = (e) => { if (e instanceof PieceError) throw e; return { error: e.message }; };
  const logo = pc.placements ? await checkLogo(buffer, pc.placements).catch(soft) : { note: pc.logoUseNote };
  const surface = await checkSurface(buffer, pc).catch(soft);
  const m = logo.found?.map((f) => `${f.kind}: coincidencia ${f.iou}${f.x != null ? `, caja x ${f.x} y ${f.y} ${f.w}×${f.h}` : ''}`).join('; ');
  const vision = await reviewIdentity({ ai, models, image: buffer, references: refs, piece: pc, carousel, step: `identidad ${i + 1}`, logoMeasure: m }).catch(soft);
  return { logo, logoUseNote: pc.logoUseNote ?? null, surface, vision };
}

export async function generate({ ai, models, type, history, log, objetivo, onLibrary = async () => {}, onReject = async () => {} }) {
  const dir = await direct({ ai, models, type, history, objetivo });
  log(`director: objetivo=${dir.objetivo}`);
  const vars = { TEMA: dir.tema, OBJETIVO: dir.objetivo, SEGMENTO: dir.segmento };
  let pieces, caption, raw, visual;

  if (type === 'individual') {
    const prompt = lib.fill(await lib.loadPrompt('01-INDIVIDUAL-IMAGE-MASTER-PROMPT.md'), { ...vars, HISTORIAL: historial(history) });
    const r = await textStep(ai, models.text, '01', prompt, (t) => {
      const p = lib.parseIndividual(t);
      copyGate([p.copy], lib.captionIndividual(p.copy));
      return p;
    });
    const p = r.parsed;
    pieces = [{ prompt: p.prompt, attach: p.attach, logoUse: p.logoUse, copy: p.copy, territorio: p.territorio, superficie: p.superficie }];
    caption = lib.captionIndividual(p.copy);
    raw = { '01': r.raw };
    visual = [`${p.territorio ?? '?'} ${p.superficie ?? '?'}`];
  } else {
    const prompt02 = lib.fill(await lib.loadPrompt('02-CAROUSEL-MASTER-PROMPT.md'), { ...vars, 'NÚMERO DE SLIDES': '5' });
    const m = await textStep(ai, models.text, '02', prompt02, (t) => {
      const master = lib.parseMaster(t);
      copyGate(master.slides.map((s) => s.copy), lib.captionCarousel(master));
      return master;
    });
    const prompt03 = lib.fillMaster(await lib.loadPrompt('03-CAROUSEL-PROMPT-SEGMENTER.md'), m.raw);
    const s = await textStep(ai, models.text, '03', prompt03, (t) => lib.parseSegmented(t, m.parsed));
    pieces = m.parsed.slides.map((sl, i) => ({ prompt: s.parsed[i], attach: sl.attach, logoUse: sl.logoUse, copy: sl.copy, territorio: sl.territorio, superficie: sl.superficie }));
    caption = lib.captionCarousel(m.parsed);
    raw = { '02': m.raw, '03': s.raw };
    visual = m.parsed.slides.map((sl) => `${sl.territorio ?? '?'} ${sl.superficie ?? '?'}`);
  }

  // Diagnostics: the library outputs and the final prompts are stored before any image is paid for.
  await onLibrary({ raw, visual, prompts: pieces.map((p) => p.prompt), logoUse: pieces.map((p) => p.logoUse), attach: pieces.map((p) => p.attach) });

  // The official files named by ▶ ADJUNTAR must exist (objective: the generator cannot get a missing reference).
  // LOGO · USO is only measured afterwards, for diagnostics.
  for (const pc of pieces) {
    try { pc.references = await referencePngs(pc.attach); } catch (e) { throw new PieceError('referencias de logo no válidas', e.message); }
    try {
      pc.placements = await parseLogoUse(pc.logoUse);
      const kinds = attachedKinds(pc.attach);
      pc.logoUseNote = pc.placements.some((pl) => !kinds.has(pl.kind)) ? 'LOGO · USO nombra un logo que no se adjunta' : null;
    } catch (e) { pc.placements = null; pc.logoUseNote = e.message; }
  }

  const images = [], rejections = [];
  for (const [i, pc] of pieces.entries()) {
    const refs = pc.references.map((r) => r.png);
    let last;
    for (let a = 0; a < IMAGE_ATTEMPTS; a++) {
      const step = `imagen ${i + 1}/${pieces.length} intento ${a + 1}`;
      const original = await ai.generateImage({ step, model: models.image, prompt: pc.prompt, references: refs });
      let buffer;
      try {
        // Blocking, objective checks only: readable 4:5 file → 1080×1350 JPEG ≤ 8 MB, and the approved copy in the image.
        ({ buffer } = await prepareForInstagram(original)); // the generator's design, unaltered (no crop, no composite)
        const tech = await checkImage(buffer);
        if (tech.length) throw new Error(tech.join('; '));
        const { blocks } = await ai.respond({
          step: `texto ${i + 1}`, model: models.vision, image: buffer,
          schema: { type: 'object', additionalProperties: false, required: ['blocks'], properties: { blocks: { type: 'array', items: { type: 'string' } } } },
          text: 'Transcribe exactly every text visible in this image, one entry per text block (headline, paragraph, label, button), in reading order. Keep accents, capitalization and punctuation exactly as rendered; do not correct anything. Do not transcribe logos or the brand wordmark.',
        });
        const { missing, extra } = compareText(lib.expectedTexts(pc.copy), blocks);
        if (missing.length) throw new Error(`texto distinto del copy: ${missing.join(' | ')}`);
        images.push({ original, final: buffer, extraWords: extra, diagnostics: await diagnose({ ai, models, buffer, refs, pc, carousel: type === 'carrusel', i }) });
        log(`imagen ${i + 1}/${pieces.length} válida (intento ${a + 1})`);
        last = null;
        break;
      } catch (e) {
        if (e instanceof PieceError) throw e; // spending limit: stop the run, it is not a rejection
        last = e;
        rejections.push({ image: i + 1, attempt: a + 1, reason: e.message });
        await onReject(`${String(i + 1).padStart(2, '0')}-intento-${a + 1}`, original, buffer);
        log(`imagen ${i + 1}/${pieces.length} inválida (intento ${a + 1})`);
      }
    }
    if (last) throw new PieceError(`imagen ${i + 1} sin versión válida tras ${IMAGE_ATTEMPTS} intentos`, rejections);
  }

  return {
    director: dir,
    library: { raw, visual, prompts: pieces.map((p) => p.prompt), logoUse: pieces.map((p) => p.logoUse), attach: pieces.map((p) => p.attach), references: pieces.map((p) => p.references.map((r) => r.file)) },
    copy: pieces.map((p) => p.copy),
    caption,
    images,
    rejections,
  };
}

// ── Slot run ─────────────────────────────────────────────────────────────
export async function runSlot({ slot, dryRun = false, publishOnly = false, onlyIfMissing = false, objetivo, date: forcedDate, now = () => new Date(), waitForSlot = true }, { drive, ai, ig, models, log = console.log, wait = sleep, fetch = globalThis.fetch }) {
  const type = SLOTS[slot];
  if (!type) throw new Error(`slot inválido: ${slot}`);
  if (forcedDate && !/^\d{4}-\d{2}-\d{2}$/.test(forcedDate)) throw new Error(`fecha inválida: ${forcedDate}`);
  const date = forcedDate ?? localDate(now());
  const [y, mo] = date.split('-');
  const folderId = await drive.ensurePath([y, mo, date, `${slot}-${type}`]);
  let manifestId = await drive.findFile('manifest.json', folderId);
  let manifest = manifestId ? await drive.readJson(manifestId) : null;
  const save = async () => {
    manifest.updatedAt = now().toISOString();
    if (manifestId) await drive.writeJson(manifestId, manifest);
    else manifestId = await drive.upload('manifest.json', folderId, Buffer.from(JSON.stringify(manifest, null, 2)), 'application/json');
  };
  log(`slot ${date} ${slot} (${type}) · estado previo: ${manifest?.status ?? 'ninguno'}`);

  // Backup trigger: any manifest (published, failed, generating, ready, publishing) means the primary run
  // already took this slot → never a second piece, never a retry of a failed one.
  if (onlyIfMissing && manifest) { log('respaldo: el horario ya tiene manifest; no se hace nada'); return { status: 'skipped' }; }

  if (manifest?.status === 'published') { log('ya publicado: no se hace nada'); return { status: 'skipped' }; }

  if (manifest?.status === 'publishing') {
    if (dryRun) { log('publicación previa sin cerrar: dry-run no la toca'); return { status: 'skipped' }; }
    // A previous run died after it may have called media_publish: reconcile, never re-publish.
    const id = await ig.findPublished(manifest.caption, Date.parse(manifest.publication.startedAt));
    if (id) {
      Object.assign(manifest, { status: 'published', publication: { ...manifest.publication, mediaId: id, publishedAt: now().toISOString(), reconciled: true } });
      await save();
      log('publicación previa confirmada por conciliación');
      return { status: 'published', mediaId: id };
    }
    manifest.status = 'failed';
    manifest.errors.push({ at: now().toISOString(), step: 'publish', message: 'publicación interrumpida sin confirmar; no se reintenta para no duplicar' });
    await save();
    throw new Error('publicación previa interrumpida y sin confirmar');
  }

  if (publishOnly && manifest?.status !== 'ready') {
    throw new Error(`no hay una pieza «ready» para ${date} ${slot} (estado: ${manifest?.status ?? 'ninguno'}); publish-ready nunca genera`);
  }

  if (manifest?.status !== 'ready') {
    // A new attempt on the same slot (e.g. after a failed one) keeps the history of the previous attempts.
    const attempts = manifest ? [...(manifest.attempts ?? []), {
      createdAt: manifest.createdAt ?? null, status: manifest.status ?? null, director: manifest.director ?? null,
      usage: manifest.usage ?? [], cost: manifest.cost ?? null,
    }] : [];
    manifest = {
      version: 1, key: `${date}-${slot}`, date, slot, type, status: 'generating', dryRun,
      createdAt: now().toISOString(), models, errors: manifest?.errors ?? [], usage: [], attempts,
    };
    await save();
    const usage = manifest.usage;
    ai.onUsage = (u) => {
      usage.push(u);
      const spent = usage.reduce((a, x) => a + (x.costUsd ?? 0), 0);
      if (spent > MAX_PIECE_USD) throw new PieceError(`límite de gasto por pieza superado (${spent.toFixed(2)} > ${MAX_PIECE_USD} USD)`);
    };
    let rejectDir;
    const onReject = async (name, original, final) => {
      rejectDir ??= await drive.folder('rechazos', folderId);
      await drive.upload(`${name}-original.jpg`, rejectDir, original, 'image/jpeg');
      if (final) await drive.upload(`${name}.jpg`, rejectDir, final, 'image/jpeg');
    };
    const onLibrary = async (library) => { manifest.library = library; await save(); };
    try {
      const history = (await drive.recentManifests(12)).filter((m) => m.key !== manifest.key);
      const g = await generate({ ai, models, type, history, log, objetivo, onLibrary, onReject });
      const sub = async (name) => drive.folder(name, folderId);
      const [origDir, finalDir] = [await sub('original'), await sub('final')];
      const files = { original: [], final: [] };
      for (const [i, im] of g.images.entries()) {
        const n = String(i + 1).padStart(2, '0');
        files.original.push(await drive.upload(`${n}-original.jpg`, origDir, im.original, 'image/jpeg'));
        files.final.push(await drive.upload(`${n}.jpg`, finalDir, im.final, 'image/jpeg'));
      }
      if (type === 'carrusel') files.contactSheet = await drive.upload('hoja-de-contacto.jpg', folderId, await contactSheet(g.images.map((im) => im.final)), 'image/jpeg');
      Object.assign(manifest, {
        status: 'ready', director: g.director, library: g.library, copy: g.copy, caption: g.caption, files,
        validation: { extraWords: g.images.map((im) => im.extraWords), diagnostics: g.images.map((im) => im.diagnostics), rejections: g.rejections },
      });
    } catch (e) {
      manifest.status = 'failed';
      manifest.errors.push({ at: now().toISOString(), step: 'generate', message: e.message, detail: e.detail ?? null });
      throw e;
    } finally {
      const costs = manifest.usage.map((u) => u.costUsd);
      const usd = costs.every((c) => c != null) ? Number(costs.reduce((a, b) => a + b, 0).toFixed(4)) : null;
      const prev = manifest.attempts.map((a) => a.cost?.usd);
      const slotUsd = usd != null && prev.every((c) => c != null) ? Number((usd + prev.reduce((a, b) => a + b, 0)).toFixed(4)) : null;
      manifest.cost = { usd, slotUsd, prices: PRICES_DATE };
      await save();
      log(`consumo: ${manifest.usage.length} llamadas, ${manifest.cost.usd ?? 'n/d'} USD (horario, todos los intentos: ${manifest.cost.slotUsd ?? 'n/d'} USD)`);
    }
  }

  if (dryRun) { log('dry-run: pieza lista en Drive, no se publica'); return { status: 'ready' }; }

  const target = slotTime(date, slot).getTime();
  if (waitForSlot && !publishOnly && now().getTime() < target) {
    log(`esperando a las ${slot.slice(0, 2)}:${slot.slice(2)} locales`);
    await wait(target - now().getTime());
  }

  // Sequence integrity (objective): every image of the piece exists, in order, before anything is shared.
  const expected = manifest.type === 'carrusel' ? (manifest.copy?.length ?? 0) : 1;
  const finals = manifest.files?.final ?? [];
  if (!finals.length || finals.length !== expected || finals.some((id) => !id) || (manifest.type === 'carrusel' && (expected < 2 || expected > 10))) {
    throw new Error(`secuencia incompleta: ${finals.length} imágenes para ${expected} esperadas; no se publica`);
  }

  manifest.status = 'publishing';
  manifest.publication = { startedAt: now().toISOString() };
  await save();
  const shared = [];
  try {
    for (const id of manifest.files.final) shared.push([id, await drive.share(id)]);
    const urls = manifest.files.final.map(publicUrl);
    for (const u of urls) {
      const problems = await verifyPublicUrl(u, { fetch, wait });
      if (problems.length) throw new PieceError('la URL pública no es un JPEG válido', problems);
    }
    const startedAt = Date.parse(manifest.publication.startedAt);
    const r = manifest.type === 'carrusel'
      ? await ig.publishCarousel({ imageUrls: urls, caption: manifest.caption, startedAt })
      : await ig.publishSingle({ imageUrl: urls[0], caption: manifest.caption, startedAt });
    Object.assign(manifest.publication, {
      mediaId: r.mediaId, containerIds: r.containerIds, publishedAt: now().toISOString(),
      permalink: r.verification?.permalink ?? null, verification: r.verification ?? null,
    });
    manifest.status = 'published';
    log(`publicado: media ${r.mediaId} · verificación ${r.verification?.ok ? 'ok' : 'NO superada'}`);
    return { status: 'published', mediaId: r.mediaId, verified: Boolean(r.verification?.ok), permalink: r.verification?.permalink ?? null };
  } catch (e) {
    // Not published. Unconfirmed → next run reconciles; otherwise files stay and a manual
    // re-run retries only the publication (no new generation cost).
    manifest.status = e.code === 'UNCONFIRMED' ? 'publishing' : 'ready';
    manifest.errors.push({ at: now().toISOString(), step: 'publish', message: e.message, detail: e.detail ?? null });
    throw e;
  } finally {
    for (const [id, perm] of shared) await drive.unshare(id, perm).catch(() => log(`no se pudo retirar el permiso público de ${id}`));
    await save();
  }
}

// ── CLI ──────────────────────────────────────────────────────────────────
async function main() {
  const { values } = parseArgs({ options: { slot: { type: 'string' }, 'dry-run': { type: 'boolean' }, now: { type: 'boolean' }, 'publish-ready': { type: 'boolean' }, date: { type: 'string' }, check: { type: 'boolean' }, 'only-if-missing': { type: 'boolean' }, objetivo: { type: 'string' } } });
  const env = process.env;
  const check = Boolean(values.check);
  const dryRun = Boolean(values['dry-run']);
  const publishOnly = Boolean(values['publish-ready']);
  if (!check && !SLOTS[values.slot]) throw new Error('uso: run.mjs --slot 0800|1300|1900 [--dry-run] [--now] | --publish-ready --date AAAA-MM-DD');
  if (values.objetivo && !OBJETIVOS.includes(values.objetivo)) throw new Error(`objetivo inválido: ${values.objetivo}`);
  if (publishOnly && (dryRun || !values.date)) throw new Error('--publish-ready exige --date y no admite --dry-run');
  if (!check && !publishOnly && !dryRun && env.SOCIAL_ENABLED !== 'true') { console.log('SOCIAL_ENABLED no es «true»: no se genera ni se publica nada.'); return; }

  // Free preflights first (Meta, then OpenAI models): nothing paid runs against the wrong account or a missing model.
  const ig = createInstagram({
    token: env.INSTAGRAM_ACCESS_TOKEN, userId: env.INSTAGRAM_USER_ID, version: env.META_GRAPH_API_VERSION || 'v26.0', log: console.log,
  });
  const account = await ig.account();
  if (env.INSTAGRAM_USERNAME && account.username !== env.INSTAGRAM_USERNAME) throw new Error(`la cuenta de Instagram es @${account.username}, no @${env.INSTAGRAM_USERNAME}`);
  console.log(`instagram: @${account.username}`);

  const models = { image: env.IMAGE_MODEL, text: env.TEXT_MODEL, vision: env.VISION_MODEL };
  let ai = null;
  if (!publishOnly) {
    if (!models.image || !models.text || !models.vision) throw new Error('faltan IMAGE_MODEL, TEXT_MODEL o VISION_MODEL');
    ai = createOpenAI({ apiKey: env.OPENAI_API_KEY, onUsage: (u) => ai.onUsage?.(u) });
    await ai.preflight([...new Set(Object.values(models))]);
  }
  const drive = createDrive({
    clientId: env.GOOGLE_OAUTH_CLIENT_ID, clientSecret: env.GOOGLE_OAUTH_CLIENT_SECRET,
    refreshToken: env.GOOGLE_OAUTH_REFRESH_TOKEN, rootId: env.DRIVE_ROOT_FOLDER_ID || undefined,
  });
  if (check) {
    await drive.ensurePath([]);
    console.log(`openai: modelos disponibles (${[...new Set(Object.values(models))].join(', ')})\ndrive: conexión y carpeta raíz correctas\ncheck: todo correcto (SOCIAL_ENABLED=${env.SOCIAL_ENABLED === 'true' ? 'true' : 'false'})`);
    return;
  }
  const r = await runSlot({ slot: values.slot, dryRun, publishOnly, onlyIfMissing: Boolean(values['only-if-missing']), objetivo: values.objetivo || undefined, date: values.date || undefined, waitForSlot: !values.now }, { drive, ai, ig, models });
  if (r.status === 'published' && r.verified === false) {
    console.error('aviso: publicado, pero la verificación posterior no se superó; revisa el manifest. No se republica.');
    process.exitCode = 1;
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => { console.error(`error: ${e.message}`); process.exitCode = 1; });
}
