# 24 · Production readiness: integración F3

Fecha: 2026-11-05 · Rama: `main` · Remoto: `origin` (github.com/servindigitalart/verk) · Netlify publica `main`
(`netlify.toml`: `npm run build` → `dist/`, Node 22.16.0).

## Refinamiento (2026-11-06, tarde)
Refinamiento sobre producción a partir de los comentarios del usuario. **Hero y Footer no se modificaron** (ni sus
componentes, ni sus scripts, ni su CSS).

### Header
- **Un único isotipo.** El del CTA «Auditoría» se eliminó, también en el CTA del menú. Queda solo el isotipo de progreso.
- **Defectos eliminados.**
  - La «línea negra» sobre el isotipo era el borde de la copia del wipe que atravesaba la píldora: se retiró la copia.
  - Las esquinas cuadradas venían de las geometrías por sección de la fase anterior: ahora la píldora es siempre redondeada.
  - El contorno del isotipo de progreso ya no se dibuja bajo el relleno, así que no hay trazos superpuestos.
- **Transición cromática.**
  - Al cambiar de sección, el fondo recorre en 760 ms un degradado origen → acento del destino → destino, en el sentido del scroll.
  - Texto y CTA cambian de color a mitad del barrido.
  - El cambio ocurre cuando la frontera cruza la línea media de la píldora.
- **Glow.** El isotipo recibe un brillo breve (`drop-shadow`) en su propio color.
- **Navegación.** Interrupción, re-dirección, historial, teclado y reduced-motion se conservan.

### Servicios
- **Eliminados:** el contador de barras previo al título y los isotipos de cada disciplina.
- **Jerarquía:** contador grande → un único isotipo protagonista (izquierda, sticky) → título y disciplinas → descripciones.
- **Isotipo procedural.** Solo traslación por el eje de 45°. Combina:
  - una composición que se interpola en continuo entre cuatro estados según el progreso;
  - una deriva orgánica (senos de periodos inconmensurables) cuya energía nace del scroll y se disipa en unos 3 s (sin bucle infinito, doc 21 §5);
  - un asentamiento en lima al integrarse las cuatro;
  - un color estable por disciplina, con cruce breve en la frontera.

### Sistemas
**Panel de proyecto**, compacto y sin scroll interno (alto ≤ viewport).

| Pestaña | Contenido |
|---|---|
| Vista | Identidad + captura principal (pantalla 1) + nombre, estado y descripción |
| Arquitectura | Capas escalonadas + stack (se conserva su diseño) |
| Sitio | Dos capturas adicionales (pantallas 2 y 3) + «Abrir sitio ↗» |

- **Sin iframes.** Sonoro también se presenta con capturas reales (3 pantallas, 2026-11-06).
- **Contaminación entre pestañas: causa y solución.** Todas las vistas vivían a la vez en el escenario como capas ocultas por CSS. Con el estado `pfx--solo` y las transiciones, la arquitectura asomaba detrás de «En vivo». Ahora el escenario se re-renderiza por completo en cada cambio de pestaña o de proyecto (`panel.js`): cada combinación solo contiene sus nodos.
- **Pestaña «Sitio» y enlaces externos.** Solo para proyectos con URL pública aprobada y capturas: Sonoro, PRISMA, CleanSolarAus y WATERLÜ.
- **Sin «Sitio» ni enlace:** Los Fibos (en revisión) y DocLink, UX Analyzer, Riot, Bufón y Bloom Undies (sin sitio público).

**Animación procedural «Isolíneas»** (`systems-field.js`):
- **Qué es:** un mapa topográfico de curvas de nivel (fBm) en WebGL2, dibujado en un lienzo sticky del tamaño del viewport.
- **Scroll:** el desplazamiento hace avanzar el terreno.
- **Proyecto activo** (la fila en el centro): levanta una cresta y tiñe las curvas con el color dominante de su logo (derivado de los logos reales; sin color propio, violeta).
- **Coste:** líneas de 1 px y opacidad ≤ 0.52; ~30 fps; DPR ≤ 1 (0.75 en móvil); solo con la sección visible.
- **Sin WebGL2, con reduced-motion o con Save-Data:** fondo ink.

### QA (carga del equipo < 5; Chrome salvo indicación)
**Funcional**

| Prueba | Resultado |
|---|---|
| Panel | Los 10 proyectos en todas sus pestañas: datos propios por pestaña, 0 iframes, 0 px de scroll interno, ≤ 2 capturas, foco devuelto |
| Header | 0 desajustes de color/sección a 1440 y 390 |
| Interacciones (`f3-micro.mjs`) | Modo lima, viaje y re-dirección, Servicios 0 → 4, Método, Contacto, footer y reduced-motion correctos |

