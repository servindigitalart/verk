# 07 · Validación de los dos modos

> Dos ejemplos completos ejecutados «en papel»: sin APIs y sin generar imágenes reales. Muestran la salida esperada de cada prompt y comprueban que el sistema funciona de punta a punta.
>
> **Prueba A:** imagen individual (`01`). **Prueba B:** carrusel (`02` → `03` → `04`).

---

# PRUEBA A — Imagen individual

**Entrada del prompt `01`:**
- `TEMA`: Los mensajes comerciales que nadie responde.
- `OBJETIVO`: vacío.
- `SEGMENTO`: vacío.
- `HISTORIAL`: vacío.

## Salida esperada (una sola ejecución)

**1 · LECTURA ESTRATÉGICA**
- **Tema → problema comercial:** mensajes de WhatsApp y formularios que llegan fuera de horario o sin responsable, y se quedan sin respuesta.
- **Audiencia:** dueños y directores de negocios con mucha atención por WhatsApp.
- **Tiempo dominante:** Problema en el titular; Sistema y Capacidad en el texto; Acción en el CTA.
- **Objetivo:** conversión.

**2 · CONCEPTO**
La conversación que se queda sola: un mensaje registrado como dato técnico cuya línea de seguimiento no llega a ningún lado.

**3 · COPY FINAL**
- Etiqueta: «23:14 · MENSAJE SIN RESPUESTA»
- Titular: «Te escribieron. Nadie contestó.»
- Texto secundario: «Conectamos tu WhatsApp, tus formularios y tu CRM para que cada mensaje quede registrado y tenga un siguiente paso.»
- CTA: «Solicitar auditoría»
- Microcopy: «AUDITORÍA GRATUITA Y PERSONALIZADA · POR WHATSAPP»

**4 · DIRECCIÓN DE ARTE**
- **Territorio:** T2, superficie + diagonal.
- **Superficie:** violeta `#6B6AF4`.
- **Recurso protagonista:** una línea de 1 px a 45° que nace en un nodo y termina en un nodo vacío punteado: la respuesta que nunca llega.
- **Partición:** 8+3.
- **Jerarquía y posiciones:**
  1. titular en las columnas 1–8, y 260–560, 150 px, ink;
  2. línea a 45° de (640, 1000) a (980, 660), con un círculo relleno de 12 px al inicio y un círculo de contorno punteado de 28 px al final;
  3. texto secundario en las columnas 1–6, y 640–800, 34 px, ink;
  4. etiqueta mono en x 48, y 64, 22 px, ink; microcopy mono de 20 px en x 340, y 1170;
  5. CTA: píldora ink con el texto en lima, x 340–700, y 1212–1292.
- **Paleta:** `#6B6AF4` fondo; `#0F0F0F` texto, línea y píldora; `#BFEA00` texto de la píldora.
- **Texturas y geometría:** sin textura (color plano). Un pequeño cruce de registro ink arriba a la derecha (x 1000, y 96); una cota fina junto al nodo de origen.
- **Por qué:** la escena (un mensaje con hora) se cuenta como registro técnico; el violeta, el color del «sistema», enmarca lo que falta.

**5 · PROMPT VISUAL FINAL**

```text
▶ ADJUNTAR AL GENERADOR: lab/brand/wordmark-ink.png
A finished vertical advertising image, 1080 x 1350 px. Completely flat violet #6B6AF4 background, no texture.
Top-left at x 48, y 64: a tiny monospace uppercase label in ink #0F0F0F, about 22 px, reading exactly: "23:14 · MENSAJE SIN RESPUESTA".
Headline, left-aligned on the left 8 of 12 columns, from y 260 to y 560, in a bold neo-grotesque sans (Neue Haas Grotesk Display Bold style), about 150 px, very tight letter-spacing, line-height 0.9, ink #0F0F0F, two lines reading exactly: "Te escribieron." / "Nadie contestó."
Below it, columns 1-6, y 640 to 800, regular weight of the same family, about 34 px, ink, reading exactly: "Conectamos tu WhatsApp, tus formularios y tu CRM para que cada mensaje quede registrado y tenga un siguiente paso."
Main graphic gesture on the right: one single thin 1px ink line at exactly 45 degrees rising from bottom-left (x 640, y 1000) to top-right (x 980, y 660). At its start a small solid ink dot (12 px); at its end an empty dashed-outline circle (28 px) — a reply that never arrives. A small thin dimension tick next to the start dot, and a tiny registration cross at x 1000, y 96. Nothing else.
Bottom: at x 340, y 1170, a tiny monospace uppercase ink line reading exactly: "AUDITORÍA GRATUITA Y PERSONALIZADA · POR WHATSAPP". Below it, a fully rounded pill button, ink #0F0F0F fill, x 340 to 700, y 1212 to 1292, containing the text in lime #BFEA00, medium weight, about 32 px, reading exactly: "Solicitar auditoría".
At bottom-left, the attached official VERK wordmark: left edge at x 48, vertically centered at y 1257, 220 px wide, recolored flat ink #0F0F0F.
Large calm negative space in the upper right and around the line.

VERK BRAND RULES — follow strictly:
FORMAT: 1080 x 1350 px, 4:5 vertical.
PALETTE (flat colors only, no other hues): ink #0F0F0F, cream #F0EEE9, violet #6B6AF4, lime #BFEA00; support tones only if needed: warm cream #E6E1D5, dark #1A1A1A, footer black #0B0B0B. Never pure white #FFFFFF, never pure black #000000. No gradients, no glow, no shadows, no bloom.
SURFACE: exactly one protagonist flat background color. Text on violet or lime is ink #0F0F0F. Never cream text on lime. Never small lime text on cream.
TYPOGRAPHY: headline in a bold neo-grotesque sans (Neue Haas Grotesk Display Bold style), very tight letter-spacing, tight line-height, sentence case, left-aligned, extremely large. Secondary text in the same family, regular weight, small. Labels in a monospace (Geist Mono style), uppercase, tiny, slightly tracked. No serif, no script, no rounded or geometric display fonts, no all-caps headlines. Reproduce every quoted Spanish text exactly, letter by letter, with accents, punctuation and capitalization; add no other words. Text is part of the image.
COMPOSITION: asymmetric, left-aligned, 12-column editorial grid, 48 px margins, 35-50% negative space, one dominant visual gesture, the 45-degree diagonal (bottom-left to top-right) as secondary line, subtle technical annotation (thin 1px lines, small registration crosses, tiny monospace labels).
LOGO: integrate only the official VERK logo reference image(s) attached to this request, exactly as described in LOGO REFERENCE. Never draw, invent or imitate any other logo, monogram or symbol, and never type "VERK" or "Verk" as a substitute for the wordmark.
AVOID: stock photography, people, faces, hands on laptops, smiling teams, handshakes, 3D icons, glassmorphism, neon, lens flare, chrome, iridescence, glowing network nodes, upward arrows, dashboard or phone mockups, emojis, centered symmetric layout, clutter, watermarks, extra text.

LOGO REFERENCE — official VERK logo image(s) attached to this request:
- WORDMARK reference (file wordmark-ink.png, or wordmark-ink-on-cream.png): the official VERK wordmark, lowercase "verk" in custom-drawn letterforms, flat single color, width:height about 4.15:1.
- ISOTIPO reference (file isotipo-ink.png, or isotipo-ink-on-cream.png): the official VERK isotipo, three separate parallel rounded bars at exactly 45 degrees (rising bottom-left to top-right), flat single color, width:height about 0.77:1.
ATTACHED FOR THIS IMAGE: wordmark
USE IN THIS IMAGE: wordmark, bottom-left, left edge at x 48, vertically centered at y 1257, 220 px wide, ink #0F0F0F
RULES: integrate the attached logo as a flat graphic element of the composition, copying its exact silhouette, letterforms, number of bars (3), 45-degree angle, spacing and proportions; scale it uniformly only. The background of the reference file (transparent or cream) is not part of the logo. Recolor it to one flat palette color with clear contrast: ink #0F0F0F on cream, warm cream, violet or lime; cream #F0EEE9 on ink or #0B0B0B; the isotipo may also be violet #6B6AF4 on cream. Never lime on cream, never cream on lime. Do not redraw or reinterpret it, change letters, add or remove bars, rotate, skew, stretch, outline it, add shadow, glow, gradient, texture or 3D, put it on a box or badge, combine wordmark and isotipo into a new lockup, or derive one from the other. Use only the logo files listed as attached; never draw a logo that is not attached.
```

**6 · REFERENCIAS A ADJUNTAR**
- `lab/brand/wordmark-ink.png`: el wordmark oficial. Va abajo a la izquierda (borde izquierdo en x 48, centrado en y 1257), con 220 px de ancho, recoloreado a ink `#0F0F0F` sobre violeta. Si el generador muestra la transparencia en negro, adjunta en su lugar `lab/brand/wordmark-ink-on-cream.png`.
- Sin isotipo.

**7 · CONTROL**

| Comprobación | Resultado |
|---|---|
| Copy sin cifras ni garantías | Sí. «23:14» es una escena, no una métrica. |
| Un solo CTA | Sí |
| Palabras prohibidas ausentes | Sí |
| Una superficie y un gesto | Sí |
| Logo desde la referencia adjunta, en un color de token con contraste | Sí (wordmark ink sobre violeta) |
| Solo colores de la paleta | Sí |
| Territorio distinto del historial | Sí (historial vacío) |

## Evaluación de la Prueba A

- **Una sola ejecución** produce estrategia, concepto, copy, dirección de arte y un prompt visual pegable. No hay opciones abiertas ni pasos posteriores: basta adjuntar `lab/brand/wordmark-ink.png` y generar.
- **El prompt visual es autosuficiente:** describe posiciones, textos exactos y colores, y lleva el bloque de marca.
- **Cumple las reglas:** escena real, mecanismo descrito sin promesa absoluta («quede registrado y tenga un siguiente paso»), auditoría gratuita y personalizada, un solo CTA y logo integrado desde la referencia oficial, sin inventarlo.

---

# PRUEBA B — Carrusel

**Entrada del prompt `02`:**
- `TEMA`: Las herramientas digitales de un negocio que no están conectadas.
- Slides: 5. Objetivo: conversión. Segmento: vacío.

## Paso 1 · Salida del Carousel Master Prompt

# CARRUSEL VERK — Las herramientas digitales de un negocio que no están conectadas

## A · ESTRATEGIA
- TEMA: Las herramientas digitales de un negocio que no están conectadas.
- AUDIENCIA: Fundadores y directores de negocios que ya usan sitio, WhatsApp, CRM y agenda, y siguen operando a mano entre ellos.
- INSIGHT: El negocio ya pagó por las herramientas; lo que falla no es la tecnología, es lo que pasa entre una y otra.
- PROBLEMA: Cada herramienta guarda una parte del cliente y nadie ve el recorrido completo, así que los contactos se pierden en los huecos.
- OBJETIVO: Conversión: solicitar la auditoría gratuita y personalizada.
- ÁNGULO COMERCIAL: No vender otra herramienta: vender la conexión entre las que ya existen.
- CONCEPTO CREATIVO: «Cada herramienta tiene una parte de la historia.» Cuatro piezas sueltas que, al conectarse, encuentran una sola dirección.

