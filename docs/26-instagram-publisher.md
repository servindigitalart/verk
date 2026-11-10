# 26 · Publicador de Instagram

> Estado al 2026-11-10: **E0 y E1 terminadas** (código y pruebas simuladas). No se ha llamado a ninguna API de pago, no se ha publicado nada y el workflow solo se puede lanzar a mano. `SOCIAL_ENABLED=false`.

## 1. Qué hace

En cada horario (08:00 y 13:00, imagen individual; 19:00, carrusel; hora de León, UTC−6 todo el año):

1. Revisa el `manifest.json` del horario en Drive y no hace nada si ya está publicado.
2. **Director** (`TEXT_MODEL`): elige `TEMA`, `OBJETIVO` y `SEGMENTO` con `00` y `05`, sin repetir los temas recientes.
3. **Biblioteca, literal:** `01` (individual) o `02` → `03` (carrusel). El código solo sustituye las líneas de ENTRADA (`TEMA`, `OBJETIVO`, `SEGMENTO`, `HISTORIAL`, `NÚMERO DE SLIDES = 5`) y el `{{DOCUMENTO_MAESTRO}}` de `03`. El resto del prompt se envía byte a byte.
4. **Lectura del formato fijo:**
   - copy aprobado;
   - prompt visual;
   - `LOGO · ADJUNTAR` y `LOGO · USO`.

   La tabla de verificación de `03` se aplica en código: copy, `▶ ADJUNTAR`, `ATTACHED` y `USE IN THIS IMAGE` deben ser literales. Si una respuesta sale fuera de formato, se repite una vez.
5. **Imagen** (`IMAGE_MODEL`, 1088×1360, `quality: high`, JPEG): prompt literal más los PNG de referencia que pide su línea «▶ ADJUNTAR». Los PNG se renderizan en cada ejecución desde `src/assets/brand/*.svg`, igual que `lab/brand/*.png`. Si no hay logo adjunto, se usa `/images/generations`.
6. Se reduce a 1080×1350 (misma proporción, sin recorte).
7. **Logo oficial como capa final** (§3).
8. **Validación:** JPEG, 1080×1350, ≤ 8 MB. Luego `VISION_MODEL` transcribe el texto de la imagen y se compara con el copy aprobado (§4).
9. Si falla, se regenera esa imagen (hasta 2 veces). Si sigue fallando, la pieza queda `failed` y no se publica.
10. **Drive:** se guardan `original/` (salida de OpenAI), `final/` (con logo) y `manifest.json`.
11. Espera a la hora exacta del horario.
12. **Publicación:**
    - comparte `final/*.jpg` («cualquiera con el enlace»);
    - descarga sin autenticación `drive.usercontent.google.com/download?id=…` y exige bytes JPEG reales;
    - crea los contenedores y espera `FINISHED` en todos;
    - llama a `media_publish`;
    - **retira siempre el permiso público**, también si algo falla.

## 2. Archivos

| Archivo | Función |
|---|---|
| `scripts/social/run.mjs` | Orquestador y CLI: `--slot 0800\|1300\|1900 [--dry-run] [--now]` |
| `scripts/social/library.mjs` | Carga y rellena `01`/`02`/`03`, lee sus salidas y arma el caption |
| `scripts/social/logo.mjs` | Referencias PNG, lectura de `LOGO · USO`, capa final del logo |
| `scripts/social/validate.mjs` | Imagen, copy, caption, comparación de texto, URL pública |
| `scripts/social/openai.mjs` | Verificación de modelos, imágenes, Responses, costo por llamada |
| `scripts/social/instagram.mjs` | Contenedores, estado, individual, carrusel, conciliación |
| `scripts/social/drive.mjs` | OAuth, carpetas, subida, manifest, permisos |
| `scripts/social/http.mjs` | Reintentos acotados y errores sin credenciales |
| `scripts/social/auth-google.mjs` | Uso local, una sola vez: obtiene el refresh token |
| `scripts/social/social.test.mjs` | 25 pruebas con red simulada |
| `.github/workflows/social.yml` | Solo `workflow_dispatch`; cron comentado |

Sin dependencias nuevas ni cambios en `package.json`. `sharp` llega como dependencia de Astro: si Astro dejara de traerlo, habría que declararlo.

## 3. Logo: capa final según `LOGO · USO`

- **Posición, tamaño y color:** salen del `LOGO · USO` de cada pieza (`USE IN THIS IMAGE` en `01`, campo del slide en `02`). No hay una posición universal.
- **Formas que se interpretan:**
  - `left/right edge at x N`, `centered at x N`, `top/bottom edge at y N`, `centered at y N`;
  - `inside the area x A-B, y C-D` (centrado en el área y nunca más grande que ella);
  - `N px wide` o `N px tall`;
  - un HEX de la paleta;
  - `no logo`.
