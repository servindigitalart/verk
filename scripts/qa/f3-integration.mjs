// QA de la integración F3 en el sitio real (dev-only; Chrome del sistema). Requiere `npm run build && npx astro preview
// --port 4322` y, para la comparación con F3, `npm run lab`. Salida: qa-artifacts/f3-integration/{shots,results.json}
// Uso: node scripts/qa/f3-integration.mjs [shots|hero|mark|portfolio|header|a11y|perf]   (sin argumento: todo)
import { createRequire } from 'node:module'; import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
const req = createRequire(import.meta.url);
const { chromium } = req('playwright'); const sharp = req('sharp'); const { default: AxeBuilder } = req('@axe-core/playwright');
const B = process.env.BASE_URL ?? 'http://127.0.0.1:4322';
const LAB = 'http://127.0.0.1:4400/lab/f3-generative-experience/page/?v=fluid&ind=route-mark&p=index';
const OUT = 'qa-artifacts/f3-integration'; mkdirSync(`${OUT}/shots`, { recursive: true });
const resFile = `${OUT}/results.json`;
const R = existsSync(resFile) ? JSON.parse(readFileSync(resFile, 'utf8')) : {};
const only = process.argv[2];
const run = (k) => !only || only === k;
const VP = { 1440: { width: 1440, height: 900 }, 1024: { width: 1024, height: 768 }, 768: { width: 768, height: 1024 }, 390: { width: 390, height: 844 } };
const ctxFor = (w, extra = {}) => ({ viewport: VP[w], ...(w <= 768 ? { hasTouch: true } : {}), ...(w === 390 ? { isMobile: true, deviceScaleFactor: 2 } : {}), ...extra });
const b = await chromium.launch({ channel: 'chrome', args: ['--enable-unsafe-swiftshader'] });
const page = async (w, url = '/?debug', extra) => {
  const ctx = await b.newContext(ctxFor(w, extra)); const p = await ctx.newPage();
  p.errors = []; p.on('pageerror', (e) => p.errors.push(e.message)); p.on('console', (m) => m.type() === 'error' && p.errors.push(m.text()));
  await p.goto(url.startsWith('http') ? url : B + url, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready); return p;
};
const ready = (p) => p.waitForFunction(() => window.__field?.T.firstFrame || window.__field?.reason, null, { timeout: 15000 });

// ── capturas comparables a F3: 1440 / 1024 / 768 / 390, por sección, sitio real y referencia F3 ──
if (run('shots')) {
  for (const w of [1440, 1024, 768, 390]) for (const [tag, url] of [['real', '/?debug'], ['f3', LAB]]) {
    let p; try { p = await page(w, url); } catch { console.log('sin', tag, w); continue; }
    await p.waitForTimeout(4000);
    await p.mouse.move(VP[w].width * .7, VP[w].height * .45); await p.mouse.move(VP[w].width * .45, VP[w].height * .3, { steps: 20 }); await p.waitForTimeout(400);
    await p.screenshot({ path: `${OUT}/shots/${tag}-hero-${w}.png` });
    for (const id of ['servicios', 'metodo', 'sistemas', 'contacto']) {
      await p.evaluate((i) => document.getElementById(i).scrollIntoView(), id); await p.waitForTimeout(700);
      await p.screenshot({ path: `${OUT}/shots/${tag}-${id}-${w}.png` });
    }
    if (tag === 'real') { await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(300); await p.screenshot({ path: `${OUT}/shots/real-full-${w}.png`, fullPage: true }); }
    await p.context().close();
  }
  console.log('capturas listas');
}