## B · NARRATIVA
- NÚMERO DE SLIDES: 5
- HOOK: «Tienes las herramientas. No se hablan.»
- DESARROLLO: El problema vive entre una herramienta y otra (tensión); no falta otra herramienta, falta el sistema (sistema); VERK las conecta en un solo flujo (capacidad).
- CONCLUSIÓN: Ver dónde se cortan las herramientas es el primer paso.
- CTA: «Solicitar auditoría»
- SECUENCIA:

| Slide | Tiempo | Función | Relación |
|---|---|---|---|
| 1 | Problema | Hook: reconocer el stack desconectado | Presenta las cuatro piezas sueltas y la línea suelta |
| 2 | Tensión | Mostrar dónde se pierde el cliente | La línea se corta en el vacío entre herramientas |
| 3 | Sistema | Nombrar la solución | Las cuatro piezas se alinean en una diagonal conectada |
| 4 | Capacidad | Mostrar qué construye VERK | Abre el sistema y muestra su diagrama interior |
| 5 | Acción | Cerrar con la auditoría | La línea llega al isotipo: una sola dirección |

## E · SISTEMA DE CONTINUIDAD (común a todos los slides)
- CONSTANTES: Espina: etiqueta mono en la esquina superior izquierda (x 48, y 64), 22 px, mayúsculas, formato «0N / 05 · TEMA». Márgenes de 48 px. Titulares de los slides 1–4 a 112 px y del slide 5 a 124 px, Bold, interlineado 0.9, alineados a la columna 1. Texto secundario de 30–34 px. Posición estándar del wordmark: abajo a la izquierda, borde izquierdo en x 48, centrado en y 1257, 220 px de ancho, en ink sobre superficies claras y en cream sobre ink; esa zona (x 48–308, y 1212–1302) no se ocupa con otros elementos en ningún slide. Paleta solo con ink, cream, violet, lime y cream-warm. Elemento conductor: una línea de 1 px a exactamente 45°, siempre del mismo grosor, cuyo estado narra la historia: suelta (1), cortada (2), uniendo las piezas (3), dentro del diagrama (4) y completa hasta el isotipo (5); es ink sobre superficies claras y cream sobre ink. Las cuatro piezas (SITIO, WHATSAPP, CRM, AGENDA) se dibujan siempre como rectángulos de contorno fino con etiqueta mono.
- SECUENCIA CROMÁTICA: 1 cream #F0EEE9 → 2 ink #0F0F0F → 3 violet #6B6AF4 → 4 cream-warm #E6E1D5 → 5 lime #BFEA00
- TRATAMIENTOS DEL CARRUSEL: Isolíneas solo en el slide 2; diagrama de sistema solo en el slide 4; los demás, tipografía, superficie y línea.
- VARIABLES PERMITIDAS: Posición del titular (arriba en 1, 2, 4 y 5; abajo en 3), partición, recurso protagonista y estado de la línea.

## SLIDES

### SLIDE 1 / 5
- FUNCIÓN: Hook: que el lector reconozca su propio stack desconectado.
- TIEMPO NARRATIVO: Problema
- COPY · ETIQUETA: «01 / 05 · HERRAMIENTAS»
- COPY · TITULAR: «Tienes las herramientas. No se hablan.»
- COPY · TEXTO SECUNDARIO: «Sitio, WhatsApp, CRM y agenda. Cada uno tiene una parte de la historia.»
- COPY · MICROCOPY: «SITIO · WHATSAPP · CRM · AGENDA» (etiquetas de las cuatro piezas, una por rectángulo)
- COPY · CTA: «—»
- CONCEPTO VISUAL: Cuatro piezas sueltas que no apuntan a ningún lado: cuatro rectángulos de contorno fino, cada uno con su etiqueta mono, dispersos y desalineados.
- TERRITORIO: T1 Editorial tipográfico, con anotación técnica.
- SUPERFICIE: Cream #F0EEE9
- COMPOSICIÓN: Partición 8+3. Etiqueta en x 48, y 64. Titular en las columnas 1–8, y 200–560, 112 px, ink. Texto secundario en las columnas 1–6, y 620–720, 34 px, ink. Cuatro rectángulos de contorno de 1 px (≈150 × 60 px) con las etiquetas SITIO, WHATSAPP, CRM y AGENDA, dispersos en las columnas 7–12 entre y 800 y y 1150, sin rotar pero desalineados en altura y separación. Línea conductora ink de 1 px a 45° de (720, 1300) a (1000, 1020), terminada en un círculo abierto de 10 px.
- JERARQUÍA: 1 titular · 2 las cuatro piezas dispersas · 3 texto secundario · 4 etiqueta mono.
- DISTRIBUCIÓN: Espacio negativo en la franja superior derecha (columnas 9–12, y 200–760) y entre las piezas.
- PALETA DEL SLIDE: #F0EEE9 fondo; #0F0F0F texto, contornos y línea; #5C5C5C etiquetas de las piezas.
- RECURSOS GRÁFICOS: Rectángulos de contorno de 1 px, línea conductora a 45°, un cruce de registro pequeño en x 1000, y 96.
- TEXTURAS: Ninguna; papel plano.
- GEOMETRÍA: Rectángulos sin alineación entre sí; una sola línea a 45°.
- CONSTANTES APLICADAS: Espina, márgenes, titular de 112 px, posición del wordmark, línea conductora.
- VARIACIÓN DE ESTE SLIDE: Piezas dispersas; la línea está suelta y no conecta nada.
- CONEXIÓN: La línea suelta anticipa el corte del slide 2; las cuatro piezas reaparecen alineadas en el slide 3.
- LOGO · ADJUNTAR: lab/brand/wordmark-ink.png
- LOGO · USO: wordmark, bottom-left, left edge at x 48, vertically centered at y 1257, 220 px wide, ink #0F0F0F

### SLIDE 2 / 5
- FUNCIÓN: Mostrar dónde se pierde el cliente: entre una herramienta y otra.
- TIEMPO NARRATIVO: Tensión
- COPY · ETIQUETA: «02 / 05 · LO QUE SE PIERDE»
- COPY · TITULAR: «El problema vive entre una y otra.»
- COPY · TEXTO SECUNDARIO: «El CRM no sabe lo que pasó en WhatsApp. La agenda no sabe lo que se cotizó.»
- COPY · MICROCOPY: «WHATSAPP · CRM» (una etiqueta sobre cada isla)
- COPY · CTA: «—»
- CONCEPTO VISUAL: Dos islas de curvas de nivel separadas por un vacío: la información existe, pero entre ellas no hay terreno. La línea conductora llega al borde del vacío y se corta.
- TERRITORIO: T4 Terreno (isolíneas)
- SUPERFICIE: Ink #0F0F0F
- COMPOSICIÓN: Partición 7+4 con el gesto abajo. Etiqueta en x 48, y 64. Titular en las columnas 1–7, y 180–520, 112 px, cream. Texto secundario en las columnas 1–6, y 580–700, 34 px, cream. Dos islas de isolíneas en la mitad inferior, una a la izquierda (columnas 1–5, y 780–1150) y otra a la derecha (columnas 8–12, y 760–1130), con un vacío limpio de ≈180 px entre ellas. Etiqueta mono WHATSAPP sobre la isla izquierda y CRM sobre la derecha. Línea conductora cream de 1 px a 45° que sale de la isla izquierda en (380, 1000) y se corta en (500, 880), al borde del vacío.
- JERARQUÍA: 1 titular · 2 las dos islas y el vacío · 3 texto secundario · 4 etiquetas.
- DISTRIBUCIÓN: El vacío entre las islas es el espacio negativo protagonista.
- PALETA DEL SLIDE: #0F0F0F fondo; isolíneas #6B6AF4 (isla izquierda) y #F0EEE9 al 40 % (isla derecha); texto #F0EEE9; etiquetas #8C8C8C.
- RECURSOS GRÁFICOS: Isolíneas de 1 px, línea conductora interrumpida, etiquetas mono.
- TEXTURAS: Solo las curvas de nivel; sin grano.
- GEOMETRÍA: Curvas orgánicas concéntricas; una línea a 45° interrumpida.
- CONSTANTES APLICADAS: Espina, márgenes, titular de 112 px, posición del wordmark, línea conductora.
- VARIACIÓN DE ESTE SLIDE: Única superficie oscura; las isolíneas aparecen solo aquí.
- CONEXIÓN: La línea suelta del slide 1 ahora se corta en el vacío; el slide 3 la completa.
- LOGO · ADJUNTAR: lab/brand/wordmark-ink.png
- LOGO · USO: wordmark, bottom-left, left edge at x 48, vertically centered at y 1257, 220 px wide, cream #F0EEE9

### SLIDE 3 / 5
- FUNCIÓN: Nombrar la solución: el sistema que conecta, no otra herramienta.
- TIEMPO NARRATIVO: Sistema
- COPY · ETIQUETA: «03 / 05 · EL SISTEMA»
- COPY · TITULAR: «No falta otra herramienta. Falta el sistema.»
- COPY · TEXTO SECUNDARIO: «Un solo recorrido: cada contacto entra, se registra y avanza al siguiente paso.»
- COPY · MICROCOPY: «SITIO · WHATSAPP · CRM · AGENDA» (etiquetas de las cuatro piezas, una por rectángulo)
- COPY · CTA: «—»
- CONCEPTO VISUAL: Las cuatro piezas del slide 1, ahora alineadas en una sola diagonal a 45° y unidas por una línea continua: una sola dirección.
- TERRITORIO: T2 Superficie + diagonal
- SUPERFICIE: Violet #6B6AF4
- COMPOSICIÓN: Partición 7+4, con el titular abajo. Etiqueta en x 48, y 64. Cuatro rectángulos de contorno de 1 px (≈150 × 60 px) escalonados exactamente sobre una diagonal a 45° de (520, 700) a (930, 290), en el orden SITIO, WHATSAPP, CRM y AGENDA, unidos por una línea ink continua de 1 px. Titular en las columnas 1–7, y 760–1060, 112 px, ink. Texto secundario en las columnas 1–6, y 1090–1180, 30 px, ink.
- JERARQUÍA: 1 titular · 2 la diagonal de piezas conectadas · 3 texto secundario · 4 etiqueta mono.
- DISTRIBUCIÓN: Espacio negativo arriba a la izquierda (columnas 1–5, y 140–680).
- PALETA DEL SLIDE: #6B6AF4 fondo; #0F0F0F texto, contornos y línea.
- RECURSOS GRÁFICOS: Rectángulos de contorno de 1 px, línea continua a 45°.
- TEXTURAS: Ninguna; color plano.
- GEOMETRÍA: Alineación exacta a 45°.
- CONSTANTES APLICADAS: Espina, márgenes, titular de 112 px, posición del wordmark, línea conductora.
- VARIACIÓN DE ESTE SLIDE: Titular en la parte inferior; la línea, por primera vez, completa.
- CONEXIÓN: Resuelve las piezas dispersas del slide 1 y el corte del slide 2; el slide 4 muestra qué hay dentro del sistema.
- LOGO · ADJUNTAR: lab/brand/wordmark-ink.png
- LOGO · USO: wordmark, bottom-left, left edge at x 48, vertically centered at y 1257, 220 px wide, ink #0F0F0F

