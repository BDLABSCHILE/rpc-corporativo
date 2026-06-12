/**
 * Datos de contacto público — source of truth para todo el sitio.
 * Si cambia un número o email, se actualiza acá UNA vez.
 *
 * Fuente: sitio actual ropapublicitariachile.cl (scraping 2026-06-12).
 */

export const CONTACT = {
  email: "hola@ropapublicitariachile.cl",
  /** WhatsApp en formato E.164 (sin "+" porque wa.me lo necesita así). */
  whatsappE164: "56994697724",
  /** Display amigable para mostrar al usuario. */
  whatsappDisplay: "+56 9 9469 7724",
  direccion: "Pasaje Inducentro 275, Oficina 401, Recoleta, Santiago",
  razonSocial: "Comercial Franca Pisani Ltda.",
} as const;

export const CONTACT_LINKS = {
  mailto: `mailto:${CONTACT.email}`,
  whatsapp: `https://wa.me/${CONTACT.whatsappE164}`,
  /** Mensaje pre-rellenado para WhatsApp Web/App. */
  whatsappWithMessage: (message: string): string =>
    `https://wa.me/${CONTACT.whatsappE164}?text=${encodeURIComponent(message)}`,
} as const;
