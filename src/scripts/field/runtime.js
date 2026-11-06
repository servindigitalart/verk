// VERK · orquestador del hero (portado de lab/f3-generative-experience/core/runtime.js, sin piloto automático ni
// zonas de calma). Lienzo, ciclo, marca, campo de texto, composición halftone, pérdida de contexto y métricas.
// Contrato de escena: { name, async init(ctx, env), resize(ctx, env), frame(ctx, env, dt) → target RGBA, reset? }
import { createGL } from './gl.js';
import { createMark } from './mark.js';
import { textField } from './text.js';
import { COMPOSITE } from './glsl.js';
import { FIELD } from './config.js';

export async function startField(scene, host = document.querySelector('[data-field]')) {
  const T = { start: performance.now() };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cfg = FIELD;
  const api = { T, cfg, reason: null, state: { frames: 0, timing: [], scale: 1 } };
  if (/[?&](debug|tune)\b/.test(location.search)) window.__field = api;    // mediciones y panel de ajuste
  const root = document.documentElement;
  const off = (why) => { api.reason = why; host.dataset.fieldOff = why; root.classList.remove('mark-pending'); return api; };
  if (navigator.connection?.saveData) return off('save-data');

  const canvas = document.createElement('canvas');
  canvas.className = 'field-canvas'; canvas.setAttribute('aria-hidden', 'true');
  const ctx = createGL(canvas);
  if (!ctx) return off('sin webgl2');
  if (!ctx.ext.colorFloat) return off('sin render targets float');
  host.prepend(canvas);
  api.ctx = ctx; T.ctx = +(performance.now() - T.start).toFixed(1);

  const mark = createMark({ host, markEl: host.querySelector('.mark'), reduced, cfg: cfg.mark });
  api.mark = mark; T.markInit = +(performance.now() - T.start).toFixed(1);
  root.classList.remove('mark-pending');
  const textEls = [...host.querySelectorAll('[data-field-text]')];
  const env = { mark, cfg, reduced, time: 0, W: 1, H: 1, dpr: 1, aspect: 1, sdfTex: null, textTex: null };
  let comp = null, ready = false;

  async function init() {
    ready = false;
    const t0 = performance.now();
    comp = await ctx.program(COMPOSITE); T.firstProgram = +(performance.now() - t0).toFixed(1);
    await scene.init(ctx, env);
    T.compiled = performance.now() - t0;
    // primera vez: la geometría se reparte en tareas cortas (marca · texto · simulación) para no bloquear el hilo
    const yieldTask = () => new Promise((r) => setTimeout(r, 0));
    const r = host.getBoundingClientRect();
    env.W = Math.max(1, r.width); env.H = Math.max(1, r.height); env.aspect = env.W / env.H; lastW = r.width;
    scaleCanvas(); await geoMark(); await yieldTask(); await geoText(); await yieldTask(); scene.resize(ctx, env);
    ready = true; dirty = true; wake();
  }
  // Recalcula la geometría (lienzo, SDF de la marca, SDF del texto). Solo al cambiar el tamaño o las fuentes.
  // Geometría (SDF del isotipo y del texto): rasterizado en el hilo principal, distancia en el Worker
  async function geoMark() {
    const sdf = await mark.sdf();
    if (ctx.lost) return;
    env.sdfCPU = sdf;                                   // copia en CPU: zona interactiva del isotipo (modo lima)
    env.sdfTex?.tex && ctx.gl.deleteTexture(env.sdfTex.tex);
    env.sdfTex = ctx.texture(sdf.w, sdf.h, { format: 'RGBA16F', data: sdf.data });
  }
  async function geoText() {
    const tf = await textField(host, textEls);
    if (ctx.lost) return;
    env.textTex?.tex && ctx.gl.deleteTexture(env.textTex.tex);
    env.textTex = ctx.texture(tf.w, tf.h, { format: 'R16F', data: tf.data });
  }
  async function geometry() { const s0 = performance.now(); await Promise.all([geoMark(), geoText()]); T.geometry = +(performance.now() - s0).toFixed(1); dirty = true; wake(); }
  function resize() {
    const r = host.getBoundingClientRect();
    env.W = Math.max(1, r.width); env.H = Math.max(1, r.height); env.aspect = env.W / env.H;
    scaleCanvas();
    scene.resize(ctx, env);
    geometry();                                       // asíncrona: las texturas anteriores sirven hasta que llega la nueva
    dirty = true;
  }
  // solo la resolución del lienzo final (la escala adaptativa no cambia la geometría ni la simulación)
  function scaleCanvas() {
    env.dpr = Math.min(devicePixelRatio || 1, cfg.dprCap) * api.state.scale;
    canvas.width = Math.round(env.W * env.dpr); canvas.height = Math.round(env.H * env.dpr);
  }
  // ── modo lima: el cursor (o el toque) sobre el isotipo lleva marca y partículas de violeta a lima ──
  // Zona interactiva = las barras + un margen (SDF de la marca en CPU), no todo el hero. ~380 ms de transición.
  const markEl = host.querySelector('.mark'), subEl = host.querySelector('.sub');
  let lime = 0, lastSx = '';
  const VIO = [107, 106, 244], LIM = [191, 234, 0];
  const overMark = () => {
    const p = mark.st.ptr, s = env.sdfCPU;
    if (!s || p.ton < .5 || p.tx < 0) return false;
    const u = p.tx / env.aspect, v = p.ty; if (u < 0 || u > 1 || v < 0 || v > 1) return false;
    const i = (Math.min(s.h - 1, Math.floor(v * s.h)) * s.w + Math.min(s.w - 1, Math.floor(u * s.w))) * 4 + 3;
    return s.data[i] < cfg.limeReach / env.H;
  };
  function limeStep(dt) {
    const target = overMark() ? 1 : 0;
    lime = reduced ? target : lime + (target - lime) * (1 - Math.exp(-dt * 6.5));
    if (Math.abs(lime - target) < .002) lime = target;
    const c = VIO.map((v, i) => Math.round(v + (LIM[i] - v) * lime));
    if (markEl) markEl.style.color = `rgb(${c})`;
    // capa óptica del subtítulo: sigue al cursor (luz) y toma el color del modo
    const p = mark.st.ptr, nx = p.ton ? Math.max(-1, Math.min(1, (p.x * env.H - env.W / 2) / (env.W / 2))) : 0, ny = p.ton ? Math.max(-1, Math.min(1, ((1 - p.y) * env.H - env.H / 2) / (env.H / 2))) : 0;
    const sx = `${(1.5 - 2.2 * nx).toFixed(2)}|${(1.5 - 2.2 * ny).toFixed(2)}|${c}`;
    if (subEl && sx !== lastSx) { lastSx = sx; const [a, b] = sx.split('|'); subEl.style.setProperty('--sx', a); subEl.style.setProperty('--sy', b); subEl.style.setProperty('--sub-echo', `rgb(${c} / .55)`); }
    if (target !== (lime > .5 ? 1 : 0) || (lime > 0 && lime < 1)) dirty = true;
  }
  env.markU = () => ({ uSdf: env.sdfTex, uOff: mark.st.off, uPres: mark.st.pres, uAspect: env.aspect });

  // ── entradas ──
  const cleanup = [];
  const on = (t, e, f, o) => { t.addEventListener(e, f, o); cleanup.push(() => t.removeEventListener(e, f, o)); };
  // Solo con el hero visible: leer su rectángulo fuera de vista forzaba un layout en cada toque de la página (INP)
  on(window, 'pointermove', (e) => { if (visible) { mark.onPointerMove(e); wake(); } }, { passive: true });
  on(window, 'pointerdown', (e) => { if (visible && !e.target.closest('button, a, input, dialog')) { mark.onPointerDown(e); wake(); } }, { passive: true });
  on(window, 'pointerup', (e) => mark.onPointerUp(e), { passive: true });
  on(window, 'pointercancel', (e) => mark.onPointerUp(e), { passive: true });
  on(root, 'pointerleave', (e) => { if (e.pointerType !== 'touch') mark.onLeave(); });   // en táctil, el fin del toque lo gestiona onPointerUp
  on(window, 'scroll', () => { dirty = true; wake(); }, { passive: true });

  // ── ciclo: rAF solo con el hero visible, la pestaña activa y sin pausa (nunca permanente) ──
  let visible = true, paused = false, raf = 0, last = 0, dirty = true;
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; wake(); }); io.observe(host); cleanup.push(() => io.disconnect());
  on(document, 'visibilitychange', wake);
  let lastW = 0;
  const ro = new ResizeObserver(() => {
    // en móvil la barra del navegador cambia el alto al hacer scroll: solo se reconstruye si cambia el ancho o mucho el alto
    const r = host.getBoundingClientRect();
    if (ready && (r.width !== lastW || Math.abs(r.height - env.H) > 120)) { lastW = r.width; resize(); }
  });
  ro.observe(host); cleanup.push(() => ro.disconnect());
  document.fonts?.ready.then(() => { if (ready) { geometry(); dirty = true; wake(); } });   // los glifos reales, no los de respaldo
  const live = () => !paused && !reduced;
  function wake() { if (!raf && ready && !ctx.lost && visible && !document.hidden && (live() || dirty)) raf = requestAnimationFrame(frame); }
  const slow = [];
  function frame(now) {
    raf = 0;
    const dt = last && now - last < 200 ? Math.min(.05, (now - last) / 1000) : 1 / 60; last = now;
    const t0 = performance.now();
    if (live()) env.time += dt * cfg.speed;
    const r = host.getBoundingClientRect();
    mark.update(live() ? dt : 0, Math.min(1, Math.max(0, -r.top / r.height)));
    const field = scene.frame(ctx, env, live() ? dt * cfg.speed : 0);
    limeStep(live() ? dt : 1);
    const ch = cfg.chroma;
    ctx.draw(comp, {
      ...env.markU(), uField: field, uText: env.textTex,
      uCell: cfg.cell / env.H, uAniso: cfg.aniso, uGap: cfg.gap / env.H, uDensity: cfg.density, uContrast: cfg.contrast,
      uChroma: ch.intensity, uChromaR: ch.radius / env.H, uChromaNear: ch.near, uTextDensity: ch.textDensity, uLime: lime,
    });
    api.state.timing.push(performance.now() - t0); if (api.state.timing.length > 600) api.state.timing.shift();
    api.state.frames++; dirty = false;
    if (!T.firstFrame) { T.firstFrame = performance.now(); host.dataset.fieldOn = ''; }
    if (api.restoreAt) { api.recovery_ms = +(performance.now() - api.restoreAt).toFixed(1); api.restoreAt = 0; }
    // resolución adaptativa: si el p90 del intervalo entre frames pasa de 20 ms, baja la escala (mín. 0.5)
    if (live()) { slow.push(now); if (slow.length > 61) slow.shift(); }
    if (live() && slow.length === 61 && api.state.scale > .5) {
      const iv = slow.slice(1).map((x, i) => x - slow[i]).sort((a, b) => a - b);
      if (iv[54] > 20) { api.state.scale = Math.max(.5, api.state.scale * .85); slow.length = 0; scaleCanvas(); }
    }
    if (live()) wake();
  }

  // ── pérdida y restauración de contexto: la simulación pierde su estado y la escena se reinicia ──
  on(canvas, 'webglcontextlost', (e) => { e.preventDefault(); ctx.lost = true; cancelAnimationFrame(raf); raf = 0; host.dataset.fieldLost = ''; });
  on(canvas, 'webglcontextrestored', async () => { api.restoreAt = performance.now(); ctx.lost = false; delete host.dataset.fieldLost; ctx.reset(); env.sdfTex = env.textTex = null; await init(); });

  Object.assign(api, {
    set(o) { for (const k in o) typeof o[k] === 'object' ? Object.assign(cfg[k], o[k]) : (cfg[k] = o[k]); dirty = true; wake(); },
    pause(v = !paused) { paused = v; dirty = true; wake(); return paused; },
    burst() { mark.burst(); wake(); },
    loseContext() { ctx.ext.lose?.loseContext(); },
    restoreContext() { ctx.ext.lose?.restoreContext(); },
    memory: () => ctx.memory() + (env.sdfTex?.bytes ?? 0) + (env.textTex?.bytes ?? 0),
    scene, env,
    destroy() { cancelAnimationFrame(raf); cleanup.forEach((f) => f()); canvas.remove(); },
  });
  const pauseBtn = host.querySelector('.field-pause');
  if (pauseBtn) on(pauseBtn, 'click', () => { const p = api.pause(); pauseBtn.setAttribute('aria-pressed', String(p)); pauseBtn.textContent = p ? 'Reanudar' : 'Pausar'; });

  try { await init(); } catch (e) { console.error(e); canvas.remove(); return off('error'); }
  T.ready = performance.now() - T.start;
  return api;
}