### SLIDE 4 / 5
- FUNCIÓN: Mostrar qué construye VERK concretamente.
- TIEMPO NARRATIVO: Capacidad
- COPY · ETIQUETA: «04 / 05 · LO QUE CONSTRUIMOS»
- COPY · TITULAR: «Tus herramientas, en un solo flujo.»
- COPY · TEXTO SECUNDARIO: «Integramos CRM, WhatsApp, formularios y calendario, y automatizamos los seguimientos que hoy dependen de alguien.»
- COPY · MICROCOPY: «FORMULARIO · WHATSAPP · CRM · SEGUIMIENTO · AGENDA» (etiquetas de los cinco nodos)
- COPY · CTA: «—»
- CONCEPTO VISUAL: Plano técnico del sistema: cinco nodos y flujos dibujados como un plano de arquitecto; el CRM es el único nodo relleno.
- TERRITORIO: T6 Plano de sistema
- SUPERFICIE: Cream-warm #E6E1D5
- COMPOSICIÓN: Partición 5+6. Etiqueta en x 48, y 64. Titular en las columnas 1–8, y 170–440, 112 px, ink. Texto secundario en las columnas 1–7, y 490–620, 32 px, ink. Diagrama en las columnas 2–12, y 700–1160: FORMULARIO y WHATSAPP a la izquierda, con flechas finas hacia CRM al centro; desde CRM, flechas hacia SEGUIMIENTO y AGENDA a la derecha. El flujo general sube hacia la derecha siguiendo la diagonal de 45°.
- JERARQUÍA: 1 titular · 2 diagrama · 3 texto secundario · 4 etiquetas de los nodos.
- DISTRIBUCIÓN: Espacio negativo en las columnas 10–12 de la parte superior y alrededor del diagrama.
- PALETA DEL SLIDE: #E6E1D5 fondo; #0F0F0F líneas y texto; #6B6AF4 relleno del nodo CRM, con su etiqueta en ink.
- RECURSOS GRÁFICOS: Diagrama de sistema; anotación técnica (cotas finas, un cruce de registro).
- TEXTURAS: Ninguna.
- GEOMETRÍA: Rectángulos de esquinas suaves, flechas de trazo fino, flujo a 45°.
- CONSTANTES APLICADAS: Espina, márgenes, titular de 112 px, posición del wordmark, línea conductora (las flechas del diagrama la continúan).
- VARIACIÓN DE ESTE SLIDE: Único slide con diagrama.
- CONEXIÓN: Abre el sistema del slide 3 para mostrar su interior; el slide 5 lleva la línea hasta el isotipo.
- LOGO · ADJUNTAR: lab/brand/wordmark-ink.png
- LOGO · USO: wordmark, bottom-left, left edge at x 48, vertically centered at y 1257, 220 px wide, ink #0F0F0F

### SLIDE 5 / 5
- FUNCIÓN: Cerrar con el siguiente paso concreto.
- TIEMPO NARRATIVO: Acción
- COPY · ETIQUETA: «05 / 05 · EL SIGUIENTE PASO»
- COPY · TITULAR: «Veamos dónde se cortan tus herramientas.»
- COPY · TEXTO SECUNDARIO: «Empezamos con una auditoría gratuita y personalizada para definir qué conviene mejorar, construir o conectar.»
- COPY · MICROCOPY: «POR WHATSAPP»
- COPY · CTA: «Solicitar auditoría»
- CONCEPTO VISUAL: La línea conductora llega a su destino: termina en el isotipo oficial. Tres piezas, una dirección.
- TERRITORIO: T9 Minimalismo de marca
- SUPERFICIE: Lime #BFEA00
- COMPOSICIÓN: Partición 7+4 (desfase 1). Etiqueta en x 48, y 64. Titular en las columnas 1–7, y 180–560, 124 px, ink. Texto secundario en las columnas 1–6, y 620–760, 32 px, ink. Isotipo oficial (desde la referencia adjunta) en las columnas 9–12, dentro del área de (760, 640) a (1032, 990), ≈ 270 × 350 px, en ink #0F0F0F. Línea conductora ink de 1 px a 45° de (420, 1120) a (760, 780), que termina en la esquina inferior izquierda del isotipo. CTA: píldora ink con el texto en lima, x 340–700, y 1212–1290; microcopy POR WHATSAPP en mono, 20 px, ink, a la derecha de la píldora (x 724, centrado en altura).
- JERARQUÍA: 1 titular · 2 CTA · 3 texto secundario · 4 isotipo y línea · 5 microcopy.
- DISTRIBUCIÓN: Espacio negativo amplio a la derecha del titular y alrededor del isotipo.
- PALETA DEL SLIDE: #BFEA00 fondo; #0F0F0F texto, línea y píldora; #BFEA00 texto de la píldora.
- RECURSOS GRÁFICOS: Superficie plena, línea a 45°, píldora CTA.
- TEXTURAS: Ninguna.
- GEOMETRÍA: Una sola línea a 45° que llega al isotipo.
- CONSTANTES APLICADAS: Espina, márgenes, titular de cierre de 124 px, posición del wordmark, línea conductora.
- VARIACIÓN DE ESTE SLIDE: Único slide con CTA y con isotipo.
- CONEXIÓN: Completa la línea iniciada en el slide 1.
- LOGO · ADJUNTAR: lab/brand/wordmark-ink.png + lab/brand/isotipo-ink.png
- LOGO · USO: wordmark, bottom-left, left edge at x 48, vertically centered at y 1257, 220 px wide, ink #0F0F0F; isotipo, inside the area x 760-1032, y 640-990, about 350 px tall, ink #0F0F0F; wordmark and isotipo stay separate elements

## CONTROL

| Comprobación | Resultado |
|---|---|
| Narrativa P→T→S→C→A completa | Sí |
| Un solo CTA, en el último slide | Sí |
| Sin cifras, garantías ni testimonios | Sí |
| Sin palabras prohibidas | Sí |
| Superficies contiguas distintas | Sí |
| Espina y posición del wordmark constantes; cada slide indica qué PNG adjuntar | Sí |
| Todos los slides con todos sus campos | Sí |

---

## Paso 2 · Salida del Carousel Prompt Segmenter

> El segmentador recibió el documento anterior completo. Cada bloque se ejecuta solo en el generador.

### SLIDE 1 / 5

