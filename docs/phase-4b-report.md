# Verk — Phase 4B Report
# Systems Implementation

**Date:** 2026-07-06
**Status:** Complete. Waiting for approval before continuing past the Systems section.

---

## Files Created

| File | Purpose |
|------|---------|
| `src/components/ProjectStatus.astro` | State pill (Operativo / En Evolución / Investigación / Desarrollo Activo) |
| `src/components/CapabilityLabel.astro` | Capability tag pill (one of the six taxonomy capabilities, doc 16 Part 1) |
| `src/components/ProjectPreview.astro` | Logo signature frame, or isotipo fallback when no logo exists |
| `src/components/ArchitectureStrip.astro` | Dynamic per-system layer diagram |
| `src/components/SystemEntry.astro` | One system row — featured / standard / conceptual variants |
| `src/components/Systems.astro` | Section assembly: header, all nine systems, isotipo background mark |
| `docs/phase-4b-report.md` | This report |

## Files Modified

| File | Change |
|------|--------|
| `src/pages/index.astro` | Replaced the `#proyectos` placeholder with `<Systems />` |
| `docs/16-systems-architecture.md` | Applied the six approved Phase 4B refinements (see below) |
| `docs/project-content/ux-analyzer.md`, `cleansolaraus.md` | Renumbered (System 04 / 05 swap) |
| `docs/project-content/bloom-undies.md` | "En Construcción" → "Desarrollo Activo" |

## Build Status

```
astro check  →  0 errors, 0 warnings, 0 hints
astro build  →  Complete. 9 font warnings (pre-existing, unlicensed Neue Haas Grotesk — same as Phase 3)
```

Structural verification against the built `dist/index.html` (no browser automation available this
session, so verified via the rendered HTML rather than a live screenshot):
- 9 `.system-entry` rows render, in the approved order.
- 8 `<details>`/`<summary>` disclosures render (every system except the always-expanded Sonoro).
- 10 capability pills render (Sonoro carries two; the other eight carry one each).
- 9 architecture strips render, one per system.
- 6 isotipo references render: hero, Services, Method (pre-existing), plus the new Systems
  section background mark, Sonoro's featured-row mark, and UX Analyzer's no-logo fallback mark.
- All 8 real logo `<img src>` paths resolve correctly, including the space-encoded Bloom Undies
  path (`/project-logos/bloom%20undies/...png`).
- Heading hierarchy is correct: section `<h2>` → entry `<h3>`, no skipped levels.

---

## Component Architecture

