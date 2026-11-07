# VERK: investigación externa para el rediseño mobile-first del home

Fecha: 2026-11-06. Repo consultado solo en lectura (`package.json` y `.mcp.json`). No se instaló nada.

**Método.** Los metadatos de GitHub vienen de la REST API pública (`api.github.com/repos/...`), porque `gh` no está instalado en esta máquina. Versiones y licencias npm vienen de `registry.npmjs.org`. Los tamaños vienen de la API de bundlephobia, salvo cuando se cita otra fuente. El soporte de navegadores viene de `@mdn/browser-compat-data` 8.1.8 (timestamp 2026-11-02). En esa versión las releases actuales son Chrome 156, Safari 27.2 y Firefox 159 (2026-10-27).

**Convenciones.**
- **[V]** = verificado en fuente durante esta investigación.
- **[I]** = inferencia o criterio propio.
- **[NV]** = no verificado.

---

## 0. Conclusión adelantada

**[I]** La plataforma nativa de noviembre de 2026 cubre casi todo lo que necesita un home mobile-first de VERK:
- `<dialog>`, `popover`, scroll-snap, `dvh`/`svh`, `env(safe-area-inset-*)` y container queries.
- Scroll-driven animations (ya Baseline), View Transitions de mismo documento, `@starting-style`, `content-visibility` y `touch-action`.

Ninguna librería de componentes, de iconos ni de recursos gráficos encaja con la marca ni con el presupuesto de 20 KB. Ya hay ~18.6 KB usados, así que solo quedan ~1.4 KB.

**La recomendación es no añadir dependencias de runtime.** Las únicas incorporaciones que merecen consideración son de flujo de trabajo (QA y guía), no del bundle.

---

## A. UX/UI móvil y arquitectura responsive

### A.1 vercel-labs/web-interface-guidelines [V]
- **Repo:** https://github.com/vercel-labs/web-interface-guidelines
- **Estado:** MIT, 1 124★, push 2026-10-05, 2 issues abiertas. No publica releases: es un README vivo.
- **Contenido:** un checklist no exhaustivo de interacción, animación, layout, contenido, formularios y rendimiento. Incluye una sección para agentes (`AGENTS.md` y una skill de revisión).
- **Reglas móviles relevantes (citas verificadas):**
  - Área táctil mínima de 44 px en móvil.
  - `<input>` con fuente ≥ 16 px, para evitar el auto-zoom de iOS.
  - "Never disable browser zoom".
  - `touch-action: manipulation` en controles.
  - `overscroll-behavior: contain` en modales y drawers.
  - `overscroll-behavior: none` en `<html>` solo bajo `@media (pointer: fine)`, para conservar el pull-to-refresh en táctil.
  - Variables de safe area.
  - Que los sticky no tapen el elemento con foco.
  - "Every drag, swipe, pinch… also works with a tap/click control & keyboard".
  - Movimiento de más de 5 s pausable y nunca `transition: all`.
  - Probar en iOS Low Power Mode.
- **Para VERK [I]:** coincide casi 1:1 con CLAUDE.md y el doc 21. Sirve como checklist de revisión, no como dependencia.
- **Clasificación:** Referencia conceptual (alta prioridad).

### A.2 GoogleChrome/modern-web-guidance: existe [V]
- **Repo:** https://github.com/GoogleChrome/modern-web-guidance
- **Estado:** Apache-2.0, 2 631★, push 2026-11-06, release v0.0.197 (2026-11-02), 1 issue abierta.
- **Qué es:** un proyecto de Chrome, con apoyo del equipo de Edge, que empaqueta buenas prácticas de plataforma como **skills para agentes de código**:
  - Guías en `skills/modern-web-guidance/guides/` sobre CSS, HTML, componentes y comportamientos de UI, rendimiento, accesibilidad y diseño visual.
  - Cubre unos 232 features y 188 casos de uso.
  - Trae manifiestos para Claude, Codex, Cursor y otros.
  - Tiene CLI (`npx modern-web-guidance@latest install | search | retrieve <id>`), con guías como `animate-to-from-top-layer`.
- **Riesgos [I]:** está en preview (versión 0.0.x, con releases casi diarias), así que su contenido puede cambiar.
- **Para VERK [I]:** es útil justo para empujar a los agentes hacia `popover`, `dialog` y animación nativa en vez de JS. Encaja con la carpeta `.claude/skills/`. Habría que fijar una versión si se instala, y solo con aprobación del usuario.
- **Clasificación:** Recomendado (flujo de trabajo, no runtime).

