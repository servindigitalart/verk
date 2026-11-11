# 26 · Publicador de Instagram

> Estado al 2026-11-11: **operación automática diaria autorizada.** El cron de `social.yml` está activo y `SOCIAL_ENABLED=true` (interruptor general). Cada ejecución programada genera, valida, guarda en Drive y publica a la hora exacta, sin aprobación humana. Si una pieza no pasa la validación, no se publica: el error queda en su manifest y los demás horarios siguen. El workflow `social-publish-ready` se conserva para publicar a mano una pieza `ready`.

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
8. **Validación, por imagen y en este orden:**
   - técnica: JPEG, 1080×1350, ≤ 8 MB;
   - **superficie:** el color dominante debe ser la `SUPERFICIE` declarada (`04` §3, `06` §8). No aplica a T8 (fotografía);
   - **texto:** `VISION_MODEL` transcribe a ciegas y se compara con el copy aprobado (§4);
   - **identidad visual:** `VISION_MODEL` evalúa la imagen con `06` §8 y, en carrusel, `04` §3, copiadas literalmente de la biblioteca, frente a la superficie, el territorio y el `LOGO · USO` declarados. Cualquier criterio incumplido rechaza la imagen.
9. Si falla, se regenera esa imagen (hasta 2 veces). Si sigue fallando, la pieza queda `failed` y no se publica. Cada rechazo queda en `manifest.validation.rejections` con su motivo.
   - En carrusel, antes de pagar imágenes, se rechaza el maestro si dos slides contiguos comparten superficie (`06` §1).
   - `01`, `02` y `03` se ejecutan **una sola vez** por pieza: una respuesta fuera de formato detiene la ejecución.
10. **Drive:** se guardan `original/` (salida de OpenAI), `final/` (con logo), `manifest.json` y, en carrusel, `hoja-de-contacto.jpg` (`04` §5).
11. Espera a la hora exacta del horario.
12. **Publicación:**
    - comparte `final/*.jpg` («cualquiera con el enlace»);
    - descarga sin autenticación `drive.usercontent.google.com/download?id=…` y exige bytes JPEG reales;
    - crea los contenedores y espera `FINISHED` en todos;
    - llama a `media_publish`;
    - **verifica la publicación:** `GET /{media-id}` debe ser `IMAGE`, o `CAROUSEL_ALBUM` con 5 hijos. El permalink queda en el manifest. Si la verificación falla, no se republica: el workflow termina en rojo para revisión;
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
| `scripts/social/drive-check.mjs` | Prueba de conexión con Drive (E2), sin OpenAI ni Instagram |
| `.github/workflows/social-drive-check.yml` | Manual: prueba de Drive con los tres secretos de Google |
| `.github/workflows/social-publish-ready.yml` | Manual: publica una pieza ya `ready`, con confirmación escrita; nunca genera |
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
  - **cuenta:** cada ejecución comprueba primero (gratis) que el token de Instagram apunta a `INSTAGRAM_USERNAME` (@verk.digital), y después que los tres modelos existen. Si algo no cuadra, no se gasta nada;
  - **publicación revisada:** `--publish-ready` (workflow `social-publish-ready`) publica solo una pieza `ready` de la fecha y el horario indicados, con `SOCIAL_ENABLED=false`, y exige escribir «PUBLICAR AAAA-MM-DD HHMM». Nunca genera y no recibe la clave de OpenAI;
  - sin `--dry-run` ni `--publish-ready`, nada ocurre salvo que `SOCIAL_ENABLED=true`;
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
   3. Usa el cliente OAuth de tipo **Web application** del proyecto `verk-social`. En **Authorized redirect URIs** registra exactamente `http://localhost:8765/oauth2callback` (sin barra final; un cambio puede tardar unos minutos en aplicarse).
   4. En **Data Access**, añade solo el permiso `.../auth/drive.file`.
2. **Refresh token:**
   1. Pon `GOOGLE_OAUTH_CLIENT_ID` y `GOOGLE_OAUTH_CLIENT_SECRET` del cliente Web en `.env`.
   2. Ejecuta `node --env-file=.env scripts/social/auth-google.mjs`. El script abre el navegador (macOS), usa PKCE (S256) y `state`, y espera la autorización 5 minutos.
   3. Solo si Google concede exactamente `drive.file`, guarda el token en `.env` (permisos 0600) sin imprimirlo. Si algo falla, `.env` no se modifica.
   4. Otra URI: variable `GOOGLE_OAUTH_REDIRECT_URI` (debe ser `http://localhost` o `http://127.0.0.1` con puerto, y estar registrada en el cliente).
   5. Comprueba la conexión con `node --env-file=.env scripts/social/drive-check.mjs`, o en GitHub con el workflow manual `social-drive-check`, que solo recibe los tres secretos de Google.
3. **OpenAI:** crea el proyecto y la API key, y configura los límites del §7.
4. **GitHub (Settings → Secrets and variables → Actions):**
   - **Secrets:** `OPENAI_API_KEY`, `INSTAGRAM_ACCESS_TOKEN`, `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_OAUTH_REFRESH_TOKEN`.
   - **Variables:**
     - `SOCIAL_ENABLED=false`
     - `INSTAGRAM_USER_ID=17841420522725752`
     - `INSTAGRAM_USERNAME=verk.digital`
     - `META_GRAPH_API_VERSION=v26.0`
     - `IMAGE_MODEL`, `TEXT_MODEL`, `VISION_MODEL`
     - `DRIVE_ROOT_FOLDER_ID` (opcional)
5. **Versionar en git:** `docs/creative-prompts/` (el pipeline lo lee en CI), `scripts/social/`, `.github/workflows/social.yml`, este documento y `.env.example`. El workflow solo aparece en GitHub después del push.