// ── hero: título en dos líneas, campo libre detrás del texto, cambio cromático, FPS/GPU, pausa, contexto, respaldo ──
if (run('hero')) {
  const H = {};
  for (const w of [1440, 390]) {
    const p = await page(w); await ready(p); await p.waitForTimeout(2500);
    H[`lineas-h1-${w}`] = await p.evaluate(() => { const r = document.createRange(); r.selectNodeContents(document.querySelector('.h1')); return new Set([...r.getClientRects()].map((x) => Math.round(x.top))).size; });
    // ¿hay puntos violetas detrás/alrededor de las letras? se lee el lienzo bajo las cajas del H1 y del párrafo
    H[`campo-bajo-texto-${w}`] = {};
    for (const sel of ['.h1', '.sub', '.hero-meta']) {
      const r = await p.locator(sel).boundingBox();
      const { data, info } = await sharp(await p.screenshot({ clip: r })).raw().toBuffer({ resolveWithObject: true });
      let dots = 0, lilac = 0; for (let i = 0; i < data.length; i += info.channels) { if (data[i + 2] - data[i] > 40) { dots++; if (data[i] > 140) lilac++; } }
      H[`campo-bajo-texto-${w}`][sel] = { coberturaPuntos: +(dots / (info.width * info.height)).toFixed(3), puntosAclarados: +(lilac / Math.max(1, dots)).toFixed(2) };
    }
    // FPS y coste: 4 s con el cursor moviéndose
    await p.evaluate(() => { window.__fr = []; let l = performance.now(); const t = (n) => { window.__fr.push(n - l); l = n; if (window.__fr.length < 400) requestAnimationFrame(t); }; requestAnimationFrame(t); window.__field.state.timing.length = 0; });
    for (let i = 0; i < 80; i++) { const a = i / 8; await p.mouse.move(VP[w].width * (.5 + .35 * Math.cos(a)), VP[w].height * (.5 + .3 * Math.sin(a))); await p.waitForTimeout(40); }
    H[`rendimiento-${w}`] = await p.evaluate(() => { const fr = window.__fr.slice(5).sort((a, b) => a - b), t = window.__field.state.timing.slice().sort((a, b) => a - b), q = (a, x) => +a[Math.floor(a.length * x)].toFixed(2);
      return { fps: +(1000 / (fr.reduce((s, x) => s + x, 0) / fr.length)).toFixed(1), frame_p95_ms: q(fr, .95), cpu_js_p50_ms: q(t, .5), cpu_js_p95_ms: q(t, .95), escala: window.__field.state.scale, jacobi: window.__field.scene.jacobi, memoriaMB: +(window.__field.memory() / 1048576).toFixed(2), T: window.__field.T }; });
    // pausa fuera de vista
    await p.evaluate(() => scrollTo(0, innerHeight * 2.5)); await p.waitForTimeout(400);
    const f0 = await p.evaluate(() => window.__field.state.frames); await p.waitForTimeout(1200);
    H[`framesFueraDeVista-${w}`] = await p.evaluate((f) => window.__field.state.frames - f, f0);
    await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(300);
    // pausa con el botón
    await p.click('.field-pause'); const g0 = await p.evaluate(() => window.__field.state.frames); await p.waitForTimeout(1000);
    H[`framesEnPausa-${w}`] = await p.evaluate((f) => window.__field.state.frames - f, g0); await p.click('.field-pause');
    // pérdida y recuperación de contexto
    await p.evaluate(() => window.__field.loseContext()); await p.waitForTimeout(300); await p.evaluate(() => window.__field.restoreContext());
    await p.waitForFunction(() => window.__field.recovery_ms, null, { timeout: 8000 }).catch(() => {});
    H[`recuperacionContexto_ms-${w}`] = await p.evaluate(() => window.__field.recovery_ms ?? 'no recuperó');
    H[`errores-${w}`] = p.errors;
    await p.screenshot({ path: `${OUT}/shots/hero-tras-recuperar-${w}.png` });
    await p.context().close();
  }
  // CPU ×4 en móvil
  { const p = await page(390); const cdp = await p.context().newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 }); await ready(p); await p.waitForTimeout(4000);
    H['movil-cpu4'] = await p.evaluate(() => ({ escala: window.__field.state.scale, jacobi: window.__field.scene.jacobi, cpu_js_p50_ms: +window.__field.state.timing.slice().sort((a, b) => a - b)[Math.floor(window.__field.state.timing.length / 2)].toFixed(2) })); await p.context().close(); }
  // sin WebGL → póster; reduced motion → estado final; sin JS → H1 visible
  { const ctx = await b.newContext(ctxFor(1440)); await ctx.addInitScript(() => { const g = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (t, ...a) { return t === 'webgl2' ? null : g.call(this, t, ...a); }; });
    const p = await ctx.newPage(); await p.goto(B + '/?debug', { waitUntil: 'networkidle' }); await p.waitForTimeout(3000);
    H.sinWebGL = await p.evaluate(() => ({ motivo: document.querySelector('.hero').dataset.fieldOff, poster: getComputedStyle(document.querySelector('.hero')).backgroundImage.includes('hero-fluid'), marcaVisible: getComputedStyle(document.querySelector('.mark path')).opacity }));
    await p.screenshot({ path: `${OUT}/shots/hero-sin-webgl-1440.png` }); await ctx.close(); }
  { const p = await page(390, '/?debug', { reducedMotion: 'reduce' }); await ready(p); await p.waitForTimeout(1500);
    const a = await p.evaluate(() => window.__field.state.frames); await p.waitForTimeout(1500);
    H.reducedMotion = { framesEn1_5s: await p.evaluate((x) => window.__field.state.frames - x, a), transformBarra: await p.evaluate(() => document.querySelector('.mark path').style.transform) };
    await p.screenshot({ path: `${OUT}/shots/hero-reduced-motion-390.png` }); await p.context().close(); }
  { const p = await page(1440, '/', { javaScriptEnabled: false }); H.sinJS = await p.evaluate(() => ({ h1: getComputedStyle(document.querySelector('.h1')).opacity, marca: getComputedStyle(document.querySelector('.mark path')).opacity }));
    await p.screenshot({ path: `${OUT}/shots/hero-sin-js-1440.png` }); await p.context().close(); }
  R.hero = H; console.log('hero', JSON.stringify(H, null, 1));
}

