/**
 * Design tokens de Ropa Publicitaria Chile (Comercial Franca Pisani Ltda.).
 *
 * Fuente: paleta extraída del logo oficial del cliente
 * (rombo coral #f07848 + banda celeste #18c0f0 + wordmark negro sobre blanco)
 * y dirección de arte de la nueva plataforma corporativa.
 *
 * Tono: fábrica con 40+ años de oficio, energía comercial. Blanco dominante,
 * tinta casi-negra para texto, coral como acción primaria, celeste como
 * apoyo informativo. Ajustable cuando el cliente entregue brandbook (si existe).
 */
export const rpcTokens = {
  colors: {
    body: { bg: "#ffffff", text: "#101418" },
    /** Coral del rombo del logo — acción primaria (CTAs, precios destacados). */
    accent: "#f07848",
    accentDark: "#d9602f",
    /** Celeste de la banda CHILE — informativo (badges, links, stock). */
    info: "#18c0f0",
    infoDark: "#0e9fc9",
    button: { bg: "#101418", text: "#ffffff" },
    border: "#e6e8ea",
    surface: "#f6f7f8",
    price: "#101418",
    savings: "#0e9fc9",
    error: "#e03131",
    header: { bg: "#ffffff", text: "#101418" },
    announcement: { bg: "#101418", text: "#ffffff" },
    footer: { bg: "#101418", text: "#ffffff" },
    drawer: {
      bg: "#ffffff",
      text: "#101418",
      border: "#e6e8ea",
      button: "#f07848",
      buttonText: "#ffffff",
    },
    imageBg: "#f3f4f5",
  },
  typography: {
    /** Headings con peso (oficio + energía), sin uppercase-light de lujo. */
    heading: {
      family: "Archivo",
      weight: 700,
      baseSizePx: 24,
      lineHeight: 1.05,
      letterSpacingEm: -0.015,
      uppercase: false,
    },
    body: {
      family: "Inter",
      weight: 400,
      baseSizePx: 16,
      lineHeight: 1.6,
      letterSpacingEm: 0,
    },
    navigation: { sizePx: 13, uppercase: false },
    collection: { sizePx: 24 },
  },
  radii: {
    button: "10px",
    card: "14px",
    input: "10px",
  },
  spacing: {
    gridGutterPx: 18,
    drawerGutterPx: 20,
  },
  icon: {
    weightPx: 2,
    linecap: "round" as const,
  },
  social: {
    instagram: "https://www.instagram.com/ropapublicitariachile/",
    facebook: "https://www.facebook.com/profile.php?id=61568446574068",
  },
} as const;

export type RpcTokens = typeof rpcTokens;
