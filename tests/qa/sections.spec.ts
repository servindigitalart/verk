import { test, expect } from '@playwright/test';

// Per-section captures for visual review (not pixel baselines — the design is
// about to change). reducedMotion: 'reduce' gives every section its final,
// deterministic state. Output: qa-artifacts/screenshots/<project>/NN-<id>.png

test('section screenshots', async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  const dir = `qa-artifacts/screenshots/${info.project.name}`;
  const sections = page.locator('main > section, body > footer, main > footer');
  const count = await sections.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    const s = sections.nth(i);
    const id = (await s.getAttribute('id')) ?? (await s.evaluate((el) => el.tagName.toLowerCase()));
    await s.scrollIntoViewIfNeeded();
    await s.screenshot({
      path: `${dir}/${String(i + 1).padStart(2, '0')}-${id}.png`,
      animations: 'disabled',
      // Fixed overlays get stitched mid-image on tall sections; the full-page shot keeps them.
      style: 'body > header, a[href^="#main"] { visibility: hidden !important; }',
    });
  }
  await page.screenshot({ path: `${dir}/00-full-page.png`, fullPage: true, animations: 'disabled' });
});
