import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type { CorporateProduct } from "@/lib/shopify/types";

export type CatalogSearchParams = {
  category?: string;
  technique?: string;
  inStock?: string;
  // Default visual = "Precio: mayor a menor". Aceptamos también "price_desc"
  // explícito o URLs legacy con "relevance" → se interpretan como default.
  sort?: "price_asc" | "price_desc";
};

type Props = {
  products: CorporateProduct[];
  active: CatalogSearchParams;
};

/**
 * Orden canónico de las categorías de Ropa Publicitaria Chile — el mismo del
 * menú de su sitio. Las categorías se derivan de los productos (si una no
 * tiene productos, no aparece), pero se ordenan según esta lista; cualquier
 * categoría fuera de ella va al final en orden alfabético.
 */
const RPC_CATEGORY_ORDER = [
  "Poleras",
  "Polerones y Polar",
  "Camisas",
  "Pantalones y Ropa Técnica",
  "Jockeys y Gorros",
  "Merchandising",
] as const;

function categoryRank(category: string): number {
  const i = (RPC_CATEGORY_ORDER as readonly string[]).indexOf(category);
  return i === -1 ? RPC_CATEGORY_ORDER.length : i;
}

/**
 * Filtros server-side, sincronizados con la URL.
 *
 * Cada filtro renderea links a /catalogo?param=value para mantener el
 * estado en la URL (compartible, indexable, sin JS adicional).
 */
export function CatalogFilters({ products, active }: Props) {
  const categories = Array.from(new Set(products.map((p) => p.category))).sort(
    (a, b) => categoryRank(a) - categoryRank(b) || a.localeCompare(b),
  );
  // Técnicas reales de RPC: bordado, serigrafía (1 color y full), transfer
  // DTF y sublimación. Derivadas de los productos para no listar técnicas
  // sin productos que las ofrezcan.
  const techniques = Array.from(
    new Set(products.flatMap((p) => p.printTechniques.map((t) => t.label))),
  ).sort();

  return (
    <aside className="space-y-10">
      <FilterGroup
        label="Categoría"
        items={[
          { label: "Todas", value: undefined, active: !active.category },
          ...categories.map((c) => ({
            label: c,
            value: c,
            active: active.category === c,
          })),
        ]}
        paramKey="category"
        current={active}
      />

      <FilterGroup
        label="Técnica de impresión"
        items={[
          { label: "Todas", value: undefined, active: !active.technique },
          ...techniques.map((t) => ({
            label: t,
            value: t,
            active: active.technique === t,
          })),
        ]}
        paramKey="technique"
        current={active}
      />

      <FilterGroup
        label="Stock"
        items={[
          { label: "Todo", value: undefined, active: !active.inStock },
          { label: "Solo stock inmediato", value: "ready", active: active.inStock === "ready" },
        ]}
        paramKey="inStock"
        current={active}
      />

      <FilterGroup
        label="Ordenar por"
        items={[
          // Default: mayor a menor precio para que las prendas ancla (más
          // caras: chaquetas, polerones) abran el catálogo.
          { label: "Precio: mayor a menor", value: undefined, active: !active.sort || active.sort === "price_desc" },
          { label: "Precio: menor a mayor", value: "price_asc", active: active.sort === "price_asc" },
        ]}
        paramKey="sort"
        current={active}
      />
    </aside>
  );
}

type FilterItem = { label: string; value: string | undefined; active: boolean };

function FilterGroup({
  label,
  items,
  paramKey,
  current,
}: {
  label: string;
  items: FilterItem[];
  paramKey: keyof CatalogSearchParams;
  current: CatalogSearchParams;
}) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-[0.2em] text-rpc-text/60">
        {label}
      </h3>
      <ul className="mt-4 space-y-2">
        {items.map((item) => {
          const next: CatalogSearchParams = { ...current, [paramKey]: item.value };
          const qs = buildQuery(next);
          const href = qs ? `/catalogo?${qs}` : "/catalogo";
          return (
            <li key={`${paramKey}-${item.label}`}>
              <Link
                href={href as never}
                className={cn(
                  "block py-1 font-rpc-body text-sm normal-case tracking-normal transition",
                  item.active
                    ? "text-rpc-text underline underline-offset-4"
                    : "text-rpc-text/60 hover:text-rpc-text",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function buildQuery(p: CatalogSearchParams): string {
  const sp = new URLSearchParams();
  if (p.category) sp.set("category", p.category);
  if (p.technique) sp.set("technique", p.technique);
  if (p.inStock) sp.set("inStock", p.inStock);
  // Sólo price_asc se persiste en URL: el default (price_desc) queda implícito
  // como "no sort" para que la URL canónica sea más limpia.
  if (p.sort === "price_asc") sp.set("sort", p.sort);
  return sp.toString();
}

/** Threshold para "stock inmediato" — alineado con ProductCard.STOCK_READY_THRESHOLD. */
const STOCK_READY_THRESHOLD = 10;

export function applyFilters(
  products: CorporateProduct[],
  p: CatalogSearchParams,
  /** Stock total por product.id, pre-fetcheado server-side. */
  stockByProductId: Record<string, number>,
): CorporateProduct[] {
  let out = [...products];
  if (p.category) out = out.filter((x) => x.category === p.category);
  if (p.technique) {
    out = out.filter((x) =>
      x.printTechniques.some((t) => t.label === p.technique),
    );
  }
  if (p.inStock === "ready") {
    out = out.filter(
      (x) => (stockByProductId[x.id] ?? 0) > STOCK_READY_THRESHOLD,
    );
  }
  // Default: mayor a menor precio (prendas ancla al inicio).
  // Si el usuario explícitamente elige price_asc, respetamos eso.
  if (p.sort === "price_asc") {
    out.sort((a, b) => firstPrice(a) - firstPrice(b));
  } else {
    out.sort((a, b) => firstPrice(b) - firstPrice(a));
  }
  return out;
}

// Precio de referencia para ordenar: el piso por volumen (menor unitPriceNet),
// consistente con el "Desde" que muestra la ProductCard.
function firstPrice(p: CorporateProduct): number {
  if (p.volumePricing.length === 0) return 0;
  return Math.min(...p.volumePricing.map((b) => b.unitPriceNet));
}
