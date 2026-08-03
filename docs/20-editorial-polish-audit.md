# Verk — Phase 7: Editorial Polish Audit
> Refinement only. No new sections, components, or dependencies were added.
> Every change below is a value adjustment inside an existing rule, or a
> deletion of something redundant. Nothing new was invented.

---

## Method

Slow, repeated passes over the live build (desktop 1440px, mobile 390px),
plus a systematic grep across every component for the specific inconsistency
categories the brief named: border-radius, duration, easing, font-weight,
hardcoded values that should reference a token. Two categories of finding
came out of this: **real drift** (fixed) and **apparent problems that turned
out not to be real** (investigated, confirmed non-issues, documented rather
than "fixed" into something that was never broken).

---

## Refinements made

### 1. Lime hover color had silently drifted into two values

`global.css`'s `.btn-primary:hover` used `#D4FF00`. `Hero.astro`'s
`.hero-btn-primary:hover` and `Nav.astro`'s `.nav-cta:hover` both used
`#CEFF00` — a different value, for the exact same semantic state (the lime
action-color brightening on hover), with no comment anywhere explaining an
intentional difference. A ~2% channel difference, invisible in an A/B
glance, but exactly the kind of thing the brief calls out: "one animation
duration... visual noise the visitor should never consciously notice, only
feel." Two near-identical lime hovers across three buttons is the visual
equivalent of two almost-matching typefaces — wrong in a way that reads as
carelessness even when no single instance looks wrong alone.

**Fix:** added `--color-lime-hover: #D4FF00` to `global.css`'s token block
(keeping the value already used in the shared `.btn-primary:hover` rule,
since that's the canonical, most-referenced definition). `Nav.astro`'s
`.nav-cta:hover` now references the token. `Hero.astro`'s
`.hero-btn-primary:hover` override was deleted outright — that element
already carries `.btn.btn-primary`, so the shared rule applies once the
redundant duplicate is gone. Net result: one value, referenced three times,
instead of two values by accident.

### 2. The primary easing curve was duplicated as a literal instead of its own token

`--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)` has existed in `global.css`
since Phase 1. `Hero.astro` (7 occurrences) and `Nav.astro` (2 occurrences)
wrote the identical curve out by hand instead of referencing the token —
harmless today because the values matched exactly, but exactly the kind of
thing that drifts silently the next time someone tunes the curve in one
file and not the other (precisely what happened to the lime hover color
above). Replaced every literal occurrence with `var(--ease-out-expo)` in
both files. Zero visual change — this is the difference between "correct
by coincidence" and "correct by construction."

---

## Investigated, confirmed NOT a real problem

The brief asked for imperfections, not bugs — but two things surfaced
during visual QA that looked like real, ship-blocking regressions at first
glance. Both were run to ground before touching any code, and both turned
out to be artifacts of the test tooling, not the site. Recorded here in
full because "I checked and it wasn't real" is itself part of an honest
audit — the alternative is silently shipping a change that fixes nothing
and risks something.

**The skip-link appeared to float over section headlines in screenshots.**
Element-scoped Playwright screenshots (`.locator('#metodo').screenshot()`)
showed "Saltar al contenido" sitting mid-page, overlapping "Cómo funciona."
Direct DOM measurement (`getBoundingClientRect()`) at the exact same moment
showed the skip-link's real position at `y: -59.6 to -9.2` — fully above
the visible viewport, exactly where the hidden state (`translateY(-150%)`)
puts it. A plain, non-element-scoped viewport screenshot at the identical
scroll position confirmed the skip-link is invisible in the actual
rendered frame. The floating appearance was specific to this headless
Chromium build's element-screenshot compositing (a dated cached binary,
`chromium-1228`, used for this session's QA) — not something a real
visitor, in a real browser, would ever see. No code changed.

**The floating nav pill appeared to overlap section headlines mid-scroll.**
Confirmed real, and confirmed correct: a fixed, semi-transparent, blurred
pill that stays at a constant screen position while page content scrolls
underneath it is the entire point of the "dark, floating" nav (doc 11,
locked since Phase 2A) — every floating-pill nav on every reference site in
this project's own moodboard behaves identically during the transitional
instant of a scroll. What looked like a resting-state collision in a
screenshot is, in real continuous scroll, a fraction of a second of
overlap that resolves itself as the page keeps moving. Nothing to fix here
without undoing an intentional, already-approved design decision.

---

## Typography, spacing, layout, color, motion — reviewed, not changed

Slow re-reads of every heading, every section transition, every chapter's
atmosphere, and the full motion sequence (Hero's reveal, Método's spine
stagger, Sistemas' disclosure animation, the CTA's silence beat) did not
surface a change that was clearly, objectively better than what Phases 5
and 6 already arrived at — those phases were themselves iteration passes
built on exactly this kind of scrutiny (the color rhythm rebuild, the
mobile-native recomposition). Re-deciding an already-considered value
without a concrete reason to would be motion for its own sake — the
opposite of what this phase asks for. Where the honest answer was "this is
already the right decision," it was left alone. See
`docs/phase7-polish-report.md` for the one real remaining cosmetic
imperfection that was deliberately not fixed, and why.

---

## Validation

`astro check` — 0 errors, 0 warnings, 0 hints.
`npm run build` — clean (only the pre-existing, expected font-fallback
warnings, unrelated to this phase).
