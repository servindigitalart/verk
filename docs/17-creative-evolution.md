# Verk — Creative Evolution (Fase 5)
> Documento de Dirección Creativa. Rol: Director Creativo + Director de Arte + UX Lead.
> No es implementación. Es la propuesta que se debe aprobar antes de tocar una sola línea de código.
> Autoridad: doc 11 sigue siendo el lock. Este documento propone un **conjunto acotado de enmiendas**
> a doc 11 (marcadas explícitamente en la Parte 0) y, para todo lo demás, **ejecuta lo que doc 11 y
> doc 16 ya diseñaron pero nunca se construyó**. La mayoría de lo que se pide en el brief no es
> invención nueva — es terminar el plano.

---

## Parte 0 — Lo que encontré antes de proponer nada

Antes de diseñar dirección nueva, audité el sitio real (componentes, CSS, `index.astro`) contra los
documentos de marca (doc 11, doc 16, doc 04). Tres hallazgos cambian el diagnóstico del brief:

### Hallazgo 1 — El sitio no se siente estático por falta de ideas. Se siente estático porque el sistema de reveal nunca se conectó.

`src/scripts/lenis.ts` existe. `src/scripts/reveal.ts` — el que debía activar `[data-reveal]` vía
`IntersectionObserver` — **no existe**. `Layout.astro` nunca lo importa. Resultado concreto:

- La sección de Contacto/Auditoría en `index.astro` tiene `data-reveal` y `data-reveal="fade"` en
  cada elemento. `motion.css` define `[data-reveal] { opacity: 0; }` como estado inicial. Sin el
  observer, esa clase `.is-visible` nunca se agrega. **La sección completa es invisible en
  producción ahora mismo** — no despliega roto, simplemente no se ve.
- Servicios, Método y Sistemas fueron construidos **sin** `data-reveal` a propósito ("Phase 4 queue"),
  así que no tienen ninguna coreografía de entrada al hacer scroll. Aparecen de golpe, completos,
  en cuanto entran al viewport — sin excepción.
- El Hero sí tiene movimiento (secuencia de 6.5s), pero es el único momento de todo el recorrido
  donde algo se mueve.

Esto explica el "se siente demasiado estático" con precisión quirúrgica: no es una opinión de
dirección de arte, es la ausencia literal de un archivo. Activar el reveal system que doc 04 ya
diseñó (Parte 4 de este documento) es la mejora de mayor impacto por unidad de esfuerzo de todo el
brief.

### Hallazgo 2 — El header vivo ya está diseñado. Nunca se conectó al DOM real.

`docs/04-motion-interaction-system.md`, sección "Section Color Transitions (Scroll-Based)", ya
especifica exactamente el mecanismo pedido en el punto 2 del brief: un `data-scroll-theme` en
`<html>`, actualizado por un `IntersectionObserver` sobre `[data-theme]`, con CSS que invierte el
pill del nav. Nada de esto está en `Nav.astro` — el pill hoy es `rgba(17,17,17,0.90)` fijo, sin
importar qué sección esté detrás. Tampoco hay `transition` declarada sobre `background-color` en
`.nav-pill`, así que aunque se conectara hoy, el cambio sería un corte duro, no la transición
"mágica" que pide el brief.

El glass/blur ya existe (`backdrop-filter: blur(12px)` está en `.nav-pill` desde Phase 2A). La pieza
que falta no es material — es estado + transición.

### Hallazgo 3 — El isotipo-como-marca-de-agua es una de siete técnicas que doc 11 ya diseñó. Las otras seis nunca se construyeron.

Doc 11, Parte 5 ("Isotipo Behaviors"), ya especifica: dividers, patrones, máscaras, marcos, loaders,
comportamiento de motion, y "background systems" (el watermark plano). **Solo el watermark se
implementó** — y se implementó cinco veces (Hero, Services, Method, Systems, SystemEntry-featured),
siempre igual: PNG a 5–8% de opacidad, `mix-blend-mode: multiply`. Por eso se siente placeholder: no
es una decisión repetida con intención, es la única plantilla que existe, puesta en cinco lugares.

