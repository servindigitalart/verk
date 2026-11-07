# 25 · Rediseño mobile-first de la experiencia — VERK

> **Fecha:** 2026-11-06.
>
> **Base:** `0854279`. Estado: implementado en el entorno de trabajo, **sin commit, sin push, sin deploy**.
>
> **Autoridad:** doc 21 > doc 22 > docs 23–24 > implementación. Investigación externa completa en [`25b-mobile-first-research.md`](25b-mobile-first-research.md).
>
> Nota sobre el anexo: menciona Instrument Sans como tipografía del doc 21. El sitio usa Neue Haas Grotesk (doc 24 §6) y este rediseño no cambia la tipografía.

## 1. Resumen

El sitio ya tenía una base técnica móvil sólida:
- titular como LCP;
- campos generativos que se pausan fuera de pantalla y con la pestaña oculta;
- DPR limitado y escala adaptativa en el hero;
- `dialog` nativo en Sistemas;
- `prefers-reduced-motion` respetado en todo.

Lo que faltaba era **diseño propio para el teléfono**. Varias piezas eran la versión de escritorio apilada:
- la ruta horizontal de Método;
- un índice de Sistemas sin imagen;
- partículas sobre los enlaces del Footer;
- un hero que se cortaba en pantallas compactas;
- un menú que era una lista sin sistema.

El rediseño introduce una **capa mobile-first**: composiciones e interacciones concebidas para pantallas estrechas, bajas y táctiles, construidas sobre el sistema existente.

- **Escritorio (≥ 1024 px):** se conserva idéntico, medido contra `0854279`. Solo se agrega la navegación entre proyectos del panel, que mejora ambos formatos.
- **Dependencias nuevas:** cero.
- **JavaScript inicial:** +20 bytes (18 597 B gzip).

## 2. Investigación (resumen)

La investigación está en el doc 25b; se resume aquí.

| Conclusión | Consecuencia |
|---|---|
| La plataforma nativa de 2026 cubre todo lo que pide un home móvil: `dialog`, scroll-snap, `dvh`/`svh`, safe areas, `@container`, scroll-driven animations (Baseline desde 10/2026), View Transitions, `@starting-style`. | Toda la capa móvil está hecha con CSS y unas líneas de JS propio. |
| Quedan ~1.4 KB de margen de JS. Motion mini pesa 3.2 KB y GSAP 27 KB, con licencia propietaria de Webflow. | GSAP y Motion se quedan en `lab/`. |
| Radix, shadcn y vaul son solo para React; Lucide es iconografía genérica. | Se usan solo como referencia de patrones. |
| Lygia tiene licencia no comercial. OGL no tiene actividad desde abril de 2025. | Se descartan para producción. |
| Los directorios de recursos visuales son material genérico y de stock. | No se usa ningún asset externo. Toda imagen nueva sale de los assets del proyecto. |
| Las herramientas útiles son de flujo de trabajo: DevTools MCP, `web-vitals` en Playwright, modern-web-guidance. | Ninguna entra al bundle. Instalar modern-web-guidance queda pendiente de tu aprobación. |

## 3. Auditoría de la experiencia (antes del rediseño)

Evidencia: recorrido pantalla a pantalla en 360 y 390 px y matriz de 11 viewports contra `0854279`.

| # | Hallazgo | Tipo | Evidencia |
|---|---|---|---|
| 1 | En 360×800 y 375×812 el hero mide 916/930 px. Los CTA se parten en dos filas, «Ver sistemas» queda cortado y «Pausar» queda fuera de la primera pantalla. | Problema responsive | CTA a +3/+5 px del borde; Pausar a +68/+70 |
| 2 | En un teléfono en horizontal (844×390, 932×430) el isotipo pisa «sistemas.». | Problema responsive | Intersección medida isotipo/línea 1 = sí |
| 3 | Método en columna conservaba la ruta **horizontal** por paso: cuatro líneas sueltas en lugar de un recorrido. | Interacción que pierde valor en móvil | Capturas |
| 4 | El índice de Sistemas por debajo de 1024 px no tenía imagen: el visor solo existe en escritorio. El portfolio se leía como lista de texto. | Sin equivalente móvil | Capturas |
| 5 | El panel de proyecto obligaba a cerrar y reabrir para recorrer los diez sistemas. | Función que debía evolucionar | Código de `panel.js` |
| 6 | En el Footer móvil, el campo residual cruzaba los enlaces «WhatsApp» y «Solicitar auditoría». | Legibilidad | Capturas |
| 7 | Los enlaces del Footer medían 32 px y el CTA del header 40 px en tablets táctiles. Pasa WCAG 2.5.8 (24 px), pero no el objetivo de 44 px del proyecto. | Accesibilidad táctil | Medición de áreas |
| 8 | En Servicios, al ocultarse el header en móvil, el escenario fijo dejaba 64 px de contenido asomando por encima. | Ritmo y jerarquía | Capturas |
| 9 | Menú móvil: lista centrada sin numeración ni estado, lejos del pulgar. | Navegación | Capturas |
| 10 | El resaltado gris del sistema al tocar convivía con los estados `:active` propios. | Táctil | CSS |

