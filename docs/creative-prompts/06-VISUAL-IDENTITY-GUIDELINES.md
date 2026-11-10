# 06 · Identidad visual para generación — VERK

> Reglas de dirección de arte para imágenes publicitarias generadas con IA. Fuente: doc 21 (Brand Lock v2), doc 22, doc 24 y el sitio publicado.
>
> La sección 9 contiene los **bloques canónicos** que se pegan tal cual en todo prompt visual: las reglas de marca y la referencia del logo, ambos en inglés. Los prompts 01, 02 y 03 ya los incluyen.
>
> **Principio:** el generador produce la imagen completa, con el texto y el logo integrados. El logo oficial se le entrega como imagen de referencia adjunta (§4).

## 1. Paleta (no hay otros colores)

| Token | HEX | Rol | Como superficie | Texto encima |
|---|---|---|---|---|
| Ink | `#0F0F0F` | Estructura | Sí | Cream; secundario `#8C8C8C` |
| Cream | `#F0EEE9` | Recibe; papel | Sí (nunca `#FFFFFF`) | Ink; secundario `#5C5C5C` |
| Violet | `#6B6AF4` | Inteligencia, sistema | Sí | Ink (cream solo en display grande) |
| Lime | `#BFEA00` | Acción | Sí | Ink; secundario `#404040` |
| Cream-warm | `#E6E1D5` | Papel alternativo | Sí | Ink |
| Dark elevated | `#1A1A1A` | Elementos sobre ink | No | Cream |
| `#0B0B0B` | — | Solo para el campo residual | Sí | Cream |

**Reglas:**
1. **Una superficie protagonista por pieza.** En un carrusel, dos slides contiguos nunca comparten superficie.
2. **Sin degradados, brillos ni sombras de color.** Solo planos.
3. **Prohibido:** cream sobre lime, lime como texto pequeño sobre cream, `#FFFFFF` y `#000000`.
4. **Contraste mínimo:** ink sobre violeta es 4.56:1 (AA). Violeta sobre cream solo en tamaños grandes.
5. **Fotografía:** si se usa, desaturada hacia ink/cream, con un solo acento violeta o lima.

## 2. Tipografía

| Rol | Familia | Estilo | En 1080×1350 |
|---|---|---|---|
| Titular | Neue Haas Grotesk Display/Text | Bold 700, interletraje −0.045em, interlineado 0.9, caja de oración, punto final, alineado a la izquierda | 96–160 px |
| Texto secundario | Neue Haas Grotesk Text | 400/500, interlineado 1.3 | 30–40 px |
| Etiqueta / dato | Geist Mono | 400/500, MAYÚSCULAS, +0.04em | 20–26 px |
| CTA | Neue Haas Grotesk Text 500 | Dentro de una píldora (radio total) | 30–34 px; píldora de 72–88 px de alto |

**Reglas:**
- Una sola escala display por pieza.
- Contraste de escala extremo: titular enorme junto a una etiqueta diminuta.
- Nunca titulares en mayúsculas, serifas, scripts ni Inter, Poppins o Montserrat.
- Las flechas (→ ↗) son trazos dibujados, no glifos decorativos.

**Texto dentro de la imagen.** El texto es parte de la composición: el generador produce titular, texto secundario, etiquetas, microcopy y CTA. El prompt incluye cada texto entre comillas, con su rol tipográfico, y la orden de reproducirlo letra por letra, con acentos, puntuación y mayúsculas.

**Si una generación sale con errores de texto** (letras cambiadas, acentos perdidos, palabras inventadas): regenera con el mismo prompt. Si el error persiste, refuerza el prompt sin cambiar el copy:
- enumera cada texto en su propia línea, con su número de líneas («2 líneas: "Te escribieron." / "Nadie contestó."»);
- añade «spell-check every Spanish word; no extra words».

No se elimina el texto de la imagen ni se compone por fuera.

## 3. Retícula y composición (1080 × 1350, 4:5)

