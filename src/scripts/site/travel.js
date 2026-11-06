// VERK · navegación espacial entre secciones. Todos los enlaces internos (#servicios, #metodo, #sistemas, #contacto,
// #top) viajan en lugar de saltar:
//   · curva de movimiento en pantalla de doc 21 §13 (cubic-bezier .77,0,.175,1), duración según la distancia (≤ 900 ms)
//   · tres barras a 45° del color de la superficie de destino cruzan el viewport (la geometría del isotipo, §14)
//   · etiqueta de destino junto al header; al llegar, la sección recibe un acento de entrada y el foco
// Interrumpible: otro clic re-dirige desde la posición actual; rueda, toque o tecla cancelan el viaje.
// Sin JS o con reduced-motion: el enlace nativo (salto + foco del navegador). El href nunca se altera.
const EASE = bezier(.77, 0, .175, 1);
const NAMES = { top: 'Inicio', servicios: 'Servicios', metodo: 'Método', sistemas: 'Sistemas', contacto: 'Contacto' };

export function initTravel() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  const root = document.documentElement;
  const fx = document.createElement('div');
  fx.className = 'travel'; fx.setAttribute('aria-hidden', 'true');
  fx.innerHTML = '<i></i><i></i><i></i><span class="travel-tag"><b></b><span></span></span>';
  document.body.append(fx);
  let raf = 0, run = null;

  const stop = () => { cancelAnimationFrame(raf); raf = 0; run = null; delete root.dataset.travel; fx.classList.remove('on'); };
  const go = (target, id) => {
    const from = scrollY, header = document.querySelector('[data-nav-root]');
    const to = Math.max(0, Math.min(target.getBoundingClientRect().top + scrollY, document.documentElement.scrollHeight - innerHeight));
    const d = Math.abs(to - from); if (d < 2) return arrive(target, id);
    const T = Math.min(900, 420 + d * .09);
    const t0 = performance.now();
    run = { target, id };
    root.dataset.travel = id;
    fx.dataset.v = target.dataset.surface || 'cream';
    fx.style.setProperty('--dir', to > from ? 1 : -1);
    fx.querySelector('b').textContent = String(Object.keys(NAMES).indexOf(id) + 1).padStart(2, '0');
    fx.querySelector('.travel-tag span').textContent = NAMES[id] ?? '';
    fx.classList.remove('on'); void fx.offsetWidth; fx.classList.add('on');
    header?.classList.remove('is-hidden');
    cancelAnimationFrame(raf);
    const step = (now) => {
      const k = Math.min(1, (now - t0) / T);
      scrollTo(0, from + (to - from) * EASE(k));
      if (k < 1) raf = requestAnimationFrame(step); else { raf = 0; arrive(target, id); }
    };
    raf = requestAnimationFrame(step);
  };
  const arrive = (target, id) => {
    stop();
    if (location.hash !== '#' + id) history.pushState(null, '', '#' + id);
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    target.removeAttribute('data-arrive'); void target.offsetWidth; target.setAttribute('data-arrive', '');
    setTimeout(() => target.removeAttribute('data-arrive'), 1200);
    target.dispatchEvent(new CustomEvent('verk:arrive', { bubbles: true }));
  };

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const id = decodeURIComponent(a.getAttribute('href').slice(1));
    const target = id && document.getElementById(id);
    if (!target || id === 'main') return;                                       // el salto al contenido sigue siendo nativo
    e.preventDefault();
    go(target, id);
  });
  // el usuario retoma el control: cancelar
  for (const ev of ['wheel', 'touchstart', 'keydown']) addEventListener(ev, () => run && stop(), { passive: true });
  return { go, stop };
}

// cubic-bezier → función de tiempo (Newton-Raphson + bisección, como los navegadores)
function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const X = (t) => ((ax * t + bx) * t + cx) * t, Y = (t) => ((ay * t + by) * t + cy) * t, dX = (t) => (3 * ax * t + 2 * bx) * t + cx;
  return (x) => {
    let t = x;
    for (let i = 0; i < 6; i++) { const e = X(t) - x, d = dX(t); if (Math.abs(e) < 1e-5) return Y(t); if (Math.abs(d) < 1e-6) break; t -= e / d; }
    let lo = 0, hi = 1; t = x;
    for (let i = 0; i < 20; i++) { const v = X(t); if (Math.abs(v - x) < 1e-5) break; v < x ? (lo = t) : (hi = t); t = (lo + hi) / 2; }
    return Y(t);
  };
}