- **Si algo no se puede resolver sin adivinar** (falta posición, tamaño o color, o el logo no está adjunto), la pieza falla **antes** de pagar la imagen.
- **Asset exacto:** se usa el SVG versionado (`src/assets/brand/wordmark.svg` o `isotipo.svg`) con su `viewBox`, a escala uniforme y recoloreado solo con `fill`.
- **Contraste según 06 §10:**
  - ink sobre cream, cream-warm, violet o lime;
  - cream sobre ink, `#1A1A1A` o `#0B0B0B`;
  - violet solo para el isotipo sobre cream o cream-warm;
  - nunca cream sobre lime ni lime sobre cream.
- **Antes de pintar:** el anillo alrededor de la zona (16 px de margen y 10 px de banda) tiene que ser una superficie plana de la paleta, con como máximo 1 % de píxeles distintos. Así se permite una línea de 1 px que llegue al logo.
- Si la zona está ocupada, la imagen se regenera. Si es plana, se repinta con ese color y se coloca el vector encima. El logo que dibujó el generador nunca llega a publicarse.

## 4. Texto y caption

- **Texto de la imagen:**
  - se compara campo por campo y por segmento «·», porque `SITIO · WHATSAPP · CRM` se dibuja como etiquetas separadas;
  - solo se normalizan espacios y saltos de línea; acentos, mayúsculas y puntuación deben coincidir.
  - Las palabras extra se registran en el manifest (`validation.extraWords`), pero no bloquean la publicación, porque la biblioteca pide anotación técnica en mono.
- **Caption:** solo copy aprobado por la biblioteca. Sin hashtags ni texto nuevo.
  - **Individual (`01`):** `01` no define caption, así que se usa el copy de la pieza en su orden de lectura: Titular, Texto secundario y «CTA · microcopy» (si hay CTA). La etiqueta mono no se incluye porque es anotación visual.
  - **Carrusel (`02`/`04`):** `04` §5 dice «el texto del post sale del maestro (B · HOOK / CTA)». Se usan HOOK y «CTA · microcopy del último slide». `DESARROLLO` no se usa porque es una nota de producción, no copy.
- **Validación del caption:**
  - ≤ 2 200 caracteres;
  - sin `#`;
  - sin cifras;
  - sin palabras prohibidas (`05` §5–6).

## 5. Seguridad operativa

- **Duplicados:**
  - el grupo de concurrencia es por horario;
  - el `manifest.json` lleva la clave fecha local + horario;
  - con `published`, la ejecución termina sin hacer nada.
- **Publicación parcial:**
  - nunca hay padre de carrusel sin los hijos `FINISHED`;
  - un hijo en `ERROR` o `EXPIRED` corta todo antes de crear el padre.
- **`media_publish`:** nunca se reintenta.
  - Si Meta lo rechaza (4xx), no hubo publicación.
  - Si se cae la red o hay un 5xx, se consulta `/{ig-user}/media` buscando el mismo caption, publicado después del inicio.
  - Si no aparece, el estado queda `publishing` y la siguiente ejecución vuelve a conciliar, sin publicar de nuevo.
- **Reintentos:** 429, 5xx y errores de red se reintentan con espera creciente (1, 2 y 4 s). Los demás 4xx no se reintentan. El 429 por límite de gasto de OpenAI no se reintenta.
- **Fallo al publicar:** la pieza vuelve a `ready`. Una reejecución manual solo publica, sin volver a generar ni pagar.
- **Logs públicos** (el repositorio es público):
  - solo muestran IDs, estados y número de llamadas;
  - el copy, los prompts y el detalle de los errores van al manifest en Drive;
  - los tokens viajan en cabeceras, nunca en URLs.
- **Interruptores:**
  - sin `--dry-run`, nada ocurre salvo que `SOCIAL_ENABLED=true`;
  - `--dry-run` genera y guarda, pero nunca comparte archivos ni llama a Instagram (consume OpenAI).

## 6. Medición de consumo por pieza

- Cada llamada a OpenAI (director, `01`/`02`/`03`, cada intento de imagen, cada transcripción) se guarda en `manifest.usage[]` con `step`, `model`, `usage` (tokens tal como los devuelve la API) y `costUsd`.
- `manifest.cost.usd` es la suma de la pieza y `manifest.cost.prices` la fecha de la tabla de precios. Las regeneraciones cuentan.
- La tabla está en `scripts/social/openai.mjs` (`PRICES`, verificada el 2026-11-10, en USD por 1M tokens):

  | Modelo | Precio |
  |---|---|
  | `gpt-image-2.6-sunburst` | texto 5 · imagen 8 · imagen en caché 2 · salida 30 |
  | `gpt-6.1-sol` | 2 · caché 0.10 · salida 10 |
  | `gpt-6.1-terra` | 1 · caché 0.05 · salida 5 |