| Parámetro | Valor |
|---|---|
| Márgenes | 48 px (≈ 4.4 %) |
| Columnas | 12 de ≈ 82 px |
| Línea compositiva secundaria | Diagonal de 45° ↗ (abajo-izquierda → arriba-derecha) |
| Particiones asimétricas | 7+4 (con desfase de 1), 5+6, 8+3, 3+9. Simetría solo con una razón explícita. |
| Espacio negativo | 35–50 % del lienzo, en la parte asimétrica de la partición |
| Espina | Etiqueta mono arriba a la izquierda (sección, numeración `01 / 05`, tema) |
| Un gesto | Un solo recurso protagonista (§5); los demás, como anotación |
| Rupturas permitidas | Sangrado, display que cruza el margen, recorte a exactamente 45°, desfase de media columna |

**Zonas estándar:**
- **Posición estándar del wordmark:** abajo a la izquierda, borde izquierdo en x 48, dentro de x 48–308, y 1212–1302 (≈ 220 px de ancho), sobre fondo plano y libre de otros elementos.
- **Zona CTA:** abajo, alineada con la columna del titular, encima del wordmark o a su derecha (x ≥ 340).

## 4. Logo oficial como imagen de referencia

### 4.1 Archivos (rutas reales del repositorio)

| Archivo | Ruta | Qué es | Uso |
|---|---|---|---|
| Wordmark (fuente vectorial) | `lab/brand/wordmark.svg` (idéntico a `src/assets/brand/wordmark.svg`) | «verk» dibujado, viewBox 902×217, `currentColor` | Fuente de los PNG; no se adjunta |
| Isotipo (fuente vectorial) | `lab/brand/isotipo.svg` (idéntico a `src/assets/brand/isotipo.svg`) | Tres barras redondeadas paralelas a 45°, viewBox 567×739 | Fuente de los PNG; no se adjunta |
| **Wordmark · referencia** | `lab/brand/wordmark-ink.png` | 2048×493 px, ink `#0F0F0F`, fondo transparente | **Se adjunta al generador** |
| Wordmark · referencia sobre cream | `lab/brand/wordmark-ink-on-cream.png` | 2048×493 px, ink sobre `#F0EEE9`, opaco | Solo si el generador muestra la transparencia como fondo negro |
| **Isotipo · referencia** | `lab/brand/isotipo-ink.png` | 1571×2048 px, ink `#0F0F0F`, fondo transparente | **Se adjunta al generador** |
| Isotipo · referencia sobre cream | `lab/brand/isotipo-ink-on-cream.png` | 1571×2048 px, ink sobre `#F0EEE9`, opaco | Solo si el generador no admite transparencia |

- **Origen de los PNG:** se exportaron el 2026-11-08 desde los SVG de `lab/brand/`. Solo se sustituyó `currentColor` por `#0F0F0F` y se rasterizó; la geometría no se tocó.
- **Fidelidad verificada contra los trazos originales** (`public/svg's/isotipo.svg` y `public/svg's/logo-simple.svg`): coincidencia de silueta de 0.9975 en el isotipo y 0.9831 en el wordmark, con la misma proporción.
- **No usar como referencia:**
  - `public/images/logo.png`: lockup antiguo con tagline, colores fuera de paleta.
  - `public/images/isotipo.png`: violeta `#5A69E6` fuera de token, fondo opaco.
  - `public/images/logo-simple.png`: fondo opaco, tono fuera de token.
  - Los trazos crudos de `public/svg's/`.
  - Cualquier isotipo de dos paralelogramos (versión antigua).

### 4.2 Cómo se adjunta

1. Cada prompt visual empieza con la línea **«▶ ADJUNTAR AL GENERADOR: …»**, que dice qué archivo (o archivos) subir.
2. Sube ese PNG en el campo de imagen o referencia del generador **en la misma ejecución** en que pegas el prompt. Escribir la ruta dentro del prompt no basta: el generador no puede leer archivos del repositorio.
3. Si el generador distingue tipos de referencia, úsalo como **referencia de contenido o de objeto** (forma exacta), no como referencia de estilo.
4. **No asumas memoria entre ejecuciones:** cada imagen, y cada slide de un carrusel, se genera con sus propias referencias adjuntas.
5. **Si el logo sale con fondo negro o en una caja:** vuelve a generar adjuntando la versión `-on-cream`. El prompt ya indica que el fondo de la referencia no forma parte del logo.

