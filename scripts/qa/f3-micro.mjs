// QA de microinteracciones (dev-only). Requiere `npx astro preview --port 4322`. Salida: qa-artifacts/f3-integration/shots/micro-*
import { createRequire } from 'node:module'; import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const B = process.env.BASE_URL ?? 'http://127.0.0.1:4322', D = 'qa-artifacts/f3-integration'; mkdirSync(`${D}/shots`, { recursive: true });
const b = await chromium.launch({ channel: 'chrome' }); const out = {};
// escritorio
{ const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(B + '/', { waitUntil: 'networkidle' });
  await p.hover('.nav-links a[href="#metodo"]'); await p.waitForTimeout(260); await p.screenshot({ path: `${D}/shots/micro-nav-hover-1440.png`, clip: { x: 400, y: 0, width: 640, height: 80 } });
  await p.locator('#servicios .svc').nth(1).scrollIntoViewIfNeeded(); await p.hover('#servicios .svc:nth-child(2)'); await p.waitForTimeout(450);
  out.servicios = await p.evaluate(() => { const s = document.querySelector('#servicios .svc:nth-child(2)'); return { linea: getComputedStyle(s, '::after').transform, barra: getComputedStyle(s.querySelector('.svc-bar')).opacity }; });
  await p.screenshot({ path: `${D}/shots/micro-servicios-hover-1440.png` });
  const met = [];
  for (const k of [.1, .35, .6]) { await p.evaluate((k) => { const m = document.getElementById('metodo'); scrollTo(0, m.offsetTop - innerHeight + m.offsetHeight * k + 300); }, k); await p.waitForTimeout(250);
    met.push(await p.evaluate(() => [...document.querySelectorAll('.step')].map((s) => getComputedStyle(s, '::after').transform))); await p.screenshot({ path: `${D}/shots/micro-metodo-${k}-1440.png` }); }
  out.metodoRutaScroll = met;
  await p.evaluate(() => document.getElementById('sistemas').scrollIntoView()); await p.waitForTimeout(200);
  await p.hover('[data-open="SIS-07"]'); await p.waitForTimeout(500); await p.screenshot({ path: `${D}/shots/micro-sistemas-hover-1440.png` });
  out.sistemasVisor = await p.evaluate(() => document.querySelector('.ix-card:not([hidden])').dataset.id);
  await p.evaluate(() => document.getElementById('contacto').scrollIntoView()); await p.waitForTimeout(400);
  const m = await p.evaluate(() => { const r = document.querySelector('.c-mark').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2, r.width]; });
  const before = await p.evaluate(() => [...document.querySelectorAll('.c-mark path')].map((e) => e.style.transform));
  await p.mouse.move(m[0] - m[2] * 1.4, m[1]); await p.mouse.move(m[0] - m[2] * .1, m[1] + 30, { steps: 25 }); await p.waitForTimeout(300);
  out.contactoIsotipo = { antes: before, cerca: await p.evaluate(() => [...document.querySelectorAll('.c-mark path')].map((e) => e.style.transform)) };
  await p.screenshot({ path: `${D}/shots/micro-contacto-cursor-1440.png` });
  await p.mouse.move(20, 20, { steps: 10 }); await p.waitForTimeout(2500);
  out.contactoTrasRetirar = await p.evaluate(() => [...document.querySelectorAll('.c-mark path')].map((e) => e.style.transform));
  await p.hover('.c-cta'); await p.waitForTimeout(300); await p.screenshot({ path: `${D}/shots/micro-contacto-cta-1440.png`, clip: { x: 0, y: 300, width: 1440, height: 600 } });
  await p.context().close(); }
// móvil: toque en Contacto
{ const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })).newPage();
  await p.goto(B + '/', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.getElementById('contacto').scrollIntoView()); await p.waitForTimeout(400);
  const m = await p.evaluate(() => { const r = document.querySelector('.c-mark').getBoundingClientRect(); return [r.left + r.width * .2, r.top + r.height * .5]; });
  await p.touchscreen.tap(m[0], m[1]); await p.waitForTimeout(250);
  out.contactoToque = await p.evaluate(() => [...document.querySelectorAll('.c-mark path')].map((e) => e.style.transform));
  await p.screenshot({ path: `${D}/shots/micro-contacto-toque-390.png` });
  await p.evaluate(() => { const m = document.getElementById('metodo'); scrollTo(0, m.offsetTop + 200); }); await p.waitForTimeout(300);
  await p.screenshot({ path: `${D}/shots/micro-metodo-390.png` });
  await p.context().close(); }
// reduced motion: Contacto y Método quietos
{ const p = await (await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })).newPage();
  await p.goto(B + '/', { waitUntil: 'networkidle' }); await p.evaluate(() => document.getElementById('contacto').scrollIntoView()); await p.mouse.move(1200, 500, { steps: 10 }); await p.waitForTimeout(300);
  out.reducedMotion = { contacto: await p.evaluate(() => [...document.querySelectorAll('.c-mark path')].map((e) => e.style.transform)), rutaMetodo: await p.evaluate(() => getComputedStyle(document.querySelector('.step'), '::after').transform) };
  await p.context().close(); }
await b.close();
const f = `${D}/results.json`, R = existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : {}; R.micro = out; writeFileSync(f, JSON.stringify(R, null, 2) + '\n');
console.log(JSON.stringify(out, null, 1));
