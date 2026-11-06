// VERK · Método: la ruta se construye con el scroll en todos los navegadores (antes: CSS scroll-driven + respaldo).
// Escribe por paso --route (0–1), data-run (la cabeza avanza), data-on (paso activo) y data-done (completo);
// cuando el último paso se completa, .steps recibe data-done (el isotipo se ensambla al final de la línea).
// Solo escucha `scroll` mientras la sección está cerca del viewport. Reduced-motion: CSS deja la ruta completa.
export function initMethodRoute() {
  const steps = document.querySelector('.steps');
  if (!steps || matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  steps.dataset.live = '';
  const items = [...steps.querySelectorAll('.step')];
  const update = () => {
    const vh = innerHeight;
    // cada paso se dibuja mientras su borde superior recorre la franja 85 % → 55 % del viewport, en secuencia
    let allDone = true;
    items.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      const lag = innerWidth >= 1024 ? i * .09 * vh : 0;        // en fila: escalonado; en columna: cada uno con su posición
      const s = Math.min(1, Math.max(0, (vh * .85 - r.top - lag) / (vh * .3)));
      el.style.setProperty('--route', s.toFixed(3));
      el.toggleAttribute('data-run', s > 0 && s < 1);
      el.toggleAttribute('data-on', s > .02 && s < 1);
      el.toggleAttribute('data-done', s >= 1);
      if (s < 1) allDone = false;
    });
    steps.toggleAttribute('data-done', allDone);
  };
  let near = false;
  new IntersectionObserver(([e]) => { near = e.isIntersecting; if (near) update(); }, { rootMargin: '25% 0px' }).observe(steps);
  addEventListener('scroll', () => near && update(), { passive: true });
  addEventListener('resize', update, { passive: true });
  update();
  return { update };
}
