// VERK · Sistemas: interacción del índice editorial (portado de lab/f3-generative-experience/portfolio/portfolio.js).
// Mejora progresiva: todo el contenido ya está en el HTML.
//   · Índice: el visor sigue al hover y al foco del teclado (sin abrir nada).
//   · Panel de exploración: <dialog> nativo (foco atrapado, Escape, devolución del foco). Pestañas accesibles:
//       Vista · Arquitectura · En vivo. «Ampliar» lleva el panel a pantalla completa.
//   · En vivo: el iframe se crea SOLO al seleccionar un proyecto cuyo sitio permite embeberse (comprobado, ver
//     src/data/systems.js). Si lo bloquea, se explica el motivo y se ofrece abrirlo fuera: nunca se simula.
//     Nunca hay más de un iframe; se destruye al cerrar o cambiar de sistema.
import { esc, iconize } from './icons.js';
const host = (u) => u.replace(/^https?:\/\//, '').replace(/\/$/, '');

export function initPortfolio() {
  const dataEl = document.getElementById('sys-data');
  if (!dataEl) return null;
  const { checked, systems } = JSON.parse(dataEl.textContent);
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

  // ── panel ──
  const dlg = document.createElement('dialog');
  dlg.className = 'sys-panel'; dlg.setAttribute('aria-labelledby', 'sp-title');
  document.body.append(dlg);
  let current = null, lastTrigger = null;
  const canEmbed = (s) => !!(s.url && s.embed?.embeddable && !s.embed.hold);
  const plateHTML = (s) => s.logo
    ? `<div class="plate plate-${s.logo.kind}" style="--plate:${s.logo.plate}"><img src="${s.logo.src}" width="${s.logo.w}" height="${s.logo.h}" alt="Logo de ${esc(s.name)}"></div>`
    : `<div class="plate plate-none"><span class="pn-name">${esc(s.name)}</span><span class="pn-note">Logo pendiente ⏳</span></div>`;
  const shot = (s) => `<figure class="sp-shot"><img src="${s.capture.src}" width="${s.capture.w}" height="${s.capture.h}" alt="Captura de la portada pública de ${esc(s.name)}" loading="lazy" decoding="async"><figcaption class="label muted">Captura de la portada pública · ${esc(s.capture.date)} · no es una vista en vivo</figcaption></figure>`;
  const link = (s, compact = false) => {
    if (!s.url) return '';
    if (s.pending) return `<span class="label">${esc(host(s.url))} · ${esc(s.urlNote ?? '⏳')}</span>`;
    return `<a class="${compact ? 'sp-ext label' : 'btn btn-lime'}" href="${esc(s.url)}" target="_blank" rel="noopener">Abrir sitio ↗</a>`;
  };
  // Vista en vivo, o el motivo por el que no existe (integrado en el mismo marco, sin imitar una página)
  const live = (s) => {
    const frame = (inner, url = '') => `<div class="sp-browser"><div class="sp-url label"><span>${url ? esc(host(url)) : 'Sin sitio público'}</span>${url && !s.pending ? link(s, true) : ''}</div>${inner}</div>`;
    if (!s.url) return frame(`<div class="sp-blocked">${plateHTML(s)}<p class="sp-why"><span class="label">Sin vista en vivo</span> ${esc(s.urlNote ?? 'Este sistema no tiene un sitio público.')}</p></div>`);
    if (s.embed?.hold) return frame(`<div class="sp-blocked">${plateHTML(s)}<p class="sp-why"><span class="label">En espera ⏳</span> ${esc(s.embed.hold)}.</p></div>`, s.url);
    if (!s.embed?.embeddable) return frame(`<div class="sp-blocked">${s.capture ? shot(s) : plateHTML(s)}<p class="sp-why"><span class="label">No embebible</span> El sitio impide mostrarse dentro de otra página (<code>${esc(s.embed?.header ?? 'política desconocida')}</code>, comprobado el ${esc(checked)}). Se abre en una pestaña nueva.</p>${link(s)}</div>`, s.url);
    return frame(`<div class="sp-frame" data-src="${esc(s.url)}"><p class="sp-loading label">Cargando ${esc(host(s.url))}…</p></div>`, s.url);
  };
  const render = (s) => {
    const tabs = ['Vista', 'Arquitectura', 'En vivo'];
    const first = canEmbed(s) ? 2 : 0;
    return `
    <div class="sp-top">
      <p class="label"><span>${s.id}</span> · <span>${esc(s.cap.join(' · '))}</span> · <span class="st" data-state="${s.state}"><i aria-hidden="true"></i>${esc(s.stateLabel)}${s.statePending ? ' ⏳' : ''}</span></p>
      <div class="sp-tools"><button class="sp-wide label" type="button" aria-pressed="false">Ampliar</button><button class="sp-close label" type="button">Cerrar</button></div>
    </div>
    <h2 class="sp-title" id="sp-title">${esc(s.name)}</h2>
    <div class="sp-body">
      <div class="sp-stage">
        <div class="sp-tabs" role="tablist" aria-label="Vistas de ${esc(s.name)}">
          ${tabs.map((t, i) => `<button role="tab" id="sp-t${i}" aria-controls="sp-p${i}" aria-selected="${i === first}" tabindex="${i === first ? 0 : -1}" type="button">${t}${i === 2 && canEmbed(s) ? ' <i class="sp-dot" aria-hidden="true"></i>' : ''}</button>`).join('')}
        </div>
        <div class="sp-pane" role="tabpanel" id="sp-p0" aria-labelledby="sp-t0" tabindex="0"${first === 0 ? '' : ' hidden'}>
          ${plateHTML(s)}
          ${s.capture ? shot(s) : s.logo?.preview ? `<figure class="sp-prev"><img src="${s.logo.preview.src}" width="${s.logo.preview.w}" height="${s.logo.preview.h}" alt="${esc(s.logo.preview.label)} de ${esc(s.name)}"><figcaption class="label muted">${esc(s.logo.preview.label)}</figcaption></figure>`
            : `<div class="sp-shot-pending"><span class="label">Captura del producto pendiente ⏳</span><span class="label muted">Aún no hay capturas autorizadas de este sistema.</span></div>`}
        </div>
        <div class="sp-pane" role="tabpanel" id="sp-p1" aria-labelledby="sp-t1" tabindex="0" hidden>
          <ol class="layers">${s.layers.map(([k, v], i) => `<li><span class="ly-n">${String(i + 1).padStart(2, '0')}</span><span class="ly-k">${esc(k)}</span><span class="ly-v">${esc(v)}</span></li>`).join('')}</ol>
          <p class="sp-tech"><span class="label muted">Stack</span> ${esc(s.tech)}</p>
        </div>
        <div class="sp-pane" role="tabpanel" id="sp-p2" aria-labelledby="sp-t2" tabindex="0"${first === 2 ? '' : ' hidden'}>${live(s)}</div>
      </div>
      <div class="sp-text">
        ${s.title ? `<p class="sp-lead">${esc(s.title)}</p>` : ''}
        <p class="sp-glosa">${esc(s.glosa)}</p>
        <p>${esc(s.system)}</p>
        ${s.pending ? '<p class="label">⏳ Contenido pendiente de aprobación</p>' : ''}
        <p class="sp-links">${link(s)}</p>
      </div>
    </div>`;
  };

  // Crea el iframe del sitio seleccionado (una sola vez por apertura)
  const mount = () => {
    const box = dlg.querySelector('.sp-frame[data-src]'); if (!box || box.querySelector('iframe')) return;
    const t0 = performance.now(), f = document.createElement('iframe');
    f.src = box.dataset.src; f.title = `${current.name}: sitio en vivo`; f.loading = 'eager';
    f.referrerPolicy = 'no-referrer'; f.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups');
    f.addEventListener('load', () => { box.classList.add('is-loaded'); metrics.iframeLoads.push({ id: current?.id, ms: +(performance.now() - t0).toFixed(0) }); }, { once: true });
    box.append(f);
  };
  const selectTab = (i) => {
    dlg.querySelectorAll('[role=tab]').forEach((t, k) => { t.setAttribute('aria-selected', String(k === i)); t.tabIndex = k === i ? 0 : -1; });
    dlg.querySelectorAll('[role=tabpanel]').forEach((p, k) => (p.hidden = k !== i));
    if (i === 2) mount();
  };
  const open = (id, trigger) => {
    const t0 = performance.now();
    current = byId[id]; lastTrigger = trigger;
    dlg.innerHTML = iconize(render(current));
    dlg.classList.remove('wide');
    dlg.showModal();
    // seleccionar el proyecto = pedir su vista en vivo; el iframe se crea después de pintar el panel (no bloquea la respuesta al toque)
    if (canEmbed(current)) { const id0 = current.id; requestAnimationFrame(() => setTimeout(() => { if (dlg.open && current?.id === id0) mount(); }, 0)); }
    requestAnimationFrame(() => metrics.opened.push({ id, ms: +(performance.now() - t0).toFixed(1) }));
  };
  const close = () => dlg.close();
  dlg.addEventListener('close', () => { dlg.innerHTML = ''; current = null; lastTrigger?.focus(); });
  dlg.addEventListener('click', (e) => {
    if (e.target === dlg) return close();                            // clic en el fondo
    if (e.target.closest('.sp-close')) return close();
    const w = e.target.closest('.sp-wide');
    if (w) { const on = dlg.classList.toggle('wide'); w.setAttribute('aria-pressed', String(on)); w.textContent = on ? 'Reducir' : 'Ampliar'; return; }
    const tab = e.target.closest('[role=tab]');
    if (tab) selectTab([...dlg.querySelectorAll('[role=tab]')].indexOf(tab));
  });
  dlg.addEventListener('keydown', (e) => {
    const tab = e.target.closest('[role=tab]'); if (!tab) return;
    const tabs = [...dlg.querySelectorAll('[role=tab]')], i = tabs.indexOf(tab);
    const n = e.key === 'ArrowRight' ? (i + 1) % 3 : e.key === 'ArrowLeft' ? (i + 2) % 3 : e.key === 'Home' ? 0 : e.key === 'End' ? 2 : -1;
    if (n >= 0) { e.preventDefault(); selectTab(n); tabs[n].focus(); }
  });
  document.addEventListener('click', (e) => { const b = e.target.closest('[data-open]'); if (b && !dlg.open) open(b.dataset.open, b); });
  return { open, close, systems };
}
