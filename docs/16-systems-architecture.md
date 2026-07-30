# Verk — Systems Section Architecture
> Phase 4A, Part 1 — Companion document to `docs/project-content/*.md`.
> This document is the synthesis layer: it decides what the nine systems collectively prove,
> in what order they should be shown, what to call the section, how to describe their state,
> and how to draw their architecture — before any Astro component is written.
>
> Authority: doc 11 > doc 15 > this document. Where this document makes a call doc 11 doesn't
> cover (section title, state language), the decision is made here and becomes the standard
> going forward, the same way doc 11's label system became the standard in Phase 3.

---

## Part 1 — The Capability Taxonomy

The brief's instruction: ignore project names, ignore technologies, ignore clients. Read the
nine systems again and find what they collectively prove. A visitor should leave remembering
capabilities, not a list of nine names.

Six capabilities recur across the nine systems:

### 1. Distributed Systems Engineering
Queues, workers, retries, asynchronous processing, failure recovery treated as the default
operating condition, not an edge case.
**Primary evidence:** Sonoro. **Secondary:** DocLink (microservices), CleanSolarAus (pipeline).

### 2. AI as Production Infrastructure
AI as a working component inside a pipeline that has to run correctly every day — not a demo
feature bolted onto a landing page.
**Primary evidence:** CleanSolarAus (Claude writes and QAs production content daily).
**Secondary:** Sonoro (TTS narration), DocLink (scoring/enrichment), PRISMA (curatorial scoring).

### 3. Original Knowledge Architecture
Inventing a taxonomy or a structured way of understanding a domain, rather than adopting an
existing one.
**Primary evidence:** PRISMA (visual taxonomy of cinema).
**Secondary:** UX Analyzer (structured design research), CleanSolarAus (topical authority model).

### 4. Platform-Level Business Systems
Multiple independent services — prospecting, billing, portals, generation — connected into one
coherent commercial platform.
**Primary evidence:** DocLink. **Secondary:** Sonoro (subscription/usage layer).

### 5. Long-Term Product Thinking
Mobile-first products built as ongoing software, not as a one-time deliverable: real-time state,
permissions, game feel, privacy architecture.
**Primary evidence:** Riot. **Secondary:** Bufón (interaction/game feel), Bloom Undies (privacy-first restraint).

### 6. Client Execution & Craft
Translating brand strategy into a production interface for a real business, under real
constraints, including the discipline to fully redesign when the first direction wasn't right.
**Primary evidence:** WATERLÜ.

Every one of the nine systems appears in at least one capability as primary or secondary
evidence. No system is included that doesn't serve this taxonomy — this is why the section can
scale past nine: new systems slot in as additional evidence for an existing capability, or, rarely,
introduce a seventh.

---

## Part 2 — Project Ranking

**Ranked by how effectively each system communicates Verk's engineering capability — not
by completion, date, or favorites.**

| Rank | System | Why here, not elsewhere |
|---|---|---|
| 1 | **Sonoro** | The single deepest piece of end-to-end evidence: distributed processing, AI in production, 700+ tests, resilience-first design. Leads because it alone answers "can they actually build complex systems?" without needing the rest of the section. |
| 2 | **DocLink** | Widens the claim from "one deep system" to "connects multiple systems into a business platform" — directly extends Verk's own positioning (systems, not sites) to a client-facing case. |
| 3 | **PRISMA** | Shifts the register from infrastructure depth to intellectual originality — proof that Verk designs new ways of thinking about a domain, not just new backends. |
| 4 | **UX Analyzer** | *(Updated Phase 4B)* The explanation of how Verk thinks, placed right after the three deepest production systems and before returning to another one — an internal tool with no logo and no public URL, functioning as the section's pivot: proof of process before more proof of output. |
| 5 | **CleanSolarAus** | Returns to production evidence with the clearest example of self-sustaining, unattended infrastructure — a distinct capability (things that keep running without Verk) from one-time builds. |
| 6 | **Riot** | Opens the product-thinking cluster: real-time, permissioned, consumer-scale mobile architecture. |
| 7 | **Bufón** | Follows Riot with the most experiential capability in the set — game feel and emotional rhythm as an engineered layer, not a visual afterthought. |
| 8 | **Bloom Undies** | Pre-launch and the least infrastructurally dense system, but retained deliberately to prove restraint is also a Verk capability, not only technical spectacle. |
| 9 | **WATERLÜ** | Closes deliberately, not by default. After eight systems of "we can build this," WATERLÜ is the "and we ship this for real clients, on real deadlines, with real iteration" closing argument. |

