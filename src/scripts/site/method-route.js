// VERK · Método: respaldo JS de la ruta ligada al scroll para navegadores sin CSS scroll-driven animations
// (Firefox estable y Safari < 26: `animation-timeline` no existe y la ruta aparecía completa desde el inicio).
// Reproduce los mismos rangos que site.css (view-timeline de .steps) y escribe un valor por paso: sin rAF continuo,
// solo en `scroll` mientras la sección está cerca del viewport.
const RANGES = [['entry', .10, 'cover', .25], ['cover', .25, 'cover', .33], ['cover', .33, 'cover', .41], ['cover', .41, 'cover', .49]];

export function initMethodRoute() {
  const steps = document.querySelector('.steps');
  if (!steps || CSS.supports('animation-timeline: view()') || matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  const items = [...steps.children];
  steps.classList.add('steps-js');
  const update = () => {
    const r = steps.getBoundingClientRect(), vh = innerHeight, span = vh + r.height;
    const cover = (vh - r.top) / span;                           // progreso «cover» de view(): 0 al entrar, 1 al salir
    const at = (name, k) => (name === 'entry' ? k * Math.min(r.height, vh) / span : k);
    RANGES.forEach(([a, ka, b, kb], i) => {
      const s0 = at(a, ka), s1 = at(b, kb), s = Math.min(1, Math.max(0, (cover - s0) / (s1 - s0)));
      items[i]?.style.setProperty('--route', s.toFixed(3));
      items[i]?.toggleAttribute('data-on', s > .3);
    });
  };
  let near = false;
  new IntersectionObserver(([e]) => { near = e.isIntersecting; if (near) update(); }, { rootMargin: '20% 0px' }).observe(steps);
  addEventListener('scroll', () => near && update(), { passive: true });
  addEventListener('resize', update, { passive: true });
  update();
  return { update };
}
