# Verk — Mobile Audit (Phase 6)
> Real audit: the live dev build was screenshotted with a headless Chromium instance
> (touch-emulated, `isMobile: true`) at 375×667 (iPhone SE), 390×844 (iPhone 13
> mini / 15), 412×915 (Pixel 8 / Galaxy S24) and 430×932 (iPhone 15 Pro Max) —
> every finding below is anchored to what actually rendered, not a guess from
> reading the CSS. Screenshots and exact source lines are cited per finding.

---

## Governing question

Not "how do I make this fit" — "if Verk had only ever existed on mobile, how
would this section have been designed." Every finding below is judged against
that question, not against "does it break."

---

## Critical — breaks the experience, not just suboptimal

### 1. The primary navigation is completely inaccessible on mobile

`Nav.astro`, `@media (max-width: 768px) { .nav-links, .nav-divider { display:
none; } }`. Servicios / Método / Proyectos / Contacto exist **only** as a
`display:none` list on any phone. There is no hamburger, no drawer, no
alternate access point — a mobile visitor can only reach those sections by
scrolling past everything in between. This is not a "mobile adaptation
gap," it's a removed feature. Fixed in Part 2.

### 2. The Hero has ~250px of dead space above the fold on a phone

`Hero.astro`: `.hero { min-height: 100svh; display:flex; flex-direction:
column; justify-content: flex-end; }`. On desktop, content-anchored-to-bottom
works because the isotipo mark and the wide aspect ratio give the upper area
a job. On a 390×844 viewport, the same rule leaves the label
("INFRAESTRUCTURA DIGITAL") starting at roughly y=300 — measured directly
from `audit-13mini15-full.png` — with nothing above it but blank cream. That
reads exactly like the brief's own warning: "oversized whitespace," not an
intentional pause. Desktop's composition was scaled, not redesigned. Fixed in
Part 3.

### 3. Footer's isotipo "period" detaches from the text it punctuates

`Footer.astro`: `.footer-headline { display:flex; align-items:baseline;
gap:...}` containing the wrapped text "Seguimos construyendo" plus the
`<Isotipo>` mark as a flex sibling. `flex-wrap` is never set (defaults to
`nowrap`), so when the headline text wraps to two lines internally at phone
widths, the mark — a separate flex item — stays pinned to the end of the
row's cross-axis, not the end of the visual second line. Screenshot
(`m-footer.png`) shows the mark floating at the top-right, disconnected from
"construyendo." The whole point of that mark (docs/phase5-report.md §4,
row 5 — "the site's one period") is broken by exactly this device. Fixed in
Part 8.

---

## Real, but not breaking

### 4. Services' cascade fully flattens — becomes a plain list

`Services.astro`, `@media (max-width: 768px) { .discipline-1, .discipline-2,
.discipline-3, .discipline-4 { padding-left: 0; } }`. The desktop identity —
a staggered editorial cascade, doc 18/19's whole argument against "four
identical rows" — collapses to literally four identical rows the moment the
viewport narrows. Confirmed in `m-services.png`: nothing distinguishes this
from the pre-Phase-5 four-row grid except the numerals. Mobile deserves its
own asymmetry, not a full retreat to the thing this section was built to
avoid. Fixed in Part 4.

### 5. Touch targets below the 44×44px minimum in two places

- `SystemEntry.astro` `.entry-toggle { padding: var(--space-2) 0; }` — 8px
  vertical padding + ~20px line-height ≈ 36px tap height. Below Apple HIG's
  44pt and Material's 48dp minimums. Every "Cómo funciona" disclosure on
  every system in Sistemas is affected — the section with the most
  interaction on the whole site has its worst touch target.
- `Footer.astro` `.footer-link-sm` (Privacidad/Términos) — `text-xs` with no
  padding, a tight target directly above the safe-area on devices with a
  home indicator.

Fixed in Parts 6 and 8.

### 6. No safe-area-inset handling anywhere

`Layout.astro`'s viewport meta is `width=device-width, initial-scale=1` —
missing `viewport-fit=cover`, which means `env(safe-area-inset-*)` never
activates even where it's used (nowhere, yet). `Nav.astro`'s fixed pill uses
`top: var(--space-6)` (24px) unconditionally. On an iPhone with Dynamic
Island, 24px is uncomfortably close to it; on the home-indicator side, the
Footer's bottom links have no bottom safe-area padding. Fixed in Part 2/9.

### 7. No skip-to-content link

`Layout.astro` has `<main id="main-content">` but nothing points a keyboard
or screen-reader user to it — they must tab through the entire nav first.
Minor on desktop (few nav items); worse now that mobile gets a real menu
button to tab past. Fixed in Part 9.

### 8. Motion timing is identical on mobile and desktop

Hero's reveal sequence (label → line 1 → line 2 → sub → actions → microcopy
→ mark) takes the same ~6.3s on a phone as on a 27" display, even though a
mobile reader's scanning rhythm is faster and the screen holds less at once.
The brief asks explicitly: "some animations should become shorter." Fixed in
Part 3.

---

## Already strong — confirmed, not touched

- **Método**: the numbered spine composition reads exceptionally well at
  every width tested — this is the section doc 16/18 already got right for
  mobile without knowing it. No structural change; see Part 5 for the one
  small polish applied.
- **Sistemas' `ArchitectureStrip`**: already switches to a vertical
  `↓`-connected flow under 640px (built in Phase 5) — confirmed working
  correctly in `m-systems-ch1.png`, pills wrap cleanly, no ugly breaks.
- **CTA**: composition, type scale, and button already read as intentional
  at every width tested — only the button's exact touch height needed
  confirming (it does; see Part 7), no redesign needed.
- **`prefers-reduced-motion` handling, cursor system's `pointer:fine` gate**:
  both already correctly disable desktop-only affordances on touch — no
  regression found.

---

## What follows

Parts 2–9 (this document continues as inline comments in the changed
source files, per the instruction to explain every decision at the point
it's made) rebuild: the mobile nav (real menu, not a hidden list), Hero's
vertical rhythm, Services' mobile-specific asymmetry, touch targets
sitewide, the Footer wrap bug, and safe-area/skip-link basics. Full
before/after and validation matrix: `docs/phase6-mobile-report.md`.
