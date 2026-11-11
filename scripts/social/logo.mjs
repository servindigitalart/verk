// Official logo handling. The generator receives the reference PNGs the prompt asks for; the final
// image always carries the official vector on top, placed and colored as that prompt's
// LOGO · USO says (no universal position). Uniform scale only: the SVG keeps its viewBox ratio.
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';

const ASSETS = new URL('../../src/assets/brand/', import.meta.url);
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

const svgCache = {};
async function svg(kind) {
  svgCache[kind] ??= await readFile(new URL(`${kind}.svg`, ASSETS), 'utf8');
  const s = svgCache[kind];
  const [, , vw, vh] = s.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
  return { s, ratio: vw / vh };
}

async function renderSvg(kind, color, width, height, background) {
  const { s } = await svg(kind);
  let out = s.replace('fill="currentColor"', `fill="${color}"`).replace('<svg ', `<svg width="${width}" height="${height}" `);
  if (background) out = out.replace(/(<svg[^>]*>)/, `$1<rect width="100%" height="100%" fill="${background}"/>`);
  return sharp(Buffer.from(out)).png().toBuffer();
}

/** PNG references named in «▶ ADJUNTAR AL GENERADOR», rendered from the tracked official SVGs
 *  exactly like lab/brand/*.png (2048 px on the long side). */
export async function referencePngs(attachLine = '') {
  const refs = [];
  for (const [, kind, onCream] of attachLine.matchAll(/lab\/brand\/(wordmark|isotipo)-ink(-on-cream)?\.png/g)) {
    const { ratio } = await svg(kind);
    const [w, h] = ratio >= 1 ? [2048, Math.round(2048 / ratio)] : [Math.round(2048 * ratio), 2048];
    refs.push({ kind, png: await renderSvg(kind, TOKENS.ink, w, h, onCream && TOKENS.cream) });
  }
  return refs;
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
    const { ratio } = await svg(kind);
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

/**
 * jpeg (1080×1350) → JPEG with the official logo(s). For each placement: the ring around the
 * padded box must be one flat palette surface (else the generator put something there → throw,
 * the caller regenerates); the box is repainted with that surface and the SVG composited on top.
 */
export async function applyLogo(jpeg, placements, { pad = 16, band = 10, tolerance = 24, maxOutliers = 0.01 } = {}) {
  const { data, info } = await sharp(jpeg).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  if (info.width !== W || info.height !== H) throw new Error(`logo: imagen de ${info.width}×${info.height}`);
  const px = (x, y) => (y * W + x) * 3;
  const layers = [], surfaces = [];
  for (const p of placements) {
    const box = { x0: Math.max(0, p.x - pad), y0: Math.max(0, p.y - pad), x1: Math.min(W, p.x + p.w + pad), y1: Math.min(H, p.y + p.h + pad) };
    const ring = [[], [], []];
    for (let y = Math.max(0, box.y0 - band); y < Math.min(H, box.y1 + band); y++) {
      for (let x = Math.max(0, box.x0 - band); x < Math.min(W, box.x1 + band); x++) {
        if (x >= box.x0 && x < box.x1 && y >= box.y0 && y < box.y1) continue;
        const i = px(x, y); ring[0].push(data[i]); ring[1].push(data[i + 1]); ring[2].push(data[i + 2]);
      }
    }
    const med = ring.map((ch) => Float64Array.from(ch).sort()[ch.length >> 1]);
    let outliers = 0;
    for (let k = 0; k < ring[0].length; k++) if (ring.some((ch, c) => Math.abs(ch[k] - med[c]) > tolerance)) outliers++;
    const share = outliers / ring[0].length;
    if (share > maxOutliers) throw new Error(`logo: la zona del ${p.kind} no es plana (${(share * 100).toFixed(1)} % fuera)`);
    const surface = surfaceToken(med);
    if (!surface) throw new Error(`logo: la superficie bajo el ${p.kind} no es de la paleta`);
    if (!ALLOWED[p.kind][p.color]?.includes(surface)) throw new Error(`logo: ${p.kind} ${p.color} no está permitido sobre ${surface}`);
    for (let y = box.y0; y < box.y1; y++) for (let x = box.x0; x < box.x1; x++) {
      const i = px(x, y); data[i] = med[0]; data[i + 1] = med[1]; data[i + 2] = med[2];
    }
    layers.push({ input: await renderSvg(p.kind, p.color, p.w, p.h), left: p.x, top: p.y });
    surfaces.push(surface);
  }
  const buffer = await sharp(data, { raw: { width: W, height: H, channels: 3 } })
    .composite(layers).jpeg({ quality: 92, chromaSubsampling: '4:4:4' }).toBuffer();
  return { buffer, surfaces };
}
