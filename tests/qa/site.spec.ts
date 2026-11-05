import { test, expect, type Page } from '@playwright/test';
import { PAGES } from './pages';

// Console, network and navigation integrity. Selectors stay generic on purpose:
// the redesign will replace every component, these checks must survive it.

for (const path of PAGES) {
  test(`console & network clean: ${path}`, async ({ page }) => {
    const problems: string[] = [];
    page.on('console', (m) => m.type() === 'error' && problems.push(`console: ${m.text()}`));
    page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
    page.on('response', (r) => r.status() >= 400 && problems.push(`${r.status()} ${r.url()}`));
    page.on('requestfailed', (r) => problems.push(`failed: ${r.url()} (${r.failure()?.errorText})`));

    await page.goto(path, { waitUntil: 'networkidle' });
    await test.info().attach('problems.txt', { body: problems.join('\n') || 'none', contentType: 'text/plain' });
    expect(problems).toEqual([]);
  });

  test(`no horizontal overflow: ${path}`, async ({ page }) => {
    await page.goto(path, { waitUntil: 'networkidle' });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
  });
}

async function links(page: Page) {
  return page.$$eval('a[href]', (as) => as.map((a) => (a as HTMLAnchorElement).getAttribute('href')!));
}

test('in-page anchors point to existing ids', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  const hashes = [...new Set((await links(page)).filter((h) => h.startsWith('#') && h.length > 1))];
  const missing: string[] = [];
  for (const h of hashes) if ((await page.locator(h).count()) === 0) missing.push(h);
  expect(missing).toEqual([]);
});

test('same-origin links resolve (< 400) and no placeholder hrefs', async ({ page, request, baseURL }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  const all = await links(page);
  const placeholders = all.filter((h) => /X{4,}|example\.com|^#$|javascript:/i.test(h));
  const origin = new URL(baseURL!).origin;
  const internal = [
    ...new Set(
      all
        .map((h) => new URL(h, baseURL).href.split('#')[0])
        .filter((u) => u.startsWith(origin)),
    ),
  ];
  const broken: string[] = [];
  for (const u of internal) {
    const res = await request.get(u);
    if (res.status() >= 400) broken.push(`${res.status()} ${u}`);
  }
  expect.soft(placeholders, 'placeholder hrefs').toEqual([]);
  expect(broken, 'broken internal links').toEqual([]);
});

test('header present; mobile menu toggles and closes with Escape', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  const header = page.locator('header').first();
  await expect(header).toBeVisible();

  const toggle = page.locator('header [aria-controls][aria-expanded]').first();
  if (!(await toggle.isVisible())) {
    // Desktop: primary navigation links must be visible instead.
    await expect(page.locator('header nav a').first()).toBeVisible();
    return;
  }
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('first Tab reaches a skip link when one exists', async ({ page, isMobile }) => {
  test.skip(isMobile, 'keyboard check is desktop/tablet only');
  await page.goto('/', { waitUntil: 'networkidle' });
  const skip = page.locator('a[href^="#main"]').first();
  test.skip((await skip.count()) === 0, 'no skip link on this page');
  await page.keyboard.press('Tab');
  await expect(skip).toBeFocused();
});
