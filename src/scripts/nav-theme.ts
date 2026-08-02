/**
 * nav-theme.ts — Phase 5
 *
 * Makes the header live (docs/17 Part 2, docs/18 Part 3). Watches every
 * [data-theme] section and writes the dominant one to
 * document.documentElement.dataset.scrollTheme — Nav.astro's CSS reacts to
 * that attribute. Deliberately paused for the first ~5.8s (the Hero's own
 * reveal sequence, Hero.astro) so the header never reacts while it is
 * still introducing itself — reacting mid-entrance reads as nervous, not
 * aware (docs/18 Part 3, point 1).
 */

const HERO_HOLD_MS = 5800;

function dominantTheme(sections: HTMLElement[]): string | undefined {
  const mid = window.innerHeight / 2;
  for (const section of sections) {
    const rect = section.getBoundingClientRect();
    if (rect.top < mid && rect.bottom > mid) return section.dataset.theme;
  }
  return undefined;
}

export function initNavTheme(): void {
  const root = document.documentElement;
  const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-theme]'));
  if (!sections.length) return;

  root.dataset.scrollTheme = sections[0].dataset.theme || 'light';

  let paused = true;
  window.setTimeout(() => {
    paused = false;
    const current = dominantTheme(sections);
    if (current) root.dataset.scrollTheme = current;
  }, HERO_HOLD_MS);

  /*
   * rootMargin: '-50% 0px -50% 0px' with threshold: 0 collapses the
   * observer's intersection zone to a 1px line at the vertical center of
   * the viewport — a section is "intersecting" exactly when it straddles
   * that centerline, regardless of the section's own total height. A
   * plain `threshold: 0.5` (ratio of the TARGET's height) was the actual
   * bug caught in visual QA: it works for short sections but never fires
   * for Sistemas (six chapters, thousands of px tall) — the header stayed
   * stuck on Método's theme for the section's entire scroll range, a dark
   * pill sitting on Sistemas' near-black background. This fix matches the
   * same viewport-midpoint logic dominantTheme() already used for the
   * one-time post-hero-hold check above.
   */
  const observer = new IntersectionObserver(
    (entries) => {
      if (paused) return;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const theme = (entry.target as HTMLElement).dataset.theme;
        if (theme) root.dataset.scrollTheme = theme;
      }
    },
    { threshold: 0, rootMargin: '-50% 0px -50% 0px' }
  );

  sections.forEach((section) => observer.observe(section));
}

document.addEventListener('astro:page-load', initNavTheme);
