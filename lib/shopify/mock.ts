import type { CorporateProduct, PrintArea, PrintTechnique, ShopifyImage } from "./types";

/**
 * Mock data del catálogo de Ropa Publicitaria Chile.
 *
 * Activado con USE_MOCK_PRODUCTS=true.
 *
 * - Poleras y Polerones y Polar: los 11 productos REALES que la clienta
 *   entregó en el formulario de levantamiento de catálogo (2026-06-17).
 *   Colores, tallas, materialidades, mínimos, plazos y técnicas aplicables
 *   son los que ella declaró. Los `volumePricing` se derivan de los RANGOS
 *   de precio por unidad que entregó (tope a la cantidad mínima, piso sobre
 *   100u, con baja marcada sobre 50u "baja harto el precio").
 * - Camisas, Pantalones y Ropa Técnica, Jockeys y Gorros, Merchandising:
 *   productos DEMO de referencia para mostrar el alcance completo del rubro
 *   hasta que la clienta levante esas categorías. El banner del header avisa
 *   que precios y productos son de referencia.
 *
 * FOTOS: estudio generadas (ghost-mannequin, fondo gris claro, prenda en
 * blanco sin logo) en `public/products/<handle>.webp`. Cada producto muestra
 * una sola foto base (el "color hero" = primer color de la lista); las fotos
 * por color individual quedan pendientes de la marca.
 *
 * Schema idéntico a CorporateProduct para que el switch a datos reales
 * (Shopify o catálogo propio) sea solo en storefront.ts.
 */

// --- Técnicas de personalización ---------------------------------------------
// Las del rubro textil publicitario. Precios base alineados a lo que la clienta
// declaró (Serigrafía $1.000, Bordado $3.000, DTF $3.000 por prenda). Los
// extras por zona/setup son DE REFERENCIA y se confirman al cotizar.

const BORDADO: PrintTechnique = {
  id: "bordado",
  label: "Bordado",
  description:
    "El acabado más durable y premium para vestuario corporativo. Ideal para logos al pecho, gorros y poleras piqué.",
  basePriceUnit: 3000,
  extraPositionPrice: 1490,
  setupFee: 0,
  extraLeadDays: 7,
  availableAreaIds: ["pecho_izq", "pecho_centro", "manga", "gorro_frente", "gorro_lateral"],
};

const SERIGRAFIA_1C: PrintTechnique = {
  id: "serigrafia_1c",
  label: "Serigrafía 1 color",
  description:
    "Económica y resistente para tirajes grandes. Ideal para logos de 1 a 2 colores planos.",
  basePriceUnit: 1000,
  extraPositionPrice: 590,
  setupFee: 0,
  extraLeadDays: 5,
  availableAreaIds: ["pecho_izq", "pecho_centro", "espalda", "manga", "bolsa_cara"],
};

const SERIGRAFIA_FULL: PrintTechnique = {
  id: "serigrafia_full",
  label: "Serigrafía full color",
  description:
    "Para artes con varios colores o degradados en tirajes grandes. Mayor fidelidad de color.",
  basePriceUnit: 1990,
  extraPositionPrice: 990,
  setupFee: 0,
  extraLeadDays: 8,
  availableAreaIds: ["pecho_centro", "espalda", "bolsa_cara"],
};

const TRANSFER_DTF: PrintTechnique = {
  id: "transfer_dtf",
  label: "Transfer DTF",
  description:
    "Full color con gran detalle en cualquier tela, sin costo de setup. Recomendado para tirajes pequeños y medianos.",
  basePriceUnit: 3000,
  extraPositionPrice: 790,
  setupFee: 0,
  extraLeadDays: 3,
  availableAreaIds: ["pecho_izq", "pecho_centro", "espalda", "manga", "bolsa_cara"],
};

const VINILO: PrintTechnique = {
  id: "vinilo",
  label: "Vinilo textil",
  description:
    "Corte de vinilo termoadhesivo aplicado por calor. Ideal para números, nombres y logos de 1 a 2 colores planos en prendas deportivas.",
  basePriceUnit: 990,
  extraPositionPrice: 690,
  setupFee: 0,
  extraLeadDays: 3,
  availableAreaIds: ["pecho_izq", "pecho_centro", "espalda", "manga"],
};

const SUBLIMACION: PrintTechnique = {
  id: "sublimacion",
  label: "Sublimación",
  description:
    "Impresión total integrada a la tela (poliéster claro) o al tazón. Colores vivos que no se despegan.",
  basePriceUnit: 1390,
  extraPositionPrice: 0,
  setupFee: 0,
  extraLeadDays: 4,
  availableAreaIds: ["pecho_centro", "espalda", "tazon_cara"],
};

// --- Imágenes -----------------------------------------------------------------

