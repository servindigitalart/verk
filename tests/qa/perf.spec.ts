import { test, expect } from '@playwright/test';

// Lab performance budget (docs/21 §19). Fast, per-viewport signal for every
// iteration; Lighthouse (npm run qa:lighthouse) is the authoritative score.
// Mobile runs with 4G-ish network + 4x CPU throttling via CDP (Chrome only).

const KB = 1024;
const BUDGET = { lcpMs: 2500, cls: 0.1, jsBytes: 20 * KB, cssBytes: 15 * KB, fontBytes: 120 * KB, longTasksMs: 200 };

test('performance budget (lab)', async ({ page }, info) => {
  if (info.project.name.startsWith('mobile')) {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 150,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
    });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  }

  await page.addInitScript(() => {
    const w = window as unknown as Record<string, number>;
    w.__lcp = -1; w.__cls = 0; w.__long = 0; // -1 = Chrome emitted no LCP entry
    new PerformanceObserver((l) => l.getEntries().forEach((e) => (w.__lcp = e.startTime)))
      .observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) =>
      l.getEntries().forEach((e: any) => { if (!e.hadRecentInput) w.__cls += e.value; }),
    ).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((l) => l.getEntries().forEach((e) => (w.__long += e.duration - 50)))
      .observe({ type: 'longtask', buffered: true });
  });

  await page.goto('/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const m = await page.evaluate(() => {
    const w = window as unknown as Record<string, number>;
    const res = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const sum = (re: RegExp) => res.filter((r) => re.test(r.name)).reduce((a, r) => a + r.transferSize, 0);
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return {
      lcpMs: Math.round(w.__lcp),
      cls: Number(w.__cls.toFixed(3)),
      longTasksMs: Math.round(w.__long),
      jsBytes: sum(/\.m?js(\?|$)/),
      cssBytes: sum(/\.css(\?|$)/),
      fontBytes: sum(/\.(woff2?|ttf|otf)(\?|$)/),
      imageBytes: sum(/\.(png|jpe?g|webp|avif|gif|svg)(\?|$)/),
      htmlBytes: nav?.transferSize ?? 0,
      requests: res.length + 1,
    };
  });

  await test.info().attach('metrics.json', { body: JSON.stringify(m, null, 2), contentType: 'application/json' });
  console.log(`[${info.project.name}]`, m);

  // No entry at all usually means the largest content starts hidden (opacity:0) — itself a failure.
  expect.soft(m.lcpMs, 'LCP entry recorded (content visible at load)').toBeGreaterThanOrEqual(0);
  for (const [k, max] of Object.entries(BUDGET)) {
    expect.soft(m[k as keyof typeof m], `${k} ≤ ${max}`).toBeLessThanOrEqual(max);
  }
});
