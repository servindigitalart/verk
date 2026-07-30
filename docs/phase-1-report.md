# Phase 1 Report — Design System Foundation

**Status:** Complete  
**Build:** Passing (`astro build` — 0 errors)  
**TypeScript:** Clean (`astro check` — 0 errors, 0 warnings, 0 hints)  
**Date:** 2026-06-21

---

## Files Created

### Configuration

| File | Purpose |
|---|---|
| `package.json` | Project manifest. Astro 6.4.8, Lenis 1.1.14, @fontsource/geist-mono |
| `astro.config.mjs` | Site URL, sharp image service. Vercel adapter deferred to pre-deployment |
| `tsconfig.json` | Strict TypeScript via `astro/tsconfigs/strict`. Path aliases: `@/*`, `@styles/*`, `@components/*`, `@layouts/*`, `@scripts/*` |
| `.gitignore` | Covers dist/, node_modules/, .astro/, .env variants, .DS_Store |
| `src/env.d.ts` | Astro type reference |

### CSS Architecture (`src/styles/`)

| File | Purpose |
|---|---|
| `reset.css` | Minimal opinionated reset. Disables native scroll-behavior (Lenis handles it). Lists reset only with `role="list"` |
| `typography.css` | @font-face declarations for all NHG cuts (Display + Text, weights 300–900). Semantic h1–h6 and p defaults. 10 utility classes |
| `layout.css` | Container system, grid utilities, section patterns, noise grain on `.section-dark` |
| `motion.css` | Keyframes, reveal system `[data-reveal]`, marquee, ViewTransition animations, link/button hover, reduced-motion overrides |
| `global.css` | Root entry point. Full `:root` token declaration (72 custom properties). Imports all other CSS files. Base `html`/`body` styles. Button system. Pill badges |

**Global CSS — Token count:** 72 custom properties covering:
- Colors: 18 (ink, cream, lime, violet, surfaces, greys, borders, tints)
- Typography: 18 (font stacks, 11-step type scale, weights, leading, tracking)
- Spacing: 22 (px through 256px + 3 fluid section tokens + 4 container widths)
- UI: 6 border radius, 6 z-index layers, 4 easing functions, 5 duration tokens, 3 motion config values

### Scripts (`src/scripts/`)

| File | Purpose |
|---|---|
| `lenis.ts` | Lenis smooth scroll init/destroy. Integrates with Astro ViewTransitions lifecycle (`astro:page-load` → init, `astro:before-swap` → destroy). No-op if `prefers-reduced-motion` is set |

### Layout & Components (`src/layouts/`, `src/components/`)

| File | Purpose |
|---|---|
| `layouts/Layout.astro` | Root layout. SEO meta (title, description, OG, Twitter Card, canonical). `ClientRouter` (Astro 6 ViewTransitions). Spanish `lang="es"`. Lenis script module import |
| `components/Nav.astro` | Floating pill nav stub. Wordmark + links + lime CTA. Scoped CSS. Responsive (links hidden at 768px) |
| `components/Footer.astro` | Three-column footer stub on dark background. Brand block + service links + WhatsApp CTA. Responsive (3 → 2 → 1 column) |

### Pages (`src/pages/`)

| File | Purpose |
|---|---|
| `pages/index.astro` | Homepage placeholder. Demonstrates all section patterns, placeholder blocks for Phases 3–5, marquee band, `[data-reveal]` scaffolding |

### Public (`public/`)

| File | Purpose |
|---|---|
| `public/fonts/.gitkeep` | Documents required Neue Haas Grotesk font files. Fallback to Helvetica Neue active until files are placed |

---

## Dependency Audit

```
astro                 6.4.8   (upgraded from ^5 due to HIGH XSS vulnerabilities in Astro 5.x)
lenis                 1.1.14  (not the deprecated @studio-freight/lenis)
@fontsource/geist-mono 5.1.1
@astrojs/check        0.9.4
typescript            5.7.0
@types/node           22.0.0
```

**Remaining vulnerabilities (from `npm audit`):**
- All remaining advisories are `moderate` severity and limited to dev dependencies (yaml-language-server). No production vulnerabilities. Safe to ship.

