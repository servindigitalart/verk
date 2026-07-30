# Verk — Implementation Roadmap

> This roadmap assumes the strategy documents (01–07) have been reviewed and approved.
> Do not begin Phase 1 until Phase 0 is confirmed complete.
> Each phase has a clear goal, files involved, deliverables, and acceptance criteria.

---

## Phase 0 — Repo Audit & Reference Analysis

**Status**: Complete

**Goal**: Understand what exists in the repo, extract intelligence from reference sites, and generate all strategy documents.

**Files involved**:
- `/assets/references/*/analysis/*.json`
- `/assets/references/*/analysis/*.md`
- `/public/images/logo.png`, `logo-simple.png`, `isotipo.png`
- `/docs/01-brand-strategy.md` through `/docs/08-implementation-roadmap.md`

**Deliverables**:
- [x] Reference analysis consumed and synthesized
- [x] Logo system documented
- [x] Brand strategy defined
- [x] Visual direction defined
- [x] Design system tokens defined
- [x] Motion system defined
- [x] Site architecture defined
- [x] Content strategy written
- [x] Tech stack evaluated and recommended
- [x] This roadmap created

**Acceptance criteria**:
- All 8 strategy documents exist in `/docs`
- Client/founder has reviewed and approved direction
- No phase 1 work begins without explicit approval

---

## Phase 1 — Design System Foundation

**Goal**: Create the complete CSS token system, global styles, and base component stubs. Nothing visible yet — just the infrastructure layer.

**Files involved**:
```
src/
  styles/
    global.css         ← All tokens from doc 03
    reset.css          ← Base reset
    typography.css     ← Type utilities
    layout.css         ← Grid and container system
    motion.css         ← Animation keyframes and motion utilities
    components/
      buttons.css
      cards.css
      nav.css
      footer.css
      pills.css
```

**Tasks**:
1. Initialize Astro project with TypeScript (if not already initialized)
2. Configure `astro.config.mjs` (View Transitions, Image, i18n-ready)
3. Create `/src/styles/global.css` from doc 03 token set
4. Create base layout `src/layouts/Layout.astro` with `<head>`, `<ViewTransitions />`, meta tags
5. Install Lenis: `npm install lenis`
6. Create `src/scripts/lenis.ts` — initialize in layout
7. Install Geist font (via `@fontsource/geist` or Google Fonts import)
8. Define `src/styles/reset.css` (minimal, opinionated)
9. Create placeholder component stubs in `src/components/`
10. Configure Vercel adapter if deploying on Vercel: `npx astro add vercel`

**Deliverables**:
- Astro project runs locally with `npm run dev`
- Global CSS loaded with all tokens
- Lenis initialized (console logs confirm)
- Geist font loads correctly
- No 404 errors, no console errors

**Acceptance criteria**:
- `npm run build` completes without errors
- Lighthouse score on empty page: 100/100 (no JS penalty yet)
- Token values visible in browser DevTools `:root` inspection

**Risks**:
- Geist font may need manual hosting for best performance (use `@fontsource/geist` for self-hosting)
- Lenis conflicts with browser native scroll if initialized on SSR routes — ensure client-only initialization

---

## Phase 2 — Layout Shell

**Goal**: Build the structural skeleton of the site. All pages exist, all routes work, all navigation functions. No real content or motion yet.

**Files involved**:
```
src/
  layouts/
    Layout.astro       ← Base layout with head, nav, footer
  components/
    Nav.astro          ← Pill navigation (dark, floating, centered)
    Footer.astro       ← Footer structure (dark, editorial)
  pages/
    index.astro        ← Home (shell)
    servicios.astro    ← Services (shell)
    trabajo.astro      ← Work (shell)
    metodo.astro       ← Method/About (shell)
    contacto.astro     ← Contact (shell)
```

