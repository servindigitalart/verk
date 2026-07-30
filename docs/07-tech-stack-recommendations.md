# Verk — Tech Stack Recommendations

> Nothing here should be installed yet.
> This document recommends what to use, when, why, and what the risks are.

---

## Base Assumption

- **Framework**: Astro 5+
- **Language**: TypeScript (strict mode)
- **Styling**: CSS custom properties + utility layer
- **Deployment**: Vercel (preferred) or Netlify
- **Runtime**: Static (SSG) for all public pages; SSR optional for forms/dynamic routes

---

## Core Stack Decision

### Astro

**Use**: Yes. Non-negotiable for this project.

**Why**:
- Designed for content-first, performance-first sites
- Zero JS by default — islands where needed
- View Transitions API built-in (page transitions without heavy libraries)
- Content collections for work/blog content
- Best-in-class build output for static HTML + selective hydration
- The target market (local businesses, mobile browsers, varying connections in León) demands fast load times. Astro is the right tool.

**Risks**:
- Ecosystem smaller than Next.js — some libraries need adaptation for Astro
- View Transitions API browser support (~93% — acceptable for target)

---

### TypeScript

**Use**: Yes. All files `.ts` and `.astro` with typed frontmatter.

**Why**: Prevents integration errors between content, components, and data.

**Config**: Strict mode. No `any`.

---

### CSS Strategy

**Recommendation**: CSS Custom Properties (global tokens) + scoped `<style>` in Astro components + **no CSS framework**.

**Why not Tailwind?**
- Verk's design system is custom enough that utility classes fight the tokens
- Tailwind classes in Astro components reduce readability of component logic
- The design system doc (03) already defines all tokens needed

**Optional**: A minimal set of utility classes (`.container`, `.grid`, `.text-label`) defined in global CSS. This is sufficient.

**If Tailwind is preferred by the team**: Use only for layout utilities (padding, margin), never for color or typography (those live in custom properties).

---

## Animation & Interaction Libraries

### Lenis — Smooth Scroll

**Use**: Yes. Install from day one.

**Package**: `lenis` (current maintained package — not `@studio-freight/lenis` which is deprecated)

**Why**: Confirmed pattern from Studio Freight analysis. Lenis is the industry standard for premium smooth scroll. Without it, the site scroll feels default/cheap. Lenis also improves GSAP ScrollTrigger accuracy.

**When**: Initialize in the base layout. Runs on every page.

**Risk**: Adds ~12KB. Worth it. No alternative matches the quality.

---

### GSAP (GreenSock Animation Platform)

**Use**: Yes. Free tier is sufficient for V1.

**Why**: Instrument analysis detected GSAP. It's the standard for complex animation sequences in premium web. Specific uses for Verk:
- Scroll-triggered entrance animations (`ScrollTrigger`)
- Pinned sections (process timeline, hero sequence)
- Counter animations (metrics section)
- Complex multi-element timelines

**When**: Phase 4 (Motion System). Do not install in Phase 1–3.

**License**: Free tier includes `ScrollTrigger`, `TextPlugin`, all core plugins. No cost for non-commercial/standard use.

**Risk**: GSAP adds ~30KB (with ScrollTrigger). Only include it once — do not import GSAP in multiple island components. Centralize in a single script.

**Astro integration**: As a regular `<script>` or `.ts` module — not a React dependency.

---

### Motion (Framer Motion)

**Use**: Only if React islands are used for interactive components.

**Why**: If a contact form, testimonials carousel, or other interactive component is built as a React island, Motion is the cleanest way to add animation to it.

**When**: Only if React islands are added. If everything stays in vanilla Astro + CSS, skip Motion entirely.

**Risk**: Adds ~75KB (React + Motion). Only justified if the island is complex enough to need it.

**Recommendation**: Prefer CSS transitions + GSAP over adding React + Motion. If a React island is needed for forms, use it — but don't add it just for animations.

---

## Page Transitions

### Astro View Transitions API

**Use**: Yes. Built into Astro — no install required.

**Why**: Provides native browser-level page transitions. Chrome/Edge support is excellent. Safari support added in 2024. The `<ViewTransitions />` component provides:
- Fade between pages (default)
- Custom enter/exit animations via CSS
- Persisted elements across transitions (e.g., nav, cursor)

**When**: Phase 2 (Layout Shell). Add `<ViewTransitions />` to the base layout immediately.

