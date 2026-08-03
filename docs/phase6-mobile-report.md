# Verk — Phase 6 Mobile Report
> Companion to `docs/19-mobile-audit.md` (every weakness found, with reasoning).
> This document covers what was actually changed, how it was validated, and
> what's still open. Self-review at the end answers the brief's own closing
> question directly.

---

## 1 — What changed, file by file

| File | Change | Audit finding it answers |
|---|---|---|
| `Layout.astro` | `viewport-fit=cover`, `theme-color`, skip-link | 6, 7 |
| `global.css` | `.skip-link` styles, `body.nav-menu-locked` (scroll lock) | 7, 1 |
| `Nav.astro` | Real mobile menu (toggle + full-screen overlay, own type scale and stagger — not the desktop link list reused bigger), scroll-aware hide/reveal, safe-area-aware top offset | 1, 6, 8 |
| `Hero.astro` | Mark relocated from mid-right (overlapping the headline) to a small top-right stamp; reveal sequence compressed to ~60% of desktop's timing | 2, 8 |
| `Services.astro` | Cascade offsets rebuilt in fixed px (not reset to 0) so the staggered rhythm survives at phone widths without risking text wrap | 4 |
| `SystemEntry.astro` | Disclosure toggle's tap height raised to 44px (was ~36px) | 5 |
| `Footer.astro` | Headline switched from flex to inline text flow so the isotipo mark wraps with the last word instead of detaching | 3 |
| `Method.astro`, `CTA.astro` | No changes — confirmed already strong in audit | — |

Two additional bugs surfaced only once real devices/viewports were tested,
not visible from reading the CSS in isolation:

- **Nav overlay sized to the pill, not the viewport.** `.nav-wrapper` carries
  `transform: translateX(-50%)` for centering; a `transform` on an ancestor
  creates a new containing block for `position: fixed` descendants. The
  overlay (originally nested inside the wrapper) was resolving `inset: 0`
  against the ~100×50px pill, not the viewport. Fixed by moving the overlay
  to be a sibling of `<header>` instead of a child.
- **Once fixed, the overlay covered the toggle button itself.** With the
  overlay correctly full-screen and above the pill in paint order, the
  second tap (to close) had nothing to hit. Fixed by raising
  `.nav-wrapper`'s z-index above `--z-overlay` — the pill (and its
  hamburger-to-X icon) now stays on top of the surface it controls.

Both were caught by evaluating computed styles and bounding rects in
Playwright, not by inspection — see §3.

---

## 2 — Performance

- **Fonts:** unchanged from the infra audit — Neue Haas Grotesk `.woff2`
  files are still not present (license-gated), falls back to system sans.
  Not a mobile-specific regression; noted here because it affects LCP
  measurement (`font-display: swap` already set, so text paints immediately
  in the fallback face).
- **Images:** all `ProjectPreview` images already `loading="lazy"
  decoding="async"`; the isotipo mark is inline SVG (a few hundred bytes),
  not a raster asset, so it costs nothing extra on mobile bandwidth.
- **JS:** `reveal.ts`, `nav-theme.ts`, `cursor.ts`, `lenis.ts`, and the new
  nav-menu script are all small, dependency-free, and gated appropriately
  (`cursor.ts` already no-ops on touch via `matchMedia('(hover:hover) and
  (pointer:fine)')` — confirmed no wasted work on phones). The new
  scroll-hide listener is `{ passive: true }` and rAF-throttled.
- **CLS:** no layout-shifting assets (no web fonts loading late without a
  reserved space, no images without dimensions in the changed components).
- **GPU-friendliness:** every animation touched in this phase animates
  `transform`/`opacity` only — no layout-triggering properties.

No dedicated bundle-size audit was run (Astro's static output has no
mobile-specific JS bundle to speak of — the same handful of small scripts
ship regardless of viewport).

---

## 3 — Testing matrix

Real headless-Chromium screenshots (touch-emulated, `isMobile: true`) at:

| Width | Represents |
|---|---|
| 375×667 | iPhone SE |
| 390×844 | iPhone 13 mini / iPhone 15 |
| 412×915 | Pixel 8 / Galaxy S24 |
| 430×932 | iPhone 15 Pro Max |

768/1024 were spot-checked against the existing tablet breakpoints (already
handled by the fluid `clamp()` system throughout — no new issues found at
those widths). This is a representative sample across the requested device
matrix, not one screenshot per named device — the CSS is fluid
(`clamp()`-based) between these points, so the four widths above bound the
range rather than requiring a discrete test per model.

Verified per width: nav menu open/close (including the two stacking bugs
above), Hero composition, Services cascade, Footer mark wrapping, Sistemas
disclosure tap targets. Full-page screenshots taken before and after each
fix to confirm no regression elsewhere on the page.

---

## 4 — Accessibility

- Skip-link added (`Layout.astro`) — visible on keyboard focus, jumps to
  `#main-content`.
- Mobile menu: `aria-expanded`, `aria-controls`, `aria-label` (changes
  between "Abrir"/"Cerrar") on the toggle; `inert` on the overlay while
  closed (removes it from the accessibility tree and tab order, not just
  visually hidden); Escape key closes it; background scroll locked while
  open so screen-reader/keyboard users can't tab into content that's
  visually covered.
- Touch targets: Sistemas' disclosure toggle raised to 44px (Apple HIG
  minimum / close to Material's 48dp). CTA and footer buttons already
  measured ≥44px, confirmed not changed.
- `prefers-reduced-motion`: the new mobile menu's stagger and the
  compressed Hero timings both respect the existing global override —
  confirmed no new animation was added outside that gate.
- Safe areas: `viewport-fit=cover` + `env(safe-area-inset-*)` now used in
  the nav wrapper's top offset and the menu overlay's padding — verified
  present in computed styles (can't simulate an actual notch in headless
  Chromium; the CSS is correct and degrades to the existing fixed spacing
  on non-notched devices via `max()`).

---

## 5 — Before / After, in one line each

- **Nav:** inaccessible → a real full-screen menu with its own type scale.
- **Hero:** ~250px of accidental blank space → a mark with a job, sequence
  compressed for how fast a phone gets scanned.
- **Services:** cascade fully flattened → cascade survives at 8–26px, still
  reads as a staircase.
- **Sistemas:** disclosure taps sometimes missed → 44px minimum everywhere.
- **Footer:** the closing mark detached from its word → wraps with it.

---

## 6 — Final self-review

**If someone only ever opened Verk on a phone, would they believe it was
designed for mobile first?**

For the sections rebuilt this phase — yes, honestly. The nav menu, the
Hero's top-right stamp, and Services' surviving cascade all now make
decisions that only make sense if a phone was the actual target, not a
constraint to route around. Método and the CTA already passed this test
before this phase started, unprompted — confirmed, not touched.

**Where the honest answer is still "getting there, not fully arrived":**

- Sistemas remains a long, linear scroll on mobile — the audit's own
  question ("should categories become horizontally scrollable?") was
  considered and deliberately not built: a horizontal swipe pattern for six
  capability chapters risks hiding content behind a gesture a first-time
  visitor won't discover, which is a worse failure mode than a long scroll
  on a section that's already labeled and chaptered. This is a documented
  trade-off, not an oversight — worth revisiting with real usage data
  (scroll depth, rage-taps) rather than guessing further in the abstract.
- The Services cascade's offsets are a considered compromise (small enough
  to never wrap awkwardly), not a from-scratch mobile-only composition —
  a genuinely bespoke mobile treatment (e.g., a horizontal index at top
  with vertical detail below) was designed conceptually in the earlier
  desktop iteration pass and could be adapted, but wasn't rebuilt again
  here to keep this phase's scope to what the audit actually found broken.

Both are named here rather than glossed over, per the brief's own
instruction not to stop at "good enough."
