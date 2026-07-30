# Verk — Visual Direction

---

## Reference Findings Used

| Reference | Contribution |
|---|---|
| **Basic/Dept** | Dark section logic, noise grain texture, stagger entrance motion, floating nav, full-width editorial rhythm |
| **Bakken & Bæck** | Whitespace philosophy (0.79 ratio), large-bold-headings, marquee text, video sections, mega-footer structure |
| **Instrument** | Clip-path shapes, gradient accents, card hover patterns, pill badges, glassmorphism used sparingly |
| **Studio Freight** | Smooth scroll foundation, section dividers, blend modes, uppercase accent labels, high-contrast pacing |

---

## Visual Principles

1. **Intention over decoration.** Every visual element must earn its place. No gradients for decoration, no animations for surprise, no shapes without purpose.
2. **Contrast as structure.** The site should communicate through contrast — light sections vs dark sections, small text vs large text, still moments vs motion moments.
3. **The isotipo as system.** The two parallelogram shapes from the brand identity should recur across the site as a geometric visual language — not as a watermark, but as a structural element.
4. **Space is content.** Generous whitespace is not emptiness. It is pacing, hierarchy, and confidence.
5. **Typography does the heavy lifting.** Headlines are not decorative. They are the primary visual event on each section.
6. **Motion is earned.** Animations respond to user attention, not ambient decoration. Things enter when you arrive at them. They don't loop aimlessly.
7. **Premium is felt, not announced.** Nothing on the page should say "we are premium." The execution should make it undeniable.

---

## Color Philosophy

### Primary Palette

| Token | Hex | Role |
|---|---|---|
| `--color-ink` | `#0F0F0F` | Primary text, dark sections, near-black (not pure black — slightly warm) |
| `--color-cream` | `#F0EEE9` | Background base (matches logo background — warm off-white) |
| `--color-accent-lime` | `#BFEA00` | Energy accent — CTAs, highlights, active states, conversion elements |
| `--color-accent-violet` | `#6B6AF4` | Technology accent — isotipo color, digital/AI elements, link accents |

### Secondary Palette

| Token | Hex | Role |
|---|---|---|
| `--color-surface-dark` | `#111111` | Dark section backgrounds |
| `--color-surface-mid` | `#1E1E1E` | Cards on dark backgrounds |
| `--color-grey-soft` | `#8C8C8C` | Secondary text, captions, metadata |
| `--color-border-light` | `rgba(15,15,15,0.10)` | Hairlines on light sections |
| `--color-border-dark` | `rgba(240,238,233,0.12)` | Hairlines on dark sections |

### Color Usage Rules

- **Light sections**: `--color-cream` background, `--color-ink` text
- **Dark sections**: `--color-surface-dark` background, `--color-cream` text
- **Accent lime**: reserve for CTAs, hover states, conversion moments, key numbers
- **Accent violet**: use for technology labels, isotipo appearances, digital/AI references
- **Never use both accents simultaneously in the same section** — they create visual conflict
- **Color transitions between sections**: alternating light/dark creates the rhythm Basic/Dept uses
- Suggested sequence: cream → dark → cream → dark accent → cream → dark (footer)

### Color and the Isotipo

The isotipo's two geometric shapes can shift color to match section context:
- On cream backgrounds: shapes in `--color-accent-lime`
- On dark backgrounds: shapes in `--color-accent-violet`
- As a large decorative element: shapes in very light opacity of either accent

---

## Typography Direction

### Font Strategy

**Primary typeface**: A geometric grotesque with moderate personality.

Recommended options (in priority order):
1. **Geist** (by Vercel) — free, modern, excellent rendering at all sizes, variable weight, designed for screens. Best choice for Astro/web projects.
2. **Neue Haas Grotesk** / **Aktiv Grotesk** — premium Swiss grotesque, excellent for studio positioning
3. **Supreme** — slightly humanist, good personality for brand studios
4. **Inter** — fallback only if performance is a concern

**Secondary typeface (labels/mono)**: Geist Mono or similar, for metric labels, code snippets, and technical callouts.

### Type Scale Philosophy

- Headlines should be **large and confident** — not decorative, but editorial
- No headlines under `2.5rem` for section-level headings
- Hero headline: `clamp(3.5rem, 2rem + 8vw, 9rem)` — fills the viewport without breaking mobile
- Body copy: `1rem–1.125rem`, line-height `1.6–1.7` for comfortable reading
- Labels: uppercase, tracked, small — used for section identifiers, not for general copy

