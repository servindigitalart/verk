// VERK · Contacto «Contact Activation».
//   --cp (0→1): progreso de entrada de la sección (desde que su borde superior aparece abajo hasta el 18 % del alto);
//   el CSS reparte la secuencia en tramos. El isotipo se ensambla por su eje según --cp y, al completarse, recibe un
//   impulso de muelle (asentamiento contundente); después responde al cursor/toque con la física del hero (bars.js).
//   Botón: crece al acercarse el cursor (≤ 6 px de imán, doc 21 §12), anticipa la presión y, al abrir WhatsApp, lanza
//   un barrido y un paso de las barras. rAF solo con la sección visible y algo en movimiento.
import { createRig, place, barGeometry } from '../field/bars.js';

export function initContact() {
  const sec = document.querySelector('[data-contact]'), svg = sec?.querySelector('.c-mark'), cta = sec?.querySelector('.c-cta');
  if (!sec || !svg) return null;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { sec.style.setProperty('--cp', '1'); return null; }
  sec.dataset.act = '';
  const paths = [...svg.querySelectorAll('path')];
  const rig = createRig({ breath: 0, reach: 1.3, push: 24, stiffness: 70, damping: .42 });   // mismos muelles que el hero (config.js)
  const ptr = { x: 0, y: 0, vx: 0, vy: 0, on: 0, ton: 0, tx: 0, ty: 0 };
  const sm = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  let g = null, raf = 0, last = 0, visible = false, cp = 0, settled = false;
  const measure = () => { g = barGeometry(svg, sec); };
  const progress = () => {
    const r = sec.getBoundingClientRect(), vh = innerHeight;
    cp = Math.min(1, Math.max(0, (vh - r.top) / (vh * .82)));
    sec.style.setProperty('--cp', cp.toFixed(3));
    if (cp >= .999 && !settled) { settled = true; paths.forEach((_, i) => (rig.v[i] += 520 - i * 90)); }   // asentamiento
    if (cp < .6) settled = false;
    wake();
  };
  const frame = (now) => {
    raf = 0;
    const dt = last && now - last < 200 ? Math.min(.05, (now - last) / 1000) : 1 / 60; last = now;
    const k = 160, c = 2 * Math.sqrt(k);
    ptr.vx += (k * (ptr.tx - ptr.x) - c * ptr.vx) * dt; ptr.vy += (k * (ptr.ty - ptr.y) - c * ptr.vy) * dt;
    ptr.x += ptr.vx * dt; ptr.y += ptr.vy * dt; ptr.on += (ptr.ton - ptr.on) * (1 - Math.exp(-dt * 6));
    const moving = rig.step(dt, ptr, g.centers, g.size);
    // ensamblaje: cada barra llega desde fuera de cuadro por su eje (1-2-3), en el primer 70 % de --cp
    const far = g.size * 2.2;
    paths.forEach((p, i) => place(p, -far * (1 - sm(.08 + i * .07, .5 + i * .07, cp)) ** 2 + rig.x[i], g.s));
    if (visible && (moving || ptr.on > .01 || ptr.ton)) raf = requestAnimationFrame(frame);
  };
  const wake = () => { if (!raf && visible && g) { last = 0; raf = requestAnimationFrame(frame); } };
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) { measure(); progress(); } }, { rootMargin: '10% 0px' }).observe(sec);
  addEventListener('scroll', () => visible && progress(), { passive: true });
  addEventListener('resize', () => visible && (measure(), progress()), { passive: true });
  const at = (e) => { const r = sec.getBoundingClientRect(); ptr.tx = e.clientX - r.left; ptr.ty = e.clientY - r.top; if (!ptr.on) { ptr.x = ptr.tx; ptr.y = ptr.ty; } };
  sec.addEventListener('pointermove', (e) => { at(e); ptr.ton = 1; wake(); magnet(e); }, { passive: true });
  sec.addEventListener('pointerdown', (e) => { at(e); ptr.ton = 1; if (e.pointerType === 'touch') paths.forEach((_, i) => (rig.v[i] += 380 - i * 60)); wake(); }, { passive: true });
  sec.addEventListener('pointerleave', () => { ptr.ton = 0; wake(); release(); });
  sec.addEventListener('pointerup', (e) => { if (e.pointerType === 'touch') setTimeout(() => { ptr.ton = 0; wake(); }, 600); });

  // botón: proximidad (escala + imán ≤ 6 px), anticipación de la presión, lanzamiento al abrir WhatsApp
  const release = () => { cta.style.removeProperty('--mx'); cta.style.removeProperty('--my'); cta.classList.remove('is-near'); };
  function magnet(e) {
    if (e.pointerType !== 'mouse') return;
    const r = cta.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, dx = e.clientX - cx, dy = e.clientY - cy, d = Math.hypot(dx, dy);
    if (d > 160) return release();
    const k = Math.min(6, d * .05) / Math.max(d, 1);
    cta.style.setProperty('--mx', `${(dx * k).toFixed(2)}px`); cta.style.setProperty('--my', `${(dy * k).toFixed(2)}px`);
    cta.classList.add('is-near');
  }
  cta.addEventListener('pointerdown', () => cta.classList.add('is-press'));
  for (const ev of ['pointerup', 'pointercancel', 'pointerleave']) cta.addEventListener(ev, () => cta.classList.remove('is-press'));
  cta.addEventListener('click', () => {
    cta.classList.remove('is-launch'); void cta.offsetWidth; cta.classList.add('is-launch');
    paths.forEach((_, i) => (rig.v[i] += 700 - i * 120)); ptr.ton = 1; wake();
    setTimeout(() => cta.classList.remove('is-launch'), 900);
  });
  return { progress };
}
