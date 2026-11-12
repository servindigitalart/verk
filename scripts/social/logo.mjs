// Official logo handling. The generator receives, as visual references, the official PNGs that the prompt's
// «▶ ADJUNTAR AL GENERADOR» line names, and integrates the logo itself as LOGO · USO says (no universal position).
// Nothing is composited afterwards: checkLogo only verifies the generated logo (reference shape, position, scale,
// contrast) and rejects the image if it does not match. It never repairs.
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';

const ROOT = new URL('../../', import.meta.url);
export const W = 1080, H = 1350;

export const TOKENS = {
  ink: '#0F0F0F', cream: '#F0EEE9', violet: '#6B6AF4', lime: '#BFEA00',
  'cream-warm': '#E6E1D5', dark: '#1A1A1A', 'footer-black': '#0B0B0B',
};
// 06 §10 RULES: ink on cream, warm cream, violet or lime; cream on ink or #0B0B0B;
// the isotipo may also be violet on cream. Never lime on cream, never cream on lime.
const ALLOWED = {
  wordmark: { [TOKENS.ink]: ['cream', 'cream-warm', 'violet', 'lime'], [TOKENS.cream]: ['ink', 'dark', 'footer-black'] },
  isotipo: { [TOKENS.ink]: ['cream', 'cream-warm', 'violet', 'lime'], [TOKENS.cream]: ['ink', 'dark', 'footer-black'], [TOKENS.violet]: ['cream', 'cream-warm'] },
};

/** Official brand files (tracked in git). logo-simple = wordmark; isotipo = isotipo. Never redrawn or converted. */
export const REFERENCE_FILES = { wordmark: 'public/images/logo-simple.png', isotipo: 'public/images/isotipo.png' };

const refCache = {};
/** The official file's bytes plus the mark's silhouette (pixels far from the file's background), cropped to it. */
async function reference(kind) {
  if (refCache[kind]) return refCache[kind];
  const png = await readFile(new URL(REFERENCE_FILES[kind], ROOT));
  const { data, info } = await sharp(png).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const bg = [data[0], data[1], data[2]];
  const on = (i) => Math.max(Math.abs(data[i] - bg[0]), Math.abs(data[i + 1] - bg[1]), Math.abs(data[i + 2] - bg[2])) > 60;
  let x0 = info.width, y0 = info.height, x1 = -1, y1 = -1;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    if (on((y * info.width + x) * 3)) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  }
  const mw = x1 - x0 + 1, mh = y1 - y0 + 1, mask = new Uint8Array(mw * mh);
  for (let y = 0; y < mh; y++) for (let x = 0; x < mw; x++) mask[y * mw + x] = on(((y + y0) * info.width + x + x0) * 3) ? 255 : 0;
  return (refCache[kind] = { png, mask, mw, mh, ratio: mw / mh });
}

/** PNG references named in «▶ ADJUNTAR AL GENERADOR», as the original files' bytes. The prompts name the
 *  library's canonical paths (lab/brand/<kind>-ink[-on-cream].png); each is mapped to its official file. */
export async function referencePngs(attachLine = '') {
  const named = [...attachLine.matchAll(/[\w./-]+\.png/g)].map((m) => m[0]);
  const refs = [];
  for (const path of named) {
    const kind = path.match(/(?:^|\/)(wordmark|isotipo)-ink(?:-on-cream)?\.png$/)?.[1];
    if (!kind) throw new Error(`referencia de logo desconocida: ${path}`);
    if (refs.some((r) => r.kind === kind)) continue;
    refs.push({ kind, file: REFERENCE_FILES[kind], png: (await reference(kind)).png });
  }
  return refs;
}