**Tasks**:
1. Build `Nav.astro` — pill nav with logo, links, CTA button
2. Build `Footer.astro` — dark, 2-part structure (headline/form + nav + legal)
3. Implement `Layout.astro` with Nav and Footer composed
4. Create all 5 page routes with empty section stubs
5. Add `<ViewTransitions />` — test navigation transitions between pages
6. Implement mobile nav (hamburger → overlay with staggered links)
7. Configure `aria-current="page"` on active nav links
8. Add meta tags (title, description, og:image per page)
9. Add favicon from isotipo

**Deliverables**:
- All 5 routes accessible and navigating correctly
- Nav pill renders correctly on all pages
- Footer renders correctly on all pages
- ViewTransitions smooth between pages
- Mobile nav opens and closes correctly
- Isotipo used as favicon

**Acceptance criteria**:
- Navigation works on mobile and desktop
- Page transitions fire without errors
- No orphaned routes or broken links
- Lenis smooth scroll works on all pages

**Risks**:
- ViewTransitions may conflict with scroll position restoration — test each transition
- Mobile nav overlay z-index conflicts with cursor (cursor should be hidden behind overlay)

---

## Phase 3 — Hero Prototype

**Goal**: Build and validate the hero section in isolation. The hero defines the visual tone of the entire site. This phase is a prototype — the final hero may iterate.

**Files involved**:
```
src/
  components/
    sections/
      Hero.astro
  scripts/
    hero-entrance.ts   ← Stagger entrance sequence
```

**Tasks**:
1. Build `Hero.astro` — full viewport, dark section
2. Implement headline typography (display size, clamp, tight tracking)
3. Add section label (`INFRAESTRUCTURA DIGITAL`)
4. Add subheadline and CTAs
5. Add isotipo shape(s) as background SVG elements
6. Implement hero entrance animation:
   - Label → 0ms
   - Headline line 1 → 60ms
   - Headline line 2 → 120ms
   - Subheadline → 200ms
   - CTAs → 300ms
   - Nav fade in → 400ms
7. Add ambient video option (with fallback to static)
8. Test on mobile: ensure hero content is not clipped

**Deliverables**:
- Hero section visually matches doc 02 direction
- Stagger entrance fires correctly on page load
- CTAs are correctly styled and linked
- Isotipo shapes appear as intended
- Mobile hero content is fully readable and unclipped

**Acceptance criteria**:
- Hero entrance animation plays exactly once on page load
- No cumulative layout shift (CLS) on hero
- Headline readable on all screen sizes without overflow
- Image/video loads without blocking render

**Risks**:
- Font loading can cause FOUT (Flash of Unstyled Text) on headline — preload Geist font
- Video background: must have a poster image fallback; must not autoplay with sound
- The isotipo SVG shapes need to be crisp at all sizes — use SVG, not PNG

---

## Phase 4 — Motion System

**Goal**: Implement the complete motion layer across the site. Scroll-triggered reveals, hover interactions, custom cursor, and marquee.

**Files involved**:
```
src/
  scripts/
    lenis.ts           ← Already from Phase 1
    reveal.ts          ← IntersectionObserver reveal system
    cursor.ts          ← Custom cursor
    marquee.ts         ← Marquee pause on hover
    gsap-init.ts       ← GSAP + ScrollTrigger initialization
  styles/
    motion.css         ← Keyframes, reveal states, cursor styles
```

**Tasks**:
1. Install GSAP: `npm install gsap`
2. Build `reveal.ts` — IntersectionObserver for `[data-reveal]` elements
3. Apply `[data-reveal]` and `[data-reveal-delay]` to all main content elements across pages
4. Build `cursor.ts` — custom cursor with lime accent
5. Implement cursor states: default / hover (ring) / view (expand with label)
6. Build GSAP integration with Lenis (ticker sync from doc 04)
7. Implement card hover effects (lift + border reveal)
8. Implement image hover effects (scale within overflow:hidden)
9. Implement marquee (sector names, capability list)
10. Implement nav entrance animation (delay 400ms from page load)
11. Test all motion with `prefers-reduced-motion: reduce`
12. Test on low-end mobile (throttled CPU in DevTools)

