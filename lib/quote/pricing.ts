import type {
  CorporateProduct,
  LogoSizeTier,
  PrintTechnique,
  VolumeBreak,
} from "@/lib/shopify/types";
import { IVA_RATE } from "@/lib/utils/money";
import type { LinePricing } from "./types";

export type PricingInput = {
  product: CorporateProduct;
  quantity: number;
  technique: PrintTechnique;
  /** Cantidad de zonas de impresión donde se aplica el logo. ≥ 1. */
  printPositions: number;
  /**
   * Lado más largo del logo en cm (lo que el cliente ajustó en el preview).
   * Define el tramo de precio por tamaño de la técnica (insignia/carta/
   * gigantografía). Si NO viene, o la técnica no tiene `sizeTiers`, se usa
   * `technique.basePriceUnit` (tramo insignia) como fallback.
   */
  logoLongSideCm?: number | null;
  /**
   * Cantidad TOTAL de unidades del pedido (sumando todas las líneas del
   * carrito). Si viene, define el tramo de descuento por volumen que se le
   * aplica a ESTA línea — confirmado por RPC: "el descuento aplica por total
   * del pedido, no por producto" (ej: 5 poleras + 5 polerones = 10 u totales
   * y ambos productos entran al tramo de 10 u, no al tramo de 5).
   *
   * Si NO viene (ej. PDP mirando un solo producto), se usa `quantity` y se
   * cae al comportamiento anterior.
   */
  cartTotalQty?: number;
};

/**
 * Calcula el pricing de una línea de cotización a partir de:
 *  - El break aplicable según volumen.
 *  - La técnica de impresión (base + extra por posición + setup fee).
 *  - IVA chileno 19%.
 *
 * Devuelve también:
 *  - El próximo break (si existe) y cuánto ahorra el cliente si sube.
 *  - El ahorro vs el primer break (sin descuento por volumen).
 *
 * Función pura: solo lee los inputs, no toca red, KV ni nada externo.
 * Útil para llamarla desde Server Components y desde tests con Vitest.
 */
export function calculateLinePricing(input: PricingInput): LinePricing {
  const {
    product,
    quantity,
    technique,
    printPositions,
    cartTotalQty,
    logoLongSideCm,
  } = input;

  if (quantity <= 0) {
    throw new RangeError("La cantidad debe ser positiva.");
  }
  if (printPositions < 1) {
    throw new RangeError("Debe haber al menos una zona de impresión.");
  }

  const sortedBreaks = [...product.volumePricing].sort(
    (a, b) => a.minQty - b.minQty,
  );

  const baselineBreak = sortedBreaks[0];
  if (!baselineBreak) {
    throw new Error(
      `El producto ${product.handle} no tiene volume_pricing configurado.`,
    );
  }

  // Cantidad que define el tramo: total del pedido (si se pasó) o de la línea.
  const qtyForBreak = cartTotalQty ?? quantity;
  const appliedBreak = findApplicableBreak(sortedBreaks, qtyForBreak);
  const nextBreak = findNextBreak(sortedBreaks, appliedBreak);

  const unitPriceNet = appliedBreak.unitPriceNet;
  const extraPositions = Math.max(0, printPositions - 1);

  // Precio de personalización según el TAMAÑO del logo. Si la técnica tiene
  // tramos y conocemos el tamaño, usamos el precio del tramo; si no, caemos al
  // basePriceUnit (= tramo insignia) para no romper el cálculo.
  const sizeSelection = selectSizeTier(technique.sizeTiers, logoLongSideCm);
  const customizationBase = sizeSelection
    ? sizeSelection.tier.priceUnit
    : technique.basePriceUnit;
  const customizationUnitPrice =
    customizationBase + extraPositions * technique.extraPositionPrice;
  const setupFee = technique.setupFee;

  const subtotalNet =
    quantity * (unitPriceNet + customizationUnitPrice) + setupFee;
  const iva = subtotalNet * IVA_RATE;
  const totalGross = subtotalNet + iva;

  const savingsVsBaseline =
    quantity * Math.max(0, baselineBreak.unitPriceNet - unitPriceNet);
  const savingsVsBaselineGross = savingsVsBaseline * (1 + IVA_RATE);

  // Ahorro si el TOTAL del pedido subiera al próximo tramo. Sobre esta línea
  // específica, el ahorro es lineal a su quantity (no a la del próximo break).
  const nextSavingsNet = nextBreak
    ? quantity * Math.max(0, appliedBreak.unitPriceNet - nextBreak.unitPriceNet)
    : 0;

  return {
    unitPriceNet,
    customizationUnitPrice,
    setupFee,
    subtotalNet,
    iva,
    totalGross,
    appliedBreak: {
      minQty: appliedBreak.minQty,
      unitPriceNet: appliedBreak.unitPriceNet,
    },
    nextBreak: nextBreak
      ? {
          minQty: nextBreak.minQty,
          unitPriceNet: nextBreak.unitPriceNet,
          savings: nextSavingsNet,
          savingsGross: nextSavingsNet * (1 + IVA_RATE),
        }
      : null,
    savingsVsBaseline,
    savingsVsBaselineGross,
    appliedSizeTier: sizeSelection
      ? {
          id: sizeSelection.tier.id,
          label: sizeSelection.tier.label,
          priceUnit: sizeSelection.tier.priceUnit,
        }
      : null,
    sizeNeedsQuoteReview: sizeSelection?.needsReview ?? false,
  };
}

