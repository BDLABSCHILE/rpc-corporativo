import type {
  CorporateProduct,
  LogoSizeTier,
  PrintArea,
  PrintTechnique,
  ShopifyImage,
} from "./types";

/**
 * Mock data del catálogo de Ropa Publicitaria Chile.
 *
 * Activado con USE_MOCK_PRODUCTS=true. Los 35 productos son los REALES del
 * levantamiento de catálogo de la clienta (2026-06-18): Poleras, Polerones y
 * Polar, Camisas y Blusas, Ropa Técnica y Cortavientos, Jockeys/Gorros/
 * Accesorios y Delantales y Uniformes. Colores, tallas, materialidades,
 * mínimos, plazos, modalidad y técnicas son los que ella declaró. Los
 * `volumePricing` se derivan de los RANGOS de precio por unidad (helper
 * rangePricing): tope a la cantidad mínima, piso sobre 100u.
 *
 * FOTOS: estudio generadas (ghost-mannequin, fondo gris claro, prenda en
 * blanco sin logo) en public/products/<handle>.webp. Una foto base por
 * producto (color "hero" = primer color de la lista).
 *
 * Schema idéntico a CorporateProduct para que el switch a datos reales
 * (Shopify o catálogo propio) sea solo en storefront.ts.
 */

// --- Técnicas de personalización ---------------------------------------------
// Precios CONFIRMADOS por la marca el 2026-06-23 en la matriz devuelta. El
// precio de personalización depende del TAMAÑO del logo: el cotizador elige el
// tramo (insignia 5–12 cm / carta ~28 cm / gigantografía >33 cm) por el lado
// más largo del logo en el preview. `basePriceUnit` = tramo insignia (fallback
// cuando no se conoce el tamaño); `sizeTiers` lleva la tabla completa.
//
// Reglas confirmadas: precio NETO (+19% IVA al final), descuento de volumen a
// partir de 50u, cada logo en zona extra se cobra, urgencia 2 días, despacho
// gratis sobre 25u en RM. Setup de bordado: una vez por logo, gratis sobre
// 50u (RPC no entregó el monto del setup; lo dejamos en $0 hasta tenerlo).
//
// Cortes entre tramos: insignia ≤12 cm, carta 12–33 cm, gigantografía >33 cm
// (derivados de los rangos que dio la marca). Las técnicas sin gigantografía
// (serigrafía, vinilo) marcan el logo sobre carta como "a confirmar al cotizar".

/** Tramo de precio por tamaño del logo. `maxLongSideCm` null = sin tope. */
function sizeTier(
  id: LogoSizeTier["id"],
  label: string,
  maxLongSideCm: number | null,
  priceUnit: number,
): LogoSizeTier {
  return { id, label, maxLongSideCm, priceUnit };
}

const TIER_INSIGNIA_MAX = 12;
const TIER_CARTA_MAX = 33;

const BORDADO: PrintTechnique = {
  id: "bordado",
  label: "Bordado",
  description:
    "El acabado más durable y premium. Precios por tamaño: insignia (5-12 cm) $2.500, carta (~28 cm) $5.000, gigantografía (sobre 33 cm) $7.000. La matriz del logo se cobra una vez y queda gratis sobre 50 u.",
  basePriceUnit: 2500,
  sizeTiers: [
    sizeTier("insignia", "Insignia (5–12 cm)", TIER_INSIGNIA_MAX, 2500),
    sizeTier("carta", "Carta (~28 cm)", TIER_CARTA_MAX, 5000),
    sizeTier("gigantografia", "Gigantografía (>33 cm)", null, 7000),
  ],
  extraPositionPrice: 2500,
  setupFee: 0,
  extraLeadDays: 7,
  availableAreaIds: ["pecho_izq", "pecho_centro", "manga", "gorro_frente", "gorro_lateral"],
};

const SERIGRAFIA_1C: PrintTechnique = {
  id: "serigrafia_1c",
  label: "Serigrafía 1 color",
  description:
    "Económica y resistente para tirajes grandes. 1 a 2 colores planos. Precios por tamaño: insignia (5-12 cm) $1.000, carta (~28 cm) $2.000. Mínimo 20 unidades.",
  basePriceUnit: 1000,
  sizeTiers: [
    sizeTier("insignia", "Insignia (5–12 cm)", TIER_INSIGNIA_MAX, 1000),
    sizeTier("carta", "Carta (~28 cm)", TIER_CARTA_MAX, 2000),
  ],
  extraPositionPrice: 1000,
  setupFee: 0,
  extraLeadDays: 5,
  availableAreaIds: ["pecho_izq", "pecho_centro", "espalda", "manga", "bolsa_cara", "gorro_frente", "gorro_lateral"],
};

const SERIGRAFIA_FULL: PrintTechnique = {
  id: "serigrafia_full",
  label: "Serigrafía full color",
  description:
    "Hasta 5 colores para artes con más fidelidad en tirajes grandes. Precios por tamaño: insignia (5-12 cm) $2.000, carta (~28 cm) $3.000. Mínimo 20 unidades.",
  basePriceUnit: 2000,
  sizeTiers: [
    sizeTier("insignia", "Insignia (5–12 cm)", TIER_INSIGNIA_MAX, 2000),
    sizeTier("carta", "Carta (~28 cm)", TIER_CARTA_MAX, 3000),
  ],
  extraPositionPrice: 2000,
  setupFee: 0,
  extraLeadDays: 8,
  availableAreaIds: ["pecho_centro", "espalda", "bolsa_cara"],
};

const TRANSFER_DTF: PrintTechnique = {
  id: "transfer_dtf",
  label: "Transfer DTF",
  description:
    "Full color con gran detalle en cualquier tela, sin setup. Precios por tamaño: insignia (5-12 cm) $2.500, carta (~28 cm) $4.500, gigantografía (sobre 33 cm) $6.500. Mínimo 10 unidades.",
  basePriceUnit: 2500,
  sizeTiers: [
    sizeTier("insignia", "Insignia (5–12 cm)", TIER_INSIGNIA_MAX, 2500),
    sizeTier("carta", "Carta (~28 cm)", TIER_CARTA_MAX, 4500),
    sizeTier("gigantografia", "Gigantografía (>33 cm)", null, 6500),
  ],
  extraPositionPrice: 2500,
  setupFee: 0,
  extraLeadDays: 3,
  availableAreaIds: ["pecho_izq", "pecho_centro", "espalda", "manga", "bolsa_cara", "gorro_frente", "gorro_lateral"],
};