### Typography Hierarchy

| Level | Usage | Size Range | Weight |
|---|---|---|---|
| Display | Hero headline | 72px–144px | 700–800 |
| H1 | Section headline | 40px–72px | 600–700 |
| H2 | Sub-section headline | 28px–48px | 500–600 |
| H3 | Card/item headline | 20px–28px | 500 |
| Body | Paragraphs | 16px–18px | 400 |
| Caption | Image captions, metadata | 12px–14px | 400 |
| Label | Section tags, pill badges | 10px–12px | 500, tracked |

### Specific Type Treatments

- **Hero text**: Full-width, split across 1–2 lines, left-aligned or centered depending on section type. Never centered AND in a narrow column.
- **Section labels**: Uppercase, 11px, `letter-spacing: 0.12em`, in grey or accent color — used above headlines to give context (`SERVICIOS`, `PROCESO`, `SISTEMAS`)
- **Running text**: Left-aligned, 60–70 character line length maximum
- **Large pull quotes**: Italic variant or a distinctly larger weight, full-width

---

## Layout Rhythm

### Grid System

- **Base grid**: 12 columns, 24px gutters
- **Max width**: 1440px centered
- **Section padding**: `padding-inline: clamp(24px, 5vw, 80px)` — fluid edge margins
- **Section vertical padding**: `clamp(80px, 10vw, 160px)` min/max

### Section Types

| Type | Width | Padding | Use case |
|---|---|---|---|
| Full-bleed | 100vw | None | Hero, video sections, dark transitions |
| Container | max 1280px | Standard | Text content, service cards |
| Mixed | Full-bleed bg, container content | Standard | Most sections |
| Narrow | max 680px | Standard | Long-form text, manifesto |
| Wide | max 1440px | Standard | Gallery, card grids |

### Column Patterns (from Instrument analysis)

- `1-col`: Full-width editorial (hero, CTA)
- `2-col equal`: Two services or two concepts side by side
- `2-col 60/40`: Text + supporting visual
- `3-col`: Service cards
- `4-col`: Statistics, small features
- `asymmetric`: Main content + sidebar label (classic studio layout)

---

## Section Pacing

The page should breathe like a conversation — not like a brochure.

Recommended sequence for homepage:
1. **Hero** — Full viewport, immersive, maximum whitespace around headline
2. **Problem statement** — Narrow text, slow moment, reader attention
3. **Services** — Structured grid, slightly denser
4. **Process** — Linear, step-by-step, anchored left
5. **Systems / Work** — Dark section, visual-heavy, editorial
6. **Sectors** — Logo or type-only wall, quick scan
7. **Difference** — Two columns, comparison or manifesto tone
8. **CTA** — Full-bleed dark, maximum contrast, single action
9. **Footer** — Editorial, information-dense, considered

**Key rule from Basic/Dept**: Sections alternate between dense and sparse. After a full-width image section, a text-only section. After a text-heavy section, an open section with a large number or statement.

---

## Use of Negative Space

- Padding around headlines should be generous — not touching the viewport edge
- Cards should breathe within their grid — 24px gap minimum, 32px preferred
- The area around the logo in the header should have clear breathing room
- "Empty" sections are valid — a section with only a large number or a single sentence is high-impact
- Do not fill every vertical inch. Scrolling through whitespace creates anticipation.

---

## Borders and Hairlines

- Use hairlines (1px) in `--color-border-light` or `--color-border-dark` for subtle structure
- Borders on cards: only in dark sections, minimal
- Dividers between sections: rarely used — let spacing do the work instead
- When dividers appear, they should be hairlines at full width, not thick bars
- Instrument uses clip-path dividers — the isotipo shapes can serve this function for Verk

---

## Use of Geometric Shapes (Isotipo System)

The two parallelogram shapes from the Verk identity are **the primary geometric element** of the visual system.

### How to use them:

1. **As a section accent**: A single shape in lime or violet, very large (400px+), clipped at the edge, behind text. Seen on dark sections.
2. **As a divider**: The shapes can split two sections diagonally, functioning as a visual transition.
3. **As a motion element**: On scroll, the shape slides in or rotates slightly — not distracting, just alive.
4. **As a background pattern**: Very low opacity repetition of the shapes can texture a section.
5. **As an animation target**: The isotipo can animate as a page loader, cursor effect, or entrance element.
6. **Never**: Do not overuse. Maximum one prominent shape appearance per 3 sections.

---

## Imagery Style

- **No stock photography of "business people smiling at laptops"**
- Preferred imagery types:
  - Product screenshots at high quality (mockups, device frames)
  - Abstract system visualizations (data flows, grid structures)
  - Behind-the-scenes of real work (code, interfaces, diagrams)
  - Architecture/texture photography for background sections
  - Brand identity mockups and system demonstrations
- When showing work: use controlled, minimal device frames — not floating mockup generators
- For sections without a specific project to show: typography as image — large, editorial, full-bleed text

---

## Background Style

- **Light sections**: `#F0EEE9` (warm cream — not pure white)
- **Dark sections**: `#111111` (near-black — not pure black)
- **Noise grain texture**: Subtle SVG or CSS noise overlay on dark sections (inspired by Basic/Dept) — adds tactility without weight
- **No gradients as backgrounds** — if gradients, they should be extremely subtle (5% shift, same hue)
- **Video backgrounds**: Muted, looped, ambient — for hero only. Must have a solid fallback.

### Noise Grain Implementation
```css
.dark-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,...");
  opacity: 0.04;
  pointer-events: none;
}
```

---

## Light vs Dark Sections

| Section | Background | When to use |
|---|---|---|
| Hero | Cream OR dark (alternate per project) | Opening statement |
| Problem | Cream | Intimate, text-focused reading moment |
| Services | Cream | Structure, cards, clarity |
| Process | Dark | Contrast, authority, emphasize the work |
| Systems/Work | Dark | Portfolio/capabilities, maximum visual impact |
| Sectors | Cream | Quick scan, logos or text |
| CTA | Dark | Maximum contrast, conversion moment |
| Footer | Dark | Closes the dark CTA naturally |

Avoid switching more than twice in 2 consecutive sections — it becomes chaotic.

---

## What to Borrow from Each Reference

### From Basic/Dept
- Dark theme sections with noise grain texture overlay
- Stagger entrance animation system (500ms start, ~60ms steps between elements)
- Floating transparent navigation
- Full-screen section pacing with dramatic variation
- Pinned scroll sections for complex reveals
- CTA footer with form

### From Bakken & Bæck
- Whitespace confidence — long stretches of nothing are intentional
- Large-bold-headings as primary visual system
- Horizontal marquee text for social proof, capabilities, or sector tags
- Video sections (loop, muted) for demonstrating motion and work
- Mega-footer editorial structure
- Stagger on image grids (200ms steps)

### From Instrument
- Clip-path shapes for section transitions — the isotipo shapes serve this role perfectly for Verk
- Interactive card hover states (subtle lift, border reveal)
- Pill badges for service tags, technology labels
- Gradient accents used sparingly on dark sections
- Card grid with varied card sizes

### From Studio Freight
- Lenis smooth scroll as foundational layer
- Section dividers as punctuation
- Blend-mode image effects for texture
- Uppercase tracking on accent labels
- Interaction-focused micro-animations (hover reveals, subtle transforms)

---

## What NOT to Borrow

### From Basic/Dept
- Their specific portfolio grid structure (Verk has different content needs)
- Their SctoGroteskA font identity (use Geist instead for screen optimization)
- Their exact color palette (their dark is warmer brown — Verk's is cooler)

### From Bakken & Bæck
- Their Scandinavian passivity — Verk needs more energy and conversion intent
- Their Font Awesome icon system (Verk should use custom SVGs or minimal icons)
- Their footer mega-density (Verk's footer should be editorial, not a sitemap)

### From Instrument
- Their 3D WebGL experiments — too heavy for V1, not aligned with Verk's market
- Their corporate density (Instrument has 70/100 density — Verk targets ~40/100)
- Their corporate "structured professionalism" framing — Verk is a studio, not a corporation

### From Studio Freight
- Their overall raw/experimental aesthetic — Verk needs to convert real business clients
- Their minimal-social footer — Verk needs more substantial footer presence
- Their uppercase-only heading system — use as an accent, not the primary heading style
