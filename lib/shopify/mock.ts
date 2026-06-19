import type { CorporateProduct, PrintArea, PrintTechnique, ShopifyImage } from "./types";

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
// Precios base alineados a lo que declaró la clienta (Serigrafía $1.000,
// Bordado $3.000, DTF $3.000 por prenda). Extras por zona/setup DE REFERENCIA.

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
  availableAreaIds: ["pecho_izq", "pecho_centro", "espalda", "manga", "bolsa_cara", "gorro_frente", "gorro_lateral"],
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
  availableAreaIds: ["pecho_izq", "pecho_centro", "espalda", "manga", "bolsa_cara", "gorro_frente", "gorro_lateral"],
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
  availableAreaIds: ["pecho_izq", "pecho_centro", "espalda", "manga", "gorro_frente", "gorro_lateral"],
};

const SUBLIMACION: PrintTechnique = {
  id: "sublimacion",
  label: "Sublimación",
  description:
    "Impresión total integrada a la tela (poliéster claro) o al accesorio. Colores vivos que no se despegan.",
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

// Conjuntos de zonas reutilizables
const AREAS_PRENDA = [PECHO_IZQ, PECHO_CENTRO, ESPALDA, MANGA];
const AREAS_CAMISA = [PECHO_IZQ, ESPALDA, MANGA];
const AREAS_GORRO = [GORRO_FRENTE, GORRO_LATERAL];
const AREAS_DELANTAL = [PECHO_CENTRO, PECHO_IZQ];

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
 * Tabla de descuentos por volumen derivada del RANGO de precio por unidad
 * (tope/piso) que entregó la clienta + "sobre 50 baja harto el precio".
 * Precios netos de referencia hasta cerrar la cotización.
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
  modalidad: "Stock express" | "Fabricación a medida";
  colors: string[];
  priceHigh: number;
  priceLow: number;
  techniques: PrintTechnique[];
  areas: PrintArea[];
  minimo?: number;
  nota?: string;
  baseCostUsd?: number;
};

