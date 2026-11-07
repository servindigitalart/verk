// VERK · Sistemas · panel de proyecto (se carga al primer gesto sobre el índice).
//   Tres pestañas, cada una con SU contenido y nada más (el escenario se re-renderiza por completo al cambiar de pestaña
//   o de proyecto: no hay capas compartidas ni estado residual entre vistas):
//     Vista         identidad + captura principal (pantalla 1) + nombre, estado y descripción
//     Arquitectura  capas del sistema (barras escalonadas a 45°) + stack
//     Sitio         dos capturas adicionales (pantallas 2 y 3) + «Abrir sitio ↗» (solo con URL pública aprobada)
//   Sin iframes. Máximo dos capturas visibles. El panel se ajusta al viewport: sin scroll interno.
//   <dialog> nativo (foco atrapado, Escape, devolución del foco); pestañas con flechas, Inicio y Fin.
//   Recorrido entre proyectos sin cerrar el panel: ← / → con contador (03 / 10) y, en táctil, deslizar el escenario.
//   Al cerrar, el foco vuelve a la fila del último proyecto visto.
import { esc, iconize } from './icons.js';
const host = (u) => u.replace(/^https?:\/\//, '').replace(/\/$/, '');

export function createPanel({ byId, metrics }) {
  const dlg = document.createElement('dialog');
  dlg.className = 'sys-panel'; dlg.setAttribute('aria-labelledby', 'sp-title');
  document.body.append(dlg);
  const ids = Object.keys(byId);
  let current = null, lastTrigger = null, view = 'vista';
  const linkable = (s) => !!(s.url && !s.pending && !s.embed?.hold);
  const views = (s) => [['vista', 'Vista'], ['arq', 'Arquitectura'], ...(linkable(s) && s.capture ? [['site', 'Sitio']] : [])];
  const link = (s, cls = 'btn btn-lime') => (linkable(s) ? `<a class="${cls}" href="${esc(s.url)}" target="_blank" rel="noopener">Abrir sitio ↗<span class="sr-only"> (${esc(s.name)}, pestaña nueva)</span></a>` : '');
  const plate = (s) => s.logo
    ? `<div class="plate plate-${s.logo.kind}" style="--plate:${s.logo.plate}"><img src="${s.logo.src}" width="${s.logo.w}" height="${s.logo.h}" alt="Logo de ${esc(s.name)}"></div>`
    : `<div class="plate plate-none"><span class="pn-name">${esc(s.name)}</span></div>`;
  const shot = (cls, src, alt) => `<figure class="pfx-shot ${cls}"><img src="${src}" width="1280" height="800" alt="${esc(alt)}" decoding="async"></figure>`;

  // ── escenario: un render por (proyecto, pestaña) ──
  const stage = {
    vista: (s) => `<div class="pfx-v pfx-v--vista${s.capture ? '' : ' is-solo'}">
        <div class="pfx-id">${plate(s)}</div>
        ${s.capture ? shot('pfx-main', s.capture.src, `Página principal de ${s.name}`) : `<p class="pfx-caps label">${esc(s.cap.join(' · '))}</p>`}
        <h2 class="pfx-title" id="sp-title">${esc(s.name)}</h2>
      </div>`,
    arq: (s) => `<div class="pfx-v pfx-v--arq">
        <h2 class="pfx-title pfx-title--sm" id="sp-title">${esc(s.name)} <span class="label">Arquitectura</span></h2>
        <ol class="pfx-arch" aria-label="Capas del sistema">${s.layers.map(([k, v], i) => `<li style="--i:${i}"><b>${String(i + 1).padStart(2, '0')}</b><span><em>${esc(k)}</em>${esc(v)}</span></li>`).join('')}</ol>
      </div>`,
    site: (s) => `<div class="pfx-v pfx-v--site">
        ${shot('pfx-main', s.capture.src2, `Sección de la página de ${s.name}`)}${shot('pfx-second', s.capture.src3, `Otra sección de la página de ${s.name}`)}
        <h2 class="pfx-title pfx-title--sm" id="sp-title">${esc(s.name)} <span class="label">${esc(host(s.url))}</span></h2>
      </div>`,
  };
  const copy = {
    vista: (s) => `${s.title ? `<p class="sp-lead">${esc(s.title)}</p>` : ''}<p class="sp-glosa">${esc(s.glosa)}</p><p>${esc(s.system)}</p>${link(s, 'btn btn-ghost')}`,
    arq: (s) => `<p class="sp-glosa">${esc(s.system)}</p><p class="sp-tech"><span class="label muted">Stack</span> ${esc(s.tech)}</p>`,
    site: (s) => `<p class="sp-glosa">${esc(s.glosa)}</p>${link(s)}`,
  };
  const shell = (s) => {
    const V = views(s);
    return `
    <div class="pfx" data-view="vista">
      <div class="pfx-top">
        <p class="label"><span>${s.id}</span> · <span>${esc(s.cap.join(' · '))}</span> · <span class="st" data-state="${s.state}"><i aria-hidden="true"></i>${esc(s.stateLabel)}</span></p>
        <div class="sp-ctl">
          <button class="sp-step" type="button" data-step="-1" aria-label="Sistema anterior">←</button>
          <span class="sp-count label" aria-live="polite"><span class="sr-only">Sistema </span>${String(ids.indexOf(s.id) + 1).padStart(2, '0')} / ${String(ids.length).padStart(2, '0')}<span class="sr-only">: ${esc(s.name)}</span></span>
          <button class="sp-step" type="button" data-step="1" aria-label="Sistema siguiente">→</button>
          <button class="sp-close label" type="button">Cerrar</button>
        </div>
      </div>
      <div class="pfx-stage"></div>
      <div class="pfx-foot">
        <div class="sp-tabs" role="tablist" aria-label="Vistas de ${esc(s.name)}">
          ${V.map(([, t], i) => `<button role="tab" id="sp-t${i}" aria-controls="sp-p" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" type="button">${t}</button>`).join('')}
        </div>
        <div class="pfx-copy" role="tabpanel" id="sp-p" aria-labelledby="sp-t0" tabindex="0"></div>
      </div>
    </div>`;
  };
  // pinta la pestaña i del proyecto actual (re-render completo: sin contaminación entre vistas ni proyectos)
  const show = (i) => {
    const V = views(current); view = V[i][0];
    dlg.querySelectorAll('[role=tab]').forEach((t, k) => { t.setAttribute('aria-selected', String(k === i)); t.tabIndex = k === i ? 0 : -1; });
    const root = dlg.querySelector('.pfx'); root.dataset.view = view;
    dlg.querySelector('.pfx-stage').innerHTML = iconize(stage[view](current));
    const panel = dlg.querySelector('.pfx-copy'); panel.innerHTML = iconize(copy[view](current)); panel.setAttribute('aria-labelledby', `sp-t${i}`);
  };
  const open = (id, trigger) => {
    const t0 = performance.now();
    current = byId[id]; lastTrigger = trigger;
    dlg.innerHTML = iconize(shell(current));
    show(0);
    if (!dlg.open) dlg.showModal();
    requestAnimationFrame(() => metrics.opened.push({ id, ms: +(performance.now() - t0).toFixed(1) }));
  };
  // recorrido: re-render del mismo panel (sin cerrar ni reabrir) y el foco se queda en el mismo control
  const step = (d) => {
    const id = ids[(ids.indexOf(current.id) + d + ids.length) % ids.length];
    open(id, document.querySelector(`[data-open="${id}"]`) ?? lastTrigger);
    dlg.querySelector('.pfx').dataset.dir = d > 0 ? 'next' : 'prev';
    dlg.querySelector(`.sp-step[data-step="${d}"]`)?.focus();
  };
  // deslizar en táctil sobre el escenario (gesto horizontal claro: ≥ 56 px y dominante sobre el vertical)
  let sx = 0, sy = 0, sid = -1;
  dlg.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse' && e.target.closest('.pfx-stage')) { sx = e.clientX; sy = e.clientY; sid = e.pointerId; } });
  dlg.addEventListener('pointerup', (e) => {
    if (e.pointerId !== sid) return; sid = -1;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) >= 56 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
  });
  dlg.addEventListener('pointercancel', () => (sid = -1));
  const close = () => dlg.close();
  dlg.addEventListener('close', () => { dlg.innerHTML = ''; current = null; lastTrigger?.focus(); });
  dlg.addEventListener('click', (e) => {
    if (e.target === dlg) return close();                            // clic en el fondo
    if (e.target.closest('.sp-close')) return close();
    const st = e.target.closest('.sp-step'); if (st) return step(+st.dataset.step);
    const tab = e.target.closest('[role=tab]');
    if (tab) show([...dlg.querySelectorAll('[role=tab]')].indexOf(tab));
  });
  dlg.addEventListener('keydown', (e) => {
    const tab = e.target.closest('[role=tab]'); if (!tab) return;
    const tabs = [...dlg.querySelectorAll('[role=tab]')], i = tabs.indexOf(tab), L = tabs.length;
    const n = e.key === 'ArrowRight' ? (i + 1) % L : e.key === 'ArrowLeft' ? (i + L - 1) % L : e.key === 'Home' ? 0 : e.key === 'End' ? L - 1 : -1;
    if (n >= 0) { e.preventDefault(); show(n); tabs[n].focus(); }
  });
  return { open, close, isOpen: () => dlg.open };
}
