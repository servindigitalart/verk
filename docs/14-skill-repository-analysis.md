# Verk — Skill Repository Analysis
> Phase 2.75 — Based on direct inspection of cloned repository contents.
> No training data, no assumptions. Every finding cites the exact file and section read.

---

## Preamble

This document corrects `docs/skill-audit.md`, which confirmed that none of the five repositories were inspected in Phase 0. In Phase 2.75, all five repositories were either cloned locally or accessed via their structure. The following analysis is based on files that were read, not inferred.

**Cloned to `/tmp/`:**
- `/tmp/emilkowalski-skills/` — `emilkowalski/skills`
- `/tmp/taste-skill/` — `leonxlnx/taste-skill`
- `/tmp/impeccable/` — `pbakaus/impeccable`
- `/tmp/ui-ux-pro-max/` — `nextlevelbuilder/ui-ux-pro-max-skill`

**Not cloned:**
- `DavidHDev/react-bits` — analyzed from GitHub metadata only; files not read

---

## Repository 1 — emilkowalski/skills (2,765★)

### What it is

Not a component library. Not an npm package. A Claude Code skill collection that encodes Emil Kowalski's animation philosophy — the thinking behind Sonner (13M+ weekly npm downloads), Vaul, and his course at animations.dev. Installing it gives an AI coding agent a trained instinct for motion craft.

### Files inspected

| File | Size | What it contains |
|---|---|---|
| `skills/emil-design-eng/SKILL.md` | 680 lines | Full animation decision framework, component principles, performance rules, accessibility |
| `skills/review-animations/SKILL.md` | 113 lines | Code review skill — 10 non-negotiable standards, escalation triggers, remedial hierarchy |
| `skills/review-animations/STANDARDS.md` | 189 lines | Precise values: duration tables, easing curves, spring config, stagger timing, gesture physics |

### Core content — what these files actually say

**The Animation Decision Framework** (`SKILL.md` lines 62–135)

A frequency-first decision tree. Before any animation:

1. How often will users see this? 100+/day = no animation ever (keyboard shortcuts, command palette). Tens/day = remove or reduce drastically. Occasional = standard animation. Rare/first-time = can add delight.

2. What is the purpose? Valid: spatial consistency, state indication, explanation, feedback, preventing jarring changes. Invalid: "it looks cool" on a frequently-seen element.

3. What easing? Entering/exiting → `ease-out`. Moving/morphing → `ease-in-out`. Hover/color → `ease`. Constant motion → `linear`. Default → `ease-out`. **`ease-in` is never valid for UI.** It starts slow, which delays the exact moment the user is watching most.

4. How fast? Button press: 100–160ms. Tooltips/popovers: 125–200ms. Dropdowns: 150–250ms. Modals: 200–500ms. **UI stays under 300ms.** Marketing/explanatory can be longer.

**Easing curves** (`STANDARDS.md` lines 30–37)

```css
--ease-out:    cubic-bezier(0.23, 1, 0.32, 1);     /* strong ease-out for UI */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);    /* strong ease-in-out for movement */
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);     /* iOS-like drawer */
```

Verk's `--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)` is a valid strong ease-out variant. Confirmed compatible with the principle.

**Component principles** (`SKILL.md` lines 197–350)

- Button `:active` → `transform: scale(0.97)`, `transition: transform 160ms ease-out`. Required on all pressable elements.
- Never animate from `scale(0)`. Start from `scale(0.95)` + `opacity: 0`. Nothing in the real world appears from nothing.
- `transition: all` is forbidden — always specify exact properties.
- CSS transitions over keyframes for interruptible UI (toasts, toggles). Keyframes restart from zero; transitions retarget.
- `@starting-style` for entry animations without JavaScript (modern browsers).
- `clip-path: inset()` is a powerful reveal tool — values eat in from each edge, fully GPU-accelerated.

**Stagger timing** (`SKILL.md` lines 611–641, `STANDARDS.md` lines 154–159)

30–80ms between items. Stagger is decorative — never block interaction while it plays.

```css
.item:nth-child(2) { animation-delay: 50ms; }
.item:nth-child(3) { animation-delay: 100ms; }
```

