# Verk — Design System

> This document defines the design tokens and component patterns for Astro implementation.
> All values below should live in a global CSS file (e.g., `src/styles/global.css`).

---

## Reference Findings Used

- **Basic/Dept**: noise grain, high-contrast palette, stagger timing values
- **Bakken & Bæck**: whitespace scale, generous vertical rhythm
- **Instrument**: pill badge styles, card patterns, gradient accent usage
- **Studio Freight**: section divider logic, border hairlines

---

## CSS Custom Properties — Full Token Set

```css
/* ========================================
   VERK DESIGN SYSTEM — Global Tokens
   src/styles/global.css
   ======================================== */

:root {

  /* --- Colors --- */
  --color-ink:           #0F0F0F;
  --color-cream:         #F0EEE9;
  --color-accent-lime:   #BFEA00;
  --color-accent-violet: #6B6AF4;

  --color-surface-dark:  #111111;
  --color-surface-mid:   #1E1E1E;
  --color-surface-card:  #191919;

  --color-grey-100:      #1A1A1A;
  --color-grey-300:      #404040;
  --color-grey-500:      #666666;
  --color-grey-600:      #8C8C8C;
  --color-grey-700:      #B3B3B3;
  --color-grey-900:      #E8E8E4;

  --color-border-light:  rgba(15, 15, 15, 0.10);
  --color-border-medium: rgba(15, 15, 15, 0.18);
  --color-border-dark:   rgba(240, 238, 233, 0.12);
  --color-border-dark-strong: rgba(240, 238, 233, 0.22);

  /* --- Typography --- */
  --font-sans:  'Geist', system-ui, -apple-system, 'Helvetica Neue', sans-serif;
  --font-mono:  'Geist Mono', 'Fira Code', 'Cascadia Code', monospace;

  /* --- Type Scale (fluid) --- */
  --text-2xs:   clamp(0.625rem,  0.55rem  + 0.2vw,   0.75rem);
  --text-xs:    clamp(0.75rem,   0.70rem  + 0.25vw,  0.875rem);
  --text-sm:    clamp(0.875rem,  0.82rem  + 0.30vw,  1rem);
  --text-base:  clamp(1rem,      0.95rem  + 0.25vw,  1.125rem);
  --text-lg:    clamp(1.125rem,  1.05rem  + 0.40vw,  1.375rem);
  --text-xl:    clamp(1.375rem,  1.20rem  + 0.80vw,  1.75rem);
  --text-2xl:   clamp(1.75rem,   1.50rem  + 1.25vw,  2.5rem);
  --text-3xl:   clamp(2.5rem,    2.00rem  + 2.50vw,  4rem);
  --text-4xl:   clamp(4rem,      3.00rem  + 5.00vw,  7rem);
  --text-display: clamp(3.5rem,  2.00rem  + 8.00vw,  9rem);

  /* --- Font Weights --- */
  --weight-regular:  400;
  --weight-medium:   500;
  --weight-semibold: 600;
  --weight-bold:     700;
  --weight-black:    800;

  /* --- Line Heights --- */
  --leading-tight:   1.15;
  --leading-snug:    1.30;
  --leading-normal:  1.50;
  --leading-relaxed: 1.65;
  --leading-loose:   1.80;

  /* --- Letter Spacing --- */
  --tracking-tighter: -0.04em;
  --tracking-tight:   -0.02em;
  --tracking-normal:   0em;
  --tracking-wide:     0.06em;
  --tracking-wider:    0.10em;
  --tracking-widest:   0.16em;

  /* --- Spacing Scale --- */
  --space-0:   0px;
  --space-px:  1px;
  --space-0-5: 2px;
  --space-1:   4px;
  --space-2:   8px;
  --space-3:   12px;
  --space-4:   16px;
  --space-5:   20px;
  --space-6:   24px;
  --space-8:   32px;
  --space-10:  40px;
  --space-12:  48px;
  --space-14:  56px;
  --space-16:  64px;
  --space-20:  80px;
  --space-24:  96px;
  --space-28:  112px;
  --space-32:  128px;
  --space-40:  160px;
  --space-48:  192px;
  --space-56:  224px;
  --space-64:  256px;

  /* --- Fluid Section Padding --- */
  --section-padding-y:  clamp(80px, 10vw, 160px);
  --section-padding-x:  clamp(20px, 5vw,  80px);
  --hero-padding-y:     clamp(120px, 15vw, 240px);

  /* --- Border Radius --- */
  --radius-none:   0px;
  --radius-sm:     4px;
  --radius-md:     8px;
  --radius-lg:     12px;
  --radius-xl:     16px;
  --radius-2xl:    24px;
  --radius-full:   9999px;

  /* --- Container Widths --- */
  --container-sm:    640px;
  --container-md:    768px;
  --container-lg:    1024px;
  --container-xl:    1280px;
  --container-2xl:   1440px;
  --container-prose: 680px;

  /* --- Z-Index System --- */
  --z-below:    -1;
  --z-base:      0;
  --z-raised:    10;
  --z-floating:  20;
  --z-overlay:   30;
  --z-modal:     40;
  --z-toast:     50;
  --z-cursor:    100;

  /* --- Transitions --- */
  --ease-out-expo:  cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-expo:   cubic-bezier(0.7, 0, 0.84, 0);
  --ease-inout:     cubic-bezier(0.37, 0, 0.63, 1);
  --ease-spring:    cubic-bezier(0.34, 1.56, 0.64, 1);

  --duration-fast:    150ms;
  --duration-normal:  300ms;
  --duration-slow:    600ms;
  --duration-slower:  900ms;
  --duration-page:    700ms;

  /* --- Motion Tokens --- */
  --motion-stagger-start:    400ms;
  --motion-stagger-step:     60ms;
  --motion-entrance-y:       40px;
  --motion-entrance-opacity: 0;
  --motion-marquee-speed:    40s;

  /* --- Breakpoints (for reference in JS) --- */
  --bp-sm:   640px;
  --bp-md:   768px;
  --bp-lg:   1024px;
  --bp-xl:   1280px;
  --bp-2xl:  1536px;
}
```

