# 23 · Integración de F3 en el sitio real

Fecha: 2026-11-05 · Referencia visual: `lab/f3-generative-experience/` · Sin commit, push ni deploy.

## Qué se integró

| Pieza | Dirección elegida | Dónde vive |
|---|---|---|
| Hero | B · Fluid Halftone, jerarquía A | `src/components/site/Hero.astro` + `src/scripts/field/*` |
| Isotipo | respiración orgánica + respuesta al cursor/toque, conectada al fluido | `src/scripts/field/{bars,mark}.js` |
| Sistemas | propuesta 1 de F3 (índice editorial + visor + panel) | `src/components/site/Systems.astro` + `src/scripts/site/portfolio.js` |
| Header | píldora geo + wipe, indicador A+B (ruta + isotipo), paleta de 5 variantes | `src/components/site/Header.astro` + `src/scripts/site/header.js` |
| Microinteracciones | Servicios, Método, Sistemas, Contacto, navegación | `src/styles/site.css` + `src/scripts/site/contact-mark.js` |

La home usa un layout nuevo (`src/layouts/Experience.astro`). `Layout.astro`, `/bot` y los componentes anteriores de
`src/components/*.astro` no se tocaron; los anteriores dejan de usarse en la home y no se borraron.

## Arquitectura del hero

```
boot.js ──(requestIdleCallback)──▶ import('field/index.js')       ← fuera del JS inicial
  runtime.js   lienzo · ciclo rAF (solo visible, pestaña activa, sin pausa) · escala adaptativa · pérdida de contexto
  ├─ gl.js       capa WebGL2 propia: programas reflejados, targets float, ping-pong (sin dependencias)
  ├─ mark.js     SDF por barra del SVG oficial · coreografía (entrada, respiración, ráfaga, salida, cursor)
  │   └─ bars.js   física de barras compartida con Contacto (muelles por barra, solo traslación a 45°)
  ├─ text.js     campo de distancia de los glifos reales del hero (no de sus cajas)
  ├─ fluid.js    Stable Fluids: CURL → FORCE → DIV → JACOBI×24 → GRAD → ADVECT · DYE (densidad + carga) → PACK
  ├─ glsl.js     ruido/curl · SDF de marca · TEXT · COMPOSITE (trama halftone 45°, anisotropía, color)
  ├─ config.js   todos los parámetros ajustables
  └─ tune.js     panel de deslizadores (solo con ?tune)
```

