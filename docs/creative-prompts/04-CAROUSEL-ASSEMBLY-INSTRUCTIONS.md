# 04 · MODO B — Instrucciones de unión del carrusel

> **Qué es.** El procedimiento para reunir las imágenes generadas por separado en un carrusel, en el orden narrativo aprobado.
>
> **Regla:** la unión no rediseña. No se añade contenido, no se cambia el copy y no se retoca ninguna imagen: cada imagen llega completa, con el copy y el logo integrados por el generador.
>
> Se hace con el visor de imágenes del sistema o cualquier herramienta para ordenar y revisar archivos. No requiere software propio ni edición de las imágenes.

## 1. Recepción

1. **Reúne en una sola carpeta:**
   - el documento maestro aprobado (salida de `02`);
   - la salida del segmentador (`03`), con su tabla de verificación;
   - todas las imágenes generadas.
2. **Renombra cada imagen** según su slide: `<tema-corto>-0N-de-0T.png`, por ejemplo `herramientas-03-de-05.png`. El número sale del prompt con que se generó la imagen, no del orden en que llegó.
3. **Si hay varias versiones de un mismo slide,** elige una por slide **antes** de unir, con la lista del §3, y archiva las demás en una subcarpeta `descartes/`.

## 2. Verificación de completitud y formato

- [ ] Hay exactamente **T** imágenes (las que indica «NÚMERO DE SLIDES» del maestro), numeradas sin huecos ni duplicados.
- [ ] Cada imagen mide **1080 × 1350 px (4:5)**. Si mide otra cosa, no la recortes ni la estires: regenérala con el mismo prompt.
- [ ] Espacio de color sRGB. Formato PNG para revisar; para publicar, PNG o JPG de calidad ≥ 90.
- [ ] La numeración que aparece **dentro** de cada imagen (espina mono «0N / 0T») coincide con su nombre de archivo.

## 3. Revisión de cada slide (contra el maestro)

Por slide, compara con su bloque «SLIDE N / T» del maestro:

- [ ] **Copy:** idéntico letra por letra (titular, texto, etiqueta, microcopy, CTA). Revisa acentos (á, é, í, ó, ú), «ñ», «¿», mayúsculas, puntos finales y palabras extra inventadas por el generador. Si hay un error: regenera ese slide con su prompt y su referencia adjunta. Nunca edites el copy aprobado para que «encaje».
- [ ] **Superficie:** es la indicada en el maestro (muestrea con cuentagotas). Solo colores de la paleta: `#0F0F0F`, `#F0EEE9`, `#6B6AF4`, `#BFEA00`, `#E6E1D5`, `#1A1A1A`, `#0B0B0B`.
- [ ] **Territorio y recurso:** son los aprobados. Hay un gesto protagonista.
- [ ] **Legibilidad a tamaño de teléfono:** el titular se lee al 33 % de zoom. Contraste correcto: ink sobre violeta o lima, cream sobre ink. Nunca cream sobre lima.
- [ ] **Logo:** si el slide lleva logo (campo «LOGO · USO» del maestro), es el de la referencia adjunta, con silueta, letras, 3 barras a 45° y proporciones intactas, en el color y la posición indicados, sin caja, sombra ni efectos. Si el slide no lleva logo, no aparece ningún logo ni símbolo inventado. Si el logo está mal: regenera ese slide con el mismo prompt y la misma referencia.
- [ ] **Sin elementos prohibidos:** personas, stock, iconos 3D, degradados, mockups, emojis.

## 4. Revisión de continuidad (el carrusel como serie)

Coloca los T slides en fila, en orden, y revísalos juntos:

- [ ] **Secuencia cromática:** coincide con «SECUENCIA CROMÁTICA» del maestro y dos slides contiguos no comparten superficie.
- [ ] **Espina:** la etiqueta mono y la numeración están en la misma posición en todos los slides.
- [ ] **Elemento conductor:** la línea, la barra o la diagonal avanza como dice «CONEXIÓN» y, si cruza bordes, empata en el corte.
- [ ] **Escala tipográfica:** los titulares de la misma función tienen el mismo tamaño.
- [ ] **Narrativa:** leídos en orden, los titulares cuentan Problema → Tensión → Sistema → Capacidad → Acción.
- [ ] **Cierre:** solo el último slide tiene CTA, y es «Solicitar auditoría».
- [ ] **Logo en la serie:** el wordmark está en la misma posición, con el mismo tamaño y la misma regla de color, en todos los slides que lo llevan.

Si un slide rompe la continuidad, **se regenera ese slide** con su prompt; no se corrige pintando encima.

## 5. Unión y entrega

1. **Ordena** los archivos finales por número (`01`→`0T`). Ese es el orden de subida a la plataforma.
2. **Hoja de contacto:** genera una imagen con los T slides en fila (sin modificar ninguno) para la aprobación final.
3. **Entrega:**
   - la carpeta `final/` con los T archivos numerados;
   - la hoja de contacto;
   - el documento maestro;
   - una nota con los slides regenerados y el motivo.
4. **Publicación:** sube en orden 1→T. El texto del post sale del maestro (B · HOOK / CTA); no se redacta uno nuevo sin aprobación.

## 6. Qué NO se hace en la unión

- Cambiar copy, colores, composición o recursos.
- Añadir textos, stickers, flechas de «desliza», marcos, bordes o marcas de agua.
- Recortar, estirar o reencuadrar para corregir un formato equivocado: se regenera.
- Reordenar slides respecto a la narrativa aprobada.
- Añadir, mover, recolorear o reemplazar el logo a mano, o componer texto por fuera: si algo está mal, se regenera el slide.