## 10. Etapas siguientes (cada una requiere autorización)

| Etapa | Contenido |
|---|---|
| **E2** ✅ | Drive con tu OAuth: carpeta, subida, MIME/tamaño/MD5, descarga idéntica, acceso anónimo privado → público (JPEG real, `image/jpeg`) → retirado. Verificado en local y en GitHub Actions (2026-11-11). |
| **E3** (sustituida) | Primer carrusel real: `social` con `dry_run` (una ejecución editorial, hasta 2 regeneraciones por slide) → revisión humana de las 5 imágenes, la hoja de contacto, el copy, el caption y el costo → `social-publish-ready` con confirmación. Requiere `OPENAI_API_KEY` e `INSTAGRAM_ACCESS_TOKEN` en GitHub. |
| **E4** ✅ | Operación automática: cron activo y `SOCIAL_ENABLED=true`, sin revisión humana (autorizado el 2026-11-11). La primera pieza es el carrusel de las 19:00 del 2026-11-11. |

## 11. Operación

**Horarios** (León, UTC−6 todo el año): 08:00 y 13:00, imagen individual (`01`); 19:00, carrusel de 5 slides (`02` → `03`).
El cron, todavía comentado, arranca 90 min antes (12:30, 17:30 y 23:30 UTC), y la publicación espera a la hora exacta.

**Pieza revisada por una persona** (primer carrusel y cualquier pieza que quieras aprobar a mano):
1. Actions → `social` → slot `1900`, `dry_run` activado. Genera, valida y deja la pieza `ready` en `VERK Social/AAAA/MM/AAAA-MM-DD/1900-carrusel/`.
2. Revisa en Drive `final/`, `hoja-de-contacto.jpg` y `manifest.json` (`copy`, `caption`, `cost`, `validation`).
3. Actions → `social-publish-ready` → la misma fecha y horario, y en `confirm`: `PUBLICAR 2026-11-12 1900`.
4. El manifest queda `published`, con `mediaId`, `containerIds`, `permalink` y `verification`.

**Operación diaria (activa desde 2026-11-11):** cron en `social.yml` (`30 12`, `30 17` y `30 23` UTC) y variable `SOCIAL_ENABLED=true`.
- **Apagar todo al instante:** `gh variable set SOCIAL_ENABLED --body false`. Las ejecuciones programadas terminan sin hacer nada.
- **Comprobar credenciales gratis:** Actions → `social` → `check_only`. Valida la cuenta @verk.digital, los modelos de OpenAI y Drive; no genera ni publica.
- **Sin retroactivos:** GitHub no ejecuta horarios que ya pasaron. Un horario ya `published` nunca se repite.
- **Retrasos:** si GitHub arranca tarde y la hora ya pasó, se publica en cuanto la pieza está validada.
- **Riesgo:** GitHub desactiva los cron de repositorios públicos tras 60 días sin actividad en el repositorio (avisa por correo). Un commit o reactivarlo en Actions los restablece.

## 12. Recuperación de errores

| Estado del manifest / síntoma | Qué pasó | Qué hacer |
|---|---|---|
| `failed`, `step: generate` | Una respuesta de la biblioteca fuera de formato, un `LOGO · USO` no interpretable, un slide sin versión válida tras 3 intentos, o un error de OpenAI | Revisa `errors[]` y `validation.rejections` en el manifest. Una nueva ejecución del mismo horario genera desde cero (nuevo costo) |
| `ready` con un error en `errors[]` (`step: publish`) | Meta rechazó la URL o un contenedor quedó en `ERROR`/`EXPIRED`; no se publicó nada; los permisos se retiraron | Corrige la causa y lanza `social-publish-ready`: solo publica, sin regenerar |
| `publishing` | La respuesta de `media_publish` fue incierta y la conciliación no encontró la publicación | No reintentes a mano. La siguiente ejecución del horario (o `social-publish-ready`) vuelve a conciliar. Si la encuentra, queda `published`; si no, `failed`, sin publicar de nuevo. Comprueba el perfil antes de volver a generar |
| `published`, `verification.ok = false` | Publicado, pero la consulta posterior no coincidió (tipo o número de hijos) o falló | Revisa el permalink en el perfil. Nunca se republica automáticamente |
| Workflow en rojo con «la cuenta de Instagram es @…» | El token apunta a otra cuenta | Corrige `INSTAGRAM_ACCESS_TOKEN` o `INSTAGRAM_USERNAME` |
| `organization_spend_limit_exceeded` / `project_spend_limit_exceeded` | Límite de gasto alcanzado (§7) | Sube el límite o espera al mes siguiente; no se reintenta |
| «no se pudo retirar el permiso público» en el log | Falló la retirada del enlace público | Retíralo a mano en Drive (Compartir → Restringido) |

## 13. Costo por pieza (estimación previa a la medición real)

OpenAI no publica los tokens por imagen; la cifra real sale de `manifest.cost` (§6).

| Pieza | Texto | Imágenes | Visión (texto + identidad) | Total típico | Peor caso (2 regeneraciones por imagen) |
|---|---|---|---|---|---|
| Carrusel (5 slides) | ~0.10–0.20 USD | 5 × ~0.20–0.25 USD | ~0.10–0.30 USD | **~1.2–1.8 USD** | ~4–5 USD |
| Imagen individual | ~0.03–0.06 USD | ~0.20–0.25 USD | ~0.02–0.06 USD | **~0.25–0.40 USD** | ~0.8–1 USD |

Con la operación diaria (2 individuales y 1 carrusel), la estimación es de ~55–80 USD al mes, sin contar las regeneraciones.
