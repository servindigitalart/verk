# Verk — Motion & Interaction System

---

## Reference Findings Used

| Reference | Motion Evidence |
|---|---|
| **Basic/Dept** | Stagger entrance: 9 elements, ~62ms steps, start 500ms. Pinned sections (GSAP ScrollTrigger or CSS). Cinematic transition style. 60 animated elements. Custom cursor. CSS keyframe animations. |
| **Bakken & Bæck** | Stagger: 6 elements, ~200ms steps. Marquee (pause on hover). Group hover opacity transitions. Image scale on hover. Lenis-compatible smooth scroll. |
| **Instrument** | GSAP detected. 3D/WebGL. Page transitions. Scroll reveal. Swiper slideshow. Card hover effects (lift + border). Image hover (scale + reveal). Pinned sections. |
| **Studio Freight** | Lenis smooth scroll (detected). Interaction-focused micro-animations. Subtle intensity. Blend mode effects. No detected animation library — CSS-driven. |

---

## Motion Principles

1. **Motion communicates structure.** Things enter when you scroll to them, not before. Nothing moves without the user's attention.
2. **Entrance is the primary motion event.** Elements revealing on scroll entry are the core animation. Everything else is accent.
3. **Speed varies by hierarchy.** Display headlines: slower (800ms). Cards: faster (500ms). Labels: fastest (300ms).
4. **Stagger creates rhythm.** Lists, cards, and grids enter sequentially with a fixed step delay. 60ms for fast sequences, 120ms for deliberate sequences.
5. **Hover is immediate.** Hover transitions should feel instant — 150–250ms max. Sluggish hovers feel broken.
6. **Smooth scroll is the canvas.** Lenis makes the entire scroll experience premium before any animation plays.
7. **Custom cursor signals the brand.** Not a gimmick — it confirms that attention to detail is present at every level.
8. **Nothing loops without reason.** Marquee text loops because it carries more content than fits. Hero video loops because it sets atmosphere. Nothing else loops aimlessly.
9. **Accessibility first.** All animations respect `prefers-reduced-motion`. If motion is reduced, all elements are immediately visible, all transitions are instant.

---

## Smooth Scroll Foundation — Lenis

From Studio Freight analysis: Lenis smooth scroll was the single most identifiable motion tech from that reference.

**Implementation in Astro:**

```typescript
// src/scripts/lenis.ts
import Lenis from 'lenis';

let lenis: Lenis;

export function initLenis() {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
  return lenis;
}

export function getLenis() {
  return lenis;
}
```

Load in the Astro layout `<head>` as a module script:

```astro
<script>
  import { initLenis } from '../scripts/lenis';
  document.addEventListener('DOMContentLoaded', () => initLenis());
</script>
```

**GSAP + Lenis integration** (when GSAP ScrollTrigger is used):

```typescript
import { getLenis } from './lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const lenis = getLenis();
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);
```

---

## Page Transitions

**Recommended approach**: Astro View Transitions API (`<ViewTransitions />`) for route-level transitions.

```astro
---
// src/layouts/Layout.astro
import { ViewTransitions } from 'astro:transitions';
---
<head>
  <ViewTransitions />
</head>
```

**Custom transition direction (slide):**

```css
/* In global CSS */
::view-transition-old(root) {
  animation: 700ms var(--ease-in-expo) both slideOut;
}

::view-transition-new(root) {
  animation: 700ms var(--ease-out-expo) both slideIn;
}

@keyframes slideOut {
  to {
    opacity: 0;
    transform: translateY(-24px);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
}
```

**Alternative: GSAP page transitions** using a shared overlay element if more control is needed. Use View Transitions API for V1; upgrade to GSAP if more complex cross-fade or wipe effects are needed.

---

## Header / Pill Navigation Animation

The pill nav (floating, centered, dark) should:

1. **Not appear on page load** — fade in after 600ms delay
2. **On scroll down**: slightly compress (scale pill) or increase opacity subtly
3. **Active page**: pill highlight under the current page link