```text
▶ ADJUNTAR AL GENERADOR: lab/brand/wordmark-ink.png
VERK · CARRUSEL «Las herramientas digitales de un negocio que no están conectadas.» · SLIDE 1 / 5
Genera UNA imagen publicitaria terminada de 1080 × 1350 px. Es el slide 1 de 5 de un carrusel; debe verse como parte de la misma serie aunque se genere sola.

1 · CONTEXTO ESENCIAL DE VERK
VERK es un estudio de infraestructura digital (México). Diseña y construye sistemas digitales conectados —sitios web, automatizaciones, integraciones CRM y herramientas con IA— para que un negocio no pierda clientes entre una herramienta y otra. Frase de marca: «Construimos sistemas. No sitios.» Estética: editorial, experimental, precisa y tecnológica; concepto «Una sola dirección», con la diagonal de 45° (abajo-izquierda → arriba-derecha) como línea compositiva. No es una agencia de marketing ni un SaaS; la imagen nunca debe parecer publicidad tecnológica genérica.

2 · CONCEPTO GENERAL DEL CARRUSEL
Concepto creativo: «Cada herramienta tiene una parte de la historia.» Cuatro piezas sueltas que, al conectarse, encuentran una sola dirección.
Insight: El negocio ya pagó por las herramientas; lo que falla no es la tecnología, es lo que pasa entre una y otra.
Ángulo comercial: No vender otra herramienta: vender la conexión entre las que ya existen.

3 · ESTE SLIDE
Slide 1 de 5 · Función: Hook: que el lector reconozca su propio stack desconectado. · Tiempo narrativo: Problema

4 · COPY EXACTO (render letter by letter; these are the only words allowed in the image)
- Etiqueta (monospace, uppercase, small): «01 / 05 · HERRAMIENTAS»
- Titular (bold neo-grotesque, very large): «Tienes las herramientas. No se hablan.»
- Texto secundario (regular, small): «Sitio, WhatsApp, CRM y agenda. Cada uno tiene una parte de la historia.»
- Microcopy (monospace, small): «SITIO · WHATSAPP · CRM · AGENDA» (etiquetas de las cuatro piezas, una por rectángulo)

5 · DIRECCIÓN VISUAL
Concepto visual: Cuatro piezas sueltas que no apuntan a ningún lado: cuatro rectángulos de contorno fino, cada uno con su etiqueta mono, dispersos y desalineados.
Territorio: T1 Editorial tipográfico, con anotación técnica.
Superficie: Cream #F0EEE9

6 · COMPOSICIÓN
Partición 8+3. Etiqueta en x 48, y 64. Titular en las columnas 1–8, y 200–560, 112 px, ink. Texto secundario en las columnas 1–6, y 620–720, 34 px, ink. Cuatro rectángulos de contorno de 1 px (≈150 × 60 px) con las etiquetas SITIO, WHATSAPP, CRM y AGENDA, dispersos en las columnas 7–12 entre y 800 y y 1150, sin rotar pero desalineados en altura y separación. Línea conductora ink de 1 px a 45° de (720, 1300) a (1000, 1020), terminada en un círculo abierto de 10 px.
Distribución: Espacio negativo en la franja superior derecha (columnas 9–12, y 200–760) y entre las piezas.

7 · JERARQUÍA
1 titular · 2 las cuatro piezas dispersas · 3 texto secundario · 4 etiqueta mono.

8 · PALETA
#F0EEE9 fondo; #0F0F0F texto, contornos y línea; #5C5C5C etiquetas de las piezas.

9 · TIPOGRAFÍA
Titular: neo-grotesca Bold tipo Neue Haas Grotesk, interletraje muy cerrado, interlineado 0.9, caja de oración, alineado a la izquierda. Texto: misma familia, regular. Etiquetas y microcopy: monoespaciada tipo Geist Mono, mayúsculas, pequeña. Escala según las constantes del carrusel: Titulares de los slides 1–4 a 112 px y del slide 5 a 124 px, Bold, interlineado 0.9, alineados a la columna 1. Texto secundario de 30–34 px.

10 · RECURSOS GRÁFICOS, TEXTURAS Y GEOMETRÍA
Recursos: Rectángulos de contorno de 1 px, línea conductora a 45°, un cruce de registro pequeño en x 1000, y 96.
Texturas: Ninguna; papel plano.
Geometría: Rectángulos sin alineación entre sí; una sola línea a 45°.

11 · CONTINUIDAD CON EL CARRUSEL
Constantes del carrusel: Espina: etiqueta mono en la esquina superior izquierda (x 48, y 64), 22 px, mayúsculas, formato «0N / 05 · TEMA». Márgenes de 48 px. Titulares de los slides 1–4 a 112 px y del slide 5 a 124 px, Bold, interlineado 0.9, alineados a la columna 1. Texto secundario de 30–34 px. Posición estándar del wordmark: abajo a la izquierda, borde izquierdo en x 48, centrado en y 1257, 220 px de ancho, en ink sobre superficies claras y en cream sobre ink; esa zona (x 48–308, y 1212–1302) no se ocupa con otros elementos en ningún slide. Paleta solo con ink, cream, violet, lime y cream-warm. Elemento conductor: una línea de 1 px a exactamente 45°, siempre del mismo grosor, cuyo estado narra la historia: suelta (1), cortada (2), uniendo las piezas (3), dentro del diagrama (4) y completa hasta el isotipo (5); es ink sobre superficies claras y cream sobre ink. Las cuatro piezas (SITIO, WHATSAPP, CRM, AGENDA) se dibujan siempre como rectángulos de contorno fino con etiqueta mono.
Secuencia cromática del carrusel: 1 cream #F0EEE9 → 2 ink #0F0F0F → 3 violet #6B6AF4 → 4 cream-warm #E6E1D5 → 5 lime #BFEA00
Tratamientos del carrusel: Isolíneas solo en el slide 2; diagrama de sistema solo en el slide 4; los demás, tipografía, superficie y línea.
Constantes aplicadas en este slide: Espina, márgenes, titular de 112 px, posición del wordmark, línea conductora.
Variación de este slide: Piezas dispersas; la línea está suelta y no conecta nada.
Conexión con los slides vecinos: La línea suelta anticipa el corte del slide 2; las cuatro piezas reaparecen alineadas en el slide 3.

12 · INSTRUCCIONES NEGATIVAS
No inventar ni dibujar logos, monogramas ni símbolos que no estén en las imágenes de referencia adjuntas; no escribir «VERK»/«Verk» como texto en lugar del wordmark; no deformar ni recolorear fuera de la paleta el logo de referencia. Sin texto adicional al copy indicado. Sin personas, rostros, manos, laptops, stock, iconos 3D, glassmorphism, neón, degradados, brillos, flechas hacia arriba, redes de nodos brillantes, mockups de pantallas, emojis, simetría centrada, titulares en mayúsculas ni tipografías con serifa.

13 · FORMATO Y REGLAS DE MARCA
VERK BRAND RULES — follow strictly:
FORMAT: 1080 x 1350 px, 4:5 vertical.
PALETTE (flat colors only, no other hues): ink #0F0F0F, cream #F0EEE9, violet #6B6AF4, lime #BFEA00; support tones only if needed: warm cream #E6E1D5, dark #1A1A1A, footer black #0B0B0B. Never pure white #FFFFFF, never pure black #000000. No gradients, no glow, no shadows, no bloom.
SURFACE: exactly one protagonist flat background color. Text on violet or lime is ink #0F0F0F. Never cream text on lime. Never small lime text on cream.
TYPOGRAPHY: headline in a bold neo-grotesque sans (Neue Haas Grotesk Display Bold style), very tight letter-spacing, tight line-height, sentence case, left-aligned, extremely large. Secondary text in the same family, regular weight, small. Labels in a monospace (Geist Mono style), uppercase, tiny, slightly tracked. No serif, no script, no rounded or geometric display fonts, no all-caps headlines. Reproduce every quoted Spanish text exactly, letter by letter, with accents, punctuation and capitalization; add no other words. Text is part of the image.
COMPOSITION: asymmetric, left-aligned, 12-column editorial grid, 48 px margins, 35-50% negative space, one dominant visual gesture, the 45-degree diagonal (bottom-left to top-right) as secondary line, subtle technical annotation (thin 1px lines, small registration crosses, tiny monospace labels).
LOGO: integrate only the official VERK logo reference image(s) attached to this request, exactly as described in LOGO REFERENCE. Never draw, invent or imitate any other logo, monogram or symbol, and never type "VERK" or "Verk" as a substitute for the wordmark.
AVOID: stock photography, people, faces, hands on laptops, smiling teams, handshakes, 3D icons, glassmorphism, neon, lens flare, chrome, iridescence, glowing network nodes, upward arrows, dashboard or phone mockups, emojis, centered symmetric layout, clutter, watermarks, extra text.

14 · REFERENCIA DEL LOGO
LOGO REFERENCE — official VERK logo image(s) attached to this request:
- WORDMARK reference (file wordmark-ink.png, or wordmark-ink-on-cream.png): the official VERK wordmark, lowercase "verk" in custom-drawn letterforms, flat single color, width:height about 4.15:1.
- ISOTIPO reference (file isotipo-ink.png, or isotipo-ink-on-cream.png): the official VERK isotipo, three separate parallel rounded bars at exactly 45 degrees (rising bottom-left to top-right), flat single color, width:height about 0.77:1.
ATTACHED FOR THIS IMAGE: lab/brand/wordmark-ink.png
USE IN THIS IMAGE: wordmark, bottom-left, left edge at x 48, vertically centered at y 1257, 220 px wide, ink #0F0F0F
RULES: integrate the attached logo as a flat graphic element of the composition, copying its exact silhouette, letterforms, number of bars (3), 45-degree angle, spacing and proportions; scale it uniformly only. The background of the reference file (transparent or cream) is not part of the logo. Recolor it to one flat palette color with clear contrast: ink #0F0F0F on cream, warm cream, violet or lime; cream #F0EEE9 on ink or #0B0B0B; the isotipo may also be violet #6B6AF4 on cream. Never lime on cream, never cream on lime. Do not redraw or reinterpret it, change letters, add or remove bars, rotate, skew, stretch, outline it, add shadow, glow, gradient, texture or 3D, put it on a box or badge, combine wordmark and isotipo into a new lockup, or derive one from the other. Use only the logo files listed as attached; never draw a logo that is not attached.
```

### SLIDE 2 / 5