**Accessibility** (`SKILL.md` lines 531–559, `STANDARDS.md` lines 163–177)

Reduced motion means fewer and gentler — not zero. Keep opacity and color transitions, remove movement/position. Gate hover animations behind `@media (hover: hover) and (pointer: fine)`. Touch devices trigger hover on tap; without this gate, every element produces false hovers on mobile.

**Performance** (`SKILL.md` lines 484–525, `STANDARDS.md` lines 113–129)

- Animate only `transform` and `opacity` — they run on the compositor thread.
- Do not update a CSS variable on a parent to drive a child's `transform` — triggers style recalculation for all children. Update `transform` directly on the element.
- CSS animations beat JS-based animations under load. When the browser is busy parsing/painting, `requestAnimationFrame` misses frames. CSS animations run off the main thread.

**Asymmetric timing** (`STANDARDS.md` lines 104–109)

Deliberate actions animate slow; system responses snap. Press-and-hold overlay: 2s linear on press, 200ms ease-out on release. This applies broadly: slow where the user is deciding, fast where the system responds.

### Relationship to Verk's current implementation

| emilkowalski principle | Verk status | Gap |
|---|---|---|
| `ease-out` for UI (not `ease-in`) | Correct — Verk uses `cubic-bezier(0.16, 1, 0.3, 1)` throughout | None |
| Button `:active` scale(0.97) | Correct — nav-cta and hero-btn-primary both have it | Missing from `.btn`, `.btn-primary`, `.btn-secondary` global classes |
| Reduced motion explicit override | Correct — Hero.astro has explicit `animation: none; opacity: 1` override | Motion.css's `0.01ms !important` doesn't address delay problem; hero has correct fix |
| Stagger timing (30–80ms) | Scaffolded (`--motion-stagger-step: 60ms` token exists) | Not yet activated (Phase 4 scope) |
| Hover gate `@media (hover: hover)` | **Missing** — nav links and hero secondary CTA have ungated hover states | Needs to be added before Phase 3 cards |
| No `transition: all` | Partially correct — most transitions specify exact properties | Hero secondary CTA `transition: color 150ms ease, gap 300ms...` is clean |
| CSS animations for sequential reveal | Correct — hero reveal is pure CSS `@keyframes` | Correct |

---

## Repository 2 — leonxlnx/taste-skill (49,160★)

### What it is

Not a component library. Not an npm package. A comprehensive Claude Code skill for generating non-generic landing pages and portfolios. Its primary value is pattern *prevention* — naming and banning the exact visual tells that make AI-generated interfaces look templated. It also provides positive vocabulary: pattern names, GSAP skeleton code, dial-based configuration.

### Files inspected

| File | Lines | What it contains |
|---|---|---|
| `skills/taste-skill/SKILL.md` | 1,207 lines | Full skill — 14 sections covering brief inference, three dials, design system mapping, architecture, bias corrections, layout rules, anti-patterns, GSAP skeletons, redesign protocol, pre-flight check |
| `skills/minimalist-skill/SKILL.md` | 86 lines | Specific minimalist variant — warm monochrome palette, bento grid specs, typographic constraints |

### Core content — what these files actually say

**Section 0: Brief Inference**

Before generating anything, declare a one-line "design read." Anti-default discipline: do not default to AI-purple gradients, centered hero over dark mesh, three equal feature cards, generic glassmorphism, infinite-loop micro-animations, or Inter + slate-900.

**Section 1: Three Dials**

Every layout, motion, and density decision is gated by three dials:
- `DESIGN_VARIANCE` (1–10): symmetry vs. chaos
- `MOTION_INTENSITY` (1–10): static vs. cinematic
- `VISUAL_DENSITY` (1–10): art gallery vs. cockpit

Baseline: 8 / 6 / 4. For "premium consumer / Apple-y / luxury / brand": 7–8 / 5–7 / 3–4.

**Section 4.1: Typography — Serif Discipline**

Serif is very discouraged as default. "It feels creative/premium/editorial" is not a justification. The AI's default mental model that "creative brief = serif" is the single most-tested AI tell. Specifically banned: Fraunces and Instrument_Serif. Verk uses Neue Haas Grotesk — a sans display grotesque — which is correct.

