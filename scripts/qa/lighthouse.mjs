// Lighthouse mobile + desktop runs (docs/21 §19). Dev-only.
//   npm run qa:lighthouse                 → provisional production URL
//   npm run qa:lighthouse -- <url>        → any URL (e.g. http://localhost:4321/)
// Reports: qa-artifacts/lighthouse/<stamp>-<formFactor>.{html,json}
import { mkdirSync, writeFileSync } from 'node:fs';
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import * as chromeLauncher from 'chrome-launcher';

const url = process.argv[2] ?? process.env.BASE_URL ?? 'https://verk-site.netlify.app/';
const outDir = 'qa-artifacts/lighthouse';
const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
mkdirSync(outDir, { recursive: true });

for (const [formFactor, config] of [['mobile', undefined], ['desktop', desktopConfig]]) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new'] });
  try {
    const { lhr, report } = await lighthouse(
      url,
      { port: chrome.port, output: ['html', 'json'], logLevel: 'error' },
      config,
    );
    const base = `${outDir}/${stamp}-${formFactor}`;
    writeFileSync(`${base}.html`, report[0]);
    writeFileSync(`${base}.json`, report[1]);

    const score = (k) => Math.round((lhr.categories[k]?.score ?? 0) * 100);
    const audit = (k) => lhr.audits[k]?.displayValue ?? 'n/a';
    console.log(
      `${formFactor.padEnd(8)} perf ${score('performance')} · a11y ${score('accessibility')} · ` +
        `bp ${score('best-practices')} · seo ${score('seo')} | LCP ${audit('largest-contentful-paint')} · ` +
        `CLS ${audit('cumulative-layout-shift')} · TBT ${audit('total-blocking-time')} → ${base}.html`,
    );
  } finally {
    await chrome.kill();
  }
}