```text
▶ ADJUNTAR AL GENERADOR: lab/brand/wordmark-ink.png
VERK · CARRUSEL «Las herramientas digitales de un negocio que no están conectadas.» · SLIDE 2 / 5
Genera UNA imagen publicitaria terminada de 1080 × 1350 px. Es el slide 2 de 5 de un carrusel; debe verse como parte de la misma serie aunque se genere sola.

1 · CONTEXTO ESENCIAL DE VERK
VERK es un estudio de infraestructura digital (México). Diseña y construye sistemas digitales conectados —sitios web, automatizaciones, integraciones CRM y herramientas con IA— para que un negocio no pierda clientes entre una herramienta y otra. Frase de marca: «Construimos sistemas. No sitios.» Estética: editorial, experimental, precisa y tecnológica; concepto «Una sola dirección», con la diagonal de 45° (abajo-izquierda → arriba-derecha) como línea compositiva. No es una agencia de marketing ni un SaaS; la imagen nunca debe parecer publicidad tecnológica genérica.

2 · CONCEPTO GENERAL DEL CARRUSEL
Concepto creativo: «Cada herramienta tiene una parte de la historia.» Cuatro piezas sueltas que, al conectarse, encuentran una sola dirección.
Insight: El negocio ya pagó por las herramientas; lo que falla no es la tecnología, es lo que pasa entre una y otra.
Ángulo comercial: No vender otra herramienta: vender la conexión entre las que ya existen.

3 · ESTE SLIDE
Slide 2 de 5 · Función: Mostrar dónde se pierde el cliente: entre una herramienta y otra. · Tiempo narrativo: Tensión

4 · COPY EXACTO (render letter by letter; these are the only words allowed in the image)
- Etiqueta (monospace, uppercase, small): «02 / 05 · LO QUE SE PIERDE»
- Titular (bold neo-grotesque, very large): «El problema vive entre una y otra.»
- Texto secundario (regular, small): «El CRM no sabe lo que pasó en WhatsApp. La agenda no sabe lo que se cotizó.»
- Microcopy (monospace, small): «WHATSAPP · CRM» (una etiqueta sobre cada isla)

5 · DIRECCIÓN VISUAL
Concepto visual: Dos islas de curvas de nivel separadas por un vacío: la información existe, pero entre ellas no hay terreno. La línea conductora llega al borde del vacío y se corta.
Territorio: T4 Terreno (isolíneas)
Superficie: Ink #0F0F0F

6 · COMPOSICIÓN
Partición 7+4 con el gesto abajo. Etiqueta en x 48, y 64. Titular en las columnas 1–7, y 180–520, 112 px, cream. Texto secundario en las columnas 1–6, y 580–700, 34 px, cream. Dos islas de isolíneas en la mitad inferior, una a la izquierda (columnas 1–5, y 780–1150) y otra a la derecha (columnas 8–12, y 760–1130), con un vacío limpio de ≈180 px entre ellas. Etiqueta mono WHATSAPP sobre la isla izquierda y CRM sobre la derecha. Línea conductora cream de 1 px a 45° que sale de la isla izquierda en (380, 1000) y se corta en (500, 880), al borde del vacío.
Distribución: El vacío entre las islas es el espacio negativo protagonista.

7 · JERARQUÍA
1 titular · 2 las dos islas y el vacío · 3 texto secundario · 4 etiquetas.

8 · PALETA
#0F0F0F fondo; isolíneas #6B6AF4 (isla izquierda) y #F0EEE9 al 40 % (isla derecha); texto #F0EEE9; etiquetas #8C8C8C.

9 · TIPOGRAFÍA
Titular: neo-grotesca Bold tipo Neue Haas Grotesk, interletraje muy cerrado, interlineado 0.9, caja de oración, alineado a la izquierda. Texto: misma familia, regular. Etiquetas y microcopy: monoespaciada tipo Geist Mono, mayúsculas, pequeña. Escala según las constantes del carrusel: Titulares de los slides 1–4 a 112 px y del slide 5 a 124 px, Bold, interlineado 0.9, alineados a la columna 1. Texto secundario de 30–34 px.

10 · RECURSOS GRÁFICOS, TEXTURAS Y GEOMETRÍA
Recursos: Isolíneas de 1 px, línea conductora interrumpida, etiquetas mono.
Texturas: Solo las curvas de nivel; sin grano.
Geometría: Curvas orgánicas concéntricas; una línea a 45° interrumpida.

11 · CONTINUIDAD CON EL CARRUSEL
Constantes del carrusel: Espina: etiqueta mono en la esquina superior izquierda (x 48, y 64), 22 px, mayúsculas, formato «0N / 05 · TEMA». Márgenes de 48 px. Titulares de los slides 1–4 a 112 px y del slide 5 a 124 px, Bold, interlineado 0.9, alineados a la columna 1. Texto secundario de 30–34 px. Posición estándar del wordmark: abajo a la izquierda, borde izquierdo en x 48, centrado en y 1257, 220 px de ancho, en ink sobre superficies claras y en cream sobre ink; esa zona (x 48–308, y 1212–1302) no se ocupa con otros elementos en ningún slide. Paleta solo con ink, cream, violet, lime y cream-warm. Elemento conductor: una línea de 1 px a exactamente 45°, siempre del mismo grosor, cuyo estado narra la historia: suelta (1), cortada (2), uniendo las piezas (3), dentro del diagrama (4) y completa hasta el isotipo (5); es ink sobre superficies claras y cream sobre ink. Las cuatro piezas (SITIO, WHATSAPP, CRM, AGENDA) se dibujan siempre como rectángulos de contorno fino con etiqueta mono.
Secuencia cromática del carrusel: 1 cream #F0EEE9 → 2 ink #0F0F0F → 3 violet #6B6AF4 → 4 cream-warm #E6E1D5 → 5 lime #BFEA00
Tratamientos del carrusel: Isolíneas solo en el slide 2; diagrama de sistema solo en el slide 4; los demás, tipografía, superficie y línea.
Constantes aplicadas en este slide: Espina, márgenes, titular de 112 px, posición del wordmark, línea conductora.
Variación de este slide: Única superficie oscura; las isolíneas aparecen solo aquí.
Conexión con los slides vecinos: La línea suelta del slide 1 ahora se corta en el vacío; el slide 3 la completa.

12 · INSTRUCCIONES NEGATIVAS
No inventar ni dibujar logos, monogramas ni símbolos que no estén en las imágenes de referencia adjuntas; no escribir «VERK»/«Verk» como texto en lugar del wordmark; no deformar ni recolorear fuera de la paleta el logo de referencia. Sin texto adicional al copy indicado. Sin personas, rostros, manos, laptops, stock, iconos 3D, glassmorphism, neón, degradados, brillos, flechas hacia arriba, redes de nodos brillantes, mockups de pantallas, emojis, simetría centrada, titulares en mayúsculas ni tipografías con serifa.

13 · FORMATO Y REGLAS DE MARCA
VERK BRAND RULES — follow strictly:
FORMAT: 1080 x 1350 px, 4:5 vertical.
PALETTE (flat colors only, no other hues): ink #0F0F0F, cream #F0EEE9, violet #6B6AF4, lime #BFEA00; support tones only if needed: warm cream #E6E1D5, dark #1A1A1A, footer black #0B0B0B. Never pure white #FFFFFF, never pure black #000000. No gradients, no glow, no shadows, no bloom.
SURFACE: exactly one protagonist flat background color. Text on violet or lime is ink #0F0F0F. Never cream text on lime. Never small lime text on cream.
TYPOGRAPHY: headline in a bold neo-grotesque sans (Neue Haas Grotesk Display Bold style), very tight letter-spacing, tight line-height, sentence case, left-aligned, extremely large. Secondary text in the same family, regular weight, small. Labels in a monospace (Geist Mono style), uppercase, tiny, slightly tracked. No serif, no script, no rounded or geometric display fonts, no all-caps headlines. Reproduce every quoted Spanish text exactly, letter by letter, with accents, punctuation and capitalization; add no other words. Text is part of the image.
COMPOSITION: asymmetric, left-aligned, 12-column editorial grid, 48 px margins, 35-50% negative space, one dominant visual gesture, the 45-degree diagonal (bottom-left to top-right) as secondary line, subtle technical annotation (thin 1px lines, small registration crosses, tiny monospace labels).
LOGO: integrate only the official VERK logo reference image(s) attached to this request, exactly as described in LOGO REFERENCE. Never draw, invent or imitate any other logo, monogram or symbol, and never type "VERK" or "Verk" as a substitute for the wordmark.
AVOID: stock photography, people, faces, hands on laptops, smiling teams, handshakes, 3D icons, glassmorphism, neon, lens flare, chrome, iridescence, glowing network nodes, upward arrows, dashboard or phone mockups, emojis, centered symmetric layout, clutter, watermarks, extra text.

14 · REFERENCIA DEL LOGO
LOGO REFERENCE — official VERK logo image(s) attached to this request:
- WORDMARK reference (file wordmark-ink.png, or wordmark-ink-on-cream.png): the official VERK wordmark, lowercase "verk" in custom-drawn letterforms, flat single color, width:height about 4.15:1.
- ISOTIPO reference (file isotipo-ink.png, or isotipo-ink-on-cream.png): the official VERK isotipo, three separate parallel rounded bars at exactly 45 degrees (rising bottom-left to top-right), flat single color, width:height about 0.77:1.
ATTACHED FOR THIS IMAGE: lab/brand/wordmark-ink.png
USE IN THIS IMAGE: wordmark, bottom-left, left edge at x 48, vertically centered at y 1257, 220 px wide, cream #F0EEE9
RULES: integrate the attached logo as a flat graphic element of the composition, copying its exact silhouette, letterforms, number of bars (3), 45-degree angle, spacing and proportions; scale it uniformly only. The background of the reference file (transparent or cream) is not part of the logo. Recolor it to one flat palette color with clear contrast: ink #0F0F0F on cream, warm cream, violet or lime; cream #F0EEE9 on ink or #0B0B0B; the isotipo may also be violet #6B6AF4 on cream. Never lime on cream, never cream on lime. Do not redraw or reinterpret it, change letters, add or remove bars, rotate, skew, stretch, outline it, add shadow, glow, gradient, texture or 3D, put it on a box or badge, combine wordmark and isotipo into a new lockup, or derive one from the other. Use only the logo files listed as attached; never draw a logo that is not attached.
```

### SLIDE 3 / 5

