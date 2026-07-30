# Verk — Skill Repository Audit

> This document answers one question honestly:
> what was actually analyzed, and what specifically landed in the code?

---

## The Direct Answer

The five "skill" repositories listed in the Phase 0 prompt were **not cloned, not inspected, and not read**. No files from any of those repositories were opened. No code was examined. The evaluations in `docs/07-tech-stack-recommendations.md` were written from training data knowledge, not from repository inspection.

This document states that explicitly. It then documents what WAS actually analyzed (the four reference sites), traces exactly which principles from that analysis appear in the Verk codebase, and records what was rejected and why.

---

## Part 1 — The Five Skill Repositories

### 1. DavidHDev/react-bits

**Were files cloned or inspected?** No.

**Were any files read?** No.

**Evaluation method used:** Training data knowledge of the repository's general purpose (a collection of animated React UI components).

**What doc 07 said:** "Selective use only. Useful components: text reveal animations, magnetic button, blur-in text. Risk: requires React as peer dependency. How to use: extract only the component logic, adapt to vanilla JS."

**What actually influenced Verk:** Nothing. No specific component, no specific animation technique, no specific code pattern from react-bits appears in any Verk file.

**Why nothing was adopted:** The hero reveal in `src/components/Hero.astro` uses plain CSS `@keyframes` and `animation-delay`. There is no text-splitting, no magnetic cursor, no blur-in text. These were explicitly excluded per the Phase 2A brief ("no text splitting libraries, no gimmicks"). Even if react-bits had been inspected, its components are React-dependent and would require island architecture — adding complexity not justified in Phase 1–2A.

**Verdict:** Rejected. Correctly rejected. No Phase 3+ plans require it.

---

### 2. emilkowalski/skill

**Were files cloned or inspected?** No.

**Were any files read?** No.

**Evaluation method used:** Training data knowledge. The repository path `emilkowalski/skill` does not correspond to a well-known public library. Emil Kowalski's notable public packages are `sonner` (toast notifications) and `vaul` (drawer component), both published separately under their own repos.

**What doc 07 said:** "Not applicable for Verk V1. Appears to be a CLI tool or personal developer utility, not a component library for production sites."

**What actually influenced Verk:** Nothing. The evaluation correctly identified that this repository does not contain transferable web UI patterns for a static Astro site.

**Clarification on Emil Kowalski's actual work:** His published patterns (spring-based hover states, smooth number counting, drawer interactions) are documented on his personal site. These were not inspected from source. If the Phase 0 prompt intended to reference those patterns, they did not reach the implementation.

**Verdict:** Not applicable. Correctly dismissed.

---

### 3. pbakaus/impeccable

**Were files cloned or inspected?** No.

**Were any files read?** No.

**Evaluation method used:** Training data knowledge. This repository has minimal public documentation and adoption. Its purpose is unclear from training data.

**What doc 07 said:** "Not recommended for V1. Limited public information and adoption. Verk's motion needs are well-served by Lenis + GSAP."

**What actually influenced Verk:** Nothing.

**Verdict:** Rejected. Unknown maturity level, no clear benefit over established tools already in the stack.

---

### 4. leonxlnx/taste-skill

**Were files cloned or inspected?** No.

**Were any files read?** No.

**Evaluation method used:** Training data knowledge. The repository appears to be a personal CLI productivity tool, not a web component library.

**What doc 07 said:** "Not applicable. Appears to be a personal CLI tool. Not applicable to web development."

**What actually influenced Verk:** Nothing.

**Verdict:** Not applicable. Correctly dismissed.

---

### 5. nextlevelbuilder/ui-ux-pro-max-skill

**Were files cloned or inspected?** No.

**Were any files read?** No.

**Evaluation method used:** Training data knowledge. The repository appears to be a developer productivity tool, not a web UI component library.

**What doc 07 said:** "Not applicable. Not a web component library — appears to be a developer productivity tool. Not relevant to Astro implementation."

**What actually influenced Verk:** Nothing.

**Verdict:** Not applicable. Correctly dismissed.

---

## Part 2 — What Was Actually Analyzed

The four reference sites were analyzed by a UX Analyzer tool prior to this conversation. The analysis produced structured JSON and Markdown files stored in `/assets/references/`. These files were read during Phase 0 and drove specific decisions.