**Accesibilidad y responsive**
- axe WCAG 2.2 AA: 0 violaciones en `/` (1440, 1024, 768, 390) y `/bot`.
- Scroll horizontal: 0 a 1920, 1440, 1024, 768 y 390.

**Rendimiento y tests**

| Prueba | Resultado |
|---|---|
| Lighthouse local | Móvil 100 (LCP 1.5 s, TBT 30 ms) · Escritorio 100. Accesibilidad, buenas prácticas y SEO 100 |
| Lighthouse en producción | Móvil 100 (LCP 1.0 s, TBT 0 ms, CLS 0) · Escritorio 100 (LCP 0.3 s). Accesibilidad, buenas prácticas y SEO 100 |
| Presupuesto (en serie) | JS 19.5 KB · tareas largas: escritorio 0 ms, tablet 0 ms, móvil ×4 144 ms ✓ |
| INP aproximado | Escritorio 80 ms · móvil ×4 120 ms |
| `tests/qa` | 34/35 en paralelo (falla el presupuesto móvil por contención); en serie pasa |

**Navegadores**
- **Firefox 121 y WebKit 17.4:** header, isolíneas, panel (3 pestañas, sin scroll) y Servicios correctos.
- **Sin probar:** Safari real y dispositivos reales.

**Publicación**
- Commit `013ddc9` en `main` (`2e04e16..013ddc9`); Netlify sirvió la versión nueva a las 17:19:31 UTC.
- Verificado en https://verk-site.netlify.app/ a 1440 y 390 (`verify-deploy.mjs` y `f3-micro.mjs`):
  - Sonoro y WATERLÜ: Vista con 1 captura, Arquitectura con 0, Sitio con 2; 0 iframes, 0 px de scroll interno, todas las imágenes cargadas, «Abrir sitio» a su URL real.
  - Modo lima, viaje, Servicios 0 → 4, Contacto y footer correctos.
  - 0 errores de consola (ya no hay iframe de Sonoro).
  - `/bot`, `robots.txt`, sitemap, imagen OG y póster responden 200; las rutas inexistentes, 404.

## Rediseño de experiencia (2026-11-06)

Rediseño integral sobre el sitio real (sin laboratorios). Commit `2761d1d`, publicado en Netlify a las 06:17:22 UTC
(29 s después del push). Identidad intacta: paleta, tipografía, isotipo (solo traslación por su eje), copy y `/bot`.

### Decisiones de diseño
| Pieza | Decisión | Por qué |
|---|---|---|
| Hero | Se conservan composición, Fluid Halftone y respiración. **Modo lima:** el cursor o el toque sobre el isotipo (barras + 24 px) llevan marca y partículas de violeta a lima en ~380 ms (uniform `uLime` en el composite; mismo campo, sin recrearlo). **Subtítulo:** dos niveles tipográficos (promesa / tres negaciones), revelado en secuencia y una capa óptica de color (`text-shadow`) que se desplaza con el cursor y toma el color del modo | La interacción vive dentro del sistema generativo. La profundidad no duplica texto (legible y accesible) |
| Header | **Morphing:** cada superficie tiene su geometría (`.pill-bg` + `clip-path`: píldora, tarjeta, terminal, expandida) y un gesto de profundidad al cambiar. **Progreso:** el isotipo oficial (26 px) se construye con el recorrido mediante un barrido a 45° (contorno → relleno) y avanza un paso 1-2-3 en cada sección | La marca representa el avance («el sistema se construye») sin deformarse |
| Navegación | **Viaje espacial** en todos los enlaces internos (header, menú, botones, footer): curva de doc 21 §13, ≤ 900 ms; tres barras a 45° con los colores del destino; etiqueta «hacia · sección»; revelado del título al llegar; foco e historial. Interrumpible y redirigible. Nativo con reduced-motion | Sensación de desplazamiento real sin romper enlaces, teclado ni historial |
| Botones | Escala de proximidad (3 %), barrido de relleno a 45°, isotipo interno que avanza por su eje, presión anticipada (0.97) y `:active` táctil | Objetos físicos, sin rebotes exagerados |
| Servicios | **4 → 1:** el título cuenta cuatro unidades que se encienden y acaban en lima; un isotipo fijo recompone sus barras y su color en cada disciplina y termina integrado en lima. Cada disciplina tiene su firma (la misma marca, otra traslación) | Narrativa ligada al scroll con una sola marca |
| Método | La línea es la protagonista: trazo de 3 px, chispa lima en la cabeza, nodos con pulso violeta y núcleo lima. Al completarse, el isotipo se ensambla al final de la ruta. Mismo comportamiento en todos los navegadores | Conclusión visual del método |
| Sistemas | **Project Frames:** escenario en capas (identidad, captura principal, captura secundaria, arquitectura en barras escalonadas, sitio) con entrada en secuencia (identidad → máscara → barrido a 45° → título); se reorganiza en cada pestaña. Pestañas: Vista · Arquitectura · En vivo (solo Sonoro) o Sitio (capturas reales + enlace). Notas internas eliminadas de la interfaz y de los datos públicos | Imágenes con protagonismo, sin simular vistas en vivo |
| Contacto | **Contact Activation**, secuencia ligada al scroll: convergencia de barras → ensamblaje del isotipo con asentamiento de muelle → titular línea a línea → el botón se construye (clip-path + escala) → estado interactivo. CTA magnético (≤ 6 px), con escala al acercarse y transición de lanzamiento al abrir WhatsApp | El momento más satisfactorio después del hero |
| Footer | **Residual Field** (Canvas 2D propio, no el shader del hero): residuo de partículas nacido sobre las barras del isotipo, trazos a 45° con estela, atracción con giro por el cursor y repulsión al presionar. Cierre «Seguimos construyendo.», contacto, secciones, Instagram y LinkedIn (iconos sin enlace), wordmark discreto, año y créditos | Pieza final de diseño, no administrativa |