const VINILO: PrintTechnique = {
  id: "vinilo",
  label: "Vinilo textil",
  description:
    "Corte de vinilo termoadhesivo aplicado por calor — ideal para números, nombres y logos planos. Precios por tamaño: insignia (5-12 cm) $2.800, carta (~28 cm) $5.000.",
  basePriceUnit: 2800,
  sizeTiers: [
    sizeTier("insignia", "Insignia (5–12 cm)", TIER_INSIGNIA_MAX, 2800),
    sizeTier("carta", "Carta (~28 cm)", TIER_CARTA_MAX, 5000),
  ],
  extraPositionPrice: 2800,
  setupFee: 0,
  extraLeadDays: 3,
  availableAreaIds: ["pecho_izq", "pecho_centro", "espalda", "manga", "gorro_frente", "gorro_lateral"],
};

const SUBLIMACION: PrintTechnique = {
  id: "sublimacion",
  label: "Sublimación (incluida)",
  description:
    "Sublimación full color sobre el accesorio. En este catálogo viene incluida en el precio del producto (Bandanas) — no se cobra aparte.",
  basePriceUnit: 0,
  extraPositionPrice: 0,
  setupFee: 0,
  extraLeadDays: 0,
  availableAreaIds: ["pecho_centro", "espalda", "tazon_cara"],
};

// --- Imágenes -----------------------------------------------------------------

/** Foto de estudio servida localmente desde public/products/<handle>.webp. */
function localImage(handle: string, alt: string): ShopifyImage {
  return { url: `/products/${handle}.webp`, altText: alt, width: 1280, height: 1280 };
}

/** Placeholder neutro — hoy solo lo usan las zonas de impresión (PrintArea). */
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

/**
 * Una zona de impresión. `imageUrl` apunta a la vista del producto que
 * corresponde a esa zona (frente / espalda / lateral) — el LivePreview cambia
 * la foto al seleccionarla. Si la URL empieza con `/products/...` el
 * ProductConfigurator la usa; si es placeholder, cae al featured image.
 */
const area = (
  id: string,
  label: string,
  poly: Array<[number, number]>,
  maxWcm: number,
  maxHcm: number,
  pxPerCm: number,
  imageUrl?: string,
): PrintArea => ({
  id,
  label,
  imageUrl: imageUrl ?? placeholderImage(label).url,
  areaPolygon: poly,
  maxWidthCm: maxWcm,
  maxHeightCm: maxHcm,
  pxPerCm,
});

// Áreas "de frente" — usan la foto principal del producto, así que no setean imageUrl.
const PECHO_IZQ = area("pecho_izq", "Pecho izquierdo", [[640, 420], [840, 420], [840, 580], [640, 580]], 10, 10, 28);
const PECHO_CENTRO = area("pecho_centro", "Pecho centro", [[420, 430], [780, 430], [780, 720], [420, 720]], 28, 35, 24);
const MANGA = area("manga", "Manga", [[480, 470], [720, 470], [720, 610], [480, 610]], 8, 8, 30);
const GORRO_FRENTE = area("gorro_frente", "Frente del gorro", [[440, 420], [760, 420], [760, 640], [440, 640]], 12, 6, 30);

// Áreas "de espalda / lateral" — apuntan a fotos específicas. Como las fotos
// de espalda son por tipo de prenda (no por producto individual), cada
// categoría tiene su propia constante ESPALDA_X. AREAS_PRENDA, AREAS_CAMISA,
// etc. se materializan después (necesitan estas constantes).
const ESPALDA_POLERA = area("espalda", "Espalda", [[400, 380], [800, 380], [800, 760], [400, 760]], 30, 40, 24, "/products/_espalda-polera.webp");
const ESPALDA_PIQUE = area("espalda", "Espalda", [[400, 380], [800, 380], [800, 760], [400, 760]], 30, 40, 24, "/products/_espalda-pique.webp");
const ESPALDA_POLERON = area("espalda", "Espalda", [[400, 360], [800, 360], [800, 780], [400, 780]], 35, 45, 22, "/products/_espalda-poleron.webp");
const ESPALDA_CAMISA = area("espalda", "Espalda", [[400, 380], [800, 380], [800, 760], [400, 760]], 28, 38, 24, "/products/_espalda-camisa.webp");
const ESPALDA_SOFTSHELL = area("espalda", "Espalda", [[400, 360], [800, 360], [800, 780], [400, 780]], 30, 40, 22, "/products/_espalda-softshell.webp");
const GORRO_LATERAL = area("gorro_lateral", "Lateral del gorro", [[500, 460], [740, 460], [740, 600], [500, 600]], 7, 4, 32, "/products/_lateral-jockey.webp");

// Conjuntos de zonas reutilizables (espalda según tipo de prenda).
const AREAS_POLERA = [PECHO_IZQ, PECHO_CENTRO, ESPALDA_POLERA, MANGA];
const AREAS_PIQUE = [PECHO_IZQ, PECHO_CENTRO, ESPALDA_PIQUE, MANGA];
const AREAS_POLERON = [PECHO_IZQ, PECHO_CENTRO, ESPALDA_POLERON, MANGA];
const AREAS_CAMISA = [PECHO_IZQ, ESPALDA_CAMISA, MANGA];
const AREAS_SOFTSHELL = [PECHO_IZQ, ESPALDA_SOFTSHELL, MANGA];
const AREAS_GORRO = [GORRO_FRENTE, GORRO_LATERAL];
const AREAS_DELANTAL = [PECHO_CENTRO, PECHO_IZQ];

// Alias de compat: AREAS_PRENDA == AREAS_POLERA (las usan productos antiguos
// que aún no migran al alias específico). Se eliminan cuando todos migren.
const AREAS_PRENDA = AREAS_POLERA;

// --- Helpers ------------------------------------------------------------------

type VariantSpec = { color: string; sku: string };

function makeVariants(
  productKey: string,
  retailClp: number,
  specs: VariantSpec[],
  handle: string,
) {
  return specs.map(({ color, sku }) => ({
    id: `rpc_var_${productKey}_${sku.toLowerCase()}`,
    title: color,
    sku,
    selectedOptions: [{ name: "Color", value: color }],
    priceRetail: { amount: retailClp, currencyCode: "CLP" as const },
    image: localImage(handle, color),
    availableForSale: true,
  }));
}

function specsFromColors(prefix: string, colors: string[]): VariantSpec[] {
  return colors.map((color, i) => ({
    color,
    sku: `RPC-${prefix}-${String(i + 1).padStart(2, "0")}`,
  }));
}

/**
 * Tabla de descuentos por volumen derivada del RANGO (tope/piso) cuando
 * todavía no tenemos los tramos exactos del cliente. Se usa como fallback en
 * productos cuyos precios reales aún no llegaron.
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
 * Tabla EXACTA de tramos por cantidad entregada por la marca (matriz devuelta
 * 2026-06-23). Acepta un objeto con las cantidades que la marca cotizó; las
 * que vienen `null` se omiten (la marca solo cotizó hasta 250u, no 500/1000).
 */
