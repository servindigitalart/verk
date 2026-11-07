// VERK · header adaptativo (Morphing Navigation).
//   geo    la superficie bajo la píldora se lee en el propio evento `scroll` (antes de pintar) → mismo frame
//   shift  al cambiar de superficie, el fondo de la píldora viaja por un degradado origen → acento → destino
//          (mismo sentido que el scroll, 420 ms, una sola animación WAAPI reversible); el texto cambia a mitad.
//   glow   el isotipo de progreso recibe un brillo breve de su propio color en cada cambio de sección
//   prog   el isotipo oficial se construye con el recorrido (--fill, barrido a 45°) y avanza un paso en cada sección
// El marcado del indicador lo emite Header.astro; aquí solo se actualiza el estado.
// Seis bloques de la home (01–06). Tensión no tiene enlace ni nombre en el nav: cuenta solo en el número y el progreso.
const NAMES = { top: 'Inicio', tension: '', servicios: 'Servicios', metodo: 'Método', sistemas: 'Sistemas', contacto: 'Contacto' };
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
  const LAST = ORDER.length - 1;
  const secIndex = (id) => { const i = ORDER.indexOf(id); return i < 0 ? LAST : i; };    // el footer cuenta como Contacto

  const update = () => {
    if (!geo.length) return;
    const y = scrollY;
    const a = at(y + (pTop + pBot) / 2);                                     // la superficie bajo la línea media de la píldora
    if (!menuOpen && pill.dataset.v !== a.v) shift(a.v, y >= lastY ? 1 : -1);
    const mid = y + (pTop + pBot) / 2, cur = at(mid), k = secIndex(cur.id);
    const s = Math.min(1, Math.max(0, (mid - cur.top) / Math.max(1, cur.bottom - cur.top)));
    links.forEach((l) => { const is = l.hash === '#' + ORDER[k]; if (is !== (l.getAttribute('aria-current') === 'true')) is ? l.setAttribute('aria-current', 'true') : l.removeAttribute('aria-current'); });
    const fill = k === 0 ? 0 : k >= LAST ? 1 : (k - 1 + s) / (LAST - 1);
    pill.style.setProperty('--fill', fill.toFixed(4));
    if (k !== active) {
      // al llegar a una sección nueva, las barras del isotipo de la ruta dan un paso por su eje (1-2-3)
      // paso 1-2-3 de las barras. Clase propia del header: «step» colisionaba con la ruta de Método (.step::after,
      // una línea ink de 3 px) y dibujaba una línea negra sobre el isotipo durante 300 ms.
      if (active !== -1) { markEl?.classList.add('prog-step'); clearTimeout(stepT); stepT = setTimeout(() => markEl?.classList.remove('prog-step'), 300); }
      active = k;
      const name = NAMES[ORDER[k]], num = String(k + 1).padStart(2, '0');
      all('[data-name]').forEach((n) => { if (n.textContent !== name) n.textContent = name; });
      all('[data-num]').forEach((n) => { if (n.textContent !== num) n.textContent = num; });
    }
    hide(y);
  };

  // transición cromática: UNA sola animación (Web Animations API) del fondo de la píldora por un degradado
  // origen → acento del destino → destino, en el sentido del scroll (420 ms). Determinista e interrumpible:
  //   · si el destino nuevo es el origen de la animación en curso (el usuario invierte el scroll), la misma animación
  //     se invierte desde su punto actual (sin saltos ni reinicio);
  //   · si es otro destino, se cancela y empieza otra desde el último destino: siempre prevalece el último válido;
  //   · al terminar se limpia el degradado y queda el color sólido de la superficie (sin timeouts pendientes).
  // Texto, CTA y relleno del isotipo cambian con una transición corta a mitad del barrido (CSS). Geometría constante.
  const bg = pill.querySelector('.pill-bg');
  let anim = null, animFrom = '', animTo = '', glowAnim = null, stepT = 0;
  const T = 420, EASE = 'cubic-bezier(.65, 0, .35, 1)';
  const glow = () => {
    if (!markEl) return;
    glowAnim?.cancel();
    glowAnim = markEl.animate([
      { filter: 'drop-shadow(0 0 0 transparent)' },
      { filter: 'drop-shadow(0 0 4px var(--prog)) drop-shadow(0 0 10px color-mix(in srgb, var(--prog) 55%, transparent))', offset: .45 },
      { filter: 'drop-shadow(0 0 0 transparent)' },
    ], { duration: T + 80, easing: 'cubic-bezier(.16, 1, .3, 1)' });
  };
  function shift(v, dir) {
    const prev = pill.dataset.v;
    if (reduced) return set(pill, v);
    if (anim && anim.playState === 'running' && v === animFrom) {    // inversión: la misma animación vuelve atrás
      set(pill, v); [animFrom, animTo] = [animTo, animFrom]; anim.reverse(); glow(); return;
    }
    const from = getComputedStyle(pill).getPropertyValue('--pill-bg').trim();
    set(pill, v);
    const cs = getComputedStyle(pill), to = cs.getPropertyValue('--pill-bg').trim(), acc = cs.getPropertyValue('--prog').trim();
    anim?.cancel();
    if (!from || !bg) return;
    const down = dir > 0;
    bg.style.backgroundImage = `linear-gradient(${down ? 90 : 270}deg, ${from} 0 34%, color-mix(in oklab, ${from}, ${acc} 55%) 44%, ${acc} 50%, color-mix(in oklab, ${to}, ${acc} 55%) 56%, ${to} 66% 100%)`;
    bg.style.backgroundSize = '320% 100%';
    animFrom = prev; animTo = v;
    const a = (anim = bg.animate([{ backgroundPosition: down ? '0% 0' : '100% 0' }, { backgroundPosition: down ? '100% 0' : '0% 0' }], { duration: T, easing: EASE, fill: 'forwards' }));
    a.onfinish = () => { if (anim !== a) return; anim = null; bg.style.backgroundImage = ''; bg.style.backgroundSize = ''; a.cancel(); };
    a.oncancel = () => { if (anim === a || anim === null) { bg.style.backgroundImage = ''; bg.style.backgroundSize = ''; } };
    glow();
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
  // medición en el siguiente frame: el link activo en negrita cambia de ancho y re-dispararía el observador en el mismo ciclo
  let roRaf = 0;
  const ro = new ResizeObserver(() => { cancelAnimationFrame(roRaf); roRaf = requestAnimationFrame(() => { measure(); update(); }); });
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