### Arquitectura y rendimiento
- **Sin dependencias nuevas.** CSS + JS propio + WebGL ya existente. GSAP no fue necesario.
- **Carga:**
  - JS inicial: **4.0 KB gzip** (antes 6.7).
  - Al acercarse cada sección se cargan Servicios, Método, Contacto y el footer.
  - El panel se carga al primer gesto sobre el índice.
  - El hero sigue con `requestIdleCallback`.
- **Build:** el GLSL se compacta con un plugin de Vite en `astro.config.mjs`.
- **WebKit:** el hero y Contacto usan plantilla de columnas propia (por un fallo de subgrid en WebKit).
- **Sin JS:** cada sección queda en su estado final (`data-act`, `data-live`, `data-k="4"`).

### Archivos
- **Nuevos:** `src/scripts/site/{travel,services,contact,footer-field,panel}.js`, `public/systems/*-site-2.webp`, `scripts/qa/full-pages.mjs`.
- **Modificados:**
  - Componentes: `src/components/site/*`.
  - Estilos y datos: `src/styles/site.css`, `src/data/{contact,systems}.js`.
  - Hero: `src/scripts/field/{glsl,runtime,config}.js`.
  - Sitio: `src/scripts/site/{boot,header,portfolio,method-route}.js`.
  - Configuración: `astro.config.mjs`.
  - QA: `scripts/qa/*`.
- **Eliminado:** `contact-mark.js` (sustituido por `contact.js`).

### QA y rendimiento (medido)
**Entorno.** Chrome del sistema en este MacBook Pro 2015.
- Durante parte de la sesión, Android Studio/Gradle (340–460 % de CPU), el simulador iOS y Stremio dejaron la carga en 37–56 (4 núcleos).
- Las mediciones bajo esa carga se descartaron y se repitieron automáticamente con carga < 4.

**Funcional, en local y en producción** (`scripts/qa/f3-micro.mjs`, `f3-integration.mjs`, `verify-deploy.mjs`)

| Pieza | Resultado |
|---|---|
| Modo lima | Solo sobre el isotipo (fuera: violeta; encima: lima; al salir: violeta); en táctil, con el toque |
| Viaje | Clic en Método y re-dirección a Contacto a mitad de viaje → llega a `#contacto`, top 0, foco en la sección, historial actualizado; menú móvil → `#sistemas` |
| Botones | Hover: escala 1.03, barrido a 45°, color invertido; `:active` 0.97 |
| Servicios | `data-k` 0 → 1 → 2 → 4 con el scroll |
| Método | Ruta completa y `data-done` (isotipo ensamblado) |
| Contacto | `--cp` 0.55 a mitad y 1 al llegar; CTA magnético (2.45 px de imán, escala 1.06) |
| Footer | Campo residual activo; redes como iconos sin enlace |
| Reduced motion | Servicios 4, Contacto 1, ruta 1, sin viaje |
| Panel | 10 sistemas con sus pestañas correctas; Sonoro con iframe (0 iframes al cargar); foco devuelto al cerrar |
| Header | 0 desajustes de color o sección a 1440 y 390 |
| Hero | 60 FPS; 0 frames fuera de vista; recuperación de contexto 140–330 ms; póster sin WebGL; reduced-motion estático; H1 visible sin JS |
| Isotipo | Solo traslación a 45° (verificado) |

