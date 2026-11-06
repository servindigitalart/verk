// Verificación del sitio publicado (solo lectura). Uso: node scripts/qa/verify-deploy.mjs [url]
import { createRequire } from 'node:module'; import { mkdirSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const U = (process.argv[2] ?? 'https://verk-site.netlify.app').replace(/\/$/, ''); const D = 'qa-artifacts/deploy'; mkdirSync(D, { recursive: true });
const b = await chromium.launch({ channel: 'chrome' }); const out = {};
for (const w of [1440, 390]) {
  const ctx = await b.newContext({ viewport: { width: w, height: w > 800 ? 900 : 844 }, ...(w < 800 ? { isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : {}) });
  const p = await ctx.newPage(); const bad = [];
  p.on('response', (r) => { if (r.status() >= 400 && r.url().startsWith(U)) bad.push(r.status() + ' ' + r.url()); });
  p.on('pageerror', (e) => bad.push('pageerror ' + e.message)); p.on('console', (m) => m.type() === 'error' && bad.push('console ' + m.text()));
  await p.goto(U + '/?debug', { waitUntil: 'networkidle' }); await p.waitForTimeout(5000);
  const r = await p.evaluate(() => ({
    titulo: document.title, canonical: document.querySelector('link[rel=canonical]')?.href, og: document.querySelector('meta[property="og:image"]')?.content,
    campo: window.__field ? { motivo: window.__field.reason, frames: window.__field.state.frames } : null,
    workerOK: performance.getEntriesByType('resource').some((e) => /edt\.worker/.test(e.name)),
    whatsapp: [...document.querySelectorAll('a[href*="wa.me"]')].map((a) => a.href),
    anclas: [...document.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute('href')).filter((h, i, s) => s.indexOf(h) === i).map((h) => h + ':' + !!document.querySelector(h === '#' ? 'body' : h)),
    scrollX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }));
  await p.screenshot({ path: `${D}/home-${w}.png` });
  await p.evaluate(() => document.getElementById('sistemas').scrollIntoView()); await p.waitForTimeout(300);
  await (w < 800 ? p.tap('[data-open="SIS-01"]') : p.click('[data-open="SIS-01"]')); 
  try { await p.waitForSelector('dialog .sp-frame.is-loaded', { timeout: 20000 }); r.sonoro = 'iframe cargado'; } catch { r.sonoro = 'sin carga'; }
  await p.screenshot({ path: `${D}/panel-sonoro-${w}.png` }); await p.keyboard.press('Escape');
  await (w < 800 ? p.tap('[data-open="SIS-10"]') : p.click('[data-open="SIS-10"]')); await p.click('#sp-t2'); await p.waitForTimeout(800);
  r.waterlu = await p.evaluate(() => ({ captura: document.querySelector('.pfx-site img')?.naturalWidth, enlace: document.querySelector('.pfx-copy:not([hidden]) a.btn')?.href }));
  await p.keyboard.press('Escape');
  r.errores = bad; out[w] = r; await ctx.close();
}
const req = await b.newContext(); const rq = req.request;
for (const path of ['/bot', '/robots.txt', '/sitemap-index.xml', '/og/verk-og.png', '/no-existe-' + Date.now(), '/posters/hero-fluid.avif']) { const r = await rq.get(U + path); out[path] = r.status() + ' ' + (r.headers()['content-type'] ?? ''); }
out.robots = await (await rq.get(U + '/robots.txt')).text();
await b.close();
console.log(JSON.stringify(out, null, 1));