function product(o: ProductInput): CorporateProduct {
  const minimo = o.minimo ?? 10;
  const modalidadTag = o.modalidad === "Fabricación a medida" ? "fabricacion" : "stock-express";
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
    variants: makeVariants(o.key, o.priceHigh, specsFromColors(o.key, o.colors), o.handle),
    minQty: minimo,
    leadTimeDaysReorder: o.leadDays,
    baseCostUsd: o.baseCostUsd ?? 6,
    volumePricing: rangePricing(o.priceHigh, o.priceLow),
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
    modalidad: "Stock express", nota: "Elige versión hombre o mujer",
    colors: ["Azul marino", "Negro", "Rojo", "Blanco", "Azulino", "Gris", "Amarillo", "Naranjo", "Verde"],
    priceHigh: 12990, priceLow: 9990, techniques: [BORDADO, SERIGRAFIA_1C, TRANSFER_DTF, VINILO], areas: AREAS_PRENDA,
  }),
  product({
    key: "PIQML", handle: "polera-pique-cuello-botones-manga-larga",
    title: "Polera Piqué Cuello y Botones M/L", category: "Poleras", catTag: "poleras",
    intro: "La polo piqué de uniforme en manga larga, para climas fríos o un look más formal. Cuello y puños tejidos, lista para tu marca.",
    material: "80% algodón · 20% poliéster (piqué)", tallas: "S a 3XL", plazo: "5 a 7 días", leadDays: 7,
    modalidad: "Stock express", nota: "Elige versión hombre o mujer",
    colors: ["Negro", "Gris", "Blanco", "Azul marino", "Azulino", "Rojo"],
    priceHigh: 13990, priceLow: 10990, techniques: [BORDADO, SERIGRAFIA_1C, TRANSFER_DTF, VINILO], areas: AREAS_PRENDA,
  }),
  product({
    key: "CRMC", handle: "polera-cuello-redondo-manga-corta",
    title: "Polera Cuello Redondo M/C", category: "Poleras", catTag: "poleras",
    intro: "Polera cuello redondo 100% algodón, la prenda más rendidora para eventos, activaciones y equipos — y la que más colores ofrece del catálogo.",
    material: "100% algodón", tallas: "XS a 3XL", plazo: "3 a 4 días", leadDays: 4, modalidad: "Stock express",
    colors: ["Blanco", "Negro", "Gris", "Azulino", "Azul marino", "Celeste", "Rojo", "Naranjo", "Rosado", "Fucsia", "Amarillo", "Verde militar", "Verde agua", "Verde manzana", "Café", "Beige"],
    priceHigh: 12990, priceLow: 6990, techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF, VINILO], areas: AREAS_PRENDA,
  }),
  product({
    key: "CRML", handle: "polera-cuello-redondo-manga-larga",
    title: "Polera Cuello Redondo M/L", category: "Poleras", catTag: "poleras",
    intro: "Polera cuello redondo 100% algodón en manga larga: la misma versatilidad, con más abrigo para el día a día.",
    material: "100% algodón", tallas: "XS a 3XL", plazo: "3 a 5 días", leadDays: 5, modalidad: "Stock express",
    colors: ["Azul marino", "Negro", "Blanco", "Azulino", "Gris", "Rojo"],
    priceHigh: 13500, priceLow: 8500, techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF, VINILO], areas: AREAS_PRENDA,
  }),
  product({
    key: "DRYF", handle: "polera-dry-fit-cuello-redondo",
    title: "Polera Dry-Fit Cuello Redondo", category: "Poleras", catTag: "poleras",
    intro: "Polera deportiva dry fit de secado rápido para corridas, clubes y team building. Poliéster respirable que rinde todo el día.",
    material: "100% poliéster (dry fit)", tallas: "Talla 8 a 3XL", plazo: "5 a 7 días hábiles", leadDays: 7, modalidad: "Stock express",
    colors: ["Naranjo", "Negro", "Rojo", "Azul marino", "Azulino", "Blanco", "Gris", "Rosado", "Calypso"],
    priceHigh: 15990, priceLow: 8990, techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF], areas: AREAS_PRENDA,
  }),
  product({
    key: "DRYFB", handle: "polera-dry-fit-cuello-botones",
    title: "Polera Dry-Fit Cuello y Botones", category: "Poleras", catTag: "poleras",
    intro: "Polo deportiva dry fit con cuello y botones: el punto medio entre lo técnico y lo formal, para terreno y staff en movimiento.",
    material: "100% poliéster (dry fit)", tallas: "S a 2XL", plazo: "A confirmar al cotizar", leadDays: 7, modalidad: "Stock express",
    colors: ["Rojo", "Negro", "Gris", "Blanco", "Naranjo", "Calypso", "Azul marino", "Azulino"],
    priceHigh: 16990, priceLow: 8500, techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF], areas: AREAS_PRENDA,
  }),
  product({
    key: "OVER", handle: "polera-oversize",
    title: "Polera Oversize", category: "Poleras", catTag: "poleras",
    intro: "Polera de corte oversize, el calce urbano que piden los equipos jóvenes. Caída holgada y amplia superficie para estampados grandes.",
    material: "A confirmar al cotizar", tallas: "XS a 2XL", plazo: "5 a 7 días", leadDays: 7, modalidad: "Stock express",
    colors: ["Beige", "Negro", "Blanco", "Gris"],
    priceHigh: 17500, priceLow: 11500, techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF, VINILO], areas: AREAS_PRENDA,
  }),

  // === Polerones y Polar ===================================================
  product({
    key: "POLARML", handle: "polar-manga-larga",
    title: "Polar Manga Larga", category: "Polerones y Polar", catTag: "polerones",
    intro: "Polar micropolar antipilling 300 g con manga larga, pretina ajustable y puños elasticados. Abrigo liviano para faena, oficina y terreno.",
    material: "100% poliéster · micropolar antipilling 300 g · pretina ajustable y puños elasticados", tallas: "XS a 3XL", plazo: "3 a 7 días", leadDays: 7,
    modalidad: "Stock express", nota: "Elige versión hombre o mujer", baseCostUsd: 12,
    colors: ["Azul marino", "Negro", "Azulino", "Rojo", "Beige", "Verde botella", "Gris"],
    priceHigh: 20500, priceLow: 15500, techniques: [BORDADO], areas: [PECHO_IZQ, PECHO_CENTRO, MANGA],
  }),
  product({
    key: "POLARSM", handle: "polar-sin-manga",
    title: "Polar Sin Mangas", category: "Polerones y Polar", catTag: "polerones",
    intro: "Chaleco polar sin mangas, la capa intermedia perfecta para uniformes de invierno. Abriga el torso sin restar movilidad.",
    material: "100% poliéster", tallas: "XS a 2XL", plazo: "A confirmar al cotizar", leadDays: 7, modalidad: "Stock express", baseCostUsd: 10,
    colors: ["Verde", "Negro", "Azul marino", "Gris"],
    priceHigh: 16500, priceLow: 12500, techniques: [BORDADO], areas: [PECHO_IZQ, PECHO_CENTRO],
  }),
  product({
    key: "POLO", handle: "poleron-polo-cuello-redondo",
    title: "Polerón Polo Cuello Redondo", category: "Polerones y Polar", catTag: "polerones",
    intro: "Polerón cuello redondo en mezcla algodón-poliéster, suave por dentro y resistente al uso diario. El básico de invierno que une comodidad y marca.",
    material: "70% algodón · 30% poliéster", tallas: "XS a 3XL", plazo: "A confirmar al cotizar", leadDays: 7, modalidad: "Stock express", baseCostUsd: 10,
    colors: ["Gris", "Negro", "Azul marino", "Azulino", "Blanco", "Rojo", "Naranjo", "Beige", "Lila", "Rosado", "Verde"],
    priceHigh: 16990, priceLow: 12500, techniques: [BORDADO, SERIGRAFIA_1C, TRANSFER_DTF, VINILO], areas: AREAS_PRENDA,
  }),
  product({
    key: "CANGURO", handle: "poleron-canguro",
    title: "Polerón Canguro", category: "Polerones y Polar", catTag: "polerones",
    intro: "Hoodie con bolsillo canguro y gorro, el favorito de startups, universidades y equipos jóvenes. Amplio lienzo al frente y la espalda para tu logo.",
    material: "70% algodón · 20% poliéster", tallas: "Talla 6 a 3XL", plazo: "3 a 7 días hábiles", leadDays: 7, modalidad: "Stock express", baseCostUsd: 11,
    colors: ["Azul marino", "Negro", "Gris", "Blanco", "Azulino", "Celeste", "Rojo", "Morado", "Naranjo", "Amarillo", "Rosado", "Fucsia", "Verde agua", "Verde manzana", "Verde militar", "Beige"],
    priceHigh: 18990, priceLow: 13990, techniques: [BORDADO, SERIGRAFIA_1C, TRANSFER_DTF, VINILO], areas: AREAS_PRENDA,
  }),
  product({
    key: "CIERRE", handle: "poleron-cierre-gorro",
    title: "Polerón con Cierre y Gorro", category: "Polerones y Polar", catTag: "polerones",
    intro: "Polerón con cierre completo y gorro. Versátil para el uniforme diario y cómodo de poner y sacar; bordado al pecho impecable.",
    material: "70% algodón · 30% poliéster", tallas: "XS a 3XL", plazo: "3 a 5 días", leadDays: 5, modalidad: "Stock express", baseCostUsd: 11,
    colors: ["Negro", "Azulino", "Azul marino", "Gris", "Rojo"],
    priceHigh: 19500, priceLow: 14500, techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF, VINILO], areas: AREAS_PRENDA,
  }),

  // === Camisas y Blusas ====================================================
  product({
    key: "OXFH", handle: "camisa-oxford",
    title: "Camisa Oxford", category: "Camisas y Blusas", catTag: "camisas",
    intro: "Camisa Oxford clásica de uniforme ejecutivo. Acabado prolijo y elegante, ideal para bordar el logo al pecho.",
    material: "Tela Oxford", tallas: "S a 3XL", plazo: "A confirmar al cotizar", leadDays: 7, modalidad: "Stock express", baseCostUsd: 9,
    colors: ["Celeste", "Blanco", "Gris", "Negro"],
    priceHigh: 16990, priceLow: 13990, techniques: [BORDADO, TRANSFER_DTF], areas: AREAS_CAMISA,
  }),
  product({
    key: "OXFM", handle: "blusa-oxford",
    title: "Blusa Oxford", category: "Camisas y Blusas", catTag: "camisas",
    intro: "Blusa Oxford de corte femenino, elegante y cómoda para uniforme corporativo. Calce prolijo para la oficina.",
    material: "Tela Oxford", tallas: "S a 2XL", plazo: "A confirmar al cotizar", leadDays: 7, modalidad: "Stock express", baseCostUsd: 9,
    colors: ["Celeste", "Blanco", "Rosado", "Negro", "Gris"],
    priceHigh: 16990, priceLow: 12990, techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF], areas: AREAS_CAMISA,
  }),
  product({
    key: "JEANSH", handle: "camisa-jeans",
    title: "Camisa Jeans", category: "Camisas y Blusas", catTag: "camisas",
    intro: "Camisa de mezclilla (jeans) para un uniforme con onda casual. Resistente y versátil, va con todo.",
    material: "A confirmar al cotizar", tallas: "S a 2XL", plazo: "3 a 7 días", leadDays: 7, modalidad: "Stock express", baseCostUsd: 9,
    colors: ["Azul jeans"],
    priceHigh: 18500, priceLow: 14500, techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF], areas: AREAS_CAMISA,
  }),
  product({
    key: "JEANSM", handle: "blusa-jeans",
    title: "Blusa Jeans", category: "Camisas y Blusas", catTag: "camisas",
    intro: "Blusa de mezclilla (jeans) de corte femenino. Estilo casual y resistente para equipos con personalidad.",
    material: "A confirmar al cotizar", tallas: "S a 2XL", plazo: "3 a 7 días", leadDays: 7, modalidad: "Stock express", baseCostUsd: 9,
    colors: ["Azul jeans"],
    priceHigh: 17990, priceLow: 13990, techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF], areas: AREAS_CAMISA,
  }),
  product({
    key: "OUTH", handle: "camisa-outdoor",
    title: "Camisa Outdoor", category: "Camisas y Blusas", catTag: "camisas",
    intro: "Camisa outdoor en tela ripstop, resistente y liviana para terreno y actividades al aire libre. Bolsillos utilitarios.",
    material: "Tela ripstop", tallas: "S a 2XL", plazo: "A confirmar al cotizar", leadDays: 7, modalidad: "Stock express", baseCostUsd: 11,
    colors: ["Beige", "Azul", "Gris", "Blanco", "Negro"],
    priceHigh: 25990, priceLow: 21990, techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF], areas: AREAS_CAMISA,
  }),
  product({
    key: "OUTM", handle: "blusa-outdoor",
    title: "Blusa Outdoor", category: "Camisas y Blusas", catTag: "camisas",
    intro: "Blusa outdoor en tela ripstop de corte femenino. Liviana y resistente para terreno y outdoor.",
    material: "Tela ripstop", tallas: "S a 2XL", plazo: "A confirmar al cotizar", leadDays: 7, modalidad: "Stock express", baseCostUsd: 11,
    colors: ["Gris", "Negro", "Beige", "Azul", "Blanco"],
    priceHigh: 25990, priceLow: 21990, techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF], areas: AREAS_CAMISA,
  }),

  // === Ropa Técnica y Cortavientos =========================================
  product({
    key: "SSHH", handle: "softshell-hombre",
    title: "Softshell Hombre", category: "Ropa Técnica y Cortavientos", catTag: "tecnica",
    intro: "Softshell de hombre cortaviento y repelente al agua, con interior abrigado. La chaqueta técnica para gerencia y terreno.",
    material: "A confirmar al cotizar", tallas: "S a 3XL", plazo: "3 a 7 días", leadDays: 7, modalidad: "Stock express", baseCostUsd: 16,
    colors: ["Azul marino", "Negro", "Rojo", "Gris"],
    priceHigh: 28500, priceLow: 22500, techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF], areas: AREAS_CAMISA,
  }),
  product({
    key: "SSHM", handle: "softshell-mujer",
    title: "Softshell Mujer", category: "Ropa Técnica y Cortavientos", catTag: "tecnica",
    intro: "Softshell de mujer cortaviento y repelente al agua, con interior abrigado. Calce femenino para oficina y terreno.",
    material: "A confirmar al cotizar", tallas: "S a 3XL", plazo: "3 a 7 días", leadDays: 7, modalidad: "Stock express", baseCostUsd: 16,
    nota: "Disponible hombre y mujer",
    colors: ["Negro", "Azul", "Rojo", "Gris"],
    priceHigh: 28990, priceLow: 21990, techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF], areas: AREAS_CAMISA,
  }),
  product({
    key: "SSSV", handle: "softshell-sin-manga",
    title: "Softshell Sin Mangas", category: "Ropa Técnica y Cortavientos", catTag: "tecnica",
    intro: "Softshell sin mangas: abrigo cortaviento para el torso sin restar movilidad. Ideal como capa media del uniforme.",
    material: "A confirmar al cotizar", tallas: "S a 2XL", plazo: "3 a 5 días", leadDays: 5, modalidad: "Stock express", baseCostUsd: 14,
    colors: ["Negro", "Rojo", "Azul", "Gris"],
    priceHigh: 27500, priceLow: 21500, techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF], areas: [PECHO_IZQ, PECHO_CENTRO, ESPALDA],
  }),
  product({
    key: "CORTAV", handle: "cortavientos",
    title: "Cortavientos", category: "Ropa Técnica y Cortavientos", catTag: "tecnica",
    intro: "Cortavientos liviano en tela taslan, perfecto para activaciones, eventos al aire libre y equipos en movimiento.",
    material: "Taslan", tallas: "XS a 2XL", plazo: "3 a 7 días", leadDays: 7, modalidad: "Stock express", baseCostUsd: 10,
    nota: "Elige hombre, mujer o unisex",
    colors: ["Azul marino", "Azulino", "Blanco", "Verde", "Rojo", "Negro"],
    priceHigh: 22990, priceLow: 13990, techniques: [BORDADO, SERIGRAFIA_1C, TRANSFER_DTF], areas: AREAS_CAMISA,
  }),

  // === Jockeys, Gorros y Accesorios ========================================
  product({
    key: "JOCKEY", handle: "jockey",
    title: "Jockey", category: "Jockeys, Gorros y Accesorios", catTag: "gorros",
    intro: "Jockey de 6 paneles, el merchandising que más circula: tu logo bordado al frente, a la vista todo el día. Varias calidades de tela.",
    material: "Algodón, denim o gabardina (distintas calidades y precios)", tallas: "Única", plazo: "A confirmar al cotizar", leadDays: 7, modalidad: "Stock express", baseCostUsd: 3,
    colors: ["Negro", "Rojo", "Gris", "Azul", "Azulino", "Naranjo", "Verde", "Amarillo"],
    priceHigh: 7990, priceLow: 3990, techniques: [BORDADO, SERIGRAFIA_1C, TRANSFER_DTF], areas: AREAS_GORRO,
  }),
  product({
    key: "GORROL", handle: "gorro-lana",
    title: "Gorro de Lana", category: "Jockeys, Gorros y Accesorios", catTag: "gorros",
    intro: "Gorro de lana tejido, infaltable en kits de invierno y marcas outdoor. Cálido y con vuelta para bordar.",
    material: "100% lana", tallas: "Única", plazo: "A confirmar al cotizar", leadDays: 7, modalidad: "Stock express", baseCostUsd: 2,
    colors: ["Gris", "Azul", "Azulino", "Negro", "Rojo", "Fucsia", "Rosa"],
    priceHigh: 6990, priceLow: 3990, techniques: [BORDADO], areas: [GORRO_FRENTE],
  }),
  product({
    key: "BUCKET", handle: "bucket-hat",
    title: "Bucket Hat", category: "Jockeys, Gorros y Accesorios", catTag: "gorros",
    intro: "Bucket hat, el accesorio de moda para activaciones y equipos jóvenes. Amplia superficie para tu marca.",
    material: "A confirmar al cotizar", tallas: "Única", plazo: "3 a 7 días", leadDays: 7, modalidad: "Stock express", baseCostUsd: 3,
    colors: ["Negro", "Gris", "Azul", "Beige"],
    priceHigh: 7500, priceLow: 4500, techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF, VINILO], areas: AREAS_GORRO,
  }),
  product({
    key: "SAFARI", handle: "gorro-safari",
    title: "Gorro Safari", category: "Jockeys, Gorros y Accesorios", catTag: "gorros",
    intro: "Gorro safari de ala ancha, ideal para terreno, turismo y outdoor. Protege del sol y luce tu logo.",
    material: "A confirmar al cotizar", tallas: "Única", plazo: "3 a 7 días", leadDays: 7, modalidad: "Stock express", baseCostUsd: 3,
    colors: ["Beige", "Verde militar", "Negro"],
    priceHigh: 8500, priceLow: 4500, techniques: [BORDADO, VINILO, TRANSFER_DTF, SERIGRAFIA_1C], areas: AREAS_GORRO,
  }),
  product({
    key: "GPOLAR", handle: "gorro-polar",
    title: "Gorro Polar", category: "Jockeys, Gorros y Accesorios", catTag: "gorros",
    intro: "Gorro polar de poliéster, abrigado y suave para el invierno. Bordado prolijo al frente.",
    material: "Poliéster polar", tallas: "Única", plazo: "3 a 7 días", leadDays: 7, modalidad: "Stock express", baseCostUsd: 2,
    colors: ["Negro", "Azulino", "Azul", "Rojo"],
    priceHigh: 7500, priceLow: 3500, techniques: [BORDADO], areas: [GORRO_FRENTE],
  }),
  product({
    key: "BANDANA", handle: "bandanas",
    title: "Bandanas", category: "Jockeys, Gorros y Accesorios", catTag: "gorros",
    intro: "Bandanas confeccionadas a medida con tu logo en sublimación full color. Accesorio versátil para eventos y staff.",
    material: "A confirmar al cotizar", tallas: "Única", plazo: "7 a 12 días", leadDays: 12, modalidad: "Fabricación a medida", minimo: 30, baseCostUsd: 2,
    nota: "Se confecciona a medida con tu logo",
    colors: ["Negro"],
    priceHigh: 6500, priceLow: 3500, techniques: [SUBLIMACION], areas: [PECHO_CENTRO],
  }),

  // === Delantales y Uniformes ==============================================
  product({
    key: "PECH", handle: "pechera",
    title: "Pechera", category: "Delantales y Uniformes", catTag: "uniformes",
    intro: "Pechera de Polycron o gabardina, resistente para cocina, retail y servicio. Se confecciona a medida con tu marca.",
    material: "Polycron o gabardina", tallas: "Única", plazo: "10 a 12 días (menos si hay stock)", leadDays: 12, modalidad: "Fabricación a medida", baseCostUsd: 5,
    colors: ["Negro", "Rojo", "Blanco", "Café", "Rosado", "Beige", "Verde"],
    priceHigh: 15990, priceLow: 9990, techniques: [BORDADO, SERIGRAFIA_1C, TRANSFER_DTF], areas: AREAS_DELANTAL,
  }),
  product({
    key: "PECHB", handle: "pechera-basica",
    title: "Pechera Básica", category: "Delantales y Uniformes", catTag: "uniformes",
    intro: "Pechera básica de poliéster, liviana y económica para equipos de servicio y eventos.",
    material: "100% poliéster", tallas: "Única", plazo: "10 días (3 días si hay stock)", leadDays: 10, modalidad: "Fabricación a medida", baseCostUsd: 3,
    colors: ["Negro", "Azul", "Azulino", "Blanco", "Rojo", "Beige", "Rosado", "Café"],
    priceHigh: 9990, priceLow: 6900, techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF, VINILO], areas: AREAS_DELANTAL,
  }),
  product({
    key: "PECHJ", handle: "pechera-jeans",
    title: "Pechera Jeans", category: "Delantales y Uniformes", catTag: "uniformes",
    intro: "Pechera de mezclilla (jeans), resistente y con estilo para cafeterías, baristas y retail.",
    material: "Jeans (mezclilla)", tallas: "Única", plazo: "3 a 7 días", leadDays: 7, modalidad: "Stock express", baseCostUsd: 5,
    colors: ["Azul", "Negro"],
    priceHigh: 16500, priceLow: 12500, techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF], areas: AREAS_DELANTAL,
  }),
  product({
    key: "CHEF", handle: "chaqueta-chef",
    title: "Chaqueta de Chef", category: "Delantales y Uniformes", catTag: "uniformes",
    intro: "Chaqueta de chef en gabardina o Polycron, prolija y resistente para cocinas profesionales. Múltiples combinaciones de color.",
    material: "Gabardina o Polycron", tallas: "XS a 3XL", plazo: "15 días (menos si hay stock)", leadDays: 15, modalidad: "Fabricación a medida", baseCostUsd: 9,
    colors: ["Blanco", "Negro", "Café", "Beige"],
    priceHigh: 25500, priceLow: 18990, techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF], areas: [PECHO_IZQ, PECHO_CENTRO, MANGA],
  }),
  product({
    key: "MANDB", handle: "mandil-corto-basico",
    title: "Mandil Corto Básico", category: "Delantales y Uniformes", catTag: "uniformes",
    intro: "Mandil corto básico de poliéster, liviano para servicio, barismo y atención. Práctico y económico.",
    material: "Poliéster", tallas: "Única", plazo: "5 a 7 días", leadDays: 7, modalidad: "Stock express", baseCostUsd: 3,
    colors: ["Negro", "Café", "Rojo"],
    priceHigh: 8990, priceLow: 5990, techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF], areas: [PECHO_CENTRO],
  }),
  product({
    key: "MANDG", handle: "mandil-corto-grueso",
    title: "Mandil Corto Grueso", category: "Delantales y Uniformes", catTag: "uniformes",
    intro: "Mandil corto en gabardina Polycron, más grueso y resistente para uso intensivo en cocina y servicio.",
    material: "Gabardina / Polycron", tallas: "Única", plazo: "3 a 5 días (10 a 15 si se confecciona)", leadDays: 5, modalidad: "Stock express", baseCostUsd: 4,
    colors: ["Negro", "Café", "Rojo"],
    priceHigh: 9990, priceLow: 6990, techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF], areas: [PECHO_CENTRO],
  }),
  product({
    key: "MANDL", handle: "mandil-largo",
    title: "Mandil Largo", category: "Delantales y Uniformes", catTag: "uniformes",
    intro: "Mandil largo de poliéster o gabardina, cobertura completa para cocina y faena.",
    material: "Poliéster o gabardina", tallas: "Única", plazo: "3 a 5 días en stock / 10 días confección", leadDays: 10, modalidad: "Fabricación a medida", baseCostUsd: 4,
    nota: "El precio depende de la tela",
    colors: ["Negro", "Rojo", "Blanco", "Café", "Verde"],
    priceHigh: 10990, priceLow: 6990, techniques: [SERIGRAFIA_1C, BORDADO, TRANSFER_DTF], areas: AREAS_DELANTAL,
  }),
];

export function mockProductByHandle(handle: string): CorporateProduct | null {
  return mockCorporateProducts.find((p) => p.handle === handle) ?? null;
}