function tramos(t: { 10?: number; 25?: number; 50?: number; 100?: number; 250?: number; 500?: number; 1000?: number }) {
  return ([10, 25, 50, 100, 250, 500, 1000] as const)
    .filter((q) => t[q] !== undefined)
    .map((q) => ({ minQty: q, unitPriceNet: t[q]! }));
}

function fichaHtml(
  intro: string,
  spec: { material: string; tallas: string; plazo: string; minimo: number; modalidad: string; nota?: string },
): string {
  return (
    `<p>${intro}</p>` +
    `<p><strong>Material:</strong> ${spec.material}<br/>` +
    `<strong>Tallas:</strong> ${spec.tallas}<br/>` +
    `<strong>Mínimo:</strong> ${spec.minimo} unidades · ${spec.modalidad}<br/>` +
    `<strong>Plazo de referencia:</strong> ${spec.plazo}</p>` +
    (spec.nota ? `<p><strong>Nota:</strong> ${spec.nota}</p>` : "")
  );
}

const VENDOR = "Ropa Publicitaria Chile";

type ProductInput = {
  key: string;
  handle: string;
  title: string;
  category: string;
  catTag: string;
  intro: string;
  material: string;
  tallas: string;
  plazo: string;
  leadDays: number;
  modalidad: "Stock" | "Fabricación a medida";
  colors: string[];
  /** Tramos REALES entregados por la marca. Si vienen, ganan. */
  pricing?: ReturnType<typeof tramos>;
  /** Fallback cuando todavía no llegan los tramos reales: tope y piso del rango. */
  priceHigh?: number;
  priceLow?: number;
  techniques: PrintTechnique[];
  areas: PrintArea[];
  minimo?: number;
  nota?: string;
  baseCostUsd?: number;
};

function product(o: ProductInput): CorporateProduct {
  const minimo = o.minimo ?? 10;
  const modalidadTag = o.modalidad === "Fabricación a medida" ? "fabricacion" : "stock-express";

  const volumePricing =
    o.pricing && o.pricing.length > 0
      ? o.pricing
      : o.priceHigh !== undefined && o.priceLow !== undefined
        ? rangePricing(o.priceHigh, o.priceLow)
        : (() => {
            throw new Error(`Producto ${o.handle} sin pricing ni rango.`);
          })();

  // Precio retail de la variante = primer tramo (el más caro, cantidad mínima).
  const retailClp = volumePricing[0]!.unitPriceNet;

  return {
    id: `rpc_${o.key.toLowerCase()}`,
    handle: o.handle,
    title: o.title,
    vendor: VENDOR,
    category: o.category,
    description: o.intro,
    descriptionHtml: fichaHtml(o.intro, {
      material: o.material,
      tallas: o.tallas,
      plazo: o.plazo,
      minimo,
      modalidad: o.modalidad,
      nota: o.nota,
    }),
    featuredImage: localImage(o.handle, o.title),
    images: [localImage(o.handle, o.title)],
    variants: makeVariants(o.key, retailClp, specsFromColors(o.key, o.colors), o.handle),
    minQty: minimo,
    leadTimeDaysReorder: o.leadDays,
    baseCostUsd: o.baseCostUsd ?? 6,
    volumePricing,
    printAreas: o.areas,
    printTechniques: o.techniques,
    tags: ["CORPORATIVO", o.catTag, modalidadTag],
  };
}

// --- Catálogo (35 productos reales) ------------------------------------------