// ── isotipo: respiración autónoma (no periódica), respuesta al cursor, regreso, toque; solo traslación a 45° ──
if (run('mark')) {
  const M = {};
  const p = await page(1440); await ready(p); await p.waitForTimeout(2000);
  const sample = (ms) => p.evaluate(async (ms) => { const out = []; const t0 = performance.now(); while (performance.now() - t0 < ms) { out.push([...document.querySelectorAll('.mark path')].map((e) => e.style.transform)); await new Promise((r) => setTimeout(r, 50)); } return out; }, ms);
  const parse = (s) => s.map((row) => row.map((t) => { const m = /translate\((-?[\d.]+)px, (-?[\d.]+)px\)/.exec(t); return [+m[1], +m[2]]; }));
  const idle = parse(await sample(6000));
  M.soloEje45 = idle.every((r) => r.every(([x, y]) => Math.abs(x + y) < .02));
  M.sinRotacionNiEscala = await p.evaluate(() => [...document.querySelectorAll('.mark path')].every((e) => !/rotate|scale|skew|matrix/.test(e.style.transform)));
  const px = (r, i, s) => r[i][0] * Math.SQRT2 * s;
  const s = await p.evaluate(() => { const m = document.querySelector('.mark').getBoundingClientRect(); return m.height / 739; });
  M.respiracionAutonoma_px = [0, 1, 2].map((i) => { const v = idle.map((r) => px(r, i, s)); return +(Math.max(...v) - Math.min(...v)).toFixed(2); });
  const hero = await p.evaluate(() => { const m = document.querySelector('.mark').getBoundingClientRect(); return { x: m.left + m.width * .5, y: m.top + m.height * .5, w: m.width }; });
  await p.mouse.move(hero.x - hero.w * 1.5, hero.y); await p.mouse.move(hero.x - hero.w * .2, hero.y - 20, { steps: 30 });
  const near = parse(await sample(1200));
  M.respuestaCursor_px = [0, 1, 2].map((i) => +Math.max(...near.map((r) => Math.abs(px(r, i, s) - px(idle[idle.length - 1], i, s)))).toFixed(1));
  await p.mouse.move(40, 860, { steps: 20 }); await p.waitForTimeout(2500);
  M.velocidadBarrasTrasRetirar = await p.evaluate(() => [...window.__field.mark.st.barVel].map((v) => +(v * innerHeight).toFixed(2)));
  await p.screenshot({ path: `${OUT}/shots/isotipo-cursor-1440.png` });
  await p.context().close();
  // toque (390)
  const t = await page(390); await ready(t); await t.waitForTimeout(2000);
  const m = await t.evaluate(() => { const r = document.querySelector('.mark').getBoundingClientRect(); return [r.left + r.width * .3, r.top + r.height * .5]; });
  const before = await t.evaluate(() => [...window.__field.mark.st.off]);
  await t.touchscreen.tap(m[0], m[1]); await t.waitForTimeout(350);
  M.toque = await t.evaluate((b0) => ({ presencia: +window.__field.mark.st.ptr.on.toFixed(2), rafaga: +window.__field.mark.st.burst.toFixed(2), cambioOffset: +Math.max(...[...window.__field.mark.st.off].map((v, i) => Math.abs(v - b0[i]) * innerHeight)).toFixed(1) }), before);
  await t.waitForTimeout(2000); M.toquePresenciaTras2s = await t.evaluate(() => +window.__field.mark.st.ptr.on.toFixed(3));
  await t.context().close();
  R.isotipo = M; console.log('isotipo', JSON.stringify(M));
}

