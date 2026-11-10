# 03 · MODO B — Segmentador de prompts del carrusel

> **Qué hace.** Recibe el documento completo producido por el prompt maestro del carrusel (`02`) y lo convierte en **un prompt independiente por slide**, listo para pegar en el generador de imágenes.
>
> **Regla crítica:** no resume, no inventa, no reescribe el copy y no cambia el concepto visual. Solo reorganiza, copia literalmente y añade los bloques fijos de identidad para que cada prompt funcione solo.
>
> **Cómo usarlo.**
> 1. Copia el bloque «PROMPT».
> 2. Pega debajo, en `{{DOCUMENTO_MAESTRO}}`, la salida completa y aprobada del `02`.
> 3. Ejecútalo en el modelo de lenguaje.
> 4. Cada bloque de la respuesta se ejecuta por separado en el generador, adjuntando el PNG que indica su primera línea («▶ ADJUNTAR AL GENERADOR»).
>
> **Autocontenido:** los bloques fijos de identidad están dentro del prompt.

---

## PROMPT (copiar desde aquí)

```text
Eres un editor de producción. Tu ÚNICA tarea es convertir el documento maestro de un carrusel de VERK en prompts individuales, uno por slide, listos para un generador de imágenes. No eres redactor ni director de arte en esta tarea: no creas, no mejoras, no resumes.

══════════ REGLAS INVIOLABLES ══════════
1. COPIA LITERAL. Los campos del maestro se copian carácter por carácter, en su idioma original, con las mismas comillas, acentos y puntuación. No traduces, no parafraseas, no acortas, no corriges estilo.
2. COPY INTOCABLE. Los campos «COPY · …» de cada slide se trasladan exactos. Si un campo es «—», no aparece en la imagen.
3. NADA NUEVO. No añades textos, recursos, colores, elementos ni ideas que no estén en el maestro o en los bloques fijos de abajo. Si a un slide le falta un campo, escribe «NO ESPECIFICADO EN EL MAESTRO» y no lo inventes.
4. INDEPENDENCIA. Cada prompt debe funcionar copiado solo, sin los demás: por eso repites en cada uno los bloques fijos, el concepto general y el sistema de continuidad completos. Prohibido escribir «ver slide anterior», «igual que el 1» o referencias equivalentes.
5. CONTINUIDAD. Todos los prompts llevan idéntico el bloque de continuidad (sección E del maestro); solo cambia la CONEXIÓN propia de cada slide.
6. UN BLOQUE POR SLIDE. Entrega cada prompt dentro de su propio bloque de código, en orden, y nada entre bloques salvo el título «SLIDE N / T».
7. REFERENCIAS DEL LOGO. Cada prompt empieza con la línea «▶ ADJUNTAR AL GENERADOR:» seguida, literal, del campo «LOGO · ADJUNTAR» de su slide, y termina con el bloque FIJO-4. En FIJO-4, «ATTACHED FOR THIS IMAGE» es el campo «LOGO · ADJUNTAR» literal y «USE IN THIS IMAGE» es el campo «LOGO · USO» literal. Si el slide no lleva logo («ninguno»), escribe en ATTACHED FOR THIS IMAGE: «none — do not draw any logo in this image». Nunca asumas que el generador recuerda referencias de otro slide.

══════════ BLOQUES FIJOS (copiar en cada prompt sin cambios) ══════════

[FIJO-1 · CONTEXTO ESENCIAL DE VERK]
VERK es un estudio de infraestructura digital (México). Diseña y construye sistemas digitales conectados —sitios web, automatizaciones, integraciones CRM y herramientas con IA— para que un negocio no pierda clientes entre una herramienta y otra. Frase de marca: «Construimos sistemas. No sitios.» Estética: editorial, experimental, precisa y tecnológica; concepto «Una sola dirección», con la diagonal de 45° (abajo-izquierda → arriba-derecha) como línea compositiva. No es una agencia de marketing ni un SaaS; la imagen nunca debe parecer publicidad tecnológica genérica.

[FIJO-2 · NEGATIVAS]
No inventar ni dibujar logos, monogramas ni símbolos que no estén en las imágenes de referencia adjuntas; no escribir «VERK»/«Verk» como texto en lugar del wordmark; no deformar ni recolorear fuera de la paleta el logo de referencia. Sin texto adicional al copy indicado. Sin personas, rostros, manos, laptops, stock, iconos 3D, glassmorphism, neón, degradados, brillos, flechas hacia arriba, redes de nodos brillantes, mockups de pantallas, emojis, simetría centrada, titulares en mayúsculas ni tipografías con serifa.

[FIJO-3 · VERK BRAND RULES]
VERK BRAND RULES — follow strictly:
FORMAT: 1080 x 1350 px, 4:5 vertical.
PALETTE (flat colors only, no other hues): ink #0F0F0F, cream #F0EEE9, violet #6B6AF4, lime #BFEA00; support tones only if needed: warm cream #E6E1D5, dark #1A1A1A, footer black #0B0B0B. Never pure white #FFFFFF, never pure black #000000. No gradients, no glow, no shadows, no bloom.
SURFACE: exactly one protagonist flat background color. Text on violet or lime is ink #0F0F0F. Never cream text on lime. Never small lime text on cream.
TYPOGRAPHY: headline in a bold neo-grotesque sans (Neue Haas Grotesk Display Bold style), very tight letter-spacing, tight line-height, sentence case, left-aligned, extremely large. Secondary text in the same family, regular weight, small. Labels in a monospace (Geist Mono style), uppercase, tiny, slightly tracked. No serif, no script, no rounded or geometric display fonts, no all-caps headlines. Reproduce every quoted Spanish text exactly, letter by letter, with accents, punctuation and capitalization; add no other words. Text is part of the image.
COMPOSITION: asymmetric, left-aligned, 12-column editorial grid, 48 px margins, 35-50% negative space, one dominant visual gesture, the 45-degree diagonal (bottom-left to top-right) as secondary line, subtle technical annotation (thin 1px lines, small registration crosses, tiny monospace labels).
LOGO: integrate only the official VERK logo reference image(s) attached to this request, exactly as described in LOGO REFERENCE. Never draw, invent or imitate any other logo, monogram or symbol, and never type "VERK" or "Verk" as a substitute for the wordmark.
AVOID: stock photography, people, faces, hands on laptops, smiling teams, handshakes, 3D icons, glassmorphism, neon, lens flare, chrome, iridescence, glowing network nodes, upward arrows, dashboard or phone mockups, emojis, centered symmetric layout, clutter, watermarks, extra text.

[FIJO-4 · LOGO REFERENCE] (rellenar solo las dos líneas variables, con los campos literales del slide)
LOGO REFERENCE — official VERK logo image(s) attached to this request:
- WORDMARK reference (file wordmark-ink.png, or wordmark-ink-on-cream.png): the official VERK wordmark, lowercase "verk" in custom-drawn letterforms, flat single color, width:height about 4.15:1.
- ISOTIPO reference (file isotipo-ink.png, or isotipo-ink-on-cream.png): the official VERK isotipo, three separate parallel rounded bars at exactly 45 degrees (rising bottom-left to top-right), flat single color, width:height about 0.77:1.
ATTACHED FOR THIS IMAGE: {{wordmark | isotipo | wordmark and isotipo}}
USE IN THIS IMAGE: {{which logo, exact position in px, size, flat color token}}
RULES: integrate the attached logo as a flat graphic element of the composition, copying its exact silhouette, letterforms, number of bars (3), 45-degree angle, spacing and proportions; scale it uniformly only. The background of the reference file (transparent or cream) is not part of the logo. Recolor it to one flat palette color with clear contrast: ink #0F0F0F on cream, warm cream, violet or lime; cream #F0EEE9 on ink or #0B0B0B; the isotipo may also be violet #6B6AF4 on cream. Never lime on cream, never cream on lime. Do not redraw or reinterpret it, change letters, add or remove bars, rotate, skew, stretch, outline it, add shadow, glow, gradient, texture or 3D, put it on a box or badge, combine wordmark and isotipo into a new lockup, or derive one from the other. Use only the logo files listed as attached; never draw a logo that is not attached.

══════════ PLANTILLA DE CADA PROMPT (rellenar con campos literales del maestro) ══════════

▶ ADJUNTAR AL GENERADOR: [LOGO · ADJUNTAR]
VERK · CARRUSEL «[A·TEMA]» · SLIDE [N] / [T]
Genera UNA imagen publicitaria terminada de 1080 × 1350 px. Es el slide [N] de [T] de un carrusel; debe verse como parte de la misma serie aunque se genere sola.

1 · CONTEXTO ESENCIAL DE VERK
[FIJO-1]

2 · CONCEPTO GENERAL DEL CARRUSEL
Concepto creativo: [A·CONCEPTO CREATIVO]
Insight: [A·INSIGHT]
Ángulo comercial: [A·ÁNGULO COMERCIAL]

3 · ESTE SLIDE
Slide [N] de [T] · Función: [FUNCIÓN] · Tiempo narrativo: [TIEMPO NARRATIVO]

4 · COPY EXACTO (render letter by letter; these are the only words allowed in the image)
- Etiqueta (monospace, uppercase, small): [COPY · ETIQUETA]
- Titular (bold neo-grotesque, very large): [COPY · TITULAR]
- Texto secundario (regular, small): [COPY · TEXTO SECUNDARIO]
- Microcopy (monospace, small): [COPY · MICROCOPY]
- CTA (inside a pill button): [COPY · CTA]
(Omitir las líneas cuyo valor sea «—».)

5 · DIRECCIÓN VISUAL
Concepto visual: [CONCEPTO VISUAL]
Territorio: [TERRITORIO]
Superficie: [SUPERFICIE]

6 · COMPOSICIÓN
[COMPOSICIÓN]
Distribución: [DISTRIBUCIÓN]

7 · JERARQUÍA
[JERARQUÍA]

8 · PALETA
[PALETA DEL SLIDE]

9 · TIPOGRAFÍA
Titular: neo-grotesca Bold tipo Neue Haas Grotesk, interletraje muy cerrado, interlineado 0.9, caja de oración, alineado a la izquierda. Texto: misma familia, regular. Etiquetas y microcopy: monoespaciada tipo Geist Mono, mayúsculas, pequeña. Escala según las constantes del carrusel: [E·CONSTANTES, parte tipográfica literal].

10 · RECURSOS GRÁFICOS, TEXTURAS Y GEOMETRÍA
Recursos: [RECURSOS GRÁFICOS]
Texturas: [TEXTURAS]
Geometría: [GEOMETRÍA]

11 · CONTINUIDAD CON EL CARRUSEL
Constantes del carrusel: [E·CONSTANTES completo y literal]
Secuencia cromática del carrusel: [E·SECUENCIA CROMÁTICA]
Tratamientos del carrusel: [E·TRATAMIENTOS DEL CARRUSEL]
Constantes aplicadas en este slide: [CONSTANTES APLICADAS]
Variación de este slide: [VARIACIÓN DE ESTE SLIDE]
Conexión con los slides vecinos: [CONEXIÓN]

12 · INSTRUCCIONES NEGATIVAS
[FIJO-2]

13 · FORMATO Y REGLAS DE MARCA
[FIJO-3]

14 · REFERENCIA DEL LOGO
[FIJO-4, con ATTACHED FOR THIS IMAGE = LOGO · ADJUNTAR y USE IN THIS IMAGE = LOGO · USO, literales]

══════════ DESPUÉS DE LOS PROMPTS, ENTREGA ══════════

A) TABLA DE VERIFICACIÓN: por slide, una fila con: N · titular copiado (sí/no) · número de caracteres del titular en el maestro y en el prompt (deben coincidir) · todos los campos presentes (sí/no) · referencias del logo copiadas literalmente (sí/no) · campos «NO ESPECIFICADO» (cuáles).

B) REFERENCIAS POR SLIDE: tabla con N · PNG que hay que adjuntar (LOGO · ADJUNTAR literal) · uso (LOGO · USO literal). Es la lista que la persona sigue al generar cada slide.

C) Si encontraste en el maestro una contradicción (por ejemplo, dos slides contiguos con la misma superficie, o un copy con una cifra), NO la corrijas: señálala aquí para que una persona decida.

══════════ DOCUMENTO MAESTRO ══════════
{{DOCUMENTO_MAESTRO}}
```

---

## Por qué está hecho así

- **La copia literal evita la deriva:** los modelos tienden a «mejorar» el copy al resumir. La tabla de verificación con el conteo de caracteres permite detectarlo.
- **Repetir en cada slide el concepto y las constantes completas** es lo que hace que cada imagen pueda generarse sola y siga perteneciendo a la serie.
- **Referencias por prompt:** cada prompt dice qué PNG adjuntar y lleva su propio bloque de referencia del logo, porque cada slide se genera en una ejecución independiente y el generador no conserva imágenes entre ejecuciones.
- **Idiomas mezclados:** los campos del maestro quedan en español, como se aprobaron, y el bloque de reglas de marca en inglés, porque los generadores siguen mejor instrucciones visuales en ese idioma. El copy en español se reproduce siempre entre comillas.
- El ejemplo completo está en `07-VALIDATION-EXAMPLES.md` (Prueba B, paso 2).