/** Foto de estudio servida localmente desde public/products/<handle>.webp. */
function localImage(handle: string, alt: string): ShopifyImage {
  return { url: `/products/${handle}.webp`, altText: alt, width: 1280, height: 1280 };
}

/**
 * Placeholder neutro. Hoy solo lo usan las zonas de impresión (PrintArea) como
 * imagen de referencia; el catálogo usa fotos reales vía localImage().
 */
function placeholderImage(label: string, width = 1200, height = 1200): ShopifyImage {
  const text = encodeURIComponent(label);
  return {
    url: `https://placehold.co/${width}x${height}/f3f4f5/101418/png?text=${text}`,
    altText: label,
    width,
    height,
  };
}

// --- Zonas de impresión -------------------------------------------------------
// Polígonos y escalas de referencia sobre imagen 1200×1200; se calibran con
// las fotos reales de cada producto.

const area = (
  id: string,
  label: string,
  poly: Array<[number, number]>,
  maxWcm: number,
  maxHcm: number,
  pxPerCm: number,
): PrintArea => ({
  id,
  label,
  imageUrl: placeholderImage(label).url,
  areaPolygon: poly,
  maxWidthCm: maxWcm,
  maxHeightCm: maxHcm,
  pxPerCm,
});

const PECHO_IZQ = area("pecho_izq", "Pecho izquierdo", [[640, 420], [840, 420], [840, 580], [640, 580]], 10, 10, 28);
const PECHO_CENTRO = area("pecho_centro", "Pecho centro", [[420, 430], [780, 430], [780, 720], [420, 720]], 28, 35, 24);
const ESPALDA = area("espalda", "Espalda", [[400, 380], [800, 380], [800, 760], [400, 760]], 30, 40, 24);
const MANGA = area("manga", "Manga", [[480, 470], [720, 470], [720, 610], [480, 610]], 8, 8, 30);
const GORRO_FRENTE = area("gorro_frente", "Frente del gorro", [[440, 420], [760, 420], [760, 640], [440, 640]], 12, 6, 30);
const GORRO_LATERAL = area("gorro_lateral", "Lateral del gorro", [[500, 460], [740, 460], [740, 600], [500, 600]], 7, 4, 32);
const BOLSA_CARA = area("bolsa_cara", "Cara de la bolsa", [[380, 400], [820, 400], [820, 800], [380, 800]], 26, 30, 24);
const TAZON_CARA = area("tazon_cara", "Cara del tazón", [[420, 440], [780, 440], [780, 720], [420, 720]], 18, 8, 30);

// --- Helpers ------------------------------------------------------------------

type VariantSpec = { color: string; sku: string };

function makeVariants(
  productKey: string,
  retailClp: number,
  specs: VariantSpec[],
  handle: string,
  stockTier: "high" | "low" = "high",
) {
  return specs.map(({ color, sku }) => ({
    id: `rpc_var_${productKey}_${sku.toLowerCase()}_${stockTier}`,
    title: color,
    sku,
    selectedOptions: [{ name: "Color", value: color }],
    priceRetail: { amount: retailClp, currencyCode: "CLP" as const },
    // Foto base del producto (color hero). Las fotos por color quedan pendientes.
    image: localImage(handle, color),
    availableForSale: true,
  }));
}

/**
 * Genera specs de variante (una por color) con SKU único y estable a partir
 * de la lista de colores REAL que entregó la clienta. El SKU es índice-based
 * para garantizar unicidad aunque dos colores compartan abreviatura. El primer
 * color de la lista es el "hero" (el que aparece en la foto del producto).
 */
function specsFromColors(prefix: string, colors: string[]): VariantSpec[] {
  return colors.map((color, i) => ({
    color,
    sku: `RPC-${prefix}-${String(i + 1).padStart(2, "0")}`,
  }));
}

/**
 * Deriva una tabla de descuentos por volumen a partir del RANGO de precio por
 * unidad que entregó la clienta. La clienta dio dos números (tope/piso) y la
 * regla "sobre 50 unidades baja harto el precio":
 *  - 10u (mínimo)  → tope del rango
 *  - 25u           → interpolado
 *  - 50u           → ya cerca del piso (la baja fuerte)
 *  - 100u          → piso del rango
 * Precios netos, redondeados a la decena. Son de referencia hasta cerrar la
 * cotización (el banner del sitio lo advierte).
 */
function rangePricing(high: number, low: number) {
  const r10 = (n: number) => Math.round(n / 10) * 10;
  return [
    { minQty: 10, unitPriceNet: high },
    { minQty: 25, unitPriceNet: r10(high * 0.6 + low * 0.4) },
    { minQty: 50, unitPriceNet: r10(high * 0.25 + low * 0.75) },
    { minQty: 100, unitPriceNet: low },
  ];
}

/**
 * Arma el HTML de la ficha extendida con los datos reales declarados por la
 * clienta. Mantiene el mínimo (10u) y la modalidad (stock express) fijos —
 * son comunes a todo el catálogo levantado.
 */