/** The official mark's silhouette in one flat color, width px wide (tests, calibration and synthetic samples). */
export async function markImage(kind, color, width) {
  const r = await reference(kind);
  const height = Math.round(width / r.ratio);
  const alpha = await sharp(Buffer.from(r.mask), { raw: { width: r.mw, height: r.mh, channels: 1 } }).resize(width, height, { fit: 'fill' }).extractChannel(0).raw().toBuffer();
  const [cr, cg, cb] = hex(color);
  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) { rgba[i * 4] = cr; rgba[i * 4 + 1] = cg; rgba[i * 4 + 2] = cb; rgba[i * 4 + 3] = alpha[i]; }
  return sharp(rgba, { raw: { width, height, channels: 4 } }).png().toBuffer();
}

export const attachedKinds = (attachLine = '') =>
  new Set([...attachLine.matchAll(/lab\/brand\/(wordmark|isotipo)/g)].map((m) => m[1]));

/**
 * LOGO · USO → [{ kind, color, x, y, w, h }] in 1080×1350 px. Throws when a placement cannot be
 * resolved exactly (missing position, size or color), so the piece is never published with a guess.
 */
export async function parseLogoUse(text) {
  const t = (text ?? '').trim();
  if (/^no logo\b/i.test(t) || /^none\b/i.test(t)) return [];
  const out = [];
  for (const clause of t.split(';').map((c) => c.trim()).filter(Boolean)) {
    const kind = clause.match(/^(wordmark|isotipo)\b/i)?.[1].toLowerCase();
    const color = clause.match(/#[0-9a-f]{6}\b/i)?.[0].toUpperCase();
    const hasGeometry = /\b[xy]\s*\d|\d\s*px/i.test(clause);
    if (!kind || (!color && !hasGeometry)) continue; // prose such as «wordmark and isotipo stay separate elements»
    if (!color) throw new Error(`LOGO · USO sin color: «${clause}»`);
    if (!Object.values(TOKENS).includes(color)) throw new Error(`LOGO · USO con color fuera de la paleta: ${color}`);
    const n = (re) => { const m = clause.match(re); return m ? Number(m[1]) : null; };
    const range = (axis) => { const m = clause.match(new RegExp(`\\b${axis}\\s*(\\d+)\\s*[-–]\\s*(\\d+)`, 'i')); return m ? [Number(m[1]), Number(m[2])] : null; };
    const { ratio } = await reference(kind);
    const ax = range('x'), ay = range('y');
    let w = n(/(\d+(?:\.\d+)?)\s*px wide/i), h = n(/(\d+(?:\.\d+)?)\s*px tall/i);
    if (w) h = w / ratio; else if (h) w = h * ratio;
    else if (ax && ay) { w = Math.min(ax[1] - ax[0], (ay[1] - ay[0]) * ratio); h = w / ratio; }
    else throw new Error(`LOGO · USO sin tamaño: «${clause}»`);
    if (ax && ay) { // «inside the area»: never larger than the area
      const k = Math.min(1, (ax[1] - ax[0]) / w, (ay[1] - ay[0]) / h); w *= k; h *= k;
    }
    let x = n(/left edge at x\s*(\d+)/i);
    if (x == null) { const r = n(/right edge at x\s*(\d+)/i); if (r != null) x = r - w; }
    if (x == null) { const c = n(/centered at x\s*(\d+)/i); if (c != null) x = c - w / 2; }
    if (x == null && ax) x = (ax[0] + ax[1] - w) / 2;
    let y = n(/top edge at y\s*(\d+)/i);
    if (y == null) { const b = n(/bottom edge at y\s*(\d+)/i); if (b != null) y = b - h; }
    if (y == null) { const c = n(/centered at y\s*(\d+)/i); if (c != null) y = c - h / 2; }
    if (y == null && ay) y = (ay[0] + ay[1] - h) / 2;
    if (x == null || y == null) throw new Error(`LOGO · USO sin posición: «${clause}»`);
    const p = { kind, color, x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h) };
    if (p.x < 0 || p.y < 0 || p.x + p.w > W || p.y + p.h > H) throw new Error(`LOGO · USO fuera del lienzo: «${clause}»`);
    out.push(p);
  }
  if (!out.length) throw new Error(`LOGO · USO no interpretable: «${t}»`);
  return out;
}

