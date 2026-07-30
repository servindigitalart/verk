# Verk — Skill Adoption Plan
> Phase 2.75 — Companion document to `docs/14-skill-repository-analysis.md`.
> Goal: extract concrete, actionable improvements from the five skill repositories without adding dependencies or compromising the design language established in doc 11.

---

## Classification System

| Label | Meaning |
|---|---|
| **Adopt Now** | Fix or implement before Phase 3 begins. Non-negotiable quality issues. |
| **Adopt in Phase 3** | Required during the Phase 3 services build. |
| **Adopt in Phase 4** | Implement when Phase 4 (interactions, IntersectionObserver, GSAP) begins. |
| **Reference Only** | Keep as a thinking framework or vocabulary reference. Do not implement directly. |
| **Reject** | Explicitly excluded. Reason given. |

All adopted items are CSS/JS/Astro-native. No new npm dependencies unless explicitly noted.

---

## ADOPT NOW — Fix before Phase 3

### AN-01: Fix the em-dash in Hero subheadline

**Source:** taste-skill Section 9.G (non-negotiable ban), impeccable SKILL.src.md (pro­se denylist)

**Current code:** `Hero.astro` line 86
```html
De la primera visita al cliente que paga&thinsp;&mdash;&thinsp;sin
seguimiento manual, sin leads perdidos, sin plantillas.
```

**Problem:** Both taste-skill and impeccable independently identify the em-dash as the single most common AI tell in generated copy. The impeccable build system enforces a denylist that blocks `—` from appearing in any page copy.

**Fix:** Replace with a colon. The list structure after the dash ("sin X, sin Y, sin Z") works equally well after a colon:
```html
De la primera visita al cliente que paga: sin seguimiento
manual, sin leads perdidos, sin plantillas.
```

**Doc 12 authority:** Doc 12 locked the copy with the em-dash. This is a copy-level correction within the locked concept — the sentence meaning is identical. The em-dash was a punctuation choice, not a brand decision. Doc 11 does not specify punctuation.

**File:** `src/components/Hero.astro`

---

### AN-02: Add hover-state media query gate to all hover animations

**Source:** emilkowalski/skills SKILL.md lines 550–558, STANDARDS.md lines 163–170

**Problem:** Touch devices fire `:hover` on tap, then immediately go to `:focus` or back to nothing. Ungated hover animations on tap devices produce false visual feedback — elements flash into their hover state on tap and then snap back. This is a mobile UX failure.

**Current ungated hover states:**
- `.nav-link:hover` in `Nav.astro`
- `.nav-wordmark:hover` in `Nav.astro`
- `.hero-btn-secondary:hover` in `Hero.astro`
- `.hero-btn-secondary:hover .hero-arrow` in `Hero.astro`

**What to add:**

For any hover that involves transform, opacity-shifting, or color change on non-primary interactions, wrap in:
```css
@media (hover: hover) and (pointer: fine) {
  .nav-link:hover { ... }
  .hero-btn-secondary:hover { ... }
}
```

**Exception:** The nav-cta `:hover` (lime color shift) and hero-btn-primary `:hover` are acceptable ungated because they are the primary actions — their tap feedback is provided by `:active` scale(0.97) which IS correct for touch.

**Files:** `src/components/Nav.astro`, `src/components/Hero.astro`

---

### AN-03: Add `:active` press feedback to global `.btn` classes

**Source:** emilkowalski/skills SKILL.md lines 199–213, STANDARDS.md lines 57–61

**Problem:** The global `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost-dark` classes in `global.css` do not have `:active` feedback. Only the local `hero-btn-primary` and `nav-cta` (Phase 2A components) have `transform: scale(0.97)` on `:active`. Phase 3+ components using the global `.btn` classes will feel unresponsive on press.

**Fix:** Add to `global.css` button section:
```css
.btn:active,
.btn-primary:active,
.btn-secondary:active,
.btn-ghost-dark:active {
  transform: scale(0.97);
  transition: transform 100ms ease;
}
```

