// VERK · Footer «Residual Field». Lógica propia (no es el halftone del hero):
//   · residuo: las partículas nacen sobre las tres barras del isotipo oficial (origen estructural del campo) y
//     derivan por un campo de fuerzas suave hacia la izquierda; cada una es un trazo a 45° (el ángulo de la marca)
//     cuya longitud crece con la velocidad, y deja estela (el fondo se repinta con poca opacidad).
//   · cursor: atracción con giro (las partículas orbitan); presión/toque: repulsión radial.
//   · colores: violeta (mayoría), cream y acentos lima. Canvas 2D, DPR ≤ 1.5, rAF solo con el footer visible.
//   · reduced-motion: se simula fuera de pantalla y se pinta un único frame.
import { barGeometry } from '../field/bars.js';

export function initFooterField() {
  const foot = document.querySelector('[data-foot]'), origin = foot?.querySelector('.foot-origin');
  if (!foot || !origin) return null;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cv = document.createElement('canvas'); cv.className = 'foot-field'; cv.setAttribute('aria-hidden', 'true');
  const c = cv.getContext('2d', { alpha: false }); if (!c) return null;
  foot.prepend(cv);
  const COLS = ['rgba(107,106,244,.9)', 'rgba(240,238,233,.62)', 'rgba(191,234,0,.95)'];
  let W = 0, H = 0, dpr = 1, g = null, P = [], N = 0, t = 0, raf = 0, last = 0, visible = false;
  const ptr = { x: -1e4, y: -1e4, on: 0, ton: 0, push: 0 };

  const spawn = (p) => {
    const b = g.centers[(Math.random() * 3) | 0], len = g.size * .55, u = (Math.random() - .5) * len, n = (Math.random() - .5) * g.size * .12;
    p.x = b[0] + (u + n) * Math.SQRT1_2; p.y = b[1] + (-u + n) * Math.SQRT1_2;
    p.vx = -20 - Math.random() * 40; p.vy = (Math.random() - .5) * 20;
    p.life = 0; p.max = 3 + Math.random() * 6;
    const r = Math.random(); p.c = r < .06 ? 2 : r < .3 ? 1 : 0;
    return p;
  };
  const resize = () => {
    const r = foot.getBoundingClientRect(); W = r.width; H = r.height; dpr = Math.min(devicePixelRatio || 1, 1.5);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); c.setTransform(dpr, 0, 0, dpr, 0, 0);
    g = barGeometry(origin, foot);
    N = W < 768 ? 420 : 900;
    P = Array.from({ length: N }, () => { const p = spawn({}); p.life = Math.random() * p.max; p.x -= Math.random() * W * .8; return p; });
    c.fillStyle = '#0B0B0B'; c.fillRect(0, 0, W, H);
  };
  const step = (dt) => {
    t += dt;
    ptr.on += (ptr.ton - ptr.on) * (1 - Math.exp(-dt * 5));
    const R = Math.min(260, W * .25), R2 = R * R;
    for (const p of P) {
      // campo de fuerzas: tres ondas de baja frecuencia, deriva a la izquierda
      const a = Math.sin(p.x * .0037 + t * .35) + Math.cos(p.y * .0049 - t * .27) + Math.sin((p.x + p.y) * .0021 + t * .11);
      let fx = Math.cos(a * 1.7) * 60 - 26, fy = Math.sin(a * 1.7) * 60;
      const dx = ptr.x - p.x, dy = ptr.y - p.y, d2 = dx * dx + dy * dy;
      if (ptr.on > .01 && d2 < R2) {
        const d = Math.sqrt(d2) + 1e-3, w = (1 - d / R) * ptr.on;
        fx += (dx / d) * 900 * w - (dy / d) * 700 * w;                    // atracción + giro tangencial
        fy += (dy / d) * 900 * w + (dx / d) * 700 * w;
      }
      if (ptr.push > .01 && d2 < R2 * 2.2) { const d = Math.sqrt(d2) + 1e-3, w = (1 - d / (R * 1.48)) * ptr.push; fx -= (dx / d) * 5200 * w; fy -= (dy / d) * 5200 * w; }
      p.vx = (p.vx + fx * dt) * .965; p.vy = (p.vy + fy * dt) * .965;
      p.x += p.vx * dt; p.y += p.vy * dt; p.life += dt;
      if (p.life > p.max || p.x < -40 || p.x > W + 40 || p.y < -40 || p.y > H + 40) spawn(p);
    }
    ptr.push *= Math.exp(-dt * 4);
  };
  const draw = (fade) => {
    c.fillStyle = fade ? 'rgba(11,11,11,.18)' : '#0B0B0B'; c.fillRect(0, 0, W, H);
    c.lineWidth = 1.4; c.lineCap = 'round';
    for (let k = 0; k < 3; k++) {
      c.strokeStyle = COLS[k]; c.beginPath();
      for (const p of P) {
        if (p.c !== k) continue;
        const sp = Math.min(18, 2.5 + Math.hypot(p.vx, p.vy) * .06), f = Math.min(1, p.life * 2, (p.max - p.life) * 1.5);
        if (f <= 0) continue;
        const L = sp * f * Math.SQRT1_2;
        c.moveTo(p.x - L, p.y + L); c.lineTo(p.x + L, p.y - L);            // trazo a 45° (abajo-izquierda → arriba-derecha)
      }
      c.stroke();
    }
  };
  const frame = (now) => {
    raf = 0;
    const dt = last && now - last < 200 ? Math.min(.04, (now - last) / 1000) : 1 / 60; last = now;
    step(dt); draw(true);
    if (visible && !document.hidden) raf = requestAnimationFrame(frame);
  };
  const wake = () => { if (!raf && visible && !reduced && !document.hidden) { last = 0; raf = requestAnimationFrame(frame); } };
  resize();
  if (reduced) { for (let i = 0; i < 240; i++) step(1 / 60); draw(false); }
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; wake(); }).observe(foot);
  document.addEventListener('visibilitychange', wake);
  let rt = 0; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { resize(); if (reduced) { for (let i = 0; i < 240; i++) step(1 / 60); draw(false); } }, 150); }, { passive: true });
  const at = (e) => { const r = foot.getBoundingClientRect(); ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top; };
  foot.addEventListener('pointermove', (e) => { at(e); ptr.ton = 1; }, { passive: true });
  foot.addEventListener('pointerdown', (e) => { at(e); ptr.ton = 1; ptr.push = 1; }, { passive: true });
  foot.addEventListener('pointerleave', () => { ptr.ton = 0; });
  foot.addEventListener('pointerup', (e) => { if (e.pointerType === 'touch') setTimeout(() => (ptr.ton = 0), 500); });
  return { destroy: () => { cancelAnimationFrame(raf); cv.remove(); } };
}