---

## Base Styles

```css
/* ========================================
   BASE RESET & GLOBALS
   ======================================== */

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  scroll-behavior: auto; /* Lenis will handle smooth scroll */
}

body {
  font-family: var(--font-sans);
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  color: var(--color-ink);
  background-color: var(--color-cream);
  overflow-x: hidden;
}

img, video {
  max-width: 100%;
  display: block;
}

/* Section defaults */
section {
  padding-block: var(--section-padding-y);
  padding-inline: var(--section-padding-x);
}

/* Prose width limiter */
.prose {
  max-width: var(--container-prose);
}
```

---

## Container System

```css
/* ========================================
   CONTAINERS
   ======================================== */

.container {
  width: 100%;
  max-width: var(--container-xl);
  margin-inline: auto;
  padding-inline: var(--section-padding-x);
}

.container-wide {
  width: 100%;
  max-width: var(--container-2xl);
  margin-inline: auto;
  padding-inline: var(--section-padding-x);
}

.container-narrow {
  width: 100%;
  max-width: var(--container-prose);
  margin-inline: auto;
  padding-inline: var(--section-padding-x);
}

.container-full {
  width: 100%;
  /* No max-width — used for full-bleed sections */
}
```

---

## Grid System

```css
/* ========================================
   GRID
   ======================================== */

.grid {
  display: grid;
  gap: var(--space-6);
}

.grid-2 { grid-template-columns: repeat(2, 1fr); }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
.grid-4 { grid-template-columns: repeat(4, 1fr); }

/* Asymmetric layouts */
.grid-60-40 { grid-template-columns: 3fr 2fr; }
.grid-40-60 { grid-template-columns: 2fr 3fr; }
.grid-70-30 { grid-template-columns: 7fr 3fr; }

/* Auto-fill responsive grid */
.grid-auto {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

@media (max-width: 768px) {
  .grid-2,
  .grid-3,
  .grid-4,
  .grid-60-40,
  .grid-40-60,
  .grid-70-30 {
    grid-template-columns: 1fr;
  }
}
```

---

## Typography Styles

```css
/* ========================================
   TYPOGRAPHY
   ======================================== */

.text-display {
  font-size: var(--text-display);
  font-weight: var(--weight-bold);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
}

.text-h1 {
  font-size: var(--text-4xl);
  font-weight: var(--weight-bold);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
}

.text-h2 {
  font-size: var(--text-3xl);
  font-weight: var(--weight-semibold);
  line-height: var(--leading-snug);
  letter-spacing: var(--tracking-tight);
}

.text-h3 {
  font-size: var(--text-2xl);
  font-weight: var(--weight-semibold);
  line-height: var(--leading-snug);
}

.text-body {
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  font-weight: var(--weight-regular);
}

.text-label {
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--color-grey-600);
}

.text-mono {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
}
```

---

## Color Utility Classes