**Accesibilidad y responsive**
- axe WCAG 2.2 AA: 0 violaciones en `/` a 1440, 1024, 768 y 390, y en `/bot`.
- Scroll horizontal: 0 a 1920, 1440, 1024, 768 y 390.
- Teclado: foco visible en todo el recorrido.

**Rendimiento**

| | Antes del rediseño | Después del rediseño |
|---|---|---|
| JS inicial | 6.7 KB gzip | **4.0 KB gzip** |
| JS en la carga (test) | 19.3 KB | 18.9 KB (≤ 20) |
| CSS | 6.3 KB | 9.5 KB (≤ 15) |
| Tareas largas, móvil CPU ×4 (carga < 4) | 177–236 ms | **148–196 ms** ✓ |
| Tareas largas, escritorio / tablet | — | 10–34 ms |
| LCP (H1), local / producción | — | 160–700 ms / 0.9–1.6 s |
| CLS | — | 0 |

**Lighthouse en producción**

| Ejecución | Móvil | Escritorio |
|---|---|---|
| Con el equipo descargado | 100 (TBT 60 ms) | 99 |
| Bajo carga | 84–87 (TBT 400–630 ms) | 95 |

Accesibilidad, buenas prácticas y SEO: 100 en todas las ejecuciones.

**INP aproximado en producción:** 120 ms en escritorio; 152 ms en móvil con CPU ×4.

**Suite `tests/qa`:** 33/35 en paralelo bajo carga. En serie y con carga baja, el presupuesto de rendimiento pasa en los tres perfiles.

**Navegadores**
- **Firefox 121 y WebKit 17.4** (builds de Playwright): modo lima, viaje, Servicios, Método, Contacto, footer, header y panel correctos.
- **WebKit:** se corrigió la rejilla de Contacto, que tenía el mismo fallo de subgrid que el hero.
- **Sin probar:** Safari real (requiere activar «Permitir automatización remota»), dispositivos reales y 1920 en Firefox/WebKit.
- **No se pudo usar PageSpeed Insights:** su API devolvió «quota exceeded» sin clave.

### Embebido: diagnóstico y acciones manuales
Comprobado en las respuestas en vivo (2026-11-06) y en el código de cada proyecto. **No se modificó ningún proyecto.**

| Proyecto | Estado | Causa | Acción para permitir el embebido en VERK |
|---|---|---|---|
| Sonoro | ✅ Embebible | Sin cabeceras de bloqueo | Ninguna |
| PRISMA | ❌ | `X-Frame-Options: DENY` en `prisma-site/vercel.json` (Vercel) | Ver abajo |
| WATERLÜ | ❌ | `X-Frame-Options = "DENY"` en `waterlu/netlify.toml` | Ver abajo |
| CleanSolarAus | ❌ | `X-Frame-Options: SAMEORIGIN` en `clean-solar-bot/cleansolaraus/public/_headers` (Cloudflare Pages) | Ver abajo |
| Los Fibos | ⚠️ Embebible hoy, sujeto a aprobación de contenido | El sitio publicado no envía cabeceras, pero su repo (`fibosweb/netlify.toml`) declara `X-Frame-Options = "DENY"`: el próximo deploy desde ese repo lo bloqueará | Al aprobar el contenido, aplicar el mismo cambio en `fibosweb/netlify.toml` |
| DocLink | — | Sin URL pública estable (el preview expone un usuario) | Publicar un dominio propio; después, mismo cambio |

**Acciones por proyecto:**
- **PRISMA** (`prisma-site/vercel.json`): sustituir `{ "key": "X-Frame-Options", "value": "DENY" }` por `{ "key": "Content-Security-Policy", "value": "frame-ancestors 'self' https://verk-site.netlify.app https://verk.mx https://www.verk.mx" }`. Redeploy en Vercel.
- **WATERLÜ** (`waterlu/netlify.toml`): sustituir la línea por `Content-Security-Policy = "frame-ancestors 'self' https://verk-site.netlify.app https://verk.mx https://www.verk.mx"`. Redeploy en Netlify.
- **CleanSolarAus** (`clean-solar-bot/cleansolaraus/public/_headers`): sustituir la línea por `Content-Security-Policy: frame-ancestors 'self' https://verk-site.netlify.app https://verk.mx https://www.verk.mx`. Redeploy en Cloudflare Pages.

