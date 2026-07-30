# Verk — Site Architecture

---

## Reference Findings Used

| Reference | Architecture Evidence |
|---|---|
| **Basic/Dept** | 10-section homepage: hero → content → social-proof → content → blog → CTA → footer. CTA footer with form. Floating nav, 6 links. |
| **Bakken & Bæck** | 15 sections, mega-footer, gallery + content + CTA sequence. Video sections embedded mid-page. |
| **Instrument** | 16 sections: content → social-proof → content → social-proof → content → CTA → footer → features. 27 nav links (deep site). CTA footer with form. |
| **Studio Freight** | 5 sections, minimal — hero → content → footer. Single-purpose homepage. Minimal social footer. |

---

## Multi-Page vs Single-Page Decision

**Decision: Multi-page with smooth transitions.**

Reasoning:
- SEO requires separate indexable pages for each service and content type
- The target market (local León/Bajío businesses) will search for specific services ("agencia web León", "automatización WhatsApp empresas")
- Future content (case studies, blog) needs URL structure
- Astro is designed for multi-page — single-page would fight the framework
- Astro View Transitions makes multi-page feel like single-page

The site should feel like one continuous experience, but live on separate routes.

---

## V1 Sitemap

```
/                     → Home
/servicios            → Services overview
/trabajo              → Work / Systems portfolio
/metodo               → Method / About
/contacto             → Contact + Audit

Future:
/blog                 → Insights / Articles
/servicios/sitio-web  → Individual service pages
/servicios/automatizacion
/servicios/captacion
/trabajo/[slug]       → Individual project pages
/auditoria            → Standalone audit landing page (for Meta Ads)
```

---

## Navigation Structure

### Primary Nav (Pill — desktop)

```
[verk logo]  |  Inicio  Servicios  Trabajo  Método  |  [Hablar con nosotros →]
```

- 5 links maximum
- Logo on the left
- CTA on the right (lime accent)
- Center pill on dark background, fixed at top

### Mobile Nav

- Hamburger or minimal menu icon
- Full-screen overlay with large type links
- Each link animates in with stagger
- Close button top right
- Include WhatsApp CTA at bottom of mobile menu

---

## Homepage — Section Structure

The homepage is the primary conversion artifact. Every section has a job.

### Section 1: Hero

**Job**: Create immediate brand conviction and communicate what Verk does in one sentence.

```
Layout: Full viewport, dark section
Content:
  - [Label: INFRAESTRUCTURA DIGITAL]
  - Headline: "Construimos los sistemas
               detrás de los negocios modernos."
  - Subheadline: "Sitios rápidos, automatización y captación de leads
                  conectados a tu operación."
  - CTA: [Ver servicios] [Hablar con nosotros →]
  - Visual: Isotipo shapes (large, background) or ambient video loop
```

**Motion**: Stagger entrance (logo → label → headline → sub → CTAs). Start at 400ms.

---

### Section 2: El Problema

**Job**: Make the target client feel seen. Validate their pain.

```
Layout: Light section, narrow text (container-prose)
Content:
  - [Label: EL PROBLEMA]
  - Large pull quote or headline in 2 lines
  - 2–3 short paragraphs describing the reality of businesses
    still running on WhatsApp, spreadsheets, and slow sites
  - No CTA — just understanding
```

This section has no images, no cards, no grid. Just text and space. It builds trust through specificity.

---

### Section 3: Servicios

**Job**: Show what Verk builds. Convert interest into understanding.

```
Layout: Light or dark (alternate from section 2), card grid
Content:
  - [Label: LO QUE CONSTRUIMOS]
  - Headline: "Infraestructura completa,
               no piezas sueltas."
  - 6 service cards in a 2×3 or 3×2 grid:
    1. Sitio Web de Alto Rendimiento
    2. Sistema de Captación de Leads
    3. Automatización de Procesos
    4. Integración CRM / WhatsApp
    5. Herramientas con IA
    6. Auditoría Digital
```

Each card has: service name, 1-line description, icon or geometric accent.

---

### Section 4: Cómo Trabajamos

**Job**: Reduce objection. Show that Verk has a clear, fast method.

```
Layout: Dark section (if section 3 was light)
Content:
  - [Label: PROCESO]
  - Headline: "Claro. Rápido. Sin sorpresas."
  - 4 numbered steps:
    1. Diagnóstico — Entendemos tu operación actual
    2. Arquitectura — Diseñamos el sistema que necesitas
    3. Construcción — Construimos, conectamos y probamos
    4. Activación — Entregamos y te enseñamos a usarlo
```

Steps can animate in as a scroll-triggered sequence (GSAP ScrollTrigger, scrub).