- Si un modelo no está en la tabla, se guardan los tokens y el costo queda `null`. Hay que actualizar la tabla si cambian los precios.

## 7. Límites de gasto en OpenAI (lo configuras tú)

Recomendación: un **proyecto dedicado** (p. ej. «verk-social») con su propia API key, para que el límite y el consumo de este publicador estén aislados.

1. **Límite del proyecto:**
   1. platform.openai.com → selecciona el proyecto → **Project settings → Limits**.
   2. Pulsa **Edit spend limit** y define el límite mensual.
2. **Límite de la organización** (red de seguridad):
   1. **Organization settings → Limits**.
   2. En **Spend**, pulsa **Edit spend limit**.
   3. Fija el **Monthly spend limit** y activa **Enforce a hard limit**. Sin el límite estricto, solo hay avisos.
3. **Al llegar al límite:** la API responde **HTTP 429** con `project_spend_limit_exceeded` u `organization_spend_limit_exceeded`. El publicador no reintenta, marca la pieza `failed` y no publica. Las siguientes ejecuciones fallan igual hasta el mes siguiente o hasta que subas el límite.
4. **Referencia:** la estimación previa es de ~65–90 USD al mes con 3 piezas diarias. La cifra real sale de `manifest.cost` en la etapa E4.

La documentación de OpenAI no describe límites por API key ni restricción de modelos por proyecto, así que no se usan.

## 8. Modelos

| Variable | Valor | Verificación |
|---|---|---|
| `IMAGE_MODEL` | `gpt-image-2.6-sunburst` | Ficha oficial: `/v1/images/generations` y `/v1/images/edits`, tamaños libres múltiplos de 16 |
| `TEXT_MODEL` | `gpt-6.1-sol` | Ficha oficial: Responses, entrada de texto e imagen, salidas estructuradas |
| `VISION_MODEL` | `gpt-6.1-terra` | Ficha oficial: Responses, entrada de imagen, salidas estructuradas |

- Los tres identificadores salen de las fichas oficiales (2026-11-10).
- Como no hay `OPENAI_API_KEY` local, no se pudo consultar `/v1/models` con tu cuenta. Por eso **cada ejecución hace primero `GET /v1/models/{id}`** (gratis) para los tres. Si alguno no existe para la clave, la ejecución aborta antes de cualquier llamada de pago.

## 9. Configuración pendiente (tú)

1. **Google Cloud:**
   1. Crea un proyecto y activa la Drive API.
   2. Configura la pantalla de consentimiento como «External» y pásala a **In production**. En «Testing», el token caduca a los 7 días.
   3. Crea un cliente OAuth de tipo **Desktop app**.
2. **Refresh token:** pon `GOOGLE_OAUTH_CLIENT_ID` y `GOOGLE_OAUTH_CLIENT_SECRET` en `.env` y ejecuta `node --env-file=.env scripts/social/auth-google.mjs`. El script guarda el token en `.env` sin imprimirlo.
3. **OpenAI:** crea el proyecto y la API key, y configura los límites del §7.
4. **GitHub (Settings → Secrets and variables → Actions):**
   - **Secrets:** `OPENAI_API_KEY`, `INSTAGRAM_ACCESS_TOKEN`, `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_OAUTH_REFRESH_TOKEN`.
   - **Variables:**
     - `SOCIAL_ENABLED=false`
     - `INSTAGRAM_USER_ID=17841420522725752`
     - `META_GRAPH_API_VERSION=v26.0`
     - `IMAGE_MODEL`, `TEXT_MODEL`, `VISION_MODEL`
     - `DRIVE_ROOT_FOLDER_ID` (opcional)
5. **Versionar en git:** `docs/creative-prompts/` (el pipeline lo lee en CI), `scripts/social/`, `.github/workflows/social.yml`, este documento y `.env.example`. El workflow solo aparece en GitHub después del push.

## 10. Etapas siguientes (cada una requiere autorización)

| Etapa | Contenido |
|---|---|
| **E2** | Prueba de Drive con tu OAuth: carpeta, subida, compartir, descarga sin autenticación y retirar el permiso. Gratis. |
| **E3** | Un contenedor real con la URL de Drive hasta `FINISHED`, **sin `media_publish`** (`publishSingle({ dryRun: true })`). Confirma si Meta acepta `application/octet-stream`. |
| **E4** | `--dry-run` real: una pieza individual y un carrusel. Mide costo, tasa de validación y calidad. |
| **E5** | Primera publicación lanzada a mano. |
| **E6** | Descomentar el cron y poner `SOCIAL_ENABLED=true`. |