El brief pide "investigar nuevas formas" — la investigación ya está hecha, en un documento que este
mismo proyecto escribió. Lo que falta es la disciplina de construir 2–3 de esas siete técnicas con
calidad, en vez de repetir la octava vez la técnica más fácil.

### Hallazgo 4 — La sección Sistemas ya tiene una taxonomía. Es una taxonomía distinta a la que pide el brief.

Doc 16, Parte 1, organiza los nueve sistemas por **capacidad demostrada** (Ingeniería de Sistemas
Distribuidos, IA en Producción, Arquitectura de Conocimiento Original, etc.) — evidencia de que Verk
construye bien, no una categoría de producto. El brief de hoy pide organizar por **medio** (SaaS,
Herramientas IA, Apps Móviles, Sitios Web, Investigación) — cómo se ve el sistema, no qué prueba.

No son incompatibles, pero son dos ejes distintos y hay que decidir cuál gobierna la estructura
visual de la sección. Ver Parte 3.7 para la resolución propuesta.

---

## Parte 0.5 — Enmiendas explícitas a doc 11 (requieren tu aprobación consciente)

Doc 11 se llama a sí mismo "el lock". Estas son las únicas dos reglas donde el brief de hoy pide
algo que el lock actual prohíbe literalmente. Todo lo demás en este documento opera **dentro** de
doc 11, no en contra de él.

**Enmienda A — Rule 8 ("No gradient background appears anywhere on the site").**
El brief pide "gradientes casi imperceptibles". Propuesta: la regla se mantiene para gradientes
*decorativos* (dos colores de marca mezclándose como fondo visible — eso seguiría prohibido). Se
abre una excepción estrecha: un *vignette* radial de 2–4% de delta de luminosidad (ej. el centro de
una sección dark ligeramente más claro que sus bordes) para dar profundidad atmosférica sin que el
ojo perciba una transición de color. Esto es textura, no narrativa de color — la narrativa de color
la siguen cargando los tokens sólidos (Parte 1). Si prefieres mantener Rule 8 sin excepción, la
Parte 1 de este documento funciona igual usando solo superficies sólidas nuevas — lo digo explícito
porque es una decisión de marca, no técnica.

**Enmienda B — Repetición del isotipo como watermark plano.**
No es técnicamente una regla de doc 11 (el watermark es una de las siete técnicas sancionadas) —
pero significa retirar la técnica de 4 de sus 5 usos actuales. Se documenta aquí porque es una
reversión de una decisión ya implementada, no una adición.

Si no apruebas A o B, dímelo y esas dos partes se ajustan; el resto del documento no depende de
ellas.

---

## Parte 1 — Color como narrativa