### A.3 mdn/content: páginas y soporte verificado [V]
- **Repo:** https://github.com/mdn/content
- **Estado:** 11 127★, push diario. La licencia es CC-BY-SA para la prosa y CC0 para el código, por eso la API la reporta como NOASSERTION.

Soporte según BCD 8.1.8. Las versiones son de la primera release con soporte.

| Feature | Chrome | Safari / iOS | Firefox | Nota para VERK |
|---|---|---|---|---|
| `animation-timeline` (scroll/view) | 115 | 26 / 26 | **159** (sin flag) | MDN la marca "Baseline 2026, newly available, since October 2026". Ya no hace falta un fallback JS para navegadores actuales, pero sí el estado final estático para los anteriores. |
| `document.startViewTransition` (mismo documento) | 111 | 18 / 18 | 144 | Baseline en navegadores actuales. |
| `ViewTransition.types` | 125 | 18.2 | 147 | |
| `@view-transition` (entre documentos, MPA) | 126 | 18.2 | **no** | Firefox no lo soporta: sirve solo como mejora progresiva, por ejemplo home → `/bot`. |
| `@container` | 105 | 16 | 110 | |
| `dvh` / `svh` / `lvh` | 108 | 15.4 | 101 | |
| `env(safe-area-inset-*)` | 69 | 11 | 65 | Requiere `viewport-fit=cover`. |
| `popover` | 114 | 17 / iOS 18.3 | 125 | |
| `<dialog>` | 37 | 15.4 | 98 | |
| `dialog[closedby]` | 134 | solo preview | 141 | No conviene depender de él en iOS. |
| `@starting-style` | 117 | 17.5 | 129 | Entradas de dialog y popover sin JS. |
| `content-visibility` | 85 | 18 | 125 | |
| `touch-action` | 36 | iOS 9.3 | 52 | |
| scroll-snap | 69 | 11 | 99 | |
| `inert` | 102 | 15.5 | 112 | |
| anchor positioning (`anchor-name`) | 125 | 26 | 147 | |
| `interpolate-size` / `calc-size()` | 129 | no | no | Solo mejora progresiva. |
| `::scroll-marker` / `::scroll-button` (carruseles CSS) | 135 | no | no | No apto todavía. |
| OffscreenCanvas `webgl2` | 69 | 17 | 105 | |

**Páginas MDN de referencia:**
- https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline
- https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
- https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries
- https://developer.mozilla.org/en-US/docs/Web/CSS/length#relative_length_units_based_on_viewport
- https://developer.mozilla.org/en-US/docs/Web/CSS/env
- https://developer.mozilla.org/en-US/docs/Web/API/Popover_API
- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
- https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action
- https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility

**Clasificación:** Recomendado (referencia y fuente de verdad). Opcionalmente, el MCP `context7` ya configurado sirve como vía de consulta.