```css
/* Initial hidden state */
.nav {
  opacity: 0;
  transform: translateY(-8px) translateX(-50%);
  transition:
    opacity var(--duration-slow) var(--ease-out-expo),
    transform var(--duration-slow) var(--ease-out-expo);
}

.nav.is-visible {
  opacity: 1;
  transform: translateY(0) translateX(-50%);
}
```

```typescript
// Delay nav entrance
setTimeout(() => {
  document.querySelector('.nav')?.classList.add('is-visible');
}, 600);
```

---

## Scroll-Triggered Entrance Animations

### Implementation: Intersection Observer (CSS-only path)

For simple entrance animations without GSAP:

```typescript
// src/scripts/reveal.ts
export function initReveal() {
  const elements = document.querySelectorAll('[data-reveal]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const delay = parseInt(el.dataset.revealDelay || '0');
          setTimeout(() => {
            el.classList.add('is-visible');
          }, delay);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}
```

```css
/* In global CSS */
[data-reveal] {
  opacity: 0;
  transform: translateY(40px);
  transition:
    opacity var(--duration-slow) var(--ease-out-expo),
    transform var(--duration-slow) var(--ease-out-expo);
}

[data-reveal].is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

```html
<!-- Usage in Astro components -->
<h2 data-reveal>Infraestructura digital.</h2>
<p data-reveal data-reveal-delay="120">Sistemas que trabajan mientras tú no puedes.</p>
<div data-reveal data-reveal-delay="240">...</div>
```

### Implementation: GSAP ScrollTrigger (for complex sequences)

Use GSAP for pinned sections, horizontal scrolls, counter animations, and complex timelines.

```typescript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Stagger entrance for card grids
gsap.fromTo(
  '.card',
  { opacity: 0, y: 40 },
  {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.08,
    scrollTrigger: {
      trigger: '.services-grid',
      start: 'top 75%',
      once: true,
    },
  }
);
```

---

## Stagger Timing Reference

From Basic/Dept analysis: 9-element stagger, 62ms step, starting at 500ms.
From Bakken & Bæck analysis: 6-element stagger, 200ms step.

**Verk stagger standards:**

| Context | Step Delay | Start Delay | Notes |
|---|---|---|---|
| Page load (nav + hero) | 60ms | 400ms | Quick, cinematic |
| Card grids (3–6 items) | 80ms | 0ms (scroll-triggered) | Natural flow |
| Image galleries | 120ms | 0ms | Deliberate, elegant |
| List items | 60ms | 0ms | Fast, readable |
| Process steps | 150ms | 0ms | Slow and considered |
| Footer links | 40ms | 0ms | Fast, supplementary |

---

## Section Color Transitions (Scroll-Based)

As the user scrolls, sections alternate light/dark. The nav pill should react:

```typescript
// Observer that watches section data-theme attribute
const sections = document.querySelectorAll('[data-theme]');

const themeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const theme = (entry.target as HTMLElement).dataset.theme;
        document.documentElement.setAttribute('data-scroll-theme', theme || 'light');
      }
    });
  },
  { threshold: 0.5 }
);

sections.forEach((section) => themeObserver.observe(section));
```

The nav pill adapts:
```css
[data-scroll-theme="light"] .nav {
  background-color: rgba(15, 15, 15, 0.85);
  border-color: rgba(15, 15, 15, 0.12);
}