**Deliverables**:
- All page content reveals on scroll-enter
- Custom cursor active on desktop
- Card hover states functional
- Marquee running and pausing on hover
- All motion respects `prefers-reduced-motion`

**Acceptance criteria**:
- No janky or dropped frames on scroll (60fps target on mid-range desktop)
- `prefers-reduced-motion: reduce` disables all motion, content is fully visible
- Custom cursor is not visible on touch devices
- Lenis + GSAP integration confirmed working (no scroll position errors)

**Risks**:
- GSAP ScrollTrigger + Lenis integration requires specific ticker setup (see doc 04 — do not skip)
- Custom cursor on mobile: must be gated behind `pointer: fine` media query
- Too many GSAP ScrollTriggers can cause performance issues — cap at 15 active

---

## Phase 5 — Services & Conversion Sections

**Goal**: Build all homepage sections except hero and footer. This is the conversion core of the site.

**Files involved**:
```
src/
  components/
    sections/
      Problem.astro         ← Section 2
      Services.astro        ← Section 3 (service cards)
      Process.astro         ← Section 4 (numbered steps)
      Work.astro            ← Section 5 (featured systems)
      Sectors.astro         ← Section 6 (sector list/marquee)
      Difference.astro      ← Section 7 (comparison)
      CTA.astro             ← Section 8 (audit offer)
    ui/
      ServiceCard.astro
      ProcessStep.astro
      Pill.astro
```

**Tasks**:
1. Build `Problem.astro` — narrow text, no images, emotional copy
2. Build `Services.astro` — 3×2 card grid with `ServiceCard.astro`
3. Build `Process.astro` — 4-step numbered sequence (dark section)
4. Build `Work.astro` — 2–3 featured project cards (dark section, large)
5. Build `Sectors.astro` — sector marquee or sector tag grid
6. Build `Difference.astro` — 2-column or 3-card differentiator section
7. Build `CTA.astro` — full-bleed dark, headline + form + WhatsApp
8. Build WhatsApp floating button (mobile-first, bottom right)
9. Compose all sections into `index.astro`
10. Apply `[data-reveal]` to all section content
11. Test light/dark section alternation and visual rhythm
12. Test conversion flow: hero → sections → CTA → form

**Deliverables**:
- All 8 homepage sections rendered and connected
- Service cards functional with correct copy from doc 06
- Process steps animate on scroll
- CTA section form connected to backend (Make / Netlify Forms / Resend)
- WhatsApp buttons functional with pre-filled messages

**Acceptance criteria**:
- Every section visible and readable on mobile and desktop
- Form submits and shows confirmation message
- WhatsApp links open correctly in mobile WhatsApp
- Section dark/light alternation matches doc 02 sequence
- All copy from doc 06 is correctly placed

**Risks**:
- Contact form backend must be decided: Netlify Forms (simplest) or Make webhook
- WhatsApp pre-filled message must be URL-encoded (use `encodeURIComponent`)

---

## Phase 6 — Work / Systems Section

**Goal**: Build the `/trabajo` page and project content structure. Honest framing for prototype/experiment projects.

**Files involved**:
```
src/
  content/
    work/
      waterlu.md
      prisma.md
      sonoro.md
      doclink.md
      experiments.md
  pages/
    trabajo.astro        ← Work overview page
  components/
    sections/
      WorkGrid.astro
    ui/
      ProjectCard.astro  ← With status badge (Activo / Prototipo / Experimento)
```

**Tasks**:
1. Define Zod schema for work content collection (see doc 07)
2. Create `.md` files for each project with honest descriptions
3. Build `ProjectCard.astro` with:
   - Title, type, status pill, 1-line description
   - Visual (screenshot or abstract placeholder)
   - Hover effect (image scale + overlay)
4. Build `trabajo.astro` with grid of all project cards
5. Filter by status (featured first, then all)
6. Add `[data-reveal]` stagger on grid items
7. Link "Ver sistemas" CTA from homepage Work section to `/trabajo`