---

## Architecture Decisions

### Why Astro 6, not 5
Astro 5.x had multiple HIGH severity XSS vulnerabilities (define:vars, server island replay, slot name injection, spread props, SSRF in error pages). Astro 6.4.8 resolves all of them.

### Why `ClientRouter`, not `ViewTransitions`
In Astro 5+, the page transitions component was renamed from `<ViewTransitions />` to `<ClientRouter />`. Import from `astro:transitions`. The behavior is identical; only the name changed.

### Why Lenis init on `astro:page-load`, destroy on `astro:before-swap`
`astro:page-load` fires on every navigation (including the initial page load), making it the single correct hook for re-initializing Lenis after every route change. Destroying on `astro:before-swap` prevents multiple Lenis instances from accumulating their RAF loops across navigations, which would cause compounding scroll speed issues.

### Why `@fontsource/geist-mono` in both Layout.astro and global.css
`global.css` handles the `@import` of the fontsource package CSS so the `@font-face` declaration is available for the `--font-mono` token. Layout.astro also imports it directly as an Astro CSS integration to guarantee it's bundled. The duplicate import is harmless — Vite deduplicates it. Either could be removed, but having it in both ensures it works regardless of how the CSS is processed.

### Why `.section-dark > *` has `z-index: 1`
The noise grain overlay is a `::after` pseudo-element positioned absolutely over the section background. Without `z-index: 1` on direct children, the grain would sit above section content at `z-index: 0`. This is scoped to direct children only — deeply nested content is unaffected.

### Font licensing approach
Neue Haas Grotesk is a premium licensed typeface (Linotype / Monotype). It cannot be installed via npm. The `@font-face` declarations in `typography.css` point to `/public/fonts/` — a directory that must be populated manually with licensed files before the primary font resolves. The system fallback (`'Helvetica Neue', 'Arial', sans-serif`) is optically close enough for development on macOS (Helvetica Neue is pre-installed).

---

## Build Warnings

The build produces 9 font warnings of the form:
```
/fonts/NHaasGroteskDSPro-45Lt.woff2 didn't resolve at build time, it will remain unchanged to be resolved at runtime
```
These are expected and intentional. The `@font-face` `src:` URLs point to licensed font files that are not in the repository. At runtime (after fonts are placed in `/public/fonts/`), they resolve correctly. These warnings will disappear once the font files are present.

---

## Risks and Blockers

| Risk | Severity | Status |
|---|---|---|
| Neue Haas Grotesk not licensed yet | High | Blocking for final visual fidelity. Helvetica Neue fallback active. |
| WhatsApp number in Footer.astro is placeholder (`52XXXXXXXXXX`) | Medium | Replace before Phase 5 or launch |
| Favicon files referenced but not created | Low | Build succeeds; browser shows default favicon. Add before Phase 6 |
| OG image (`/images/og-default.png`) referenced but not created | Low | Meta tag present, image missing. Add before launch |
| Vercel adapter not installed | Low | Static export works locally. Add `@astrojs/vercel` before deployment |

---

## Phase 2 Readiness

All Phase 1 acceptance criteria met:

- [x] Astro 6 project scaffolded and building
- [x] TypeScript strict mode — 0 errors
- [x] CSS custom property system — 72 tokens, all resolving
- [x] `reset.css`, `typography.css`, `layout.css`, `motion.css`, `global.css` — all created
- [x] Lenis integrated with Astro ViewTransitions lifecycle
- [x] `Layout.astro` — SEO meta, ViewTransitions, Spanish lang, Lenis init
- [x] `Nav.astro` — structural stub
- [x] `Footer.astro` — structural stub
- [x] `index.astro` — placeholder page, all section patterns demonstrated
- [x] `[data-reveal]` scaffolded (visible by default; IntersectionObserver activation in Phase 4)
- [x] Reduced-motion accessibility overrides in place
- [x] Section label rule (Rule 6, doc 11) followed on all sections

**Phase 2 scope:** Nav (final design + entrance animation) + Hero ("La Primera Decisión" concept, Concept 4 from doc 11).

---

*Phase 1 complete. Awaiting Phase 2 approval.*