/**
 * Elige el tramo de tamaño según el lado más largo del logo (cm). Devuelve null
 * cuando la técnica no tiene tramos o no se conoce el tamaño → el caller cae a
 * `basePriceUnit`.
 *
 * `needsReview` es true cuando el logo es más grande que el tramo más grande
 * cotizado y NO hay tramo abierto (ej. serigrafía/vinilo sobre carta): se cobra
 * el tramo mayor y el equipo confirma el precio al cotizar.
 */
function selectSizeTier(
  tiers: LogoSizeTier[] | undefined,
  logoLongSideCm: number | null | undefined,
): { tier: LogoSizeTier; needsReview: boolean } | null {
  if (!tiers || tiers.length === 0) return null;
  if (logoLongSideCm == null) return null;

  const sorted = [...tiers].sort((a, b) => {
    if (a.maxLongSideCm === null) return 1;
    if (b.maxLongSideCm === null) return -1;
    return a.maxLongSideCm - b.maxLongSideCm;
  });

  for (const tier of sorted) {
    if (tier.maxLongSideCm === null || logoLongSideCm <= tier.maxLongSideCm) {
      return { tier, needsReview: false };
    }
  }
  // Supera todos los tramos finitos y no hay tramo abierto: cobra el mayor.
  return { tier: sorted[sorted.length - 1]!, needsReview: true };
}

/**
 * Encuentra el break aplicable: el de mayor minQty que aún sea ≤ quantity.
 * Si la cantidad es menor al primer break, retorna el primer break (con su
 * unitPrice) como fallback — la UI debe advertir que está bajo el mínimo,
 * pero el cálculo no debe romperse.
 */
function findApplicableBreak(
  sortedBreaks: VolumeBreak[],
  quantity: number,
): VolumeBreak {
  let applied: VolumeBreak | undefined;
  for (const b of sortedBreaks) {
    if (b.minQty <= quantity) {
      applied = b;
    } else {
      break;
    }
  }
  // Si quantity < primer break (ej. cliente puso 30 cuando mínimo es 50),
  // usamos el primer break como aproximación.
  return applied ?? sortedBreaks[0]!;
}

function findNextBreak(
  sortedBreaks: VolumeBreak[],
  current: VolumeBreak,
): VolumeBreak | undefined {
  const idx = sortedBreaks.findIndex((b) => b.minQty === current.minQty);
  if (idx === -1) return undefined;
  return sortedBreaks[idx + 1];
}