```css
/* ========================================
   COLOR UTILITIES
   ======================================== */

/* Backgrounds */
.bg-cream     { background-color: var(--color-cream); }
.bg-dark      { background-color: var(--color-surface-dark); }
.bg-ink       { background-color: var(--color-ink); }
.bg-lime      { background-color: var(--color-accent-lime); }
.bg-violet    { background-color: var(--color-accent-violet); }

/* Text */
.text-ink     { color: var(--color-ink); }
.text-cream   { color: var(--color-cream); }
.text-muted   { color: var(--color-grey-600); }
.text-lime    { color: var(--color-accent-lime); }
.text-violet  { color: var(--color-accent-violet); }

/* Dark section inversion */
[data-theme="dark"] {
  color: var(--color-cream);
  background-color: var(--color-surface-dark);
}

[data-theme="dark"] .text-label {
  color: var(--color-grey-700);
}

[data-theme="dark"] .border-line {
  border-color: var(--color-border-dark);
}
```

---

## Button Variants

```css
/* ========================================
   BUTTONS
   ======================================== */

.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  letter-spacing: var(--tracking-wide);
  line-height: 1;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition:
    background-color var(--duration-normal) var(--ease-out-expo),
    color var(--duration-normal) var(--ease-out-expo),
    transform var(--duration-fast) var(--ease-out-expo);
  white-space: nowrap;
}

.btn:active {
  transform: scale(0.97);
}

/* Primary — Lime on dark */
.btn-primary {
  background-color: var(--color-accent-lime);
  color: var(--color-ink);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-full);
}

.btn-primary:hover {
  background-color: #D4FF00;
}

/* Secondary — Ghost on light */
.btn-secondary {
  background-color: transparent;
  color: var(--color-ink);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border-medium);
}

.btn-secondary:hover {
  background-color: var(--color-ink);
  color: var(--color-cream);
  border-color: var(--color-ink);
}

/* Ghost dark — for dark sections */
.btn-ghost-dark {
  background-color: transparent;
  color: var(--color-cream);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border-dark-strong);
}

.btn-ghost-dark:hover {
  background-color: var(--color-cream);
  color: var(--color-ink);
  border-color: var(--color-cream);
}

/* Text link button */
.btn-link {
  background: none;
  color: inherit;
  padding: 0;
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* Arrow button variant */
.btn-arrow {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: inherit;
  text-decoration: none;
  transition: gap var(--duration-normal) var(--ease-out-expo);
}

.btn-arrow:hover {
  gap: var(--space-4);
}
```

---

## Navigation Styles

```css
/* ========================================
   NAVIGATION — Pill Nav Style
   ======================================== */

.nav {
  position: fixed;
  top: var(--space-6);
  left: 50%;
  transform: translateX(-50%);
  z-index: var(--z-floating);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background-color: rgba(15, 15, 15, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: var(--radius-full);
  border: 1px solid rgba(240, 238, 233, 0.10);
}

.nav-logo {
  display: flex;
  align-items: center;
  margin-right: var(--space-4);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  list-style: none;
}

.nav-link {
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: rgba(240, 238, 233, 0.7);
  text-decoration: none;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-full);
  transition:
    color var(--duration-normal) var(--ease-out-expo),
    background-color var(--duration-normal) var(--ease-out-expo);
}

.nav-link:hover {
  color: var(--color-cream);
  background-color: rgba(240, 238, 233, 0.08);
}

.nav-link[aria-current="page"] {
  color: var(--color-cream);
  background-color: rgba(240, 238, 233, 0.12);
}

.nav-cta {
  margin-left: var(--space-2);
  background-color: var(--color-accent-lime);
  color: var(--color-ink);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  text-decoration: none;
  transition: background-color var(--duration-normal) var(--ease-out-expo);
}

.nav-cta:hover {
  background-color: #D4FF00;
}
```

---

## Pill Badges

```css
/* ========================================
   PILL BADGES
   ======================================== */

.pill {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  letter-spacing: var(--tracking-wide);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  line-height: 1.4;
}

.pill-default {
  background-color: var(--color-border-light);
  color: var(--color-grey-500);
}

.pill-lime {
  background-color: rgba(191, 234, 0, 0.12);
  color: var(--color-accent-lime);
  border: 1px solid rgba(191, 234, 0, 0.25);
}

.pill-violet {
  background-color: rgba(107, 106, 244, 0.12);
  color: var(--color-accent-violet);
  border: 1px solid rgba(107, 106, 244, 0.25);
}

.pill-dark {
  background-color: var(--color-surface-mid);
  color: var(--color-grey-700);
  border: 1px solid var(--color-border-dark);
}
```

---

## Card Styles