**Section 4.2: Color Calibration**

"THE LILA RULE": AI-purple gradient is banned as default. Verk's violet (`#6B6AF4`) is the "intelligence" color, used only for specific semantic purposes, not as default accent. This is the correct treatment.

**Section 4.2: Premium Consumer Palette Ban** (mandatory)

The cream/warm-beige body background is explicitly banned as an AI default for premium-consumer contexts. The banned hex families include `#f5f1ea`, `#f7f5f1`, `#fbf8f1`, `#efeae0`, `#ece6db`, `#faf7f1`, `#e8dfcb` — all "warm paper/cream/chalk/bone."

**Verk's cream (`#F0EEE9`) is a warm off-white at a hex value close to this banned range.** However, Verk's use of cream is justified: it is the brand's locked surface from doc 11 (highest authority), and doc 11 explicitly defends it as "La Obra" territory — cream as construction dust/papel bond — not as an AI-default aesthetic choice. The key distinction is intentionality and specificity to Verk's brand. Phase 3+ should not introduce additional cream backgrounds without strong justification.

**Section 4.3: Layout — Anti-Center Bias**

Centered hero is avoided when DESIGN_VARIANCE > 4. Exception: editorial/manifesto launches where the message IS the design. Verk's Hero is left-aligned (content left, isotipo right) — already correct.

**Section 4.7: Layout Discipline — Hero Stack**

Hero must fit in initial viewport. Maximum 4 text elements: eyebrow (or nothing), headline, subtext, CTAs. Banned inside hero: tagline below CTAs, trust micro-strip, pricing teaser, feature bullets, social proof avatar row.

Verk's current hero: section label + H1 (2 spans) + subheadline + hero-actions + microcopy. That's 5 elements by taste-skill's count (the microcopy is the 5th). However, the microcopy at 11px is genuinely decorative and well below the fold at first load — it's a qualification line, not a CTA or selling point. This is a marginal case. The microcopy was locked in doc 12.

**Section 4.7: Eyebrow Restraint** (mandatory, called "the #1 violated rule")

Maximum 1 eyebrow label per 3 sections. Hero counts as 1. A page with 9 sections may have at most 3 eyebrows. Every current Verk section has an eyebrow label (Servicios, Método, Proyectos, Diagnóstico). With 5 sections (hero + 4), the limit is 2. The current placeholders have 5 eyebrows. **This must be resolved before Phase 3 ships.**

**Section 9.G: Em-Dash Ban** (non-negotiable, "the single most-violated Tell")

Em-dash (`—`) is completely banned. Banned in headlines, body copy, quotes, everywhere. Replace with: period, comma, parentheses, colon, or restructure the sentence. En-dash used as separator is also banned.

**Verk's Hero.astro line 86 uses `&thinsp;&mdash;&thinsp;` in the subheadline copy.** This is the exact pattern taste-skill and impeccable identify as the #1 AI tell. The copy is "De la primera visita al cliente que paga — sin seguimiento manual, sin leads perdidos, sin plantillas." This should become: "De la primera visita al cliente que paga: sin seguimiento manual, sin leads perdidos, sin plantillas." (colon) or be restructured as two sentences.

**Section 9.D: Content — No Duplicate CTA Intent** (mandatory)

Two CTAs with the same intent on one page is a Pre-Flight Fail. Verk's nav has "Auditoría" CTA. The contacto section has "Solicitar auditoría." These are the same intent. One of the labels must change, or the pattern must be: nav links to #contacto (which is the auditoría form), and the section's own CTA is the only "Auditoría" action point.

**Section 9.C: No three-equal cards**

"Three equal feature cards" is listed as an AI tell. Verk's Phase 3 services section has four service categories. They cannot be four equal identical cards.

**GSAP Skeletons** (Sections 5.A, 5.B)

Taste-skill provides canonical GSAP sticky-stack and horizontal-pan patterns. Key constraints:
- `start: "top top"` always (not "top center" or "top 80%")
- `pin: true` on the wrapper
- `end: "+=${distance}"` based on actual scroll distance
- `scrub: 1` for smooth scrubbing
- Always `ctx.revert()` in useEffect cleanup