// ── portfolio: cada proyecto en el panel ──
if (run('portfolio')) {
  const P = {};
  for (const w of [1440, 390]) {
    const p = await page(w); await p.evaluate(() => document.getElementById('sistemas').scrollIntoView()); await p.waitForTimeout(300);
    P[`iframesAlCargar-${w}`] = await p.evaluate(() => document.querySelectorAll('iframe').length);
    const rows = {};
    for (let i = 1; i <= 10; i++) {
      const id = `SIS-${String(i).padStart(2, '0')}`;
      const btn = p.locator(`[data-open="${id}"]`); await btn.scrollIntoViewIfNeeded(); const t0 = Date.now(); await btn.click();
      await p.waitForFunction(() => document.querySelector('dialog.sys-panel')?.open); const ms = Date.now() - t0;
      let carga = null;
      if (await p.locator('dialog iframe').count()) { try { await p.waitForSelector('dialog .sp-frame.is-loaded', { timeout: 20000 }); carga = await p.evaluate(() => window.__pf.iframeLoads.at(-1)?.ms); } catch { carga = 'sin load en 20 s'; } }
      rows[id] = await p.evaluate(() => { const d = document.querySelector('dialog'); const live = d.querySelector('#sp-p2');
        return { pestanaInicial: d.querySelector('[aria-selected=true]').textContent.trim(), iframes: d.querySelectorAll('iframe').length, enVivo: live.textContent.trim().replace(/\s+/g, ' ').slice(0, 120), enlace: d.querySelector('a[href^="http"]')?.href ?? null, focoDentro: d.contains(document.activeElement) }; });
      Object.assign(rows[id], { abrir_ms: ms, cargaIframe_ms: carga });
      if (w === 1440 && ['SIS-01', 'SIS-03', 'SIS-08', 'SIS-04'].includes(id)) { if (id !== 'SIS-01') await p.click('#sp-t2'); await p.waitForTimeout(300); await p.screenshot({ path: `${OUT}/shots/panel-${id}-${w}.png` }); }
      if (w === 390 && id === 'SIS-01') await p.screenshot({ path: `${OUT}/shots/panel-${id}-${w}.png` });
      await p.keyboard.press('Escape'); await p.waitForTimeout(120);
      rows[id].iframesTrasCerrar = await p.evaluate(() => document.querySelectorAll('iframe').length);
      rows[id].focoDevuelto = await p.evaluate((i) => document.activeElement?.dataset?.open === i, id);
    }
    P[`proyectos-${w}`] = rows; await p.context().close();
  }
  R.portfolio = P; console.log('portfolio', JSON.stringify(P).slice(0, 1500));
}