### A.4 Otros recursos de layout y tipografía fluida
- **Utopia** (https://utopia.fyi).
  - Calculadora de escalas fluidas de tipo y espaciado basadas en `clamp()`.
  - El paquete `utopia-core` 1.6.0 tiene licencia ISC y su última publicación es de 2024-09-19 [V]. El repo `utopia-fluid/utopia` no existe en GitHub [V: 404].
  - **[I]** No hace falta la dependencia: basta con generar los `clamp()` una vez en la web y pegarlos como tokens CSS.
  - **Clasificación:** Referencia conceptual.
- **Every Layout** (https://every-layout.dev, Heydon Pickering y Andy Bell).
  - Primitivas intrínsecas (Stack, Cluster, Sidebar, Switcher, Cover) sin media queries.
  - Es un libro/sitio, no un repo con paquete. El contenido está parcialmente detrás de compra [NV en detalle].
  - **[I]** Es el modelo correcto para un home que cambia de composición de 1440 a 390 px sin breakpoints frágiles. Encaja bien con container queries.
  - **Clasificación:** Referencia conceptual.
- **GoogleChrome/web-vitals** (https://github.com/GoogleChrome/web-vitals).
  - Apache-2.0, 8 668★, v6.2.3 (2026-10-05) [V].
  - **[I]** Solo tendría sentido en dev/QA, inyectado por Playwright, para medir INP/LCP/CLS reales. No como RUM en producción, porque eso implicaría un endpoint externo.
  - **Clasificación:** Útil para experimentación (QA).

---

## B. Componentes para un sitio Astro sin framework

| Recurso | Datos [V] | Aplicabilidad real a VERK [I] | Clasificación |
|---|---|---|---|
| **radix-ui/primitives** | MIT, 19 479★, push 2026-10-14, 274 issues. `@radix-ui/react-dialog` 1.3.1 (2026-10-12). | Solo React: llevarlo a runtime rompería "sin framework de UI" y el presupuesto de 20 KB. Lo útil es leer su **patrón de accesibilidad** (gestión de foco, `aria-*`, Escape, scroll lock), que hoy `<dialog>` y `popover` dan nativamente. | Referencia conceptual |
| **shadcn-ui/ui** | MIT, 127 523★, push diario, 1 764 issues. | Son componentes React + Tailwind + Radix copiados en el repo. Su estética de "SaaS por defecto" contradice el lenguaje editorial de VERK y no es aplicable técnicamente. | No recomendado |
| **lucide-icons/lucide** | ISC (con partes MIT de Feather; la API lo reporta como NOASSERTION), 25 612★, v1.70.0 (2026-11-06). | El doc 21 prohíbe iconos genéricos. Si alguna vez se necesitara un glifo funcional (cerrar, flecha), lo correcto es dibujarlo en el sistema de la marca, por ejemplo derivado de las barras a 45°. | No recomendado |
| **emilkowalski/vaul** (drawer) | MIT, 8 688★, último push 2025-10-03, v1.1.2 (2024-12-14), 162 issues. | Es React y está con poca actividad. Vale como **referencia de física de bottom sheet** (umbral de velocidad, rubber-banding), alineada con Emil Kowalski. | Referencia conceptual |

**Primitivas nativas que cubren las necesidades móviles [V soporte; I aplicación]:**
- **Menú móvil / overlay de navegación:**
  - `<dialog>` con `showModal()` ya da foco atrapado, `Escape`, `::backdrop` y `inert` del resto. Basta con una línea de JS.
  - Alternativa: `popover="auto"`, que da cierre al pulsar fuera sin JS.
  - Entrada y salida con `@starting-style` + `transition-behavior: allow-discrete`.
  - Evitar `closedby`, que no está en iOS.
- **Bottom sheet / drawer:** `<dialog>` anclado abajo con `max-height: 85dvh`, `overscroll-behavior: contain` y `padding-bottom: env(safe-area-inset-bottom)`.
  - Si se quiere arrastrar para cerrar, son unas 40 líneas con Pointer Events y `touch-action: none` solo en el "grabber".
  - Por la regla de Vercel, siempre con botón de cierre alternativo.
- **Carrusel / galería de Sistemas en móvil:** `scroll-snap-type: x mandatory` + `scroll-snap-align` + `overflow-x: auto`.
  - Sin librería. Los indicadores se sacan de `IntersectionObserver` o `scroll-timeline`.
  - `::scroll-marker` aún no sirve (no está en Safari ni en Firefox).
- **Acordeones (servicios, FAQ):** `<details>` / `<summary>`. El agrupado exclusivo se hace con `<details name="…">`, que es ampliamente soportado [NV versión exacta en BCD].
- **Librerías vanilla pequeñas (gestos, drawers):** no encontré ninguna cuya relación tamaño/valor supere a ~40 líneas propias sobre Pointer Events. **[I]** No se recomienda buscar una.

---

## C. Animación e interacción

| Recurso | Datos [V] | Tamaño [V] | Para VERK [I] | Clasificación |
|---|---|---|---|---|
| **CSS scroll-driven animations** | Chrome 115, Safari 26, Firefox 159. Baseline "newly available" desde 10/2026 (MDN). | 0 KB | Ya se usa en el sitio. Ahora es viable para todo progreso ligado al scroll (header, reveals, indicadores). Mantener `@supports (animation-timeline: view())` y el estado final por defecto. | **Recomendado** (nativo) |
| **View Transitions (mismo documento)** | Chrome 111, Safari 18, Firefox 144. | 0 KB | Para cambios de estado en la misma página, por ejemplo abrir el detalle de un Sistema. El MPA home → `/bot` (`@view-transition`) falla en Firefox: solo mejora progresiva. | **Recomendado** (nativo) |
| **WAAPI** (`el.animate`) | Universal (iOS 13.4+). | 0 KB | Ya se usa en el header. Es interrumpible y basta para las transiciones de interfaz. | **Recomendado** (nativo) |
| **motion** (motiondivision) | MIT, 34 965★, v14.10.1 (2026-11-06), 3 issues abiertas. | `animate` mini **3.2 KB** e híbrido **22 KB** según motion.dev/docs/animate. El paquete completo pesa 61 KB gzip según bundlephobia. | Ya es devDependency. El mini (WAAPI + springs) costaría ~3.2 KB y **excede el margen de ~1.4 KB** del JS inicial. Solo cabe con `import()` diferido y si aporta springs que CSS `linear()` no resuelva. `linear()` ya permite curvas tipo spring sin JS. | Útil para experimentación |
| **GSAP** | v3.15.1 (2026-11-04), 30 257★. Licencia "Standard no-charge" de Webflow, vigente desde 2025-04-30 y modificada 2025-05-30: gratis para uso comercial, plugins incluidos (SplitText, MorphSVG…). | 27 KB gzip el core (bundlephobia). | **No es open source**: es una licencia propietaria con "Prohibited Use" para herramientas no-code que compitan con Webflow, y Webflow puede enmendarla. Para un sitio de estudio el uso es lícito. Aun así son 27 KB y el pin/scrub ya se resuelve con scroll-timeline nativo. Sirve solo en `lab/`. | Útil para experimentación |
| **Lenis** | MIT, v1.3.27 (2026-10-15). | No medido aquí. | Ya es dependencia de runtime pero no se usa en el home. **[I]** En móvil, el smooth scroll suele empeorar el INP y la sensación nativa. Se recomienda no introducirlo en el home móvil y valorar sacarlo de `dependencies` si nada lo usa (preguntar antes). | No recomendado (en móvil) |

**Gestos táctiles [I, con base en MDN/Vercel]:**
- Usar Pointer Events, nunca `touchstart` / `touchmove` con `preventDefault` global.
- `touch-action: pan-y` en superficies con arrastre horizontal y `touch-action: manipulation` en botones.
- `setPointerCapture` para no perder el gesto.
- Decidir el cierre por velocidad, además de por distancia.
- Ofrecer siempre una alternativa con tap y teclado.
- Nada de `cursor: none` (ya prohibido). El cursor custom solo bajo `@media (hover: hover) and (pointer: fine)`.

---

## D. Gráficos generativos en móvil

| Recurso | Datos [V] | Tamaño gzip [V bundlephobia] | Para VERK [I] | Clasificación |
|---|---|---|---|---|
| **three.js** | MIT, 117 720★, r187 (2026-10-30). | 185.7 KB (paquete completo; con tree-shaking es menos) | Desproporcionado para piezas 2D/fragment shader. Ya es devDep para `lab/`. | Útil para experimentación |
| **OGL** | npm dice **Unlicense** (el repo no expone licencia a la API), 4 749★. Último push 2025-04-13, v1.0.11 (2025-01-27), 27 issues. | 34.2 KB (paquete completo; modular) | Ligero, pero tiene **más de 18 meses sin actividad**, lo que es riesgo de abandono. VERK ya tiene WebGL2 propio. | Referencia conceptual |
| **regl** | MIT, 5 595★, v2.1.1 (2024-11), push 2026-10. | 37.7 KB | WebGL1 funcional. Más peso que el código propio actual. | No recomendado |
| **twgl.js** | MIT, 3 033★, v7.0.0 (2025-07), push 2026-10. | 22.7 KB | Helper fino de WebGL2. No aporta frente a los shaders propios. | Referencia conceptual |
| **Lygia** | **Prosperity Public License 3.0.0 + Patron License** (dual), 3 480★, v1.4.1 (2026-02-07). | n/a (snippets GLSL) | **Licencia no comercial.** Permite probar con fines comerciales 30 días; la licencia comercial se obtiene vía GitHub Sponsors, una PR o una licencia por versión. **No copiar funciones de Lygia a `src/` sin resolver esto.** Puede leerse como referencia de algoritmos. | No recomendado (sin licencia comercial) |

**Técnicas para piezas WebGL2 / Canvas en móvil [I salvo donde se marca; son prácticas estándar]:**
1. **DPR adaptativo.**
   - `Math.min(devicePixelRatio, 1.5)` en móvil y hasta 2 en escritorio.
   - Para halftone e isolíneas, renderizar a 0.5–0.75× y escalar con CSS: el propio patrón oculta la pérdida.
2. **Render-on-demand.** Si el campo es estático hasta que hay interacción o scroll, dibujar solo cuando cambian los uniforms. Así se cumple "prohibido el rAF permanente".
3. **Pausar por visibilidad.** `IntersectionObserver` para detener el loop fuera de pantalla y `visibilitychange` para detenerlo con la pestaña oculta.
4. **Presupuesto de frame.**
   - Medir el `dt` medio. Si supera ~20 ms sostenidos (cerca de 50 fps), bajar la resolución del render target un escalón (histéresis de 2–3 s) y no volver a subirla con agresividad.
   - Esto también mitiga el **throttling térmico**: en iOS el GPU baja de frecuencia tras decenas de segundos de carga sostenida, y en Low Power Mode Safari limita rAF a 30 fps [NV cifra exacta; Vercel recomienda probar en Low Power Mode].
5. **Pérdida de contexto.** Manejar `webglcontextlost` con `preventDefault()` y parar el loop, y `webglcontextrestored` para recrear programas y buffers. Si falla, mostrar el estado estático (póster CSS/SVG con los colores planos de la marca).
6. **OffscreenCanvas + Worker.** WebGL2 en OffscreenCanvas está desde Safari/iOS 17, Chrome 69 y Firefox 105 [V BCD]. Saca la simulación del hilo principal y ayuda al INP. A cambio, añade complejidad (mensajería de pointer y resize). Vale para el fluido del hero si la traza muestra long tasks; no por defecto.
7. **LCP.** El titular del hero debe ser HTML visible desde el primer frame. El canvas se inicializa después de `requestIdleCallback` / `load` y nunca es elemento LCP.
8. **`prefers-reduced-motion`.** Un frame final estático, sin loop.
9. **Shaders.** `mediump` donde baste, sin bucles grandes por fragmento en móvil y con pocas texturas de lectura en ping-pong de fluido (menos iteraciones de presión en móvil).

---

## E. Recursos visuales

| Recurso | Qué hay [V] | Para VERK [I] | Clasificación |
|---|---|---|---|
| **designresources.dev** | Directorio de 1 249 recursos en 33 categorías (fuentes, iconos, stock, UI kits, librerías de animación…), construido sobre la lista MIT `bradtraversy/design-resources-for-developers`. Sin proceso editorial explícito. | Orientado a "developers who don't have a designer", lo contrario de VERK. Nada aplicable sin violar la regla de "no stock ni iconos genéricos". | No recomendado |
| **freesets.dev** | 570 recursos en 14 categorías (iconos, ilustraciones, componentes, 3D, fondos…). Licencia por recurso; algunos son freemium o sin licencia. | Lo mismo. Como mucho, la categoría "Inspirations" sirve para mirar. | No recomendado |
| **reinaldosimoes/design-resources** | CC0, 78★, push 2026-08-21. Lista de 20 categorías (Google Fonts, Lucide, unDraw, Unsplash, Placeit…). Incluye servicios de pago. No relacionada con designresources.dev. | Genérica. Nada aplicable. | No recomendado |

**[I]** Honestamente, ninguno aporta a VERK. La identidad (isotipo, wordmark, paleta, Instrument Sans y Geist Mono) ya está cerrada en el doc 21, y cualquier asset externo sustituiría el lenguaje de la marca.

---

## F. APIs y MCPs gratuitos para el flujo de trabajo (no runtime)

| Herramienta | Proveedor y docs | Qué da | Plan gratuito y límites | API key | Licencia | Privacidad | Uso comercial | Beneficio concreto para VERK | Clase |
|---|---|---|---|---|---|---|---|---|---|
| **sharp** | lovell/sharp, https://sharp.pixelplumbing.com | Redimensionado y AVIF/WebP en build | Ilimitado (local) | No | Apache-2.0 (32 828★, push 2026-11-05) | Local | Sí | Ya llega vía el servicio de imágenes de Astro (`astro:assets`) [I: no está en `package.json` directo]. Úsalo para los `srcset` de capturas de Sistemas. | Free & OSS |
| **Squoosh** (app/CLI) | GoogleChromeLabs/squoosh | Compresión manual con comparativa visual | Gratis | No | Apache-2.0 (push 2026-10-22) | La app web procesa en el cliente [NV] | Sí | Solo para afinar a mano assets puntuales. El CLI fue retirado hace años [NV estado actual]. | Free & OSS |
| **axe-core** | dequelabs/axe-core | Reglas WCAG | Ilimitado | No | MPL-2.0, v4.14.0 (2026-10-05) | Local | Sí | Ya integrado (`@axe-core/playwright`). | Free & OSS |
| **Pa11y** | pa11y/pa11y, https://pa11y.org | CLI de a11y (axe o HTML_CodeSniffer) | Ilimitado | No | LGPL-3.0, v10.0.0 (2026-08-28) | Local | Sí (como herramienta) | **[I] Redundante** con axe en Playwright. Solo aportaría el runner HTMLCS como segunda opinión. | Free & OSS |
| **Lighthouse CI** | GoogleChrome/lighthouse-ci | Asserts de presupuesto por PR e historial | Gratis | No (el servidor LHCI propio es opcional) | Apache-2.0, v0.16.0 (2026-11-02) | El target `temporary-public-storage` **sube informes públicos** a Google: evitarlo y usar `filesystem` | Sí | Ya existe `qa:lighthouse` con Lighthouse 12. LHCI solo sumaría asserts formales y comparativa. Opcional. | Free & OSS |
| **PageSpeed Insights API v5** | Google, https://developers.google.com/speed/docs/insights/v5/get-started | Lighthouse remoto + datos de campo CrUX | Gratis. **25 000 consultas/día por proyecto** según fuentes secundarias (unlighthouse.dev, PostHog); el límite por 100 s varía según la fuente (400 o 60). **NV en documentación oficial de Google.** | Recomendada; sin key funciona con throttling fuerte [según fuentes secundarias] | Términos de Google APIs | Google ve la URL (pública de todos modos) | Sí | Sirve para obtener **CrUX de campo** de `verk-site.netlify.app` cuando haya tráfico suficiente. Con poco tráfico, CrUX no tendrá datos [I]. | Free with limits |
| **Chrome DevTools MCP** | ChromeDevTools/chrome-devtools-mcp | Trazas, insights de rendimiento, consola, red, emulación, screenshots | Gratis | No | Apache-2.0, 54 888★, v1.12.0 (2026-10-22) | Telemetría **activada por defecto** (el repo ya la desactiva con `--no-usage-statistics` ✔). Las herramientas de rendimiento pueden enviar URLs de traza a la **API CrUX**: añadir `--no-performance-crux` si se prueba localhost o URLs privadas. | Sí | Ya configurado (`--isolated`). Es el que mejor sirve para depurar jank del canvas en emulación móvil con CPU throttling. | Free & OSS |
| **context7** | upstash/context7, https://context7.com | Docs actualizadas de librerías para el agente | Gratis con límites; key opcional para límites mayores [NV cifras] | Opcional | MIT (repo), 64 297★ | Las consultas salen a Upstash | Sí | Ya configurado. | Free with limits [NV] |
| **modern-web-guidance** | GoogleChrome, ver A.2 | Skills de plataforma moderna para agentes | Gratis | No | Apache-2.0 | Local (CLI) | Sí | Hace que el agente proponga `popover`, `dialog` y scroll-timeline en vez de librerías. | Free & OSS |
| **web-vitals** | GoogleChrome/web-vitals | Medición de LCP, INP y CLS | Gratis | No | Apache-2.0 | Local si no se envía a ningún lado | Sí | Inyectado en Playwright, mide el INP real de las interacciones móviles (menú, sheet). | Free & OSS |

---

## G. Auditoría de referencias (solo principios)

**Limitación:** no se hizo una inspección en dispositivo real ni emulación de cada sitio. Lo verificado es:
- La existencia y el reconocimiento: listado Awwwards SOTD consultado el 2026-11-06.
- La estructura del HTML de Locomotive y basement.studio, vía fetch.

Los principios son **[I]**, derivados de esa estructura y de patrones conocidos de estos estudios.

| Sitio | Verificado |
|---|---|
| **Locomotive** (locomotive.ca) | Header con logo, Work/Agency/Careers/Store, "Let's talk" y toggle de menú. Hero solo tipográfico ("Digital-First Design Agency"), sin imagen ni CTA. Trabajo como lista vertical de tarjetas (nombre + imagen + enlace) y una tarjeta final "All Work". |
| **basement.studio** | H1 + tagline. "Selected Work" como lista de 4 proyectos, cada uno con 1–2 frases **con resultado**. Servicios como 4 bloques con enlace a la vista filtrada. Clientes como línea de texto, no como muro de logos. |
| **Obys** | SOTD con "Grids" (2026-11-02) y "FORMAT" (2026-10-19). |
| **Studio K95** | SOTD "Agrumea Farm" (2026-11-05). Tiene capturas móviles en Awwwards Inspiration. |
| **Signal-A Studio** | SOTD de su propio sitio (2026-10-18). |
| **Studio Vi** (viamsterdam.com) | Captura móvil destacada en Awwwards Inspiration (sin premio confirmado). |

**Principios extraídos [I]:**
1. **La composición cambia, no se encoge.** En móvil, la cuadrícula editorial de escritorio pasa a una sola columna con un ritmo vertical fuerte. La tipografía grande se queda como protagonista, y las piezas de dos columnas pasan a secuencias, no a miniaturas.
2. **Hero tipográfico primero.** Los estudios fuertes abren con el titular como LCP. La pieza generativa acompaña y aparece después. Coincide con el requisito de VERK de un titular visible desde el primer frame.
3. **Navegación mínima.** Logo, 1 CTA ("Hablemos") y toggle a un overlay de pantalla completa con pocos ítems grandes, de 44 px o más. El overlay se apoya en la tipografía de marca y no usa iconos.
4. **Portafolio como lista con resultado.** Nombre del Sistema, una frase con el resultado (solo si es real; si no, un placeholder) e imagen opcional. En móvil, lista vertical o carril con scroll-snap. Nunca una cuadrícula de miniaturas diminutas.
5. **Movimiento ligado al scroll y no a timers.** Reveals por `view()` y un header que reacciona al scroll. Las piezas WebGL se simplifican en móvil (menos resolución, menos interacción, sin efectos de hover).
6. **Gestos solo donde el contenido lo pide.** Swipe horizontal en un carril de proyectos con snap nativo. Sin scroll-jacking ni pinning largo en móvil.
7. **El footer como cierre de marca.** Contacto directo, grande y pulsable. El canvas de partículas debe pausarse fuera de vista.

**Fuentes:**
- https://www.awwwards.com/websites/sites_of_the_day/
- https://locomotive.ca/en
- https://basement.studio/
- https://www.awwwards.com/inspiration/mobile_thumbnail-studio-vi

---

## Matriz comparativa consolidada

| Recurso | ★ | Último push | Release | Licencia | gzip | Riesgo de abandono | Clasificación |
|---|---|---|---|---|---|---|---|
| Plataforma nativa (scroll-timeline, VT, dialog/popover, snap, dvh, safe-area, @container, @starting-style) | — | — | Baseline 2026 | — | 0 | — | **Recomendado** |
| GoogleChrome/modern-web-guidance | 2 631 | 2026-11-06 | v0.0.197 (2026-11-02) | Apache-2.0 | n/a | Bajo (preview inestable) | **Recomendado** (workflow) |
| vercel-labs/web-interface-guidelines | 1 124 | 2026-10-05 | — | MIT | n/a | Bajo | Referencia conceptual |
| mdn/content + BCD | 11 127 | 2026-11-06 | BCD 8.1.8 | CC-BY-SA / CC0 | n/a | Nulo | **Recomendado** |
| Chrome DevTools MCP | 54 888 | 2026-11-06 | v1.12.0 (2026-10-22) | Apache-2.0 | n/a | Bajo | **Recomendado** (ya está) |
| web-vitals (en QA) | 8 668 | 2026-11-04 | 6.2.3 (2026-10-05) | Apache-2.0 | n/a en runtime | Bajo | Útil para experimentación |
| Lighthouse CI | 7 131 | 2026-11-03 | 0.16.0 (2026-11-02) | Apache-2.0 | n/a | Bajo | Útil para experimentación |
| Pa11y | 4 593 | 2026-11-02 | 10.0.0 (2026-08-28) | LGPL-3.0 | n/a | Bajo | No recomendado (redundante) |
| PageSpeed Insights API | — | — | v5 | Google ToS | n/a | — | Útil (free with limits; NV) |
| Utopia / Every Layout | — | — | utopia-core 1.6.0 (2024) | ISC / libro | 0 | — | Referencia conceptual |
| motion (`animate` mini) | 34 965 | 2026-11-07 | 14.10.1 | MIT | 3.2 KB mini / 22 KB híbrido | Bajo | Útil para experimentación |
| GSAP | 30 257 | 2026-11-04 | 3.15.1 | Propietaria, gratuita (Webflow) | 27 KB | Bajo técnico, medio contractual | Útil para experimentación (`lab/`) |
| Lenis | — | — | 1.3.27 | MIT | — | Bajo | No recomendado en móvil |
| three.js | 117 720 | 2026-10-30 | r187 | MIT | 186 KB (completo) | Bajo | Útil para experimentación |
| OGL | 4 749 | 2025-04-13 | 1.0.11 (2025-01) | Unlicense | 34 KB | **Alto** | Referencia conceptual |
| twgl.js | 3 033 | 2026-10-19 | 7.0.0 (2025-07) | MIT | 23 KB | Medio | Referencia conceptual |
| regl | 5 595 | 2026-10-17 | 2.1.1 (2024-11) | MIT | 38 KB | Medio | No recomendado |
| Lygia | 3 480 | 2026-10-24 | 1.4.1 (2026-02) | Prosperity (no comercial) + Patron | n/a | Bajo | **No recomendado** (licencia) |
| radix-ui/primitives | 19 479 | 2026-10-14 | react-dialog 1.3.1 | MIT | React | Bajo | Referencia conceptual (patrones a11y) |
| vaul | 8 688 | 2025-10-03 | 1.1.2 (2024-12) | MIT | React | Alto | Referencia conceptual (física de sheet) |
| shadcn-ui/ui | 127 523 | 2026-11-06 | — | MIT | React | Bajo | No recomendado |
| lucide | 25 612 | 2026-11-06 | 1.70.0 | ISC (+MIT) | — | Bajo | No recomendado (marca) |
| designresources.dev / freesets.dev / reinaldosimoes | — / — / 78 | — / — / 2026-08-21 | — | Por recurso / CC0 | — | — | No recomendado |

---

## Selección final (máximo 5, ninguna es dependencia de runtime)

1. **La plataforma nativa como stack de interacción móvil.**
   - **Qué entra:** scroll-driven animations (Baseline desde 10/2026, Firefox 159), View Transitions de mismo documento, `<dialog>` / `popover` + `@starting-style`, scroll-snap, `dvh`/`svh` + `env(safe-area-inset-*)` y `@container`.
   - **Justificación:** 0 KB, y respeta el orden de preferencia CSS → WAAPI del doc 21. El margen de JS (~1.4 KB) no admite librerías.
2. **GoogleChrome/modern-web-guidance**, como skill para los agentes en el flujo de trabajo.
   - **Justificación:** sesga las propuestas hacia lo nativo justo en este rediseño. Es oficial (Chrome + Edge), Apache-2.0 y activo.
   - **Condiciones:** fijar la versión, por ser 0.0.x, e instalarlo solo con aprobación.
3. **vercel-labs/web-interface-guidelines**, como checklist de revisión móvil.
   - Áreas de 44 px, `touch-action`, `overscroll-behavior` condicionado a `pointer: fine`, safe areas, alternativas a los gestos y Low Power Mode.
   - Se puede leer sin instalar nada.
4. **Chrome DevTools MCP (ya configurado) + `web-vitals` inyectado en Playwright.**
   - **Justificación:** sirven para medir INP, long tasks y jank de las piezas WebGL bajo emulación móvil con throttling de CPU.
   - **Acción sugerida:** añadir `--no-performance-crux` al `.mcp.json` cuando se trace localhost. Requiere aprobación, porque el archivo es del repo.
5. **Las técnicas de D aplicadas a los shaders propios, no una librería:** DPR adaptativo, render-on-demand, pausa por IO y visibilidad, presupuesto de frame con histéresis, `webglcontextlost` y OffscreenCanvas solo si la traza lo justifica.
   - Con WebGL2 propio ya escrito, OGL, regl, twgl y three no compensan su peso.
   - Lygia queda descartada para producción por su licencia.

**Explícitamente fuera:** shadcn, Radix y vaul (React), Lucide e iconos (marca), los directorios de recursos visuales (stock y genéricos), Lygia (licencia) y Lenis en el móvil.
- **GSAP** y **motion** se quedan en `lab/`. Motion mini (3.2 KB) solo entraría con `import()` diferido y si un spring no se puede expresar con `linear()`.

### Puntos no verificados que conviene confirmar
- Las cuotas oficiales de la PageSpeed Insights API: solo las confirman fuentes secundarias (25k/día).
- Los límites del plan gratuito de context7.
- La versión exacta de soporte de `<details name>`.
- La cifra de limitación de rAF en iOS Low Power Mode.
- El comportamiento móvil real de los sitios de referencia: no se emularon.
