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
  // panel (sin iframes): cada pestaña de Sonoro y WATERLÜ con sus propias capturas, sin scroll interno
  for (const id of ['SIS-01', 'SIS-10']) {
    await p.locator(`[data-open="${id}"]`).scrollIntoViewIfNeeded();
    await (w < 800 ? p.tap(`[data-open="${id}"]`) : p.click(`[data-open="${id}"]`)); await p.waitForTimeout(900);
    const tabs = await p.locator('[role=tab]').count(), res = [];
    for (let t = 0; t < tabs; t++) { await p.click(`#sp-t${t}`); await p.waitForTimeout(700);
      res.push(await p.evaluate(() => { const d = document.querySelector('dialog'); return `${d.querySelector('.pfx').dataset.view}:${d.querySelectorAll('.pfx-shot').length}cap:${d.querySelectorAll('iframe').length}if:${d.scrollHeight - d.clientHeight}px:${[...d.querySelectorAll('.pfx-shot img')].every((i) => i.naturalWidth > 0) ? 'ok' : 'img?'}:${d.querySelector('.pfx-copy a[href^="http"]')?.href ?? '-'}`; })); }
    await p.screenshot({ path: `${D}/panel-${id}-${w}.png` });
    r[id] = res; await p.keyboard.press('Escape'); await p.waitForTimeout(200);
  }
  r.errores = bad; out[w] = r; await ctx.close();
}
const req = await b.newContext(); const rq = req.request;
for (const path of ['/bot', '/robots.txt', '/sitemap-index.xml', '/og/verk-og.png', '/no-existe-' + Date.now(), '/posters/hero-fluid.avif']) { const r = await rq.get(U + path); out[path] = r.status() + ' ' + (r.headers()['content-type'] ?? ''); }
out.robots = await (await rq.get(U + '/robots.txt')).text();
await b.close();
console.log(JSON.stringify(out, null, 1));
