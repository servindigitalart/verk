// QA en Firefox y WebKit con los navegadores de Playwright disponibles en este equipo (macOS 12: Playwright actual ya no
// publica Firefox/WebKit para mac12; se usan los builds en caché con playwright-core@1.41.2 instalado fuera del proyecto).
// Uso: PWCORE=/ruta/a/node_modules/playwright-core node scripts/qa/cross-browser.mjs  · Requiere `npx astro preview --port 4322`.
import { createRequire } from 'node:module'; import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
const pw = createRequire(import.meta.url)(process.env.PWCORE ?? 'playwright');
const B = process.env.BASE_URL ?? 'http://127.0.0.1:4322', D = 'qa-artifacts/f3-integration'; mkdirSync(`${D}/shots`, { recursive: true });
const out = {};
for (const name of ['firefox', 'webkit']) {
  const b = await pw[name].launch(); out[name] = { version: b.version() };
  for (const w of [1440, 390]) {
    const ctx = await b.newContext({ viewport: { width: w, height: w > 800 ? 900 : 844 }, ...(w < 800 && name === 'webkit' ? { isMobile: true, hasTouch: true } : {}) });
    const p = await ctx.newPage(); const errs = [];
    p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => m.type() === 'error' && errs.push(m.text())); p.on('response', (r) => r.status() >= 400 && errs.push(r.status() + ' ' + r.url()));
    await p.goto(B + '/?debug', { waitUntil: 'load' }); await p.waitForTimeout(5000);
    const r = await p.evaluate(() => ({
      campo: window.__field ? { motivo: window.__field.reason, frames: window.__field.state.frames, T: window.__field.T } : 'sin __field',
      scrollX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      h1px: getComputedStyle(document.querySelector('.h1')).fontSize, subgrid: CSS.supports('grid-template-columns: subgrid'), cqi: CSS.supports('font-size: 1cqi'), sda: CSS.supports('animation-timeline: view()'),
    }));
    await p.screenshot({ path: `${D}/shots/${name}-hero-${w}.png` });
    // Método: la ruta debe avanzar con el scroll (nativo o respaldo JS)
    const ruta = [];
    for (const k of [-.2, .3, .9]) { await p.evaluate((k) => { const s = document.querySelector('.steps'); scrollTo(0, s.getBoundingClientRect().top + scrollY - innerHeight * (1 - k)); }, k); await p.waitForTimeout(400);
      ruta.push(await p.evaluate(() => [...document.querySelectorAll('.step')].map((s) => getComputedStyle(s, '::after').transform).join(' '))); }
    await p.screenshot({ path: `${D}/shots/${name}-metodo-${w}.png` });
    // Header: color de la píldora en cada sección
    const hdr = [];
    for (const id of ['servicios', 'metodo', 'sistemas', 'contacto']) { await p.evaluate((i) => scrollTo(0, document.getElementById(i).offsetTop + 200), id); await p.waitForTimeout(250); hdr.push(id + ':' + await p.evaluate(() => document.querySelector('[data-pill]').dataset.v)); }
    // Panel: Sonoro (iframe) y PRISMA (captura)
    await p.evaluate(() => document.getElementById('sistemas').scrollIntoView()); await p.waitForTimeout(200);
    await p.click('[data-open="SIS-01"]'); await p.waitForTimeout(4000);
    const sonoro = await p.evaluate(() => ({ abierto: document.querySelector('dialog').open, iframes: document.querySelectorAll('dialog iframe').length, cargado: !!document.querySelector('.sp-frame.is-loaded') }));
    await p.screenshot({ path: `${D}/shots/${name}-panel-sonoro-${w}.png` });
    await p.keyboard.press('Escape'); await p.waitForTimeout(200);
    await p.click('[data-open="SIS-03"]'); await p.click('#sp-t2'); await p.waitForTimeout(600);
    const prisma = await p.evaluate(() => ({ captura: !!document.querySelector('#sp-p2 .sp-shot img')?.complete, enlace: document.querySelector('#sp-p2 a[href^="http"]')?.href }));
    await p.screenshot({ path: `${D}/shots/${name}-panel-prisma-${w}.png` });
    await p.keyboard.press('Escape');
    const wa = await p.evaluate(() => document.querySelector('.c-cta').href);
    out[name][w] = { ...r, rutaMetodo: ruta, header: hdr, sonoro, prisma, whatsapp: wa, errores: errs };
    await ctx.close();
  }
  await b.close();
}
const f = `${D}/results.json`, R = existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : {}; R.crossBrowser = out; writeFileSync(f, JSON.stringify(R, null, 2) + '\n');
console.log(JSON.stringify(out, null, 1));
