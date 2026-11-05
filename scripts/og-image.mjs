// Imagen social 1200×630 (Open Graph / Twitter) con las marcas oficiales, sin redibujarlas: wordmark ink + isotipo violeta
// sobre cream. Uso: node scripts/og-image.mjs → public/og/verk-og.png
import { readFileSync } from 'node:fs'; import { createRequire } from 'node:module';
const sharp = createRequire(import.meta.url)('sharp');
const inner = (f) => { const s = readFileSync(f, 'utf8'); return s.slice(s.indexOf('>', s.indexOf('<svg')) + 1, s.lastIndexOf('</svg>')); };
const ISO = inner('src/assets/brand/isotipo.svg'), WM = inner('src/assets/brand/wordmark.svg');
const W = 1200, H = 630, wmW = 600, wmH = wmW * 217 / 902, isoH = 470, isoW = isoH * 567 / 739;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#F0EEE9"/>
  <svg x="88" y="${(H - wmH) / 2}" width="${wmW}" height="${wmH}" viewBox="0 0 902 217" fill="#0F0F0F">${WM}</svg>
  <svg x="${W - 88 - isoW}" y="${(H - isoH) / 2}" width="${isoW}" height="${isoH}" viewBox="0 0 567 739" fill="#6B6AF4">${ISO}</svg>
</svg>`;
await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true }).toFile('public/og/verk-og.png');
console.log('public/og/verk-og.png', (await sharp('public/og/verk-og.png').metadata()).width, 'x', (await sharp('public/og/verk-og.png').metadata()).height);