**Lo que funcionaba y se conserva:**
- la composición del hero en 390–430 px;
- Tensión (escalera e indentación progresiva);
- el escenario procedural de Servicios;
- Contacto;
- el header que se oculta al bajar y aparece al subir;
- la navegación espacial;
- los ciclos de vida de los tres campos generativos;
- el CLS de 0.

**Rendimiento:** los tres campos solo animan con la sección visible y la pestaña activa (IntersectionObserver + `visibilitychange`). El hero limita el DPR a 1.5 y reduce su escala si detecta fotogramas lentos. Las Isolíneas van a DPR ≤ 0.75 en móvil y ~30 fps. Las tres piezas respetan Save-Data o movimiento reducido. No hacía falta rehacer nada; se documenta en §7.

## 4. Dirección creativa

**Concepto: la misma obra, otra mano.** En escritorio VERK se lee con el cursor; en el teléfono, con el pulgar. El rediseño no encoge la composición: la **reorienta**.
- La ruta de Método pasa de horizontal a vertical.
- El índice de Sistemas pasa de texto con visor a texto con placa.
- El menú pasa de lista centrada a índice anclado abajo.
- El campo del Footer se concentra donde está el cierre.

**Principios:**
1. **Una dirección.** Los movimientos nuevos usan la diagonal de 45° (entrada del menú) o el eje natural del recorrido (Método vertical). Ninguno introduce una dirección ajena.
2. **El pulgar manda en móvil.** Los controles frecuentes (menú, CTA de Contacto, navegación del panel) quedan en la mitad inferior o son grandes. Todos los objetivos táctiles miden ≥ 44 px.
3. **Diseñar para la condición, no para el modelo.** Las reglas responden a ancho (≤ 389, ≤ 767, ≤ 1023), alto (≤ 830, ≤ 520), orientación y puntero (`pointer: coarse`). Nunca a un dispositivo concreto.
4. **Escritorio intacto.** La capa móvil no altera la geometría ≥ 1024 px. Se verificó midiendo 17 elementos en 1024, 1280, 1440 y 1920 contra `0854279`.
5. **Sin assets nuevos.** Las miniaturas de Sistemas son las mismas placas de marca que el visor de escritorio.

**Descartado a propósito:**
- **Barra de navegación inferior.** Compite con los CTA del hero, que viven abajo, y desplaza el wordmark de su sitio.
- **CTA flotante permanente.** Es estética de app y rompe el «un CTA primario».
- **Carrusel horizontal de proyectos.** Gesto menos evidente que una lista; la brief pide evitar gestos poco obvios.
- **`content-visibility` en secciones.** Altera las mediciones del header y de la navegación espacial, con riesgo de saltos.

## 5. Comportamiento por sección

