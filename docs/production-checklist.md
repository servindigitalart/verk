# Verk — Production Readiness Checklist

Status as of 2026-07-29. See `docs/deployment-report.md` for full detail behind
each item.

## Repository

- [x] `package.json` scripts (`dev`/`build`/`preview`/`check`) work as-is
- [x] `.gitignore` covers `node_modules/`, `dist/`, `.env*`, `.DS_Store`, `.astro/`, `.netlify/`
- [ ] **Working directory is not yet a git repository** — no `.git` present locally,
      despite `github.com/servindigitalart/verk` already existing. Must be
      resolved before any push/deploy can happen. See `docs/deployment.md`.
- [x] No unused dependencies (`astro`, `lenis`, `@fontsource/geist-mono`,
      `@astrojs/sitemap` all in active use)

## Netlify

- [x] `netlify.toml` created: build command, publish dir (`dist`), pinned Node
      version, security headers, long-cache headers for hashed assets
- [ ] Site not yet connected in the Netlify dashboard (requires git remote first)
- [ ] Production environment variables not yet set (none required until a
      service from `.env.example` is actually integrated)

## GitHub

- [x] No GitHub Actions added — deploys are Netlify-driven per instructions
- [ ] Local directory needs `git init` + remote + push (see above)

## Environment variables

- [x] `.env.example` documents every expected future variable with placeholders
      only — no secrets committed

## Fonts

- [x] Geist Mono loads correctly via `@fontsource` (self-hosted npm package, no
      external request)
- [ ] Neue Haas Grotesk (primary display/text face) — licensed `.woff2` files not
      yet present in `public/fonts/`; site currently renders in the documented
      fallback (`Helvetica Neue`/`Arial`). Purchase/license and drop in the exact
      filenames listed in `public/fonts/.gitkeep` when ready.
- [x] `font-display: swap` set on all `@font-face` rules (no invisible-text flash
      once real font files land)

## Images

- [x] Documented (not modified) — see `docs/deployment-report.md` for full list
- [ ] `public/images/{logo,isotipo,logo-simple}.png` are ~850KB each — recommend
      re-exporting as WebP/AVIF or true SVG before launch
- [ ] Several `public/project-logos/**` files exceed 400KB–1MB (`bufon`, `riot`)
      — recommend lossless compression before launch
- [x] All `<img>` usage already has `loading="lazy" decoding="async"`

## SEO

- [x] `@astrojs/sitemap` installed and wired into `astro.config.mjs`
- [x] `public/robots.txt` created, points at the sitemap
- [x] Canonical, OpenGraph, and Twitter Card meta already implemented in
      `Layout.astro`
- [x] Favicon set (16px/32px/apple-touch-icon) generated from the isotipo mark —
      placeholder-quality; replace with a designed SVG favicon before launch
- [ ] `ogImage` default now points at `/images/logo.png` (exists, so no more
      404) but a purpose-built 1200×630 OG card has not been designed — content
      task, out of scope here

## Performance

- [x] Static output (no SSR/adapter needed) — fastest possible Netlify hosting
      path
- [x] Long-term immutable caching configured for hashed `_astro/*` build assets
- [ ] See image sizes above — largest single lever available for a real
      performance win

## Accessibility

- [x] `lang="es"` set on `<html>`
- [x] Images carry `alt` attributes (empty `alt=""` on decorative isotipo marks
      is correct, not an oversight)
- Not audited beyond what's visible in markup — a full a11y pass (contrast,
  focus states, keyboard nav) is a separate exercise from this deployment prep

## Security

- [x] `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`,
      `Permissions-Policy` set via `netlify.toml`
- [ ] No CSP yet — deliberately deferred until Supabase/Stripe/analytics/font
      origins are known, to avoid shipping a policy that breaks on arrival
- [ ] `npm audit`: 3 high-severity findings remain, all requiring `astro@6 → 7`
      (breaking change) — not applied automatically, see
      `docs/deployment-report.md`

## Validation

- [x] `npm install` — clean
- [x] `npm run build` — clean
- [x] `npm run preview` — serves correctly