**What this ordering is not:** chronological, alphabetical, or "best portfolio piece first." Sonoro
and WATERLÜ are arguably the two most *finished* pieces of work, but they anchor opposite ends
of the section for different reasons — one opens on engineering depth, the other closes on
delivery discipline. UX Analyzer, the least "impressive" by conventional portfolio logic (no
public URL, no logo), sits fourth — immediately after the three most output-dense systems and
immediately before another production system — because its narrative role (proof of process)
lands hardest right at the point a reader might start assuming Verk is only about shipped output.

---

## Part 3 — Section Title

The brief rules out Projects, Portfolio, Work, and Case Studies — all of which read as agency or
gallery vocabulary, the exact register doc 11 and doc 12 spend two documents rejecting.

**Twenty-two candidates, scored 1–10 on: Distinctiveness, Fit with Verk's declarative voice,
Clarity to a visiting business owner, Fit with the existing one-word label convention
(`Servicios`, `Método`), Scalability as a container for 10–100 systems.**

| # | Candidate | Verdict |
|---|---|---|
| 1 | Sistemas | Strong — see scoring table below |
| 2 | Sistemas Construidos | Two words, redundant with taxonomy already named "sistemas" elsewhere |
| 3 | Sistemas en Producción | "Producción" reads as generic tech jargon |
| 4 | Infraestructura | Already used in the hero label ("Infraestructura Digital") — redundant, dilutes both |
| 5 | Infraestructura Digital | Same redundancy, worse — duplicates the hero label exactly |
| 6 | La Obra | Too abstract for a section that must communicate concretely; overloads the brand's own name for its philosophy |
| 7 | El Archivo | Evidence-coded, but reads as a museum/gallery — the brief explicitly bans that register |
| 8 | Archivo de Sistemas | Same problem, longer |
| 9 | Sistemas Operativos | Unintentional double meaning with "operating systems" — confusing, not clever |
| 10 | Evidencia | Too meta — tells the visitor "this is evidence" instead of letting the systems demonstrate it |
| 11 | La Evidencia | Same problem |
| 12 | Sistemas en Marcha | Close, but "en marcha" softens the declarative tone |
| 13 | Lo Construido | Viable — considered below |
| 14 | Lo que Construimos | Breaks the one-word convention, reads as a sentence fragment |
| 15 | El Laboratorio | Wrong connotation — implies experimental/unproven, undercuts systems that are Operativo |
| 16 | Laboratorio | Same issue |
| 17 | Sistemas Reales | "Reales" is defensive — implies a doubt ("as opposed to fake ones") that doesn't need naming |
| 18 | Bitácora de Sistemas | Too precious, sounds like a blog/changelog |
| 19 | Registro de Obra | Bureaucratic register — "registro" reads like a filing cabinet |
| 20 | Obra Construida | Redundant — "obra" already implies construction |
| 21 | Sistemas en Operación | Accurate but clinical, loses the one-word economy |
| 22 | El Taller | Implies craft/workshop register — undersells the engineering depth of Sonoro/DocLink |

**Finalist scoring:**

| Candidate | Distinctiveness | Voice Fit | Clarity | Label Convention Fit | Scalability | **Total** |
|---|---|---|---|---|---|---|
| **Sistemas** | 8 | 10 | 8 | 10 | 9 | **45** |
| Lo Construido | 7 | 8 | 6 | 8 | 8 | 37 |
| La Obra | 9 | 8 | 5 | 6 | 8 | 36 |
| El Archivo | 8 | 7 | 6 | 7 | 8 | 36 |
| Sistemas en Producción | 7 | 8 | 7 | 6 | 7 | 35 |