**Deliverables**:
- `/trabajo` page with all projects listed
- Status pills correctly styled (`Activo` = lime, `Prototipo` = violet, `Experimento` = grey)
- Project content correctly pulled from content collections
- Honest, non-fake framing for all prototype projects

**Acceptance criteria**:
- Type-safe content — TypeScript errors if schema is violated
- No project presented as a "client" that was actually a prototype
- Mobile card grid stacks correctly

**Risks**:
- Visual assets for projects may not exist yet — define a fallback abstract visual per category
- Individual project pages (`/trabajo/[slug]`) are Phase 6+ — do not build in V1 unless content exists

---

## Phase 7 — Footer Masterpiece

**Goal**: Build the footer as an editorial, brand-defining closing statement — not an afterthought.

**Files involved**:
```
src/
  components/
    Footer.astro        ← Full rebuild from Phase 2 shell
    ui/
      ContactForm.astro  ← Form within footer
```

**Tasks**:
1. Design final footer layout per doc 05 footer structure
2. Top section: headline ("¿Listo para construir tu sistema digital?") + contact form
3. Middle section: Verk logo/wordmark + tagline + 4-column nav links
4. Bottom section: legal, location, social links
5. Build `ContactForm.astro` with all fields from doc 05
6. Wire form to backend (Make / Netlify Forms)
7. Add entrance animation: footer content reveals as user scrolls in
8. Ensure footer dark section transitions naturally from CTA section

**Deliverables**:
- Footer matches editorial structure from doc 05
- Contact form functional
- All footer nav links correctly point to their routes
- Logo and tagline correctly placed
- Legal line and location visible

**Acceptance criteria**:
- Form submission works and shows confirmation
- Footer renders correctly on all viewports
- No orphaned links
- The footer reads like the brand's closing statement, not a sitemap dump

**Risks**:
- If footer and CTA section are both dark, ensure visual distinction (different headline scale, subtle texture difference)

---

## Phase 8 — Mobile Polish

**Goal**: Ensure every section, animation, and interaction works perfectly on mobile. Mobile is likely the primary device for the target market.

**Tasks**:
1. Audit every section at 375px, 390px, 428px viewport widths
2. Fix any headline overflow or font size issues
3. Verify mobile nav opens/closes correctly
4. Ensure WhatsApp buttons are tap-friendly (min 44px touch target)
5. Disable custom cursor on touch devices (pointer: fine media query)
6. Verify all images are lazy-loaded and not oversized
7. Test form inputs on mobile keyboard
8. Verify CTA buttons are easily tappable
9. Test `prefers-reduced-motion` on mobile
10. Test dark/light section transitions on mobile OLED screens (check for bleed)

**Deliverables**:
- All sections readable and functional at 375px
- No horizontal scroll anywhere
- Touch targets meet 44px minimum
- Forms usable with mobile keyboard without viewport jump

**Acceptance criteria**:
- Mobile Lighthouse score: 80+
- No broken layouts at 375px or 428px
- All tap interactions work without delay

---

## Phase 9 — Performance & Accessibility Audit

**Goal**: Ensure the site meets modern standards before launch.

**Performance targets**:
- Lighthouse Desktop: 95+
- Lighthouse Mobile: 80+
- Core Web Vitals: All green
- LCP (Largest Contentful Paint): < 2.5s
- CLS (Cumulative Layout Shift): < 0.1
- FID/INP: < 200ms

**Accessibility targets**:
- WCAG 2.1 AA minimum
- All interactive elements keyboard-accessible
- All images have meaningful alt text
- Color contrast ratio: 4.5:1 for body text, 3:1 for large text
- Landmark regions defined (`<main>`, `<nav>`, `<footer>`, `<section>`)

