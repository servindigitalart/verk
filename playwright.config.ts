import { defineConfig } from '@playwright/test';

/**
 * QA harness (docs/21 §17–19). Dev-only: nothing here reaches the Astro bundle.
 *
 *   npm run qa          → provisional production URL (read-only)
 *   npm run qa:local    → starts `astro dev` and tests http://localhost:4321
 *   BASE_URL=… npm run qa → any other target
 *
 * Uses the system Google Chrome (channel 'chrome') so no browser download is
 * needed. Without Chrome: `npx playwright install chromium` and PW_CHANNEL=chromium.
 */
const local = Boolean(process.env.QA_LOCAL);
const baseURL =
  process.env.BASE_URL ?? (local ? 'http://localhost:4321' : 'https://verk-site.netlify.app');

export default defineConfig({
  testDir: 'tests/qa',
  outputDir: 'qa-artifacts/test-results',
  reporter: [['list'], ['html', { outputFolder: 'qa-artifacts/report', open: 'never' }]],
  fullyParallel: true,
  retries: 0,
  timeout: 90_000,
  use: {
    baseURL,
    channel: process.env.PW_CHANNEL ?? 'chrome',
    locale: 'es-MX',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop-1440', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'tablet-768', use: { viewport: { width: 768, height: 1024 }, hasTouch: true } },
    {
      name: 'mobile-390',
      use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 },
    },
  ],
  webServer: local
    ? { command: 'npm run dev -- --port 4321', url: 'http://localhost:4321', reuseExistingServer: true }
    : undefined,
});
