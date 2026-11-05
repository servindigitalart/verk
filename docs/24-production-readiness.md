# 24 · Production readiness: integración F3

Fecha: 2026-11-05 · Rama: `main` · Remoto: `origin` (github.com/servindigitalart/verk) · Netlify publica `main`
(`netlify.toml`: `npm run build` → `dist/`, Node 22.16.0).

## A. Completado

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
