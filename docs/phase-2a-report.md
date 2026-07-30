# Phase 2A Report — Navigation + Hero

**Status:** Complete
**Build:** Passing (`astro check` → 0 errors · `astro build` → clean)
**Date:** 2026-06-21

---

## Files Created

| File | Type |
|---|---|
| `src/components/Hero.astro` | New component — Concept 4 implementation |

## Files Modified

| File | Changes |
|---|---|
| `src/components/Nav.astro` | Full rewrite — Phase 1 stub → Phase 2A final nav |
| `src/pages/index.astro` | Replaced placeholder hero section with `<Hero />` component; updated section IDs to match nav links; added `Hero` import |

---

## Design Decisions

### Navigation

**Why a dark pill over the cream hero?**

Document 11, Part 9 (The Only Verk Test), item 11 explicitly describes the nav as "dark, floating." A dark (#111111) pill over the cream hero creates the maximum contrast and the strongest visual anchor. It also means the lime CTA reads with full intensity — lime on dark is significantly more powerful than lime on cream. The Phase 1 stub used a cream/frosted pill, which was incorrect per the highest authority document. This is corrected in Phase 2A.

**Padding architecture — why `padding: 6px 6px 6px 20px`?**

The asymmetric padding is intentional. The right side gets `6px` so the lime CTA button (which has its own internal padding) sits flush with the pill edge, creating the visual impression of a "pill within a pill." The left gets `20px` to give the wordmark appropriate breathing room. This pattern is used by Instrument and similar premium studios.

**Why a divider between wordmark and links?**

At small sizes, without a separator the wordmark and first link run visually together. A 1px line at 12% cream opacity creates enough visual separation without being a strong design element — it reads as a structural boundary, not a decoration.

**Why `12px` for link text?**

At the scale of a floating pill nav, 12px is the correct optical size. Larger type in a compact pill creates crowding and makes the nav feel heavy — the opposite of "present but not dominant." The wordmark at 13px is slightly larger to establish hierarchy while remaining compact.

**Hover behavior — mechanical, not playful:**

Hover uses only `background-color` and `color` transitions at 150ms linear-ish ease. No scaling, no translation, no spring. The background fill on hover (`rgba(240, 238, 233, 0.08)`) creates a clear affordance with no theatrics. Per the brief: "hover should feel mechanical, not playful."

**Active state — scaffolded for Phase 4:**

The `.is-active` class and the lime dot are defined in CSS but not yet wired to any IntersectionObserver. The section-based active detection will be implemented in Phase 4 (scroll + interactions).

**Entrance animation:**

The nav starts at `opacity: 0, translateY(-10px)` and transitions to `opacity: 1, translateY(0)` over 600ms with `cubic-bezier(0.16, 1, 0.3, 1)` (the Verk primary ease). A `sessionStorage` flag ensures the animation only plays on the first visit — on ViewTransition navigations, the nav appears immediately without re-animating. The 400ms delay gives the page a moment to settle before the nav asserts itself.

---

### Hero

**Concept fidelity — "La Primera Decisión":**

The implementation follows the concept description in document 11, Part 4 verbatim: "An expanse of cream. Near the center-left: the isotipo, already present. Below it, after a long pause: the headline appears, one line at a time, with genuine weight between each line."

No reinterpretation was made. The copy is taken directly from document 12, Part 9.

**Isotipo positioning:**

The isotipo is positioned absolutely on the right side of the hero (`right: -6%`), vertically centered, at `clamp(340px, 50vw, 720px)` width. This creates a composition where the left side of the hero holds the text (legible, uncluttered) and the right side holds the shape (present, atmospheric). The `-6%` right offset allows the isotipo to partially bleed off the viewport edge, reinforcing its large scale.

`opacity: 0.08` matches the document 11 specification exactly (8%). `mix-blend-mode: multiply` makes any white areas of the PNG become transparent against the cream surface, preserving only the violet shape geometry. Without this, a white-background PNG at 8% opacity would show a faint white rectangle over the cream — acceptable at this opacity level, but multiply is cleaner.

**Why two `<span>` elements inside `<h1>` instead of one?**

Each line needs its own animation delay to arrive independently. A single h1 with a `<br>` would animate as one block. Two `display: block` spans inside the h1 maintain correct heading semantics (screen readers announce this as one heading) while enabling independent timing for each line.

**Why CSS animation, not JS?**

Document 11 explicitly requires no text-splitting libraries and no gimmicks. The sequential reveal is pure CSS: each element uses `animation-fill-mode: both` with a specific `animation-delay`. This means:
- Elements are invisible before their delay fires (from keyframe `opacity: 0`)
- Elements are visible and in final position after the animation completes (from keyframe `opacity: 1`)
- Zero JavaScript required for the reveal sequence
- Zero additional dependencies

**Reduced-motion override is explicit, not inherited:**

The global `motion.css` sets `animation-duration: 0.01ms !important` for reduced-motion. However, this alone does not solve the hero problem: an animation with 0.01ms duration but a 6.5s delay still keeps an element invisible for 6.5 seconds. The Hero component's scoped styles explicitly set `animation: none; opacity: 1; transform: none` for all hero content elements under `prefers-reduced-motion: reduce`. This overrides both the animation and the fill-mode state, making all elements immediately visible.

---

## Motion Decisions

**Animation timing rationale:**

The "reading speed" principle from document 11 ("approximately 1200ms between elements") was the guide. Each pause is long enough to read the previous element comfortably, short enough that the sequence doesn't feel broken.

| Element | Delay | Duration | Rationale |
|---|---|---|---|
| Label ("Infraestructura Digital") | 0.3s | 0.4s | First element; brief page settling before it appears |
| Headline line 1 ("Construimos sistemas.") | 1.0s | 0.55s | 300ms after label completes; headline demands the most attention |
| Headline line 2 ("No sitios.") | 2.6s | 0.55s | 1.05s pause — time to read "Construimos sistemas." |
| Subheadline | 4.2s | 0.55s | 1.05s pause — time to read "No sitios." which is short but heavy |
| CTAs | 5.5s | 0.50s | 0.75s pause — subheadline is longer, but CTAs need to follow decisively |
| Microcopy | 6.5s | 0.40s | 0.50s pause — last element, arrives quietly |

**Total sequence duration: ~6.9 seconds.** This is intentional. The page is not trying to fill itself quickly. It is building at the rate of someone reading it for the first time.

**Easing:** All hero animations use `cubic-bezier(0.16, 1, 0.3, 1)` — the `--ease-out-expo` token. This produces a deceleration that feels like something with weight arriving, not something being snapped into place.

**Entrance distance:** `28px` translateY (slightly less than the global `32px` token). The smaller offset makes the hero content feel like it is rising gently rather than arriving from a visible distance — appropriate for the restrained pacing of this concept.

---

## Responsive Decisions

**Typography — fluid, not breakpoint-driven:**

The headline uses `clamp(3.25rem, 1.5rem + 7vw, 8rem)`. At 390px (iPhone 14): ~57px. At 768px (tablet): ~85px. At 1280px (desktop): ~105px. At 1440px+: capped at 8rem (128px). The type is always large and premium — no breakpoint where it suddenly becomes a different thing.

**Isotipo — three responsive states:**

- Desktop (`> 900px`): right side, 50vw width, 8% opacity. The shape and text share the hero in visual tension.
- Tablet (`≤ 900px`): right: -15%, 65vw width, 6% opacity. The shape retreats slightly to avoid competing with narrower text columns.
- Mobile (`≤ 600px`): centered horizontally, 85vw width, 5% opacity. On mobile the composition shifts from left-text / right-shape to a single column with the shape as a centered atmospheric background.

**Mobile nav — wordmark + CTA only:**

At `≤ 768px`, the nav links are hidden and only the wordmark and Auditoría CTA remain visible. A mobile hamburger menu is out of Phase 2A scope. The behavior is noted as a Phase 4 enhancement (mobile menu overlay with centered isotipo per document 11).

**Subheadline max-width:**

`max-width: 560px` on desktop. Removed on mobile (`max-width: 100%`). At 560px, the subheadline breaks into approximately 2 lines at body-large size — the correct line length for reading comfort (65–70 characters per line).

---

## Performance Considerations

**Isotipo PNG weight:**

`/public/images/isotipo.png` is **871KB** — large for a decorative element. At 8% opacity on a cream background, this is the most expensive asset on the initial page load. Three mitigations for Phase 4:

1. Convert the isotipo to SVG (vector, infinitely scalable, typically < 5KB for a two-shape geometric mark). This is the correct long-term solution.
2. Alternatively, move `isotipo.png` to `src/assets/isotipo.png` and use Astro's `<Image>` component, which will convert it to WebP at the correct display size (~50-60KB for a 700px WebP).
3. In the meantime: the image uses `fetchpriority="high"` (it's above the fold) and `decoding="async"` (doesn't block rendering). The impact is reduced by the fact that it's displayed at 8% opacity — a slow load produces no visible flash.

**Lenis + ViewTransitions:**

Lenis initialization is wired to `astro:page-load` / `astro:before-swap` in Phase 1. This integration continues to work correctly with the Phase 2A hero. The hero uses CSS animations, not Lenis scroll events, so there is no interaction between the two systems.

**CSS animations vs JS:**

The hero uses zero JavaScript for its reveal sequence. This is a deliberate performance choice: CSS animations run on the compositor thread, independent of JavaScript execution. A slow script (Lenis init, ad scripts, analytics) cannot block or delay the hero reveal.

---

## Deviations from Plan

| Item | Plan | Decision | Reason |
|---|---|---|---|
| Nav pill color | Phase 2A brief: "cream / dark mode aware" | Implemented as dark (dark pill over cream hero) | Document 11 (highest authority) explicitly describes the nav as "dark, floating" in the Only Verk Test (Part 9, item 11). doc 11 overrides the Phase 2A brief on this point. |
| Secondary CTA | Global `.btn-secondary` class | Custom `.hero-btn-secondary` with animated arrow | The global `.btn-secondary` uses a full pill border treatment. The hero's secondary action should be lighter — a text link with arrow, not a second pill. Two equal-weight pills would compete. The arrow gap animation is mechanical (150ms gap change), not playful. |
| Ticker animation | `marquee-inner` global class | Local `.ticker-inner` with direct `animation: marquee` | The global `.marquee-inner` class uses `--motion-marquee-speed` (40s) as the duration. The ticker section moves at 50s for a slightly slower, more ambient pace appropriate for a background band. Using a local style avoids coupling the ticker to the global motion token. |

---

## Phase 2A Acceptance Criteria

- [x] `Nav.astro` — final design, dark pill, correct links and CTA
- [x] `Hero.astro` — Concept 4 ("La Primera Decisión") implemented faithfully
- [x] Hero copy matches document 12 Part 9 exactly
- [x] Sequential reveal at reading speed — CSS-only, no JS libraries
- [x] Isotipo present without entrance animation at 8% opacity
- [x] Section label above headline (Rule 6, doc 11)
- [x] Reduced-motion explicitly handled for hero reveal sequence
- [x] Mobile responsive — typography large, isotipo repositioned
- [x] Nav entrance animation wired to `astro:page-load`
- [x] Session storage prevents nav re-animating on ViewTransition navigations
- [x] `astro check` → 0 errors, 0 warnings, 0 hints
- [x] `astro build` → clean (9 expected font warnings only)

---

## Phase 3 Readiness

Phase 2A delivers the first screen of Verk. The implementation is:
- Faithful to the highest authority documents
- Performance-optimized within the constraints of the current assets
- Accessible (reduced-motion, semantic HTML, aria-label on interactive elements)
- Responsive across all target breakpoints

**Phase 3 scope:** Services section — the four service categories (sites, automation, CRM integrations, AI tools) presented as cards, following the section label → headline → card grid structure established in document 03.

**Known Phase 4 work generated by Phase 2A:**
- Mobile navigation menu overlay (hamburger → dark overlay with centered isotipo, per doc 11 isotipo behavior)
- Nav active state via IntersectionObserver
- Nav section color adaptation (as page scrolls over dark sections, the dark pill may need to lighten — or a `data-theme` toggle approach)
- Isotipo SVG conversion (performance)

---

*Phase 2A complete. Awaiting Phase 3 approval.*