```text
▶ ADJUNTAR AL GENERADOR: lab/brand/wordmark-ink.png
VERK · CARRUSEL «Las herramientas digitales de un negocio que no están conectadas.» · SLIDE 3 / 5
Genera UNA imagen publicitaria terminada de 1080 × 1350 px. Es el slide 3 de 5 de un carrusel; debe verse como parte de la misma serie aunque se genere sola.

1 · CONTEXTO ESENCIAL DE VERK
VERK es un estudio de infraestructura digital (México). Diseña y construye sistemas digitales conectados —sitios web, automatizaciones, integraciones CRM y herramientas con IA— para que un negocio no pierda clientes entre una herramienta y otra. Frase de marca: «Construimos sistemas. No sitios.» Estética: editorial, experimental, precisa y tecnológica; concepto «Una sola dirección», con la diagonal de 45° (abajo-izquierda → arriba-derecha) como línea compositiva. No es una agencia de marketing ni un SaaS; la imagen nunca debe parecer publicidad tecnológica genérica.

2 · CONCEPTO GENERAL DEL CARRUSEL
Concepto creativo: «Cada herramienta tiene una parte de la historia.» Cuatro piezas sueltas que, al conectarse, encuentran una sola dirección.
Insight: El negocio ya pagó por las herramientas; lo que falla no es la tecnología, es lo que pasa entre una y otra.
Ángulo comercial: No vender otra herramienta: vender la conexión entre las que ya existen.

3 · ESTE SLIDE
Slide 3 de 5 · Función: Nombrar la solución: el sistema que conecta, no otra herramienta. · Tiempo narrativo: Sistema

4 · COPY EXACTO (render letter by letter; these are the only words allowed in the image)
- Etiqueta (monospace, uppercase, small): «03 / 05 · EL SISTEMA»
- Titular (bold neo-grotesque, very large): «No falta otra herramienta. Falta el sistema.»
- Texto secundario (regular, small): «Un solo recorrido: cada contacto entra, se registra y avanza al siguiente paso.»
- Microcopy (monospace, small): «SITIO · WHATSAPP · CRM · AGENDA» (etiquetas de las cuatro piezas, una por rectángulo)

5 · DIRECCIÓN VISUAL
Concepto visual: Las cuatro piezas del slide 1, ahora alineadas en una sola diagonal a 45° y unidas por una línea continua: una sola dirección.
Territorio: T2 Superficie + diagonal
Superficie: Violet #6B6AF4

6 · COMPOSICIÓN
Partición 7+4, con el titular abajo. Etiqueta en x 48, y 64. Cuatro rectángulos de contorno de 1 px (≈150 × 60 px) escalonados exactamente sobre una diagonal a 45° de (520, 700) a (930, 290), en el orden SITIO, WHATSAPP, CRM y AGENDA, unidos por una línea ink continua de 1 px. Titular en las columnas 1–7, y 760–1060, 112 px, ink. Texto secundario en las columnas 1–6, y 1090–1180, 30 px, ink.
Distribución: Espacio negativo arriba a la izquierda (columnas 1–5, y 140–680).

7 · JERARQUÍA
1 titular · 2 la diagonal de piezas conectadas · 3 texto secundario · 4 etiqueta mono.

8 · PALETA
#6B6AF4 fondo; #0F0F0F texto, contornos y línea.

9 · TIPOGRAFÍA
Titular: neo-grotesca Bold tipo Neue Haas Grotesk, interletraje muy cerrado, interlineado 0.9, caja de oración, alineado a la izquierda. Texto: misma familia, regular. Etiquetas y microcopy: monoespaciada tipo Geist Mono, mayúsculas, pequeña. Escala según las constantes del carrusel: Titulares de los slides 1–4 a 112 px y del slide 5 a 124 px, Bold, interlineado 0.9, alineados a la columna 1. Texto secundario de 30–34 px.

10 · RECURSOS GRÁFICOS, TEXTURAS Y GEOMETRÍA
Recursos: Rectángulos de contorno de 1 px, línea continua a 45°.
Texturas: Ninguna; color plano.
Geometría: Alineación exacta a 45°.

11 · CONTINUIDAD CON EL CARRUSEL
Constantes del carrusel: Espina: etiqueta mono en la esquina superior izquierda (x 48, y 64), 22 px, mayúsculas, formato «0N / 05 · TEMA». Márgenes de 48 px. Titulares de los slides 1–4 a 112 px y del slide 5 a 124 px, Bold, interlineado 0.9, alineados a la columna 1. Texto secundario de 30–34 px. Posición estándar del wordmark: abajo a la izquierda, borde izquierdo en x 48, centrado en y 1257, 220 px de ancho, en ink sobre superficies claras y en cream sobre ink; esa zona (x 48–308, y 1212–1302) no se ocupa con otros elementos en ningún slide. Paleta solo con ink, cream, violet, lime y cream-warm. Elemento conductor: una línea de 1 px a exactamente 45°, siempre del mismo grosor, cuyo estado narra la historia: suelta (1), cortada (2), uniendo las piezas (3), dentro del diagrama (4) y completa hasta el isotipo (5); es ink sobre superficies claras y cream sobre ink. Las cuatro piezas (SITIO, WHATSAPP, CRM, AGENDA) se dibujan siempre como rectángulos de contorno fino con etiqueta mono.
Secuencia cromática del carrusel: 1 cream #F0EEE9 → 2 ink #0F0F0F → 3 violet #6B6AF4 → 4 cream-warm #E6E1D5 → 5 lime #BFEA00
Tratamientos del carrusel: Isolíneas solo en el slide 2; diagrama de sistema solo en el slide 4; los demás, tipografía, superficie y línea.
Constantes aplicadas en este slide: Espina, márgenes, titular de 112 px, posición del wordmark, línea conductora.
Variación de este slide: Titular en la parte inferior; la línea, por primera vez, completa.
Conexión con los slides vecinos: Resuelve las piezas dispersas del slide 1 y el corte del slide 2; el slide 4 muestra qué hay dentro del sistema.

12 · INSTRUCCIONES NEGATIVAS
No inventar ni dibujar logos, monogramas ni símbolos que no estén en las imágenes de referencia adjuntas; no escribir «VERK»/«Verk» como texto en lugar del wordmark; no deformar ni recolorear fuera de la paleta el logo de referencia. Sin texto adicional al copy indicado. Sin personas, rostros, manos, laptops, stock, iconos 3D, glassmorphism, neón, degradados, brillos, flechas hacia arriba, redes de nodos brillantes, mockups de pantallas, emojis, simetría centrada, titulares en mayúsculas ni tipografías con serifa.

13 · FORMATO Y REGLAS DE MARCA
VERK BRAND RULES — follow strictly:
FORMAT: 1080 x 1350 px, 4:5 vertical.
PALETTE (flat colors only, no other hues): ink #0F0F0F, cream #F0EEE9, violet #6B6AF4, lime #BFEA00; support tones only if needed: warm cream #E6E1D5, dark #1A1A1A, footer black #0B0B0B. Never pure white #FFFFFF, never pure black #000000. No gradients, no glow, no shadows, no bloom.
SURFACE: exactly one protagonist flat background color. Text on violet or lime is ink #0F0F0F. Never cream text on lime. Never small lime text on cream.
TYPOGRAPHY: headline in a bold neo-grotesque sans (Neue Haas Grotesk Display Bold style), very tight letter-spacing, tight line-height, sentence case, left-aligned, extremely large. Secondary text in the same family, regular weight, small. Labels in a monospace (Geist Mono style), uppercase, tiny, slightly tracked. No serif, no script, no rounded or geometric display fonts, no all-caps headlines. Reproduce every quoted Spanish text exactly, letter by letter, with accents, punctuation and capitalization; add no other words. Text is part of the image.
COMPOSITION: asymmetric, left-aligned, 12-column editorial grid, 48 px margins, 35-50% negative space, one dominant visual gesture, the 45-degree diagonal (bottom-left to top-right) as secondary line, subtle technical annotation (thin 1px lines, small registration crosses, tiny monospace labels).
LOGO: integrate only the official VERK logo reference image(s) attached to this request, exactly as described in LOGO REFERENCE. Never draw, invent or imitate any other logo, monogram or symbol, and never type "VERK" or "Verk" as a substitute for the wordmark.
AVOID: stock photography, people, faces, hands on laptops, smiling teams, handshakes, 3D icons, glassmorphism, neon, lens flare, chrome, iridescence, glowing network nodes, upward arrows, dashboard or phone mockups, emojis, centered symmetric layout, clutter, watermarks, extra text.

14 · REFERENCIA DEL LOGO
LOGO REFERENCE — official VERK logo image(s) attached to this request:
- WORDMARK reference (file wordmark-ink.png, or wordmark-ink-on-cream.png): the official VERK wordmark, lowercase "verk" in custom-drawn letterforms, flat single color, width:height about 4.15:1.
- ISOTIPO reference (file isotipo-ink.png, or isotipo-ink-on-cream.png): the official VERK isotipo, three separate parallel rounded bars at exactly 45 degrees (rising bottom-left to top-right), flat single color, width:height about 0.77:1.
ATTACHED FOR THIS IMAGE: lab/brand/wordmark-ink.png
USE IN THIS IMAGE: wordmark, bottom-left, left edge at x 48, vertically centered at y 1257, 220 px wide, ink #0F0F0F
RULES: integrate the attached logo as a flat graphic element of the composition, copying its exact silhouette, letterforms, number of bars (3), 45-degree angle, spacing and proportions; scale it uniformly only. The background of the reference file (transparent or cream) is not part of the logo. Recolor it to one flat palette color with clear contrast: ink #0F0F0F on cream, warm cream, violet or lime; cream #F0EEE9 on ink or #0B0B0B; the isotipo may also be violet #6B6AF4 on cream. Never lime on cream, never cream on lime. Do not redraw or reinterpret it, change letters, add or remove bars, rotate, skew, stretch, outline it, add shadow, glow, gradient, texture or 3D, put it on a box or badge, combine wordmark and isotipo into a new lockup, or derive one from the other. Use only the logo files listed as attached; never draw a logo that is not attached.
```

### SLIDE 4 / 5

```text
▶ ADJUNTAR AL GENERADOR: lab/brand/wordmark-ink.png
VERK · CARRUSEL «Las herramientas digitales de un negocio que no están conectadas.» · SLIDE 4 / 5
Genera UNA imagen publicitaria terminada de 1080 × 1350 px. Es el slide 4 de 5 de un carrusel; debe verse como parte de la misma serie aunque se genere sola.

1 · CONTEXTO ESENCIAL DE VERK
VERK es un estudio de infraestructura digital (México). Diseña y construye sistemas digitales conectados —sitios web, automatizaciones, integraciones CRM y herramientas con IA— para que un negocio no pierda clientes entre una herramienta y otra. Frase de marca: «Construimos sistemas. No sitios.» Estética: editorial, experimental, precisa y tecnológica; concepto «Una sola dirección», con la diagonal de 45° (abajo-izquierda → arriba-derecha) como línea compositiva. No es una agencia de marketing ni un SaaS; la imagen nunca debe parecer publicidad tecnológica genérica.

2 · CONCEPTO GENERAL DEL CARRUSEL
Concepto creativo: «Cada herramienta tiene una parte de la historia.» Cuatro piezas sueltas que, al conectarse, encuentran una sola dirección.
Insight: El negocio ya pagó por las herramientas; lo que falla no es la tecnología, es lo que pasa entre una y otra.
Ángulo comercial: No vender otra herramienta: vender la conexión entre las que ya existen.

3 · ESTE SLIDE
Slide 4 de 5 · Función: Mostrar qué construye VERK concretamente. · Tiempo narrativo: Capacidad

4 · COPY EXACTO (render letter by letter; these are the only words allowed in the image)
- Etiqueta (monospace, uppercase, small): «04 / 05 · LO QUE CONSTRUIMOS»
- Titular (bold neo-grotesque, very large): «Tus herramientas, en un solo flujo.»
- Texto secundario (regular, small): «Integramos CRM, WhatsApp, formularios y calendario, y automatizamos los seguimientos que hoy dependen de alguien.»
- Microcopy (monospace, small): «FORMULARIO · WHATSAPP · CRM · SEGUIMIENTO · AGENDA» (etiquetas de los cinco nodos)

5 · DIRECCIÓN VISUAL
Concepto visual: Plano técnico del sistema: cinco nodos y flujos dibujados como un plano de arquitecto; el CRM es el único nodo relleno.
Territorio: T6 Plano de sistema
Superficie: Cream-warm #E6E1D5

6 · COMPOSICIÓN
Partición 5+6. Etiqueta en x 48, y 64. Titular en las columnas 1–8, y 170–440, 112 px, ink. Texto secundario en las columnas 1–7, y 490–620, 32 px, ink. Diagrama en las columnas 2–12, y 700–1160: FORMULARIO y WHATSAPP a la izquierda, con flechas finas hacia CRM al centro; desde CRM, flechas hacia SEGUIMIENTO y AGENDA a la derecha. El flujo general sube hacia la derecha siguiendo la diagonal de 45°.
Distribución: Espacio negativo en las columnas 10–12 de la parte superior y alrededor del diagrama.

7 · JERARQUÍA
1 titular · 2 diagrama · 3 texto secundario · 4 etiquetas de los nodos.

8 · PALETA
#E6E1D5 fondo; #0F0F0F líneas y texto; #6B6AF4 relleno del nodo CRM, con su etiqueta en ink.

9 · TIPOGRAFÍA
Titular: neo-grotesca Bold tipo Neue Haas Grotesk, interletraje muy cerrado, interlineado 0.9, caja de oración, alineado a la izquierda. Texto: misma familia, regular. Etiquetas y microcopy: monoespaciada tipo Geist Mono, mayúsculas, pequeña. Escala según las constantes del carrusel: Titulares de los slides 1–4 a 112 px y del slide 5 a 124 px, Bold, interlineado 0.9, alineados a la columna 1. Texto secundario de 30–34 px.

10 · RECURSOS GRÁFICOS, TEXTURAS Y GEOMETRÍA
Recursos: Diagrama de sistema; anotación técnica (cotas finas, un cruce de registro).
Texturas: Ninguna.
Geometría: Rectángulos de esquinas suaves, flechas de trazo fino, flujo a 45°.

11 · CONTINUIDAD CON EL CARRUSEL
Constantes del carrusel: Espina: etiqueta mono en la esquina superior izquierda (x 48, y 64), 22 px, mayúsculas, formato «0N / 05 · TEMA». Márgenes de 48 px. Titulares de los slides 1–4 a 112 px y del slide 5 a 124 px, Bold, interlineado 0.9, alineados a la columna 1. Texto secundario de 30–34 px. Posición estándar del wordmark: abajo a la izquierda, borde izquierdo en x 48, centrado en y 1257, 220 px de ancho, en ink sobre superficies claras y en cream sobre ink; esa zona (x 48–308, y 1212–1302) no se ocupa con otros elementos en ningún slide. Paleta solo con ink, cream, violet, lime y cream-warm. Elemento conductor: una línea de 1 px a exactamente 45°, siempre del mismo grosor, cuyo estado narra la historia: suelta (1), cortada (2), uniendo las piezas (3), dentro del diagrama (4) y completa hasta el isotipo (5); es ink sobre superficies claras y cream sobre ink. Las cuatro piezas (SITIO, WHATSAPP, CRM, AGENDA) se dibujan siempre como rectángulos de contorno fino con etiqueta mono.
Secuencia cromática del carrusel: 1 cream #F0EEE9 → 2 ink #0F0F0F → 3 violet #6B6AF4 → 4 cream-warm #E6E1D5 → 5 lime #BFEA00
Tratamientos del carrusel: Isolíneas solo en el slide 2; diagrama de sistema solo en el slide 4; los demás, tipografía, superficie y línea.
Constantes aplicadas en este slide: Espina, márgenes, titular de 112 px, posición del wordmark, línea conductora (las flechas del diagrama la continúan).
Variación de este slide: Único slide con diagrama.
Conexión con los slides vecinos: Abre el sistema del slide 3 para mostrar su interior; el slide 5 lleva la línea hasta el isotipo.

12 · INSTRUCCIONES NEGATIVAS
No inventar ni dibujar logos, monogramas ni símbolos que no estén en las imágenes de referencia adjuntas; no escribir «VERK»/«Verk» como texto en lugar del wordmark; no deformar ni recolorear fuera de la paleta el logo de referencia. Sin texto adicional al copy indicado. Sin personas, rostros, manos, laptops, stock, iconos 3D, glassmorphism, neón, degradados, brillos, flechas hacia arriba, redes de nodos brillantes, mockups de pantallas, emojis, simetría centrada, titulares en mayúsculas ni tipografías con serifa.

13 · FORMATO Y REGLAS DE MARCA
VERK BRAND RULES — follow strictly:
FORMAT: 1080 x 1350 px, 4:5 vertical.
PALETTE (flat colors only, no other hues): ink #0F0F0F, cream #F0EEE9, violet #6B6AF4, lime #BFEA00; support tones only if needed: warm cream #E6E1D5, dark #1A1A1A, footer black #0B0B0B. Never pure white #FFFFFF, never pure black #000000. No gradients, no glow, no shadows, no bloom.
SURFACE: exactly one protagonist flat background color. Text on violet or lime is ink #0F0F0F. Never cream text on lime. Never small lime text on cream.
TYPOGRAPHY: headline in a bold neo-grotesque sans (Neue Haas Grotesk Display Bold style), very tight letter-spacing, tight line-height, sentence case, left-aligned, extremely large. Secondary text in the same family, regular weight, small. Labels in a monospace (Geist Mono style), uppercase, tiny, slightly tracked. No serif, no script, no rounded or geometric display fonts, no all-caps headlines. Reproduce every quoted Spanish text exactly, letter by letter, with accents, punctuation and capitalization; add no other words. Text is part of the image.
COMPOSITION: asymmetric, left-aligned, 12-column editorial grid, 48 px margins, 35-50% negative space, one dominant visual gesture, the 45-degree diagonal (bottom-left to top-right) as secondary line, subtle technical annotation (thin 1px lines, small registration crosses, tiny monospace labels).
LOGO: integrate only the official VERK logo reference image(s) attached to this request, exactly as described in LOGO REFERENCE. Never draw, invent or imitate any other logo, monogram or symbol, and never type "VERK" or "Verk" as a substitute for the wordmark.
AVOID: stock photography, people, faces, hands on laptops, smiling teams, handshakes, 3D icons, glassmorphism, neon, lens flare, chrome, iridescence, glowing network nodes, upward arrows, dashboard or phone mockups, emojis, centered symmetric layout, clutter, watermarks, extra text.

14 · REFERENCIA DEL LOGO
LOGO REFERENCE — official VERK logo image(s) attached to this request:
- WORDMARK reference (file wordmark-ink.png, or wordmark-ink-on-cream.png): the official VERK wordmark, lowercase "verk" in custom-drawn letterforms, flat single color, width:height about 4.15:1.
- ISOTIPO reference (file isotipo-ink.png, or isotipo-ink-on-cream.png): the official VERK isotipo, three separate parallel rounded bars at exactly 45 degrees (rising bottom-left to top-right), flat single color, width:height about 0.77:1.
ATTACHED FOR THIS IMAGE: lab/brand/wordmark-ink.png
USE IN THIS IMAGE: wordmark, bottom-left, left edge at x 48, vertically centered at y 1257, 220 px wide, ink #0F0F0F
RULES: integrate the attached logo as a flat graphic element of the composition, copying its exact silhouette, letterforms, number of bars (3), 45-degree angle, spacing and proportions; scale it uniformly only. The background of the reference file (transparent or cream) is not part of the logo. Recolor it to one flat palette color with clear contrast: ink #0F0F0F on cream, warm cream, violet or lime; cream #F0EEE9 on ink or #0B0B0B; the isotipo may also be violet #6B6AF4 on cream. Never lime on cream, never cream on lime. Do not redraw or reinterpret it, change letters, add or remove bars, rotate, skew, stretch, outline it, add shadow, glow, gradient, texture or 3D, put it on a box or badge, combine wordmark and isotipo into a new lockup, or derive one from the other. Use only the logo files listed as attached; never draw a logo that is not attached.
```