**Problema real:** cada sección clara usa el mismo `--color-cream` (#F0EEE9) y cada sección oscura
usa el mismo `--color-surface-dark` (#111111). El sistema ya tiene `--color-surface-mid` (#1A1A1A)
y `--color-surface-card` (#1E1E1E) definidos — pero **ningún componente los usa hoy**. La riqueza
tonal ya existe en `global.css`; simplemente no se despliega.

**Propuesta — "temperatura por sección", no "sección por color":**

| Sección | Superficie hoy | Superficie propuesta | Por qué |
|---|---|---|---|
| Hero | `--color-cream` | Sin cambio | Es la superficie de apertura — debe ser la más neutra |
| Ticker | `--color-surface-dark` | Sin cambio | Banda utilitaria, no necesita atmósfera propia |
| Servicios | `--color-cream` | Nuevo token `--color-cream-warm` (≈#EDEAE3, -2% luminosidad) | Segunda superficie clara del recorrido — debe sentirse relacionada pero no idéntica al Hero |
| Método | `--color-surface-dark` | `--color-surface-mid` (#1A1A1A, ya existe) | Primer capítulo oscuro — un grafito, no el negro más profundo |
| Sistemas | `--color-cream` | Sin cambio (vuelve a la superficie de apertura) | Cierra el "acto claro" antes del clímax oscuro final — el regreso a cream es la respiración |
| Auditoría/CTA | `--color-surface-dark` | Nuevo token `--color-ink-deep` (≈#080808) | Debe ser el punto más oscuro de todo el sitio — el clímax de atmósfera antes del cierre |
| Footer | `--color-surface-dark` | Sin cambio | Vuelve al oscuro "neutro" — el CTA fue el pico, el footer es el descenso |

Esto crea tres actos de temperatura (claro → grafito → cream → negro profundo → oscuro neutro) en
vez de una alternancia binaria. Cada superficie nueva es un token sólido — cero gradientes salvo el
vignette opcional de la Enmienda A.

**Ruido:** ya existe en dark sections (doc 11 lo exige, 3.5% opacity). Propuesta: extenderlo también
a `--color-cream-warm` y `--color-ink-deep` a la misma opacidad — así el grano deja de ser "textura
de lo oscuro" y se vuelve "textura de la obra", presente en toda superficie nueva por igual.

---

## Parte 2 — Header vivo

**Se implementa el mecanismo que doc 04 ya diseñó, con dos adiciones para que se sienta "mágico":**

1. Cada `.section` recibe `data-theme="light|dark|feature"` (derivable directo de
   `.section-light`/`.section-dark` — no requiere reescribir componentes, solo agregar el atributo).
2. Un `IntersectionObserver` (nuevo `src/scripts/nav-theme.ts`) actualiza
   `document.documentElement.dataset.scrollTheme` según qué sección domina el viewport.
3. `.nav-pill` gana una tercera variante para superficies "feature" (el CTA final, Enmienda A) —
   ahí el pill no solo invierte color: adopta un tratamiento *glass* más pronunciado (blur 20px en
   vez de 12px, borde a `--color-lime` al 12% en vez del borde neutro) — la diferencia entre "el nav
   se adapta" y "el nav reconoce que estás en el momento decisivo".
4. **La pieza que falta hoy y que hace la diferencia entre "cambio brusco" y "elegante":** agregar
   `transition: background-color 500ms var(--ease-out-expo), border-color 500ms var(--ease-out-expo),
   backdrop-filter 500ms var(--ease-out-expo)` a `.nav-pill`. Hoy esa transición no existe — el
   pill nunca ha tenido nada que animar porque nunca ha cambiado de estado. Es una línea, pero es la
   línea que hace "mágico" el efecto en vez de un parpadeo.

Nada de esto toca el diseño del pill (posición, forma, contenido) — exactamente lo que pediste.

---

## Parte 3 — El isotipo

**Se retira** el watermark plano de Hero, Services, Method y Systems (4 de 5 instancias). **Se
conserva** una versión reducida en el Hero — ver 3.1 — porque ahí cumple una función que ninguna
otra técnica cumple igual de bien.

Tres técnicas nuevas, tomadas directamente de doc 11 Parte 5 (nada inventado desde cero):

### 3.1 — Hero: de "watermark" a "elemento con motion propio" (doc 11: "Idle state")
Se mantiene el shape en el lado derecho, pero dejar de ser una imagen estática: doc 11 ya especifica
un drift de 4px durante 8 segundos, loop, easing suave — el shape "respira" de forma casi
imperceptible en vez de estar simplemente ahí. Esto es la única instancia donde el isotipo permanece
como fondo — porque en el Hero, "está presente antes de que llegues" (Concepto 4) es literalmente el
punto, y el drift lo hace sentir vivo sin contradecir esa idea.

### 3.2 — Separador entre Servicios → Método (doc 11: "Dividers")
En vez de que cada sección tenga su propio watermark, un único shape del isotipo marca la costura
entre Servicios (cream) y Método (dark): posicionado flush al borde del viewport, en el color de la
sección hacia la que se transiciona (dark, para una transición light→dark). No es una línea — es el
borde del shape. Reemplaza tanto el watermark de Services como el de Method con un solo elemento que
vive en la costura, cumpliendo la función de los dos a la vez con más intención.

### 3.3 — Máscara en la sección de Sistemas (doc 11: "Máscaras")
El proyecto ancla de cada categoría (Parte 3.7) muestra su preview a través de un clip-path del
isotipo en vez del marco rectangular hairline que usan el resto de las filas — un tratamiento
reservado, no generalizado, para que siga siendo reconocible como "el proyecto que abre esta
categoría" sin rediseñar `ProjectPreview.astro` para las otras ocho filas.

### 3.4 — Hover del wordmark en el nav (doc 11: "Hover states")
Micro-detalle: al hacer hover sobre "verk" en el nav, drift de 2px en la trayectoria implícita de
los shapes (aunque el nav solo muestra el wordmark sin shapes hoy — esto se traduce a un desplazamiento
de 1-2px del texto mismo en esa dirección). Tan sutil que "se siente antes de verse", exactamente
como lo describe doc 11.

**Total: 4 apariciones intencionales, cada una una técnica distinta, en vez de 5 repeticiones de la
misma técnica.** Es menos, no más — y es exactamente lo que pediste ("cada aparición debe sentirse
intencional").

---

## Parte 4 — Hero

**No se destruye el Concepto 4.** Cambios quirúrgicos:

1. **Isotipo:** ver 3.1.
2. **Ritmo de reveal:** la secuencia actual tarda 6.5s en completarse (label 0.3s → línea 1 en 1.0s →
   línea 2 en 2.6s → sub en 4.2s → acciones en 5.5s → microcopy en 6.5s). Propuesta: comprimir las
   pausas entre línea 2 → sub → acciones de ~1.6s combinadas a ~1.1s combinadas — el microcopy llega
   a los 5.4s en vez de 6.5s. Sigue siendo "a ritmo de lectura", no se vuelve una animación de
   producto — solo deja de sentirse largo en los primeros segundos, que es donde más pesa la
   percepción de "vivo vs. estático" de un visitante nuevo.
3. **Microcopy demasiado pequeño** (brief, punto 11): `.hero-microcopy` está en `11px`. Propuesta:
   subir a `13px` (nuevo valor entre `--text-2xs` y `--text-xs`, o usar `--text-xs` directo —
   `clamp(0.75rem, 0.70rem + 0.25vw, 0.875rem)`, que ya existe en el sistema) — resuelve la queja sin
   inventar un token nuevo.
4. **Balance del espacio negativo:** el shape hoy vive a `right: -6%`, centrado verticalmente,
   detrás de un `.hero-content` con `max-width: 900px`. Con el drift de 3.1, no se toca el layout —
   el balance se ajusta con el motion, no con la composición, para minimizar riesgo sobre algo que
   "funciona muy bien".

---

## Parte 5 — Servicios: lenguaje visual entre las 4 disciplinas

**Problema real:** el `.service-row` de cada disciplina es idéntico salvo la fila de IA, que rompe a
un panel dark con pill violeta. Las otras tres no comparten ningún lenguaje visual que las conecte
entre sí.

**Propuesta — un riel conector, no cuatro tarjetas nuevas:**

Un elemento vertical delgado (1px, `--color-border-medium`) corre por el margen izquierdo de las
cuatro filas, atravesando los hairlines existentes en vez de reemplazarlos — visualmente convierte
"cuatro filas separadas por líneas" en "un sistema con cuatro nodos". En las primeras tres filas el
riel es neutro; al llegar a la fila de IA, el riel cambia a `--color-violet` en el tramo que
atraviesa esa fila — el mismo riel, un cambio de registro, exactamente como doc 11 ya usa el violeta
en todo lo demás ("violeta = inteligencia, y solo inteligencia"). Es la traducción visual literal de
la headline ya existente: "**Cuatro disciplinas. Un sistema.**" — el riel es el sistema; las filas
son las disciplinas.

Esto no requiere microdiagramas nuevos, iconografía nueva, ni tocar el copy — es una capa CSS sobre
la estructura de grid que ya existe.

---

## Parte 6 — Método: elevar sin romper el minimalismo

El copy, la jerarquía y el ritmo vertical ya funcionan (confirmado en el brief). Dos adiciones
pequeñas:

1. **Conector vertical entre números** (mismo principio que Parte 5): una línea de 1px conecta
   `01 → 02 → 03 → 04` verticalmente, con un punto (dot, 4px, `--color-cream` al 40%) en cada número
   — otra vez, tomando prestado el patrón visual del "lime dot" que ya existe en `.nav-link.is-active`
   (doc 11 ya usa dots como indicador de estado; aquí se reutiliza el mismo vocabulario en vez de
   inventar uno nuevo).
2. **El paso final (04, "Verificamos") recibe un acento sutil de lime** en el dot conector — el único
   lime de toda la sección — porque es el paso donde el sistema *funciona*, y lime en doc 11 significa
   exactamente eso: "algo está listo".

---

## Parte 7 — Sistemas: la reorganización

Este es el trabajo más importante del brief, y donde más hay que decidir con cuidado.

### 7.1 — Resolución del conflicto de taxonomía (Hallazgo 4)

Propuesta: **el medio gobierna la macro-estructura visual** (lo que pide el brief hoy — categorías
como "Sitios Web", "Apps Móviles", "Herramientas IA", "Investigación"); **la capacidad
(doc 16 Parte 1) sigue viviendo dentro de cada fila**, exactamente como hoy — vía
`CapabilityLabel.astro`, que ya existe y ya funciona. No se pierde nada del doc 16: solo se le
agrega un nivel de agrupación por encima.

Mapeo propuesto de los 9 sistemas + Los Fibos a categorías de medio:

| Categoría | Sistemas |
|---|---|
| **Plataformas / SaaS** | Sonoro, DocLink, PRISMA |
| **Herramientas con IA** | CleanSolarAus, UX Analyzer |
| **Apps móviles** | Riot, Bufón, Bloom Undies |
| **Sitios web** | WATERLÜ, **Los Fibos** (nuevo) |
| **Investigación** | *(UX Analyzer ya está arriba — si prefieres que Investigación sea su propia categoría en vez de vivir bajo "Herramientas con IA", dímelo; ahora mismo es el único sistema en estado `Investigación`, así que una categoría de un solo elemento se siente delgada — mi recomendación es dejarlo bajo IA y que el estado `Investigación` (ya existente en `ProjectStatus.astro`) siga marcando la distinción)* |

### 7.2 — Qué NO cambia dentro de cada categoría
El orden de ranking de doc 16 Parte 2 (por fuerza de evidencia, no por fecha) se conserva **dentro**
de cada categoría. Sonoro sigue abriendo — ahora abre su categoría ("Plataformas / SaaS") en vez de
abrir la sección entera. WATERLÜ sigue cerrando — ahora cierra su categoría.

### 7.3 — Tratamiento por categoría, sin perder consistencia editorial
Cada categoría recibe: un mini-header (label + nombre de categoría, mismo `.text-label` que ya usa
todo el sitio) y **un acento de color propio, tomado de tokens que ya existen** — no colores nuevos:

| Categoría | Acento |
|---|---|
| Plataformas / SaaS | `--color-violet` (ya es "inteligencia/proceso" en doc 11 — encaja con Sonoro/DocLink/PRISMA siendo los sistemas más complejos) |
| Herramientas con IA | `--color-violet` también, pero vía el pill `kind="ai"` que ya existe — no se duplica el significado, se reutiliza |
| Apps móviles | Neutro (`--color-grey-soft`) — son producto, no infraestructura ni inteligencia; no les corresponde ni lime ni violeta bajo la ley de color de doc 11 |
| Sitios web | Neutro también |

Nota importante: **no se inventa un quinto color.** Doc 11 es explícito en que lime = acción y
violeta = inteligencia, sin excepción. Darle a cada categoría "su propio color" (como sugiere el
brief textualmente) violaría esa ley directamente. La propuesta logra la diferenciación por
categoría vía **tipografía, densidad y estructura** (7.4), no vía una paleta expandida — eso es
"organizar la riqueza", no "esconderla", que es exactamente lo que pediste.

### 7.4 — Stack: pills reales, no texto plano
Hoy `ArchitectureStrip` muestra `detail` como texto plano (ej. "Astro, React Islands"). Propuesta:
tokenizar ese string en pills individuales (una pill por tecnología: `Astro`, `React Islands`) dentro
de cada `arch-cell` — mismo componente `.pill` que ya existe en el sistema (`pill-default`), sin
crear un componente nuevo. El resultado: la tira de arquitectura pasa de "una oración técnica" a "un
sistema de capas con tecnologías nombrables", que es literalmente lo que pediste ("pills,
agrupaciones, tecnologías, capas... debe sentirse como un sistema").

### 7.5 — Interacción: construir, no acordear
Se conserva `<details>/<summary>` como base (accesible, cero JS, no se toca por razones de a11y) pero:
- La apertura deja de ser el snap instantáneo nativo del navegador. Se anima con CSS
  `grid-template-rows: 0fr → 1fr` (técnica moderna, sin JS) a 400ms `--ease-out-expo`.
- Dentro del contenido revelado, las celdas de `ArchitectureStrip` entran con un stagger de 60ms
  cada una (mismo token `--motion-stagger-step` que ya existe) — el sistema literalmente "se
  construye" celda por celda al abrir el proyecto, en vez de aparecer completo de golpe. Esta es la
  traducción directa de "que explorar proyectos sea divertido" sin inventar un patrón de interacción
  nuevo — es coreografía sobre la estructura existente.

### 7.6 — Los Fibos (nuevo, décimo sistema)

Logo confirmado en `public/project-logos/fibos/isonegro.png`. Con base en el contexto entregado,
propuesta de contenido siguiendo exactamente el mismo molde editorial que los otros 9 (mismo largo,
mismo tono, misma estructura problem/system/howItWorks/whyItMatters):

```
name: Los Fibos
status: Operativo
category: Sitios web
problem: "Una banda necesita una tienda real, no un enlace a Instagram para vender mercancía."
system: "Un sitio editorial con e-commerce integrado, construido para sentirse como un fotolibro,
         no como una plantilla de Shopify."
howItWorks: "Astro con Islands Architecture — componentes estáticos y las pocas islas de React
             donde hay interacción real. Pagos con Stripe, correo transaccional con Resend, base
             de datos PostgreSQL en Neon vía Drizzle."
whyItMatters: "Prueba que Verk entrega e-commerce real — catálogo, variantes, inventario,
               checkout — sin depender de una plataforma externa."
capabilities: [{ label: 'Ejecución real' }]  // mismo capability que WATERLÜ — ambos son
                                              // "entregamos con disciplina para un cliente real"
layers: [
  { layer: 'Presentation', detail: 'Astro, React Islands' },
  { layer: 'Data', detail: 'PostgreSQL (Neon), Drizzle ORM' },
  { layer: 'Commerce', detail: 'Stripe, checkout integrado' },
  { layer: 'Infrastructure', detail: 'Netlify, GitHub CI/CD, funciones serverless' },
]
logoSrc: /project-logos/fibos/isonegro.png
size: lg  // mismo tamaño que WATERLÜ — comparten categoría y rol de cierre de su capacidad
```

Se posiciona como el segundo sistema de la categoría "Sitios web", después de WATERLÜ — ambos
comparten el capability "Ejecución real", así que juntos cierran esa categoría con dos pruebas en
vez de una.

---

## Parte 8 — CTA Final (Auditoría)

Hoy: un placeholder de 15 líneas, invisible por el Hallazgo 1 (data-reveal roto), sin ninguna
identidad propia más allá de "sección oscura con botón".

**Propuesta de concepto:** esta sección se convierte en el punto más oscuro de todo el sitio
(`--color-ink-deep`, Parte 1) — el clímax atmosférico que hace que el footer, inmediatamente
después, se sienta como un descenso, no como "más de lo mismo oscuro".

Estructura:
1. **Label:** "Diagnóstico" (ya existe en el copy actual — se conserva).
2. **Headline de dos actos**, no una sola oración — el primero reconoce lo que el visitante ya vio,
   el segundo invita: algo en el registro de *"Ya viste cómo pensamos."* / *"Ahora construyamos el
   tuyo."* — mismo patrón de dos líneas cortas que ya usan Hero, Servicios, Método y Sistemas (nunca
   se rompe la convención tipográfica del sitio).
3. **Isotipo:** no watermark. Un solo shape funciona como marco parcial (doc 11: "Marcos") alrededor
   del bloque CTA — posicionado en una esquina, sin cerrar el marco, sugiriendo el límite de la
   composición sin contenerla — la única sección del sitio donde el isotipo hace de "frame" en vez
   de fondo o divisor.
4. **CTA:** se conserva el patrón WhatsApp que ya usa el Footer (single-action, sin formulario
   convencional — coincide exactamente con "no quiero un formulario convencional" del brief) — pero
   aquí es EL CTA primario del sitio, con el pill lime más grande que existe en cualquier sección.
5. **Nav en esta sección:** usa la variante "feature" de Parte 2 — el nav reconoce que este es el
   momento de decisión.

---

## Parte 9 — Footer

**Gap real vs. doc 11:** doc 11 Parte 10, regla explícita: *"El footer siempre abre con una oración
declarativa. No 'Contáctanos'. Una oración que hace una afirmación."* `Footer.astro` hoy **no tiene
ningún headline** — solo wordmark + tagline ("Conectamos. Automatizamos. Construimos.") + links. Es
una omisión respecto al propio lock, no una decisión.

**Propuesta:** agregar un headline declarativo arriba del grid de tres columnas — una oración corta,
en el mismo registro que el resto del sitio (ej. algo como *"Seguimos construyendo."* — final
abierto, no un "gracias por visitarnos"). Tipografía: mismo `--text-h2` que usan los headlines de
sección, para que el footer tenga presencia real sin necesitar más peso visual (más grid, más
color) — presencia vía escala tipográfica, no vía densidad.

---

## Parte 10 — Microdetalles

- **`.hero-microcopy` en 11px → 13px** (Parte 4.3) — el hallazgo concreto que señalaste.
- Auditoría general de espaciados/contraste queda para la fase de ejecución (no es razonable
  enumerar cada valor sin implementar) — pero el criterio que voy a aplicar: cualquier texto por
  debajo de `--text-xs` (14px efectivo en el clamp actual) se revisa caso por caso: labels tácticos
  (`--text-label`, 10px) se quedan como están porque doc 11 los especifica exactamente así; copy
  dirigido a un lector real (microcopy, captions largos) sube al mínimo de `--text-xs`.

---

## Resumen — qué se toca y qué no

**No se toca:** arquitectura de secciones, narrativa, copy (salvo el footer headline nuevo y el CTA,
que son gaps vs. doc 11, no cambios de narrativa), el Hero como concepto, el nav como diseño, el
minimalismo de Método, la paleta de marca (ink/cream/lime/violeta — cero colores nuevos).

**Se construye (mayormente cosas ya diseñadas en docs 04/11/16, nunca implementadas):**
1. Reveal system real (Hallazgo 1) — el cambio de mayor impacto.
2. Header vivo (Parte 2) — mecanismo ya especificado, solo faltaba conectarlo.
3. Isotipo: de 5 repeticiones de una técnica a 4 técnicas distintas (Parte 3).
4. Hero: motion + microcopy + ritmo (Parte 4).
5. Riel conector en Servicios (Parte 5) y Método (Parte 6).
6. Categorización por medio en Sistemas + pills de stack + interacción coreografiada (Parte 7).
7. Los Fibos integrado (Parte 7.6).
8. CTA final rediseñado como cierre narrativo (Parte 8).
9. Footer con headline declarativo, cerrando el gap vs. doc 11 (Parte 9).
10. Fix de microcopy (Parte 10).

**Requiere tu decisión explícita antes de ejecutar (Parte 0.5):**
- Enmienda A (vignette sutil vs. Rule 8 sin excepción).
- Enmienda B (confirmar el retiro del watermark de 4 instancias).
- Confirmar el mapeo de categorías de Sistemas (7.1), en particular dónde vive Investigación.
- Confirmar el contenido propuesto de Los Fibos (7.6).

Detengo aquí. No se modifica ningún archivo de código hasta tu aprobación.
