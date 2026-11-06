// Capturas de página completa en 1920/1440/1024/768/390 (estado final de cada sección tras recorrerla) + scroll horizontal.
// Uso: node scripts/qa/full-pages.mjs [url] → qa-artifacts/f3-integration/shots/full-<w>.png
import { createRequire } from 'node:module'; import { mkdirSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const U = process.argv[2] ?? 'http://127.0.0.1:4322/', D = 'qa-artifacts/f3-integration/shots'; mkdirSync(D, { recursive: true });
const b = await chromium.launch({ channel: 'chrome' });
for (const w of [1920, 1440, 1024, 768, 390]) {
  const ctx = await b.newContext({ viewport: { width: w, height: w > 1500 ? 1080 : w > 800 ? 900 : w > 500 ? 1024 : 844 }, ...(w < 500 ? { isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : {}) });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(U, { waitUntil: 'networkidle' }); await p.waitForTimeout(2500);
  await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 300) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 90)); } });
  await p.waitForTimeout(1200);
  const sx = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(600);
  await p.screenshot({ path: `${D}/full-${w}.png`, fullPage: true });
  console.log(w, 'scrollX', sx, 'alto', await p.evaluate(() => document.documentElement.scrollHeight), errs);
  await ctx.close();
}
await b.close();
