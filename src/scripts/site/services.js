// VERK · Servicios: el isotipo protagonista.
//   · Disciplina activa: la decide la línea media del viewport (IntersectionObserver); 4 = las cuatro integradas.
//   · Progreso continuo p ∈ [0, 1] a lo largo de las disciplinas (scroll, solo con la sección cerca).
//   · Animación procedural (rAF solo con la sección visible): cada barra se traslada por su eje de 45° según
//       base(p)  composición que se interpola de forma continua entre cuatro estados (uno por disciplina) y converge
//                 a cero (el isotipo íntegro) al final, y
//       deriva   suma de senos de periodos inconmensurables por barra (orgánica, nunca idéntica). Su amplitud es la
//                 «energía» del recorrido: crece al desplazarse y se disipa en ~3 s al detenerse (sin bucle infinito de
//                 marca, doc 21 §5), y se apaga al integrarse las cuatro: el sistema «se asienta».
//     El color de la marca se interpola en continuo entre los cuatro tonos y termina en lima.
//   · Reduced-motion: estado final estático.
const KEYS = [[-90, 0, 90], [0, -150, -70], [70, 0, -70], [-50, 50, -50]];          // unidades del viewBox (eje (d, −d))
const COLS = [[15, 15, 15], [240, 238, 233], [15, 15, 15], [240, 238, 233], [191, 234, 0]];   // ink · cream · ink · cream · lima
const TAU = Math.PI * 2;

export function initServices() {
  const sec = document.querySelector('[data-svc]');
  if (!sec || matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  const rows = [...sec.querySelectorAll('.svc')], n = sec.querySelector('.svc-n'), list = sec.querySelector('.svc-rows');
  const mark = sec.querySelector('.svc-mark'), paths = [...mark.querySelectorAll('path')];
  sec.dataset.k = '0';
  let k = 0, p = 0, near = false, visible = false, raf = 0, t = 0, last = 0, done = 0, energy = .6, lastP = 0;
  const set = (v) => { if (v === k) return; k = v; sec.dataset.k = String(v); n.textContent = String(Math.min(4, v + 1)).padStart(2, '0'); };
  const io = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting) set(+e.target.dataset.i); }, { rootMargin: '-48% 0px -48% 0px' });
  rows.forEach((r) => io.observe(r));
  const progress = () => {
    const r = list.getBoundingClientRect(), mid = innerHeight * .5;
    p = Math.min(1, Math.max(0, (mid - r.top) / r.height));
    sec.style.setProperty('--p', p.toFixed(3));
    if (p >= .999) set(4); else if (r.top > mid) set(0);
    energy = Math.min(1, energy + Math.abs(p - lastP) * 25 + .08); lastP = p;
    wake();
  };
  const mix = (a, b, x) => a + (b - a) * x;
  const ease = (x) => x * x * (3 - 2 * x);
  const frame = (now) => {
    raf = 0;
    const dt = last && now - last < 200 ? Math.min(.05, (now - last) / 1000) : 1 / 60; last = now; t += dt;
    done += ((k === 4 ? 1 : 0) - done) * (1 - Math.exp(-dt * 2.2));               // asentamiento suave al integrarse
    energy *= Math.exp(-dt / 1.1);
    const q = Math.min(3, p * 3.2), i0 = Math.min(3, Math.floor(q)), i1 = Math.min(3, i0 + 1), f = ease(q - i0);
    paths.forEach((el, b) => {
      const base = mix(KEYS[i0][b], KEYS[i1][b], f) * (1 - done);
      const drift = (24 * Math.sin(t * TAU / 6.1 + b * 1.7) + 13 * Math.sin(t * TAU / 3.7 - b * 2.3) + 7 * Math.sin(t * TAU / 9.4 + b)) * energy * (1 - .8 * done);
      const d = (base + drift).toFixed(1);
      el.style.transform = `translate(${d}px, ${-d}px)`;
    });
    // color: estable dentro de cada disciplina y cruce breve en la frontera (evita el gris intermedio ink↔cream)
    const c = Math.min(4, k === 4 ? 4 : q), j = Math.min(3, Math.floor(c)), g = ease(Math.min(1, Math.max(0, (c - j - .82) / .18))), A = COLS[j], B = COLS[Math.min(4, j + 1)];
    mark.style.color = `rgb(${A.map((v, x) => Math.round(mix(v, B[x], g)))})`;
    const settling = Math.abs((k === 4 ? 1 : 0) - done) > .002 || energy > .004;
    if (visible && !document.hidden && settling) raf = requestAnimationFrame(frame);
  };
  function wake() { if (!raf && visible && !document.hidden) { last = 0; raf = requestAnimationFrame(frame); } }
  new IntersectionObserver(([e]) => { near = e.isIntersecting; if (near) progress(); }, { rootMargin: '30% 0px' }).observe(sec);
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; wake(); }).observe(mark);
  document.addEventListener('visibilitychange', wake);
  addEventListener('scroll', () => near && progress(), { passive: true });
  progress();
  return { set };
}
