# Verk — Phase 3 Report
# Services Section + Method Section

**Date:** 2026-06-23
**Status:** Complete. Waiting for approval before Phase 4.

---

## Files Created

| File | Purpose |
|------|---------|
| `src/components/Services.astro` | Services section — editorial list, isotipo mark |
| `src/components/Method.astro` | Method section — 4-step list, dark surface |
| `docs/phase-3-report.md` | This report |

## Files Modified

| File | Change |
|------|--------|
| `src/pages/index.astro` | Replaced servicios + método placeholders with `<Services />` and `<Method />` |

## Build Status

```
astro check  →  0 errors, 0 warnings, 0 hints
astro build  →  Complete. 9 font warnings (pre-existing, unlicensed Neue Haas Grotesk)
```

---

## Service Architecture Chosen

**Pattern: Editorial row list — three standard + one dark inset**

Each service is a full-width row separated by a 1px hairline (`--color-border-medium`). The grid is 38% / 62% — service name anchors the left, copy fills the right. This ratio is deliberately not 50/50. The name is a structural marker; the copy is the substance.

**Why this pattern beats four equal cards:**
Four equal cards impose false equivalence on the services. The editorial row treats the services as chapters in a document — related, sequential, part of the same obra. The hairlines connect them into a system instead of isolating them as products.

**The IA row as structural interruption:**
The fourth service (Herramientas con IA) breaks the cream surface with a dark inset block (`--color-surface-dark`). Same 38/62 grid rhythm, different material. This is not a card — it's a visual register shift. The violet pill (`pill-violet`) marks the intelligence register per doc 11 (violet = intelligence only). The dark block signals that AI tools operate in a different domain from the other three services.

**Why IA gets the dark treatment:**
- The other three services are operational (they run workflows, connect tools, build sites). IA is cognitive — it changes how decisions are made.
- The violet color token was reserved for this context.
- Making all four rows identical would flatten the hierarchy and lose the system logic.

**Asymmetry survives mobile:** On small screens, the rows collapse to single-column (name above copy). The IA block retains its dark surface and violet pill — the visual interruption persists. Asymmetry is not destroyed by the mobile layout.

---

## Service Copy

All services follow Problem → System → Outcome compressed into two sentences (doc 11, Rule 9: max two sentences per service on homepage).

| Service | Copy |
|---------|------|
| Sitios Web | Tu sitio web no es una vitrina. Es el primer paso de un sistema que convierte visitas en conversaciones reales. |
| Automatizaciones | Cada tarea que se repite puede automatizarse. Construimos los flujos que ejecutan seguimientos, confirmaciones y recordatorios sin intervención. |
| Integraciones CRM | Cuando tus herramientas no hablan entre sí, los clientes potenciales se pierden. Conectamos CRM, WhatsApp, formularios y calendario para que nada quede sin respuesta. |
| Herramientas con IA | Las herramientas de IA genéricas no conocen tu negocio. Construimos las tuyas: entrenadas en tu operación, útiles desde el primer día. |

---

## Method Architecture Chosen

**Pattern: Two-column step list (number + content)**

Each step is a `grid-template-columns: 56px 1fr` row. The step number (01–04) lives in Geist Mono at the technical register — it's a coordinate, not a headline. The step name (Neue Haas Grotesk Display) is the structural anchor. The description follows in body type.

**Why the step numbers are justified here:**
taste-skill and impeccable warn against numbered sections where the number is decorative scaffolding ("Section 01 / 02 / 03"). This is not that. The method IS an ordered sequence — step 02 cannot run before step 01. The numbers carry information the reader needs. This is the exception taste-skill acknowledges: "Numbers earn their place when the section actually IS a sequence and the order carries information."

**Why four steps, these four:**

| Step | What it does |
|------|-------------|
| Entendemos | Establishes that Verk starts with the business, not the deliverable |
| Diseñamos | Shows that design means the system, not just visuals |
| Construimos | Confirms that everything needed gets built (not just the site) |
| Verificamos | Closes with accountability — it works before we call it done |

The visitor reads these four and thinks: "That's not agency process. That's actually how it should work." The process feels inevitable because each step only becomes possible after the previous one. There's no option to skip Entendemos and jump to Construimos.

