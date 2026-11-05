// VERK · el isotipo oficial como núcleo del hero (portado de lab/f3-generative-experience/core/mark.js).
//   · SDF por barra desde los paths oficiales del SVG en el DOM (transformada exacta de Felzenszwalb).
//   · Movimiento: SOLO traslación de cada barra sobre su eje de 45° + opacidad (doc 21 §5).
//       respiración autónoma orgánica (bars.js) · entrada 1-2-3 · ráfaga (clic/tap) · salida ligada al scroll
//       respuesta al cursor/toque: muelles por barra (bars.js); su velocidad empuja el fluido (uBarVel)
import { breath, createRig, place, barGeometry } from './bars.js';
import { distances } from './edt.js';

export function createMark({ host, markEl, reduced, cfg }) {
  const paths = markEl ? [...markEl.querySelectorAll('path')] : [];
  const rig = createRig(cfg);
  const st = {
    ent: reduced ? 10 : 0, t: 0, burstT: 10, burstAt: [.5, .5],
    off: new Float32Array(6), pres: new Float32Array([1, 1, 1]), breath: new Float32Array(3), barVel: new Float32Array(3),
    pxPerVb: 1, W: 1, H: 1, geo: null,
    ptr: { tx: -1, ty: -1, x: -1, y: -1, vx: 0, vy: 0, on: 0, ton: 0 },
  };
  const expo = (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
  const sm = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  let touchOff = 0;

  // puntero en p (unidades de altura del hero, y hacia arriba)
  const setPtr = (e) => {
    const r = host.getBoundingClientRect();
    const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    st.ptr.tx = (e.clientX - r.left) / r.height; st.ptr.ty = 1 - (e.clientY - r.top) / r.height;
    st.ptr.ton = inside ? 1 : 0;
    return inside;
  };
  const api = {
    st,
    onPointerMove: (e) => { if (e.pointerType !== 'touch' || e.buttons) setPtr(e); },
    onPointerDown: (e) => {
      clearTimeout(touchOff);
      if (setPtr(e)) { api.burst(st.ptr.tx, st.ptr.ty); if (st.ptr.x < 0 || e.pointerType === 'touch') { st.ptr.x = st.ptr.tx; st.ptr.y = st.ptr.ty; } }
    },
    // toque: la presencia se mantiene un instante tras levantar el dedo y se desvanece (equivalente táctil del hover)
    onPointerUp: (e) => { if (e.pointerType === 'touch') { clearTimeout(touchOff); touchOff = setTimeout(() => (st.ptr.ton = 0), 650); } },
    onLeave: () => { st.ptr.ton = 0; },
    burst(x = st.ptr.x, y = st.ptr.y) { if (reduced) return; st.burstT = 0; st.burstAt = [x, y]; },

    // SDF (RGBA: barra 1, 2, 3, unión) para el rectángulo actual del host. En el hilo principal solo se rasteriza
    // cada barra (Path2D del SVG oficial); la transformada de distancia corre en un Worker (edt.js).
    async sdf(maxSide = 288) {
      const hr = host.getBoundingClientRect(); st.W = Math.max(1, hr.width); st.H = Math.max(1, hr.height);
      const cell = Math.max(2, Math.max(st.W, st.H) / maxSide);
      const gw = Math.ceil(st.W / cell), gh = Math.ceil(st.H / cell), n = gw * gh;
      const c2 = canvas2d(gw, gh);
      const g = markEl ? barGeometry(markEl, host) : null;
      st.geo = g; st.pxPerVb = g ? g.s : 1;
      const masks = paths.map((p) => {
        c2.setTransform(1, 0, 0, 1, 0, 0); c2.clearRect(0, 0, gw, gh);
        if (g) { c2.setTransform(g.s / cell, 0, 0, g.s / cell, g.ox / cell, g.oy / cell); c2.fill(new Path2D(p.getAttribute('d'))); }
        const px = c2.getImageData(0, 0, gw, gh).data, m = new Uint8Array(n);
        for (let i = 0; i < n; i++) m[i] = px[i * 4 + 3] > 127 ? 1 : 0;
        return m;
      });
      const ch = await distances(masks, gw, gh), k = cell / st.H;
      const data = new Float32Array(n * 4);
      for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) {
        const i = y * gw + x, o = ((gh - 1 - y) * gw + x) * 4;          // fila 0 abajo: y hacia arriba
        const r = ch[0] ? ch[0][i] * k : 9, gg = ch[1] ? ch[1][i] * k : 9, b = ch[2] ? ch[2][i] * k : 9;
        data[o] = r; data[o + 1] = gg; data[o + 2] = b; data[o + 3] = Math.min(r, gg, b);
      }
      return { w: gw, h: gh, data };
    },

    update(dt, scroll = 0) {
      if (!reduced) { st.ent += dt; st.t += dt; st.burstT += dt; }
      const p = st.ptr, k = 140, c = 2 * Math.sqrt(k);                    // puntero suavizado: muelle crítico
      if (p.x < 0) { p.x = p.tx; p.y = p.ty; }
      if (dt > 0) {
        p.vx += (k * (p.tx - p.x) - c * p.vx) * dt; p.vy += (k * (p.ty - p.y) - c * p.vy) * dt;
        p.x += p.vx * dt; p.y += p.vy * dt;
        p.on += (p.ton - p.on) * (1 - Math.exp(-dt * 5));
      }
      // respuesta al cursor (px, y hacia abajo, relativo al host)
      const H = st.H, g = st.geo;
      if (g && !reduced) rig.step(dt, { x: p.x * H, y: (1 - p.y) * H, vx: p.vx * H, vy: -p.vy * H, on: p.on }, g.centers, g.size);
      paths.forEach((el, i) => {
        const e = expo(Math.max(0, (st.ent - i * .08) / .9));
        const br = reduced ? 0 : breath(st.t, i);
        const bt = Math.max(0, st.burstT - i * .07);
        const burst = reduced ? 0 : Math.sin(Math.min(1, bt / 1.1) * Math.PI) * Math.exp(-bt * 1.2) * 1.6;
        const x = reduced ? 0 : sm(.12 + i * .07, .62 + i * .07, scroll);         // salida 1-2-3 ligada al scroll
        const px = (-150 * (1 - e) + 320 * x) * st.pxPerVb + cfg.breath * br + 9 * burst + rig.x[i];
        place(el, px, st.pxPerVb);
        const a = Math.min(sm(0, .35, e), 1 - sm(.55, 1, x));
        el.style.opacity = a.toFixed(3);
        st.off[i * 2] = st.off[i * 2 + 1] = px / Math.SQRT2 / H;           // en p (y hacia arriba): (+, +)
        st.pres[i] = a; st.breath[i] = .5 + .5 * br;
        st.barVel[i] = reduced ? 0 : rig.v[i] / H;                          // velocidad axial, en alturas/s
      });
      st.burst = reduced ? 0 : Math.exp(-st.burstT * 1.4) * (1 - Math.exp(-st.burstT * 30));
    },
  };
  api.update(0, 0);                                                         // estado inicial antes de revelar la marca
  return api;
}

export function canvas2d(w, h) {
  const cv = typeof OffscreenCanvas === 'function' ? new OffscreenCanvas(w, h) : Object.assign(document.createElement('canvas'), { width: w, height: h });
  return cv.getContext('2d', { willReadFrequently: true });
}
