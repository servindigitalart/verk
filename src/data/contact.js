// VERK · contacto (dato confirmado por el usuario el 2026-11-05). El número no se muestra en la interfaz.
const WHATSAPP_NUMBER = '524793201003';                       // +52 479 320 1003
const WHATSAPP_MESSAGE = 'Hola, quiero solicitar una auditoría para mi negocio.';
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

// Perfiles sociales: todavía sin definir (2026-11-05). Con null, el footer muestra el icono sin enlace (no hay enlaces
// falsos); al poner la URL pública real, el icono se convierte en enlace automáticamente.
export const SOCIAL = {
  instagram: null,   // p. ej. 'https://www.instagram.com/<perfil>/'
  linkedin: null,    // p. ej. 'https://www.linkedin.com/company/<perfil>/'
};