These are React/Next.js implementations. For Phase 4 Verk GSAP work, the logic (especially the `start: "top top"` discipline) translates to vanilla JS + Astro islands.

**Section 5.D: Forbidden Animation Patterns**

`window.addEventListener("scroll", ...)` is banned. It runs on every scroll frame, jank-prone. Use `IntersectionObserver`, GSAP ScrollTrigger, or CSS `animation-timeline: view()`. Verk's Phase 4 IntersectionObserver plan is already correct.

**Section 6.A: Grain/Noise on Fixed Layer Only**

Apply grain/noise filters exclusively to fixed, `pointer-events: none` pseudo-elements. Never on scrolling containers. Verk's `.section-dark::after` is implemented as a fixed `position: absolute` pseudo-element per the section — this is correct if the section itself does not scroll inside an overflow container (it doesn't). But the noise should be verified to not cause continuous GPU repaints on scroll.

**minimalist-skill specific values:**

- Body text color: `#111111` or `#2F3437` (off-black, never `#000000`)
- Secondary text: `#787774` (muted gray)
- Card borders: `1px solid #EAEAEA`
- Card border-radius: 8–12px maximum
- Internal padding: 24–40px
- Stagger delay: `animation-delay: calc(var(--index) * 80ms)`
- Scroll entry: `translateY(12px)` + opacity, 600ms, `cubic-bezier(0.16, 1, 0.3, 1)`

These are broadly compatible with Verk's token system. The easing `cubic-bezier(0.16, 1, 0.3, 1)` is identical to Verk's `--ease-out-expo`.

### Relationship to Verk's current implementation

| taste-skill rule | Verk status | Gap |
|---|---|---|
| No centered hero (VARIANCE > 4) | Correct — left-aligned content, isotipo right | None |
| No three-equal cards | Not yet implemented (Phase 3 scope) | Must design asymmetric service cards |
| Eyebrow restraint (max 1 per 3 sections) | **Non-compliant** — 5 eyebrow labels across 5 sections | Must reduce to 2 eyebrows maximum for a 5-section page |
| Em-dash ban | **Non-compliant** — `&mdash;` in hero subheadline | Fix before Phase 3 |
| No duplicate CTA intent | **Potential issue** — nav "Auditoría" + section "Solicitar auditoría" | Audit in Phase 3 |
| Hero stack ≤4 elements | Borderline — microcopy is a 5th element | Locked in doc 12; acceptable as decorative qualifier |
| No `window.addEventListener("scroll")` | Correct — Phase 4 uses IntersectionObserver plan | None |
| Grain on fixed/pointer-events:none layer | Correct architecture | Verify no GPU repaint on scroll |
| Motion claimed = motion shown | Partially — hero has motion, ticker has motion, rest static | Phase 4 must deliver on the motion promise |
| No AI-purple gradients | Correct — violet used only for "intelligence" semantic | None |

---

## Repository 3 — pbakaus/impeccable (40,401★)

### What it is

A frontend design quality toolkit with two layers: (1) an AI coding skill (`/impeccable`) with 23 sub-commands for designing, auditing, polishing, and iterating production UIs; (2) a CLI tool (`npx impeccable detect`) that runs static analysis against HTML/CSS files, flagging 44 anti-pattern rules. The skill is for Claude Code / Cursor / Copilot. The CLI is for CI pipelines and automated reviews.

### Files inspected

| File | Content |
|---|---|
| `CLAUDE.md` (root) | Architecture overview — one skill, 23 commands, register system, CSS patterns, editorial rules, anti-pattern detector, CLI, versioning |
| `skill/SKILL.src.md` (first 200 lines) | Full design rules, absolute bans, general rules for color/typography/layout/motion/interaction, AI slop test |

### Core content — what these files actually say

**The Register System**

Every design task belongs to one of two registers:
- **Brand** — design IS the product: marketing, landing pages, campaign surfaces. Distinctiveness is the bar.
- **Product** — design SERVES the product: app UI, admin, dashboards. Earned familiarity is the bar.