Six components, not the suggested seven — `ProjectLogo` and `ProjectPreview` were consolidated
into one (`ProjectPreview.astro`). Both would have been a two-line `<img>` wrapper; splitting
them would have added a file without adding a decision. The brief explicitly allows renaming "if
a stronger naming convention exists" — this is a merge, not a rename, for the same reason: one
component, one job (render a system's visual signature, with the isotipo fallback built in).

| Component | Job | Reused from |
|---|---|---|
| `ProjectStatus` | State pill | `.pill` system in `global.css` |
| `CapabilityLabel` | Capability tag pill | `.pill` system in `global.css` |
| `ProjectPreview` | Logo signature frame / isotipo fallback | Isotipo conventions from doc 11 Part 5 |
| `ArchitectureStrip` | Dynamic layer diagram | `text-mono` register, doc 11 Part 6 |
| `SystemEntry` | One system row, 3 variants | Row/hairline pattern from `Services.astro` |
| `Systems` | Section assembly | Header pattern from `Services.astro`/`Method.astro` |

No new npm dependencies. No utility framework. Every color, spacing, and type value is a token
already defined in `global.css`.

---

## Editorial Hierarchy — Why Sonoro Feels Larger Than Bloom Undies

Two independent props drive visual weight, not one:

- **`variant`** (`featured` / `standard` / `conceptual`) controls *structure*: Sonoro alone gets
  the dark inset (same device Services used for its IA row) and is the only entry whose detail
  content is always expanded rather than hidden behind a disclosure. UX Analyzer alone gets the
  conceptual treatment: no logo, a narrower centered measure, and a violet-tinted disclosure
  toggle (violet legitimately earns this — doc 11's color law makes violet the intelligence
  color, and "Investigación" literally is that register).
- **`size`** (`xl`/`lg`/`md`/`sm`) controls *scale*: name type size and logo-frame dimensions
  step down through the ranking — Sonoro (`xl`) → DocLink/WATERLÜ (`lg`) → PRISMA/CleanSolarAus/
  Riot (`md`) → Bufón/Bloom Undies (`sm`).

The combination means no two adjacent rows look identical, without needing nine bespoke layouts.
WATERLÜ additionally carries `closing: true`, which adds a bottom border to mark it as the
section's deliberate final argument rather than just the last item in a loop.

**Progressive disclosure** (brief: "do not expose everything simultaneously") is native
`<details>`/`<summary>` — zero JavaScript, keyboard- and screen-reader-accessible without any
extra work, and it does double duty as a weighting device: Sonoro's content is structurally
*not behind* a toggle, which is itself a statement about how much weight it carries.

---

## Architecture Component — Why It's Dynamic, Not Templated

Stage 1 (`docs/16-systems-architecture.md`, original Part 5) proposed one fixed six-name
vocabulary — Presentation / Logic / Processing / Storage / Infrastructure / AI — applied to every
system with blanks where a layer didn't apply. The Phase 4B brief correctly rejected this: a
template with permitted gaps is still a template. `ArchitectureStrip.astro` instead takes an
arbitrary ordered list of `{ layer, detail }` pairs with no fixed enum, so each system supplies
layer names that describe *its own* actual flow:

- Sonoro: Presentation → Logic → Processing → Storage → Infrastructure → AI (6 layers)
- WATERLÜ: Presentation → Interaction → Infrastructure (3 layers)
- UX Analyzer: Automation → Analysis → Output (3 layers)
- DocLink keeps the six-layer shape but renames the middle layer "Automation" — because that's
  literally what DocLink's own documentation calls that layer, not because the template says so.

`docs/16-systems-architecture.md` Part 5 was rewritten to reflect this shift and explicitly
documents the reasoning, rather than leaving the superseded fixed-vocabulary table in place.

---

## Project Weighting Rationale

Already covered above (Editorial Hierarchy) and in `docs/16-systems-architecture.md` Part 2. One
addition specific to implementation: WATERLÜ's "emphasize execution" instruction was translated
into `size="lg"` (matching DocLink, the section's other platform-scale entry) plus the `closing`
border treatment and a single capability tag ("Ejecución real") rather than trying to invent a
fourth structural variant. Three variants were enough to carry nine different weights once `size`
and `closing` are layered on top.

---

## Isotipo Usage

Five deliberate, non-decorative uses (brief: "separators, structural anchors, section
transitions, masks, layout interruptions" — do not decorate, do not repeat mechanically):

1. **Section background mark** — top-left, 5% opacity. Services used top-right, Method used
   bottom-right; varying the corner across sections keeps the pattern from feeling mechanical.
2. **Sonoro's featured-row mark** — bottom-right inside the dark inset, 6% opacity, no blend
   (dark surface). Functions as a structural anchor specifically for the section's featured system.
3. **UX Analyzer's no-logo fallback** — the isotipo stands in, unframed, at 60% opacity, wherever
   a logo would otherwise sit. This is the literal case doc 11 Part 5 describes: the mark
   substituting for missing brand material, used because UX Analyzer has no logo of its own to
   show — not decoration layered on top of one.

**What was not attempted:** a true single-parallelogram "divider" mark (doc 11 Part 5's
literal divider spec — one shape, flush to a viewport edge) between the featured row and the
list. Verk's only isotipo asset is the combined two-shape PNG; cropping it in CSS to reliably
show just one parallelogram without visual verification (no browser tooling this session) risked
producing a broken-looking crop rather than a clean one. This is already a tracked dependency —
memory notes "Isotipo SVG conversion (871KB PNG → SVG)" as a pending generic-Phase-4 item — and
the single-shape divider and image-mask use case are flagged below as Phase 5 candidates once
that asset exists.

---

## Motion Decisions

No JavaScript was added. Motion is limited to what CSS alone provides:
- `<details>`/`<summary>` native open/close (no animation added — browsers don't animate
  `<details>` content height without JS, and adding a height-animation script for this would
  violate "avoid unnecessary JavaScript" for a cosmetic gain).
- The `+` → `×` rotation on the disclosure toggle (`transform: rotate(45deg)`, 300ms, existing
  `--ease-out-expo` token).
- The entry-name arrow's small hover translate, matching the existing `.hero-btn-secondary`
  pattern, gated behind `@media (hover: hover) and (pointer: fine)` per skill-adoption rule AN-02.
- `data-reveal` is intentionally omitted, matching the Services/Method precedent — the
  IntersectionObserver activation is still pending in the generic Phase 4 queue, not this phase.

No pinned storytelling, no horizontal scroll, no GSAP, no scroll-triggered reveals — consistent
with the brief's explicit motion constraints.

---

## Responsive Decisions

Mobile recomposes rather than uniformly stacks:
- The rank number (`01`–`09`, Geist Mono) hides below 640px — it's a nice-to-have ordering cue on
  desktop, not essential information, and it competes for space with the logo frame on narrow
  screens.
- Logo frame sizes step down per breakpoint per `size` tier (see `ProjectPreview.astro`), so
  Sonoro's frame is still visibly larger than Bufón's on mobile, not just on desktop.
- The conceptual variant (UX Analyzer) drops its `max-width: 640px` centering on mobile — centered
  narrow columns look intentional on wide viewports and cramped on narrow ones.
- The architecture strip switches from a horizontal `→`-connected row to a vertical `↓`-connected
  stack via CSS only (two glyph spans, one hidden per breakpoint — no JS, no duplicate markup).

---

## Accessibility

- Semantic `<ol>` for the systems list — the Method section precedent already established that
  Verk uses ordered lists specifically when order carries information (doc 16's ranking is
  exactly that case).
- Native `<details>`/`<summary>` for progressive disclosure — keyboard-operable and
  screen-reader-announced by default, no ARIA re-implementation needed.
- All decorative isotipo marks and the entry-name arrow icon carry `aria-hidden="true"`.
- Logo `alt` text defaults to `"{name} — isotipo"` when not overridden; the isotipo fallback for
  UX Analyzer is `aria-hidden` since it carries no information a screen reader needs.
- Heading hierarchy: section `<h2>` → entry `<h3>`, no skipped levels.
- Focus-visible styling inherits the global lime focus ring (`global.css`) — no local override
  needed since no custom-styled interactive element beyond `<details>` and `<a>` was introduced.
- `prefers-reduced-motion` is already handled globally (`motion.css`) for the only animated
  properties this section adds (transform on the toggle icon, transform on hover).

---

## Performance

- Zero new JavaScript. Zero new npm dependencies.
- All logo images use `loading="lazy"` and `decoding="async"`.
- SVG logos (Sonoro, CleanSolarAus) are already tiny (under 1KB) and vector — no optimization
  needed. PNG logos are pre-existing assets, unmodified.
- Astro's static output is unaffected — the entire section renders as static HTML with the
  `<details>` interactivity handled natively by the browser.

---

## Self-Critique

**What still feels too close to the references:** the row-with-disclosure pattern is a safe,
well-worn "editorial list" solution — it is the correct choice for scalability (doc 16 Part 6),
but it does not yet have a moment that could only exist on Verk's site. Services and Method
already use the same hairline-row skeleton; Systems is now the third section in a row built on
that skeleton, and the pattern risks reading as "the Verk template" rather than three distinct
decisions, even though each one is justified independently. If a future project needed a fourth
homepage section, repeating the row pattern a fourth time would start to feel like a limitation
of the design system rather than a deliberate choice.

**What already feels uniquely Verk:** the architecture strip's dynamic layer naming is the
strongest original idea in this phase — it resists the instinct to normalize nine different
systems into one comparable table, which is exactly the instinct a portfolio has and an
engineering archive doesn't. The `Sistemas` / `El problema cambia. El método no.` header also
earns its place: it only makes sense to someone who has already read `Método`, which means the
homepage is starting to accumulate an internal vocabulary rather than restating itself section by
section.

**Removing every logo and every project name** — does the section still feel like Verk? Mostly:
the hairline rows, the mono architecture labels, the isotipo watermark, the violet-for-Investigación
rule, and the "problem/system/how/why" reading order would all survive that test. What would
*not* survive it: the fact that eight of nine rows currently default to roughly the same
information density once expanded. The weighting system (variant + size) changes how much space
a row occupies, but it does not yet change how a reader is invited to *move* through the section
— there's no equivalent yet of Method's step-by-step inevitability, something Systems could have
that a generic list of nine items couldn't.

**What should evolve in Phase 5:**
1. The true single-parallelogram divider/mask uses of the isotipo, once the SVG asset exists.
2. Nav.astro's `#proyectos` link still reads "Proyectos" while the section itself is now labeled
   "Sistemas" — a real, minor inconsistency. Left unchanged this phase because it's nav copy, not
   the Systems section itself, and the brief's stop condition excludes nav/footer work — but it
   should be fixed before this ships.
3. Once the generic Phase 4 IntersectionObserver work lands, `data-reveal` should be added here
   with a stagger that differs by `variant` (featured entrance distinct from standard-row
   entrance), rather than a uniform stagger across all nine rows.
4. A genuine second "moment" beyond the row-list pattern — not for every section, but Systems in
   particular carries enough narrative weight (doc 16's entire taxonomy argument) that it could
   justify one structural device the other two sections don't have, once there's a stronger idea
   for what that device should be.

---

## Stop Condition Met

Systems section: implemented, integrated, documented.
Build: passing (0 errors, 0 warnings).
Report: this document.

**Waiting for approval before continuing into Contact, Footer, final CTA, or motion polish.**
