# Verk — Deployment Guide

Astro 6 static site. Builds to plain HTML/CSS/JS with no server runtime, deployed to
Netlify from the `servindigitalart/verk` GitHub repository.

## Local development

```bash
npm install
npm run dev       # http://localhost:4321
```

Node version is pinned in `.nvmrc` and `package.json` engines (`>=22.12.0`, matches
Astro 6's own requirement). If you use nvm:

```bash
nvm use
```

Other scripts:

```bash
npm run build      # production build → dist/
npm run preview    # serve dist/ locally, as Netlify would
npm run check      # astro check — type/template diagnostics
```

## Production deployment (Netlify)

Deployment is driven entirely by `netlify.toml` in the repo root — no dashboard
build-settings configuration needed beyond connecting the repo.

**One-time setup, from the Netlify dashboard:**

1. Add new site → Import an existing project → GitHub → select `servindigitalart/verk`.
2. Netlify reads `netlify.toml` automatically:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: pinned to match `.nvmrc`
3. Add environment variables under Site configuration → Environment variables
   (see `.env.example` for the expected list — leave unset until each service is
   actually wired up).
4. Deploy. Every subsequent `git push` to the production branch (`main`) triggers
   a new build and deploy automatically.

**Preview deploys:** Netlify creates a deploy preview for every pull request by
default — no extra configuration required.

### Prerequisite: connect this directory to the GitHub repo

At the time this doc was written, this working directory was **not yet a git
repository**, even though `github.com/servindigitalart/verk` already exists. Before
Netlify can build anything, this needs to be resolved — either:

- This directory is the wrong copy, and the real git-tracked working copy lives
  elsewhere (check for another clone before doing anything destructive here), or
- This directory needs to be initialized and pushed:

  ```bash
  git init
  git remote add origin https://github.com/servindigitalart/verk.git
  git add .
  git commit -m "Initial commit"
  git branch -M main
  git push -u origin main
  ```

  Only do this after confirming the GitHub repo is empty or that overwriting its
  history is intended — pushing to an existing repo with unrelated history will
  conflict.

## Environment variables

All expected variables are documented with placeholders in `.env.example`. None
are currently required for the site to build or run — they're staged for future
integrations (Supabase, Stripe, Resend, AI providers). Copy the file to `.env` for
local work; set real values in Netlify's environment variables UI for production.
`PUBLIC_`-prefixed variables are inlined at build time and visible client-side by
design (Astro convention) — never put secrets behind that prefix.

## Common deployment issues

- **Build fails on Node version mismatch.** Netlify should pick up `NODE_VERSION`
  from `netlify.toml` (`[build.environment]`) automatically. If it doesn't, set it
  explicitly in Site configuration → Build & deploy → Environment.
- **Fonts render in the fallback typeface.** Neue Haas Grotesk is a licensed font
  and its `.woff2` files are not in the repo (`public/fonts/` only has a
  `.gitkeep` and a README). The site falls back to `Helvetica Neue`/`Arial` until
  the licensed files are added. This is expected, not a bug — see
  `public/fonts/.gitkeep` for the exact file list needed.
- **Images 404 on `/project-logos/...` paths with spaces.** A few folders (e.g.
  `bloom undies`) have spaces in directory names. Browsers percent-encode these
  automatically when Astro emits the `src`, so this works as-is, but avoid adding
  further asset paths with spaces — prefer kebab-case for anything new.
- **`npm audit` shows high-severity findings in `astro`/`esbuild`/`sharp`.** The
  fix requires a major version bump (`astro@6` → `7`), which is a breaking change
  and was intentionally *not* applied automatically. See
  `docs/deployment-report.md` for details before deciding when to take it.

## Connecting a custom domain later

1. Netlify: Site configuration → Domain management → Add a domain (`verk.mx`).
2. Point DNS at Netlify (either delegate the domain's nameservers to Netlify DNS,
   or add the A/ALIAS + CNAME records Netlify provides for an external DNS host).
3. Netlify provisions a Let's Encrypt TLS certificate automatically once DNS
   resolves.
4. `astro.config.mjs` already sets `site: 'https://verk.mx'`, which drives
   canonical URLs, OpenGraph URLs, and the sitemap — no code change needed when
   the domain goes live, only DNS + the Netlify domain attachment.