### SLIDE 5 / 5

```text
▶ ADJUNTAR AL GENERADOR: lab/brand/wordmark-ink.png + lab/brand/isotipo-ink.png
VERK · CARRUSEL «Las herramientas digitales de un negocio que no están conectadas.» · SLIDE 5 / 5
Genera UNA imagen publicitaria terminada de 1080 × 1350 px. Es el slide 5 de 5 de un carrusel; debe verse como parte de la misma serie aunque se genere sola.

1 · CONTEXTO ESENCIAL DE VERK
VERK es un estudio de infraestructura digital (México). Diseña y construye sistemas digitales conectados —sitios web, automatizaciones, integraciones CRM y herramientas con IA— para que un negocio no pierda clientes entre una herramienta y otra. Frase de marca: «Construimos sistemas. No sitios.» Estética: editorial, experimental, precisa y tecnológica; concepto «Una sola dirección», con la diagonal de 45° (abajo-izquierda → arriba-derecha) como línea compositiva. No es una agencia de marketing ni un SaaS; la imagen nunca debe parecer publicidad tecnológica genérica.

2 · CONCEPTO GENERAL DEL CARRUSEL
Concepto creativo: «Cada herramienta tiene una parte de la historia.» Cuatro piezas sueltas que, al conectarse, encuentran una sola dirección.
Insight: El negocio ya pagó por las herramientas; lo que falla no es la tecnología, es lo que pasa entre una y otra.
Ángulo comercial: No vender otra herramienta: vender la conexión entre las que ya existen.

3 · ESTE SLIDE
Slide 5 de 5 · Función: Cerrar con el siguiente paso concreto. · Tiempo narrativo: Acción

4 · COPY EXACTO (render letter by letter; these are the only words allowed in the image)
- Etiqueta (monospace, uppercase, small): «05 / 05 · EL SIGUIENTE PASO»
- Titular (bold neo-grotesque, very large): «Veamos dónde se cortan tus herramientas.»
- Texto secundario (regular, small): «Empezamos con una auditoría gratuita y personalizada para definir qué conviene mejorar, construir o conectar.»
- Microcopy (monospace, small): «POR WHATSAPP»
- CTA (inside a pill button): «Solicitar auditoría»

5 · DIRECCIÓN VISUAL
Concepto visual: La línea conductora llega a su destino: termina en el isotipo oficial. Tres piezas, una dirección.
Territorio: T9 Minimalismo de marca
Superficie: Lime #BFEA00

6 · COMPOSICIÓN
Partición 7+4 (desfase 1). Etiqueta en x 48, y 64. Titular en las columnas 1–7, y 180–560, 124 px, ink. Texto secundario en las columnas 1–6, y 620–760, 32 px, ink. Isotipo oficial (desde la referencia adjunta) en las columnas 9–12, dentro del área de (760, 640) a (1032, 990), ≈ 270 × 350 px, en ink #0F0F0F. Línea conductora ink de 1 px a 45° de (420, 1120) a (760, 780), que termina en la esquina inferior izquierda del isotipo. CTA: píldora ink con el texto en lima, x 340–700, y 1212–1290; microcopy POR WHATSAPP en mono, 20 px, ink, a la derecha de la píldora (x 724, centrado en altura).
Distribución: Espacio negativo amplio a la derecha del titular y alrededor del isotipo.

7 · JERARQUÍA
1 titular · 2 CTA · 3 texto secundario · 4 isotipo y línea · 5 microcopy.

8 · PALETA
#BFEA00 fondo; #0F0F0F texto, línea y píldora; #BFEA00 texto de la píldora.

9 · TIPOGRAFÍA
Titular: neo-grotesca Bold tipo Neue Haas Grotesk, interletraje muy cerrado, interlineado 0.9, caja de oración, alineado a la izquierda. Texto: misma familia, regular. Etiquetas y microcopy: monoespaciada tipo Geist Mono, mayúsculas, pequeña. Escala según las constantes del carrusel: Titulares de los slides 1–4 a 112 px y del slide 5 a 124 px, Bold, interlineado 0.9, alineados a la columna 1. Texto secundario de 30–34 px.

10 · RECURSOS GRÁFICOS, TEXTURAS Y GEOMETRÍA
Recursos: Superficie plena, línea a 45°, píldora CTA.
Texturas: Ninguna.
Geometría: Una sola línea a 45° que llega al isotipo.

11 · CONTINUIDAD CON EL CARRUSEL
Constantes del carrusel: Espina: etiqueta mono en la esquina superior izquierda (x 48, y 64), 22 px, mayúsculas, formato «0N / 05 · TEMA». Márgenes de 48 px. Titulares de los slides 1–4 a 112 px y del slide 5 a 124 px, Bold, interlineado 0.9, alineados a la columna 1. Texto secundario de 30–34 px. Posición estándar del wordmark: abajo a la izquierda, borde izquierdo en x 48, centrado en y 1257, 220 px de ancho, en ink sobre superficies claras y en cream sobre ink; esa zona (x 48–308, y 1212–1302) no se ocupa con otros elementos en ningún slide. Paleta solo con ink, cream, violet, lime y cream-warm. Elemento conductor: una línea de 1 px a exactamente 45°, siempre del mismo grosor, cuyo estado narra la historia: suelta (1), cortada (2), uniendo las piezas (3), dentro del diagrama (4) y completa hasta el isotipo (5); es ink sobre superficies claras y cream sobre ink. Las cuatro piezas (SITIO, WHATSAPP, CRM, AGENDA) se dibujan siempre como rectángulos de contorno fino con etiqueta mono.
Secuencia cromática del carrusel: 1 cream #F0EEE9 → 2 ink #0F0F0F → 3 violet #6B6AF4 → 4 cream-warm #E6E1D5 → 5 lime #BFEA00
Tratamientos del carrusel: Isolíneas solo en el slide 2; diagrama de sistema solo en el slide 4; los demás, tipografía, superficie y línea.
Constantes aplicadas en este slide: Espina, márgenes, titular de cierre de 124 px, posición del wordmark, línea conductora.
Variación de este slide: Único slide con CTA y con isotipo.
Conexión con los slides vecinos: Completa la línea iniciada en el slide 1.

12 · INSTRUCCIONES NEGATIVAS
No inventar ni dibujar logos, monogramas ni símbolos que no estén en las imágenes de referencia adjuntas; no escribir «VERK»/«Verk» como texto en lugar del wordmark; no deformar ni recolorear fuera de la paleta el logo de referencia. Sin texto adicional al copy indicado. Sin personas, rostros, manos, laptops, stock, iconos 3D, glassmorphism, neón, degradados, brillos, flechas hacia arriba, redes de nodos brillantes, mockups de pantallas, emojis, simetría centrada, titulares en mayúsculas ni tipografías con serifa.

13 · FORMATO Y REGLAS DE MARCA
VERK BRAND RULES — follow strictly:
FORMAT: 1080 x 1350 px, 4:5 vertical.
PALETTE (flat colors only, no other hues): ink #0F0F0F, cream #F0EEE9, violet #6B6AF4, lime #BFEA00; support tones only if needed: warm cream #E6E1D5, dark #1A1A1A, footer black #0B0B0B. Never pure white #FFFFFF, never pure black #000000. No gradients, no glow, no shadows, no bloom.
SURFACE: exactly one protagonist flat background color. Text on violet or lime is ink #0F0F0F. Never cream text on lime. Never small lime text on cream.
TYPOGRAPHY: headline in a bold neo-grotesque sans (Neue Haas Grotesk Display Bold style), very tight letter-spacing, tight line-height, sentence case, left-aligned, extremely large. Secondary text in the same family, regular weight, small. Labels in a monospace (Geist Mono style), uppercase, tiny, slightly tracked. No serif, no script, no rounded or geometric display fonts, no all-caps headlines. Reproduce every quoted Spanish text exactly, letter by letter, with accents, punctuation and capitalization; add no other words. Text is part of the image.
COMPOSITION: asymmetric, left-aligned, 12-column editorial grid, 48 px margins, 35-50% negative space, one dominant visual gesture, the 45-degree diagonal (bottom-left to top-right) as secondary line, subtle technical annotation (thin 1px lines, small registration crosses, tiny monospace labels).
LOGO: integrate only the official VERK logo reference image(s) attached to this request, exactly as described in LOGO REFERENCE. Never draw, invent or imitate any other logo, monogram or symbol, and never type "VERK" or "Verk" as a substitute for the wordmark.
AVOID: stock photography, people, faces, hands on laptops, smiling teams, handshakes, 3D icons, glassmorphism, neon, lens flare, chrome, iridescence, glowing network nodes, upward arrows, dashboard or phone mockups, emojis, centered symmetric layout, clutter, watermarks, extra text.

14 · REFERENCIA DEL LOGO
LOGO REFERENCE — official VERK logo image(s) attached to this request:
- WORDMARK reference (file wordmark-ink.png, or wordmark-ink-on-cream.png): the official VERK wordmark, lowercase "verk" in custom-drawn letterforms, flat single color, width:height about 4.15:1.
- ISOTIPO reference (file isotipo-ink.png, or isotipo-ink-on-cream.png): the official VERK isotipo, three separate parallel rounded bars at exactly 45 degrees (rising bottom-left to top-right), flat single color, width:height about 0.77:1.
ATTACHED FOR THIS IMAGE: lab/brand/wordmark-ink.png + lab/brand/isotipo-ink.png
USE IN THIS IMAGE: wordmark, bottom-left, left edge at x 48, vertically centered at y 1257, 220 px wide, ink #0F0F0F; isotipo, inside the area x 760-1032, y 640-990, about 350 px tall, ink #0F0F0F; wordmark and isotipo stay separate elements
RULES: integrate the attached logo as a flat graphic element of the composition, copying its exact silhouette, letterforms, number of bars (3), 45-degree angle, spacing and proportions; scale it uniformly only. The background of the reference file (transparent or cream) is not part of the logo. Recolor it to one flat palette color with clear contrast: ink #0F0F0F on cream, warm cream, violet or lime; cream #F0EEE9 on ink or #0B0B0B; the isotipo may also be violet #6B6AF4 on cream. Never lime on cream, never cream on lime. Do not redraw or reinterpret it, change letters, add or remove bars, rotate, skew, stretch, outline it, add shadow, glow, gradient, texture or 3D, put it on a box or badge, combine wordmark and isotipo into a new lockup, or derive one from the other. Use only the logo files listed as attached; never draw a logo that is not attached.
```