[data-scroll-theme="dark"] .nav {
  background-color: rgba(15, 15, 15, 0.70);
  border-color: rgba(240, 238, 233, 0.12);
}
```

---

## Custom Cursor

Confirmed pattern from Basic/Dept and Bakken & Bæck.

A custom cursor for Verk:

```typescript
// src/scripts/cursor.ts
export function initCursor() {
  const cursor = document.createElement('div');
  cursor.classList.add('cursor');
  document.body.appendChild(cursor);

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    cursorX += (mouseX - cursorX) * 0.12;
    cursorY += (mouseY - cursorY) * 0.12;
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
    requestAnimationFrame(animate);
  }
  animate();

  // States
  document.querySelectorAll('a, button, [data-cursor]').forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor--hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--hover'));
  });

  document.querySelectorAll('[data-cursor="view"]').forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor--view'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--view'));
  });
}
```

```css
/* Hide native cursor on desktop */
@media (pointer: fine) {
  * { cursor: none; }

  .cursor {
    position: fixed;
    top: 0;
    left: 0;
    width: 12px;
    height: 12px;
    background-color: var(--color-accent-lime);
    border-radius: 50%;
    pointer-events: none;
    z-index: var(--z-cursor);
    margin-top: -6px;
    margin-left: -6px;
    transition:
      width 200ms var(--ease-out-expo),
      height 200ms var(--ease-out-expo),
      background-color 200ms var(--ease-out-expo);
  }

  .cursor--hover {
    width: 32px;
    height: 32px;
    margin-top: -16px;
    margin-left: -16px;
    background-color: transparent;
    border: 1.5px solid var(--color-accent-lime);
    mix-blend-mode: exclusion;
  }

  .cursor--view {
    width: 72px;
    height: 72px;
    margin-top: -36px;
    margin-left: -36px;
    background-color: var(--color-accent-lime);
    /* Add label text: "Ver" */
  }
}
```

---

## Hover Behaviors

### Navigation links
From Basic/Dept: simple hover with `transform-transition`.

```css
.nav-link {
  transition: color 150ms ease, background-color 150ms ease;
}
```

### Cards
From Instrument: `interactive-hover-card` pattern — subtle lift + border reveal.

```css
.card {
  transition:
    transform 250ms var(--ease-out-expo),
    border-color 250ms var(--ease-out-expo),
    box-shadow 250ms var(--ease-out-expo);
}

.card:hover {
  transform: translateY(-4px);
  border-color: var(--color-border-medium);
  box-shadow: 0 16px 40px rgba(0,0,0,0.08);
}
```

### Image hovers
From Bakken & Bæck: scale with opacity mask.

```css
.image-wrap {
  overflow: hidden;
  border-radius: var(--radius-xl);
}

.image-wrap img {
  transition: transform 600ms var(--ease-out-expo);
}

.image-wrap:hover img {
  transform: scale(1.04);
}
```

### CTA buttons
Scale down on active state (basic/dept uses `transform-transition`):

```css
.btn {
  transition:
    background-color 200ms var(--ease-out-expo),
    transform 100ms var(--ease-out-expo);
}

.btn:hover { transform: scale(1.02); }
.btn:active { transform: scale(0.97); }
```

---

## Marquee Text

From Bakken & Bæck: horizontal marquee for social proof, sectors, capabilities.

```css
.marquee-track {
  overflow: hidden;
}

.marquee-inner {
  display: inline-flex;
  gap: var(--space-12);
  animation: marquee var(--motion-marquee-speed) linear infinite;
}

.marquee-inner:hover {
  animation-play-state: paused;
}
```

**Verk marquee uses:**
- Sector names: "Clínicas · Arquitectura · Inmobiliarias · Construción · Servicios Profesionales"
- Capability list: "Sitios Web · Automatización · Lead Capture · CRM · WhatsApp · SEO · Herramientas IA"
- Brand statement repetition: "CONSTRUIMOS SISTEMAS DIGITALES ·"

---

## Video Hero Direction

If a video hero is used (Bakken & Bæck uses hero-video, loop, muted):

- **Content**: Abstract system visualization, fast-cut interface demos, or environmental texture
- **Settings**: `autoplay muted loop playsinline`
- **Fallback**: Static image if video fails to load
- **Overlay**: Semi-transparent dark overlay + noise grain to allow text legibility
- **Performance**: Serve `.mp4` (H.264) and `.webm` (VP9). Use `preload="none"` for below-fold videos.

```html
<video autoplay muted loop playsinline class="hero-video">
  <source src="/videos/hero.webm" type="video/webm">
  <source src="/videos/hero.mp4" type="video/mp4">