export const mockCorporateProducts: CorporateProduct[] = [
  // === Poleras =============================================================
  product({
    key: "PIQMC", handle: "polera-pique-cuello-botones-manga-corta",
    title: "Polera Piqué Cuello y Botones M/C", category: "Poleras", catTag: "poleras",
    intro: "La clásica polo piqué de uniforme corporativo en manga corta. Cuello y puños tejidos y el lienzo perfecto para tu logo al pecho.",
    material: "80% algodón · 20% poliéster (piqué)", tallas: "S a 3XL", plazo: "5 a 7 días", leadDays: 7,
    modalidad: "Stock", nota: "Elige versión hombre o mujer",
    colors: ["Azul marino", "Negro", "Rojo", "Blanco", "Azulino", "Gris", "Amarillo", "Naranjo", "Verde"],
    pricing: tramos({ 10: 8500, 25: 7990, 50: 7500, 100: 6990, 250: 6500 }), techniques: [BORDADO, SERIGRAFIA_1C, TRANSFER_DTF, VINILO], areas: AREAS_PIQUE,
  }),
  product({
    key: "PIQML", handle: "polera-pique-cuello-botones-manga-larga",
    title: "Polera Piqué Cuello y Botones M/L", category: "Poleras", catTag: "poleras",
    intro: "La polo piqué de uniforme en manga larga, para climas fríos o un look más formal. Cuello y puños tejidos, lista para tu marca.",
    material: "80% algodón · 20% poliéster (piqué)", tallas: "S a 3XL", plazo: "5 a 7 días", leadDays: 7,
    modalidad: "Stock", nota: "Elige versión hombre o mujer",
    colors: ["Negro", "Gris", "Blanco", "Azul marino", "Azulino", "Rojo"],
    pricing: tramos({ 10: 8900, 25: 8500, 50: 7900, 100: 7500, 250: 6990 }), techniques: [BORDADO, SERIGRAFIA_1C, TRANSFER_DTF, VINILO], areas: AREAS_PIQUE,
  }),
  product({
    key: "CRMC", handle: "polera-cuello-redondo-manga-corta",
    title: "Polera Cuello Redondo M/C", category: "Poleras", catTag: "poleras",
    intro: "Polera cuello redondo 100% algodón, la prenda más rendidora para eventos, activaciones y equipos — y la que más colores ofrece del catálogo.",
    material: "100% algodón", tallas: "XS a 3XL", plazo: "3 a 4 días", leadDays: 4, modalidad: "Stock",
    colors: ["Blanco", "Negro", "Gris", "Azulino", "Azul marino", "Celeste", "Rojo", "Naranjo", "Rosado", "Fucsia", "Amarillo", "Verde militar", "Verde agua", "Verde manzana", "Café", "Beige"],
    pricing: tramos({ 10: 5990, 25: 5500, 50: 4500, 100: 3990, 250: 3500 }), techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF, VINILO], areas: AREAS_PRENDA,
  }),
  product({
    key: "CRML", handle: "polera-cuello-redondo-manga-larga",
    title: "Polera Cuello Redondo M/L", category: "Poleras", catTag: "poleras",
    intro: "Polera cuello redondo 100% algodón en manga larga: la misma versatilidad, con más abrigo para el día a día.",
    material: "100% algodón", tallas: "XS a 3XL", plazo: "3 a 5 días", leadDays: 5, modalidad: "Stock",
    colors: ["Azul marino", "Negro", "Blanco", "Azulino", "Gris", "Rojo"],
    pricing: tramos({ 10: 6500, 25: 5990, 50: 5500, 100: 4990, 250: 4500 }), techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF, VINILO], areas: AREAS_PRENDA,
  }),
  product({
    key: "DRYF", handle: "polera-dry-fit-cuello-redondo",
    title: "Polera Dry-Fit Cuello Redondo", category: "Poleras", catTag: "poleras",
    intro: "Polera deportiva dry fit de secado rápido para corridas, clubes y team building. Poliéster respirable que rinde todo el día.",
    material: "100% poliéster (dry fit)", tallas: "Talla 8 a 3XL", plazo: "5 a 7 días hábiles", leadDays: 7, modalidad: "Stock",
    colors: ["Naranjo", "Negro", "Rojo", "Azul marino", "Azulino", "Blanco", "Gris", "Rosado", "Calypso"],
    pricing: tramos({ 10: 6990, 25: 6500, 50: 5990, 100: 5500, 250: 5200 }), techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF], areas: AREAS_PRENDA,
  }),
  product({
    key: "DRYFB", handle: "polera-dry-fit-cuello-botones",
    title: "Polera Dry-Fit Cuello y Botones", category: "Poleras", catTag: "poleras",
    intro: "Polo deportiva dry fit con cuello y botones: el punto medio entre lo técnico y lo formal, para terreno y staff en movimiento.",
    material: "100% poliéster (dry fit)", tallas: "S a 2XL", plazo: "A confirmar al cotizar", leadDays: 7, modalidad: "Stock",
    colors: ["Rojo", "Negro", "Gris", "Blanco", "Naranjo", "Calypso", "Azul marino", "Azulino"],
    pricing: tramos({ 10: 9990, 25: 9500, 50: 8990, 100: 8700, 250: 8300 }), techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF], areas: AREAS_PRENDA,
  }),
  product({
    key: "OVER", handle: "polera-oversize",
    title: "Polera Oversize", category: "Poleras", catTag: "poleras",
    intro: "Polera de corte oversize, el calce urbano que piden los equipos jóvenes. Caída holgada y amplia superficie para estampados grandes.",
    material: "A confirmar al cotizar", tallas: "XS a 2XL", plazo: "5 a 7 días", leadDays: 7, modalidad: "Stock",
    colors: ["Beige", "Negro", "Blanco", "Gris"],
    pricing: tramos({ 10: 10500, 25: 9990, 50: 8990, 100: 7990 }), techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF, VINILO], areas: AREAS_PRENDA,
  }),

  // === Polerones y Polar ===================================================
  product({
    key: "POLARML", handle: "polar-manga-larga",
    title: "Polar Manga Larga", category: "Polerones y Polar", catTag: "polerones",
    intro: "Polar micropolar antipilling 300 g con manga larga, pretina ajustable y puños elasticados. Abrigo liviano para faena, oficina y terreno.",
    material: "100% poliéster · micropolar antipilling 300 g · pretina ajustable y puños elasticados", tallas: "XS a 3XL", plazo: "3 a 7 días", leadDays: 7,
    modalidad: "Stock", nota: "Elige versión hombre o mujer", baseCostUsd: 12,
    colors: ["Azul marino", "Negro", "Azulino", "Rojo", "Beige", "Verde botella", "Gris"],
    pricing: tramos({ 10: 14500, 25: 13990, 50: 12990, 100: 12500, 250: 11990 }), techniques: [BORDADO], areas: [PECHO_IZQ, PECHO_CENTRO, MANGA],
  }),
  product({
    key: "POLARSM", handle: "polar-sin-manga",
    title: "Polar Sin Mangas", category: "Polerones y Polar", catTag: "polerones",
    intro: "Chaleco polar sin mangas, la capa intermedia perfecta para uniformes de invierno. Abriga el torso sin restar movilidad.",
    material: "100% poliéster", tallas: "XS a 2XL", plazo: "A confirmar al cotizar", leadDays: 7, modalidad: "Stock", baseCostUsd: 10,
    colors: ["Verde", "Negro", "Azul marino", "Gris"],
    pricing: tramos({ 10: 10990, 25: 10500, 50: 9990, 100: 9500 }), techniques: [BORDADO], areas: [PECHO_IZQ, PECHO_CENTRO],
  }),
  product({
    key: "POLO", handle: "poleron-polo-cuello-redondo",
    title: "Polerón Polo Cuello Redondo", category: "Polerones y Polar", catTag: "polerones",
    intro: "Polerón cuello redondo en mezcla algodón-poliéster, suave por dentro y resistente al uso diario. El básico de invierno que une comodidad y marca.",
    material: "70% algodón · 30% poliéster", tallas: "XS a 3XL", plazo: "A confirmar al cotizar", leadDays: 7, modalidad: "Stock", baseCostUsd: 10,
    colors: ["Gris", "Negro", "Azul marino", "Azulino", "Blanco", "Rojo", "Naranjo", "Beige", "Lila", "Rosado", "Verde"],
    pricing: tramos({ 10: 9500, 25: 8990, 50: 8500, 100: 7990, 250: 7500 }), techniques: [BORDADO, SERIGRAFIA_1C, TRANSFER_DTF, VINILO], areas: AREAS_POLERON,
  }),
  product({
    key: "CANGURO", handle: "poleron-canguro",
    title: "Polerón Canguro", category: "Polerones y Polar", catTag: "polerones",
    intro: "Hoodie con bolsillo canguro y gorro, el favorito de startups, universidades y equipos jóvenes. Amplio lienzo al frente y la espalda para tu logo.",
    material: "70% algodón · 20% poliéster", tallas: "Talla 6 a 3XL", plazo: "3 a 7 días hábiles", leadDays: 7, modalidad: "Stock", baseCostUsd: 11,
    colors: ["Azul marino", "Negro", "Gris", "Blanco", "Azulino", "Celeste", "Rojo", "Morado", "Naranjo", "Amarillo", "Rosado", "Fucsia", "Verde agua", "Verde manzana", "Verde militar", "Beige"],
    pricing: tramos({ 10: 10990, 25: 10500, 50: 9990, 100: 9500, 250: 8500 }), techniques: [BORDADO, SERIGRAFIA_1C, TRANSFER_DTF, VINILO], areas: AREAS_POLERON,
  }),
  product({
    key: "CIERRE", handle: "poleron-cierre-gorro",
    title: "Polerón con Cierre y Gorro", category: "Polerones y Polar", catTag: "polerones",
    intro: "Polerón con cierre completo y gorro. Versátil para el uniforme diario y cómodo de poner y sacar; bordado al pecho impecable.",
    material: "70% algodón · 30% poliéster", tallas: "XS a 3XL", plazo: "3 a 5 días", leadDays: 5, modalidad: "Stock", baseCostUsd: 11,
    colors: ["Negro", "Azulino", "Azul marino", "Gris", "Rojo"],
    pricing: tramos({ 10: 11500, 25: 10990, 50: 10500, 100: 9990, 250: 8990 }), techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF, VINILO], areas: AREAS_POLERON,
  }),

  // === Camisas y Blusas ====================================================
  product({
    key: "OXFH", handle: "camisa-oxford",
    title: "Camisa Oxford", category: "Camisas y Blusas", catTag: "camisas",
    intro: "Camisa Oxford clásica de uniforme ejecutivo. Acabado prolijo y elegante, ideal para bordar el logo al pecho.",
    material: "Tela Oxford", tallas: "S a 3XL", plazo: "A confirmar al cotizar", leadDays: 7, modalidad: "Stock", baseCostUsd: 9,
    colors: ["Celeste", "Blanco", "Gris", "Negro"],
    pricing: tramos({ 10: 13990, 25: 13500, 50: 12990, 100: 11500, 250: 10500 }), techniques: [BORDADO, TRANSFER_DTF], areas: AREAS_CAMISA,
  }),
  product({
    key: "OXFM", handle: "blusa-oxford",
    title: "Blusa Oxford", category: "Camisas y Blusas", catTag: "camisas",
    intro: "Blusa Oxford de corte femenino, elegante y cómoda para uniforme corporativo. Calce prolijo para la oficina.",
    material: "Tela Oxford", tallas: "S a 2XL", plazo: "A confirmar al cotizar", leadDays: 7, modalidad: "Stock", baseCostUsd: 9,
    colors: ["Celeste", "Blanco", "Rosado", "Negro", "Gris"],
    pricing: tramos({ 10: 12990, 25: 11990, 50: 11500, 100: 10990, 250: 9990 }), techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF], areas: AREAS_CAMISA,
  }),
  product({
    key: "JEANSH", handle: "camisa-jeans",
    title: "Camisa Jeans", category: "Camisas y Blusas", catTag: "camisas",
    intro: "Camisa de mezclilla (jeans) para un uniforme con onda casual. Resistente y versátil, va con todo.",
    material: "A confirmar al cotizar", tallas: "S a 2XL", plazo: "3 a 7 días", leadDays: 7, modalidad: "Stock", baseCostUsd: 9,
    colors: ["Azul jeans"],
    pricing: tramos({ 10: 14990, 25: 13990, 50: 13500, 100: 11990, 250: 10990 }), techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF], areas: AREAS_CAMISA,
  }),
  product({
    key: "JEANSM", handle: "blusa-jeans",
    title: "Blusa Jeans", category: "Camisas y Blusas", catTag: "camisas",
    intro: "Blusa de mezclilla (jeans) de corte femenino. Estilo casual y resistente para equipos con personalidad.",
    material: "A confirmar al cotizar", tallas: "S a 2XL", plazo: "3 a 7 días", leadDays: 7, modalidad: "Stock", baseCostUsd: 9,
    colors: ["Azul jeans"],
    pricing: tramos({ 10: 13990, 25: 12990, 50: 12500, 100: 11500, 250: 10500 }), techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF], areas: AREAS_CAMISA,
  }),
  product({
    key: "OUTH", handle: "camisa-outdoor",
    title: "Camisa Outdoor", category: "Camisas y Blusas", catTag: "camisas",
    intro: "Camisa outdoor en tela ripstop, resistente y liviana para terreno y actividades al aire libre. Bolsillos utilitarios.",
    material: "Tela ripstop", tallas: "S a 2XL", plazo: "A confirmar al cotizar", leadDays: 7, modalidad: "Stock", baseCostUsd: 11,
    colors: ["Beige", "Azul", "Gris", "Blanco", "Negro"],
    pricing: tramos({ 10: 24500, 25: 23500, 50: 22500, 100: 21500, 250: 20500 }), techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF], areas: AREAS_CAMISA,
  }),
  product({
    key: "OUTM", handle: "blusa-outdoor",
    title: "Blusa Outdoor", category: "Camisas y Blusas", catTag: "camisas",
    intro: "Blusa outdoor en tela ripstop de corte femenino. Liviana y resistente para terreno y outdoor.",
    material: "Tela ripstop", tallas: "S a 2XL", plazo: "A confirmar al cotizar", leadDays: 7, modalidad: "Stock", baseCostUsd: 11,
    colors: ["Gris", "Negro", "Beige", "Azul", "Blanco"],
    pricing: tramos({ 10: 23500, 25: 22500, 50: 21500, 100: 20500, 250: 19500 }), techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF], areas: AREAS_CAMISA,
  }),

  // === Ropa Técnica y Cortavientos =========================================
  product({
    key: "SSHH", handle: "softshell-hombre",
    title: "Softshell Hombre", category: "Ropa Técnica y Cortavientos", catTag: "tecnica",
    intro: "Softshell de hombre cortaviento y repelente al agua, con interior abrigado. La chaqueta técnica para gerencia y terreno.",
    material: "A confirmar al cotizar", tallas: "S a 3XL", plazo: "3 a 7 días", leadDays: 7, modalidad: "Stock", baseCostUsd: 16,
    colors: ["Azul marino", "Negro", "Rojo", "Gris"],
    pricing: tramos({ 10: 22990, 25: 22500, 50: 21990, 100: 20990, 250: 19990 }), techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF], areas: AREAS_SOFTSHELL,
  }),
  product({
    key: "SSHM", handle: "softshell-mujer",
    title: "Softshell Mujer", category: "Ropa Técnica y Cortavientos", catTag: "tecnica",
    intro: "Softshell de mujer cortaviento y repelente al agua, con interior abrigado. Calce femenino para oficina y terreno.",
    material: "A confirmar al cotizar", tallas: "S a 3XL", plazo: "3 a 7 días", leadDays: 7, modalidad: "Stock", baseCostUsd: 16,
    nota: "Disponible hombre y mujer",
    colors: ["Negro", "Azul", "Rojo", "Gris"],
    pricing: tramos({ 10: 22500, 25: 21990, 50: 21500, 100: 20500, 250: 19500 }), techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF], areas: AREAS_SOFTSHELL,
  }),
  product({
    key: "SSSV", handle: "softshell-sin-manga",
    title: "Softshell Sin Mangas", category: "Ropa Técnica y Cortavientos", catTag: "tecnica",
    intro: "Softshell sin mangas: abrigo cortaviento para el torso sin restar movilidad. Ideal como capa media del uniforme.",
    material: "A confirmar al cotizar", tallas: "S a 2XL", plazo: "3 a 5 días", leadDays: 5, modalidad: "Stock", baseCostUsd: 14,
    colors: ["Negro", "Rojo", "Azul", "Gris"],
    pricing: tramos({ 10: 21500, 25: 20500, 50: 19500, 100: 18900 }), techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF], areas: [PECHO_IZQ, PECHO_CENTRO, ESPALDA_SOFTSHELL],
  }),
  product({
    key: "CORTAV", handle: "cortavientos",
    title: "Cortavientos", category: "Ropa Técnica y Cortavientos", catTag: "tecnica",
    intro: "Cortavientos liviano en tela taslan, perfecto para activaciones, eventos al aire libre y equipos en movimiento.",
    material: "Taslan", tallas: "XS a 2XL", plazo: "3 a 7 días", leadDays: 7, modalidad: "Stock", baseCostUsd: 10,
    nota: "Elige hombre, mujer o unisex",
    colors: ["Azul marino", "Azulino", "Blanco", "Verde", "Rojo", "Negro"],
    pricing: tramos({ 10: 15990, 25: 15500, 50: 14990, 100: 14500 }), techniques: [BORDADO, SERIGRAFIA_1C, TRANSFER_DTF], areas: AREAS_SOFTSHELL,
  }),

  // === Jockeys, Gorros y Accesorios ========================================
  product({
    key: "JOCKEY", handle: "jockey",
    title: "Jockey", category: "Jockeys, Gorros y Accesorios", catTag: "gorros",
    intro: "Jockey de 6 paneles, el merchandising que más circula: tu logo bordado al frente, a la vista todo el día. Varias calidades de tela.",
    material: "Algodón, denim o gabardina (distintas calidades y precios)", tallas: "Única", plazo: "A confirmar al cotizar", leadDays: 7, modalidad: "Stock", baseCostUsd: 3,
    colors: ["Negro", "Rojo", "Gris", "Azul", "Azulino", "Naranjo", "Verde", "Amarillo"],
    pricing: tramos({ 10: 4990, 25: 4500, 50: 3990, 100: 3500, 250: 2990 }), techniques: [BORDADO, SERIGRAFIA_1C, TRANSFER_DTF], areas: AREAS_GORRO,
  }),
  product({
    key: "GORROL", handle: "gorro-lana",
    title: "Gorro de Lana", category: "Jockeys, Gorros y Accesorios", catTag: "gorros",
    intro: "Gorro de lana tejido, infaltable en kits de invierno y marcas outdoor. Cálido y con vuelta para bordar.",
    material: "100% lana", tallas: "Única", plazo: "A confirmar al cotizar", leadDays: 7, modalidad: "Stock", baseCostUsd: 2,
    colors: ["Gris", "Azul", "Azulino", "Negro", "Rojo", "Fucsia", "Rosa"],
    pricing: tramos({ 10: 4500, 25: 3990, 50: 3500, 100: 2990, 250: 2500 }), techniques: [BORDADO], areas: [GORRO_FRENTE],
  }),
  product({
    key: "BUCKET", handle: "bucket-hat",
    title: "Bucket Hat", category: "Jockeys, Gorros y Accesorios", catTag: "gorros",
    intro: "Bucket hat, el accesorio de moda para activaciones y equipos jóvenes. Amplia superficie para tu marca.",
    material: "A confirmar al cotizar", tallas: "Única", plazo: "3 a 7 días", leadDays: 7, modalidad: "Stock", baseCostUsd: 3,
    colors: ["Negro", "Gris", "Azul", "Beige"],
    pricing: tramos({ 10: 5990, 25: 5500, 50: 4900, 100: 4500 }), techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF, VINILO], areas: AREAS_GORRO,
  }),
  product({
    key: "SAFARI", handle: "gorro-safari",
    title: "Gorro Safari", category: "Jockeys, Gorros y Accesorios", catTag: "gorros",
    intro: "Gorro safari de ala ancha, ideal para terreno, turismo y outdoor. Protege del sol y luce tu logo.",
    material: "A confirmar al cotizar", tallas: "Única", plazo: "3 a 7 días", leadDays: 7, modalidad: "Stock", baseCostUsd: 3,
    colors: ["Beige", "Verde militar", "Negro"],
    pricing: tramos({ 10: 6990, 25: 6500, 50: 5990, 100: 4990, 250: 4500 }), techniques: [BORDADO, VINILO, TRANSFER_DTF, SERIGRAFIA_1C], areas: AREAS_GORRO,
  }),
  product({
    key: "GPOLAR", handle: "gorro-polar",
    title: "Gorro Polar", category: "Jockeys, Gorros y Accesorios", catTag: "gorros",
    intro: "Gorro polar de poliéster, abrigado y suave para el invierno. Bordado prolijo al frente.",
    material: "Poliéster polar", tallas: "Única", plazo: "3 a 7 días", leadDays: 7, modalidad: "Stock", baseCostUsd: 2,
    colors: ["Negro", "Azulino", "Azul", "Rojo"],
    pricing: tramos({ 10: 4500, 25: 3500, 50: 2990, 100: 2500, 250: 2000 }), techniques: [BORDADO], areas: [GORRO_FRENTE],
  }),
  product({
    key: "BANDANA", handle: "bandanas",
    title: "Bandanas", category: "Jockeys, Gorros y Accesorios", catTag: "gorros",
    intro: "Bandanas confeccionadas a medida con tu logo en sublimación full color. Accesorio versátil para eventos y staff.",
    material: "A confirmar al cotizar", tallas: "Única", plazo: "7 a 12 días", leadDays: 12, modalidad: "Stock", minimo: 25, baseCostUsd: 2,
    nota: "Sublimación full color incluida · mínimo 25 unidades",
    colors: ["Negro"],
    pricing: tramos({ 25: 5500, 50: 4990, 100: 4500, 250: 3990 }), techniques: [SUBLIMACION], areas: [PECHO_CENTRO],
  }),

  // === Delantales y Uniformes ==============================================
  product({
    key: "PECH", handle: "pechera",
    title: "Pechera", category: "Delantales y Uniformes", catTag: "uniformes",
    intro: "Pechera de Polycron o gabardina, resistente para cocina, retail y servicio. Se confecciona a medida con tu marca.",
    material: "Polycron o gabardina", tallas: "Única", plazo: "10 a 12 días (menos si hay stock)", leadDays: 12, modalidad: "Fabricación a medida", baseCostUsd: 5,
    colors: ["Negro", "Rojo", "Blanco", "Café", "Rosado", "Beige", "Verde"],
    pricing: tramos({ 10: 8990, 25: 8500, 50: 7990, 100: 6990, 250: 5990 }), techniques: [BORDADO, SERIGRAFIA_1C, TRANSFER_DTF], areas: AREAS_DELANTAL,
  }),
  product({
    key: "PECHB", handle: "pechera-basica",
    title: "Pechera Básica", category: "Delantales y Uniformes", catTag: "uniformes",
    intro: "Pechera básica de poliéster, liviana y económica para equipos de servicio y eventos.",
    material: "100% poliéster", tallas: "Única", plazo: "10 días (3 días si hay stock)", leadDays: 10, modalidad: "Fabricación a medida", baseCostUsd: 3,
    colors: ["Negro", "Azul", "Azulino", "Blanco", "Rojo", "Beige", "Rosado", "Café"],
    pricing: tramos({ 10: 6990, 25: 5990, 50: 5500, 100: 4990, 250: 4500 }), techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF, VINILO], areas: AREAS_DELANTAL,
  }),
  product({
    key: "PECHJ", handle: "pechera-jeans",
    title: "Pechera Jeans", category: "Delantales y Uniformes", catTag: "uniformes",
    intro: "Pechera de mezclilla (jeans), resistente y con estilo para cafeterías, baristas y retail.",
    material: "Jeans (mezclilla)", tallas: "Única", plazo: "3 a 7 días", leadDays: 7, modalidad: "Stock", baseCostUsd: 5,
    colors: ["Azul", "Negro"],
    pricing: tramos({ 10: 9990, 25: 9500, 50: 8990, 100: 8500, 250: 7990 }), techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF], areas: AREAS_DELANTAL,
  }),
  product({
    key: "CHEF", handle: "chaqueta-chef",
    title: "Chaqueta de Chef", category: "Delantales y Uniformes", catTag: "uniformes",
    intro: "Chaqueta de chef en gabardina o Polycron, prolija y resistente para cocinas profesionales. Múltiples combinaciones de color.",
    material: "Gabardina o Polycron", tallas: "XS a 3XL", plazo: "15 días (menos si hay stock)", leadDays: 15, modalidad: "Fabricación a medida", baseCostUsd: 9,
    colors: ["Blanco", "Negro", "Café", "Beige"],
    pricing: tramos({ 10: 19990, 25: 18990, 50: 17990, 100: 16990, 250: 15990 }), techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF], areas: [PECHO_IZQ, PECHO_CENTRO, MANGA],
  }),
  product({
    key: "MANDB", handle: "mandil-corto-basico",
    title: "Mandil Corto Básico", category: "Delantales y Uniformes", catTag: "uniformes",
    intro: "Mandil corto básico de poliéster, liviano para servicio, barismo y atención. Práctico y económico.",
    material: "Poliéster", tallas: "Única", plazo: "5 a 7 días", leadDays: 7, modalidad: "Stock", baseCostUsd: 3,
    colors: ["Negro", "Café", "Rojo"],
    pricing: tramos({ 10: 6990, 25: 6500, 50: 5990, 100: 5500, 250: 4990 }), techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF], areas: [PECHO_CENTRO],
  }),
  product({
    key: "MANDG", handle: "mandil-corto-grueso",
    title: "Mandil Corto Grueso", category: "Delantales y Uniformes", catTag: "uniformes",
    intro: "Mandil corto en gabardina Polycron, más grueso y resistente para uso intensivo en cocina y servicio.",
    material: "Gabardina / Polycron", tallas: "Única", plazo: "3 a 5 días (10 a 15 si se confecciona)", leadDays: 5, modalidad: "Stock", baseCostUsd: 4,
    colors: ["Negro", "Café", "Rojo"],
    pricing: tramos({ 10: 7990, 25: 7500, 50: 6990, 100: 6500, 250: 5990 }), techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF], areas: [PECHO_CENTRO],
  }),
  product({
    key: "MANDL", handle: "mandil-largo",
    title: "Mandil Largo", category: "Delantales y Uniformes", catTag: "uniformes",
    intro: "Mandil largo de poliéster o gabardina, cobertura completa para cocina y faena.",
    material: "Poliéster o gabardina", tallas: "Única", plazo: "3 a 5 días en stock / 10 días confección", leadDays: 10, modalidad: "Fabricación a medida", baseCostUsd: 4,
    nota: "El precio depende de la tela",
    colors: ["Negro", "Rojo", "Blanco", "Café", "Verde"],
    pricing: tramos({ 10: 8990, 25: 8500, 50: 7990, 100: 7500, 250: 6990 }), techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF], areas: AREAS_DELANTAL,
  }),
  product({
    key: "MANDLP", handle: "mandil-largo-poliester",
    title: "Mandil Largo Poliéster", category: "Delantales y Uniformes", catTag: "uniformes",
    intro: "Mandil largo en 100% poliéster, liviano y resistente para cocina y atención. Variante específica del Mandil Largo cuando se prefiere poliéster puro.",
    material: "100% poliéster", tallas: "Única", plazo: "10 a 15 días confección / 3 a 7 días si hay stock", leadDays: 12, modalidad: "Fabricación a medida", baseCostUsd: 3,
    colors: ["Negro", "Café", "Rojo", "Azul", "Blanco", "Verde", "Gris"],
    pricing: tramos({ 10: 7990, 25: 7500, 50: 6990, 100: 5990 }), techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF], areas: AREAS_DELANTAL,
  }),
  product({
    key: "GCHEF", handle: "gorro-chef",
    title: "Gorro de Chef", category: "Delantales y Uniformes", catTag: "uniformes",
    intro: "Gorro alto de chef en Polycron, el complemento clásico del uniforme de cocina. Acepta un color o combinación bicolor.",
    material: "Polycron", tallas: "Única", plazo: "10 a 15 días", leadDays: 15, modalidad: "Fabricación a medida", baseCostUsd: 3,
    nota: "Un color o bicolor a elección",
    colors: ["Blanco", "Negro"],
    pricing: tramos({ 10: 5990, 25: 5500, 50: 4900, 100: 4500, 250: 3990 }), techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF], areas: [PECHO_CENTRO],
  }),
  product({
    key: "COFIA", handle: "cofia",
    title: "Cofia", category: "Delantales y Uniformes", catTag: "uniformes",
    intro: "Cofia redonda con elástico, esencial en cocinas y faenas con normas de higiene. Disponible en un solo color o combinación bicolor.",
    material: "A confirmar al cotizar", tallas: "Única", plazo: "10 a 15 días confección / 3 a 6 días si hay stock", leadDays: 12, modalidad: "Fabricación a medida", baseCostUsd: 2,
    nota: "Un color o bicolor a elección",
    colors: ["Blanco", "Negro"],
    pricing: tramos({ 10: 4990, 25: 4500, 50: 3990, 100: 3500 }), techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF], areas: [PECHO_CENTRO],
  }),

  // === Jockey extra (variante para estampado) =============================
  // Va dentro del bloque Jockeys, pero se carga acá por orden de levantamiento.
  product({
    key: "JOCKGAB", handle: "jockey-gabardina-estampado",
    title: "Jockey Gabardina para Estampado", category: "Jockeys, Gorros y Accesorios", catTag: "gorros",
    intro: "Jockey 6 paneles en gabardina, con frente liso pensado especialmente para estampado o bordado prolijo. Variante específica para campañas con logo grande.",
    material: "Gabardina", tallas: "Única", plazo: "A confirmar al cotizar", leadDays: 7, modalidad: "Stock", baseCostUsd: 3,
    nota: "Disponible en todos los colores",
    colors: ["Beige", "Negro", "Blanco", "Azul marino", "Gris", "Rojo"],
    pricing: tramos({ 10: 4500, 25: 3500, 50: 3000, 100: 2500, 250: 2000 }), techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF], areas: AREAS_GORRO,
  }),

  // === Pantalones =========================================================
  // Levantamiento del 2026-06-22: tres modelos. Categoría "Otro" en el formulario;
  // en el sitio la llamamos "Pantalones" para que tenga sentido al usuario.
  product({
    key: "PCARGOG", handle: "pantalon-cargo-gabardina",
    title: "Pantalón Cargo Gabardina", category: "Pantalones", catTag: "pantalones",
    intro: "Pantalón cargo en gabardina, resistente y prolijo para faena, terreno y staff. Bolsillos laterales reforzados con amplia capacidad.",
    material: "Gabardina", tallas: "Cintura 38 a 58", plazo: "3 a 7 días", leadDays: 7, modalidad: "Stock", baseCostUsd: 8,
    nota: "Versión hombre y mujer · opción sin logo disponible",
    colors: ["Azul marino", "Negro", "Gris", "Beige"],
    pricing: tramos({ 10: 16500, 25: 15990, 50: 14990, 100: 13990, 250: 12990 }), techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF], areas: [PECHO_IZQ],
  }),
  product({
    key: "PDOCKER", handle: "pantalon-docker-gabardina",
    title: "Pantalón Recto Tipo Docker", category: "Pantalones", catTag: "pantalones",
    intro: "Pantalón gabardina de corte recto tipo docker, para uniforme formal/casual. Calce limpio y resistente al uso diario.",
    material: "Gabardina", tallas: "Cintura 38 a 58", plazo: "3 a 7 días", leadDays: 7, modalidad: "Stock", baseCostUsd: 8,
    nota: "Versión hombre y mujer (calce distinto) · opción sin logo disponible",
    colors: ["Azul marino", "Negro", "Gris", "Beige"],
    pricing: tramos({ 10: 16990, 25: 15990, 50: 14990, 100: 13990, 250: 12990 }), techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF], areas: [PECHO_IZQ],
  }),
  product({
    key: "PPOPLIN", handle: "pantalon-poplin-cargo",
    title: "Pantalón Cargo Poplin", category: "Pantalones", catTag: "pantalones",
    intro: "Pantalón cargo en poplin: más liviano y suave que la gabardina, ideal para climas templados y movilidad. Corte unisex moderno.",
    material: "Poplin", tallas: "S a 2XL", plazo: "3 a 7 días", leadDays: 7, modalidad: "Stock", baseCostUsd: 6,
    nota: "Modelo unisex",
    colors: ["Azul marino", "Gris", "Negro"],
    pricing: tramos({ 10: 11990, 25: 11990, 50: 11990, 100: 10500, 250: 9500 }), techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF], areas: [PECHO_IZQ],
  }),
  product({
    key: "JEANS", handle: "pantalon-jeans",
    title: "Pantalón Jeans", category: "Pantalones", catTag: "pantalones",
    intro: "Pantalón de mezclilla azul clásica, resistente y versátil. Para staff que necesita aguante con onda casual.",
    material: "Mezclilla azul", tallas: "Cintura 38 a 60", plazo: "3 a 7 días", leadDays: 7, modalidad: "Stock", baseCostUsd: 7,
    nota: "Hombre y mujer (calce distinto)",
    colors: ["Azul"],
    pricing: tramos({ 10: 15990, 25: 14990, 50: 13990, 100: 12990, 250: 11990 }), techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF], areas: [PECHO_IZQ],
  }),
  product({
    key: "POUTDOOR", handle: "pantalon-outdoor",
    title: "Pantalón Outdoor", category: "Pantalones", catTag: "pantalones",
    intro: "Pantalón outdoor en ripstop: técnico, liviano y resistente para terreno, expediciones y outdoor. Bolsillos utilitarios.",
    material: "Tela ripstop", tallas: "Cintura 38 a 60", plazo: "3 a 7 días", leadDays: 7, modalidad: "Stock", baseCostUsd: 12,
    nota: "Hombre y mujer separados",
    colors: ["Negro", "Gris", "Beige"],
    pricing: tramos({ 10: 25500, 25: 24990, 50: 24500, 100: 23500, 250: 22500 }), techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF], areas: [PECHO_IZQ],
  }),
  product({
    key: "PGSPANDEX", handle: "pantalon-gabardina-spandex",
    title: "Pantalón Gabardina Spandex", category: "Pantalones", catTag: "pantalones",
    intro: "Pantalón gabardina con spandex: el aliado del uniforme femenino que busca caída prolija y libertad de movimiento. Versión hombre también disponible.",
    material: "97% algodón · 3% spandex", tallas: "Cintura 36 a 58", plazo: "A confirmar al cotizar", leadDays: 7, modalidad: "Stock", baseCostUsd: 8,
    nota: "Modelo mujer (versión hombre también disponible)",
    colors: ["Azul marino", "Negro", "Gris", "Beige"],
    pricing: tramos({ 10: 16500, 25: 15990, 50: 14990, 100: 13990, 250: 12990 }), techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF], areas: [PECHO_IZQ],
  }),
  product({
    key: "PPINZA", handle: "pantalon-pinza-hombre",
    title: "Pantalón Pinza Hombre", category: "Pantalones", catTag: "pantalones",
    intro: "Pantalón formal de pinzas en algodón, el clásico de oficina y eventos formales. Calce tailored para uniforme ejecutivo.",
    material: "100% algodón", tallas: "Cintura 40 a 64", plazo: "3 a 7 días", leadDays: 7, modalidad: "Stock", baseCostUsd: 8,
    nota: "Modelo hombre",
    colors: ["Azul marino", "Negro", "Gris", "Beige"],
    pricing: tramos({ 10: 16500, 25: 15990, 50: 14990, 100: 13990, 250: 13500 }), techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF], areas: [PECHO_IZQ],
  }),
  product({
    key: "PFOPOLAR", handle: "pantalon-cargo-forro-polar",
    title: "Pantalón Cargo Forro Polar", category: "Pantalones", catTag: "pantalones",
    intro: "Pantalón cargo gabardina con forro polar interior: el aliado de invierno para faena, terreno y outdoor. Calienta sin restar movilidad.",
    material: "Gabardina con forro polar", tallas: "Cintura 40 a 60", plazo: "3 a 7 días", leadDays: 7, modalidad: "Stock", baseCostUsd: 10,
    nota: "Hombre y mujer (calce distinto)",
    colors: ["Azul marino", "Negro"],
    pricing: tramos({ 10: 15500, 25: 14500, 50: 13990, 100: 12990 }), techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF], areas: [PECHO_IZQ],
  }),
];

export function mockProductByHandle(handle: string): CorporateProduct | null {
  return mockCorporateProducts.find((p) => p.handle === handle) ?? null;
}