---

### Section 5: Sistemas / Trabajo

**Job**: Demonstrate capability through real/prototype work.

```
Layout: Dark section, visual-heavy
Content:
  - [Label: SISTEMAS]
  - Headline: "Prototipos, experimentos
               y sistemas en producción."
  - 2–3 featured work cards (large, landscape)
  - [Ver todos los sistemas →]
```

Projects shown here: Waterlu, Prisma, experiments. Framed as "sistemas construidos" not "clientes servidos" (honest framing since these are prototypes).

---

### Section 6: Sectores

**Job**: Quick scan for target clients to self-identify.

```
Layout: Light section, minimal
Content:
  - [Label: SECTORES]
  - Headline or marquee of sectors:
    "Clínicas · Arquitectura · Inmobiliarias · Construcción · Servicios Profesionales · Despachos"
  - OR: A simple grid of sector names with micro-icons
  - 1-sentence positioning line below
```

---

### Section 7: La Diferencia

**Job**: Handle the "why Verk vs any other agency" objection.

```
Layout: Light or alternating columns
Content:
  - [Label: POR QUÉ VERK]
  - 2-column layout:
    Left: What others give you
    Right: What Verk builds
  - OR: 3 differentiator cards with short punchy statements
```

---

### Section 8: CTA Principal

**Job**: Convert. This is the primary conversion section.

```
Layout: Full-bleed dark section, maximum contrast
Content:
  - Headline: "¿Tu negocio necesita
               un sistema mejor?"
  - Subheadline: "Empieza con una auditoría gratuita."
  - Primary CTA: [Solicitar auditoría →]
  - Secondary CTA: [Escribir por WhatsApp]
  - Both CTAs clearly visible
```

The auditoría (free digital audit offer) is the primary lead capture mechanism.

---

### Section 9: Footer

**Job**: Provide navigation, reinforce brand, offer multiple contact paths.

See Footer Structure section below.

---

## CTA Strategy

### Primary CTA: Auditoría Digital Gratuita

The entry-point offer. A free digital audit removes the financial risk and gives Verk a conversation opportunity.

- Copy: "Solicitar auditoría gratuita"
- Destination: `/contacto#auditoria` or a dedicated `/auditoria` page
- Form: Name, business name, WhatsApp number, main challenge (dropdown)

### Secondary CTA: WhatsApp Directo

Many target clients prefer WhatsApp over forms.

- Copy: "Escribir por WhatsApp"
- Destination: `https://wa.me/[number]?text=[prefilled]`
- Pre-filled message: "Hola, me interesa saber más sobre [servicio]"
- Always visible alongside primary CTA

### CTA Hierarchy

1. **Hero**: [Ver servicios] + [Hablar con nosotros]
2. **After cada service card**: subtle "Saber más" link
3. **Post-process section**: [Empezar un proyecto]
4. **After work section**: [Ver todos los sistemas]
5. **Main CTA section**: [Solicitar auditoría] + [WhatsApp]
6. **Footer**: Contact form + navigation

---

## Footer Structure

Inspired by Bakken & Bæck mega-footer + Basic/Dept CTA footer with form.

```
FOOTER (dark section)
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  "¿Listo para construir                    [Nombre]            │
│   tu sistema digital?"                     [Email]             │
│                                             [Empresa]          │
│   verk                                      [WhatsApp]         │
│   CONECTAMOS. AUTOMATIZAMOS. CONSTRUIMOS.   [Mensaje breve]    │
│                                             [Enviar →]         │
│─────────────────────────────────────────────────────────────────│
│  Servicios           Trabajo        Empresa        Contacto    │
│  Sitio Web           Waterlu        Método         Auditoría   │
│  Automatización      Prisma         Blog           WhatsApp    │
│  Captación           Experimentos   Proceso                    │
│  CRM / Integ.                       Stack                      │
│  Herramientas IA                                               │
│─────────────────────────────────────────────────────────────────│
│  © 2025 Verk        León, Gto. · México       [LinkedIn] [IG]  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Conversion Flow

```
Visitor lands on homepage
         │
         ▼
Hero: Reads the headline. Understands what Verk does.
         │
         ▼
Problem section: "That's me." Validation.
         │
         ▼
Services: Browses. Identifies what they need.
         │
         ▼
Process: Comfort. Knows how it works.
         │
         ▼
Work: Sees evidence. Builds trust.
         │
         ▼
CTA: "Solicitar auditoría" — completes form
  OR: "Escribir por WhatsApp" — direct conversation
         │
         ▼
Contacto page / Auditoría form
         │
         ▼
