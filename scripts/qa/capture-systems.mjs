// Captura de las portadas públicas de los sistemas que bloquean el embebido (autorizado el 2026-11-05):
// PRISMA, CleanSolarAus y WATERLÜ. Solo la página pública inicial, sin iniciar sesión ni interactuar.
// Salida: public/systems/<id>-site.webp (1280×800, primera pantalla) + public/systems/captures.json
import { createRequire } from 'node:module'; import { writeFileSync, statSync } from 'node:fs';
const req = createRequire(import.meta.url); const { chromium } = req('playwright'); const sharp = req('sharp');
const SITES = { 'sis-03': 'https://prisma-site-eight.vercel.app/', 'sis-05': 'https://cleansolaraus.com/', 'sis-10': 'https://waterlu.com.mx/' };
const b = await chromium.launch({ channel: 'chrome' }); const log = { capturado: new Date().toISOString().slice(0, 10), viewport: '1440×900, primera pantalla', sitios: {} };
for (const [id, url] of Object.entries(SITES)) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(url, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {});
  await p.waitForTimeout(2500);
  const out = `public/systems/${id}-site.webp`;
  await sharp(await p.screenshot()).resize({ width: 1280 }).webp({ quality: 74 }).toFile(out);
  log.sitios[id] = { url, archivo: out.replace('public', ''), w: 1280, h: 800, kb: +(statSync(out).size / 1024).toFixed(1), titulo: await p.title() };
  console.log(id, JSON.stringify(log.sitios[id])); await p.close();
}
await b.close();
writeFileSync('public/systems/captures.json', JSON.stringify(log, null, 2) + '\n');
