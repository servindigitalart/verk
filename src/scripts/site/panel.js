// VERK · Sistemas · panel de exploración «Project Frames» (se carga al primer gesto sobre el índice, no en la carga).
//   <dialog> nativo (foco atrapado, Escape, devolución del foco), pestañas accesibles (Vista · Arquitectura · En vivo/Sitio).
//   En vivo: iframe SOLO para sitios que permiten embeberse, creado tras pintar el panel; uno como máximo, se destruye al
//   cerrar. Sitios que bloquean el embebido: capturas reales + «Abrir sitio» (nunca se simula una vista en vivo).
import { esc, iconize } from './icons.js';
const host = (u) => u.replace(/^https?:\/\//, '').replace(/\/$/, '');

export function createPanel({ byId, metrics }) {
  // ── panel ──
  const dlg = document.createElement('dialog');
  dlg.className = 'sys-panel'; dlg.setAttribute('aria-labelledby', 'sp-title');
  document.body.append(dlg);
  let current = null, lastTrigger = null;
  const canEmbed = (s) => !!(s.url && s.embed?.embeddable && !s.embed.hold);
  const plateHTML = (s) => s.logo
    ? `<div class="plate plate-${s.logo.kind}" style="--plate:${s.logo.plate}"><img src="${s.logo.src}" width="${s.logo.w}" height="${s.logo.h}" alt="Logo de ${esc(s.name)}"></div>`
    : `<div class="plate plate-none"><span class="pn-name">${esc(s.name)}</span></div>`;
  // Enlace externo: solo con URL pública y contenido aprobado (Los Fibos queda sin enlace mientras siga en revisión)
  const linkable = (s) => !!(s.url && !s.pending && !s.embed?.hold);
  const link = (s, cls = 'btn btn-lime') => linkable(s) ? `<a class="${cls}" href="${esc(s.url)}" target="_blank" rel="noopener">Abrir sitio ↗</a>` : '';
  // Vistas disponibles: «En vivo» solo si el sitio permite embeberse; «Sitio» (capturas reales + enlace) si lo bloquea
  const views = (s) => [['vista', 'Vista'], ['arq', 'Arquitectura'], ...(canEmbed(s) ? [['live', 'En vivo']] : linkable(s) && s.capture ? [['site', 'Sitio']] : [])];
  const fig = (cls, src, alt, w = 1280, h = 800) => `<figure class="pfx-l ${cls}"><img src="${src}" width="${w}" height="${h}" alt="${esc(alt)}" decoding="async"></figure>`;
  const render = (s) => {
    const V = views(s), first = canEmbed(s) ? V.length - 1 : 0;
    const cap = s.capture, prev = s.logo?.preview, solo = !cap && !prev;
    const layers = s.layers.map(([k, v], i) => `<li style="--i:${i}"><b>${String(i + 1).padStart(2, '0')}</b><span><em>${esc(k)}</em>${esc(v)}</span></li>`).join('');
    const stage = `
      <div class="pfx-l pfx-id">${plateHTML(s)}</div>
      ${cap ? fig('pfx-s1', cap.src, `Página principal de ${s.name}`) + fig('pfx-s2', cap.src2, `Sección de la página de ${s.name}`)
        : prev ? fig('pfx-s1', prev.src, `${prev.label} de ${s.name}`, prev.w, prev.h) : ''}
      <ol class="pfx-l pfx-arch" aria-label="Capas del sistema">${layers}</ol>
      ${canEmbed(s) ? `<div class="pfx-l pfx-live"><div class="pfx-url label"><span>${esc(host(s.url))}</span>${link(s, 'label')}</div><div class="sp-frame" data-src="${esc(s.url)}"><p class="sp-loading label">Cargando ${esc(host(s.url))}…</p></div></div>`
        : V.some(([k]) => k === 'site') ? `<div class="pfx-l pfx-live"><div class="pfx-url label"><span>${esc(host(s.url))}</span>${link(s, 'label')}</div><div class="pfx-site"><img src="${cap.src}" width="1280" height="800" alt="Página principal de ${esc(s.name)}" decoding="async"><img src="${cap.src2}" width="1280" height="800" alt="" decoding="async"></div></div>` : ''}
      <h2 class="pfx-title" id="sp-title">${esc(s.name)}</h2>`;
    const copy = {
      vista: `${s.title ? `<p class="sp-lead">${esc(s.title)}</p>` : ''}<p class="sp-glosa">${esc(s.glosa)}</p><p>${esc(s.system)}</p><p class="sp-links">${link(s)}</p>`,
      arq: `<p class="sp-glosa">${esc(s.system)}</p><p class="sp-tech"><span class="label muted">Stack</span> ${esc(s.tech)}</p>`,
      live: `<p class="sp-glosa">${esc(s.system)}</p><p class="sp-links">${link(s)}</p>`,
      site: `<p class="sp-glosa">${esc(s.glosa)}</p><p class="sp-links">${link(s)}</p>`,
    };
    return `
    <div class="pfx${solo ? ' pfx--solo' : ''}" data-view="${V[first][0]}">
      <div class="pfx-top">
        <p class="label"><span>${s.id}</span> · <span>${esc(s.cap.join(' · '))}</span> · <span class="st" data-state="${s.state}"><i aria-hidden="true"></i>${esc(s.stateLabel)}</span></p>
        <div class="sp-tools"><button class="sp-wide label" type="button" aria-pressed="false">Ampliar</button><button class="sp-close label" type="button">Cerrar</button></div>
      </div>
      <div class="pfx-stage">${stage}</div>
      <div class="pfx-foot">
        <div class="sp-tabs" role="tablist" aria-label="Vistas de ${esc(s.name)}">
          ${V.map(([, t], i) => `<button role="tab" id="sp-t${i}" aria-controls="sp-p${i}" aria-selected="${i === first}" tabindex="${i === first ? 0 : -1}" type="button">${t}</button>`).join('')}
        </div>
        ${V.map(([k], i) => `<div class="pfx-copy" role="tabpanel" id="sp-p${i}" aria-labelledby="sp-t${i}" tabindex="0"${i === first ? '' : ' hidden'}>${copy[k]}</div>`).join('')}
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
    const view = views(current)[i][0];
    dlg.querySelector('.pfx').dataset.view = view;
    if (view === 'live') mount();
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
    const tabs = [...dlg.querySelectorAll('[role=tab]')], i = tabs.indexOf(tab), L = tabs.length;
    const n = e.key === 'ArrowRight' ? (i + 1) % L : e.key === 'ArrowLeft' ? (i + L - 1) % L : e.key === 'Home' ? 0 : e.key === 'End' ? L - 1 : -1;
    if (n >= 0) { e.preventDefault(); selectTab(n); tabs[n].focus(); }
  });
  return { open, close, isOpen: () => dlg.open };
}