### 4.3 Reglas del logo

| Tema | Regla |
|---|---|
| Qué logo | Firma estándar: **wordmark** abajo a la izquierda. **Isotipo**: como objeto compositivo (T9) o cuando la narrativa lo pide (cierre de carrusel). Ambos pueden aparecer en una pieza, pero como elementos **separados**: no existe un lockup oficial. |
| Qué conserva | Silueta, letras (minúsculas «verk»), número de barras (3), ángulo de 45°, separación entre barras y proporciones (wordmark ≈ 4.15:1, isotipo ≈ 0.77:1). Solo se escala de forma uniforme. |
| Qué color puede tomar | Un solo color plano de la paleta, elegido por contraste: ink sobre cream, cream-warm, violeta o lima; cream sobre ink o `#0B0B0B`; el isotipo también puede ir en violeta sobre cream. Nunca lima sobre cream ni cream sobre lima. |
| Tamaño | Wordmark de 64 px mínimo de ancho (estándar: ~220 px en 1080). Isotipo según la composición. Área de protección: la altura de la «e». |
| Qué no se inventa | Otro logo, monogramas, iconos o símbolos de barras que no vengan de la referencia; el wordmark escrito como texto («VERK», «Verk»); un isotipo derivado del wordmark o al revés. |
| Qué no se le aplica | Rotación, sesgo, estiramiento, contorno, sombra, brillo, degradado, textura, 3D, caja o placa detrás. |

Si una generación altera el logo, se regenera con el mismo prompt y la misma referencia; no se retoca por fuera.

## 5. Recursos gráficos: cuándo y cómo

| Recurso | Qué es | Cuándo usarlo | Cuándo no | Descripción para el generador |
|---|---|---|---|---|
| **Fluid Halftone** | Trama de puntos violeta sobre cream, en retícula girada a 45°, con los puntos estirados por un flujo suave; zonas de mayor y menor densidad | Portadas, piezas de identidad, aperturas; cuando el tema es «lo que se mueve sin control» | Como relleno detrás de texto pequeño; en dos slides seguidos; con otros colores | "halftone field of round dots in #6B6AF4 on flat #F0EEE9, dot grid rotated exactly 45 degrees, dots slightly elongated along a slow fluid current flowing bottom-left to top-right, density varies smoothly, print-like precision" |
| **Isolíneas** | Curvas de nivel topográficas de 1 px sobre ink | Piezas de sistema, «el terreno de la operación», casos | Como textura genérica de fondo tecnológico | "thin 1px topographic contour lines in #6B6AF4 and #F0EEE9 at low opacity on flat #0F0F0F, organic nested curves like a terrain map, calm and precise" |
| **Residual Field** | Trazos cortos a 45° con estela, mayoría violeta, algunos cream y pocos lima, sobre `#0B0B0B`; densos en una zona y dispersos en el resto | Cierres, CTA final, «lo que queda en movimiento» | En aperturas; detrás de texto largo | "sparse field of short straight strokes all at exactly 45 degrees, each with a faint fading trail, mostly #6B6AF4, some #F0EEE9, very few #BFEA00, on flat #0B0B0B, dense on one side, nearly empty elsewhere" |
| **Geometría diagonal** | Líneas, barras planas o recortes a exactamente 45° | Conectar el titular con la zona de marca; transiciones; ritmo | Ángulos distintos de 45°; muchas a la vez | "one thin 1px line / one flat bar at exactly 45 degrees rising from bottom-left to top-right" |
| **Superficie cromática** | Un fondo plano completo de la paleta | Minimalismo, piezas tipográficas, CTA (lima) | Combinar dos superficies protagonistas | "completely flat uniform background in #BFEA00, no texture" |
| **Diagrama de sistema** | Nodos (rectángulos de esquinas suaves), flujos con flechas dibujadas, capas, etiquetas mono; líneas ink de 1 px; un nodo relleno de violeta o lima | Piezas informativas: cómo funciona, conexión de herramientas | Con iconos de stock dentro de los nodos; con datos inventados presentados como reales | "technical system diagram, thin 1px #0F0F0F lines on #E6E1D5, rectangular nodes with small monospace uppercase labels, arrows drawn as thin strokes, exactly one node filled with #6B6AF4" |
| **Anotación técnica** | Cotas, cruces de registro, numeración mono, estados (`OPERATIVO`) | Siempre, como capa secundaria | Como decoración saturada | "small registration crosses, thin dimension lines, tiny monospace uppercase labels" |
| **Escalera** | Elementos que avanzan una columna a la derecha por paso | Listas de 3–4 elementos (preguntas, pasos) | Más de 4 pasos | "three text blocks stepping one column to the right each, forming a descending staircase" |
| **Fotografía intervenida** (secundaria) | Foto documental de proceso, desaturada, con líneas de 1 px, cotas y una franja plana | «El antes»: escritorios con papeles, un teléfono con mensajes, mostradores | Gente sonriendo, laptops de stock, rostros | "documentary photograph, available light, desaturated toward warm greys, no faces, no brand names, with thin 1px annotation lines" |

