import type { Metadata } from "next";
import { listCorporateProducts } from "@/lib/shopify/storefront";
import { getProductTotalStock } from "@/lib/shopify/admin";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import {
  CatalogFilters,
  applyFilters,
  type CatalogSearchParams,
} from "@/components/catalog/CatalogFilters";
import { CatalogFiltersMobile } from "@/components/catalog/CatalogFiltersMobile";
import { LogoBanner } from "@/components/catalog/LogoBanner";

// Catálogo siempre dinámico para reflejar stock real + cambios de metafields
// sin caché agresiva.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catálogo corporativo",
  description:
    "Catálogo de Ropa Publicitaria Chile: poleras, polerones, camisas y blusas, ropa técnica, jockeys, gorros y delantales. Personaliza con tu logo en bordado, serigrafía, DTF, vinilo o sublimación.",
};

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const active = normalize(sp);
  const all = await listCorporateProducts();

  const stockEntries = await Promise.all(
    all.map(async (p) => {
      const variantIds = p.variants.map((v) => v.id);
      const total = await getProductTotalStock(variantIds);
      return [p.id, total] as const;
    }),
  );
  const stockByProductId = Object.fromEntries(stockEntries);

  const filtered = applyFilters(all, active, stockByProductId);

  return (
    <div className="mx-auto max-w-7xl px-6 py-6 sm:py-8 lg:px-10 lg:py-12">
      {/*
        Header compacto: título + una línea de contexto. El aviso de "precios
        de referencia" del modo demo vive en el header global del sitio —
        acá no se duplica.
      */}
      <header className="border-b border-rpc-border pb-6 sm:pb-8">
        <h1 className="text-3xl text-rpc-text sm:text-4xl">
          Catálogo corporativo
        </h1>
        <p className="mt-3 max-w-2xl font-rpc-body text-sm normal-case tracking-normal text-rpc-text/70 sm:text-base">
          Poleras, polerones, camisas y blusas, ropa técnica, jockeys, gorros,
          delantales y uniformes. Personaliza con tu logo y cotiza sin
          compromiso — te respondemos en menos de 24 horas.
        </p>
      </header>

      {/* Feature estrella: sube tu logo una vez y todo el catálogo se
          previsualiza con tu marca. */}
      <div className="mt-6">
        <LogoBanner />
      </div>

      {/* Mobile: filtros colapsados detrás de botón. Por default viene el
          catálogo completo visible desde arriba sin scrolls extra. */}
      <div className="mt-6 lg:hidden">
        <CatalogFiltersMobile
          active={active}
          totalProducts={all.length}
          filteredCount={filtered.length}
        >
          <CatalogFilters products={all} active={active} />
        </CatalogFiltersMobile>
      </div>

      {/* Desktop: 2-col layout con sidebar sticky de filtros */}
      <div className="mt-8 grid gap-12 lg:mt-12 lg:grid-cols-[240px_1fr] lg:gap-16">
        <div className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
          <CatalogFilters products={all} active={active} />
        </div>
        <ProductGrid products={filtered} stockByProductId={stockByProductId} />
      </div>
    </div>
  );
}

function normalize(
  sp: Record<string, string | string[] | undefined>,
): CatalogSearchParams {
  const get = (k: string): string | undefined => {
    const v = sp[k];
    if (Array.isArray(v)) return v[0];
    return v;
  };
  // Default visual = price_desc. URLs viejas con sort=relevance o sort=price_desc
  // se descartan a undefined (mismo efecto). Sólo price_asc se preserva.
  const sort = get("sort");
  return {
    category: get("category"),
    technique: get("technique"),
    inStock: get("inStock"),
    sort: sort === "price_asc" ? "price_asc" : undefined,
  };
}
