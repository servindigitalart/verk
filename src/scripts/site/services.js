// VERK · Servicios: la disciplina activa la decide la línea media del viewport (IntersectionObserver, sin bucle);
// el progreso continuo (--p) se escribe en `scroll` solo mientras la sección está cerca. 4 = «un sistema».
export function initServices() {
  const sec = document.querySelector('[data-svc]');
  if (!sec || matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  const rows = [...sec.querySelectorAll('.svc')], n = sec.querySelector('.svc-n');
  sec.dataset.k = '0';
  let k = 0, near = false;
  const set = (v) => { if (v === k) return; k = v; sec.dataset.k = String(v); n.textContent = String(Math.min(4, v + 1)).padStart(2, '0'); };
  const io = new IntersectionObserver((es) => {
    for (const e of es) if (e.isIntersecting) set(+e.target.dataset.i);
    // por debajo de la última fila: todas integradas
    const last = rows.at(-1).getBoundingClientRect();
    if (last.bottom < innerHeight * .5) set(4);
  }, { rootMargin: '-48% 0px -48% 0px' });
  rows.forEach((r) => io.observe(r));
  const list = sec.querySelector('.svc-rows');
  const progress = () => {
    const r = list.getBoundingClientRect(), mid = innerHeight * .5;
    const p = Math.min(1, Math.max(0, (mid - r.top) / r.height));
    sec.style.setProperty('--p', p.toFixed(3));
    if (p >= .999 && k !== 4) set(4);
    if (r.top > mid && k !== 0) set(0);
  };
  new IntersectionObserver(([e]) => { near = e.isIntersecting; if (near) progress(); }, { rootMargin: '30% 0px' }).observe(sec);
  addEventListener('scroll', () => near && progress(), { passive: true });
  progress();
  return { set };
}