const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));

const TOKEN_RGB = Object.entries(TOKENS).map(([name, c]) => [name, hex(c)]);
/** Nearest palette token within ±20 per channel of rgb, or null (cream vs cream-warm are only ~20 apart). */
export function surfaceToken(rgb) {
  let best = null, bestD = 21;
  for (const [name, c] of TOKEN_RGB) {
    const d = Math.max(Math.abs(c[0] - rgb[0]), Math.abs(c[1] - rgb[1]), Math.abs(c[2] - rgb[2]));
    if (d < bestD) { best = name; bestD = d; }
  }
  return best;
}

const templateCache = new Map();
/** Official silhouette scaled to w×h, as the list of «on» pixel offsets (for a sparse overlap count). */
async function template(kind, w, h) {
  const key = `${kind}:${w}x${h}`;
  if (templateCache.has(key)) return templateCache.get(key);
  const r = await reference(kind);
  const m = await sharp(Buffer.from(r.mask), { raw: { width: r.mw, height: r.mh, channels: 1 } }).resize(w, h, { fit: 'fill' }).extractChannel(0).raw().toBuffer();
  const on = [];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (m[y * w + x] >= 128) on.push([x, y]);
  const t = { w, h, on };
  templateCache.set(key, t);
  return t;
}

/** checkLogo defaults, calibrated with synthetic samples (social.test.mjs). */
export const LOGO_CHECK = { minIoU: 0.75, scales: [0.75, 0.8, 0.85, 0.9, 0.95, 1, 1.05, 1.1, 1.15, 1.2, 1.25, 1.3], posTol: 0.25, minTol: 40, colorTol: 70 };

/**
 * Verifies each logo of LOGO · USO in the generated image, without touching it. Searches the official silhouette
 * (from the public/ reference file) in the declared color around the declared box — scale 0.75–1.3×, center
 * within max(40 px, 25 %) — and requires:
 *   - overlap (IoU) with the official silhouette ≥ minIoU: the mark is the reference, with its proportions;
 *   - the surface right around it to be a palette token on which that logo color is allowed (06 §10).
 * Returns { problems, found }; problems non-empty → reject (and regenerate).
 */