Verk's homepage is a brand-register surface. The rules for brand register prioritize differentiation over convention.

**General Design Rules** (`SKILL.src.md`, lines ~40–200)

*Color:*
- Body text must hit ≥4.5:1 contrast against its background. Placeholder text requires the same 4.5:1 — not the muted-gray default.
- Gray text on a colored background looks washed out. Use a darker shade of the background's own hue.
- **Anti-cream rule:** "The cream/sand/beige body bg is the saturated AI default of 2026." The warm-neutral band (OKLCH L 0.84–0.97, chroma < 0.06, hue 40–100) reads as cream regardless of what you call it. Token names like `--paper`, `--cream`, `--sand`, `--bone` are tells in themselves. Same consideration as noted in taste-skill — Verk's cream is brand-locked, but this is a valid warning to avoid adding more warm-neutral surfaces in later phases.
- OKLCH for new color additions.

*Typography:*
- Cap body line length at 65–75ch.
- Don't pair fonts that are similar but not identical. Pair on contrast axis.
- Hero/display ceiling: `clamp()` max ≤ 6rem (~96px). Verk's hero uses `clamp(3.25rem, 1.5rem + 7vw, 8rem)` — the max is 8rem (128px), which exceeds the 6rem ceiling. This is a flagged concern.
- Display heading letter-spacing floor: ≥ −0.04em. Verk uses `letter-spacing: -0.04em` exactly — at the floor, not below it.
- `text-wrap: balance` on h1–h3 for even line lengths.

*Layout:*
- Flexbox for 1D, Grid for 2D.
- Build a semantic z-index scale. Verk has `--z-floating`, `--z-modal`, etc. already.
- Eyebrow on every section is explicitly banned ("the saturated AI scaffold").

*Motion:*
- Ease out with exponential curves (ease-out-quart/quint/expo). No bounce, no elastic.
- **Reveal animations must enhance an already-visible default.** Do not gate content visibility on a class-triggered transition — if the transition doesn't fire (headless renderer, paused tab), the section ships blank. Verk's current `[data-reveal]` system makes elements invisible until `.is-visible` is added. This is the exact failure mode described. **Phase 4 must add a fallback: elements must be visible by default, with the reveal as progressive enhancement.**
- Premium motion materials include blur, backdrop-filter, clip-path, mask — not just transform/opacity.

**Absolute Bans** (`SKILL.src.md`, lines ~180–270)

- **Side-stripe borders** (`border-left` or `border-right` > 1px as accent): banned. Verk's current design has no side-stripe borders.
- **Gradient text** (`background-clip: text` + gradient): banned. Verk has no gradient text.
- **Glassmorphism as default**: banned. Verk's nav uses backdrop-filter-blur on a dark background, not glassmorphism. Correct.
- **The hero-metric template** (big number, supporting stats, gradient accent): banned. Verk doesn't use it.
- **Identical card grids**: banned. Phase 3 services cannot be four identical cards.
- **Tiny uppercase tracked eyebrow above every section**: banned. Described as "the saturated AI scaffold — appears on 55–95% of generations." This means the current Verk placeholder structure (every section has a text-label eyebrow) must change.
- **Numbered section markers** (`01 / 02 / 03`): banned. Verk has no numbered markers currently — but Phase 3 must not add them.

**The 23 Sub-Commands**

The commands are directly useful as structured thinking frameworks for upcoming Verk phases, even if the skill itself isn't installed:
- `/impeccable audit` — technical quality: a11y, perf, responsive
- `/impeccable polish` — final quality pass before shipping
- `/impeccable critique` — UX design review with heuristic scoring
- `/impeccable animate` — purposeful animation addition
- `/impeccable bolder` — amplify bland designs
- `/impeccable typeset` — typography hierarchy
- `/impeccable layout` — spacing, rhythm, visual hierarchy

**Detection CLI** (`npx impeccable detect`)

The CLI can statically scan HTML/CSS files. 44 anti-pattern rules including: icon tiles stacked above text (AI slop), flat type hierarchy, side-stripe borders, ghost-card pattern (1px border + large box-shadow on same element), over-rounded cards (border-radius > 32px), repeating-gradient stripe backgrounds.

