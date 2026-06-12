import type { CorporateProduct, PrintArea, PrintTechnique, ShopifyImage } from "./types";

/**
 * Mock data del catálogo de Ropa Publicitaria Chile.
 *
 * Activado con USE_MOCK_PRODUCTS=true. Productos y categorías REALES del
 * cliente (relevados de ropapublicitariachile.cl el 2026-06-12); los PRECIOS
 * y tramos por volumen son DE REFERENCIA — el sitio muestra un aviso de demo
 * hasta cargar los SKUs/precios finales que entregue el cliente.
 *
 * Schema idéntico a CorporateProduct para que el switch a datos reales
 * (Shopify o catálogo propio) sea solo en storefront.ts.
 */

// --- Técnicas de personalización ---------------------------------------------
// Las del rubro textil publicitario. Costos unitarios/setup DE REFERENCIA.

const BORDADO: PrintTechnique = {
  id: "bordado",
  label: "Bordado",
  description:
    "El acabado más durable y premium para vestuario corporativo. Ideal para logos al pecho, gorros y poleras piqué.",
  basePriceUnit: 1990,
  extraPositionPrice: 1490,
  setupFee: 35000,
  extraLeadDays: 7,
  availableAreaIds: ["pecho_izq", "pecho_centro", "manga", "gorro_frente", "gorro_lateral"],
};

const SERIGRAFIA_1C: PrintTechnique = {
  id: "serigrafia_1c",
  label: "Serigrafía 1 color",
  description:
    "Económica y resistente para tirajes grandes. Ideal para logos de 1 a 2 colores planos.",
  basePriceUnit: 790,
  extraPositionPrice: 590,
  setupFee: 30000,
  extraLeadDays: 5,
  availableAreaIds: ["pecho_izq", "pecho_centro", "espalda", "manga", "bolsa_cara"],
};

const SERIGRAFIA_FULL: PrintTechnique = {
  id: "serigrafia_full",
  label: "Serigrafía full color",
  description:
    "Para artes con varios colores o degradados en tirajes grandes. Mayor setup, gran fidelidad.",
  basePriceUnit: 1490,
  extraPositionPrice: 990,
  setupFee: 65000,
  extraLeadDays: 8,
  availableAreaIds: ["pecho_centro", "espalda", "bolsa_cara"],
};

const TRANSFER_DTF: PrintTechnique = {
  id: "transfer_dtf",
  label: "Transfer DTF",
  description:
    "Full color con gran detalle en cualquier tela, sin costo de setup. Recomendado para tirajes pequeños y medianos.",
  basePriceUnit: 1190,
  extraPositionPrice: 790,
  setupFee: 0,
  extraLeadDays: 3,
  availableAreaIds: ["pecho_izq", "pecho_centro", "espalda", "manga", "bolsa_cara"],
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

// --- Imágenes placeholder -----------------------------------------------------
// Neutras con la paleta del sitio; se reemplazan por las fotos de estudio
// del catálogo real del cliente.

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
  stockTier: "high" | "low" = "high",
) {
  return specs.map(({ color, sku }) => ({
    id: `rpc_var_${productKey}_${sku.toLowerCase()}_${stockTier}`,
    title: color,
    sku,
    selectedOptions: [{ name: "Color", value: color }],
    priceRetail: { amount: retailClp, currencyCode: "CLP" as const },
    image: placeholderImage(`${color}`),
    availableForSale: true,
  }));
}

// --- Catálogo -----------------------------------------------------------------
// Categorías reales del sitio del cliente: Poleras · Polerones y Polar ·
// Camisas · Pantalones y Ropa Técnica · Jockeys y Gorros · Merchandising.