Verk responds in <24h. Conversation begins.
```

---

## WhatsApp Flow

WhatsApp is a primary channel for the target market (León, México).

**Entry points:**
- Secondary CTA button on hero
- Floating WhatsApp button (bottom right, mobile-first)
- Footer contact column
- After each service description
- Mobile nav bottom section

**Pre-filled WhatsApp messages by context:**

| Context | Pre-filled text |
|---|---|
| General | "Hola, me interesa saber cómo Verk puede ayudar a mi negocio." |
| Web site | "Hola, quiero información sobre sitios web con Verk." |
| Automation | "Hola, me interesa automatizar procesos en mi empresa." |
| Audit | "Hola, quisiera solicitar la auditoría digital gratuita." |

**WhatsApp button implementation:**
```html
<a href="https://wa.me/52[number]?text=Hola%2C%20me%20interesa%20saber%20m%C3%A1s%20sobre%20Verk."
   class="whatsapp-btn"
   target="_blank"
   rel="noopener noreferrer">
  Escribir por WhatsApp
</a>
```

---

## Lead Audit Flow

The auditoría offer is the primary conversion mechanism.

**Form fields:**
1. Nombre / Name
2. Empresa / Business name
3. WhatsApp (preferred contact)
4. Sector (dropdown: clínica / arquitectura / inmobiliaria / construcción / servicios / otro)
5. Principal reto (dropdown: sitio web / captación / automatización / CRM / todo / no sé por dónde empezar)
6. Mensaje libre (optional)

**Post-submission:**
- Confirmation page with: "Recibimos tu solicitud. Te contactamos en menos de 24 horas."
- Trigger WhatsApp message to Verk (via Twilio/Make automation)
- Auto-reply email (if email provided)

---

## Individual Service Pages (Future — /servicios/[slug])

Each page follows this structure:

```
1. Hero — Service name + 1 sentence
2. Problem — What problem this service solves
3. Features — What's included (bullet list or cards)
4. Process — How delivery works for this service
5. Relevant work — Projects related to this service
6. FAQ — 3–4 questions specific to this service
7. CTA — Auditoría / WhatsApp
```

---

## Work / Systems Section (/trabajo)

The portfolio is framed as "sistemas construidos" — not a client list.

**Framing note:**
- Waterlu: "Sistema de captación y automatización [brief description]"
- Prisma: "Directorio cinematográfico con 10,000+ títulos, filtro por color, categorías automáticas"
- Sonoro: "Prototipo de SaaS para conversión de PDF a audiolibro"
- Doclink: "Infraestructura de marketing médico — experimento de captación"
- Internal experiments: "Automatizaciones, herramientas internas y prototipos técnicos"

**Each project card shows:**
- Project name
- Type (Directorio / SaaS / Automatización / Sistema de captación)
- Status (Activo / Prototipo / Experimento)
- 1–2 line description
- Visual (screenshot, interface mockup, or abstract visual)

---

## Possible Future Pages

| Page | Priority | Reason |
|---|---|---|
| `/blog` | V2 | SEO content for "automatización para clínicas", "sitio web rápido León", etc. |
| `/servicios/[slug]` | V1.5 | Better SEO for individual services |
| `/auditoria` | V1.5 | Standalone landing page for Meta Ads campaigns |
| `/trabajo/[slug]` | V1.5 | Individual project detail pages |
| `/clientes` | V2 | Once real client work exists |
| `/precios` | V2 | Optional — packages/pricing transparency |
| `/stack` | Later | Technical transparency page for tech-savvy clients |

---

## Language / i18n Architecture

### Recommendation for V1

**Default: Spanish. No prefix. No i18n routing in V1.**

Rationale:
- V1 commercial target is León/Bajío/México — 100% Spanish
- Adding i18n routing in V1 doubles content maintenance work
- The brand can feel internationally credible without English pages
- Astro's i18n routing (`/es/` and `/en/`) is easy to add in V1.5

### Preparation for bilingual in V1

Even without i18n routing, prepare the content architecture:

1. Store all copy in a single content object (not hardcoded in components):
```typescript
// src/content/home.ts
export const home = {
  hero: {
    label: 'INFRAESTRUCTURA DIGITAL',
    headline: 'Construimos los sistemas detrás de los negocios modernos.',
    sub: 'Sitios rápidos, automatización y captación de leads conectados a tu operación.',
  },
  // ...
};
```

2. When adding English in V1.5, the migration is: add a `/en/` prefix and swap the content object — no component refactoring required.

3. Navigation can include a subtle `ES / EN` toggle from day one (even if EN routes don't exist yet) — link it to a "coming soon" or redirect.