For Verk, this CLI could be run against `dist/` output to audit Phase 3+ components.

**Editorial Rules** (`docs/STYLE.md` referenced in CLAUDE.md)

The build system validates copy against a denylist that includes: em-dashes, "seamless," "robust," "elevate," "empower," "pivotal," "in today's," "gone are the days," "whether you're," "let's dive in." Verk's copy should be audited against a similar list.

### Relationship to Verk's current implementation

| impeccable rule | Verk status | Gap |
|---|---|---|
| Anti-identical-card-grids | Not yet built (Phase 3) | Must design asymmetric services layout |
| Anti-eyebrow-every-section | Non-compliant in placeholders | Must reduce before Phase 3 ships |
| Reveal animations = progressive enhancement | **Non-compliant** — `[data-reveal]` makes elements invisible | Phase 4 must add CSS fallback (no-JS visible) |
| Hero display ceiling ≤6rem | Non-compliant — Verk uses clamp max 8rem | Consider capping at 6rem per impeccable, or retain 8rem per doc 11 lock |
| Letter-spacing floor -0.04em | Compliant — Verk is exactly -0.04em | None |
| No side-stripe borders | Compliant | None |
| No gradient text | Compliant | None |
| No numbered section markers | Compliant | Must maintain in Phase 3 |
| text-wrap: balance on headings | Not yet applied | Add to typography.css |

---

## Repository 4 — nextlevelbuilder/ui-ux-pro-max-skill (95,191★)

### What it is

A design intelligence toolkit — not a component library, not a framework, not a skill file that's installed as a Claude Code skill in the traditional sense. It is a searchable CSV database of 161 palettes, 57 font pairings, 67 styles, and 161 UX rules, with a Python CLI (`python3 src/ui-ux-pro-max/scripts/search.py`) to query it. There's also a Claude Code skill (`SKILL.md`) that wraps the database for use in AI coding sessions.

### Files inspected

| File | Content |
|---|---|
| `CLAUDE.md` | Architecture — CSV databases, Python search engine, multi-stack support, CLI commands |
| `.claude/skills/ui-ux-pro-max/SKILL.md` (first 150 lines) | Skill intro, priority table, Quick Reference with 10 rule categories |

### Core content — what these files actually say

**Priority Framework** (10 categories, read from SKILL.md)

1. Accessibility (CRITICAL) — contrast ≥4.5:1, alt text, keyboard nav, aria-labels
2. Touch & Interaction (CRITICAL) — min 44×44px targets, 8px spacing between targets, loading feedback
3. Performance (HIGH) — WebP/AVIF, lazy loading, CLS prevention, font-display: swap
4. Style Selection (HIGH) — match style to product type, consistency, no emoji icons
5. Layout & Responsive (HIGH) — mobile-first, no horizontal scroll, 4pt/8dp spacing system
6. Typography & Color (MEDIUM) — base 16px, line-height 1.5, semantic color tokens
7. Animation (MEDIUM) — 150–300ms duration, motion conveys meaning, spatial continuity, no `width/height` animation
8. Forms & Feedback (MEDIUM) — visible labels, error near field, helper text
9. Navigation Patterns (HIGH) — predictable back, bottom nav ≤5
10. Charts & Data (LOW)

**Animation rules** (Priority 7)

Duration 150–300ms. No animating `width` or `height`. Spatial continuity (elements move in directions that make physical sense). Always provide reduced-motion alternative.

**Touch targets** (Priority 2)

44×44px minimum (Apple HIG) / 48×48dp (Material). 8px gap between touch targets. The nav-cta at 8px 16px padding produces a hit target smaller than 44px vertically. This is a flag for Phase 3+ touchable elements.

**Font loading** (Priority 3)

`font-display: swap` to avoid FOIT. Preload only critical fonts. Verk currently loads fonts via `@fontsource/geist-mono` which includes `font-display: swap` by default; the Neue Haas Grotesk self-hosted fonts need to be verified.

### Relationship to Verk