Notas para aplicar los cambios:
- **Retirar `X-Frame-Options`.** No admite listas de dominios, y `frame-ancestors` lo sustituye en navegadores modernos.
- **Dominios autorizados.** Solo los de VERK, no `*`. Si `verk.mx` no llega a usarse, basta con `https://verk-site.netlify.app`.
- **Después del cambio,** marcar el sitio como `embeddable: true` en `src/data/systems.js`: el panel ofrecerá «En vivo» en lugar de «Sitio».
- **No se usan proxies** ni otras formas de evadir las políticas.

### Pendiente de aprobación
- **Los Fibos:** contenido pendiente. Sin enlace ni vista en vivo; restricción mantenida en `src/data/systems.js`.
- **Perfiles de Instagram y LinkedIn:** completar `SOCIAL` en `src/data/contact.js`.

## A. Completado (fase anterior: integración F3)

### Integración (sin rediseño)
Hero B Fluid Halftone, isotipo vivo, Portfolio Index, header geo + wipe con ruta e isotipo, y microinteracciones: como
en `docs/23`. Se revisó contra F3 en Chrome, Firefox y WebKit (capturas en `qa-artifacts/f3-integration/shots/`).

### Correcciones de esta fase
| Área | Cambio | Archivos |
|---|---|---|
| Contacto | WhatsApp real `+52 479 320 1003` (`wa.me/524793201003`) con mensaje prellenado; el número no se muestra; un único enlace (Contacto), al que llevan los CTA del header y del menú | `src/data/contact.js`, `src/components/site/Contact.astro` |
| Portfolio | Capturas reales de las portadas públicas de PRISMA, CleanSolarAus y WATERLÜ (autorizadas, 1440×900, fechadas y rotuladas «no es una vista en vivo») | `public/systems/*-site.webp`, `captures.json`, `scripts/qa/capture-systems.mjs`, `src/data/systems.js`, `src/scripts/site/portfolio.js` |
| INP del panel | El iframe de Sonoro se crea después de pintar el panel; el campo ya no lee el layout en toques fuera del hero | `portfolio.js`, `src/scripts/field/runtime.js` |
| Long tasks | Distancias exactas (EDT) del isotipo y del texto en un **Web Worker** (ver medición abajo) | `src/scripts/field/edt.js`, `edt.worker.js`, `mark.js`, `text.js` |
| Layout | Los glifos ⏳ → ↗ se sustituyen por SVG en línea. Ni NHG ni el subconjunto latino de Geist Mono los tienen, y su búsqueda de fuente de respaldo costaba 250–475 ms de layout con CPU ×4 | `src/scripts/site/icons.js`, `Systems.astro`, `Method.astro` |
| Firefox / Safari | Respaldo JS de la ruta de Método donde no existe `animation-timeline` (antes aparecía completa) | `src/scripts/site/method-route.js`, `site.css` |
| WebKit | El hero tiene su propia plantilla de columnas: WebKit resolvía mal las líneas con nombre del subgrid (H1 a 4.9 px a 1440) | `site.css` |
| Safari < 16 | Respaldos sin unidades de contenedor (H1 en vw) y sin subgrid (plantilla explícita) | `site.css` |
| SEO | Ver «Estado SEO» | `astro.config.mjs`, `src/layouts/Experience.astro`, `src/pages/robots.txt.ts`, `src/pages/404.astro`, `public/og/verk-og.png`, `scripts/og-image.mjs` |
| /bot (separado) | Ver «/bot» | `src/styles/typography.css`, `src/pages/bot.astro` |
| Limpieza | 13 componentes antiguos sin importar, eliminados (siguen en el historial de git) | `src/components/*.astro` |

### Medición del Worker (CPU ×4, 390 px, tres cargas por caso)
| | Tareas largas del campo |
|---|---|
| Antes | 53–201 ms + 92–128 ms + 59 ms (SDF del isotipo: 90–150 ms en el hilo principal) |
| Después | 50–93 ms + 50–85 ms |

Mejora medible. La geometría llega unos milisegundos después y sin cambio visual. Se conserva.

## Resultados de QA (preview local de producción: `astro build` + `astro preview`)

