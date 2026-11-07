# 25c · Pruebas en dispositivos físicos — rediseño móvil

> **Para quién:** quien tenga un iPhone con Safari y un Android con Chrome.
>
> **Qué se prueba:** la versión local sin commit (rediseño móvil, doc 25). Nada se publica ni se despliega.
>
> **Estado de la verificación hasta hoy:** Chrome 156 con emulación, WebKit 17.4 y Firefox 157/121 con Playwright. **No se ha probado ningún dispositivo físico.**

## 1. Acceso a la versión local desde el teléfono (misma red Wi-Fi, sin publicar)

1. **En el Mac**, desde la carpeta del repo:

   ```bash
   npm run build
   npx astro preview --host 0.0.0.0 --port 4322
   ```

   - `--host 0.0.0.0` expone el servidor **solo a la red local**. No sale a internet.
   - Detenlo con `Ctrl+C` al terminar.
2. **IP del Mac** (el 2026-11-07 era `192.168.68.66`; puede cambiar):

   ```bash
   ipconfig getifaddr en0
   ```

3. **En el teléfono**, conectado a la misma Wi-Fi, abre `http://<IP-del-Mac>:4322/`. Por ejemplo, `http://192.168.68.66:4322/`.
   - El cortafuegos de macOS estaba desactivado. Si lo activas, acepta la conexión entrante de `node` cuando lo pida.
   - Es `http`, no `https`: correcto para estas pruebas. Ninguna función del sitio requiere contexto seguro.
4. **Inspección remota (opcional, para ver la consola):**
   - **iPhone:**
     - En el teléfono: Ajustes → Apps → Safari → Avanzado → Inspector web: activado.
     - Conecta el iPhone por cable al Mac y abre Safari → Desarrollo → [iPhone].
     - En macOS 12 con Safari 15.6, el inspector puede no ser compatible con un iOS reciente. Si no aparece, basta con capturas y grabación de pantalla.
   - **Android:**
     - En el teléfono: Opciones de desarrollador → Depuración USB.
     - En Chrome del Mac, abre `chrome://inspect/#devices` y elige la pestaña.

## 2. Pruebas

Repite cada prueba en vertical y, donde se indique, en horizontal. Marca ✓ o ✗ y anota el modelo, el sistema y la versión del navegador.

| # | Área | Qué hacer | Qué debe pasar |
|---|---|---|---|
| 1 | **Safe areas** | Carga la home en un iPhone con isla o notch (y en Android con barra de gestos). Mira el header, el menú abierto y el final del Footer. | La píldora del header no queda bajo la isla, el notch ni la barra de estado. Los enlaces del menú y «Solicitar auditoría» no quedan bajo el indicador de inicio. El Footer termina sin cortes. |
| 2 | **Hero** | Primera pantalla en vertical | Titular, isotipo, subtítulo, «Ver cómo funciona», «Ver sistemas» y «Pausar» visibles sin scroll. Los dos CTA en una fila. |
| 3 | **Menú** | Toca «Menú» → toca «Sistemas». Repite y cierra con «Cerrar». | Índice 03–06 abajo, apartado actual en lima. Al tocar un apartado viaja a la sección y el menú se cierra. «Cerrar» vuelve a la página en el mismo punto. |
| 4 | **Scroll y header** | Baja despacio por toda la página y sube un poco en cada sección | El header se oculta al bajar y aparece al subir. Cambia de color con cada superficie. El número 01–06 sigue la sección. Sin saltos ni parpadeos. En Servicios, la barra «0X / 04» sube cuando se oculta el header. |
| 5 | **Método** | Recorre la sección | Una línea vertical que se dibuja con el scroll, con la chispa lima. Al final se ensambla el isotipo. |
| 6 | **Panel de Sistemas** | Toca un proyecto | El panel cabe en la pantalla sin scroll interno. Pestañas Vista / Arquitectura / Sitio. «Abrir sitio» abre una pestaña nueva. «Cerrar» vuelve a la fila del proyecto. |
| 7 | **Deslizar entre proyectos** | Dentro del panel, desliza a la izquierda y a la derecha sobre la imagen; luego usa ← y → | Desliza en ambos sentidos y el contador cambia (03 / 10 → 04 / 10). Un desplazamiento vertical no cambia de proyecto. Los botones ← y → hacen lo mismo. |
| 8 | **Contacto** | Toca «Solicitar auditoría» | El botón ocupa todo el ancho. Abre WhatsApp con «Hola, quiero solicitar una auditoría para mi negocio.» |
| 9 | **Footer** | Llega al final y toca los enlaces | Las partículas rodean «Seguimos construyendo.». Los enlaces se leen limpios y son fáciles de tocar (44 px). |
| 10 | **Horizontal** | Gira el teléfono en el hero, en Sistemas y con el panel abierto | Sin scroll horizontal. En el hero, el isotipo no pisa el titular (el hero puede requerir scroll; es esperado). El panel sigue usable. |
| 11 | **Teclado virtual** | — | No aplica: la home no tiene campos de texto. Solo confirma que ningún toque abre el teclado. |
| 12 | **Movimiento reducido** | iPhone: Ajustes → Accesibilidad → Movimiento → Reducir movimiento. Android: Ajustes → Accesibilidad → Quitar animaciones. Recarga. | Sin animaciones de entrada. Todo el contenido visible desde el inicio. Ruta de Método completa. El campo del hero queda quieto. Contacto en su estado final. |
| 13 | **Rendimiento percibido** | Scroll rápido por toda la página | Sin tirones evidentes en el hero, Sistemas (isolíneas) y el Footer. El teléfono no se calienta en 1–2 minutos de uso normal. |

## 3. Cómo registrar un defecto

Una entrada por defecto:

```
ID:            D-01
Dispositivo:   iPhone 15 · iOS 26.1 · Safari  (o Pixel 8 · Android 16 · Chrome 156)
Orientación:   vertical / horizontal
Prueba:        #7 Deslizar entre proyectos
Pasos:         1) … 2) … 3) …
Esperado:      …
Observado:     …
Frecuencia:    siempre / a veces (n de m intentos)
Ajustes:       Reducir movimiento sí/no · modo oscuro sí/no · zoom de texto
Evidencia:     captura(s) y/o vídeo (nombre del archivo)
```

## 4. Capturas que necesitamos

Por dispositivo, en vertical salvo indicación:
1. Hero, primera pantalla completa (con la isla o notch visible).
2. Menú abierto, mostrando la parte inferior (indicador de inicio).
3. Header sobre Tensión (ink), sobre Servicios (violeta) y sobre Contacto (lima).
4. Método con la ruta a mitad de recorrido.
5. Índice de Sistemas (filas 01–05) y panel abierto.
6. **Vídeo corto (5–10 s)** del gesto de deslizar entre proyectos.
7. Contacto con el CTA y Footer completo.
8. Hero y panel en horizontal.
9. Con «Reducir movimiento» activo: hero y Método.

Nombre de archivo: `<dispositivo>-<prueba>-<orientación>.png`, por ejemplo `iphone15-03-menu-vertical.png`.
