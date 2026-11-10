# VERK · Biblioteca de prompts creativos

Prompts listos para copiar y pegar en un modelo de lenguaje o en un generador de imágenes. No hay software, APIs ni automatizaciones.

```
docs/creative-prompts/
├── README.md                              ← este índice
├── 00-VERK-MASTER-CONTEXT.md              ← todo lo que un modelo necesita saber de VERK
├── 01-INDIVIDUAL-IMAGE-MASTER-PROMPT.md   ← MODO A: un tema → una imagen completa
├── 02-CAROUSEL-MASTER-PROMPT.md           ← MODO B · 1: tema → carrusel completo (estrategia, narrativa, copy, dirección)
├── 03-CAROUSEL-PROMPT-SEGMENTER.md        ← MODO B · 2: maestro → un prompt independiente por slide
├── 04-CAROUSEL-ASSEMBLY-INSTRUCTIONS.md   ← MODO B · 3: unir las imágenes en orden, sin rediseñar
├── 05-ADVERTISING-COPY-GUIDELINES.md      ← reglas de copy (Problema → Tensión → Sistema → Capacidad → Acción)
├── 06-VISUAL-IDENTITY-GUIDELINES.md       ← dirección de arte, recursos, protocolo del logo y bloques canónicos
└── 07-VALIDATION-EXAMPLES.md              ← Prueba A (imagen) y Prueba B (carrusel) completas
```

## Modo A: imagen individual

1. Abre `01`, copia el bloque «PROMPT» y reemplaza `{{TEMA}}`.
2. Pégalo en el modelo de lenguaje. La respuesta trae estrategia, copy, dirección de arte y el **prompt visual final**.
3. En el generador de imágenes, adjunta el PNG del logo que indica la primera línea del prompt visual (`lab/brand/wordmark-ink.png` y, si aplica, `lab/brand/isotipo-ink.png`).
4. Pega el prompt visual y genera (1080 × 1350). Sale la imagen completa, con el copy y el logo integrados.

## Modo B: carrusel

1. **`02`:** reemplaza `{{TEMA}}` y ejecútalo. Revisa y aprueba el documento maestro.
2. **`03`:** pega el maestro aprobado en `{{DOCUMENTO_MAESTRO}}` y ejecútalo. Recibes un prompt por slide y una tabla de verificación.
3. **Generador:** ejecuta cada prompt por separado, adjuntando en cada ejecución los PNG que indica su línea «▶ ADJUNTAR AL GENERADOR».
4. **`04`:** ordena las imágenes, revisa el copy, el logo y la continuidad, y únelas. Si algo falla, se regenera ese slide.

## Reglas que no cambian

- El logo se entrega al generador como **imagen de referencia adjunta**: `lab/brand/wordmark-ink.png` y `lab/brand/isotipo-ink.png` (variantes `-on-cream` si no admite transparencia). Se integra conservando su forma y puede recolorearse a la paleta. No se inventa otro logo ni se escribe «Verk» en su lugar.
- El texto se genera dentro de la imagen, literal. No se compone nada por fuera.
- Solo la paleta ink, cream, violet y lima (más los tonos de apoyo). Sin degradados.
- Sin cifras, testimonios ni clientes inventados. La auditoría es gratuita y personalizada.
- El contexto vigente está en `00`. Si un documento antiguo lo contradice, gana `00` (ver su §13).
