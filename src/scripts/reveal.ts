/**
 * reveal.ts — Phase 5
 *
 * Activates the [data-reveal] system that has existed in motion.css since
 * Phase 1 but was never connected (docs/17, Hallazgo 1). Without this file,
 * every [data-reveal] element sits at opacity:0 permanently.
 */

export function initReveal(): void {
  const elements = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        const delay = parseInt(el.dataset.revealDelay || '0', 10);
        window.setTimeout(() => el.classList.add('is-visible'), delay);
        observer.unobserve(el);
      }
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}

document.addEventListener('astro:page-load', initReveal);