**Un gesto por pieza.** Elige un recurso protagonista y, como mucho, la anotación técnica como capa secundaria.

## 6. Territorios visuales (el modelo elige uno por pieza)

| # | Territorio | Recurso protagonista | Superficie típica |
|---|---|---|---|
| T1 | **Editorial tipográfico** | El titular a escala de cartel | Cualquiera |
| T2 | **Superficie + diagonal** | Color pleno + una geometría a 45° | Violeta o lima |
| T3 | **Campo halftone** | Fluid Halftone | Cream |
| T4 | **Terreno (isolíneas)** | Isolíneas | Ink |
| T5 | **Residuo** | Residual Field | `#0B0B0B` |
| T6 | **Plano de sistema** | Diagrama | Cream-warm o cream |
| T7 | **Escalera** | Bloques escalonados | Ink o cream |
| T8 | **Antes intervenido** | Fotografía intervenida | Foto + franja de color |
| T9 | **Minimalismo de marca** | Solo superficie, una línea mono y el isotipo oficial a gran escala (desde la referencia adjunta) | Lima, violeta o ink |

**Variedad:** dos piezas seguidas de una misma campaña no repiten territorio ni superficie. Rota las particiones (7+4, 5+6, 8+3, 3+9).

## 7. Prohibiciones visuales

- Estética SaaS: dashboards flotantes, tarjetas con sombra, blobs pastel, personas planas ilustradas.
- Plantillas: título centrado, tres iconos y botón.
- Stock: gente sonriendo a pantallas, apretones de manos, flechas hacia arriba, redes de nodos brillantes, skylines.
- Iconos 3D, objetos girando, cromo, vidrio iridiscente, glassmorphism, neón, *lens flare*.
- Degradados de cualquier tipo.
- Mockups de laptop o teléfono con UI inventada.
- Halftone decorativo, ortogonal o multicolor.
- Simetría predecible; composiciones centradas.
- Emojis; titulares en mayúsculas.
- Logos, monogramas o símbolos inventados; el wordmark escrito como texto; el logo de referencia deformado.

## 8. Control de calidad de cada imagen

- [ ] Solo colores de la paleta (muestrea con cuentagotas).
- [ ] Una superficie protagonista y un gesto.
- [ ] Copy idéntico al aprobado, sin errores ortográficos.
- [ ] Titular legible a tamaño de teléfono; contraste correcto.
- [ ] Logo integrado desde la referencia adjunta: silueta, letras, barras y proporciones intactas; un color de token con contraste; sin efectos ni caja.
- [ ] Nada de las prohibiciones del §7.
- [ ] 1080 × 1350 px (4:5).

## 9. Bloque de identidad canónico (para pegar en todo prompt visual)

> Cópialo **tal cual**, sin resumir, al final de cualquier prompt para el generador de imágenes. Está en inglés porque los generadores siguen mejor instrucciones visuales en ese idioma; el copy de la pieza va siempre en español, entre comillas.