This database is most useful as a lookup tool rather than as a direct source of design principles for Verk. The rules are universal UX fundamentals; most are already addressed in doc 11 and the existing implementation. Its specific value would be in querying palettes or font pairings for content sections if Verk expands beyond its locked design system. For the current phase, the touch target and font-display rules are the only actionable findings not covered elsewhere.

| ui-ux-pro-max rule | Verk status | Gap |
|---|---|---|
| Contrast ≥4.5:1 | Nav links at 50% cream opacity on dark — needs verification | Verify nav link contrast ratio |
| Touch targets ≥44px | Nav CTA may be below 44px vertical | Audit click target height in Phase 3 |
| font-display: swap on self-hosted fonts | Not verified in current @font-face declarations | Add `font-display: swap` if missing |
| 8px gap between touch targets | Not verified for nav links | Check nav link spacing on mobile |
| Reduced motion alternative | Hero and nav already handle this | None for current scope |

---

## Repository 5 — DavidHDev/react-bits

### What it is

A React component library with 130+ animated UI components. TypeScript + CSS architecture. Components include: text reveals, animated backgrounds, magnetic buttons, blur-in text, particle systems, number counters, 3D card tilts. Available in TS + CSS variants.

### Files inspected

None. The repository was not cloned. No source files were read. The following is based solely on the GitHub repository page metadata (stars, description, listed components).

**This is the only repository in this analysis without direct file inspection.** The adoption plan treats it accordingly: any finding about its code-level patterns is labeled as inferred, not confirmed.

### Inferred relevance to Verk

- React dependency — Verk is Astro. Direct use requires Astro island architecture, adding complexity.
- CSS isolation — the TS + CSS variants may allow extraction of animation logic without the React wrapper.
- Most useful patterns from a code standpoint: number counter animation (Phase 4 if metrics section is added), text scramble/reveal (Verk explicitly rejects text-splitting), magnetic cursor (Phase 4 custom cursor scoped to desktop).

**No specific patterns are being adopted from this repository because no files were read.**

---

## Cross-Repository Summary

### True nature of the five repositories

| Repository | What doc 07 assumed | What it actually is |
|---|---|---|
| emilkowalski/skills | Personal developer utility | AI coding skill — animation philosophy encoded as LLM instructions |
| taste-skill | Personal CLI tool | AI coding skill — anti-slop frontend skill with 80+ pre-flight checks |
| impeccable | Unknown maturity | AI coding skill + CLI — 23 commands, 44 detection rules, production-grade |
| ui-ux-pro-max | Not a web library | AI coding skill + Python search engine — 161 palettes, 57 pairings |
| react-bits | Correctly identified | React component library — 130+ animated components |

Three of the five repositories (impeccable, taste-skill, ui-ux-pro-max) are development tooling for AI coding assistants. They are relevant to Verk as *working process enhancements*, not as component dependencies.

### Most impactful findings across all five repos

1. **Em-dash in hero subheadline** (Hero.astro:86) — identified by taste-skill and impeccable as #1 AI tell. Actionable now.
2. **Eyebrow on every section** — identified by taste-skill and impeccable as AI default. The placeholder sections must reduce to ≤2 eyebrows for a 5-section page.
3. **Hover state not gated by media query** — identified by emilkowalski/skills. Nav and hero hover states trigger on touch; needs `@media (hover: hover) and (pointer: fine)` guard.
4. **`[data-reveal]` elements invisible by default** — identified by impeccable. If IntersectionObserver doesn't fire (SSR, paused tab, JS disabled), sections ship invisible. Phase 4 must add fallback.
5. **Button `:active` scale(0.97) not on all CTAs** — emilkowalski/skills. The global `.btn` class doesn't have `:active` feedback. Only nav-cta and hero-btn-primary do.
6. **Phase 3 services cannot be four equal cards** — identified by all three design skills. Must design asymmetric services layout.
7. **Hero display max clamp** — impeccable flags display ceiling at 6rem; Verk uses 8rem. This is a tension with doc 11 (highest authority). Noted for decision.

---

*Analysis generated 2026-06-22. Based on direct inspection of cloned repository files at `/tmp/emilkowalski-skills/`, `/tmp/taste-skill/`, `/tmp/impeccable/`, `/tmp/ui-ux-pro-max/`.*