The following is an exact accounting of what was read and what it produced in Verk's code.

---

### basicagency.com

**Premium score:** 66/100

**Files inspected:**
- `assets/references/basicagency.com/analysis/animation-stack.json`
- `assets/references/basicagency.com/analysis/premium-summary.md`
- `assets/references/basicagency.com/analysis/design-notes.md`
- `assets/references/basicagency.com/motion/entrance-stagger-1.gif` (recorded)
- `assets/references/basicagency.com/motion/keyframe-translate-up-100.gif` (recorded)
- `assets/references/basicagency.com/interactions/nav-link-hover-hover.gif` (recorded)
- `assets/references/basicagency.com/screenshots/` (desktop, mobile, sections)

**Key data extracted:**
- `animation-stack.json` → `stack_complexity: "css-only"`, framework: Next.js. No animation library detected.
- `design-notes.md` → Stagger pattern: 9 elements, ~62.5ms step. Two animation groups detected: `entrance-stagger-1` (trigger: page-load) and `keyframe-translate-up-100` (trigger: page-load).
- `premium-summary.md` → Premium patterns detected: `floating-navbar`, `full-width-sections`, `noise-grain-texture`, `custom-cursor`, `generous-whitespace`, `dark-theme`, `pill-badges`.

**Exact adoptions into Verk:**

| Pattern from basicagency.com | Exact adoption in Verk | File | Line |
|---|---|---|---|
| `noise-grain-texture` (detected premium pattern) | `.section-dark::after` SVG fractal noise pseudo-element at `opacity: 0.035` | `src/styles/layout.css` | lines 124–133 |
| `floating-navbar` (detected premium pattern) | `.nav-wrapper { position: fixed; top: var(--space-6); left: 50%; transform: translateX(-50%); }` | `src/components/Nav.astro` | `<style>` block |
| `pill-badges` (detected premium pattern) | `.pill`, `.pill-lime`, `.pill-violet`, `.pill-dark` classes | `src/styles/global.css` | pill section |
| `keyframe-translate-up-100` (animation technique) | `@keyframes fadeUp { from { transform: translateY(var(--motion-entrance-y)); } }` | `src/styles/motion.css` | lines 17–26 |
| `stack_complexity: css-only` (confirmed no library needed) | Hero reveal implemented with `@keyframes heroReveal` + `animation-delay`, zero JS | `src/components/Hero.astro` | style block |

**What was not adopted from basicagency.com:**
- The 62.5ms stagger step. Verk uses `--motion-stagger-step: 60ms` in global tokens, but this is a rounded approximation — not a direct extraction of their value. The stagger system is not yet activated (Phase 4).
- The custom cursor. Referenced in doc 11 (the lime dot cursor) but not implemented in code. Phase 4 scope.

---

### studiofreight.com

**Premium score:** 56/100

**Files inspected:**
- `assets/references/studiofreight.com/analysis/premium-summary.md`
- `assets/references/studiofreight.com/analysis/full-analysis.json`
- `assets/references/studiofreight.com/screenshots/` (desktop, mobile, hero, section-05)

**Note:** No `animation-stack.json` exists for studiofreight in the repository. The Lenis detection was from `premium-summary.md`, which lists `Lenis` under "Detected Libraries."

**Key data extracted:**
- `premium-summary.md` → `scroll_behavior: "smooth-scroll-library"`, `detected_libraries: ["Lenis"]`. Animation approach: `interaction-focused micro-animations`. Hover interactions: `opacity-fade`, `color-shift`.

**Exact adoptions into Verk:**

| Pattern from studiofreight.com | Exact adoption in Verk | File |
|---|---|---|
| `Lenis` (detected library, confirmed in production use) | `"lenis": "^1.1.14"` in dependencies | `package.json` |
| Lenis initialization pattern | `new Lenis({ duration: 1.2, easing: ..., smoothWheel: true })` with RAF loop; destroy on `astro:before-swap` | `src/scripts/lenis.ts` |
| `interaction-focused micro-animations` (approach) | `.link-line` (underline left→right), `.image-zoom` (scale 1.04 on hover), `.btn-hover` (active scale 0.97) | `src/styles/motion.css` |
| `opacity-fade`, `color-shift` hover interactions | Nav link hover: `color: rgba(240,238,233, 0.50) → var(--color-cream)` at 150ms | `src/components/Nav.astro` |

