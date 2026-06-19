import Image from "next/image";
import Link from "next/link";
import type { CorporateProduct } from "@/lib/shopify/types";
import { formatCLP } from "@/lib/utils/money";
import { StockBadge, type StockScenario } from "./StockBadge";
import { LogoOverlayBadge } from "./LogoOverlayBadge";

type Props = {
  product: CorporateProduct;
  /** Stock total disponible para corporativo (suma de todas las variantes). */
  stockTotal: number;
};

/**
 * Threshold para considerar "stock inmediato" en el catálogo.
 * >10 unidades libres → tenemos lo suficiente para casi cualquier cotización
 * empezando desde el mínimo (10u). Sino se trata como "bajo pedido".
 */
const STOCK_READY_THRESHOLD = 10;

function stockScenario(stockTotal: number): StockScenario {
  if (stockTotal > STOCK_READY_THRESHOLD) return "ready";
  if (stockTotal > 0) return "partial";
  return "on_demand";
}

export function ProductCard({ product, stockTotal }: Props) {
  // "Desde" = el precio unitario MÁS BAJO del producto (piso por volumen), no
  // el de la cantidad mínima. volumePricing va asc por minQty (= desc por
  // precio), así que tomamos el menor unitPriceNet de la tabla.
  const cheapestUnit = product.volumePricing.reduce<number | null>(
    (min, b) => (min === null ? b.unitPriceNet : Math.min(min, b.unitPriceNet)),
    null,
  );
  // Productos de fabricación a medida no son "stock inmediato": muestran
  // "Bajo pedido · N días" con su plazo. El resto usa el stock (infinito en demo).
  const scenario = product.tags.includes("fabricacion")
    ? "on_demand"
    : stockScenario(stockTotal);

  return (
    <Link
      href={`/catalogo/${product.handle}` as never}
      className="group flex flex-col gap-3 sm:gap-4"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-rpc-image-bg-light">
        <Image
          src={product.featuredImage.url}
          alt={product.featuredImage.altText ?? product.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 50vw"
          className="object-cover transition duration-500 group-hover:scale-[1.02]"
        />
        <FlowBadge tags={product.tags} />
        {/* Client island: si el visitante subió su logo, lo muestra aplicado
            sobre la foto. El card completo sigue siendo server component. */}
        <LogoOverlayBadge />
      </div>

      <div className="flex flex-col gap-1.5 sm:gap-2">
        <p className="text-[9px] uppercase tracking-[0.18em] text-rpc-text/50 sm:text-[10px] sm:tracking-[0.2em]">
          {product.category}
        </p>
        <h3 className="font-rpc-heading text-sm uppercase tracking-[0.06em] text-rpc-text sm:text-base sm:tracking-[0.08em]">
          {product.title}
        </h3>

        {/* Mobile: stack vertical (precio arriba, Mín abajo más chico).
            Desktop: lado a lado en una línea. Evita ahorcar el precio en el
            ancho de media columna de mobile (~165px). */}
        <div className="mt-1 flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
          <p className="font-rpc-body text-xs normal-case tracking-normal text-rpc-text/80 sm:text-sm">
            Desde{" "}
            <span className="font-medium text-rpc-text">
              {cheapestUnit !== null ? formatCLP(cheapestUnit) : "—"}
            </span>
            <span className="text-rpc-text/60"> / u</span>
          </p>
          <p className="text-[9px] uppercase tracking-[0.18em] text-rpc-text/50 sm:text-[10px] sm:tracking-[0.2em]">
            Mín {product.minQty}
          </p>
        </div>

        <StockBadge
          scenario={scenario}
          leadTimeDays={product.leadTimeDaysReorder}
          className="mt-1.5 sm:mt-2"
        />
      </div>
    </Link>
  );
}

/**
 * Badge del modelo dual de RPC sobre la foto del producto:
 *  - tag "stock-express" → celeste: producto en Chile, respuesta rápida.
 *  - tag "fabricacion"   → gris: proyecto a medida desde fábrica.
 *
 * Complementa (no reemplaza) al StockBadge de inventario bajo el título:
 * uno dice por qué flujo va el producto, el otro cuánto stock hay hoy.
 */
function FlowBadge({ tags }: { tags: string[] }) {
  if (tags.includes("stock-express")) {
    return (
      <span className="absolute left-2 top-2 rounded-full bg-rpc-info px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.1em] text-white sm:text-[10px] sm:tracking-[0.12em]">
        Stock Express
      </span>
    );
  }
  if (tags.includes("fabricacion")) {
    return (
      <span className="absolute left-2 top-2 rounded-full border border-rpc-border bg-rpc-surface px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.1em] text-rpc-text/70 sm:text-[10px] sm:tracking-[0.12em]">
        Fabricación a medida
      </span>
    );
  }
  return null;
}