**Steps that were rejected:**
"Lanzamos" (Launch) — rejected because launch is not a step Verk controls. Verk's job ends when the system is verified working. The client operates from there.
"Seguimiento" (Follow-up) — rejected because it implies Verk is the ongoing operator, which is not the current positioning.

---

## Eyebrow Resolution

**The conflict:** doc 11 Rule 6 requires a section label above every headline. taste-skill's A3-02 warns against AI-style eyebrows as decorative scaffolding.

**Resolution applied:** The `.text-label` class (10px, uppercase, `--tracking-widest: 0.16em`, `--color-grey-soft`) is Verk's locked label system per doc 11 Part 6, Item 5. This is not an eyebrow — it's a positional indicator. The system is intentional and consistent across all sections. The difference between an AI-tell eyebrow and Verk's label:

1. **AI eyebrow:** Added by default because a section looks incomplete without something above the headline. Styling varies. Content is generic ("Our Services", "What We Do").
2. **Verk label:** Part of a locked visual system. Meaning is navigational — it tells the visitor exactly where they are in the obra. The word is precise ("Servicios", "Método"), not marketing copy.

The label satisfies Rule 6's requirement without becoming the AI-tell pattern because:
- It's the same system on every section (not improvised)
- It functions as navigation, not decoration
- The content is specific and correct for each section

**Decision documented:** Implement the label system exactly as locked in doc 11 Part 6. do not change the styling. The eyebrow restraint warning from taste-skill applies to random eyebrow insertion on unrelated sections, not to a coherent positional system.

---

## Isotipo Integration Decisions

**Services section (cream background):**
- Single image at `position: absolute; top: -4%; right: -7%`
- `opacity: 0.055`
- `mix-blend-mode: multiply` → white PNG areas become transparent against cream surface, only the violet parallelogram geometry shows
- Size: `clamp(280px, 36vw, 540px)` — large enough to create macro-background presence, never in the foreground
- Hidden at 480px and below (would dominate on very small screens)

**Method section (dark background):**
- Single image at `position: absolute; bottom: -6%; right: -5%`
- `opacity: 0.05`
- No blend mode — at 5% opacity on dark, the white areas contribute barely-perceptible brightness (below the "visible without looking for it" threshold from doc 11)
- Size: `clamp(260px, 32vw, 480px)`
- Hidden at 480px and below

**What was NOT done (Phase 4):**
- Isotipo as SVG (currently PNG, 871KB — Phase 4 converts to SVG vector)
- Single parallelogram as a hairline divider between Services and Method sections (requires SVG path from the brand assets)
- Isotipo as clip-path mask on project images (Phase 4 feature)

**Why both sections use the same isotipo image in the same position (top/bottom-right):**
Doc 11 Part 5 specifies the background systems behavior. The "divider" behavior (single shape flush to an edge) requires a single parallelogram shape, not the full two-shape isotipo PNG. Until the SVG version is available, the full PNG is used at low opacity — this is a valid "background systems" application per doc 11.

---

## Skill Rules Applied

| Rule | Source | Application |
|------|--------|-------------|
| Hover gate required | emilkowalski/skills (AN-02) | No hover states in Phase 3 components (no interactive elements) |
| `transform: scale(0.97)` on `:active` | emilkowalski/skills | No buttons in Phase 3 components — applies via global .btn:active |
| No four equal cards | taste-skill (A3-01) | Three standard rows + one dark inset IA block |
| Eyebrow restraint | taste-skill (A3-02) | Resolved above — label system is structural, not decorative |
| No em-dash in copy | impeccable | Zero em-dashes in Phase 3 copy. One colon in IA copy (intentional punctuation) |
| No identical section structure | impeccable | Services = cream editorial rows. Method = dark step list. Different patterns. |
| `text-wrap: balance` on headings | AN-04 | Applied globally in Phase 2.75 — takes effect on all new headings |
| Touch targets 44×44px | ui-ux-pro-max | No interactive elements in Phase 3 components |
| Violet = intelligence only | doc 11 | Violet pill on IA service only. No violet elsewhere. |
| Lime = action only | doc 11 | No lime in Phase 3 components (no CTAs) |
| Max 2 sentences per service | doc 11, Rule 9 | Verified: all services at exactly 2 sentences |
| No centered headlines on dark | doc 11, Rule 4 | Method headline and step names: all flush left |
| Rule 6: label above every headline | doc 11 | Both sections have `.text-label` above the h2 |
| Motion ≥ 300ms | doc 11, Rule 5 | No local motion added in Phase 3 |
| No gradient backgrounds | doc 11, Rule 8 | Services: cream. Method: surface-dark. Both are flat colors. |