```css
/* ========================================
   CARDS
   ======================================== */

/* Service card — light background */
.card {
  padding: var(--space-8);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border-light);
  background-color: transparent;
  transition:
    border-color var(--duration-normal) var(--ease-out-expo),
    background-color var(--duration-normal) var(--ease-out-expo);
}

.card:hover {
  border-color: var(--color-border-medium);
  background-color: rgba(15, 15, 15, 0.03);
}

/* Service card — dark background */
.card-dark {
  padding: var(--space-8);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border-dark);
  background-color: var(--color-surface-mid);
  transition:
    border-color var(--duration-normal) var(--ease-out-expo),
    background-color var(--duration-normal) var(--ease-out-expo);
}

.card-dark:hover {
  border-color: var(--color-border-dark-strong);
  background-color: var(--color-grey-100);
}

/* Work/project card */
.card-project {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-xl);
  aspect-ratio: 4 / 3;
  background-color: var(--color-surface-mid);
}

.card-project-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--duration-slow) var(--ease-out-expo);
}

.card-project:hover .card-project-image {
  transform: scale(1.04);
}

.card-project-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--space-6);
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%);
  color: var(--color-cream);
}
```

---

## Section Styles

```css
/* ========================================
   SECTION VARIANTS
   ======================================== */

/* Standard light section */
.section-light {
  background-color: var(--color-cream);
  color: var(--color-ink);
}

/* Standard dark section */
.section-dark {
  background-color: var(--color-surface-dark);
  color: var(--color-cream);
  position: relative;
}

/* Noise grain overlay on dark sections */
.section-dark::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
  opacity: 0.035;
  pointer-events: none;
  border-radius: inherit;
}

/* Full viewport hero section */
.section-hero {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-block: var(--hero-padding-y);
  padding-inline: var(--section-padding-x);
}

/* Divider line */
.section-divider {
  height: 1px;
  background-color: var(--color-border-light);
  margin-block: 0;
}

[data-theme="dark"] .section-divider {
  background-color: var(--color-border-dark);
}
```

---

## Footer Styles

```css
/* ========================================
   FOOTER
   ======================================== */

.footer {
  background-color: var(--color-surface-dark);
  color: var(--color-cream);
  padding-block: var(--section-padding-y);
  padding-inline: var(--section-padding-x);
}

.footer-top {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-16);
  padding-bottom: var(--space-16);
  border-bottom: 1px solid var(--color-border-dark);
  margin-bottom: var(--space-16);
}

.footer-headline {
  font-size: var(--text-3xl);
  font-weight: var(--weight-bold);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
  max-width: 20ch;
}

.footer-nav {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-8);
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.footer-legal {
  font-size: var(--text-xs);
  color: var(--color-grey-600);
}

@media (max-width: 768px) {
  .footer-top,
  .footer-nav {
    grid-template-columns: 1fr;
  }
}
```

---

## Motion / Animation Tokens

```css
/* ========================================
   MOTION — Entrance Animations
   ======================================== */

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(var(--motion-entrance-y));
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Motion utility classes */
.motion-fade-up {
  opacity: 0;
  transform: translateY(var(--motion-entrance-y));
}

.motion-fade-up.is-visible {
  animation: fadeUp var(--duration-slow) var(--ease-out-expo) forwards;
}

/* Reduced motion override */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .motion-fade-up {
    opacity: 1;
    transform: none;
  }
}
```

---

## Marquee Component

```css
/* ========================================
   MARQUEE
   ======================================== */

.marquee-track {
  overflow: hidden;
  white-space: nowrap;
}

.marquee-inner {
  display: inline-flex;
  gap: var(--space-8);
  animation: marquee var(--motion-marquee-speed) linear infinite;
}

.marquee-inner:hover {
  animation-play-state: paused;
}

.marquee-item {
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  flex-shrink: 0;
}
```

---

## Breakpoints Reference

```
Mobile:      < 640px
Tablet:      640px – 1023px
Desktop:     1024px – 1279px
Wide:        1280px – 1535px
Ultrawide:   ≥ 1536px
```

CSS media queries:
```css
/* Mobile first */
@media (min-width: 640px)  { /* sm */ }
@media (min-width: 768px)  { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

---

## Link Styles

```css
/* ========================================
   LINKS
   ======================================== */

a {
  color: inherit;
  text-decoration: none;
}

.link-underline {
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-thickness: 1px;
  transition: text-decoration-color var(--duration-normal) var(--ease-out-expo);
  text-decoration-color: var(--color-border-medium);
}

.link-underline:hover {
  text-decoration-color: currentColor;
}

/* Hover line from left */
.link-line {
  position: relative;
  display: inline-block;
}

.link-line::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background-color: currentColor;
  transition: width var(--duration-normal) var(--ease-out-expo);
}

.link-line:hover::after {
  width: 100%;
}
```