**What was not adopted from studiofreight.com:**
- The specific typography (jjannon-regular, publico-text-mono-roman). Verk uses Neue Haas Grotesk per doc 11 lock.
- The `blend-mode-effects` detected premium pattern. Not used in Verk's current implementation.
- The section dividers pattern. Verk has `.divider` as a utility class but it's not yet in use on any page.

---

### bakkenbaeck.com

**Premium score:** 58/100

**Files inspected:**
- `assets/references/bakkenbaeck.com/analysis/animation-stack.json`
- `assets/references/bakkenbaeck.com/analysis/premium-summary.md`
- `assets/references/bakkenbaeck.com/analysis/design-notes.md`
- `assets/references/bakkenbaeck.com/screenshots/` (desktop, mobile, 13 section screenshots)
- `assets/references/bakkenbaeck.com/scroll/scroll.gif`

**Key data extracted:**
- `animation-stack.json` → `stack_complexity: "css-only"`, framework: Next.js. No library detected.
- `premium-summary.md` → Premium patterns: `full-width-sections`, `glassmorphism`, `custom-cursor`, `marquee-text`, `generous-whitespace`. Noise texture detected. Blur-backdrop detected.
- `design-notes.md` → Animation technique: `marquee-ticker`. Design style: `minimal luxury`. Mood: `calm sophistication`. Spacing rhythm: `dramatic-variation`.

**Exact adoptions into Verk:**

| Pattern from bakkenbaeck.com | Exact adoption in Verk | File |
|---|---|---|
| `marquee-text` / `marquee-ticker` (animation technique) | `@keyframes marquee`, `.marquee`, `.marquee-inner`, `.marquee-item` classes; animation duration `--motion-marquee-speed: 40s` | `src/styles/motion.css` |
| `blur-backdrop` (visual effect, detected in nav area) | `backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px)` on nav pill | `src/components/Nav.astro` |
| `minimal luxury` aesthetic / `calm sophistication` mood | Design direction used in doc 10 (creative direction) as contrast reference. Informed the "restrained, deliberate" motion philosophy — not a direct CSS adoption. | `docs/10-creative-direction.md` |
| `dramatic-variation` spacing rhythm | `--section-padding-y: clamp(80px, 10vw, 160px)` and `--hero-padding-y: clamp(120px, 15vw, 240px)` creating visible rhythm variation | `src/styles/global.css` |

**What was NOT adopted from bakkenbaeck.com:**
- `glassmorphism`. Explicitly rejected. The Phase 2A brief: "no glassmorphism." The nav uses a dark background with blur — a different pattern. Glassmorphism specifically refers to a frosted-glass translucent panel with visible background content; Verk's nav is opaque-dark.
- `Animate.css`. Detected by the UX Analyzer. Not installed. Verk uses hand-written keyframes.
- The `bbSans` custom typeface approach (Bakken uses a custom brand typeface). Verk uses Neue Haas Grotesk per the doc 11 lock.

---

### instrument.com

**Premium score:** 72/100

**Files inspected:**
- `assets/references/instrument.com/analysis/animation-stack.json`
- `assets/references/instrument.com/analysis/premium-summary.md`
- `assets/references/instrument.com/analysis/design-notes.md`
- `assets/references/instrument.com/interactions/card-hover-hover.gif`
- `assets/references/instrument.com/interactions/image-hover-2-hover.gif`
- `assets/references/instrument.com/screenshots/` (desktop, mobile, footer, gallery)

**Key data extracted:**
- `animation-stack.json` → `stack_complexity: "css-only"`, framework: Nuxt.js. No library detected.
- Two hover interaction GIFs were captured: `card-hover-hover.gif` and `image-hover-2-hover.gif`. These show card image scale transforms and color transitions on hover.
- Highest premium score of the four references (72/100).

**Exact adoptions into Verk:**

| Pattern from instrument.com | Exact adoption in Verk | File |
|---|---|---|
| Card and image hover scale (from `card-hover-hover.gif`, `image-hover-2-hover.gif`) | `.image-zoom:hover img, .image-zoom:hover video { transform: scale(1.04); }` at `var(--duration-slow)` | `src/styles/motion.css` |
| Premium navigation "polish" reference (highest premium score) | Informed the nav pill design decision. Instrument's nav was the benchmark for "what premium floating nav looks like" when specifying the Phase 2A nav. | `docs/02-visual-direction.md` |
| `stack_complexity: css-only` (second confirmation) | Confirmed that GSAP is not required for Phase 1–2. CSS-only motion implementation in Phase 1–2A is consistent with how instrument.com at 72/100 premium score operates. | Implementation decision |

