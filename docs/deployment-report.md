# Verk — Deployment Readiness Report

Date: 2026-07-29
Scope: infrastructure only, per instructions — no visual, copy, or section changes were made.

## Summary

The Astro site itself was already in good shape (clean component structure, SEO
meta already implemented in `Layout.astro`, sensible `.gitignore`, no unused
dependencies). The gaps were almost entirely deployment plumbing: no Netlify
config, no pinned Node version, no sitemap, a few dead asset references, and —
the biggest finding — **this working directory isn't a git repository yet**,
so it isn't actually connected to `github.com/servindigitalart/verk` for
Netlify to build from.

## Files created

| File | Purpose |
|---|---|
| `netlify.toml` | Build command, publish dir, pinned Node version, security headers, long-cache headers for hashed assets |
| `.nvmrc` | Pins Node to `22.16.0` so local/CI/Netlify match |
| `.env.example` | Documents every expected future env var (Supabase, Stripe, Resend, OpenAI/Anthropic/Google) as placeholders only |
| `public/robots.txt` | Allows all crawling, points at the generated sitemap |
| `public/favicon-32.png`, `public/favicon-16.png`, `public/apple-touch-icon.png` | Generated from the existing isotipo mark via `sips` (resize only, no redesign) — placeholder quality, see risks below |
| `docs/deployment.md` | Local dev, Netlify setup, env vars, common issues, custom domain steps |
| `docs/production-checklist.md` | Full readiness checklist across every audit area |
| `docs/deployment-report.md` | This report |

## Files modified

| File | Change |
|---|---|
| `package.json` | Added `engines.node >= 22.12.0`; added `@astrojs/sitemap` dependency |
| `package-lock.json` | Updated via `npm install` (sitemap) and `npm audit fix` (transitive security patches) |
| `astro.config.mjs` | Added `@astrojs/sitemap` integration; removed a stale commented-out Vercel-adapter note (site deploys to Netlify, not Vercel) |
| `.gitignore` | Added `.netlify/` (Netlify CLI local state) |
| `src/layouts/Layout.astro` | Removed a `<link>` to a nonexistent `favicon.svg`; changed the default `ogImage` from a nonexistent `/images/og-default.png` to the existing `/images/logo.png` so OG tags don't 404 in production |

No component markup, copy, CSS tokens, or section layout was touched.

## Infrastructure improvements

- **Netlify-ready via `netlify.toml`** — connecting the repo in the Netlify
  dashboard is now the only manual step required; build/publish/Node version are
  all declared in-repo.
- **Reproducible Node version** across local, GitHub, and Netlify via `.nvmrc` +
  `engines` (Astro 6 itself requires `>=22.12.0`; local was already on `22.16.0`).
- **Sitemap** (`@astrojs/sitemap`) now generates `sitemap-index.xml` on every
  build automatically; `robots.txt` points at it.
- **Dead references fixed**: the previous `Layout.astro` linked to four files
  that never existed (`favicon.svg`, `favicon-32.png`, `favicon-16.png`,
  `apple-touch-icon.png`) and one that never existed for OG (`og-default.png`).
  All now resolve to real files (verified in the built `dist/index.html`).

## Performance improvements (implemented)

- Long-term (`max-age=31536000, immutable`) caching for hashed `_astro/*` build
  output and `fonts/*` via `netlify.toml`.
- Shorter, revalidatable caching for un-hashed assets (`images/*`,
  `project-logos/*`) so future asset swaps don't require a cache-bust.
- Static Astro output (no adapter, no SSR) — confirmed this is still correct
  since nothing in the codebase needs server rendering yet; fastest possible
  Netlify hosting path.

## Performance — documented, not implemented (per instructions: "do NOT remove assets automatically")

- `public/images/logo.png`, `isotipo.png`, `logo-simple.png` are ~820–870KB
  each. These are simple two-tone graphics and are strong candidates for
  WebP/AVIF re-export or true SVG conversion — likely 90%+ size reduction
  available.