| Sección | Móvil (360–767) | Tablet (768–1023) | Escritorio (≥ 1024) |
|---|---|---|---|
| **Header** | Píldora con wordmark, isotipo de progreso y número/nombre, más «Menú». Se oculta al bajar. **Menú nuevo:** índice numerado 03–06, anclado abajo (zona del pulgar), apartado actual en lima, entrada fila a fila por la diagonal de 45°, safe areas. | Píldora completa; CTA a 44 px en táctil | Sin cambios |
| **Hero** | **Compacto (≤ 389):** CTA en una fila. **Pantallas bajas (≤ 830 de alto):** isotipo a 22svh. CTA y Pausar en la primera pantalla en 360 y 375. 390–430: sin cambios. | **Horizontal bajo (≤ 520 de alto):** el isotipo baja junto al subtítulo y deja de pisar el titular. | Sin cambios |
| **Tensión** | Sin cambios: indentación progresiva y revelado CSS | Sin cambios | Sin cambios |
| **Servicios** | El escenario fijo sube cuando el header se oculta (`:has(.nav.is-hidden)`): nada asoma por encima | Sin cambios | Sin cambios |
| **Método** | **Ruta vertical:** una línea que baja por los cuatro pasos con la chispa lima en la cabeza y termina en el isotipo. Mismo `--route` de `method-route.js`; nodos, chispa y ensamblaje conservados. | Igual que móvil | Ruta horizontal, sin cambios |
| **Sistemas** | **Placa de marca por fila** (64 px, lazy), atenuada salvo la fila actual. **Panel:** ← 03 / 10 → y Cerrar en la fila de control; deslizar horizontal sobre el escenario recorre los proyectos; el foco vuelve a la fila del último proyecto visto. | Placa de 96 px | **Panel:** misma navegación ← / → con contador; teclado y anuncio a lector de pantalla |
| **Contacto** | CTA a todo el ancho (≤ 480) con «Por WhatsApp» centrado debajo | Sin cambios | Sin cambios |
| **Footer** | El campo residual nace detrás de «Seguimos construyendo.» y baja a textura (16 %) detrás de los enlaces; enlaces de 44 px | Enlaces de 44 px en táctil | Sin cambios |

## 6. Arquitectura responsive

Se conserva la arquitectura existente y no se crea ningún framework nuevo. Reglas del sistema:

**Tokens y rangos:**

| Elemento | Valor |
|---|---|
| Retícula | 4 / 8 / 12 columnas: < 768 / 768–1023 / ≥ 1024 |
| Márgenes | `clamp(16px, 4vw, 64px)`, sin cambios |
| Unidades de alto | `svh` para composición (hero, isotipo) y `dvh` para el panel |
| Safe areas | `env(safe-area-inset-*)` en el header, el menú y la etiqueta de navegación |

**Condiciones, no dispositivos:**

| Condición | Regla |
|---|---|
| `max-width: 389px` | Compacto |
| `max-width: 767px` | Móvil |
| `max-width: 1023px` | Sin visor ni ruta horizontal |
| `max-height: 830px` | Retrato bajo |
| `orientation: landscape` + `max-height: 520px` | Teléfono en horizontal |
| `pointer: coarse` | Objetivos de 44 px |

**Otras reglas:**
- **Táctil:** `touch-action: pan-y` en el escenario del panel (el gesto horizontal es nuestro, el vertical del navegador). `-webkit-tap-highlight-color: transparent` solo en controles con estado `:active` propio.
- **Sin JS:** todo el contenido sigue visible. Las 10 placas y los 4 pasos aparecen; las animaciones nuevas son CSS y se omiten con movimiento reducido.
- **Ubicación:** todo vive en un bloque comentado al final de `src/styles/site.css` («Capa mobile-first»), revisable y reversible como unidad.

## 7. Rendimiento y gráficos generativos

| Pieza | Ciclo de vida (existente, verificado en código) | Cambio en este rediseño |
|---|---|---|
| Hero · Fluid Halftone (WebGL2) | rAF solo visible + pestaña activa; pausa manual; DPR ≤ 1.5 × escala adaptativa (baja 15 % por tramo si p90 > 20 ms, mínimo .5); `webglcontextlost`; Save-Data → póster; movimiento reducido → un frame | Ninguno |
| Sistemas · Isolíneas (WebGL2) | Solo visible; ~30 fps; DPR ≤ 1 (≤ .75 en móvil); contexto perdido → fondo ink | Ninguno |
| Footer · Residual Field (Canvas 2D) | Solo visible; 420 partículas en < 768 (900 en escritorio); DPR ≤ 1.5; movimiento reducido → un frame | Solo CSS: origen y máscara en móvil |
| Revelados de Tensión | CSS scroll-driven: sin JS ni reloj | Ninguno |

