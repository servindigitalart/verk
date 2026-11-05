// INP aproximado en laboratorio (Event Timing): interacciones reales sobre la home con CPU ×4 en móvil y sin
// limitación en escritorio. Requiere `npx astro preview --port 4322`.
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const B = process.env.BASE_URL ?? 'http://127.0.0.1:4322';
const b = await chromium.launch({ channel: 'chrome' });
for (const [name, opts, cpu] of [['móvil CPU×4', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 }, 4], ['escritorio', { viewport: { width: 1440, height: 900 } }, 1]]) {
  const ctx = await b.newContext(opts); const p = await ctx.newPage(); const cdp = await ctx.newCDPSession(p);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: cpu });
  await p.addInitScript(() => { window.__ev = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.interactionId) window.__ev.push({ n: e.name, d: Math.round(e.duration), t: e.target?.className || e.target?.tagName }); }).observe({ type: 'event', durationThreshold: 16, buffered: true }); });
  await p.goto(B + '/', { waitUntil: 'networkidle' }); await p.waitForTimeout(+(process.env.WAIT ?? 1500));
  const tap = (sel) => (opts.hasTouch ? p.tap(sel) : p.click(sel));
  await tap('.hero .sub');                                      // toque/clic en el hero (ráfaga del campo)
  await p.waitForTimeout(300);
  if (opts.hasTouch) { await tap('.nav-toggle'); await p.waitForTimeout(300); await tap('.menu a[href="#sistemas"]'); }
  else await tap('.nav-links a[href="#sistemas"]');
  await p.waitForTimeout(800);
  await tap('[data-open="SIS-03"]'); await p.waitForTimeout(500); await tap('#sp-t1'); await p.waitForTimeout(200); await p.keyboard.press('Escape');
  await p.waitForTimeout(300); await tap('[data-open="SIS-01"]'); await p.waitForTimeout(1500); await p.keyboard.press('Escape');
  await p.waitForTimeout(500);
  const ev = await p.evaluate(() => window.__ev);
  const byId = Math.max(0, ...ev.map((e) => e.d));
  console.log(name.padEnd(12), 'INP≈', byId, 'ms', JSON.stringify(ev.sort((a, c) => c.d - a.d).slice(0, 4)));
  await ctx.close();
}
await b.close();
