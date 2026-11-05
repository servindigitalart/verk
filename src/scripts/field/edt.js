// VERK · distancia con signo de una máscara binaria (transformada euclídea exacta de Felzenszwalb & Huttenlocher 2012).
// Código puro, sin DOM: lo usa el Worker (edt.worker.js) y, si no hay Workers, el hilo principal.
export function signedDistance(mask, w, h) {
  const n = w * h, INF = 1e20, inside = new Float64Array(n), outside = new Float64Array(n), out = new Float32Array(n);
  for (let i = 0; i < n; i++) { const a = mask[i] !== 0; outside[i] = a ? 0 : INF; inside[i] = a ? INF : 0; }
  edt(outside, w, h); edt(inside, w, h);
  for (let i = 0; i < n; i++) out[i] = Math.sqrt(outside[i]) - Math.sqrt(inside[i]);   // en celdas; >0 fuera
  return out;
}

export function edt(g, w, h) {
  const len = Math.max(w, h), f = new Float64Array(len), d = new Float64Array(len), v = new Int32Array(len), z = new Float64Array(len + 1);
  const pass = (n) => {
    let k = 0; v[0] = 0; z[0] = -Infinity; z[1] = Infinity;
    for (let q = 1; q < n; q++) {
      let s = ((f[q] + q * q) - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
      while (s <= z[k]) { k--; s = ((f[q] + q * q) - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]); }
      k++; v[k] = q; z[k] = s; z[k + 1] = Infinity;
    }
    for (let q = 0, j = 0; q < n; q++) { while (z[j + 1] < q) j++; d[q] = (q - v[j]) ** 2 + f[v[j]]; }
  };
  for (let x = 0; x < w; x++) { for (let y = 0; y < h; y++) f[y] = g[y * w + x]; pass(h); for (let y = 0; y < h; y++) g[y * w + x] = d[y]; }
  for (let y = 0; y < h; y++) { for (let x = 0; x < w; x++) f[x] = g[y * w + x]; pass(w); for (let x = 0; x < w; x++) g[y * w + x] = d[x]; }
}

// Cliente: varias máscaras en un solo viaje al Worker (transferencia sin copia). Sin Worker → mismo cálculo en línea.
let worker = null, seq = 0;
const pending = new Map();
export function distances(masks, w, h) {
  try {
    worker ??= new Worker(new URL('./edt.worker.js', import.meta.url), { type: 'module' });
    worker.onmessage = ({ data }) => { pending.get(data.id)?.(data.out); pending.delete(data.id); };
  } catch { worker = false; }
  if (!worker) return Promise.resolve(masks.map((m) => signedDistance(m, w, h)));
  const id = ++seq;
  return new Promise((res) => { pending.set(id, res); worker.postMessage({ id, masks, w, h }, masks.map((m) => m.buffer)); });
}