**Tasks**:
1. Run Lighthouse audit on all 5 pages
2. Fix any image optimization issues (missing width/height, lazy load)
3. Fix any font loading issues (preload Geist)
4. Ensure GSAP animations don't block main thread
5. Check all interactive elements for keyboard focus states
6. Verify screen reader reads page correctly (use VoiceOver or NVDA)
7. Check color contrast for all text/background combinations
8. Add `skip to main content` link
9. Ensure all form fields have labels
10. Test with 3G throttling in DevTools

**Deliverables**:
- Lighthouse report for each page
- All critical accessibility issues resolved
- Performance baseline documented

**Acceptance criteria**:
- All Core Web Vitals in green
- No critical accessibility errors in axe DevTools
- Site loads in < 3s on slow 3G

---

## Phase 10 — Launch Checklist

**Goal**: Final verification before going live.

**Technical checklist**:
- [ ] Custom domain configured in Vercel
- [ ] SSL certificate active (automatic with Vercel)
- [ ] All environment variables set (WhatsApp number, form endpoints)
- [ ] Sitemap generated (`@astrojs/sitemap` adapter)
- [ ] `robots.txt` configured
- [ ] Meta tags complete on all pages (title, description, og:image, og:url)
- [ ] Canonical URLs set
- [ ] 404 page exists
- [ ] Google Analytics or Plausible connected
- [ ] Google Search Console verified
- [ ] Form submissions tested end-to-end (form → notification)
- [ ] WhatsApp links verified with correct phone number
- [ ] All external links open in new tab with `rel="noopener noreferrer"`
- [ ] Image alt texts reviewed
- [ ] Logo files correctly served from `/public/images/`

**Content checklist**:
- [ ] All copy proofread (Spanish)
- [ ] Contact information correct
- [ ] Location information correct (León, Gto., México)
- [ ] Legal/copyright line updated to current year
- [ ] Social media links point to correct profiles
- [ ] Project descriptions reviewed for correct framing (no fake client claims)

**Browser testing checklist**:
- [ ] Chrome (latest)
- [ ] Safari (latest — ViewTransitions)
- [ ] Firefox (latest — ViewTransitions may degrade gracefully)
- [ ] Chrome Android
- [ ] Safari iOS

**Launch**:
- [ ] Final Vercel deployment to production domain
- [ ] Smoke test all 5 pages on production URL
- [ ] Verify Lenis scroll on production (not just localhost)
- [ ] Verify form submission on production
- [ ] Verify WhatsApp links on production mobile

---

## Phase Timeline (Estimated)

| Phase | Effort | Notes |
|---|---|---|
| Phase 0 | ✓ Done | Strategy documents complete |
| Phase 1 | 1–2 sessions | Pure setup and tokens |
| Phase 2 | 2–3 sessions | Nav, footer shell, routing |
| Phase 3 | 2–3 sessions | Hero is the most creative phase |
| Phase 4 | 2–3 sessions | Motion system requires careful testing |
| Phase 5 | 3–4 sessions | Most content-heavy phase |
| Phase 6 | 1–2 sessions | Content + grid, relatively fast |
| Phase 7 | 1–2 sessions | Footer build + form |
| Phase 8 | 1 session | Mobile cleanup pass |
| Phase 9 | 1 session | Audit tools do most of the work |
| Phase 10 | 1 session | Checklist execution |

**Total**: ~15–25 sessions of focused work. Timeline depends on decision velocity and content readiness (images, final copy).

---

## Key Decisions That Must Be Made Before Phase 1

1. **Domain**: Is `verk.mx` or similar registered? If not, secure it now.
2. **Phone number**: What WhatsApp number will be used? Must be set before Phase 5.
3. **Form backend**: Netlify Forms (simplest) or Make webhook (more powerful)?
4. **Hero visual**: Video or static (isotipo shapes)? If video, who creates it?
5. **Project visuals**: Are screenshots available for Waterlu, Prisma, Sonoro? If not, define placeholder strategy.
6. **Content approval**: Is the Spanish copy in doc 06 approved for production, or does it need review?