export async function checkLogo(jpeg, placements, opts = {}) {
  const o = { ...LOGO_CHECK, ...opts };
  const { data, info } = await sharp(jpeg).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  if (info.width !== W || info.height !== H) return { problems: [`logo: imagen de ${info.width}×${info.height}`], found: [] };
  const F = 2, hw = W / F, hh = H / F; // search at half resolution
  const problems = [], found = [];
  for (const p of placements) {
    const col = hex(p.color);
    const near = (i) => Math.abs(data[i] - col[0]) <= o.colorTol && Math.abs(data[i + 1] - col[1]) <= o.colorTol && Math.abs(data[i + 2] - col[2]) <= o.colorTol;
    const tolX = Math.max(o.minTol, p.w * o.posTol), tolY = Math.max(o.minTol, p.h * o.posTol);
    const cx = p.x + p.w / 2, cy = p.y + p.h / 2, maxS = Math.max(...o.scales);
    // half-resolution map of «declared color» pixels (2×2 block: at least 2 of 4) over the search region
    const rx0 = Math.max(0, Math.floor((cx - tolX - p.w * maxS / 2) / F)), rx1 = Math.min(hw, Math.ceil((cx + tolX + p.w * maxS / 2) / F));
    const ry0 = Math.max(0, Math.floor((cy - tolY - p.h * maxS / 2) / F)), ry1 = Math.min(hh, Math.ceil((cy + tolY + p.h * maxS / 2) / F));
    const mw = rx1 - rx0, mh = ry1 - ry0, M = new Uint8Array(mw * mh), I = new Uint32Array((mw + 1) * (mh + 1));
    for (let y = 0; y < mh; y++) for (let x = 0; x < mw; x++) {
      let c = 0;
      for (let dy = 0; dy < F; dy++) for (let dx = 0; dx < F; dx++) if (near((((ry0 + y) * F + dy) * W + (rx0 + x) * F + dx) * 3)) c++;
      M[y * mw + x] = c >= 2 ? 1 : 0;
    }
    for (let y = 0; y < mh; y++) for (let x = 0; x < mw; x++) I[(y + 1) * (mw + 1) + x + 1] = M[y * mw + x] + I[y * (mw + 1) + x + 1] + I[(y + 1) * (mw + 1) + x] - I[y * (mw + 1) + x];
    const sum = (x, y, w, h) => I[(y + h) * (mw + 1) + x + w] - I[y * (mw + 1) + x + w] - I[(y + h) * (mw + 1) + x] + I[y * (mw + 1) + x];
    let best = { iou: 0 };
    for (const s of o.scales) {
      const tw = Math.max(4, Math.round(p.w * s / F)), th = Math.max(4, Math.round(p.h * s / F));
      const t = await template(p.kind, tw, th);
      const step = Math.max(1, Math.round(Math.sqrt(t.on.length) / 60)); // keeps the isotipo search fast
      const xs = Math.round((cx - tolX) / F - tw / 2) - rx0, xe = Math.round((cx + tolX) / F - tw / 2) - rx0;
      const ys = Math.round((cy - tolY) / F - th / 2) - ry0, ye = Math.round((cy + tolY) / F - th / 2) - ry0;
      for (let oy = Math.max(0, ys); oy <= Math.min(mh - th, ye); oy += step) {
        for (let ox = Math.max(0, xs); ox <= Math.min(mw - tw, xe); ox += step) {
          let inter = 0;
          for (const [x, y] of t.on) inter += M[(oy + y) * mw + ox + x];
          const iou = inter / (t.on.length + sum(ox, oy, tw, th) - inter);
          if (iou > best.iou) best = { iou, x: (ox + rx0) * F, y: (oy + ry0) * F, w: tw * F, h: th * F, scale: s };
        }
      }
    }
    const f = { kind: p.kind, iou: Number(best.iou.toFixed(3)), ...(best.x != null && { x: best.x, y: best.y, w: best.w, h: best.h, scale: best.scale }) };
    found.push(f);
    if (best.iou < o.minIoU) {
      problems.push(`logo: no se encontró el ${p.kind} oficial en ${p.color} en la zona de LOGO · USO (coincidencia ${f.iou} < ${o.minIoU})`);
      continue;
    }
    // surface right around the match (12 px ring, pixels that are not the logo color)
    const ring = [[], [], []];
    const bx0 = Math.max(0, best.x - 12), by0 = Math.max(0, best.y - 12), bx1 = Math.min(W, best.x + best.w + 12), by1 = Math.min(H, best.y + best.h + 12);
    for (let y = by0; y < by1; y += 2) for (let x = bx0; x < bx1; x += 2) {
      if (x >= best.x && x < best.x + best.w && y >= best.y && y < best.y + best.h) continue;
      const i = (y * W + x) * 3;
      if (!near(i)) { ring[0].push(data[i]); ring[1].push(data[i + 1]); ring[2].push(data[i + 2]); }
    }
    const med = ring.map((ch) => Float64Array.from(ch).sort()[ch.length >> 1]);
    const surface = ring[0].length ? surfaceToken(med) : null;
    f.surface = surface;
    if (!surface) problems.push(`logo: la superficie alrededor del ${p.kind} no es de la paleta`);
    else if (!ALLOWED[p.kind][p.color]?.includes(surface)) problems.push(`logo: ${p.kind} ${p.color} no está permitido sobre ${surface} (06 §10)`);
  }
  return { problems, found };
}
