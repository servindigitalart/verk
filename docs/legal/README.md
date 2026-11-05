# Páginas legales — estructura pendiente de datos

No se publican rutas ni enlaces legales hasta tener la información real (los enlaces anteriores a `/privacidad` y
`/terminos` daban 404 y se retiraron del footer). Cuando lleguen los datos, cada documento se convierte en
`src/pages/<ruta>.astro` con el layout `Experience` y se añade su enlace al footer (`src/components/site/Footer.astro`).

| Documento | Ruta prevista | Obligatorio | Plantilla |
|---|---|---|---|
| Aviso de privacidad (LFPDPPP, México) | `/aviso-de-privacidad` | Sí, si el sitio recaba datos personales (hoy: el CTA abre WhatsApp; el sitio no tiene formularios ni analítica) | `aviso-de-privacidad.md` |
| Términos de uso | `/terminos` | Recomendado | `terminos.md` |

## Información que falta (la debe proporcionar Verk; no se inventa)
1. Nombre o razón social del responsable (persona física con actividad empresarial o persona moral).
2. Domicilio para oír y recibir notificaciones.
3. RFC (opcional en el aviso, necesario si se facturan servicios en línea).
4. Correo o medio de contacto para solicitudes ARCO (acceso, rectificación, cancelación, oposición) y revocación del consentimiento.
5. Qué datos personales se recaban y por qué medio (WhatsApp, correo, formularios futuros, analítica, cookies).
6. Finalidades primarias y secundarias del tratamiento.
7. Transferencias a terceros (por ejemplo, proveedores de mensajería, hosting, CRM) y si requieren consentimiento.
8. Uso de cookies o tecnologías de rastreo (hoy el sitio no usa ninguna).
9. Condiciones comerciales a reflejar en los términos (si las hay: alcance de servicios, propiedad intelectual, jurisdicción).
10. Revisión por un abogado antes de publicar.
