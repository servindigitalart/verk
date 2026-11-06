// VERK · header adaptativo (Morphing Navigation).
//   geo    la superficie bajo la píldora se lee en el propio evento `scroll` (antes de pintar) → mismo frame
//   shift  al cambiar de superficie, el fondo de la píldora viaja por un degradado origen → acento → destino
//          (mismo sentido que el scroll); el texto cambia de color a mitad del barrido. Geometría constante.
//   glow   el isotipo de progreso recibe un brillo breve de su propio color en cada cambio de sección
//   prog   el isotipo oficial se construye con el recorrido (--fill, barrido a 45°) y avanza un paso en cada sección
// El marcado del indicador lo emite Header.astro; aquí solo se actualiza el estado.
const NAMES = { top: 'Inicio', servicios: 'Servicios', metodo: 'Método', sistemas: 'Sistemas', contacto: 'Contacto' };
const ORDER = Object.keys(NAMES);

export function initHeader() {
  const header = document.querySelector('[data-nav-root]');
  if (!header) return null;
  const pill = header.querySelector('[data-pill]');
  const linksBox = pill.querySelector('.nav-links');
  const links = [...linksBox.querySelectorAll('a[href^="#"]')];
  const sections = [...document.querySelectorAll('[data-surface]')].filter((s) => !s.parentElement.closest('[data-surface]'));
  const cleanup = [], reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const on = (t, e, f, o) => { t.addEventListener(e, f, o); cleanup.push(() => t.removeEventListener(e, f, o)); };
  let menuOpen = false;

  const all = (sel) => pill.querySelectorAll(sel);
  const markEl = pill.querySelector('.prog-mark');
  const set = (el, v) => { if (el.dataset.v !== v) el.dataset.v = v; };

  // ── geometría (solo al cambiar el layout) ──
  let geo = [], pTop = 0, pBot = 0, lastY = scrollY, active = -1;
  const measure = () => {
    const y = scrollY;
    geo = sections.map((s) => { const r = s.getBoundingClientRect(); return { top: r.top + y, bottom: r.bottom + y, v: s.dataset.surface, id: s.id }; });
    pTop = header.offsetTop + pill.offsetTop; pBot = pTop + pill.offsetHeight;
  };
  const at = (y) => { let hit = geo[0]; for (const g of geo) { if (g.top <= y) hit = g; else break; } return hit; };
  const secIndex = (id) => { const i = ORDER.indexOf(id); return i < 0 ? 4 : i; };    // el footer cuenta como Contacto

  const update = () => {
    if (!geo.length) return;
    const y = scrollY;
    const a = at(y + (pTop + pBot) / 2);                                     // la superficie bajo la línea media de la píldora
    if (!menuOpen && pill.dataset.v !== a.v) shift(a.v, y >= lastY ? 1 : -1);
    const mid = y + (pTop + pBot) / 2, cur = at(mid), k = secIndex(cur.id);
    const s = Math.min(1, Math.max(0, (mid - cur.top) / Math.max(1, cur.bottom - cur.top)));
    links.forEach((l, i) => { const is = i === k - 1; if (is !== (l.getAttribute('aria-current') === 'true')) is ? l.setAttribute('aria-current', 'true') : l.removeAttribute('aria-current'); });
    const fill = k === 0 ? 0 : k >= 4 ? 1 : (k - 1 + s) / 3;
    pill.style.setProperty('--fill', fill.toFixed(4));
    if (k !== active) {
      // al llegar a una sección nueva, las barras del isotipo de la ruta dan un paso por su eje (1-2-3)
      if (active !== -1) { all('.prog-mark').forEach((m) => m.classList.add('step')); setTimeout(() => all('.prog-mark').forEach((m) => m.classList.remove('step')), 300); }
      active = k;
      const name = NAMES[ORDER[k]], num = String(k + 1).padStart(2, '0');
      all('[data-name]').forEach((n) => { if (n.textContent !== name) n.textContent = name; });
      all('[data-num]').forEach((n) => { if (n.textContent !== num) n.textContent = num; });
    }
    hide(y);
  };

  // transición cromática: el fondo recorre un degradado del color de origen al de destino pasando por el acento
  // del destino; el texto y el CTA cambian a mitad del recorrido (CSS). Se reinicia limpiamente si llega otro cambio.
  let shiftT = 0;
  function shift(v, dir) {
    const from = getComputedStyle(pill).getPropertyValue('--pill-bg').trim();
    set(pill, v);
    if (reduced || !from) return;
    const cs = getComputedStyle(pill);
    pill.style.setProperty('--from', from); pill.style.setProperty('--to', cs.getPropertyValue('--pill-bg').trim());
    pill.style.setProperty('--acc', cs.getPropertyValue('--prog').trim()); pill.style.setProperty('--dir', dir);
    pill.classList.remove('shift'); markEl?.classList.remove('glow'); void pill.offsetWidth;
    pill.classList.add('shift'); markEl?.classList.add('glow');
    clearTimeout(shiftT); shiftT = setTimeout(() => { pill.classList.remove('shift'); markEl?.classList.remove('glow'); }, 900);
  }
  // ── móvil: oculta al bajar, aparece al subir (nunca durante un viaje de navegación) ──
  const mobile = matchMedia('(max-width: 767px)');
  const hide = (y) => {
    if (!mobile.matches || menuOpen || document.documentElement.dataset.travel) { header.classList.remove('is-hidden'); lastY = y; return; }
    if (y > lastY + 4 && y > 80) header.classList.add('is-hidden');
    else if (y < lastY - 4) header.classList.remove('is-hidden');
    lastY = y;
  };
  on(header, 'focusin', () => header.classList.remove('is-hidden'));      // el foco de teclado nunca queda oculto

  measure(); update();
  on(window, 'scroll', update, { passive: true });
  on(window, 'resize', () => { measure(); update(); });
  const ro = new ResizeObserver(() => { measure(); update(); });
  sections.forEach((s) => ro.observe(s)); ro.observe(linksBox); cleanup.push(() => ro.disconnect());
  document.fonts?.ready.then(() => { measure(); update(); });

  // ── overlay móvil: inert en el resto, Escape, devolución del foco ──
  const toggle = pill.querySelector('.nav-toggle'), menu = document.getElementById(toggle?.getAttribute('aria-controls'));
  if (toggle && menu) {
    const rest = [...document.body.children].filter((n) => n !== header && n !== menu && n.tagName !== 'SCRIPT');
    const close = (focus = true) => { menuOpen = false; menu.hidden = true; toggle.setAttribute('aria-expanded', 'false'); toggle.textContent = 'Menú'; rest.forEach((n) => (n.inert = false)); update(); if (focus) toggle.focus(); };
    on(toggle, 'click', () => {
      if (menuOpen) return close();
      set(pill, 'ink'); menuOpen = true; menu.hidden = false; toggle.setAttribute('aria-expanded', 'true'); toggle.textContent = 'Cerrar';
      rest.forEach((n) => (n.inert = true)); header.classList.remove('is-hidden'); menu.querySelector('a')?.focus();
    });
    on(menu, 'click', (e) => { if (e.target.closest('a')) close(false); });
    on(document, 'keydown', (e) => { if (e.key === 'Escape' && menuOpen) close(); });
  }
  return { pill, destroy: () => cleanup.forEach((f) => f()) };
}