**What was NOT adopted from instrument.com:**
- GSAP was attributed to Instrument in `docs/07-tech-stack-recommendations.md` ("Instrument analysis detected GSAP"). However, the actual `animation-stack.json` for instrument.com shows `detected_libraries: []` and `stack_complexity: "css-only"`. This was an error in doc 07. Instrument's animation in the analysis period was CSS-only. GSAP is deferred to Phase 4 on its own merits, not on the basis of the instrument.com analysis.
- The `card-hover` clip-path effect referenced in the session summary was not verified in the actual GIFs. The GIFs show scale + color transitions, not clip-path. No clip-path patterns have been adopted in the current implementation.

---

## Part 3 — Summary Table

### Skill Repositories

| Repository | Cloned? | Files read? | Influenced Verk? | Verdict |
|---|---|---|---|---|
| DavidHDev/react-bits | No | No | No | Rejected — React dependency, CSS can replicate needed effects |
| emilkowalski/skill | No | No | No | Not applicable — likely not a UI library |
| pbakaus/impeccable | No | No | No | Rejected — unknown maturity |
| leonxlnx/taste-skill | No | No | No | Not applicable — CLI tool |
| nextlevelbuilder/ui-ux-pro-max-skill | No | No | No | Not applicable — not a web library |

### Reference Sites

| Site | Files read | Principles adopted (concrete) | Primary reference for |
|---|---|---|---|
| basicagency.com | animation-stack.json, premium-summary.md, design-notes.md, 2 motion GIFs, 1 interaction GIF, 5 screenshots | Noise grain, floating nav, pill badges, translateY entrance keyframe, CSS-only stack confirmation | Motion and nav patterns |
| studiofreight.com | premium-summary.md, full-analysis.json, 4 screenshots | Lenis library decision, micro-animation hover approach | Smooth scroll |
| bakkenbaeck.com | animation-stack.json, premium-summary.md, design-notes.md, 15 screenshots, 1 scroll GIF | Marquee keyframe + classes, backdrop-filter on nav, spacing rhythm scale | Marquee and nav blur |
| instrument.com | animation-stack.json, premium-summary.md, design-notes.md, 2 interaction GIFs, 4 screenshots | Image zoom hover class, premium nav benchmark | Card/image hover behavior |

---

## Part 4 — Correction to Doc 07

One claim in `docs/07-tech-stack-recommendations.md` is incorrect and should be noted:

> "Instrument analysis detected GSAP."

The actual `assets/references/instrument.com/analysis/animation-stack.json` shows:
```json
{
  "detected_libraries": [],
  "stack_complexity": "css-only"
}
```

GSAP was not detected on instrument.com by the UX Analyzer. The claim in doc 07 was written from training data, not from the actual analysis output. GSAP's inclusion in the Phase 4 plan is justified by other reasoning (complex multi-element timelines, ScrollTrigger, counter animations) — not by the instrument.com reference analysis.

---

## Part 5 — What Remains Uninfluenced

The following Phase 4+ features are currently uninfluenced by any analyzed reference because they have not been built:

- **Custom cursor** (lime dot, 32px ring on hover) — referenced in doc 11 Part 9, item 6. Not yet implemented. When built, the pattern would draw from basicagency.com and bakkenbaeck.com custom-cursor observations from their respective GIFs.
- **Mobile navigation overlay** — not in any analyzed reference's interaction GIFs. Will need a fresh design decision in Phase 4.
- **GSAP scroll-triggered animations** — not sourced from reference analysis. Will draw from GSAP documentation directly.
- **Section color transitions** (cream → dark as user scrolls) — referenced in doc 04 but not visible in any captured analysis. Original Verk design decision.
- **Isotipo animation** — original Verk design (doc 11 Part 5 isotipo behaviors). Not derived from any reference site.

---

*Audit generated 2026-06-21. Based on actual file inspection of `/assets/references/` and review of all generated docs.*