### Comprobaciones generales

| Prueba | Resultado |
|---|---|
| `astro check` | 0 errores · 0 avisos |
| `astro build` | OK. Páginas: `/`, `/bot`, `/404`, `/robots.txt` y sitemap |
| `tests/qa` (Playwright, 1440/768/390) | **34/35**. Falla solo el presupuesto lab de tareas largas en móvil con CPU ×4: **177–236 ms** frente a 200 (antes 251–412). Escritorio 0–110 ms, tablet 0–64 ms |
| axe WCAG 2.2 AA | 0 violaciones en `/` a 1440, 1024, 768 y 390; 0 en `/bot` |
| Teclado | Foco visible: salto de contenido → marca → links → CTA → botones del hero. Panel: Enter abre; las flechas cambian de pestaña; Escape cierra y devuelve el foco. Menú móvil: Escape cierra |
| Scroll horizontal | 0 a 1440, 1024, 768 y 390 |
| Consola y red | Sin errores propios. Dentro del iframe de Sonoro, su `/_vercel/insights/script.js` da 404 (es del sitio externo) |
| Carga diferida | El hero y el Worker se cargan tras `requestIdleCallback`; 0 iframes al cargar; el respaldo de Método solo carga donde hace falta |
| Contexto WebGL | Recuperación tras pérdida en 116–157 ms |
| Sin WebGL2 | Póster AVIF, isotipo visible |
| Reduced motion | 0 frames de animación; isotipo y rutas en estado final |
| Sin JS | Contenido completo: H1 y marca visibles |

### Lighthouse (local, preview)
| | Rendimiento | Accesibilidad | Buenas prácticas | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| Móvil | 98–100 | 100 | 100 | 100 | 1.4 s | 0 | 70–170 ms |
| Escritorio | 100 | 100 | 100 | 100 | 0.3 s | 0 | 0 ms |

### Core Web Vitals (laboratorio)
- **LCP:** el H1. 1.4 s en Lighthouse móvil.
- **CLS:** 0.
- **INP aproximado** (`scripts/qa/inp.mjs`, Event Timing con interacciones reales: tocar el hero, menú, navegar, abrir el panel, cambiar de pestaña):

  | Perfil | INP | Antes de las correcciones |
  |---|---|---|
  | Escritorio | 48–248 ms | — |
  | Móvil CPU ×4 | 112–296 ms (mediana ≈ 180) | ≈ 800 ms |

  Los valores altos coinciden con el arranque del campo. **No es INP de campo:** hay que medir con usuarios reales.

### Presupuestos (doc 21 §18)
| | Resultado | Presupuesto |
|---|---|---|
| JS inicial | 6.7 KB gzip | 20 KB |
| JS diferido | hero 11.0 KB + Worker 0.5 KB + respaldo de Método 0.6 KB | — |
| CSS | 6.3 KB gzip | 15 KB |
| Fuentes | Geist Mono latin 12.8 KB en escritorio · 26.1 KB en móvil (dos pesos) | 120 KB |

### Navegadores y dispositivos
| Navegador | Probado | Resultado |
|---|---|---|
| Chrome 14x (sistema), escritorio y móvil emulado | Sí | Todo lo anterior |
| Firefox 121 (build de Playwright, 1440 y 390) | Sí | Campo WebGL OK; ruta de Método por respaldo JS ✓; header, panel (Sonoro en vivo y captura de PRISMA) y WhatsApp ✓; sin scroll horizontal |
| WebKit 17.4 (build de Playwright: motor de Safari, **no** Safari) | Sí | Igual que Firefox, tras corregir el subgrid del hero |
| Safari 15.6.1 real (este Mac) | **No** | `safaridriver` exige activar «Permitir automatización remota» en el menú Desarrollo. Hay respaldos para cq y subgrid, pero sin verificar |
| iPhone o Android real | **No** | No hay dispositivos disponibles. Lo móvil es emulación (390 px, táctil, DPR 3, CPU ×4), que no reproduce la GPU ni la térmica de un teléfono |

Playwright actual ya no publica Firefox ni WebKit para macOS 12. Se usaron los builds ya instalados en este equipo con
`playwright-core@1.41.2`, fuera del proyecto (`scripts/qa/cross-browser.mjs`, `PWCORE=<ruta>`).

