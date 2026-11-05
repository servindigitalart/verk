// VERK · header adaptativo (portado de lab/f3-generative-experience/core/header.js; indicador A+B «ruta + isotipo»).
//   geo   la superficie bajo la píldora se lee en el propio evento `scroll` (antes de pintar) → mismo frame
//   wipe  el borde de la sección atraviesa la píldora ligado al scroll: una copia decorativa recortada por el borde
//   ruta  nodos por sección + progreso continuo; el isotipo oficial recorre la ruta (variables CSS en .pill que el
//         clon del wipe hereda: nunca se desincronizan)
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
  const cleanup = [];
  const on = (t, e, f, o) => { t.addEventListener(e, f, o); cleanup.push(() => t.removeEventListener(e, f, o)); };
  let menuOpen = false;

  // ── clon decorativo para el wipe ──
  const clone = pill.cloneNode(true);
  clone.removeAttribute('data-pill'); clone.classList.add('pill-clone'); clone.setAttribute('aria-hidden', 'true'); clone.inert = true;
  clone.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'));
  pill.append(clone);
  const all = (sel) => pill.querySelectorAll(sel);
  const set = (el, v) => { if (el.dataset.v !== v) el.dataset.v = v; };

  // ── geometría (solo al cambiar el layout) ──
  let geo = [], pTop = 0, pBot = 0, lastY = scrollY, X = [0, 0, 0, 0], active = -1;
  const measure = () => {
    const y = scrollY;
    geo = sections.map((s) => { const r = s.getBoundingClientRect(); return { top: r.top + y, bottom: r.bottom + y, v: s.dataset.surface, id: s.id }; });
    pTop = header.offsetTop + pill.offsetTop; pBot = pTop + pill.offsetHeight;
    X = links.map((a) => a.offsetLeft + a.offsetWidth / 2);
    pill.style.setProperty('--x0', `${X[0]}px`); pill.style.setProperty('--x3', `${X[3]}px`);
    all('.nav-links .route b').forEach((b, i) => (b.style.left = `${X[i % 4] - X[0]}px`));
  };
  const at = (y) => { let hit = geo[0]; for (const g of geo) { if (g.top <= y) hit = g; else break; } return hit; };
  const secIndex = (id) => { const i = ORDER.indexOf(id); return i < 0 ? 4 : i; };    // el footer cuenta como Contacto

  const update = () => {
    if (!geo.length) return;
    const y = scrollY;
    const a = at(y + pTop), b = at(y + pBot - .5);
    if (!menuOpen) set(pill, a.v);
    if (a.v !== b.v) { set(clone, b.v); clone.style.setProperty('--cut', `${Math.max(0, b.top - y - pTop)}px`); clone.classList.add('on'); }
    else clone.classList.remove('on');
    const mid = y + (pTop + pBot) / 2, cur = at(mid), k = secIndex(cur.id);
    const s = Math.min(1, Math.max(0, (mid - cur.top) / Math.max(1, cur.bottom - cur.top)));
    links.forEach((l, i) => { const is = i === k - 1; if (is !== (l.getAttribute('aria-current') === 'true')) is ? l.setAttribute('aria-current', 'true') : l.removeAttribute('aria-current'); });
    const fill = k === 0 ? 0 : k >= 4 ? 1 : (k - 1 + s) / 3;
    pill.style.setProperty('--fill', fill.toFixed(4));
    pill.style.setProperty('--rx', `${(fill * (X[3] - X[0])).toFixed(1)}px`);
    pill.style.setProperty('--rmx', `${(fill * 64).toFixed(1)}px`);
    all('.route b').forEach((n, i) => n.classList.toggle('on', k >= 1 && (i % 4) <= k - 1));
    if (k !== active) {
      // al llegar a una sección nueva, las barras del isotipo de la ruta dan un paso por su eje (1-2-3)
      if (active !== -1) { all('.imark').forEach((m) => m.classList.add('step')); setTimeout(() => all('.imark').forEach((m) => m.classList.remove('step')), 260); }
      active = k;
      const name = NAMES[ORDER[k]];
      all('[data-name]').forEach((n) => { if (n.textContent !== name) n.textContent = name; });
    }
    hide(y);
  };

  // ── móvil: oculta al bajar, aparece al subir ──
  const mobile = matchMedia('(max-width: 767px)');
  const hide = (y) => {
    if (!mobile.matches || menuOpen) { header.classList.remove('is-hidden'); lastY = y; return; }
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
      set(pill, 'ink'); clone.classList.remove('on'); menuOpen = true; menu.hidden = false; toggle.setAttribute('aria-expanded', 'true'); toggle.textContent = 'Cerrar';
      rest.forEach((n) => (n.inert = true)); header.classList.remove('is-hidden'); menu.querySelector('a')?.focus();
    });
    on(menu, 'click', (e) => { if (e.target.closest('a')) close(false); });
    on(document, 'keydown', (e) => { if (e.key === 'Escape' && menuOpen) close(); });
  }
  return { pill, clone, destroy: () => cleanup.forEach((f) => f()) };
}