### Winner: Sistemas

Not chosen for novelty — chosen because it is the exact word the hero already used
("**Construimos sistemas**, no sitios") and the exact convention Services and Method already
established: one Spanish noun, capitalized only by the label's uppercase styling, functioning as
both the nav anchor and the section identity. `Servicios`. `Método`. `Sistemas`. The section
doesn't need a clever title — it needs to complete a sentence the hero already started. Every
other candidate either duplicates existing copy (Infraestructura), overreaches into the brand's
own philosophy vocabulary (La Obra), or drifts into gallery/archive language the brief
explicitly forbids.

The section label is **Sistemas**. *(Updated Phase 4B)* The headline is locked as:

> **El problema cambia.**
> **El método no.**

Two short fragments, period-terminated, matching the Services/Method two-line headline
convention exactly. It was chosen over the brief's own directional examples ("Cada sistema
empezó con un problema.", "Nueve sistemas. Una misma forma de construir.") because it does not
repeat the word "sistema" directly beneath a label that already says "Sistemas" — repeating the
label word in the headline reads as redundant, the way "Servicios" is never followed by a
headline that says "servicios" again. It also creates a deliberate callback to the `Método`
section a visitor has already read, tying the two sections together without naming either one.
The placeholder headline "La obra en progreso" is retired.

---

## Part 4 — State Language

Replacing Completed / In Progress / Draft with a coherent, brand-specific vocabulary — same
discipline as the capability taxonomy: it must be legible without explanation and consistent
enough to scale.

| State | Meaning | Applies when |
|---|---|---|
| **Operativo** | Live, running, serving real users or producing real output unattended | The system is in production and doesn't need Verk (or the client) to intervene for it to keep working |
| **En Evolución** | Live, and actively growing new capability | The system is in production but its architecture or feature set is still expanding by design |
| **Investigación** | Internal, process-facing, no public interface | The system exists to inform how Verk builds, not to be used by an external audience |
| **Desarrollo Activo** | Pre-launch or being substantially rebuilt | The system is not yet, or not currently, live for its intended audience |

*(Updated Phase 4B: "En Construcción" renamed to "Desarrollo Activo" — "construcción" sits too
close to Verk's own construction vocabulary ("La Obra", "construimos sistemas") and risked
reading as a brand pun rather than a status. "Desarrollo Activo" keeps the same meaning without
borrowing a word the brand uses for itself elsewhere.)*

### Mapping

| System | State |
|---|---|
| Sonoro | Operativo |
| DocLink | En Evolución |
| PRISMA | En Evolución |
| UX Analyzer | Investigación |
| CleanSolarAus | Operativo |
| Riot | En Evolución |
| Bufón | En Evolución |
| Bloom Undies | Desarrollo Activo |
| WATERLÜ | Operativo |

Four states, not three, and not the generic pair (live/not live) — because "En Evolución" is the
state that does the most narrative work: it tells a visitor the system is real *and* still being
pushed forward, which is true of five of the nine systems and is a meaningfully different claim
from either "finished" or "in progress."

---

## Part 5 — Architecture Visual Language

*(Revised Phase 4B.)* Stage 1 proposed a single fixed six-name vocabulary (Presentation → Logic
→ Processing → Storage → Infrastructure → AI) applied to every system with gaps where a layer
didn't exist. Phase 4B's implementation brief correctly overrides this: forcing every system
through the same six names is itself a template, even with gaps allowed. A system's architecture
strip should use whatever layer names actually describe how *that* system works — Sonoro's real
flow is Presentation/Logic/Processing/Storage/Infrastructure/AI, but WATERLÜ's real flow is
Presentation/Interaction/Infrastructure, and UX Analyzer's is Automation/Analysis/Output. Those
are different sentences, not the same sentence with words missing.