**Duration:** 100ms (emilkowalski/skills specifies 100–160ms for button press feedback).

**File:** `src/styles/global.css`

---

### AN-04: Add `text-wrap: balance` to headings in typography.css

**Source:** impeccable SKILL.src.md general typography rules

**Problem:** Display headings on narrow viewports can break awkwardly — "Construimos" on one line, "sistemas." on the next, with a very short last line. `text-wrap: balance` distributes characters more evenly across lines.

**Fix:** Add to `typography.css`:
```css
h1, h2, h3 {
  text-wrap: balance;
}
```

Browser support: Chrome 114+, Firefox 121+, Safari 17.5+. Falls back to default wrapping in unsupported browsers — safe to add today.

**File:** `src/styles/typography.css`

---

### AN-05: Verify `font-display: swap` on self-hosted Neue Haas Grotesk

**Source:** ui-ux-pro-max Priority 3 (font loading), general web performance

**Problem:** Self-hosted `@font-face` declarations without `font-display: swap` cause FOIT (Flash of Invisible Text) on slow connections — the page renders with invisible text until the font loads. Geist Mono via `@fontsource` includes `font-display: swap` by default, but the Neue Haas Grotesk self-hosted `@font-face` declarations need verification.

**Action:** Open `src/styles/typography.css` (or wherever the `@font-face` rules are defined for Neue Haas Grotesk) and confirm each variant has `font-display: swap;`. If not, add it.

**File:** `src/styles/typography.css`

---

## ADOPT IN PHASE 3 — Required during the services section build

### A3-01: Asymmetric services layout — no four-equal cards

**Source:** taste-skill Section 9.C (three-equal-cards ban), impeccable `skill-ban-identical-card-grids`, emilkowalski/skills (component building principles)

**Rule:** "Three equal feature cards" is listed as an AI tell across all three design skills. For Verk, the services section has four categories: Sitios Web, Automatizaciones, Integraciones CRM, Herramientas con IA. These cannot be four identical cards with icon + title + description.

**Approaches that comply:**

Option A — Asymmetric bento grid: one large featured card (2 col wide) + three smaller, or 2+2 with different cell heights.

Option B — Stacked list with varying content density: each service row is full-width, with different layouts per service (image on left for some, text-only for others).

Option C — A single "horizontal scroll" or accordion approach where services expand.

**Do NOT:** Four equal `border: 1px solid` cards with the same internal layout, same padding, same font hierarchy. This is the exact pattern all three skills call "the laziest design choice."

**Minimum requirement:** At least two different layout configurations among the four services.

---

### A3-02: Eyebrow restraint — reduce to ≤2 eyebrows for the full page

**Source:** taste-skill Section 4.7 (mandatory), impeccable `skill-ban-eyebrow-on-every-section`

**Rule:** Maximum 1 eyebrow label per 3 sections. For a 5-section page (Hero, Servicios, Método, Proyectos, Contacto), the maximum is 2 eyebrow labels total. Hero counts as 1.

**Current state:** Hero has "Infraestructura Digital" (the label above H1 — this is the eyebrow). Servicios placeholder has "Servicios." Método has "Método." Proyectos has "Proyectos." Contacto has "Diagnóstico." That is 5 eyebrows on a 5-section page.

**Decision required:** Which sections keep their eyebrow and which sections lead directly with the headline?

**Recommendation based on doc 11 rule (every section begins with a label):**

Doc 11 Part 9 item 6 states: "every section begins with a label above the headline." This appears to conflict with the eyebrow restraint rule from taste-skill. The resolution is that doc 11 is highest authority, and its "label above the headline" rule applies to Verk's design language. However, what constitutes a "label" in Verk's system can be implemented with less visual weight than a classic uppercase eyebrow — smaller, less tracked, more integrated into the typography.

**Alternative approach:** Keep the doc 11 label convention but do not style them as wide-tracked uppercase eyebrows (which is the AI tell). Instead, use them as small italic section denominators, or as part of the grid structure rather than as standalone typographic elements. This satisfies both constraints.

---

### A3-03: Stagger timing for service cards reveal