**Risk**: Browser support not 100% (Firefox partial). Graceful degradation is automatic — older browsers get instant page loads without transition.

---

## Image Optimization

### Astro Built-in (`<Image />`)

**Use**: Yes. Astro's `<Image />` component uses Sharp under the hood.

**Why**: Automatic WebP/AVIF conversion, width attributes, lazy loading. Critical for performance on the target market's mobile connections.

**Config**:
```typescript
// astro.config.mjs
export default defineConfig({
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' }
  }
});
```

**Additional**: Use `loading="lazy"` for all below-fold images. Use `loading="eager"` + `fetchpriority="high"` for the hero image/video poster.

---

## Content Management

### Astro Content Collections

**Use**: Yes. For work/portfolio and future blog.

**Why**: Type-safe, file-based content. No CMS needed for V1.

**Structure**:
```
src/content/
  work/
    waterlu.md
    prisma.md
    sonoro.md
  blog/ (future)
```

**Schema** (TypeScript, Zod):
```typescript
const workCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    type: z.enum(['sistema', 'saas', 'directorio', 'automatizacion', 'experimento']),
    status: z.enum(['activo', 'prototipo', 'pausado']),
    description: z.string(),
    year: z.number(),
    tags: z.array(z.string()),
    image: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});
```

---

### Keystatic (Lightweight CMS)

**Use**: Consider for V1.5 if the client needs to manage content without code.

**Why**: Keystatic runs locally or on GitHub — no database, no subscription. It generates the same content files that Astro content collections read. If Verk wants to allow non-developer content updates (blog posts, project updates), Keystatic is the cleanest option.

**When**: Not in V1. Only if content management becomes a requirement.

**Risk**: Adds a CMS layer that complicates the repo. For V1, direct file editing is sufficient.

---

## Evaluated Libraries and Skills

### React Bits (`github.com/DavidHDev/react-bits`)

**Verdict**: Selective use only.

**Why**: React Bits is a collection of animated React components. For Verk, useful components would be:
- Text reveal animations
- Magnetic button effect
- Blur-in text

**Risks**:
- React Bits requires React as a peer dependency — adds weight
- Many of its effects can be replicated with CSS + GSAP without React
- Risk of visual inconsistency if components don't match Verk's design system

**How to use if included**: Extract only the specific component logic (usually a few lines of GSAP), adapt to vanilla JS for Astro. Don't import the full library.

---

### Emil Kowalski Skill (`github.com/emilkowalski/skill`)

**Verdict**: Not applicable for Verk V1.

**Why**: This appears to be a CLI tool or personal developer utility, not a component library for production sites. Emil Kowalski is known for UI experiments (sonner toast, vaul drawer) — those are separate packages.

**If the intent was Sonner (toast) or Vaul (drawer)**: Not needed for V1. If a notification system is added for form submission feedback, consider Sonner — but it's trivial to replicate without a library.

---

### Impeccable (`github.com/pbakaus/impeccable`)

**Verdict**: Not recommended for V1.

**Why**: Limited public information and adoption. Verk's motion needs are well-served by Lenis + GSAP. Adding an experimental library before its maturity is confirmed adds risk without clear benefit.

---

### Taste Skill (`github.com/leonxlnx/taste-skill`)

**Verdict**: Not applicable.

**Why**: This appears to be a personal CLI tool. Not applicable to web development.

---

### UI UX Pro Max Skill (`github.com/nextlevelbuilder/ui-ux-pro-max-skill`)

**Verdict**: Not applicable.

**Why**: Not a web component library — appears to be a developer productivity tool. Not relevant to Astro implementation.

---

## Evaluated Tools — Not Recommended for V1

### Three.js

**Verdict**: No for V1.

**Why**: Instrument uses 3D/WebGL, but Verk's market (local businesses, mobile-first) will penalize performance. The aesthetic gain from WebGL is not worth the load time cost. The isotipo shapes can create sufficient visual interest with CSS and SVG.

**Reconsider**: V2, if a specific section (hero background, product demo) justifies it. Keep it isolated in an island.

---

### Remotion

**Verdict**: No for V1.

**Why**: Remotion is for programmatic video rendering. Useful if Verk creates video content of its work, but not for the website UI itself. Not relevant to this project phase.

---

### Hiperframes