export const mockCorporateProducts: CorporateProduct[] = [
  {
    id: "rpc_polera_pique",
    handle: "polera-pique-premium",
    title: "Polera Piqué Premium",
    vendor: "Ropa Publicitaria Chile",
    category: "Poleras",
    description:
      "La clásica polera polo de uniforme corporativo. Piqué 220 g, cuello y puños tejidos. El lienzo perfecto para tu logo bordado al pecho.",
    descriptionHtml:
      "<p>La clásica polera polo de uniforme corporativo. Piqué 220 g, cuello y puños tejidos. El lienzo perfecto para tu logo bordado al pecho.</p><p>Curva de tallas XS a 3XL — se define al cerrar la cotización.</p>",
    featuredImage: placeholderImage("Polera Piqué"),
    images: [placeholderImage("Piqué Frente"), placeholderImage("Piqué Espalda")],
    variants: makeVariants("pique", 12990, [
      { color: "Blanco", sku: "RPC-PIQ-BL" },
      { color: "Negro", sku: "RPC-PIQ-NG" },
      { color: "Azul Marino", sku: "RPC-PIQ-AZ" },
      { color: "Rojo", sku: "RPC-PIQ-RJ" },
    ]),
    minQty: 30,
    leadTimeDaysReorder: 45,
    baseCostUsd: 4.5,
    volumePricing: [
      { minQty: 30, unitPriceNet: 8990 },
      { minQty: 50, unitPriceNet: 7990 },
      { minQty: 100, unitPriceNet: 6990 },
      { minQty: 250, unitPriceNet: 5990 },
      { minQty: 500, unitPriceNet: 5290 },
    ],
    printAreas: [PECHO_IZQ, ESPALDA, MANGA],
    printTechniques: [BORDADO, SERIGRAFIA_1C, TRANSFER_DTF],
    tags: ["CORPORATIVO", "poleras", "stock-express"],
  },
  {
    id: "rpc_polera_algodon",
    handle: "polera-algodon-promocional",
    title: "Polera Algodón Promocional",
    vendor: "Ropa Publicitaria Chile",
    category: "Poleras",
    description:
      "Polera 100% algodón peinado 160 g para activaciones, eventos y equipos. La opción más rendidora para tirajes grandes.",
    descriptionHtml:
      "<p>Polera 100% algodón peinado 160 g para activaciones, eventos y equipos. La opción más rendidora para tirajes grandes.</p>",
    featuredImage: placeholderImage("Polera Algodón"),
    images: [placeholderImage("Algodón Frente"), placeholderImage("Algodón Espalda")],
    variants: makeVariants("algodon", 7990, [
      { color: "Blanco", sku: "RPC-ALG-BL" },
      { color: "Negro", sku: "RPC-ALG-NG" },
      { color: "Gris Melange", sku: "RPC-ALG-GM" },
    ]),
    minQty: 50,
    leadTimeDaysReorder: 40,
    baseCostUsd: 2.4,
    volumePricing: [
      { minQty: 50, unitPriceNet: 4990 },
      { minQty: 100, unitPriceNet: 4290 },
      { minQty: 250, unitPriceNet: 3690 },
      { minQty: 500, unitPriceNet: 3190 },
      { minQty: 1000, unitPriceNet: 2790 },
    ],
    printAreas: [PECHO_CENTRO, PECHO_IZQ, ESPALDA],
    printTechniques: [SERIGRAFIA_1C, SERIGRAFIA_FULL, TRANSFER_DTF],
    tags: ["CORPORATIVO", "poleras", "stock-express"],
  },
  {
    id: "rpc_polera_dryfit",
    handle: "polera-dry-fit",
    title: "Polera Dry-Fit Deportiva",
    vendor: "Ropa Publicitaria Chile",
    category: "Poleras",
    description:
      "Poliéster respirable de secado rápido para corridas, clubes y team building. Sublimable a todo color.",
    descriptionHtml:
      "<p>Poliéster respirable de secado rápido para corridas, clubes y team building. Sublimable a todo color.</p>",
    featuredImage: placeholderImage("Polera Dry-Fit"),
    images: [placeholderImage("Dry-Fit Frente"), placeholderImage("Dry-Fit Espalda")],
    variants: makeVariants("dryfit", 8990, [
      { color: "Blanco", sku: "RPC-DRY-BL" },
      { color: "Azul Rey", sku: "RPC-DRY-AZ" },
      { color: "Verde Limón", sku: "RPC-DRY-VL" },
    ]),
    minQty: 50,
    leadTimeDaysReorder: 50,
    baseCostUsd: 3.1,
    volumePricing: [
      { minQty: 50, unitPriceNet: 5990 },
      { minQty: 100, unitPriceNet: 5290 },
      { minQty: 250, unitPriceNet: 4590 },
      { minQty: 500, unitPriceNet: 3990 },
    ],
    printAreas: [PECHO_CENTRO, ESPALDA, MANGA],
    printTechniques: [SUBLIMACION, TRANSFER_DTF, SERIGRAFIA_1C],
    tags: ["CORPORATIVO", "poleras", "fabricacion"],
  },
  {
    id: "rpc_poleron_canguro",
    handle: "poleron-canguro",
    title: "Polerón Canguro",
    vendor: "Ropa Publicitaria Chile",
    category: "Polerones y Polar",
    description:
      "Hoodie de franela perchada 320 g con bolsillo canguro. El favorito de startups, universidades y equipos jóvenes.",
    descriptionHtml:
      "<p>Hoodie de franela perchada 320 g con bolsillo canguro. El favorito de startups, universidades y equipos jóvenes.</p>",
    featuredImage: placeholderImage("Polerón Canguro"),
    images: [placeholderImage("Canguro Frente"), placeholderImage("Canguro Espalda")],
    variants: makeVariants("canguro", 24990, [
      { color: "Negro", sku: "RPC-CAN-NG" },
      { color: "Gris Melange", sku: "RPC-CAN-GM" },
      { color: "Azul Marino", sku: "RPC-CAN-AZ" },
    ]),
    minQty: 25,
    leadTimeDaysReorder: 50,
    baseCostUsd: 9.8,
    volumePricing: [
      { minQty: 25, unitPriceNet: 16990 },
      { minQty: 50, unitPriceNet: 14990 },
      { minQty: 100, unitPriceNet: 13490 },
      { minQty: 250, unitPriceNet: 11990 },
    ],
    printAreas: [PECHO_CENTRO, PECHO_IZQ, ESPALDA],
    printTechniques: [SERIGRAFIA_1C, SERIGRAFIA_FULL, TRANSFER_DTF, BORDADO],
    tags: ["CORPORATIVO", "polerones", "stock-express"],
  },
  {
    id: "rpc_poleron_cierre",
    handle: "poleron-cierre-gorro",
    title: "Polerón con Cierre y Gorro",
    vendor: "Ropa Publicitaria Chile",
    category: "Polerones y Polar",
    description:
      "Versátil para uniforme diario: cierre completo, gorro y bolsillos. Bordado al pecho impecable.",
    descriptionHtml:
      "<p>Versátil para uniforme diario: cierre completo, gorro y bolsillos. Bordado al pecho impecable.</p>",
    featuredImage: placeholderImage("Polerón Cierre"),
    images: [placeholderImage("Cierre Frente"), placeholderImage("Cierre Espalda")],
    variants: makeVariants("cierre", 27990, [
      { color: "Negro", sku: "RPC-CIE-NG" },
      { color: "Gris Oscuro", sku: "RPC-CIE-GO" },
    ]),
    minQty: 25,
    leadTimeDaysReorder: 55,
    baseCostUsd: 11.2,
    volumePricing: [
      { minQty: 25, unitPriceNet: 18990 },
      { minQty: 50, unitPriceNet: 16990 },
      { minQty: 100, unitPriceNet: 14990 },
      { minQty: 250, unitPriceNet: 13490 },
    ],
    printAreas: [PECHO_IZQ, ESPALDA],
    printTechniques: [BORDADO, SERIGRAFIA_1C, TRANSFER_DTF],
    tags: ["CORPORATIVO", "polerones", "stock-express"],
  },
  {
    id: "rpc_polar",
    handle: "polar-corporativo",
    title: "Polar Corporativo",
    vendor: "Ropa Publicitaria Chile",
    category: "Polerones y Polar",
    description:
      "Polar antipilling 280 g con medio cierre. Abrigo liviano para faena, oficina y terreno.",
    descriptionHtml:
      "<p>Polar antipilling 280 g con medio cierre. Abrigo liviano para faena, oficina y terreno.</p>",
    featuredImage: placeholderImage("Polar"),
    images: [placeholderImage("Polar Frente"), placeholderImage("Polar Espalda")],
    variants: makeVariants("polar", 19990, [
      { color: "Negro", sku: "RPC-POL-NG" },
      { color: "Azul Marino", sku: "RPC-POL-AZ" },
      { color: "Burdeo", sku: "RPC-POL-BU" },
    ]),
    minQty: 25,
    leadTimeDaysReorder: 50,
    baseCostUsd: 8.4,
    volumePricing: [
      { minQty: 25, unitPriceNet: 13990 },
      { minQty: 50, unitPriceNet: 12490 },
      { minQty: 100, unitPriceNet: 10990 },
      { minQty: 250, unitPriceNet: 9690 },
    ],
    printAreas: [PECHO_IZQ, ESPALDA],
    printTechniques: [BORDADO, TRANSFER_DTF],
    tags: ["CORPORATIVO", "polerones", "stock-express"],
  },
  {
    id: "rpc_softshell",
    handle: "chaqueta-softshell",
    title: "Chaqueta Softshell",
    vendor: "Ropa Publicitaria Chile",
    category: "Polerones y Polar",
    description:
      "Cortaviento repelente al agua con interior micropolar. La chaqueta ejecutiva-outdoor que más se cotiza para gerencias y terreno.",
    descriptionHtml:
      "<p>Cortaviento repelente al agua con interior micropolar. La chaqueta ejecutiva-outdoor que más se cotiza para gerencias y terreno.</p>",
    featuredImage: placeholderImage("Softshell"),
    images: [placeholderImage("Softshell Frente"), placeholderImage("Softshell Espalda")],
    variants: makeVariants("softshell", 39990, [
      { color: "Negro", sku: "RPC-SOF-NG" },
      { color: "Azul Marino", sku: "RPC-SOF-AZ" },
    ], "low"),
    minQty: 20,
    leadTimeDaysReorder: 75,
    baseCostUsd: 16.5,
    volumePricing: [
      { minQty: 20, unitPriceNet: 27990 },
      { minQty: 50, unitPriceNet: 24990 },
      { minQty: 100, unitPriceNet: 21990 },
      { minQty: 250, unitPriceNet: 19490 },
    ],
    printAreas: [PECHO_IZQ, ESPALDA, MANGA],
    printTechniques: [BORDADO, TRANSFER_DTF],
    tags: ["CORPORATIVO", "polerones", "fabricacion"],
  },
  {
    id: "rpc_camisa_oxford",
    handle: "camisa-oxford",
    title: "Camisa Oxford",
    vendor: "Ropa Publicitaria Chile",
    category: "Camisas",
    description:
      "Camisa Oxford clásica de uniforme ejecutivo. Bordado al pecho con acabado impecable. Versión hombre y mujer.",
    descriptionHtml:
      "<p>Camisa Oxford clásica de uniforme ejecutivo. Bordado al pecho con acabado impecable. Versión hombre y mujer.</p>",
    featuredImage: placeholderImage("Camisa Oxford"),
    images: [placeholderImage("Oxford Frente"), placeholderImage("Oxford Detalle")],
    variants: makeVariants("oxford", 22990, [
      { color: "Celeste", sku: "RPC-OXF-CE" },
      { color: "Blanco", sku: "RPC-OXF-BL" },
    ], "low"),
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
    vendor: "Ropa Publicitaria Chile",
    category: "Pantalones y Ropa Técnica",
    description:
      "Gabardina reforzada con bolsillos cargo para faena y terreno. Parte del uniforme completo que fabricamos a medida.",
    descriptionHtml:
      "<p>Gabardina reforzada con bolsillos cargo para faena y terreno. Parte del uniforme completo que fabricamos a medida.</p>",
    featuredImage: placeholderImage("Pantalón Cargo"),
    images: [placeholderImage("Cargo Frente"), placeholderImage("Cargo Detalle")],
    variants: makeVariants("cargo", 24990, [
      { color: "Beige", sku: "RPC-CAR-BE" },
      { color: "Gris Oscuro", sku: "RPC-CAR-GO" },
      { color: "Negro", sku: "RPC-CAR-NG" },
    ], "low"),
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
    vendor: "Ropa Publicitaria Chile",
    category: "Jockeys y Gorros",
    description:
      "Jockey 6 paneles con cierre regulable. El merchandising que más circula: tu logo bordado al frente, a la vista todo el día.",
    descriptionHtml:
      "<p>Jockey 6 paneles con cierre regulable. El merchandising que más circula: tu logo bordado al frente, a la vista todo el día.</p>",
    featuredImage: placeholderImage("Jockey"),
    images: [placeholderImage("Jockey Frente"), placeholderImage("Jockey Lateral")],
    variants: makeVariants("jockey", 7990, [
      { color: "Negro", sku: "RPC-JOC-NG" },
      { color: "Azul Marino", sku: "RPC-JOC-AZ" },
      { color: "Blanco", sku: "RPC-JOC-BL" },
      { color: "Rojo", sku: "RPC-JOC-RJ" },
    ]),
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
    vendor: "Ropa Publicitaria Chile",
    category: "Jockeys y Gorros",
    description:
      "Beanie tejido con vuelta para bordado. Infaltable en kits de invierno y marcas outdoor.",
    descriptionHtml:
      "<p>Beanie tejido con vuelta para bordado. Infaltable en kits de invierno y marcas outdoor.</p>",
    featuredImage: placeholderImage("Beanie"),
    images: [placeholderImage("Beanie Frente")],
    variants: makeVariants("beanie", 6990, [
      { color: "Negro", sku: "RPC-BEA-NG" },
      { color: "Gris", sku: "RPC-BEA-GR" },
      { color: "Burdeo", sku: "RPC-BEA-BU" },
    ]),
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
    vendor: "Ropa Publicitaria Chile",
    category: "Merchandising",
    description:
      "Tote ecológica de algodón crudo 140 g. El regalo corporativo más pedido para eventos y ferias.",
    descriptionHtml:
      "<p>Tote ecológica de algodón crudo 140 g. El regalo corporativo más pedido para eventos y ferias.</p>",
    featuredImage: placeholderImage("Bolsa Tote"),
    images: [placeholderImage("Tote Cara A"), placeholderImage("Tote Cara B")],
    variants: makeVariants("tote", 4990, [
      { color: "Crudo", sku: "RPC-TOT-CR" },
      { color: "Negro", sku: "RPC-TOT-NG" },
    ]),
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
    vendor: "Ropa Publicitaria Chile",
    category: "Merchandising",
    description:
      "Tazón de cerámica sublimable a todo color. El clásico de escritorio que mantiene tu marca a la vista cada día.",
    descriptionHtml:
      "<p>Tazón de cerámica sublimable a todo color. El clásico de escritorio que mantiene tu marca a la vista cada día.</p>",
    featuredImage: placeholderImage("Tazón"),
    images: [placeholderImage("Tazón Frente")],
    variants: makeVariants("tazon", 5990, [
      { color: "Blanco", sku: "RPC-TAZ-BL" },
      { color: "Interior Color", sku: "RPC-TAZ-IC" },
    ]),
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