**Source:** emilkowalski/skills SKILL.md lines 611–641, STANDARDS.md lines 154–159

**Rule:** 30–80ms between items in a staggered reveal. Longer delays feel slow. Stagger is decorative — never block interaction.

**Implementation plan for Phase 3 services cards:**

```css
/* Each card delays by 60ms more than the previous */
.service-card:nth-child(1) { animation-delay: 0ms; }
.service-card:nth-child(2) { animation-delay: 60ms; }
.service-card:nth-child(3) { animation-delay: 120ms; }
.service-card:nth-child(4) { animation-delay: 180ms; }
```

Or use the CSS variable approach:
```css
.service-card {
  animation-delay: calc(var(--card-index, 0) * var(--motion-stagger-step, 60ms));
}
```

The `--motion-stagger-step: 60ms` token already exists in `global.css`. This is Phase 4 activation work (IntersectionObserver) but the delay values should be set in the Phase 3 build so they're ready.

---

### A3-04: CTA intent audit — no duplicate intent

**Source:** taste-skill Section 4.5 (mandatory Pre-Flight check)

**Rule:** No two CTAs with the same intent on one page. "Solicitar auditoría" (contacto section) and "Auditoría" (nav CTA) both route to the same conversion action.

**Current state:** The nav CTA is `href="#contacto"`. The contacto section has `<a href="https://wa.me/52XXXXXXXXXX">Solicitar auditoría</a>`. These are different destinations (anchor scroll vs. WhatsApp link) so they are technically not duplicate CTAs — they are two steps in a conversion funnel: nav scrolls to the section, section links to WhatsApp.

**Resolution:** This is compliant as long as the nav CTA's role is navigation (to the section) and the section's CTA is the action (WhatsApp). The visual distinction must be clear — the nav CTA should not feel like it IS the conversion action.

**No change required.** Mark as reviewed.

---

### A3-05: Touch target size audit for service cards

**Source:** ui-ux-pro-max Priority 2 (Touch & Interaction, CRITICAL)

**Rule:** Minimum 44×44px touch targets. 8px gap between adjacent touch targets.

**Apply to Phase 3:** All interactive elements in the services section (card links, CTAs, accordion triggers if used) must have a minimum 44px hit area. If a visual element is smaller, extend the hit area with `::after` pseudo-element or `padding`.

---

## ADOPT IN PHASE 4 — Implement during interactions phase

### A4-01: `[data-reveal]` system must have visible fallback

**Source:** impeccable SKILL.src.md — "Reveal animations must enhance an already-visible default."

**Problem:** The current `[data-reveal]` implementation in `motion.css` likely sets elements to `opacity: 0` and waits for `.is-visible` to be added by IntersectionObserver. If IntersectionObserver doesn't fire (headless renderer, SSR, tab paused in background, JS error), all `[data-reveal]` sections remain invisible. The page ships blank.

**Fix:** `[data-reveal]` elements must be **visible by default**. The reveal animation is progressive enhancement:

```css
/* Default: visible */
[data-reveal] {
  opacity: 1;
  transform: none;
}

/* Enhanced: invisible until IntersectionObserver fires */
.js-ready [data-reveal] {
  opacity: 0;
  transform: translateY(var(--motion-entrance-y));
  transition: opacity var(--duration-slow) var(--ease-out-expo),
              transform var(--duration-slow) var(--ease-out-expo);
}

.js-ready [data-reveal].is-visible {
  opacity: 1;
  transform: none;
}
```

Add `.js-ready` to `<html>` via a script immediately after `<head>`:
```javascript
document.documentElement.classList.add('js-ready');
```

This ensures: elements are visible without JS, elements are invisible only after JS confirms it's running, IntersectionObserver then reveals them.

**Files:** `src/styles/motion.css`, `src/layouts/Layout.astro`

---

### A4-02: Use CSS transitions (not keyframes) for elements that can be interrupted

**Source:** emilkowalski/skills SKILL.md lines 272–293, STANDARDS.md lines 82–98

