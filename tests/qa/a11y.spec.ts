import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { PAGES } from './pages';

// WCAG 2.2 AA via axe-core (docs/21 §18). Full violation detail is attached
// to the HTML report (npm run qa:report); the assertion lists one line each.

for (const path of PAGES) {
  test(`axe WCAG 2.2 AA: ${path}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(path, { waitUntil: 'networkidle' });

    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    await test.info().attach('axe-violations.json', {
      body: JSON.stringify(violations, null, 2),
      contentType: 'application/json',
    });
    expect(violations.map((v) => `${v.impact} · ${v.id} · ${v.nodes.length} nodes · ${v.help}`)).toEqual([]);
  });
}
