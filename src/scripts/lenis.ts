/**
 * Lenis smooth scroll initialization.
 *
 * Integrates with Astro ViewTransitions lifecycle:
 *   astro:page-load  → init (fires on every page, including initial load)
 *   astro:before-swap → destroy (prevents RAF loop accumulation on navigation)
 *
 * Motion principle (doc 11): "The senior architect inspecting their completed obra."
 * Smooth, deliberate. Never rushed. Every movement chosen.
 *
 * If the user prefers reduced motion, Lenis is not initialized.
 * Native scroll is used instead — already set on html { scroll-behavior: auto }.
 */

import Lenis from 'lenis';

let lenis: Lenis | null = null;

function initLenis(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    touchMultiplier: 2,
  });

  function raf(time: number): void {
    lenis?.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

function destroyLenis(): void {
  lenis?.destroy();
  lenis = null;
}

document.addEventListener('astro:page-load', initLenis);
document.addEventListener('astro:before-swap', destroyLenis);
