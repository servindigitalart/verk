// Technical and editorial checks. Every check returns a list of problems (empty = valid).
import sharp from 'sharp';
import { request, sleep } from './http.mjs';

export const MAX_BYTES = 8 * 1024 * 1024;

// 05 §5–6 and the PROHIBIDO EN COPY line of 01/02.
const BANNED = [
  'soluciones innovadoras', 'solución innovadora', 'transformación digital', 'siguiente nivel', 'potenciar', 'potencia tu',
  'impulsar tu crecimiento', 'impulsa tu crecimiento', 'de vanguardia', 'expertos en', '360', 'apasionados',
  'casos de éxito', 'contáctanos', 'premium', '24/7', 'nunca pierdas', 'garantizado', 'garantizamos', 'ecosistema digital',
];

export function checkCopy(texts) {
  const problems = [];
  for (const t of texts.filter(Boolean)) {
    const low = t.toLowerCase();
    for (const b of BANNED) if (low.includes(b)) problems.push(`palabra prohibida «${b}»`);
  }
  return problems;
}

/** Caption: library copy only → no hashtags, no figures, no banned words, Instagram length. */
export function checkCaption(caption) {
  const problems = checkCopy([caption]);
  if (!caption?.trim()) problems.push('caption vacío');
  if (caption.length > 2200) problems.push('caption de más de 2 200 caracteres');
  if (/#[\p{L}\d_]/u.test(caption)) problems.push('caption con hashtags');
  if (/\d/.test(caption)) problems.push('caption con cifras');
  return problems;
}

export async function checkImage(buf) {
  const problems = [];
  const m = await sharp(buf).metadata();
  if (m.format !== 'jpeg') problems.push(`formato ${m.format}`);
  if (m.width !== 1080 || m.height !== 1350) problems.push(`${m.width}×${m.height} en vez de 1080×1350`);
  if (buf.length > MAX_BYTES) problems.push('más de 8 MB');
  if ((m.pages ?? 1) > 1) problems.push('JPEG con varias imágenes (MPO)');
  return problems;
}

const norm = (s) => s.normalize('NFC').replace(/\s+/g, ' ').trim();

/**
 * Approved copy vs. the vision transcription. Only whitespace and line breaks are normalized;
 * accents, case and punctuation must match. Fields are checked per «·» segment, because a
 * microcopy like «SITIO · WHATSAPP · CRM» is drawn as separate labels.
 */
export function compareText(expected, blocks) {
  const all = norm(blocks.join(' '));
  const missing = expected.flatMap((e) => e.split(' · ').map(norm)).filter((seg) => seg && !all.includes(seg));
  const words = (s) => s.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
  const known = new Set(expected.flatMap(words));
  const extra = [...new Set(words(all))].filter((w) => !known.has(w) && w !== 'verk');
  return { missing, extra };
}

/**
 * What Meta will fetch: an unauthenticated GET of the public URL must return the JPEG bytes
 * (never the HTML of a login or viewer page, which also answers 200).
 */
export async function verifyPublicUrl(url, { fetch = globalThis.fetch, wait = sleep, attempts = 4 } = {}) {
  let last = [];
  for (let i = 0; i < attempts; i++) {
    if (i) await wait(3000);
    let buf;
    try { buf = await request(fetch, url, { redirect: 'follow' }, { as: 'buffer', retries: 1, wait, label: 'public url' }); }
    catch (e) { last = [e.message]; continue; }
    if (!(buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff)) { last = ['la URL pública no devuelve bytes JPEG']; continue; }
    return checkImage(buf);
  }
  return last;
}
