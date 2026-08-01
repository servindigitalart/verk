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

  const observer = new IntersectionObserver(
    (entries) => {
      if (paused) return;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const theme = (entry.target as HTMLElement).dataset.theme;
        if (theme) root.dataset.scrollTheme = theme;
      }
    },
    { threshold: 0.5 }
  );

  sections.forEach((section) => observer.observe(section));
}

document.addEventListener('astro:page-load', initNavTheme);