// ── header: color y sección activa al atravesar todas las secciones; progreso de la ruta ──
if (run('header')) {
  const Hd = {};
  for (const w of [1440, 390]) {
    const p = await page(w);
    const seq = await p.evaluate(async () => {
      const pill = document.querySelector('[data-pill]'), out = []; let last = '';
      const max = document.documentElement.scrollHeight - innerHeight;
      for (let y = 0; y <= max; y += 20) {
        scrollTo(0, y); await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        const pr = pill.getBoundingClientRect(), mid = (pr.top + pr.bottom) / 2;
        const under = document.elementsFromPoint(innerWidth - 4, mid).find((e) => e.closest('[data-surface]') && !e.closest('[data-nav-root]'))?.closest('main > [data-surface], main > section, main > footer');
        const st = `${pill.dataset.v}|${document.querySelector('.nav-links [aria-current]')?.textContent ?? '-'}|${document.querySelector('.ind-m [data-name]')?.textContent}`;
        const ok = !under || under.dataset.surface === pill.dataset.v || pill.querySelector('.pill-clone.on');
        if (st !== last) { out.push({ y, st, fill: pill.style.getPropertyValue('--fill'), ok: !!ok }); last = st; }
      }
      return out;
    });
    Hd[`recorrido-${w}`] = seq; Hd[`desajustes-${w}`] = seq.filter((x) => !x.ok).length;
    if (w === 390) { await p.evaluate(() => scrollTo(0, 0)); await p.click('.nav-toggle'); Hd.menuMovil = await p.evaluate(() => ({ abierto: !document.getElementById('menu').hidden, foco: document.activeElement.textContent })); await p.screenshot({ path: `${OUT}/shots/menu-movil-390.png` }); await p.keyboard.press('Escape'); Hd.menuCierraEsc = await p.evaluate(() => document.getElementById('menu').hidden); }
    await p.context().close();
  }
  R.header = Hd; console.log('header', JSON.stringify(Hd).slice(0, 1200));
}

// ── accesibilidad, responsive, teclado, CLS, LCP, peso ──
if (run('a11y') || run('perf')) {
  const A = {};
  for (const w of [1440, 1024, 768, 390]) {
    const ctx = await b.newContext(ctxFor(w)); const p = await ctx.newPage();
    await p.addInitScript(() => { window.__lcp = []; window.__cls = 0; new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp.push({ t: Math.round(e.startTime), el: e.element?.tagName + '.' + (e.element?.className || '') }); }).observe({ type: 'largest-contentful-paint', buffered: true }); new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); });
    await p.goto(B + '/', { waitUntil: 'networkidle' }); await p.waitForTimeout(2500);
    await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } scrollTo(0, 0); });
    await p.waitForTimeout(500);
    const axe = await new AxeBuilder({ page: p }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    const net = await p.evaluate(() => { const r = performance.getEntriesByType('resource'), kb = (a) => +(a.reduce((s, e) => s + (e.transferSize || e.encodedBodySize || 0), 0) / 1024).toFixed(1);
      return { js: kb(r.filter((e) => /\.js(\?|$)/.test(e.name))), css: kb(r.filter((e) => /\.css(\?|$)/.test(e.name))), fuentes: kb(r.filter((e) => /\.woff2?(\?|$)/.test(e.name))), imagenes: kb(r.filter((e) => /\.(webp|png|svg|avif)(\?|$)/.test(e.name))), iframes: document.querySelectorAll('iframe').length }; });
    A[w] = { axe: axe.violations.map((v) => `${v.id} (${v.nodes.length}): ${v.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(' | ')}`), scrollHorizontal: await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
      lcp: await p.evaluate(() => window.__lcp.at(-1)), cls: await p.evaluate(() => +window.__cls.toFixed(4)), red: net };
    if (w === 1440) {
      const tabs = []; for (let i = 0; i < 9; i++) { await p.keyboard.press('Tab'); tabs.push(await p.evaluate(() => { const a = document.activeElement; const cs = getComputedStyle(a); return `${a.tagName}${a.className ? '.' + String(a.className).split(' ')[0] : ''}:${(a.textContent || '').trim().slice(0, 18)}|outline:${cs.outlineStyle}`; })); }
      A.teclado = tabs;
    }
    await ctx.close();
  }
  // /bot intacto: axe y que sigue usando el layout anterior
  { const p = await page(1440, '/bot'); A.bot = { titulo: await p.title(), css: await p.evaluate(() => [...document.styleSheets].map((s) => s.href?.split('/').pop())), axe: (await new AxeBuilder({ page: p }).withTags(['wcag2a', 'wcag2aa', 'wcag22aa']).analyze()).violations.map((v) => v.id) }; await p.context().close(); }
  R.a11y = A; console.log('a11y', JSON.stringify(A, null, 1).slice(0, 3000));
}
await b.close();
R.fecha = new Date().toISOString();
writeFileSync(resFile, JSON.stringify(R, null, 2) + '\n');