Rules (revised):
- The `ArchitectureStrip` component takes an ordered list of `{ layer, detail }` pairs of any
  length and any label — there is no fixed enum of layer names.
- Layer names are chosen per system to describe its actual flow, in the technical/mono register
  per doc 11 Part 6 (short, English technical nouns — matching Verk's existing convention of
  Geist Mono for anything technical, distinct from the Spanish editorial voice around it).
- The layers are drawn in a single connected strip, left to right on desktop and top to bottom
  on mobile, in the order a request actually moves through the system. A reader who knows none
  of the named technologies should still be able to read the sentence the strip is making.
- Three to six layers is the expected range. Below three, the strip stops communicating a flow;
  above six, it stops being legible at a glance.

Per-system layer mapping (used directly by the `ArchitectureStrip` component in Stage 2):

| System | Layers (in order) |
|---|---|
| Sonoro | Presentation (Astro, React Islands) → Logic (FastAPI) → Processing (Redis, async workers) → Storage (PostgreSQL, S3) → Infrastructure (Stripe billing) → AI (Google TTS) |
| DocLink | Presentation (Next.js, Astro) → Logic (FastAPI microservices) → Automation (automation engine) → Storage (PostgreSQL, Supabase) → Infrastructure (Railway, Clerk, Paddle) → AI (scoring & enrichment engines) |
| PRISMA | Presentation (Astro, SSR) → Data (Supabase auth & APIs) → Enrichment (Python pipeline + AI scoring) → Storage (PostgreSQL) |
| UX Analyzer | Automation (Playwright) → Analysis (Gemini visual analysis) → Output (structured JSON, Markdown, screenshots) |
| CleanSolarAus | Research (Python agents, Search Console) → Writing (Claude Sonnet 4.5) → Deployment (GitHub Actions → Cloudflare Pages, daily, unattended) |
| Riot | Presentation (Flutter, feature-first) → Realtime (Firestore, Cloud Functions) → Access Control (Firebase Auth, Security Rules, QR check-in) |
| Bufón | Presentation (Flutter, Riverpod) → Realtime (Firestore: rooms, rounds, voting) → Experience (audio, haptics, timed reveal) |
| Bloom Undies | Presentation (Flutter, Clean Architecture) → Storage (Hive, local, encrypted) → Roadmap (Firebase + Gemini moderation, planned) |
| WATERLÜ | Presentation (Astro, Tailwind, GSAP) → Interaction (Netlify Forms, scroll-driven storytelling) → Infrastructure (Netlify, GitHub CI/CD) |

---

## Part 6 — Scalability Model

The section is a **row list**, not a grid or a card wall — identical in structural principle to
`Services.astro` and `Method.astro`: full-width entries, hairline-separated, one entry given a
dark-inset treatment for hierarchy. This is the direct answer to the brief's scalability
requirement:

- **Adding a 10th, 20th, or 100th system** means adding one more `SystemCard` row and one more
  `docs/project-content/*.md` file. No layout recalculation, no grid breakpoint math, no new
  component.
- **The dark-inset "featured" treatment is a position, not a fixed count.** Today it marks rank
  #1 (Sonoro). At 100 systems, it could mark the top 2–3 without changing the component's logic.
- **The `ArchitectureStrip` already tolerates variable layer counts** (Part 5), so future systems
  with different stacks don't require new component variants.
- **The capability taxonomy (Part 1) is the ceiling on visual variety, not the systems.** New
  systems either provide more evidence for one of the six existing capabilities, or — rarely —
  justify a seventh. The taxonomy, not the project count, is what determines whether the section
  still feels coherent at scale.

---

## Part 7 — What Happens Next

Per the brief's own stop condition: this document, together with the nine files in
`docs/project-content/`, is Stage 1 of Phase 4A. No Astro component is written until this is
approved. Stage 2 (`ProjectStatus.astro`, `ArchitectureStrip.astro`, `SystemCard.astro`,
`Systems.astro`, integration into `index.astro`, `docs/phase-4a-report.md`) begins only after
sign-off.
