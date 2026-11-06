// VERK · Sistemas: interacción del índice editorial (portado de lab/f3-generative-experience/portfolio/portfolio.js).
// Mejora progresiva: todo el contenido ya está en el HTML.
//   · Índice: el visor sigue al hover y al foco del teclado (sin abrir nada).
//   · Panel «Project Frames»: src/scripts/site/panel.js, cargado al primer gesto sobre el índice.

export function initPortfolio() {
  const dataEl = document.getElementById('sys-data');
  if (!dataEl) return null;
  const { systems } = JSON.parse(dataEl.textContent);
  const byId = Object.fromEntries(systems.map((s) => [s.id, s]));
  const metrics = { opened: [], iframeLoads: [] };
  if (/[?&]debug\b/.test(location.search)) window.__pf = metrics;

  // ── visor del índice ──
  for (const pf of document.querySelectorAll('[data-pf]')) {
    let cur = null;
    const show = (id) => {
      if (id === cur) return; cur = id;
      pf.querySelectorAll('.ix-card').forEach((c) => (c.hidden = c.dataset.id !== id));
      pf.querySelectorAll('.ix-btn').forEach((b) => (b.dataset.open === id ? b.setAttribute('aria-current', 'true') : b.removeAttribute('aria-current')));
    };
    pf.addEventListener('pointerover', (e) => { const b = e.target.closest('.ix-btn'); if (b) show(b.dataset.open); });
    pf.addEventListener('focusin', (e) => { const b = e.target.closest('.ix-btn'); if (b) show(b.dataset.open); });
  }

  // panel: el código se descarga al primer gesto sobre el índice (precarga en hover/foco) y abre en el clic
  let panel = null;
  const load = () => (panel ??= import('./panel.js').then((m) => m.createPanel({ byId, metrics })));
  const list = document.querySelector('[data-pf]');
  list?.addEventListener('pointerover', load, { once: true });
  list?.addEventListener('focusin', load, { once: true });
  document.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-open]'); if (!b) return;
    const p = await load(); if (!p.isOpen()) p.open(b.dataset.open, b);
  });
  return { systems };
}
