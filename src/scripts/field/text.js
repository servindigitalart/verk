// VERK · campo de distancia de la tipografía del hero (para la interacción cromática partículas ↔ letras).
// El texto sigue siendo HTML: aquí solo se rasteriza una COPIA invisible de sus glifos, palabra a palabra, en la
// posición real que el navegador les dio (Range.getClientRects), con la fuente calculada. Sobre esa máscara se
// calcula la distancia euclídea exacta → R16F, distancia con signo en unidades de altura del hero.
// Es la forma de las letras, no su caja: no hay zonas rectangulares.
import { canvas2d } from './mark.js';
import { distances } from './edt.js';

export async function textField(host, els, maxSide = 384) {
  const hr = host.getBoundingClientRect(), W = Math.max(1, hr.width), H = Math.max(1, hr.height);
  const cell = Math.max(1.5, Math.max(W, H) / maxSide);
  const gw = Math.ceil(W / cell), gh = Math.ceil(H / cell), n = gw * gh;
  const c2 = canvas2d(gw, gh);
  c2.setTransform(1 / cell, 0, 0, 1 / cell, 0, 0);
  c2.textBaseline = 'alphabetic'; c2.fillStyle = '#000';
  for (const el of els) {
    const cs = getComputedStyle(el);
    c2.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    if ('letterSpacing' in c2) c2.letterSpacing = cs.letterSpacing === 'normal' ? '0px' : cs.letterSpacing;
    const fm = c2.measureText('Hg'), asc = fm.fontBoundingBoxAscent ?? fm.actualBoundingBoxAscent, desc = fm.fontBoundingBoxDescent ?? fm.actualBoundingBoxDescent;
    const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    for (let node; (node = walk.nextNode());) {
      const s = node.data;
      for (const m of s.matchAll(/\S+/g)) {
        range.setStart(node, m.index); range.setEnd(node, m.index + m[0].length);
        const r = range.getClientRects()[0]; if (!r) continue;
        const base = r.top - hr.top + (r.height - (asc + desc)) / 2 + asc;     // línea base dentro de la caja de la palabra
        c2.fillText(m[0], r.left - hr.left, base);
      }
    }
  }
  const px = c2.getImageData(0, 0, gw, gh).data, mask = new Uint8Array(n);
  for (let i = 0; i < n; i++) mask[i] = px[i * 4 + 3] > 96 ? 1 : 0;
  const [dist] = await distances([mask], gw, gh), k = cell / H;      // la transformada corre en el Worker
  const data = new Float32Array(n);
  for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) data[(gh - 1 - y) * gw + x] = dist[y * gw + x] * k;   // fila 0 abajo
  return { w: gw, h: gh, data };
}