Perfiles High / Balanced / Reduced: ya existen de hecho:
- **High:** escritorio, DPR 1.5.
- **Balanced:** la escala adaptativa del hero, menos partículas y menor DPR en móvil.
- **Reduced:** movimiento reducido o Save-Data.

No se usa detección por user-agent: las decisiones se basan en ancho, preferencias y fotogramas medidos.

## 8. Implementación

**Archivos modificados (sin commit):**

| Archivo | Cambio |
|---|---|
| `src/styles/site.css` | Capa mobile-first (+92 líneas, bloque comentado al final) |
| `src/components/site/Header.astro` | Menú como lista numerada 03–06 (`.menu-list`) |
| `src/scripts/site/header.js` | El apartado actual también se marca en el menú (misma lógica, 1 línea) |
| `src/components/site/Systems.astro` | Placa de marca por fila (`.ix-thumb`, oculta ≥ 1024, `loading="lazy"`) |
| `src/scripts/site/panel.js` | Recorrido ← / → con contador anunciado, gesto horizontal en táctil, foco de vuelta al último proyecto |
| `src/scripts/site/icons.js` | Glifo `←` en SVG (las flechas siempre son SVG, doc 21) |
| `docs/25-mobile-first-redesign.md`, `docs/25b-mobile-first-research.md` | Este documento y el anexo de investigación |

**Componentes creados:** ninguno. **Dependencias nuevas:** ninguna.

**Sin cambios:** Hero (marcado y shaders), Tensión, Servicios (marcado y script), Método (marcado y script), Contacto (marcado y script), Footer (marcado y script), datos de proyectos, `/bot`, configuración, fuentes, paleta e isotipo.

## 9. QA

Todo se probó en Chrome de escritorio con emulación móvil (viewport, táctil, DPR 2). **No hubo pruebas en dispositivos físicos.**

### 9.1 Matriz de viewports (estado nuevo frente a `0854279`)

| Viewport | Overflow X | CTA del hero (px respecto al borde) | Pausar | Isotipo sobre titular | Geometría ≥ 1024 frente a `0854279` | Objetivos < 44 px | Errores de consola |
|---|---|---|---|---|---|---|---|
| 360×800 | 0 | +3 → **−113** | +68 → **−48** | no | — | 0 | 0 |
| 375×812 | 0 | +5 → **−114** | +70 → **−49** | no | — | 0 | 0 |
| 390×844 | 0 | −84 → −84 | −18 → −18 | no | — | 0 | 0 |
| 402×874 | 0 | −95 → −95 | −28 → −28 | no | — | 0 | 0 |
| 430×932 | 0 | −124 → −124 | −56 → −56 | no | — | 0 | 0 |
| 844×390 (horizontal) | 0 | +78 → +76 | +78 → +76 | **sí → no** | — | 0 tras el ajuste | 0 |
| 768×1024 | 0 | −61 → −61 | −61 → −61 | no | — | 0 tras el ajuste | 0 |
| 1024×768 | 0 | igual | igual | igual | **idéntica** | enlaces del footer 32 px con ratón (≥ 24, AA) | 0 |
| 1280×800 | 0 | igual | igual | igual (composición aprobada) | **idéntica** | ídem | 0 |
| 1440×900 | 0 | igual | igual | igual (composición aprobada) | **idéntica** | ídem | 0 |
| 1920×1080 | 0 | igual | igual | igual | **idéntica** | ídem | 0 |

Un valor negativo significa dentro de la primera pantalla. «Isotipo sobre titular» en 1280/1440 es la composición aprobada de escritorio: el isotipo cruza el rectángulo del titular sin tapar letras.

### 9.2 Interacciones (Chrome, emulación táctil 390×844 y escritorio 1440×900)