- `public/project-logos/bufon/*.png` (~1MB each) and `.../riot/riot-logo.png`
  (415KB) are the largest portfolio-preview assets; several other
  `project-logos/**` files are 30–65KB, which is reasonable for their apparent
  display size.
- None of the `<img>` usage in components uses Astro's built-in image
  optimization (`astro:assets`/`<Image />`) — all raw `<img>` tags (already
  correctly `loading="lazy" decoding="async"`). This is because the source
  files live in `public/` rather than `src/`, which is required for Astro to
  optimize them at build time. Migrating would mean moving files and changing
  import paths — a real change, so left as a recommendation rather than
  applied.

## Security improvements

- `netlify.toml` sets `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, and a `Permissions-Policy`
  disabling camera/mic/geolocation/FLoC.
- No Content-Security-Policy was added. Feasibility was reviewed: with Supabase,
  Stripe, and analytics not yet integrated, a CSP written today would need to be
  rewritten the moment any of those land, and a too-strict policy silently
  breaks scripts rather than failing loudly. Deferred by design — revisit once
  the first external service is actually wired in.
- `npm audit fix` (non-breaking) resolved 8 of 11 findings (`fast-uri`,
  `js-yaml`, `postcss`, `svgo`, `yaml` and dependents).
- **3 high-severity findings remain**, all in `astro`/`esbuild`/`sharp`
  (reflected/stored XSS in Astro's View Transitions and spread-attribute
  handling, plus an esbuild dev-server file-read issue). The fix is
  `astro@6.4.8 → 7.1.6`, which `npm` flags as a breaking change. This site uses
  `<ClientRouter />` (View Transitions), so the vulnerability class is
  relevant, not theoretical — **recommend testing the Astro 7 upgrade in a
  branch soon**, but a major-version bump was out of scope to apply
  unattended given the "no visual changes" constraint (Astro 7 could change
  transition/rendering behavior).

## Future-proofing (left ready, not implemented)

- `.env.example` already lists Supabase/Stripe/Resend/AI-provider variables —
  adding a real integration later is additive, not a rewrite.
- `astro.config.mjs` retains the commented-out i18n block for the deferred
  bilingual (ES/EN) rollout.
- Static output today; switching to `output: 'server'` + `@astrojs/netlify`
  adapter is a one-line change whenever a contact form or other server logic
  is added — noted directly in `astro.config.mjs`.

## Remaining risks / things you should decide on

1. **This directory has no `.git`.** GitHub already has `servindigitalart/verk`,
   but this local copy isn't connected to it. Nothing here can auto-deploy via
   Netlify until that's resolved. See `docs/deployment.md` for the two possible
   paths (this is the wrong local copy vs. this needs `git init` + push) — I
   did not take any git action since it's a judgment call only you can make
   safely.
2. Astro 6 → 7 security upgrade (above) — recommend scheduling, not blocking.
3. Neue Haas Grotesk font files are still absent (expected, license-gated) —
   site is fully functional on the fallback stack in the meantime.
4. Generated favicons are functional but not designed — same isotipo mark,
   just resized; fine for launch, worth revisiting with a proper SVG favicon.
5. Large image assets (above) are a real, quantified performance opportunity
   whenever there's time to re-export them.

## Validation performed

```
npm install     → clean, 3 remaining high-severity findings (documented above)
npm run build   → clean; only the pre-existing, expected font-fallback warnings
npm run preview → serves correctly; verified /, /robots.txt, /sitemap-index.xml
```

Verified in the built output: canonical URL, OG image, and all three favicon
links resolve to real files (previously 5 of them 404'd).

## Deployment readiness score: 8/10

Ready to connect to Netlify and deploy as soon as the git/GitHub connection is
sorted out (#1 above) — that's the only hard blocker. The two point deductions
are the pending Astro security upgrade and the unoptimized image assets;
neither blocks a working deploy, both are worth scheduling soon after launch.
