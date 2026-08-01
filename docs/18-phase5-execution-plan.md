# Verk — Phase 5 Execution Plan
> Rol: Director Creativo + Director de Arte + Motion Designer + Interaction Designer.
> Este documento no es una lista de opciones. Es una decisión, tomada, con su razón.
> Evoluciona doc 17 — no lo repite. Donde este documento contradice doc 17, este documento gana.
> No hay código todavía. Se detiene al final, en espera de aprobación.

---

## Parte 0 — El principio que gobierna todo

> Cada sección es un capítulo de la misma película. El usuario no navega el sitio. Lo recorre.

Esto se traduce en tres compromisos concretos, no en una metáfora:

1. **Cada capítulo tiene una temperatura propia** (Parte 2), no solo un fondo distinto.
2. **Cada capítulo tiene un tempo propio** — una velocidad de respiración distinta, no la misma
   curva de easing aplicada a contenido distinto (Parte 9, la parte más importante del documento).
3. **El header es el único elemento que persiste entre capítulos** — y por eso es el que más
   trabajo narrativo tiene que hacer: es el testigo que atraviesa toda la película (Parte 3).

Todo lo demás en este documento existe para servir a estos tres compromisos.

---

## Parte 1 — Qué cambia respecto a doc 17

Doc 17 hizo la auditoría correcta y encontró los problemas correctos (el reveal system roto, el
header nunca conectado, el isotipo repetido). Esa auditoría **se conserva íntegra** — nada de eso
cambió al releer el código. Lo que cambia es la ambición de la solución en tres puntos donde doc 17
propuso la versión conservadora y este brief pide ir más lejos:

| Área | Doc 17 propuso | Este documento decide |
|---|---|---|
| Sistemas — organización | Categorías por medio (SaaS, Apps, Sitios, IA) | **Se revierte.** Categorías por capacidad demostrada (doc 16 Parte 1), expandida — Parte 7 |
| Isotipo | 4 apariciones distintas | **5 apariciones**, cada una una técnica distinta — Parte 4 |
| Hero | Mantener el shape como fondo con drift | **Se reemplaza el componente visual completo** — deja de ser una imagen de fondo — Parte 5 |
| Servicios | Riel conector sobre las 4 filas existentes | **Se reestructura la composición** — deja de ser "4 filas" — Parte 6 |
| Color | Tokens nuevos de superficie (`--color-cream-warm`, `--color-ink-deep`) | Se conserva la idea, pero se aclara: son **variaciones tonales de cream/ink existentes**, no colores nuevos — Parte 2 |
| Motion | Mencionado como consecuencia de otras partes | **Se convierte en su propio documento dentro del documento** — Parte 9 |

Todo lo demás de doc 17 (Hallazgos 1–3, Método, CTA, Footer, Los Fibos como concepto) se hereda y se
profundiza, no se repite aquí punto por punto.

---

## Parte 2 — Color como narrativa: exprimir, no ampliar

Cream, ink, lime, violeta. Cuatro colores. Cero nuevos. Lo que cambia es cuántos valores tonales de
**esos mismos cuatro** el sitio se permite usar.