**Rule:** CSS transitions can be retargeted mid-animation. Keyframes restart from zero. For any UI that can be rapidly triggered — toasts, toggles, accordion triggers — use `transition`, not `@keyframes`.

**Apply to Phase 4:** When implementing the mobile nav overlay, accordion/expand patterns in the method section, or any toggled state, use `transition` on the element's final state rather than `@keyframes`:

```css
/* Use this */
.nav-overlay {
  opacity: 0;
  transform: translateX(-100%);
  transition: opacity 300ms var(--ease-out-expo), transform 300ms var(--ease-out-expo);
}

.nav-overlay.is-open {
  opacity: 1;
  transform: translateX(0);
}

/* Not this */
@keyframes slideIn {
  from { transform: translateX(-100%); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
}
```

---

### A4-03: `@starting-style` for component entry animations

**Source:** emilkowalski/skills SKILL.md lines 325–349

**Rule:** `@starting-style` allows CSS-only entry animations without JavaScript. Elements can animate in on `display: none → display: block` transitions without needing a mounted state flag.

**Browser support:** Chrome 117+, Firefox 129+, Safari 17.5+. Needs `@supports` fallback.

**Apply to Phase 4:** Mobile nav overlay, tooltip/popover implementations, any component that appears from `display: none`.

```css
.nav-overlay {
  opacity: 1;
  transform: translateX(0);
  transition: opacity 300ms, transform 300ms;

  @starting-style {
    opacity: 0;
    transform: translateX(-100%);
  }
}

@supports not (@starting-style { }) {
  .nav-overlay.is-entering {
    opacity: 0;
    transform: translateX(-100%);
  }
}
```

---

### A4-04: Asymmetric enter/exit timing

**Source:** emilkowalski/skills SKILL.md lines 589–607, STANDARDS.md lines 104–109

**Rule:** Deliberate actions (press-to-confirm, hold-to-delete, destructive confirm) animate slow. System responses snap.

**Apply to Phase 4:** Any destructive or deliberate action pattern. If Verk adds a "delete" or "confirm" interaction anywhere (account for CRM integrations context), the press phase should be slow and deliberate, the system response (success/dismissal) should be fast:

```css
.confirm-overlay {
  transition: clip-path 200ms ease-out; /* fast on release */
}

.confirm-btn:active .confirm-overlay {
  clip-path: inset(0 0 0 0);
  transition: clip-path 1.5s linear; /* slow on hold */
}
```

---

### A4-05: GSAP integration discipline (taste-skill canonical patterns)

**Source:** taste-skill Sections 5.A, 5.B

**Rule:** When GSAP ScrollTrigger is implemented in Phase 4, two constraints are non-negotiable:
- `start: "top top"` always. Not `"top center"`, not `"top 80%"`. Any deviation causes the animation to start before the element is pinned, producing a half-slide visible before the effect fires.
- `pin: true` on the wrapper. Always clean up with `ctx.revert()` in the destroy function.

**Apply to Phase 4 isotipo animation or any scroll-driven effect:**

```javascript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ctx = gsap.context(() => {
  // ...
  ScrollTrigger.create({
    trigger: element,
    start: "top top",  // always top top
    pin: true,
    // ...
  });
}, containerRef);

// On cleanup (astro:before-swap equivalent):
ctx.revert();
```

---

### A4-06: `clip-path: inset()` for scroll reveal on featured sections

**Source:** emilkowalski/skills SKILL.md lines 397–438, STANDARDS.md lines 132–136

**Rule:** `clip-path: inset(0 0 100% 0)` → `inset(0 0 0 0)` is a GPU-accelerated reveal that creates a distinct visual quality compared to opacity-fade. The reveal feels like content materializing rather than fading in.

**Apply selectively in Phase 4:** The hero isotipo or a featured project card could use clip-path reveal for differentiation. The `[data-reveal]` system uses opacity + translateY by default; a clip-path variant for key elements adds visual variety.

```css
[data-reveal="clip"] {
  clip-path: inset(0 0 100% 0);
  transition: clip-path 600ms var(--ease-out-expo);
}

[data-reveal="clip"].is-visible {
  clip-path: inset(0 0 0 0);
}
```

