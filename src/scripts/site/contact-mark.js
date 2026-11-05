// VERK · Contacto: el isotipo de cierre responde al cursor/toque con la misma física de barras que el hero
// (src/scripts/field/bars.js), sin WebGL. Al pulsar el CTA, las barras dan el paso 1-2-3 por su eje.
// rAF solo mientras la sección es visible y algo se mueve; reduced-motion = estado final, sin movimiento.
import { createRig, place, barGeometry } from '../field/bars.js';
import { FIELD } from '../field/config.js';

export function initContactMark() {
  const sec = document.querySelector('[data-contact]'), svg = sec?.querySelector('.c-mark');
  if (!svg || matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  const paths = [...svg.querySelectorAll('path')];
  const rig = createRig({ ...FIELD.mark, push: 22, reach: 1.3 });
  const ptr = { x: 0, y: 0, vx: 0, vy: 0, on: 0, ton: 0, tx: 0, ty: 0 };
  let g = null, raf = 0, last = 0, visible = false, kick = -1;
  const measure = () => { g = barGeometry(svg, sec); };
  const frame = (now) => {
    raf = 0;
    const dt = last && now - last < 200 ? Math.min(.05, (now - last) / 1000) : 1 / 60; last = now;
    const k = 160, c = 2 * Math.sqrt(k);
    ptr.vx += (k * (ptr.tx - ptr.x) - c * ptr.vx) * dt; ptr.vy += (k * (ptr.ty - ptr.y) - c * ptr.vy) * dt;
    ptr.x += ptr.vx * dt; ptr.y += ptr.vy * dt; ptr.on += (ptr.ton - ptr.on) * (1 - Math.exp(-dt * 6));
    const moving = rig.step(dt, ptr, g.centers, g.size);
    // paso 1-2-3 del CTA: impulso escalonado sobre la velocidad de cada barra
    if (kick >= 0) { kick += dt; paths.forEach((_, i) => { if (kick - dt < i * .07 && kick >= i * .07) rig.v[i] += 420; }); if (kick > .3) kick = -1; }
    paths.forEach((p, i) => place(p, rig.x[i], g.s));
    if (visible && (moving || ptr.on > .01 || ptr.ton || kick >= 0)) raf = requestAnimationFrame(frame);
  };
  const wake = () => { if (!raf && visible && g) { last = 0; raf = requestAnimationFrame(frame); } };
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) { measure(); wake(); } });
  io.observe(sec);
  addEventListener('resize', () => visible && measure(), { passive: true });
  const at = (e) => { const r = sec.getBoundingClientRect(); ptr.tx = e.clientX - r.left; ptr.ty = e.clientY - r.top; if (!ptr.on) { ptr.x = ptr.tx; ptr.y = ptr.ty; } };
  sec.addEventListener('pointermove', (e) => { at(e); ptr.ton = 1; wake(); }, { passive: true });
  sec.addEventListener('pointerdown', (e) => { at(e); ptr.ton = 1; if (e.pointerType === 'touch') kick = 0; wake(); }, { passive: true });   // toque: paso 1-2-3 + presencia
  sec.addEventListener('pointerleave', () => { ptr.ton = 0; wake(); });
  sec.addEventListener('pointerup', (e) => { if (e.pointerType === 'touch') setTimeout(() => { ptr.ton = 0; wake(); }, 600); });
  sec.querySelector('.c-cta')?.addEventListener('pointerenter', () => { kick = 0; wake(); });
  sec.querySelector('.c-cta')?.addEventListener('focus', () => { kick = 0; wake(); });
  return { destroy: () => { io.disconnect(); cancelAnimationFrame(raf); } };
}