function fichaHtml(
  intro: string,
  spec: { material: string; tallas: string; plazo: string },
): string {
  return (
    `<p>${intro}</p>` +
    `<p><strong>Material:</strong> ${spec.material}<br/>` +
    `<strong>Tallas:</strong> ${spec.tallas}<br/>` +
    `<strong>Mínimo:</strong> 10 unidades · Stock express<br/>` +
    `<strong>Plazo de referencia:</strong> ${spec.plazo}</p>`
  );
}

const VENDOR = "Ropa Publicitaria Chile";

// --- Catálogo -----------------------------------------------------------------
// Categorías reales del sitio del cliente: Poleras · Polerones y Polar ·
// Camisas · Pantalones y Ropa Técnica · Jockeys y Gorros · Merchandising.

export const mockCorporateProducts: CorporateProduct[] = [
  // ===========================================================================
  // PRODUCTOS REALES — Poleras (7) y Polerones y Polar (4)
  // Levantamiento de catálogo de la clienta, 2026-06-17.
  // ===========================================================================

  // #1 — Polera piqué cuello y botones, manga corta
  {
    id: "rpc_polera_pique_mc",
    handle: "polera-pique-cuello-botones-manga-corta",
    title: "Polera Piqué Cuello y Botones M/C",
    vendor: VENDOR,
    category: "Poleras",
    description:
      "La clásica polo piqué de uniforme corporativo en manga corta. Cuello y puños tejidos, calce prolijo y el lienzo perfecto para tu logo bordado al pecho.",
    descriptionHtml: fichaHtml(
      "La clásica polo piqué de uniforme corporativo en manga corta. Cuello y puños tejidos, calce prolijo y el lienzo perfecto para tu logo bordado al pecho.",
      { material: "80% algodón · 20% poliéster (piqué)", tallas: "S a 3XL", plazo: "5 a 7 días" },
    ),
    featuredImage: localImage("polera-pique-cuello-botones-manga-corta", "Polera Piqué Cuello y Botones M/C"),
    images: [localImage("polera-pique-cuello-botones-manga-corta", "Polera Piqué Cuello y Botones M/C")],
    variants: makeVariants(
      "piqmc",
      12990,
      specsFromColors("PIQMC", [
        "Azul marino", "Negro", "Rojo", "Blanco", "Azulino", "Gris", "Amarillo", "Naranjo", "Verde",
      ]),
      "polera-pique-cuello-botones-manga-corta",
    ),
    minQty: 10,
    leadTimeDaysReorder: 7,
    baseCostUsd: 7,
    volumePricing: rangePricing(12990, 9990),
    printAreas: [PECHO_IZQ, PECHO_CENTRO, ESPALDA, MANGA],
    printTechniques: [BORDADO, SERIGRAFIA_1C, TRANSFER_DTF, VINILO],
    tags: ["CORPORATIVO", "poleras", "stock-express"],
  },

  // #2 — Polera piqué cuello y botones, manga larga
  {
    id: "rpc_polera_pique_ml",
    handle: "polera-pique-cuello-botones-manga-larga",
    title: "Polera Piqué Cuello y Botones M/L",
    vendor: VENDOR,
    category: "Poleras",
    description:
      "La misma polo piqué de uniforme, en versión manga larga para climas fríos o looks más formales. Cuello y puños tejidos, lista para llevar tu marca al pecho.",
    descriptionHtml: fichaHtml(
      "La misma polo piqué de uniforme, en versión manga larga para climas fríos o looks más formales. Cuello y puños tejidos, lista para llevar tu marca al pecho.",
      { material: "80% algodón · 20% poliéster (piqué)", tallas: "S a 3XL", plazo: "5 a 7 días" },
    ),
    featuredImage: localImage("polera-pique-cuello-botones-manga-larga", "Polera Piqué Cuello y Botones M/L"),
    images: [localImage("polera-pique-cuello-botones-manga-larga", "Polera Piqué Cuello y Botones M/L")],
    variants: makeVariants(
      "piqml",
      13990,
      specsFromColors("PIQML", [
        "Negro", "Gris", "Blanco", "Azul marino", "Azulino", "Rojo",
      ]),
      "polera-pique-cuello-botones-manga-larga",
    ),
    minQty: 10,
    leadTimeDaysReorder: 7,
    baseCostUsd: 8,
    volumePricing: rangePricing(13990, 10990),
    printAreas: [PECHO_IZQ, PECHO_CENTRO, ESPALDA, MANGA],
    printTechniques: [BORDADO, SERIGRAFIA_1C, TRANSFER_DTF, VINILO],
    tags: ["CORPORATIVO", "poleras", "stock-express"],
  },

  // #3 — Polera cuello redondo manga corta (100% algodón)
  {
    id: "rpc_polera_cuello_redondo_mc",
    handle: "polera-cuello-redondo-manga-corta",
    title: "Polera Cuello Redondo M/C",
    vendor: VENDOR,
    category: "Poleras",
    description:
      "Polera cuello redondo 100% algodón, la prenda más rendidora para eventos, activaciones y equipos. La que más colores ofrece del catálogo para calzar con cualquier marca.",
    descriptionHtml: fichaHtml(
      "Polera cuello redondo 100% algodón, la prenda más rendidora para eventos, activaciones y equipos. La que más colores ofrece del catálogo para calzar con cualquier marca.",
      { material: "100% algodón", tallas: "XS a 3XL", plazo: "3 a 4 días" },
    ),
    featuredImage: localImage("polera-cuello-redondo-manga-corta", "Polera Cuello Redondo M/C"),
    images: [localImage("polera-cuello-redondo-manga-corta", "Polera Cuello Redondo M/C")],
    variants: makeVariants(
      "crmc",
      12990,
      specsFromColors("CRMC", [
        "Blanco", "Negro", "Gris", "Azulino", "Azul marino", "Celeste", "Rojo", "Naranjo",
        "Rosado", "Fucsia", "Amarillo", "Verde militar", "Verde agua", "Verde manzana", "Café", "Beige",
      ]),
      "polera-cuello-redondo-manga-corta",
    ),
    minQty: 10,
    leadTimeDaysReorder: 4,
    baseCostUsd: 5,
    volumePricing: rangePricing(12990, 6990),
    printAreas: [PECHO_IZQ, PECHO_CENTRO, ESPALDA, MANGA],
    printTechniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF, VINILO],
    tags: ["CORPORATIVO", "poleras", "stock-express"],
  },

  // #4 — Polera cuello redondo (100% algodón)
  {
    id: "rpc_polera_cuello_redondo",
    handle: "polera-cuello-redondo",
    title: "Polera Cuello Redondo",
    vendor: VENDOR,
    category: "Poleras",
    description:
      "Polera cuello redondo 100% algodón en su versión esencial: pocos colores, máxima versatilidad. Ideal para uniformar equipos grandes sin complicarte.",
    descriptionHtml: fichaHtml(
      "Polera cuello redondo 100% algodón en su versión esencial: pocos colores, máxima versatilidad. Ideal para uniformar equipos grandes sin complicarte.",
      { material: "100% algodón", tallas: "XS a 3XL", plazo: "3 a 5 días" },
    ),
    featuredImage: localImage("polera-cuello-redondo", "Polera Cuello Redondo"),
    images: [localImage("polera-cuello-redondo", "Polera Cuello Redondo")],
    variants: makeVariants(
      "cr",
      13500,
      specsFromColors("CR", [
        "Azul marino", "Negro", "Blanco", "Azulino", "Gris", "Rojo",
      ]),
      "polera-cuello-redondo",
    ),
    minQty: 10,
    leadTimeDaysReorder: 5,
    baseCostUsd: 6,
    volumePricing: rangePricing(13500, 8500),
    printAreas: [PECHO_IZQ, PECHO_CENTRO, ESPALDA, MANGA],
    printTechniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF, VINILO],
    tags: ["CORPORATIVO", "poleras", "stock-express"],
  },

  // #5 — Polera dry fit cuello redondo manga corta (100% poliéster)
  {
    id: "rpc_polera_dryfit_cuello_redondo",
    handle: "polera-dry-fit-cuello-redondo",
    title: "Polera Dry-Fit Cuello Redondo",
    vendor: VENDOR,
    category: "Poleras",
    description:
      "Polera deportiva dry fit de secado rápido, pensada para corridas, clubes y team building. Poliéster respirable que mantiene al equipo cómodo todo el día.",
    descriptionHtml: fichaHtml(
      "Polera deportiva dry fit de secado rápido, pensada para corridas, clubes y team building. Poliéster respirable que mantiene al equipo cómodo todo el día.",
      { material: "100% poliéster (dry fit)", tallas: "Talla 8 a 3XL", plazo: "5 a 7 días hábiles" },
    ),
    featuredImage: localImage("polera-dry-fit-cuello-redondo", "Polera Dry-Fit Cuello Redondo"),
    images: [localImage("polera-dry-fit-cuello-redondo", "Polera Dry-Fit Cuello Redondo")],
    variants: makeVariants(
      "dryf",
      15990,
      specsFromColors("DRYF", [
        "Naranjo", "Negro", "Rojo", "Azul marino", "Azulino", "Blanco", "Gris", "Rosado", "Calypso",
      ]),
      "polera-dry-fit-cuello-redondo",
    ),
    minQty: 10,
    leadTimeDaysReorder: 7,
    baseCostUsd: 6,
    volumePricing: rangePricing(15990, 8990),
    printAreas: [PECHO_IZQ, PECHO_CENTRO, ESPALDA, MANGA],
    printTechniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF],
    tags: ["CORPORATIVO", "poleras", "stock-express"],
  },

  // #6 — Polera dry fit con cuello y botones (100% poliéster)
  {
    id: "rpc_polera_dryfit_cuello_botones",
    handle: "polera-dry-fit-cuello-botones",
    title: "Polera Dry-Fit Cuello y Botones",
    vendor: VENDOR,
    category: "Poleras",
    description:
      "Polo deportiva dry fit con cuello y botones: el punto medio entre lo técnico y lo formal. Secado rápido para terreno, eventos y staff en movimiento.",
    descriptionHtml: fichaHtml(
      "Polo deportiva dry fit con cuello y botones: el punto medio entre lo técnico y lo formal. Secado rápido para terreno, eventos y staff en movimiento.",
      { material: "100% poliéster (dry fit)", tallas: "S a 2XL", plazo: "A confirmar al cotizar" },
    ),
    featuredImage: localImage("polera-dry-fit-cuello-botones", "Polera Dry-Fit Cuello y Botones"),
    images: [localImage("polera-dry-fit-cuello-botones", "Polera Dry-Fit Cuello y Botones")],
    variants: makeVariants(
      "dryfb",
      16990,
      specsFromColors("DRYFB", [
        "Rojo", "Negro", "Gris", "Blanco", "Naranjo", "Calypso", "Azul marino", "Azulino",
      ]),
      "polera-dry-fit-cuello-botones",
    ),
    minQty: 10,
    leadTimeDaysReorder: 7,
    baseCostUsd: 6,
    volumePricing: rangePricing(16990, 8500),
    printAreas: [PECHO_IZQ, PECHO_CENTRO, ESPALDA, MANGA],
    printTechniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF],
    tags: ["CORPORATIVO", "poleras", "stock-express"],
  },

  // #7 — Polera oversize
  {
    id: "rpc_polera_oversize",
    handle: "polera-oversize",
    title: "Polera Oversize",
    vendor: VENDOR,
    category: "Poleras",
    description:
      "Polera de corte oversize, el calce urbano que piden los equipos jóvenes y las marcas con onda. Caída holgada y amplia superficie para estampados grandes.",
    descriptionHtml: fichaHtml(
      "Polera de corte oversize, el calce urbano que piden los equipos jóvenes y las marcas con onda. Caída holgada y amplia superficie para estampados grandes.",
      { material: "A confirmar al cotizar", tallas: "XS a 2XL", plazo: "5 a 7 días" },
    ),
    featuredImage: localImage("polera-oversize", "Polera Oversize"),
    images: [localImage("polera-oversize", "Polera Oversize")],
    variants: makeVariants(
      "over",
      17500,
      specsFromColors("OVER", ["Beige", "Negro", "Blanco", "Gris"]),
      "polera-oversize",
    ),
    minQty: 10,
    leadTimeDaysReorder: 7,
    baseCostUsd: 8,
    volumePricing: rangePricing(17500, 11500),
    printAreas: [PECHO_IZQ, PECHO_CENTRO, ESPALDA, MANGA],
    printTechniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF, VINILO],
    tags: ["CORPORATIVO", "poleras", "stock-express"],
  },

  // #8 — Polar manga larga
  {
    id: "rpc_polar_manga_larga",
    handle: "polar-manga-larga",
    title: "Polar Manga Larga",
    vendor: VENDOR,
    category: "Polerones y Polar",
    description:
      "Polar de micropolar antipilling 300 g con manga larga, pretina ajustable y puños elasticados. Abrigo liviano y prolijo para faena, oficina y terreno.",
    descriptionHtml: fichaHtml(
      "Polar de micropolar antipilling 300 g con manga larga, pretina ajustable y puños elasticados. Abrigo liviano y prolijo para faena, oficina y terreno.",
      {
        material: "100% poliéster · micropolar antipilling 300 g · pretina ajustable y puños elasticados",
        tallas: "XS a 3XL",
        plazo: "A confirmar al cotizar",
      },
    ),
    featuredImage: localImage("polar-manga-larga", "Polar Manga Larga"),
    images: [localImage("polar-manga-larga", "Polar Manga Larga")],
    variants: makeVariants(
      "polarml",
      20500,
      specsFromColors("POLARML", [
        "Azul marino", "Negro", "Azulino", "Rojo", "Beige", "Verde botella", "Gris",
      ]),
      "polar-manga-larga",
    ),
    minQty: 10,
    leadTimeDaysReorder: 7,
    baseCostUsd: 12,
    volumePricing: rangePricing(20500, 15500),
    printAreas: [PECHO_IZQ, PECHO_CENTRO, MANGA],
    printTechniques: [BORDADO],
    tags: ["CORPORATIVO", "polerones", "stock-express"],
  },

  // #9 — Polar sin mangas
  {
    id: "rpc_polar_sin_manga",
    handle: "polar-sin-manga",
    title: "Polar Sin Mangas",
    vendor: VENDOR,
    category: "Polerones y Polar",
    description:
      "Chaleco polar sin mangas, la capa intermedia perfecta para uniformes de invierno. Abriga el torso sin restar movilidad, ideal bajo una chaqueta o sobre la polera.",
    descriptionHtml: fichaHtml(
      "Chaleco polar sin mangas, la capa intermedia perfecta para uniformes de invierno. Abriga el torso sin restar movilidad, ideal bajo una chaqueta o sobre la polera.",
      { material: "100% poliéster", tallas: "XS a 2XL", plazo: "A confirmar al cotizar" },
    ),
    featuredImage: localImage("polar-sin-manga", "Polar Sin Mangas"),
    images: [localImage("polar-sin-manga", "Polar Sin Mangas")],
    variants: makeVariants(
      "polarsm",
      16500,
      specsFromColors("POLARSM", ["Verde", "Negro", "Azul marino", "Gris"]),
      "polar-sin-manga",
    ),
    minQty: 10,
    leadTimeDaysReorder: 7,
    baseCostUsd: 10,
    volumePricing: rangePricing(16500, 12500),
    printAreas: [PECHO_IZQ, PECHO_CENTRO],
    printTechniques: [BORDADO],
    tags: ["CORPORATIVO", "polerones", "stock-express"],
  },

  // #10 — Polerón polo cuello redondo
  {
    id: "rpc_poleron_polo_cuello_redondo",
    handle: "poleron-polo-cuello-redondo",
    title: "Polerón Polo Cuello Redondo",
    vendor: VENDOR,
    category: "Polerones y Polar",
    description:
      "Polerón cuello redondo en mezcla algodón-poliéster, suave por dentro y resistente al uso diario. El básico de invierno que une comodidad y marca.",
    descriptionHtml: fichaHtml(
      "Polerón cuello redondo en mezcla algodón-poliéster, suave por dentro y resistente al uso diario. El básico de invierno que une comodidad y marca.",
      { material: "70% algodón · 30% poliéster", tallas: "XS a 3XL", plazo: "A confirmar al cotizar" },
    ),
    featuredImage: localImage("poleron-polo-cuello-redondo", "Polerón Polo Cuello Redondo"),
    images: [localImage("poleron-polo-cuello-redondo", "Polerón Polo Cuello Redondo")],
    variants: makeVariants(
      "polo",
      16990,
      specsFromColors("POLO", [
        "Gris", "Negro", "Azul marino", "Azulino", "Blanco", "Rojo", "Naranjo", "Beige", "Lila", "Rosado", "Verde",
      ]),
      "poleron-polo-cuello-redondo",
    ),
    minQty: 10,
    leadTimeDaysReorder: 7,
    baseCostUsd: 10,
    volumePricing: rangePricing(16990, 12500),
    printAreas: [PECHO_IZQ, PECHO_CENTRO, ESPALDA, MANGA],
    printTechniques: [BORDADO, SERIGRAFIA_1C, TRANSFER_DTF, VINILO],
    tags: ["CORPORATIVO", "polerones", "stock-express"],
  },

  // #11 — Polerón canguro
  {
    id: "rpc_poleron_canguro",
    handle: "poleron-canguro",
    title: "Polerón Canguro",
    vendor: VENDOR,
    category: "Polerones y Polar",
    description:
      "Hoodie con bolsillo canguro y gorro, el favorito de startups, universidades y equipos jóvenes. Amplio lienzo al frente y la espalda para tu logo.",
    descriptionHtml: fichaHtml(
      "Hoodie con bolsillo canguro y gorro, el favorito de startups, universidades y equipos jóvenes. Amplio lienzo al frente y la espalda para tu logo.",
      { material: "70% algodón · 20% poliéster", tallas: "Talla 6 a 3XL", plazo: "3 a 7 días hábiles" },
    ),
    featuredImage: localImage("poleron-canguro", "Polerón Canguro"),
    images: [localImage("poleron-canguro", "Polerón Canguro")],
    variants: makeVariants(
      "canguro",
      18990,
      specsFromColors("CANGURO", [
        "Azul marino", "Negro", "Gris", "Blanco", "Azulino", "Celeste", "Rojo", "Morado",
        "Naranjo", "Amarillo", "Rosado", "Fucsia", "Verde agua", "Verde manzana", "Verde militar", "Beige",
      ]),
      "poleron-canguro",
    ),
    minQty: 10,
    leadTimeDaysReorder: 7,
    baseCostUsd: 11,
    volumePricing: rangePricing(18990, 13990),
    printAreas: [PECHO_IZQ, PECHO_CENTRO, ESPALDA, MANGA],
    printTechniques: [BORDADO, SERIGRAFIA_1C, TRANSFER_DTF, VINILO],
    tags: ["CORPORATIVO", "polerones", "stock-express"],
  },

  // ===========================================================================
  // DEMO — categorías aún no levantadas por la clienta. Productos y precios
  // de referencia para mostrar el alcance del rubro (el banner lo advierte).
  // ===========================================================================
  {
    id: "rpc_camisa_oxford",
    handle: "camisa-oxford",
    title: "Camisa Oxford",
    vendor: VENDOR,
    category: "Camisas",
    description:
      "Camisa Oxford clásica de uniforme ejecutivo. Bordado al pecho con acabado impecable. Versión hombre y mujer.",
    descriptionHtml:
      "<p>Camisa Oxford clásica de uniforme ejecutivo. Bordado al pecho con acabado impecable. Versión hombre y mujer.</p>",
    featuredImage: localImage("camisa-oxford", "Camisa Oxford"),
    images: [localImage("camisa-oxford", "Camisa Oxford")],
    variants: makeVariants("oxford", 22990, [
      { color: "Celeste", sku: "RPC-OXF-CE" },
      { color: "Blanco", sku: "RPC-OXF-BL" },
    ], "camisa-oxford", "low"),
    minQty: 20,
    leadTimeDaysReorder: 60,
    baseCostUsd: 9.5,
    volumePricing: [
      { minQty: 20, unitPriceNet: 15990 },
      { minQty: 50, unitPriceNet: 13990 },
      { minQty: 100, unitPriceNet: 12490 },
      { minQty: 250, unitPriceNet: 10990 },
    ],
    printAreas: [PECHO_IZQ, MANGA],
    printTechniques: [BORDADO],
    tags: ["CORPORATIVO", "camisas", "fabricacion"],
  },
  {
    id: "rpc_pantalon_cargo",
    handle: "pantalon-cargo-tecnico",
    title: "Pantalón Cargo Técnico",
    vendor: VENDOR,
    category: "Pantalones y Ropa Técnica",
    description:
      "Gabardina reforzada con bolsillos cargo para faena y terreno. Parte del uniforme completo que fabricamos a medida.",
    descriptionHtml:
      "<p>Gabardina reforzada con bolsillos cargo para faena y terreno. Parte del uniforme completo que fabricamos a medida.</p>",
    featuredImage: localImage("pantalon-cargo-tecnico", "Pantalón Cargo Técnico"),
    images: [localImage("pantalon-cargo-tecnico", "Pantalón Cargo Técnico")],
    variants: makeVariants("cargo", 24990, [
      { color: "Beige", sku: "RPC-CAR-BE" },
      { color: "Gris Oscuro", sku: "RPC-CAR-GO" },
      { color: "Negro", sku: "RPC-CAR-NG" },
    ], "pantalon-cargo-tecnico", "low"),
    minQty: 25,
    leadTimeDaysReorder: 70,
    baseCostUsd: 10.8,
    volumePricing: [
      { minQty: 25, unitPriceNet: 17990 },
      { minQty: 50, unitPriceNet: 15990 },
      { minQty: 100, unitPriceNet: 14490 },
      { minQty: 250, unitPriceNet: 12990 },
    ],
    printAreas: [MANGA],
    printTechniques: [BORDADO, TRANSFER_DTF],
    tags: ["CORPORATIVO", "ropa-tecnica", "fabricacion"],
  },
  {
    id: "rpc_jockey",
    handle: "jockey-gabardina",
    title: "Jockey Gabardina",
    vendor: VENDOR,
    category: "Jockeys y Gorros",
    description:
      "Jockey 6 paneles con cierre regulable. El merchandising que más circula: tu logo bordado al frente, a la vista todo el día.",
    descriptionHtml:
      "<p>Jockey 6 paneles con cierre regulable. El merchandising que más circula: tu logo bordado al frente, a la vista todo el día.</p>",
    featuredImage: localImage("jockey-gabardina", "Jockey Gabardina"),
    images: [localImage("jockey-gabardina", "Jockey Gabardina")],
    variants: makeVariants("jockey", 7990, [
      { color: "Negro", sku: "RPC-JOC-NG" },
      { color: "Azul Marino", sku: "RPC-JOC-AZ" },
      { color: "Blanco", sku: "RPC-JOC-BL" },
      { color: "Rojo", sku: "RPC-JOC-RJ" },
    ], "jockey-gabardina"),
    minQty: 50,
    leadTimeDaysReorder: 45,
    baseCostUsd: 2.2,
    volumePricing: [
      { minQty: 50, unitPriceNet: 4490 },
      { minQty: 100, unitPriceNet: 3890 },
      { minQty: 250, unitPriceNet: 3290 },
      { minQty: 500, unitPriceNet: 2890 },
    ],
    printAreas: [GORRO_FRENTE, GORRO_LATERAL],
    printTechniques: [BORDADO, TRANSFER_DTF],
    tags: ["CORPORATIVO", "gorros", "stock-express"],
  },
  {
    id: "rpc_gorro_lana",
    handle: "gorro-lana-beanie",
    title: "Gorro de Lana (Beanie)",
    vendor: VENDOR,
    category: "Jockeys y Gorros",
    description:
      "Beanie tejido con vuelta para bordado. Infaltable en kits de invierno y marcas outdoor.",
    descriptionHtml:
      "<p>Beanie tejido con vuelta para bordado. Infaltable en kits de invierno y marcas outdoor.</p>",
    featuredImage: localImage("gorro-lana-beanie", "Gorro de Lana (Beanie)"),
    images: [localImage("gorro-lana-beanie", "Gorro de Lana (Beanie)")],
    variants: makeVariants("beanie", 6990, [
      { color: "Gris", sku: "RPC-BEA-GR" },
      { color: "Negro", sku: "RPC-BEA-NG" },
      { color: "Burdeo", sku: "RPC-BEA-BU" },
    ], "gorro-lana-beanie"),
    minQty: 50,
    leadTimeDaysReorder: 50,
    baseCostUsd: 1.9,
    volumePricing: [
      { minQty: 50, unitPriceNet: 3990 },
      { minQty: 100, unitPriceNet: 3490 },
      { minQty: 250, unitPriceNet: 2990 },
      { minQty: 500, unitPriceNet: 2590 },
    ],
    printAreas: [GORRO_FRENTE],
    printTechniques: [BORDADO],
    tags: ["CORPORATIVO", "gorros", "stock-express"],
  },
  {
    id: "rpc_bolsa_tote",
    handle: "bolsa-tote-algodon",
    title: "Bolsa Tote de Algodón",
    vendor: VENDOR,
    category: "Merchandising",
    description:
      "Tote ecológica de algodón crudo 140 g. El regalo corporativo más pedido para eventos y ferias.",
    descriptionHtml:
      "<p>Tote ecológica de algodón crudo 140 g. El regalo corporativo más pedido para eventos y ferias.</p>",
    featuredImage: localImage("bolsa-tote-algodon", "Bolsa Tote de Algodón"),
    images: [localImage("bolsa-tote-algodon", "Bolsa Tote de Algodón")],
    variants: makeVariants("tote", 4990, [
      { color: "Crudo", sku: "RPC-TOT-CR" },
      { color: "Negro", sku: "RPC-TOT-NG" },
    ], "bolsa-tote-algodon"),
    minQty: 100,
    leadTimeDaysReorder: 45,
    baseCostUsd: 1.1,
    volumePricing: [
      { minQty: 100, unitPriceNet: 2790 },
      { minQty: 250, unitPriceNet: 2390 },
      { minQty: 500, unitPriceNet: 1990 },
      { minQty: 1000, unitPriceNet: 1690 },
    ],
    printAreas: [BOLSA_CARA],
    printTechniques: [SERIGRAFIA_1C, SERIGRAFIA_FULL, TRANSFER_DTF],
    tags: ["CORPORATIVO", "merchandising", "stock-express"],
  },
  {
    id: "rpc_tazon",
    handle: "tazon-ceramica",
    title: "Tazón Cerámica 330ml",
    vendor: VENDOR,
    category: "Merchandising",
    description:
      "Tazón de cerámica sublimable a todo color. El clásico de escritorio que mantiene tu marca a la vista cada día.",
    descriptionHtml:
      "<p>Tazón de cerámica sublimable a todo color. El clásico de escritorio que mantiene tu marca a la vista cada día.</p>",
    featuredImage: localImage("tazon-ceramica", "Tazón Cerámica 330ml"),
    images: [localImage("tazon-ceramica", "Tazón Cerámica 330ml")],
    variants: makeVariants("tazon", 5990, [
      { color: "Blanco", sku: "RPC-TAZ-BL" },
      { color: "Interior Color", sku: "RPC-TAZ-IC" },
    ], "tazon-ceramica"),
    minQty: 50,
    leadTimeDaysReorder: 40,
    baseCostUsd: 1.4,
    volumePricing: [
      { minQty: 50, unitPriceNet: 3490 },
      { minQty: 100, unitPriceNet: 2990 },
      { minQty: 250, unitPriceNet: 2590 },
      { minQty: 500, unitPriceNet: 2190 },
    ],
    printAreas: [TAZON_CARA],
    printTechniques: [SUBLIMACION],
    tags: ["CORPORATIVO", "merchandising", "stock-express"],
  },
];

export function mockProductByHandle(handle: string): CorporateProduct | null {
  return mockCorporateProducts.find((p) => p.handle === handle) ?? null;
}