---

## REFERENCE ONLY — Vocabulary and framework reference

### R-01: impeccable's register system (Brand vs. Product)

**Source:** impeccable CLAUDE.md, SKILL.src.md

Useful as a thinking framework for future Verk pages. The homepage is Brand register — distinctiveness is the bar. If Verk adds a client portal, admin area, or dashboard in the future, those would be Product register — earned familiarity is the bar. Different design decisions, different aesthetic freedom.

**Not implemented.** Used as vocabulary for internal design decisions.

---

### R-02: taste-skill's Three Dials system

**Source:** taste-skill SKILL.md Section 1

For Verk's current design language:
- `DESIGN_VARIANCE: 7` — offset layouts, asymmetric, but not chaotic
- `MOTION_INTENSITY: 5` — fluent CSS, sequential reveal, no physics
- `VISUAL_DENSITY: 3` — art-gallery spacing, generous whitespace

These are useful self-calibration tools for evaluating Phase 3+ sections: does a proposed layout match Verk's established dials?

**Not implemented.** Used as a self-evaluation framework.

---

### R-03: taste-skill's Reference Vocabulary (Section 10)

Useful pattern names for discussing Phase 4+ features without describing them from scratch:
- **Floating Speed Dial** — if adding a mobile WhatsApp/contact floating button
- **Sticky-Stack Sections** — if implementing scroll-pinned method steps in Phase 5
- **Kinetic Marquee** — Verk already has this (ticker band)
- **Directional Hover-Aware Button** — fill enters from cursor's exact side (relevant for nav CTA hover in Phase 4)

---

### R-04: emilkowalski/skills Animation Decision Framework

The four-question decision tree (should it animate? what purpose? what easing? how fast?) should be applied mentally to every new animation added in Phases 3–6. Not a checklist to run in code, but a discipline to apply in design decisions.

---

### R-05: impeccable detection CLI

**Source:** impeccable CLAUDE.md — `npx impeccable detect [file-or-dir]`

The CLI can scan HTML/CSS output for 44 anti-pattern rules. Useful for Phase 3 post-build audit. Not a development dependency — run once as a one-off quality check:

```bash
npx impeccable detect dist/
```

Would flag: side-stripe borders, over-rounded elements (>32px), ghost-card pattern, flat type hierarchy, identical card grids. Run against `dist/index.html` after each phase.

---

### R-06: ui-ux-pro-max Python search engine

**Source:** ui-ux-pro-max CLAUDE.md, architecture

Useful for design research queries when making decisions about new sections:
```bash
python3 src/ui-ux-pro-max/scripts/search.py "professional services" --domain color
python3 src/ui-ux-pro-max/scripts/search.py "minimalist landing page" --domain style
```

The database has 161 palettes and 67 styles. When Phase 4+ sections require new aesthetic decisions not covered by doc 11, this is a structured reference rather than training-data guessing.

**Not installed in Verk.** Run from the cloned repo at `/tmp/ui-ux-pro-max/` on a case-by-case basis.

---

## REJECT — Explicitly excluded

### REJ-01: react-bits as npm dependency

**Reason:** React dependency. Verk is Astro. Adding React for isolated islands to use react-bits components is unjustified overhead when the same visual effects are achievable in CSS + vanilla JS + Lenis. The Phase 2A brief explicitly ruled out text-splitting libraries and gimmick-level animation. React-bits' most distinctive components (particle explosions, magnetic cursors, scramble text) conflict with Verk's deliberate, unhurried aesthetic.

---

### REJ-02: taste-skill's React/Next.js stack conventions

**Reason:** taste-skill Section 3 describes a React/Next.js/Tailwind stack with Motion (formerly Framer Motion), RSC, `'use client'` directives, and Zustand. These are correct for a React project and wrong for an Astro project. Verk uses Astro + plain CSS + TypeScript. The stack-specific conventions are inapplicable.