## Estado de tipografía
- **Hoy:** NHG solo vía `local()`. La ve quien la tenga instalada; el resto ve Helvetica Neue o Arial. Sin cambios de composición.
- **Recomendación** (pendiente de aprobación y compra; no se ha comprado nada):
  1. **Licencia webfont de Monotype/MyFonts para autoalojar** los 3 cortes que usa el sitio: NHG Text 55 Roman (400), 65 Medium (500) y 75 Bold (700).
     - El precio va por pageviews/mes y por estilo (tabla multiplicadora de Monotype; base ×1 hasta 10 000 pageviews).
     - Permite servir woff2 propios desde Netlify, sin terceros ni cambios de CSP.
     - Los cortes Pro cubren el español (á é í ó ú ñ ü ¿ ¡).
     - Con subconjunto latino, cada woff2 pesa del orden de 25–35 KB → unos 90 KB más Geist Mono: dentro de los 120 KB.
     - **Antes de comprar, confirmar en el contrato** el tope de pageviews, si es anual o perpetua, el número de dominios y si permite subsetting.
  2. **Alternativa: Adobe Fonts.** La familia está en el catálogo (Monotype) para proyectos web, incluida en Creative Cloud. Se sirve desde el CDN de Adobe (no se autoaloja), añade una petición a terceros y depende de la suscripción.
- **Al aprobar:** colocar los woff2 en `public/fonts/`, añadir `@font-face` con `url()` a `site.css` (y reactivar los de `typography.css` para `/bot`) y, si se quiere, precargar el corte 700 del H1.

## Estado de contacto
- WhatsApp real con mensaje prellenado. Funciona en escritorio (WhatsApp Web) y en móvil (app), en una pestaña nueva.
- El nombre accesible del enlace indica que es por WhatsApp.
- No hay más datos de contacto: no se inventan correo, teléfono visible ni dirección.

## Estado SEO
- **Dominio canónico** (`astro.config.mjs`):
  - En los builds de producción de Netlify se usa `process.env.URL`, el dominio principal del sitio: hoy `https://verk-site.netlify.app`.
  - Fuera de Netlify se usa `https://verk.mx`, que **no resuelve** (sin DNS, comprobado el 2026-11-05).
  - Al conectar el dominio propio como principal en Netlify, canonical, OG, sitemap y robots pasan a él sin tocar código.
- **Metadatos:**
  - Canonical, `lang="es"`, `og:locale es_MX`, title y description.
  - OG y Twitter con imagen 1200×630 (`/og/verk-og.png`: wordmark ink + isotipo violeta sobre cream; comprobada en horizontal), con ancho, alto y alt.
- **Favicon:** los PNG existentes (16, 32, apple-touch).
- **Sitemap:** `@astrojs/sitemap`, con `/` y `/bot` (sin `/404`).
- **robots.txt:** generado por `src/pages/robots.txt.ts`, con el sitemap en el dominio canónico. Sustituye a `public/robots.txt`, que fijaba verk.mx.
- **404:** `src/pages/404.astro` con la identidad del sitio y `noindex`.
- **Pendiente (bot):** `Layout.astro` (solo `/bot`) mantiene `verk.mx` fijo en su canonical y `og:image` → `/images/logo.png`. No se tocó para no alterar `/bot`.

## Estado legal
- Footer sin enlaces legales: no se publican enlaces rotos.
- Plantillas y la lista exacta de datos necesarios en `docs/legal/` (aviso de privacidad LFPDPPP y términos). No se inventó ningún dato.

## Estado del portfolio
| Sistema | En el panel |
|---|---|
| Sonoro | Embebible, en vivo bajo demanda (tras pintar el panel) |
| PRISMA, WATERLÜ | `X-Frame-Options: DENY` → captura real fechada + motivo + «Abrir sitio» |
| CleanSolarAus | `SAMEORIGIN` → captura real fechada + motivo + «Abrir sitio» |
| Los Fibos | En espera de aprobación de contenido: sin iframe, sin captura, sin enlace activo |
| DocLink, UX Analyzer, Riot, Bufón, Bloom Undies | Sin sitio público |

Políticas de embebido reverificadas el 2026-11-05.

## /bot (correcciones separadas, sin cambio de diseño ni de función)
- **404 de fuentes.** Las 9 `@font-face` de `typography.css` apuntaban a `/fonts/NHaas*.woff2`, que nunca se subieron. Se comentaron.
  - Un visitante sin NHG ve exactamente lo mismo que antes, sin las peticiones fallidas.
  - En un equipo con NHG instalada, `/bot` ahora la usa.
  - Se reactivan cuando haya licencia web.