</video>
```

---

## Glitch / Grid Effects

From Studio Freight: these are accent effects, not structural.

**Isotipo glitch** (on hover or section entrance):
```css
@keyframes glitchShift {
  0%   { clip-path: inset(0 0 95% 0); transform: translate(-4px, 0); }
  20%  { clip-path: inset(20% 0 60% 0); transform: translate(4px, 0); }
  40%  { clip-path: inset(50% 0 20% 0); transform: translate(-2px, 0); }
  60%  { clip-path: inset(80% 0 5% 0); transform: translate(2px, 0); }
  80%  { clip-path: inset(0 0 80% 0); transform: translate(0, 0); }
  100% { clip-path: inset(0 0 95% 0); transform: translate(-4px, 0); }
}
```

Use sparingly: one instance per page, triggered on a key hero element or the isotipo itself.

---

## Counter / Number Animations

For metrics sections (e.g., "48 horas promedio de entrega / 98% de retención"):

```typescript
function animateCount(el: HTMLElement, target: number, duration: number) {
  const start = 0;
  const startTime = performance.now();

  function update(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
    el.textContent = Math.round(start + (target - start) * eased).toString();

    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}
```

---

## Recommended Libraries

| Library | Use | Version approach |
|---|---|---|
| **Lenis** | Smooth scroll foundation | `@studio-freight/lenis` or `lenis` |
| **GSAP** | Complex scroll animations, pinned sections, counters | Free tier (ScrollTrigger included) |
| **Motion** (Framer) | React island animations, if React components are used | Only in islands |
| **Astro View Transitions** | Page transitions | Built into Astro — no install |

---

## What Should Be CSS-Only

- All hover transitions (color, background, border, scale)
- Marquee animation
- Noise grain overlay
- Button active states
- Link underline animations
- Nav pill entrance (single element, simple)
- Fade/fadeUp entrance classes triggered by IntersectionObserver

---

## What Should Use JavaScript (no library)

- IntersectionObserver for scroll-triggered reveals
- Custom cursor (requestAnimationFrame loop)
- Stagger delay assignment for card grids
- Nav theme observer (light/dark section detection)
- Counter animations
- Nav entrance delay

---

## What Should Use GSAP

- Pinned scroll sections (service parallax or project detail)
- Complex timelines with multiple elements
- ScrollTrigger-based animations that need scrub
- Hero sequence orchestration (coordinated multi-element entrance)
- Horizontal scroll panels (if used for work section)

---

## What Should Use Lenis

- Everything scroll-related — Lenis is always on
- Lenis provides the foundation; GSAP and IntersectionObserver work on top of it

---

## What to Avoid for Performance

- **Three.js / WebGL in hero**: Too heavy for the target market (mobile connections in León)
- **Particle systems**: Performance cost without conversion value
- **Heavy entrance animations on mobile**: Mobile gets simplified entrances (fade only, no translate)
- **Auto-playing video at high bitrate**: Always use compressed `.webm` first, fallback `.mp4`
- **Too many simultaneous GSAP ScrollTriggers**: Cap at ~15 active at once
- **Lottie for complex animations**: Use CSS or GSAP instead; Lottie JSON can be large
- **Rive for decorative elements**: Use only if the isotipo needs a complex animation sequence

---

## Reduced-Motion Accessibility

```css
@media (prefers-reduced-motion: reduce) {
  /* Kill all transitions and animations */
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  /* Ensure all reveals are visible without animation */
  [data-reveal],
  [data-reveal].is-visible {
    opacity: 1;
    transform: none;
  }

  /* Stop marquee */
  .marquee-inner {
    animation: none;
  }
}
```

In JavaScript:
```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  initLenis();
  initCursor();
  // other motion inits
}
```

---

## Isotipo as Motion Element

The two parallelogram shapes can animate:

1. **Hero entrance**: Shapes slide in from off-screen left/right, settle behind the headline
2. **Section divider**: Shapes scale in on dark-to-light transitions
3. **Cursor state**: Cursor transforms into the isotipo shape when hovering over project cards
4. **Loading state**: Isotipo shape scales and rotates as a page loader (only if initial load > 1.5s)
5. **Idle state**: Very subtle parallax drift on the hero (2–5px at most)

All isotipo motion should be slow and confident — never frantic or fast.
