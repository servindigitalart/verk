// QA de la experiencia de interacción (dev-only). Requiere `npx astro preview --port 4322`.
// Cubre: modo lima del hero, navegación espacial (incl. re-dirección a mitad de viaje), botones, Servicios (4 → 1),
// Método (ruta + conclusión), Contacto (secuencia + botón), footer (campo residual + cursor) y reduced-motion.
// Salida: qa-artifacts/f3-integration/shots/micro-* y results.json (clave micro).
import { createRequire } from 'node:module'; import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const B = process.env.BASE_URL ?? 'http://127.0.0.1:4322', D = 'qa-artifacts/f3-integration'; mkdirSync(`${D}/shots`, { recursive: true });
const b = await chromium.launch({ channel: 'chrome' }); const out = {};
const shot = (p, n) => p.screenshot({ path: `${D}/shots/micro-${n}.png` });
const scrollToSel = (p, sel, k = 0) => p.evaluate(([s, k]) => { const e = document.querySelector(s); scrollTo(0, e.getBoundingClientRect().top + scrollY + k * innerHeight); }, [sel, k]);   // k en alturas de viewport

for (const w of [1440, 390]) {
  const mobile = w < 800;
  const ctx = await b.newContext({ viewport: { width: w, height: mobile ? 844 : 900 }, ...(mobile ? { isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : {}) });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(B + '/?debug', { waitUntil: 'networkidle' }); await p.waitForFunction(() => window.__field?.T.firstFrame, null, { timeout: 15000 }); await p.waitForTimeout(1500);
  const R = (out[w] = {});
  // Hero · modo lima: solo sobre el isotipo
  const m = await p.evaluate(() => { const r = document.querySelector('.mark path:nth-child(2)').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; });
  if (mobile) { await p.touchscreen.tap(m[0], m[1]); await p.waitForTimeout(300); }
  else { await p.mouse.move(80, 600); await p.waitForTimeout(500); R.limaFueraDelIsotipo = await p.evaluate(() => document.querySelector('.mark').style.color); await p.mouse.move(m[0], m[1], { steps: 12 }); await p.waitForTimeout(700); }
  R.limaSobreIsotipo = await p.evaluate(() => document.querySelector('.mark').style.color);
  await shot(p, `hero-lima-${w}`);
  if (!mobile) { await p.mouse.move(80, 600, { steps: 8 }); await p.waitForTimeout(900); R.limaAlSalir = await p.evaluate(() => document.querySelector('.mark').style.color); }
  // Navegación espacial: clic y re-dirección durante el viaje
  if (!mobile) {
    await p.click('.nav-links a[href="#metodo"]'); await p.waitForTimeout(250);
    R.viajeEnCurso = await p.evaluate(() => document.documentElement.dataset.travel ?? null);
    await shot(p, `viaje-${w}`);
    await p.click('.nav-links a[href="#contacto"]'); await p.waitForTimeout(1300);
    R.redireccion = await p.evaluate(() => ({ hash: location.hash, foco: document.activeElement.id, top: Math.round(document.getElementById('contacto').getBoundingClientRect().top), viaje: document.documentElement.dataset.travel ?? null }));
    await shot(p, `llegada-contacto-${w}`);
    // botón: hover → escala y barrido
    await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(300);
    await p.hover('.ctas .btn-lime'); await p.waitForTimeout(400);
    R.botonHover = await p.evaluate(() => { const b = document.querySelector('.ctas .btn-lime'); return { transform: getComputedStyle(b).transform, color: getComputedStyle(b).color, barrido: getComputedStyle(b, '::before').transform }; });
    await shot(p, `boton-hover-${w}`);
  } else {
    await p.tap('.nav-toggle'); await p.waitForTimeout(250); await p.tap('.menu a[href="#sistemas"]'); await p.waitForTimeout(1400);
    R.menuViaje = await p.evaluate(() => ({ hash: location.hash, menuCerrado: document.getElementById('menu').hidden, top: Math.round(document.getElementById('sistemas').getBoundingClientRect().top) }));
  }
  // Servicios: la disciplina activa avanza con el scroll y termina en 4 (sistema)
  const ks = [];
  for (const f of [-.1, .2, .45, .7, 1.05]) { await p.evaluate((f) => { const l = document.querySelector('.svc-rows'), r = l.getBoundingClientRect(); scrollTo(0, r.top + scrollY + r.height * f - innerHeight / 2); }, f); await p.waitForTimeout(500); ks.push(await p.evaluate(() => document.querySelector('[data-svc]').dataset.k)); }
  R.serviciosK = ks.join('→');
  await p.evaluate(() => { const l = document.querySelector('.svc-rows'), r = l.getBoundingClientRect(); scrollTo(0, r.top + scrollY + r.height * .45 - innerHeight / 2); }); await p.waitForTimeout(700); await shot(p, `servicios-${w}`);
  // Método: ruta y conclusión
  await scrollToSel(p, '#metodo', -.2); await p.waitForTimeout(500);
  R.metodoParcial = await p.evaluate(() => [...document.querySelectorAll('.step')].map((s) => s.style.getPropertyValue('--route')).join(' '));
  await scrollToSel(p, '.steps', -.1); await p.waitForTimeout(900);
  R.metodoFinal = await p.evaluate(() => ({ route: [...document.querySelectorAll('.step')].map((s) => s.style.getPropertyValue('--route')).join(' '), concluido: document.querySelector('.steps').hasAttribute('data-done') }));
  await shot(p, `metodo-${w}`);
  // Contacto: secuencia y botón
  await scrollToSel(p, '#contacto', -.55); await p.waitForTimeout(500);
  R.contactoMedio = await p.evaluate(() => getComputedStyle(document.querySelector('#contacto')).getPropertyValue('--cp'));
  await shot(p, `contacto-medio-${w}`);
  await scrollToSel(p, '#contacto'); await p.waitForTimeout(900);
  R.contactoFinal = await p.evaluate(() => getComputedStyle(document.querySelector('#contacto')).getPropertyValue('--cp'));
  if (!mobile) { const bb = await p.locator('.c-cta').boundingBox(); await p.mouse.move(bb.x + bb.width + 80, bb.y); await p.mouse.move(bb.x + bb.width * .7, bb.y + bb.height / 2, { steps: 8 }); await p.waitForTimeout(400);
    R.ctaCerca = await p.evaluate(() => ({ near: document.querySelector('.c-cta').classList.contains('is-near'), transform: getComputedStyle(document.querySelector('.c-cta')).transform })); }
  R.whatsapp = await p.evaluate(() => document.querySelector('.c-cta').href);
  await shot(p, `contacto-${w}`);
  // Footer: campo residual + cursor
  await p.evaluate(() => scrollTo(0, document.documentElement.scrollHeight)); await p.waitForTimeout(1500);
  R.footerCanvas = await p.evaluate(() => !!document.querySelector('.foot-field'));
  if (!mobile) { await p.mouse.move(w * .55, 420); await p.mouse.move(w * .7, 360, { steps: 20 }); await p.waitForTimeout(600); }
  await shot(p, `footer-${w}`);
  R.redes = await p.evaluate(() => [...document.querySelectorAll('.foot-social > *')].map((e) => e.tagName + ':' + e.getAttribute('aria-label')).join(' '));
  R.errores = errs;
  await ctx.close();
}
// reduced-motion: todo en su estado final
{ const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  await p.goto(B + '/', { waitUntil: 'networkidle' }); await p.evaluate(() => scrollTo(0, document.documentElement.scrollHeight)); await p.waitForTimeout(800);
  out.reducedMotion = await p.evaluate(() => ({ servicios: document.querySelector('[data-svc]').dataset.k, contactoCp: getComputedStyle(document.querySelector('#contacto')).getPropertyValue('--cp').trim(), ruta: getComputedStyle(document.querySelector('.step')).getPropertyValue('--route').trim(), viajes: !document.querySelector('.travel') }));
  await ctx.close(); }
await b.close();
const f = `${D}/results.json`, R = existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : {}; R.micro = out; writeFileSync(f, JSON.stringify(R, null, 2) + '\n');
console.log(JSON.stringify(out, null, 1));