```text
VERK BRAND RULES — follow strictly:
FORMAT: 1080 x 1350 px, 4:5 vertical.
PALETTE (flat colors only, no other hues): ink #0F0F0F, cream #F0EEE9, violet #6B6AF4, lime #BFEA00; support tones only if needed: warm cream #E6E1D5, dark #1A1A1A, footer black #0B0B0B. Never pure white #FFFFFF, never pure black #000000. No gradients, no glow, no shadows, no bloom.
SURFACE: exactly one protagonist flat background color. Text on violet or lime is ink #0F0F0F. Never cream text on lime. Never small lime text on cream.
TYPOGRAPHY: headline in a bold neo-grotesque sans (Neue Haas Grotesk Display Bold style), very tight letter-spacing, tight line-height, sentence case, left-aligned, extremely large. Secondary text in the same family, regular weight, small. Labels in a monospace (Geist Mono style), uppercase, tiny, slightly tracked. No serif, no script, no rounded or geometric display fonts, no all-caps headlines. Reproduce every quoted Spanish text exactly, letter by letter, with accents, punctuation and capitalization; add no other words. Text is part of the image.
COMPOSITION: asymmetric, left-aligned, 12-column editorial grid, 48 px margins, 35-50% negative space, one dominant visual gesture, the 45-degree diagonal (bottom-left to top-right) as secondary line, subtle technical annotation (thin 1px lines, small registration crosses, tiny monospace labels).
LOGO: integrate only the official VERK logo reference image(s) attached to this request, exactly as described in LOGO REFERENCE. Never draw, invent or imitate any other logo, monogram or symbol, and never type "VERK" or "Verk" as a substitute for the wordmark.
AVOID: stock photography, people, faces, hands on laptops, smiling teams, handshakes, 3D icons, glassmorphism, neon, lens flare, chrome, iridescence, glowing network nodes, upward arrows, dashboard or phone mockups, emojis, centered symmetric layout, clutter, watermarks, extra text.
```

## 10. Bloque canónico de referencia del logo (para pegar en todo prompt visual)

> Va justo después del bloque de reglas de marca. Las dos primeras viñetas y las «RULES» se copian **tal cual**. Solo se rellenan las dos líneas variables:
> - `ATTACHED FOR THIS IMAGE`: qué archivo o archivos se adjuntan.
> - `USE IN THIS IMAGE`: qué logo, dónde, de qué tamaño y en qué color.
>
> Delante del prompt va siempre la línea para la persona: **«▶ ADJUNTAR AL GENERADOR: `lab/brand/…png`»**.

```text
LOGO REFERENCE — official VERK logo image(s) attached to this request:
- WORDMARK reference (file wordmark-ink.png, or wordmark-ink-on-cream.png): the official VERK wordmark, lowercase "verk" in custom-drawn letterforms, flat single color, width:height about 4.15:1.
- ISOTIPO reference (file isotipo-ink.png, or isotipo-ink-on-cream.png): the official VERK isotipo, three separate parallel rounded bars at exactly 45 degrees (rising bottom-left to top-right), flat single color, width:height about 0.77:1.
ATTACHED FOR THIS IMAGE: {{wordmark | isotipo | wordmark and isotipo}}
USE IN THIS IMAGE: {{which logo, exact position in px, size, flat color token}}
RULES: integrate the attached logo as a flat graphic element of the composition, copying its exact silhouette, letterforms, number of bars (3), 45-degree angle, spacing and proportions; scale it uniformly only. The background of the reference file (transparent or cream) is not part of the logo. Recolor it to one flat palette color with clear contrast: ink #0F0F0F on cream, warm cream, violet or lime; cream #F0EEE9 on ink or #0B0B0B; the isotipo may also be violet #6B6AF4 on cream. Never lime on cream, never cream on lime. Do not redraw or reinterpret it, change letters, add or remove bars, rotate, skew, stretch, outline it, add shadow, glow, gradient, texture or 3D, put it on a box or badge, combine wordmark and isotipo into a new lockup, or derive one from the other. Use only the logo files listed as attached; never draw a logo that is not attached.
```

**Valores habituales de `USE IN THIS IMAGE`:**
- **Firma estándar:** `wordmark, bottom-left, left edge at x 48, vertically centered at y 1257, 220 px wide, ink #0F0F0F` (cream `#F0EEE9` si la superficie es ink).
- **Isotipo como objeto (T9):** `isotipo, inside the area x … – …, y … – …, about N px tall, ink #0F0F0F` (o violeta sobre cream).