| Prueba | Resultado |
|---|---|
| Menú: abrir, foco al primer enlace, resto de la página `inert`, apartado actual marcado («04 Método») | ✓ |
| Menú: tocar «Sistemas» viaja a la sección, cierra el menú y la sección queda en top 0 | ✓ |
| Menú: filas de 70 px | ✓ |
| Panel: abrir SIS-03 → «03 / 10: PRISMA»; → «04 / 10: UX Analyzer», con el foco en «Sistema siguiente» | ✓ |
| Panel: deslizar a la izquierda → 05; a la derecha → 04 (gesto táctil real por CDP) | ✓ |
| Panel: el alto cabe en el viewport (820 = 820, sin scroll interno) | ✓ |
| Panel: Escape → foco en la fila SIS-04 (último visto) | ✓ |
| Escritorio: Enter en SIS-10 → «10 / 10»; Enter en → da la vuelta a «01 / 10: Sonoro» | ✓ |
| Movimiento reducido: ruta de Método completa (1,1,1,1), Tensión sin estados ocultos, menú visible al instante | ✓ |
| Sin JavaScript: 10 placas, 4 pasos y sin overflow | ✓ |
| Sin JavaScript: el menú móvil no abre, porque el botón depende de JS | ✓ / ⚠️ Comportamiento previo, no introducido aquí |

### 9.3 Accesibilidad y rendimiento (servidor de producción local, `astro preview`, en serie)

| | 1440 | 768 | 390 (CPU ×4, red 4G simulada) |
|---|---|---|---|
| axe WCAG 2.2 AA (`/` y `/bot`) | ✓ | ✓ | ✓ |
| LCP | 144 ms | 124 ms | 696 ms |
| CLS | 0 | 0 | 0 |
| Tareas largas | 0 ms | 5 ms | 177 ms (presupuesto 200) |
| JS (gzip) | 18 597 B | ídem | ídem (+20 B frente a `0854279`) |
| CSS (transferido) | 10 690 B | ídem | ídem (presupuesto 15 KB) |

`astro check`: los mismos 4 errores que ya existían en `Footer.astro`; ninguno nuevo.

### 9.4 Lo que NO se pudo verificar

- **Safari iOS, Chrome Android y dispositivos físicos:** sin acceso.
- **Firefox y WebKit vía Playwright:** los binarios en caché no coinciden con la versión instalada de Playwright. Descargarlos (`npx playwright install firefox webkit`) requiere tu autorización.
- **Teclado virtual:** la home no tiene formularios.
- **INP medido:** no se inyectó `web-vitals`. Las interacciones nuevas son re-render de un `dialog` y cambio de atributos.
- **FPS sostenidos y temperatura en dispositivos reales:** sin acceso.

## 10. Evaluación final

- **¿Se siente VERK?** Sí. No hay recursos nuevos ajenos a la marca: el menú usa la numeración mono y la diagonal, el índice usa las placas existentes y la ruta vertical es la misma pieza reorientada.
- **¿El móvil tiene personalidad propia?** Más que antes, en Método, Sistemas, el menú y el Footer, donde ahora hay decisiones pensadas para el pulgar y la columna.

  Honestamente, el hero, Tensión, Servicios y Contacto siguen siendo, en móvil, la composición de escritorio bien adaptada, no reinventada. La auditoría no encontró razones para reinventarlos y sí para no tocar piezas aprobadas sin evidencia.
- **¿Escritorio extraordinario?** Se conserva tal cual, medido. Gana el recorrido entre proyectos del panel.
- **¿Hay elementos genéricos?** El menú a pantalla completa es un patrón común. Se distingue por el anclaje inferior, la numeración y la entrada diagonal.
- **Oportunidades para elevar el resultado, sin ejecutar:**
  1. Una interacción táctil propia en el hero. Tocar el isotipo activa el modo lima (verificado en F3), pero nada indica que se puede tocar; no verifiqué cómo responde el campo al arrastrar el dedo.
  2. Transiciones de View Transitions entre proyectos del panel en lugar del desplazamiento de 24 px.
  3. Probar en iPhone y Android reales el gesto del panel y el header que se oculta.
  4. Que el menú funcione sin JavaScript, con `popover` nativo.
- **Limitación principal:** la verificación es simulada. Antes de publicar conviene una pasada en dispositivos reales.

## 11. Pendientes y decisiones

1. Autorizar la descarga de Firefox y WebKit para Playwright, o probar en dispositivos reales.
2. `public/images/logo.png` sigue borrado en la copia de trabajo desde antes de esta sesión. No lo restauré porque no se pidió; restaurarlo es `git checkout -- public/images/logo.png`.
3. Instalar la skill modern-web-guidance y añadir `--no-performance-crux` a `.mcp.json`. Ambas requieren aprobación (doc 25b).
4. Sin commit, sin push, sin deploy.
