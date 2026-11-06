// QA del header: transiciones cromáticas en ambos sentidos, scroll rápido, inversión a mitad, alternancia y enlaces.
// Comprueba en cada escenario: estado final correcto (la superficie bajo la línea media), ninguna animación pendiente,
// degradado limpiado, geometría constante (radio de la píldora) y que nada dibuja sobre el isotipo de progreso
// (sin pseudo-elementos ni clases ajenas). Guarda frames ampliados del isotipo durante cada transición.
// Uso: node scripts/qa/header-transitions.mjs [url] [chromium|firefox|webkit]  (PWCORE para Firefox/WebKit en macOS 12)
import { createRequire } from 'node:module'; import { mkdirSync } from 'node:fs';
const req = createRequire(import.meta.url); const pw = req(process.env.PWCORE ?? 'playwright');
const U = process.argv[2] ?? 'http://127.0.0.1:4322/', engine = process.argv[3] ?? 'chromium';
const D = `qa-artifacts/header/${engine}`; mkdirSync(D, { recursive: true });
const b = await pw[engine].launch(engine === 'chromium' && !process.env.PWCORE ? { channel: 'chrome' } : {});
const out = {};
for (const w of [1440, 390]) {
  const ctx = await b.newContext({ viewport: { width: w, height: w > 800 ? 900 : 844 }, deviceScaleFactor: 2, ...(w < 800 && engine !== 'firefox' ? { isMobile: true, hasTouch: true } : {}) });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(U, { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
  const state = () => p.evaluate(() => {
    const pill = document.querySelector('[data-pill]'), bg = pill.querySelector('.pill-bg'), mk = pill.querySelector('.prog-mark');
    const hd = document.querySelector('[data-nav-root]'), mid = hd.offsetTop + pill.offsetTop + pill.offsetHeight / 2;   // posición de layout (en móvil el header puede estar oculto con transform)
    const under = [...document.querySelectorAll('main > [data-surface], main > section, main > footer')].find((s) => { const r = s.getBoundingClientRect(); return r.top <= mid && r.bottom > mid; });
    return { v: pill.dataset.v, under: under?.dataset.surface, anims: bg.getAnimations().filter((a) => a.playState === 'running').length, img: bg.style.backgroundImage ? 'degradado' : '', radius: getComputedStyle(bg).borderRadius,
      ajeno: ['::before', '::after'].map((x) => getComputedStyle(mk, x).content).filter((c) => c && c !== 'none' && c !== 'normal').length + (mk.classList.contains('step') ? 1 : 0) };
  });
  const top = (id) => p.evaluate((i) => document.getElementById(i).getBoundingClientRect().top + scrollY, id);
  const frames = async (name) => { const box = await p.evaluate(() => { const r = document.querySelector('.prog').getBoundingClientRect(); return { x: r.left - 6, y: r.top - 6, width: r.width + 12, height: r.height + 12 }; });
    const issues = []; for (let i = 0; i < 6; i++) { if (box.y >= 0) await p.screenshot({ path: `${D}/${w}-${name}-${i}.png`, clip: box });   // en móvil el header se oculta al bajar (diseño)
 const s = await state(); if (s.ajeno) issues.push(`frame ${i}: capa ajena sobre el isotipo`); if (s.radius !== '999px') issues.push(`frame ${i}: radio ${s.radius}`); await p.waitForTimeout(70); } return issues; };
  const settle = async () => { await p.waitForTimeout(650); return state(); };
  const R = (out[w] = { escenarios: {}, errores: errs });
  const order = ['servicios', 'metodo', 'sistemas', 'contacto'];
  // 1 · descendente, frontera a frontera
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(300);
  for (const id of order) { const y = await top(id); await p.evaluate((y) => scrollTo(0, y - 140), y); await p.waitForTimeout(500); await p.evaluate((y) => scrollTo(0, y + 10), y); const f = await frames(`baja-${id}`); R.escenarios[`baja→${id}`] = { ...(await settle()), f }; }
  // 2 · ascendente
  for (const id of [...order].reverse()) { const y = await top(id); await p.evaluate((y) => scrollTo(0, y + 140), y); await p.waitForTimeout(500); await p.evaluate((y) => scrollTo(0, y - 20), y); const f = await frames(`sube-${id}`); R.escenarios[`sube←${id}`] = { ...(await settle()), f }; }
  // 3 · scroll rápido atravesando varias secciones (60 ms por paso) y parada
  for (const y of [0, 900, 1800, 2700, 3600, 4500]) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(60); }
  R.escenarios.rapidoBajando = await settle();
  for (const y of [4500, 3200, 1900, 600, 0]) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(60); }
  R.escenarios.rapidoSubiendo = await settle();
  // 4 · inversión inmediata a mitad de la transición
  const ym = await top('metodo');
  await p.evaluate((y) => scrollTo(0, y - 140), ym); await p.waitForTimeout(500);
  await p.evaluate((y) => scrollTo(0, y + 20), ym); await p.waitForTimeout(120);
  await p.evaluate((y) => scrollTo(0, y - 60), ym); const fInv = await frames('inversion');
  R.escenarios.inversion = { ...(await settle()), f: fInv };
  // 5 · alternancia rápida arriba/abajo sobre la frontera
  for (let i = 0; i < 8; i++) { await p.evaluate(([y, k]) => scrollTo(0, y + (k % 2 ? 30 : -60)), [ym, i]); await p.waitForTimeout(90); }
  R.escenarios.alternancia = await settle();
  // 6 · entrar en una sección y salir antes de completar
  const ys = await top('sistemas');
  await p.evaluate((y) => scrollTo(0, y - 200), ys); await p.waitForTimeout(500);
  await p.evaluate((y) => scrollTo(0, y + 30), ys); await p.waitForTimeout(100); await p.evaluate((y) => scrollTo(0, y - 200), ys);
  R.escenarios.entraYSale = await settle();
  // 7 · enlaces del header (viaje espacial)
  if (w > 800) { await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(400);
    for (const id of ['contacto', 'servicios', 'sistemas']) { await p.click(`.nav-links a[href="#${id}"]`); await p.waitForTimeout(1400); R.escenarios[`enlace→${id}`] = await state(); } }
  R.ok = Object.values(R.escenarios).every((s) => s.v === s.under && !s.anims && !s.img && s.radius === '999px' && !s.ajeno && !(s.f?.length));
  await ctx.close();
}
await b.close();
console.log(JSON.stringify(out, null, 1));