**Adopted:** Only the design principles and anti-pattern rules from taste-skill, not the implementation stack.

---

### REJ-03: minimalist-skill's `rounded-full` ban for large containers

**Source:** minimalist-skill Section 2 — "DO NOT use `rounded-full` (pill shapes) for large containers, cards, or primary buttons."

**Reason:** Verk's design language uses pill shapes deliberately for CTAs and nav elements. The pill CTA is a locked design decision from doc 11. This specific rule from minimalist-skill conflicts with the established Verk visual identity and is rejected.

---

### REJ-04: impeccable PRODUCT.md + DESIGN.md setup flow

**Reason:** impeccable's initialization requires creating `PRODUCT.md` and `DESIGN.md` at the project root as context files for the AI skill. Verk has an equivalent — the `docs/` directory with docs 01–15. The impeccable setup flow would duplicate existing documentation in a different format. The value of impeccable for Verk is in its design rules, not its file setup protocol.

---

### REJ-05: ui-ux-pro-max Python CLI as installed tooling

**Reason:** The Python search engine requires `python3` and a specific directory structure. It adds no value over Verk's existing documentation for ongoing development decisions. Useful only as an occasional lookup tool, not as installed development tooling.

---

### REJ-06: Any Tailwind, shadcn/ui, Fluent, Carbon recommendation from taste-skill Section 2

**Reason:** Taste-skill Section 2 maps briefs to official design systems (Tailwind, shadcn, Fluent, Carbon, Polaris). Verk uses hand-written CSS with custom properties by explicit decision — no utility framework, no component library, no design system package. This is a Phase 0 commitment documented in doc 03 and doc 11. All design-system adoption recommendations from taste-skill are inapplicable to Verk's stack.

---

### REJ-07: Fraunces and Instrument_Serif (taste-skill's banned fonts)

**Status:** Already rejected. Verk uses Neue Haas Grotesk Display/Text. These fonts are not in the Verk stack. Listed here for completeness.

---

## Priority Order for Immediate Action

Ranked by impact and urgency:

1. **AN-01** — Fix em-dash in Hero.astro (one-line change, high visibility tell)
2. **AN-02** — Add hover-state media query gate (mobile UX fix)
3. **AN-03** — Add `:active` scale to global `.btn` classes (functional UX fix)
4. **AN-04** — Add `text-wrap: balance` to headings (one-line CSS addition)
5. **AN-05** — Verify `font-display: swap` on self-hosted fonts (performance, one-time audit)
6. **A3-01** — Design asymmetric services layout (required for Phase 3 quality)
7. **A3-02** — Resolve eyebrow restraint (requires architectural decision on doc 11 label rule)

Items AN-01 through AN-04 can be implemented in under 30 minutes total. They address the highest-visibility AI tells in the current Verk code.

---

## Authority Resolution Table

Where skill repository rules conflict with doc 11 (highest authority), doc 11 wins. Where they add to doc 11 without contradicting it, the skill rules apply.

| Conflict | Skill rule | Doc 11 rule | Resolution |
|---|---|---|---|
| Hero display max size | impeccable: ≤6rem | Doc 11: locked hero at clamp max 8rem | Doc 11 wins — keep 8rem |
| Section eyebrow labels | taste-skill: max 1 per 3 sections | Doc 11: "every section begins with a label" | Apply doc 11, but de-emphasize label styling to not read as classic eyebrow |
| Cream background | taste-skill: cream is AI default | Doc 11: cream is "La Obra" brand surface | Doc 11 wins — cream is intentional brand decision |
| Pill shapes for CTAs | minimalist-skill: no rounded-full on buttons | Doc 11: pill CTAs are locked design language | Doc 11 wins — pill CTAs remain |
| Em-dash in hero copy | taste-skill/impeccable: ban em-dash | Doc 12: locked copy with em-dash | Doc 12 is corrected — punctuation is not brand; replace with colon |

---

*Adoption plan generated 2026-06-22. Based on `docs/14-skill-repository-analysis.md`.*
*Next action: implement AN-01 through AN-04, then begin Phase 3.*