### A) Tabla de verificación (salida del segmentador)

| Slide | Titular copiado | Caracteres en el maestro / en el prompt | Campos completos | Referencias del logo copiadas | «NO ESPECIFICADO» |
|---|---|---|---|---|---|
| 1 | Sí | 38 / 38 | Sí | Sí | — |
| 2 | Sí | 34 / 34 | Sí | Sí | — |
| 3 | Sí | 44 / 44 | Sí | Sí | — |
| 4 | Sí | 35 / 35 | Sí | Sí | — |
| 5 | Sí | 40 / 40 | Sí | Sí | — |

### B) Referencias por slide

| Slide | Adjuntar al generador | Uso |
|---|---|---|
| 1 | `lab/brand/wordmark-ink.png` | wordmark, bottom-left, left edge at x 48, vertically centered at y 1257, 220 px wide, ink #0F0F0F |
| 2 | `lab/brand/wordmark-ink.png` | wordmark, bottom-left, left edge at x 48, vertically centered at y 1257, 220 px wide, cream #F0EEE9 |
| 3 | `lab/brand/wordmark-ink.png` | wordmark, bottom-left, left edge at x 48, vertically centered at y 1257, 220 px wide, ink #0F0F0F |
| 4 | `lab/brand/wordmark-ink.png` | wordmark, bottom-left, left edge at x 48, vertically centered at y 1257, 220 px wide, ink #0F0F0F |
| 5 | `lab/brand/wordmark-ink.png + lab/brand/isotipo-ink.png` | wordmark, bottom-left, left edge at x 48, vertically centered at y 1257, 220 px wide, ink #0F0F0F; isotipo, inside the area x 760-1032, y 640-990, about 350 px tall, ink #0F0F0F; wordmark and isotipo stay separate elements |

### C) Contradicciones del maestro
Ninguna. Las superficies contiguas son distintas, el único CTA está en el último slide y no hay cifras en el copy.

---

## Paso 3 · Unión (aplicando `04`)

1. **Recepción:** archivos `herramientas-01-de-05.png` … `herramientas-05-de-05.png`.
2. **Completitud:** 5 de 5, todos de 1080 × 1350 px, numeración interna «01 / 05» … «05 / 05».
3. **Revisión por slide:**
   - el copy, comparado con el maestro letra por letra (incluidos «pasó», «cotizó», «dónde», «auditoría»);
   - superficies: cream, ink, violet, cream-warm, lime;
   - territorios: T1, T4, T2, T6, T9.
4. **Continuidad:**
   - Espina en x 48, y 64 en los cinco slides.
   - La línea conductora narra su estado: suelta, cortada, conectando, en el diagrama y llegando al isotipo.
   - Los titulares 1–4 miden 112 px y el 5, 124 px.
   - Leídos en orden, los titulares cuentan Problema → Tensión → Sistema → Capacidad → Acción.
5. **Logo (revisión, no composición):**
   - wordmark en x 48 en los cinco slides, con el color de cada superficie: ink, cream, ink, ink, ink;
   - isotipo ink en el slide 5, separado del wordmark;
   - todos desde las referencias adjuntas, con silueta, letras y barras intactas. Un slide con el logo mal se regenera.
6. **Entrega:** la carpeta `final/` con los 5 archivos en orden, la hoja de contacto, el maestro y la nota de regeneraciones.

---

## Verificación: ¿los prompts individuales preservan el concepto maestro?

| Criterio | Resultado | Evidencia |
|---|---|---|
| Copy idéntico | Sí | Los 5 titulares tienen el mismo número de caracteres en el maestro y en los prompts; etiquetas, textos, microcopy y CTA copiados literalmente. |
| Concepto preservado | Sí | El concepto, el insight y el ángulo están copiados en los 5 prompts. |
| Dirección visual sin cambios | Sí | Composición, jerarquía, distribución, paleta, recursos, texturas y geometría de cada slide copiados del maestro sin editar. |
| Independencia | Sí | Cada prompt incluye el contexto de VERK, el concepto, el sistema de continuidad completo, las negativas y el bloque de marca; ninguno remite a otro. |
| Continuidad | Sí | Las constantes, la secuencia cromática y los tratamientos son idénticos en los 5; cada uno conserva su propia «Conexión». |
| Nada inventado | Sí | Ningún campo adicional; ningún «NO ESPECIFICADO» necesario. |
| Logo desde la referencia | Sí | Cada prompt empieza con «▶ ADJUNTAR AL GENERADOR» y termina con su bloque LOGO REFERENCE relleno con los campos literales del maestro. |

---

## Validación de la actualización: el logo como imagen de referencia (2026-11-08)

| # | Criterio | Resultado | Evidencia |
|---|---|---|---|
| 1 | El modo A incluye una referencia de logo con ruta real | Sí | El prompt visual de la Prueba A empieza con «▶ ADJUNTAR AL GENERADOR: lab/brand/wordmark-ink.png»; el archivo existe (2048×493, ink, transparente). |
| 2 | El modo B define las referencias de cada slide | Sí | Cada slide del maestro tiene «LOGO · ADJUNTAR» y «LOGO · USO». |
| 3 | El segmentador conserva las instrucciones del logo | Sí | Cada prompt empieza con su «LOGO · ADJUNTAR» literal y su bloque LOGO REFERENCE lleva «LOGO · ADJUNTAR» y «LOGO · USO» literales. |
| 4 | Ningún prompt recomienda quitar el texto de la imagen | Sí | No queda ninguna instrucción de generar sin texto; el texto se reproduce literal y, si falla, se regenera. |
| 5 | No hay fase obligatoria de composición externa | Sí | `04` solo ordena, revisa y une; un logo o texto incorrecto se regenera. |
| 6 | El logo adapta su color sin perder identidad | Sí | El bloque permite recolorear a la paleta conservando silueta, letras, 3 barras y proporciones. En la Prueba B, el wordmark es cream sobre ink (slide 2) e ink en los demás; el isotipo, ink sobre lima. |
| 7 | No hay rutas inventadas | Sí | Todas las rutas citadas en la biblioteca existen en el repositorio. |
| 8 | Los ejemplos siguen autocontenidos y ejecutables | Sí | Cada prompt lleva el contexto, el bloque de marca y su bloque de referencia; basta adjuntar los PNG indicados. |