Hoy el sistema ya tiene, sin usar: `--color-surface-mid` (#1A1A1A) y `--color-surface-card`
(#1E1E1E) — ambos son *ink*, no un color nuevo, solo un ink menos denso. Se añaden dos variaciones
más, igual de honestas a su color base:

- **Cream, variación fría** (≈2% más gris, misma familia) — para el segundo capítulo claro del
  recorrido (Servicios), de modo que no sea idéntico al cream del Hero.
- **Ink, variación más profunda** (≈#080808) — reservado exclusivamente para el clímax (CTA,
  Parte 8) — el punto del que todo lo demás se distingue por ser "menos oscuro".

Ninguna de estas variaciones es un color nuevo en el sentido que prohíbe el brief — son el mismo
pigmento, distinta cantidad de luz. Es exactamente la lógica de un director de fotografía: la misma
locación, distinta hora del día.

**Regla de aplicación:** el lime y el violeta no ganan variaciones. Su fuerza es no tener grados —
lime siempre es #BFEA00, violeta siempre #6B6AF4, sin excepción, en cualquier capítulo. Los tonos
que respiran son cream e ink. Los acentos que actúan son absolutos. Esa asimetría es intencional:
la atmósfera cambia; lo que Verk hace (acción, inteligencia) no cambia con el capítulo.

---

## Parte 3 — El header vivo

Se conserva el mecanismo de doc 17 Parte 2 (`data-theme` por sección + `IntersectionObserver` +
transición de 500–700ms en `background-color`/`border-color`/`backdrop-filter`). Tres refinamientos
para que se sienta "consciente", no solo "reactivo":

1. **El header no reacciona durante la obertura del Hero.** Mientras la secuencia de entrada del
   Hero todavía se está revelando (Parte 5), el observer de tema queda en pausa. Un elemento que
   cambia de estado mientras todavía está apareciendo se siente nervioso, no consciente. El header
   espera a que el capítulo 0 termine de presentarse antes de empezar a responder al resto de la
   película.
2. **Una sola curva de easing gobierna las tres propiedades a la vez** (color, borde, blur) — nunca
   tres transiciones con timing ligeramente distinto, que es lo que produce la sensación de "hack"
   que el brief prohíbe explícitamente. Un solo `transition-timing-function`, una sola duración.
3. **El header no anuncia el capítulo con una etiqueta de texto.** Ya existe el vocabulario correcto
   para esto: el dot lime en `.nav-link.is-active` (ya construido, nunca conectado). Activarlo vía el
   mismo observer es toda la "conciencia de lugar" que el header necesita — no se agrega nada nuevo,
   se enciende algo que ya existe.

**Nota sobre el blur/glass existente:** el `backdrop-filter: blur(12px)` del pill ya es parte de la
identidad desde Phase 2A — no es glassmorphism nuevo, es material que ya se aprobó. La restricción
"no glassmorphism" de este brief se interpreta como: no se agregan superficies de vidrio nuevas en
otras partes del sitio (tarjetas, secciones) — el pill sigue siendo el único lugar donde ese material
existe, ahora con una variación de intensidad (blur 12px → 20px) reservada solo para el capítulo del
CTA (Parte 8), donde el header reconoce que está en el momento decisivo.

---

## Parte 4 — El isotipo: cinco apariciones, cinco técnicas

Regla nueva, explícita: **el isotipo nunca vuelve a ser una imagen de fondo.** Cada aparición usa una
técnica que ninguna otra aparición usa. Si en el futuro se necesita una sexta aparición y no hay una
séptima técnica distinta disponible en doc 11, no se agrega — se reutiliza la más adecuada de las
cinco existentes antes que repetir literalmente.

| # | Capítulo | Técnica | Por qué esta y no otra |
|---|---|---|---|
| 1 | Hero | **Trazo cinético** — los dos shapes se dibujan como líneas SVG (`stroke-dasharray`), no como PNG. Ver Parte 5. | Es la única aparición donde el isotipo nace del propio movimiento de la página — coherente con ser el primer capítulo. |
| 2 | Método, paso 04 | **Ensamblaje** — los dos shapes se unen y forman el isotipo completo exactamente cuando el usuario llega a "Verificamos". | El significado del isotipo en doc 11 ("dos sistemas en equilibrio dinámico") se vuelve literal justo en el paso que verifica que el sistema funciona. No es decoración — es la metáfora de la marca resolviéndose en el momento que la justifica. |
| 3 | Sistemas — ancla de cada capítulo de capacidad | **Máscara** — el preview del sistema que abre cada capítulo de capacidad (Parte 7) se recorta con el silueta del isotipo en vez de vivir en el marco hairline estándar. | Señala "este es el punto de entrada" sin agregar una etiqueta más — el tratamiento mismo es la señal. |
| 4 | CTA | **Marco** — dos shapes en esquinas opuestas, sin cerrarse, delimitando el bloque de decisión. | Un marco que no cierra es la traducción visual exacta de "el sistema sigue abierto hasta que decidas" — coherente con ser el clímax, no el final. |
| 5 | Footer | **Puntuación** — el isotipo, pequeño, estático, en ink, funciona como el punto final después del headline del footer (Parte 8). | Doc 11 prohíbe la puntuación en headlines en todo el sitio — esta es la única excepción, y por eso funciona: es el único punto final de toda la película, literal y simbólico a la vez. |

Ninguna de las cinco requiere el PNG de 871KB que existe hoy en `public/images/isotipo.png` para
usos grandes — todas se construyen sobre una versión SVG del isotipo (geometría vectorial de dos
paralelogramos, trivial de producir a partir del diseño existente). Esto también resuelve, de paso,
el hallazgo de la auditoría de infraestructura sobre el peso de esos archivos.

---

## Parte 5 — Hero: el componente visual, reinventado

**Se conserva sin tocar:** el copy, la jerarquía, el ritmo de lectura del Concepto 4, la composición
general (headline abajo-izquierda, espacio negativo a la derecha). **Se reemplaza por completo:** lo
que ocupa ese espacio negativo.

### Concepto: "El cruce" (SVG, no PNG — motion nativo, no watermark)

Los dos paralelogramos del isotipo existen en el Hero como **trazo, no como superficie.** Cada shape
es un `<path>` SVG con su contorno visible (1.5px, `--color-ink` al 100%, sin relleno) posicionado
fuera del viewport visible al cargar — uno arriba a la derecha, uno abajo a la derecha, cada uno en
su trayectoria implícita (doc 11 Parte 4: arriba-derecha sube, abajo-derecha baja — nunca rotan).

**Secuencia (sincronizada con el reveal de texto ya existente, Parte 9 tiene el detalle de tiempos):**
mientras el headline se revela, cada shape "se dibuja" — el contorno aparece progresivamente vía
`stroke-dashoffset`, como un plano que se traza. No hay relleno, no hay opacidad de fondo, no hay
imagen: son dos líneas construyéndose. Al momento en que el microcopy termina de aparecer, ambos
trazos han completado su forma — no como decoración de fondo, sino como el segundo evento visual de
la página, a la misma velocidad de lectura que el texto.

**Al primer scroll:** los dos trazos completan su trayectoria — el de arriba continúa subiendo y
saliendo del viewport, el de abajo continúa bajando y saliendo — el "cruce" que da nombre al concepto
ocurre en el instante en que ambos trazos se superponen brevemente antes de irse cada uno por su
lado. Este cruce es el puente hacia Servicios: no hay un divisor separado entre Hero y Servicios —
el propio Hero se convierte en su transición.

**Por qué esto y no las otras opciones del brief:** máscaras, fragmentación, tipografía-como-
composición y ensamblaje ya tienen su lugar en Sistemas, Método y Footer (Parte 4) — reutilizar
cualquiera de ellas aquí rompería la regla de "cinco técnicas, cinco lugares." El trazo cinético es
la única técnica de la lista del brief que ningún otro capítulo usa, lo cual la vuelve la elección
correcta específicamente para el capítulo que abre la película.

**Feasibility:** SVG + `stroke-dashoffset` animado con CSS (`@keyframes`, sin JS) para el dibujo
inicial; el "salida al scroll" usa el mismo patrón de `IntersectionObserver` que ya gobierna el resto
del reveal system (Parte 9) — cero librerías nuevas, cero WebGL, cero parallax.

---

## Parte 6 — Servicios: de cuatro filas a un índice editorial

**Se reestructura.** La composición de "fila 38%/62% × 4, una en dark" se retira — no porque
funcionara mal, sino porque el brief es explícito: "no quiero cuatro filas, quiero un sistema", y
cuatro filas repetidas, sin importar qué tan bien ejecutadas, siguen leyéndose como cuatro filas.

### Concepto: "Índice" (masthead editorial, no dashboard)

Arriba: las cuatro disciplinas se presentan como un **índice**, en una sola línea que se envuelve
naturalmente (`flex-wrap`), en el registro tipográfico de una tabla de contenidos impresa —
"Sitios Web ⋯⋯⋯ Automatizaciones ⋯⋯⋯ Integraciones CRM ⋯⋯⋯ Herramientas IA" — donde los puntos
suspensivos (`leader dots`, en Geist Mono, el registro técnico que la marca ya usa) conectan cada
nombre con nada más que aire — no hay número de página porque no hay páginas, pero el gesto tipográfico
del índice de revista es inmediatamente reconocible y es exactamente "composición de revista", no
UI de producto.

Debajo del índice: el cuerpo deja de ser cuatro cajas separadas por hairlines. Es **una sola columna
editorial continua** — el mismo patrón de lectura que un artículo de revista real, donde cada
disciplina aparece como un párrafo con su nombre funcionando como *running head* al margen (una nota
al margen, no un título de tarjeta) en vez de una fila con su propia caja. La disciplina de IA sigue
siendo la que cambia de registro — conserva su inserción en dark con la pill violeta (ese quiebre ya
funciona y doc 11 lo exige) — pero ahora el quiebre ocurre *dentro* de una columna continua, no entre
cuatro cajas idénticas, lo cual lo hace sentir como una interrupción real en un texto, no como una
cuarta fila con otro color.

**Qué se elimina explícitamente:** el grid `38%/62%` repetido, los `border-top` como único
separador entre disciplinas, cualquier posibilidad de iconografía. Nada de esto se reemplaza por un
componente "de tarjeta" — se reemplaza por tipografía y espaciado, que es lo único que un índice de
revista necesita.

---

## Parte 7 — Sistemas: expandir doc 16, no reemplazarlo

Esta es la mayor evolución del sitio y el corazón de la sección, exactamente como pide el brief.

### 7.1 — La estructura visible pasa a ser la taxonomía de capacidad (doc 16 Parte 1), no el medio

Doc 16 Parte 1 ya define seis capacidades, cada una con evidencia primaria y secundaria ya asignada
por sistema. Hoy esa taxonomía vive solo en un archivo markdown — la sección real es una lista
plana ordenada por rango. La propuesta: **la taxonomía se vuelve la estructura visual real de la
sección.** Seis capítulos, uno por capacidad, en el mismo orden que doc 16 Parte 2 ya ordenó por
fuerza de argumento (Sonoro abre, WATERLÜ cierra):

| Capítulo (capacidad) | Ancla (evidencia primaria) | Apoyo (evidencia secundaria, ya en doc 16) |
|---|---|---|
| 1. Ingeniería de Sistemas Distribuidos | **Sonoro** | — |
| 2. IA en Producción | **CleanSolarAus** | — |
| 3. Arquitectura de Conocimiento Original | **PRISMA** | UX Analyzer |
| 4. Sistemas de Negocio a Nivel de Plataforma | **DocLink** | **Los Fibos** (Parte 7.3) |
| 5. Pensamiento de Producto a Largo Plazo | **Riot** | Bufón, Bloom Undies |
| 6. Ejecución y Oficio del Cliente | **WATERLÜ** | — |

Ningún sistema se duplica. Cada uno vive en el capítulo de su rol más fuerte, exactamente como doc
16 ya lo determinó — la diferencia es que hoy esa determinación se hace visible en vez de quedar
enterrada en un archivo que solo yo he leído. Esto responde directamente al brief: "conserva la
lógica de capacidad... no la reemplaces. Expándela" — expandirla es dejar que gobierne el layout,
no solo el copy de un pill.

### 7.2 — Uniformidad real: el tamaño lo decide el rol narrativo, no una prop arbitraria

Hoy `size: xl/lg/md/sm` es una decisión manual por sistema. Se reemplaza por una regla sistémica:
**ancla de capítulo = tratamiento grande** (el mismo trato que hoy solo tiene Sonoro — dark inset,
tipografía mayor, arquitectura siempre visible); **apoyo de capítulo = tratamiento compacto**
(disclosure cerrado por defecto, tipografía menor). Dos tamaños, no cuatro — el mismo lenguaje se
repite seis veces (una por capítulo) en vez de nueve decisiones de tamaño independientes. Esto es lo
que hace que "los márgenes, los tamaños, las proporciones hablen el mismo idioma", como pide el brief.

Cada capítulo abre con un encabezado breve — una línea, tomada casi textual de la descripción que
doc 16 Parte 1 ya escribió para esa capacidad (ej. "Colas, workers, reintentos, procesamiento
asíncrono, recuperación de fallas tratados como la condición operativa por defecto, no como un caso
extremo.") — así el visitante entiende qué está a punto de ver antes de verlo, sin que se sienta
como documentación: es una oración editorial, no una especificación técnica.

### 7.3 — Los Fibos: evidencia real, no un añadido

Stack de Los Fibos (Astro + Islands, TypeScript, PostgreSQL/Neon + Drizzle, Stripe, funciones
serverless en Netlify, Resend) demuestra exactamente lo que "Sistemas de Negocio a Nivel de
Plataforma" necesita probar: múltiples servicios independientes (catálogo, checkout, correo,
suscripciones, solicitudes) conectados en una sola operación comercial coherente. Hoy DocLink es la
única evidencia de esa capacidad — un solo caso puede leerse como excepción. Los Fibos, al lado de
DocLink, prueba que es un patrón repetible, no un golpe de suerte. Esa es literalmente su función
narrativa en la sección — no "un décimo proyecto que también cabe", sino la prueba de que la
capacidad 4 se sostiene dos veces.

Su dirección de arte (fotolibro, revista editorial, animación cinematográfica discreta) además hace
eco secundario en el Capítulo 6 (Ejecución y Oficio, junto a WATERLÜ) — se menciona en el copy de
apoyo, sin duplicar la tarjeta.

### 7.4 — Stack, arquitectura y estado sin que se sienta a documentación

Se conserva de doc 17: `ArchitectureStrip` tokenizado en pills reales por tecnología (Parte 7.4 de
doc 17, sin cambios) y la apertura coreografiada con `grid-template-rows` + stagger de 60ms por
celda (doc 17 Parte 7.5, sin cambios) — ambas decisiones siguen siendo correctas bajo la nueva
estructura de capítulos; lo único que cambia es que ahora vive dentro de un capítulo de capacidad en
vez de una fila en un ranking plano.

---

## Parte 8 — CTA: el clímax emocional

Se hereda el concepto de doc 17 Parte 8 (headline en dos actos, marco de isotipo, WhatsApp como
único CTA, `--color-ink-deep` como superficie) y se agregan dos decisiones de puesta en escena que
lo vuelven un clímax real y no solo "la sección más oscura":

1. **Un silencio antes del CTA.** En el momento en que el capítulo entra al viewport, nada se mueve
   durante un beat completo (aprox. 600–800ms) antes de que el headline empiece su propia entrada —
   el único lugar de todo el sitio donde el usuario llega a una sección y esta, deliberadamente, no
   reacciona de inmediato. Ese silencio es lo que hace que lo que sigue se sienta como un
   acontecimiento, no como la siguiente entrada de una lista de secciones.
2. **El header cambia de comportamiento aquí, no solo de color** (Parte 3, blur 20px) — es el único
   capítulo donde el nav "sabe" que está en el momento de decisión.

Este es también el capítulo candidato más fuerte a la pregunta de memoria (Parte 10) — si el sitio
solo pudiera garantizar que el usuario recuerde un momento, este es el diseñado para serlo.

---

## Parte 9 — Motion: la partitura completa

Este es el cambio más importante del documento, tal como lo señala el brief. No se describe capítulo
por capítulo qué anima — se describe **el tempo de la película completa**, porque eso es lo que
falta hoy: cada sección tiene (o no tiene) su propia animación aislada, sin relación entre ellas.

### 9.1 — La partitura por capítulo

| Capítulo | Tempo | Intención emocional | Silencio / respiración |
|---|---|---|---|
| Hero | *Adagio* — 5.4s de entrada a ritmo de lectura (doc 17 Parte 4.2) | Presentación. Confianza sin prisa. | El silencio está al principio: nada se mueve hasta que el usuario ya está mirando. |
| Ticker | *Andante continuo* — el único movimiento perpetuo del sitio (marquee, ya existente) | Pulso de fondo — el sistema respirando entre capítulos. | No tiene silencio — es el que conecta, no el que descansa. |
| Servicios | *Moderato*, stagger de 80ms por bloque del índice | Orientación — aquí está el mapa completo de lo que Verk hace. | Una pausa de 400ms entre el índice y el primer párrafo — tiempo para leer el índice antes de que el cuerpo aparezca. |
| Método | *Andante*, stagger de 150ms por paso (ya definido en doc 04) | Proceso — cada paso se gana su lugar antes de que aparezca el siguiente. | El silencio más largo del sitio antes del paso 04 — el ensamblaje del isotipo (Parte 4) necesita que nada más se mueva para notarse. |
| Sistemas | *Rubato* — el tempo lo marca el usuario, no el scroll (disclosure interactivo, no auto-reveal) | Exploración — el único capítulo donde el ritmo es una conversación, no una entrada. | El silencio es la ausencia de auto-play: nada se abre solo. El usuario decide cuándo respira la sección. |
| CTA | *Fermata* — el silencio de 600–800ms (Parte 8) seguido de la entrada más lenta del sitio | Decisión. | Es, literalmente, el capítulo-silencio. |
| Footer | *Largo* — entrada lenta, única, sin stagger (un solo bloque que aparece) | Cierre. Créditos. | Silencio final: después del footer, nada más se mueve nunca. |

### 9.2 — Reglas que gobiernan toda la partitura

- **Ninguna sección repite el tempo de la sección anterior.** Si Método es *andante*, Sistemas no
  puede ser *andante* también — por eso Sistemas se vuelve *rubato* (controlado por el usuario): es
  el único tempo que ningún otro capítulo usa, igual que la regla del isotipo en Parte 4.
- **Un solo momento de sorpresa real en todo el sitio:** el ensamblaje del isotipo en Método, paso
  04 (Parte 4, fila 2). No se agregan más "momentos sorpresa" — un sitio con tres sorpresas no
  sorprende, entrena al usuario a esperarlas. Una sola, bien puesta, es la que se recuerda.
- **El reveal system roto (doc 17, Hallazgo 1) es la base física de todo esto.** Sin
  `src/scripts/reveal.ts` conectado a un `IntersectionObserver` real, ninguna fila de esta tabla
  existe — sigue siendo, sin cambios, el primer bloque de trabajo técnico antes que cualquier otra
  cosa en este documento tenga sentido.
- **`prefers-reduced-motion` colapsa la partitura completa a silencio total** (ya implementado en
  `motion.css`) — todo lo anterior es la versión con movimiento; la versión sin movimiento sigue
  siendo, como ya lo es hoy, contenido inmediatamente visible sin transición.

---

## Parte 10 — La prueba de memoria, aplicada

Por capítulo, el momento diseñado específicamente para sobrevivir una hora después de cerrar la
pestaña:

- **Hero:** el cruce de los dos trazos saliendo del viewport al primer scroll — no se ve venir la
  primera vez, y se busca la segunda.
- **Servicios:** el índice con leader dots — es un gesto tipográfico que ningún sitio de
  automatización/CRM en el mercado usa.
- **Método:** el ensamblaje del isotipo en el paso 04. La única sorpresa del sitio.
- **Sistemas:** no es un momento — es la sensación de que la sección entera es *rubato*, que el
  usuario controla. Eso se recuerda como sensación, no como evento puntual.
- **CTA:** el silencio de 600–800ms. Nadie recuerda una animación de botón. Todos recuerdan un
  sitio que, por un instante, no hizo nada.
- **Footer:** el isotipo como punto final, después de un headline que por primera y única vez
  termina en algo — la única puntuación de todo el sitio.

Si en ejecución alguno de estos seis no sobrevive el filtro real (una vez construido, se ve, se
prueba, se pregunta honestamente si se recuerda), se rediseña ese punto específico — no la sección
completa.

---

## Restricciones — cómo se cumplen, explícitamente

| Restricción del brief | Cómo se cumple aquí |
|---|---|
| No cambiar identidad | Cero cambios a copy, arquitectura de secciones, o los cuatro colores base |
| No agregar colores | Parte 2 — solo variaciones tonales de cream/ink ya existentes |
| No glow | Ninguna propuesta usa `box-shadow` luminoso ni `filter: drop-shadow` decorativo |
| No glassmorphism nuevo | Parte 3 — el único blur/glass es el que ya existía en el nav desde Phase 2A |
| No gradientes llamativos | Ningún gradiente en este documento — Parte 2 usa tokens sólidos |
| No parallax exagerado | El único movimiento ligado a scroll es el cruce del Hero (Parte 5) y es salida de trazo, no desplazamiento de capas a velocidades distintas |
| No animaciones gratuitas | Cada animación de este documento tiene una fila en la Parte 9 que explica qué necesidad narrativa cumple |
| Atemporal | Cero técnicas "de tendencia 2026" — SVG stroke-drawing, CSS grid-rows, IntersectionObserver: todas son técnicas de años, elegidas porque funcionan, no porque estén de moda |

---

## Resumen — qué se conserva, qué se elimina, qué se construye desde cero

**Se conserva:** copy completo, arquitectura de secciones, los cuatro colores base, el Hero como
concepto de ritmo de lectura, Método como estructura de pasos, `ArchitectureStrip` tokenizado,
disclosure animado de doc 17, WhatsApp como único CTA, taxonomía de doc 16 (ahora expandida a
estructura visual en vez de metadato).

**Se elimina:** el PNG del isotipo como watermark en cualquier forma (las 5 instancias actuales), la
composición de 4 filas idénticas en Servicios, la organización por medio de Sistemas (la de doc 17
Parte 7.1 — revertida), el tamaño-por-prop-manual en `SystemEntry` (reemplazado por tamaño-por-rol).

**Se construye desde cero:** el sistema SVG del isotipo (cinco técnicas, Parte 4), el componente
visual del Hero (Parte 5), la composición editorial de Servicios (Parte 6), la estructura de seis
capítulos de capacidad en Sistemas (Parte 7), la puesta en escena del CTA (Parte 8), y — el trabajo
más importante — el sistema de motion completo como partitura única (Parte 9), empezando,
inevitablemente, por conectar el reveal system que hoy no existe.

Me detengo aquí. No se modifica ningún archivo de código hasta tu aprobación.