**Cambios respecto a F3**
- **Sin máscaras alrededor del texto.** Eliminadas las zonas de calma rectangulares (`uCalm`) y el sesgo de densidad hacia la marca (`uLean`); el patrón base cubre todo el hero. El fluido pasa por detrás, alrededor y cerca de las letras. El único margen que queda es el del isotipo, que es un obstáculo físico.
- **Interacción cromática con la tipografía.** `text.js` rasteriza una copia invisible de los glifos, palabra a palabra y en su posición real, y calcula su distancia exacta. El tinte del fluido tiene dos canales: R = densidad y G = carga. Una partícula que atraviesa una letra se carga, más cuanto más rápido va el flujo, y arrastra esa carga en su estela hasta disiparla. En la composición, el punto cargado o justo detrás de una letra pasa de violeta a violeta luminoso y después a violeta claro (#9291FC → #BEBDF8), y se reduce un poco. El texto nunca cambia de color y sigue siendo HTML accesible.
- **Isotipo conectado al campo.** Cada barra es un muelle subamortiguado (ζ ≈ 0.42, escalonado 1-2-3). El cursor o el toque las empuja por su eje y su velocidad las arrastra. Dentro de cada barra, el fluido toma la velocidad de la barra (obstáculo móvil), y al moverse emite más tinte: la perturbación se ve en el campo. La respiración autónoma suma tres senos de periodos inconmensurables (5.2 s, 3.3 s y 8.9 s), así que no se repite de forma perceptible.

**Parámetros ajustables** (`src/scripts/field/config.js`, y en vivo con `/?tune`)

| Bloque | Parámetros |
|---|---|
| `chroma` | `intensity`, `radius` (px), `response` (1/s), `transition` (s), `near`, `textDensity` |
| Trama | `density`, `contrast`, `cell`, `aniso`, `gap` |
| `mark` | `breath`, `reach`, `push`, `stiffness`, `damping` |
| Global | `speed`, `cursor`, `dprCap` |

## Cambios por sección
- **Header.** Igual que F3: píldora, wipe, ruta con nodos y el isotipo recorriéndola. Al llegar a una sección, las barras dan un paso 1-2-3. Novedades: subrayado que se dibuja al hacer hover, y la píldora móvil reaparece cuando recibe el foco del teclado.
- **Servicios.** Al hacer hover entra una barra del isotipo por su eje, se dibuja una línea ink de izquierda a derecha y el título avanza. Solo en punteros finos.
- **Método.** Ruta de 4 nodos ligada al scroll (CSS scroll-driven, sin JS), eco del indicador del header. Al hacer hover, el título y la flecha de la cota avanzan.
- **Sistemas.** El id del sistema activo se pone en lima, el chip de estado se desplaza, y el logo del visor entra por el eje de 45°. En el panel, la pestaña «En vivo» muestra un punto lima solo si existe vista real.
- **Contacto.** El isotipo de cierre responde al cursor y al toque con la misma física que el hero. El CTA lleva el isotipo y sus barras dan el paso 1-2-3 al hacer hover o recibir el foco.
- **Reduced motion.** Todo queda en su estado final, sin animaciones.

## Contenido
- **Fuentes.** Copy del sitio en producción (`src/components/*.astro`) y datos de sistemas de `lab/f1/systems/data.mjs`. Nada inventado.
- **Hero.**
  - Etiqueta «Infraestructura Digital», del sitio en producción; F3 usaba un placeholder con ubicación no verificada.
  - «Ver proyectos» pasa a «Ver sistemas» (doc 16).
  - Se retiró la línea «Para clínicas, despachos y negocios que han superado las plantillas.»: la jerarquía A aprobada no la incluye. ⏳ Confirmar.
- **Método.** Textos completos de producción (F3 los había acortado).
- **Contacto.** El enlace de WhatsApp es el placeholder existente (`52XXXXXXXXXX` ⏳).
- **Footer.** Composición de F3 más el copyright. Se omitieron:
  - los enlaces a `/privacidad` y `/terminos` (no existen, dan 404);
  - el bloque de WhatsApp duplicado.

  ⏳ Confirmar.
- **OG image.** `/images/isotipo.png`: `logo.png` ya estaba borrado del working tree. ⏳ Confirmar.

## Embebido (comprobado 2026-11-05, una petición por sitio, sin evadir políticas)

| Sistema | URL | Política | En el panel |
|---|---|---|---|
| SIS-01 Sonoro | sonoro-six.vercel.app | sin X-Frame-Options ni frame-ancestors | iframe real al seleccionar el proyecto |
| SIS-03 PRISMA | prisma-site-eight.vercel.app | `X-Frame-Options: DENY` | respaldo: logo, motivo y «Abrir sitio ↗» |
| SIS-05 CleanSolarAus | cleansolaraus.com | `X-Frame-Options: SAMEORIGIN` | respaldo |
| SIS-08 Los Fibos | losfibos.com → www.losfibos.com | embebible | en espera: contenido pendiente de aprobación, sin iframe ni enlace |
| SIS-10 WATERLÜ | waterlu.com.mx | `X-Frame-Options: DENY` | respaldo |
| SIS-02, 04, 06, 07, 09 | — | sin sitio público | «Sin vista en vivo» y su motivo |

Ningún iframe al cargar la página. Solo hay uno como máximo, y se destruye al cerrar el panel. Va con `sandbox` y `referrerpolicy="no-referrer"`.

## Validación
Herramientas: `scripts/qa/f3-integration.mjs`, `scripts/qa/f3-micro.mjs` y la suite `tests/qa`. Resultados y capturas en `qa-artifacts/f3-integration/` (capturas `real-*` y `f3-*` a 1440, 1024, 768 y 390, más hojas `_comparacion-f3-vs-real-*`).
Las mediciones están en el informe de entrega y en `qa-artifacts/f3-integration/results.json`.

### Mediciones (Chrome del sistema, MacBook Pro 2015, `astro preview`)

**Hero**

| | Resultado |
|---|---|
| Fluidez | 60 FPS (p95 de frame 16.7 ms) a 1440 y 390 |
| CPU JS por frame | 0.2 ms (p50) y 0.3 ms (p95) |
| Escala adaptativa | 1 (sin degradar) |
| Memoria GPU | 3.5 MB a 1440 · 1.2 MB a 390 |
| Fuera de vista | 0 frames |
| En pausa | 0 frames tras el primero |
| Recuperación del contexto | 129–145 ms |
| Sin WebGL2 | póster AVIF; la marca sigue visible |
| Reduced motion | 0 frames de animación |
| Sin JS | H1 y marca visibles |

**Isotipo**

| | Resultado |
|---|---|
| Movimiento | solo traslación a 45°; sin rotación ni escala |
| Respiración autónoma | 3.2–5.2 px de recorrido |
| Respuesta al cursor | 13–23 px; vuelve a su estado autónomo al retirarse |
| Toque | presencia 0.83 y ráfaga; vuelve a 0 a los 2 s |

**Peso y carga**

| | Resultado |
|---|---|
| JS total | 17.3 KB transferidos: 6.2 KB gzip iniciales + 10.6 KB del hero diferido (presupuesto 20) |
| CSS | 6.3 KB |
| Fuentes | 12.8 KB (escritorio) · 26.1 KB (390) |
| Vitales | LCP = H1 (136–140 ms en local) · CLS 0 |

**Inicio del hero.** Se encontraron y corrigieron dos bloqueos del hilo principal:
- `powerPreference: 'high-performance'` forzaba el cambio a la GPU discreta: ~580 ms bloqueado. Ahora es `default`.
- Sin `KHR_parallel_shader_compile`, los 12 programas se compilaban en una sola tarea. Ahora va una tarea por programa, y la geometría se reparte en tareas cortas.

Resultado de la suite de rendimiento:

| Perfil | Tareas largas | Presupuesto |
|---|---|---|
| Escritorio | 0–115 ms | 200 ms ✓ |
| Tablet | 43–58 ms | 200 ms ✓ |
| Móvil emulado (CPU ×4, red lenta) | 251–334 ms | 200 ms ✗ (~150 ms son el layout de la página) |

**Header.** 0 desajustes de color y sección en todo el recorrido, a 1440 y 390. Menú móvil: abre, recibe el foco y cierra con Escape.

**Accesibilidad.**
- axe WCAG 2.2 AA: 0 violaciones a 1440, 1024, 768 y 390.
- Scroll horizontal: 0.
- Teclado: el foco visible recorre salto de contenido → marca → links → CTA → botones del hero.

**Suite `tests/qa`.** Pasa todo en la home, salvo dos puntos:
- el placeholder de WhatsApp (ya existía);
- las tareas largas en el móvil emulado.

Los fallos de `/bot` (404 de `/fonts/NHaas*.woff2` y `<pre>` sin foco) vienen de `Layout.astro`, `global.css` y `typography.css`, que no se modificaron.

## Decisiones pendientes
1. **Tipografía.** NHG vía `local()`: solo la ve quien la tiene instalada; el resto ve Helvetica Neue/Arial. Opciones: licencia webfont de NHG o Instrument Sans (doc 21).
2. **Contenido.** Confirmar la microcopy retirada del hero, el footer sin legales ni WhatsApp duplicado, y la OG image.
3. **Contacto.** Número de WhatsApp real.
4. **Los Fibos.** Aprobación de contenido; con ella, su vista en vivo funciona (el sitio es embebible).
5. **Capturas de producto.** Autorización para capturar PRISMA, CleanSolarAus y WATERLÜ (no embebibles) y usarlas como vista estática en el panel.
6. **Móvil.** Mover el cálculo de SDF a un Worker para bajar de 200 ms con CPU ×4.
7. **Pruebas reales.** Safari, Firefox y dispositivos (el `view-timeline` de Método cae a la ruta completa sin animar en Firefox).
8. **Limpieza.** Retirar los componentes antiguos de `src/components/` y `src/scripts/` cuando se apruebe.

## Correcciones posteriores (2026-11-05, preparación de producción, ver docs/24)

**Contenido y portfolio**
- WhatsApp real (`+52 479 320 1003`, mensaje prellenado) en un solo origen (`src/data/contact.js`). Los CTA del header y del menú llevan a `#contacto`.
- Capturas fechadas de las portadas públicas de PRISMA, CleanSolarAus y WATERLÜ en el panel (`public/systems/*-site.webp`).
- El iframe de Sonoro se crea después de pintar el panel.

**Rendimiento**
- La distancia exacta (EDT) del isotipo y del texto corre en un Worker (`src/scripts/field/edt.worker.js`).
- El campo ignora el puntero cuando el hero no está visible.
- ⏳ → ↗ pasan a SVG en línea (`src/scripts/site/icons.js`): su búsqueda de fuente de respaldo costaba 250–475 ms de layout.

**Compatibilidad**
- WebKit: el hero usa su propia plantilla de columnas. En el subgrid, WebKit resolvía mal las líneas con nombre (H1 a 4.9 px).
- Respaldo JS de la ruta de Método donde no hay `animation-timeline` (Firefox, Safari).
- Respaldos de unidades de contenedor y de subgrid para Safari < 16.

**Limpieza**
- Eliminados 13 componentes antiguos que la home ya no importaba.