- **`<pre>` desplazable.** Ahora es enfocable con el teclado (`tabindex="0"`), requisito de axe `scrollable-region-focusable`.

## Publicación (verificada)

**Push**
- Commit `f9510d7` («feat: integrate F3 generative experience into the production site»), `f8d12af..f9510d7` a `origin/main`, 2026-11-05 23:49:45 UTC.
- Antes del push se verificó un build limpio desde el commit (`npm ci` con el lockfile del commit, `CONTEXT=production`).

**Netlify**
- Desplegó automáticamente desde `main`; la home nueva se sirvió desde las 23:50:16 UTC.
- No hay CLI de Netlify ni acceso al panel en este equipo: se verificó el resultado publicado, no el log del build.

**Verificación de https://verk-site.netlify.app/** (`scripts/qa/verify-deploy.mjs`, 1440 y 390)

| | Resultado |
|---|---|
| Hero | Campo WebGL activo (≈330 frames en 5 s), Worker de geometría cargado, sin scroll horizontal |
| Metadatos | Canonical y `og:image` en `verk-site.netlify.app` |
| Navegación | Anclas `#top`, `#servicios`, `#metodo`, `#sistemas`, `#contacto` y `#main` existen |
| Portfolio | Panel de Sonoro con iframe cargado; WATERLÜ con captura real y «Abrir sitio» |
| WhatsApp | Un único enlace; `wa.me` responde 302 a `api.whatsapp.com/send/?phone=524793201003…` con el mensaje |
| Rutas | `/bot` 200 · `/robots.txt` 200 (sitemap en el dominio servido) · `/sitemap-index.xml` 200 · `/og/verk-og.png` 200 · `/posters/hero-fluid.avif` 200 · ruta inexistente → 404 con la página propia |
| Errores | Sin errores propios. El único 404 de consola es la analítica interna de Sonoro dentro de su iframe |

**Rendimiento y pruebas en producción**

| | Rendimiento | Accesibilidad | Buenas prácticas | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| Lighthouse móvil | 100 | 100 | 100 | 100 | 1.0 s | 0 | 0–10 ms |
| Lighthouse escritorio | 100 | 100 | 100 | 100 | 0.3 s | 0 | 0 ms |

`tests/qa` contra producción: 34/35. El presupuesto de tareas largas en móvil (CPU ×4) es intermitente: falla en paralelo y pasa en solitario (128 ms, LCP 840 ms).

## B. Pendiente por información tuya
1. **Licencia de NHG.** Elegir Monotype autoalojada o Adobe Fonts, y comprarla.
2. **Dominio definitivo.** Conectar `verk.mx` (o el elegido) en Netlify como dominio principal (DNS). No se ha tocado.
3. **Datos legales** (`docs/legal/README.md`): responsable, domicilio, contacto ARCO, datos tratados y revisión legal.
4. **Los Fibos.** Aprobación de contenido; también decidir si su URL es `losfibos.com` o `www.losfibos.com`.
5. **Safari real.** Activar Desarrollo → «Permitir automatización remota» en Safari para probarlo; y, si los hay, dispositivos iOS/Android reales.

## C. Pendiente de corrección técnica
1. **Tareas largas en móvil emulado (CPU ×4): 177–236 ms frente a 200 (intermitente).**
   - El resto es layout y estilo iniciales de la página (≈ 110–250 ms con ×4, ruido alto en este equipo de 2015) más el arranque de WebGL.
   - Siguiente paso: medir en un teléfono real antes de optimizar más.
2. **INP en móvil emulado:** puntas de hasta ~300 ms al abrir el menú (marca `inert` en toda la página) o al tocar el hero durante el arranque.
3. **`/bot`:** canonical y OG fijos (ver SEO). Requiere tocar `Layout.astro`; decidir si se hace.

## D. Recomendaciones opcionales
- Medir Web Vitals de campo (por ejemplo, Netlify Analytics o RUM propio) antes de seguir optimizando en laboratorio.
- Cuando llegue la licencia de NHG, precargar solo el corte 700 del H1 y medir el LCP de nuevo.
- Revisar la cabecera `X-Frame-Options: DENY` de `netlify.toml` si algún día se quiere embeber el propio sitio.

## Riesgos y limitaciones
- Pruebas sin Safari real ni dispositivos reales.
- WebGL depende de la GPU del visitante. Hay escala adaptativa (hasta 0.5×), Jacobi adaptativo (24 → 12), pausa fuera de vista y póster de respaldo.
- El canonical apunta al subdominio de Netlify hasta que se conecte el dominio propio.
