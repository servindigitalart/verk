// Capturas de las páginas públicas de los sistemas con sitio publicado y aprobado (PRISMA, CleanSolarAus y WATERLÜ,
// autorizadas el 2026-11-05; Sonoro, 2026-11-06: el portfolio pasa a presentarse solo con capturas, sin iframes). Solo la página pública inicial, sin iniciar sesión ni interactuar.
// Salida: public/systems/<id>-site.webp, -site-2.webp y -site-3.webp (pantallas 1, 2 y 3, 1280×800) + captures.json
import { createRequire } from 'node:module'; import { writeFileSync, statSync } from 'node:fs';
const req = createRequire(import.meta.url); const { chromium } = req('playwright'); const sharp = req('sharp');
const SITES = { 'sis-01': 'https://sonoro-six.vercel.app/', 'sis-03': 'https://prisma-site-eight.vercel.app/', 'sis-05': 'https://cleansolaraus.com/', 'sis-10': 'https://waterlu.com.mx/' };
const b = await chromium.launch({ channel: 'chrome' }); const log = { capturado: new Date().toISOString().slice(0, 10), viewport: '1440×900, primera pantalla', sitios: {} };
for (const [id, url] of Object.entries(SITES)) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(url, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {});
  await p.waitForTimeout(2500);
  const out = `public/systems/${id}-site.webp`;
  await sharp(await p.screenshot()).resize({ width: 1280 }).webp({ quality: 74 }).toFile(out);
  // segunda pantalla real del mismo sitio (scroll de una altura de viewport): imagen secundaria del marco del proyecto
  await p.evaluate(() => scrollTo(0, innerHeight)); await p.waitForTimeout(1800);
  const out2 = `public/systems/${id}-site-2.webp`;
  await sharp(await p.screenshot()).resize({ width: 1280 }).webp({ quality: 74 }).toFile(out2);
  // tercera pantalla (dos alturas de viewport): la pestaña «Sitio» usa la 2.ª y la 3.ª; «Vista» usa la 1.ª
  await p.evaluate(() => scrollTo(0, innerHeight * 2)); await p.waitForTimeout(1800);
  const out3 = `public/systems/${id}-site-3.webp`;
  await sharp(await p.screenshot()).resize({ width: 1280 }).webp({ quality: 74 }).toFile(out3);
  log.sitios[id] = { url, archivos: [out, out2, out3].map((o) => o.replace('public', '')), w: 1280, h: 800, kb: [out, out2, out3].map((o) => +(statSync(o).size / 1024).toFixed(1)), titulo: await p.title() };
  console.log(id, JSON.stringify(log.sitios[id])); await p.close();
}
await b.close();
writeFileSync('public/systems/captures.json', JSON.stringify(log, null, 2) + '\n');