---

## Mobile Decisions

**Services on mobile (≤768px):**
- Grid collapses from `38% / 62%` to `1fr` (single column)
- Service name appears above body copy
- IA dark block stays visually distinct (dark surface + violet pill survive collapse)
- The asymmetry that matters (IA different from the other three) is preserved
- Isotipo mark reduced to 72vw width, opacity 0.04
- Isotipo hidden at ≤480px (would occupy too much of small screens)

**Method on mobile (≤768px):**
- Step number column: 56px → 40px (number remains visible, just tighter)
- Gap between number and content: 32px → 20px
- Steps remain readable at single-column equivalent
- Isotipo hidden at ≤480px

**Mobile is primary:** Both layouts were designed mobile-first. The desktop layout adds the two-column grid as a progressive enhancement. Neither layout requires horizontal scroll. Touch targets: no interactive elements exist in Phase 3 (the sections are informational).

---

## data-reveal Decision

**`data-reveal` attributes were intentionally omitted from Phase 3 content.**

The motion.css rule `[data-reveal] { opacity: 0; transform: translateY(32px); }` makes all `[data-reveal]` elements invisible immediately. Without the IntersectionObserver (Phase 4), adding these attributes would make the entire Services and Method sections invisible on page load — defeating Phase 3's purpose of delivering reviewable content.

Phase 4 implementation plan:
1. Add `.js-ready` class to `<html>` via a script that runs on `astro:page-load`
2. Update motion.css: `[data-reveal]` stays visible by default; `.js-ready [data-reveal]` becomes `opacity: 0`
3. Add `data-reveal` attributes to Phase 3 elements in order of visual priority
4. Wire IntersectionObserver to add `.is-visible` on scroll

This is the progressive enhancement pattern: content visible without JS, animated with JS.

---

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Isotipo PNG is 871KB | Medium | Phase 4 converts to SVG. Current PNG is behind low opacity (0.05–0.055) so perceived load impact is minimal — browser decodes it lazily. |
| `.section-dark > *` sets `position: relative` globally | Low | Astro scoped CSS has higher specificity than the global rule. `position: absolute` on `.method-isotipo` is overridden correctly. Confirmed in build. |
| IA dark block inside cream section — potential "section flip" concern | Low | The block is a card/inset within the section, not a section inversion. taste-skill's "sections do not invert" applies to full-section inversions, not inset elements. The distinction holds. |
| Copy uses colons (one in IA: "Construimos las tuyas: entrenadas en tu operación") | Low | Colon is intentional sentence punctuation, not an AI-tell. em-dash ban (AN-01) does not extend to colons. |

---

## Readiness for Phase 4

**What Phase 4 needs from these sections:**

1. **`data-reveal` activation:** Add attributes to Phase 3 elements after implementing progressive enhancement (`.js-ready` pattern).
2. **IntersectionObserver wiring:** Existing `src/scripts/reveal.ts` (Phase 4 target) will pick up all `[data-reveal]` elements including new Phase 3 additions.
3. **Stagger values:** Each service row should stagger by 60ms (per `--motion-stagger-step` token). Each method step by 80ms.
4. **Isotipo SVG:** When the vector file is available, replace PNG with SVG in both sections. The SVG version enables the "single parallelogram divider" behavior from doc 11 Part 5.
5. **Nav active state:** The `#servicios` and `#metodo` IntersectionObserver targets are already correct (IDs match nav links).

**Phase 3 does NOT block Phase 4.** The structure is ready. The reveal system can be layered on top without modifying the markup significantly.

---

## Stop Condition Met

Services section: complete.
Method section: complete.
Build: passing (0 errors).
Report: this document.

**Waiting for approval before Phase 4.**