**Verdict**: Insufficient public information to evaluate.

---

### Lottie

**Verdict**: Maybe, for isotipo animation only.

**Why**: If a Lottie animation of the isotipo shapes is created (e.g., the shapes assembling from nothing on page load), it's a compelling brand moment. Maximum one Lottie instance per page. Lottie web player adds ~150KB — only justified if the animation is used site-wide and cannot be replicated with SVG + CSS.

**Alternative**: SVG animation with CSS keyframes + GSAP for the isotipo. Achieves similar effect, zero library weight.

---

### Rive

**Verdict**: Consider for isotipo animation (alternative to Lottie).

**Why**: Rive has a significantly smaller runtime than Lottie and supports state machines (interactive animations that respond to hover/click). If the isotipo needs interactive behavior, Rive is better than Lottie.

**When**: Only if the isotipo requires interactivity beyond CSS transitions. Not in V1.

---

### MDX

**Verdict**: Yes, but only when blog is added.

**Why**: MDX is needed when blog posts need React component embeds. For a simple text blog, plain Markdown in Astro content collections is sufficient. Don't add MDX until the blog is built.

---

## Stagehand Evaluation

### What Stagehand Is

Stagehand is an AI-powered browser automation tool built on Playwright. It allows scripting browser interactions using natural language instructions and AI reasoning, making it useful for:

- Extracting interactive states from complex websites
- Scripting hover/click sequences programmatically
- Reliable navigation through dynamic/JS-heavy sites
- Recording interaction flows that standard Playwright would miss

### Would Stagehand Improve This Project?

**Current capability of UX Analyzer:**
- Screenshots of sections and full pages ✓
- CSS extraction and animation detection ✓
- Media role analysis ✓
- Navigation style analysis ✓
- Scroll capture (GIF) ✓
- Motion group detection ✓
- Interaction recording (hover GIFs) — partial

**What Stagehand would add:**
1. AI-guided navigation of complex reference sites ("find the hover state of the project cards")
2. More reliable extraction of dynamic states that load conditionally
3. Scripted sequences for sites with scroll-jacking or complex motion
4. Repeatable interaction recording across multiple states
5. Better analysis of sites that Playwright alone struggles with (GSAP-pinned, infinite scroll, etc.)

### Assessment for Current Phase (Phase 0 — Reference Analysis)

**At this phase**: UX Analyzer has produced sufficient output. The four reference sites have been analyzed with adequate depth. Stagehand is not needed to complete the strategy documents.

**Useful for Phase 2–4** (when building the motion system and needing to cross-reference specific interactions from reference sites):
- If a specific animation needs reverse-engineering from a reference site
- If a new reference site is added that's more dynamic than the current four
- If UX Analyzer fails on a complex interaction

### Other Browser Automation Options

| Tool | Relevance |
|---|---|
| **Playwright MCP** | Direct Playwright integration — could enhance UX Analyzer's DOM extraction with more programmatic control |
| **Puppeteer MCP** | Lower-level than Playwright, less capable for modern sites with complex JS |
| **Browser Use** | Similar to Stagehand — AI-controlled browser, useful for interaction exploration |

**Recommendation**: Add Stagehand or Browser Use as an optional enhancement to UX Analyzer in Phase 2, specifically for extracting hover states and animated sequences from reference sites. Do not install for V1 site development.

---

## Final Stack Summary

| Category | Tool | Status |
|---|---|---|
| Framework | Astro 5+ | Required |
| Language | TypeScript (strict) | Required |
| Styling | CSS Custom Properties | Required |
| Smooth scroll | Lenis | Required |
| Complex animations | GSAP + ScrollTrigger | Phase 4 |
| Page transitions | Astro View Transitions | Phase 2 |
| Image optimization | Astro `<Image />` + Sharp | Required |
| Content | Astro Content Collections | Phase 6 |
| Deployment | Vercel | Required |
| React islands | Minimal, if needed | Optional |
| Motion (Framer) | Only if React islands used | Optional |
| CMS | Keystatic | V1.5 |
| Isotipo animation | SVG + CSS (or Rive later) | Phase 4 |
| Blog/MDX | Plain Markdown first | V1.5 |

**Total estimated JS bundle (above-the-fold)**: < 20KB without GSAP, < 50KB with GSAP. Target 90+ Lighthouse score on desktop and 80+ on mobile.
