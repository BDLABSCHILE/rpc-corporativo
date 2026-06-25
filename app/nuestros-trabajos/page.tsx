import type { Metadata } from "next";
import { listCorporateProducts } from "@/lib/shopify/storefront";
import { REAL_WORKS } from "@/lib/works/works";
import {
  WorksGallery,
  type ProductLink,
} from "@/components/works/WorksGallery";
import { CtaFooter } from "@/components/marketing/CtaFooter";

export const metadata: Metadata = {
  title: "Nuestros trabajos",
  description:
    "Trabajos reales de Ropa Publicitaria Chile: poleras, polerones, softshell y uniformes personalizados con bordado, serigrafía y DTF para Claro, Edenred, Funpark, IBM Transportes y más marcas chilenas.",
};

/**
 * /nuestros-trabajos — galería de prueba social con prendas REALES que
 * personalizamos para marcas chilenas. Cada foto se cruza con los productos
 * del catálogo que aparecen, para que el cliente pueda cotizar lo mismo.
 *
 * Honestidad: solo describimos lo que se ve en cada foto (prenda, color,
 * técnica, la marca cuyo logo aparece). Sin cifras ni historias inventadas.
 */

const TECHNIQUES: readonly { name: string; blurb: string }[] = [
  {
    name: "Bordado",
    blurb: "Acabado durable y premium. Aguanta lavados sin perder definición — ideal para logos y prendas de uso diario.",
  },
  {
    name: "Serigrafía",
    blurb: "El mejor costo por unidad en tiradas grandes de pocos colores. Estampado firme sobre algodón.",
  },
  {
    name: "DTF",
    blurb: "Full color, degradés e ilustraciones sin recargo por tono. Perfecto para diseños complejos.",
  },
];

export default async function NuestrosTrabajosPage() {
  // Mapa handle → {título, href} para enlazar la prenda desde el lightbox.
  const products = await listCorporateProducts();
  const productLinks: Record<string, ProductLink> = {};
  const referenced = new Set(REAL_WORKS.flatMap((w) => w.productHandles));
  for (const p of products) {
    if (referenced.has(p.handle)) {
      productLinks[p.handle] = {
        title: p.title,
        href: `/catalogo/${p.handle}`,
      };
    }
  }

  return (
    <>
      {/* Header */}
      <section className="border-b border-rpc-border bg-rpc-bg">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
          <p className="text-[10px] uppercase tracking-[0.25em] text-rpc-text/60 sm:text-xs">
            Nuestros trabajos
          </p>
          <h1 className="mt-4 max-w-4xl text-3xl leading-[1.05] sm:mt-6 sm:text-4xl lg:text-5xl">
            Más de 500 empresas ya visten su marca con nosotros.
          </h1>
          <p className="mt-6 max-w-2xl font-rpc-body text-base normal-case tracking-normal text-rpc-text/75 sm:mt-8 sm:text-lg">
            Acá te mostramos solo algunos ejemplos: prendas reales que
            produjimos y personalizamos con bordado, serigrafía y DTF
            —poleras, polerones, softshell, gorros y uniformes. No son renders;
            es la marca de cada equipo puesta sobre la prenda terminada.
          </p>

          {/* Mini-stats de confianza — claims aprobados por la marca. */}
          <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-6 sm:mt-12">
            <Stat value="+500" label="empresas confían en nosotros" />
            <Stat value="+40" label="años de oficio" />
            <Stat value="24 h" label="respuesta en menos de 24 horas" />
          </dl>
        </div>
      </section>

      {/* Galería */}
      <section className="bg-rpc-bg">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-20">
          <WorksGallery works={REAL_WORKS} productLinks={productLinks} />
        </div>
      </section>

      {/* Técnicas — qué hay detrás de cada trabajo */}
      <section className="border-y border-rpc-border bg-rpc-surface">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
          <p className="text-xs uppercase tracking-[0.25em] text-rpc-text/60">
            Cómo personalizamos
          </p>
          <h2 className="mt-4 max-w-3xl text-2xl leading-[1.1] sm:text-3xl lg:text-4xl">
            La técnica correcta para cada prenda y cada logo.
          </h2>
          <p className="mt-5 max-w-2xl font-rpc-body text-base normal-case tracking-normal text-rpc-text/70">
            Te asesoramos sobre cuál conviene según el diseño, la cantidad y el
            material. No hay una sola respuesta — hay la que rinde mejor para tu
            pedido.
          </p>

          <dl className="mt-12 grid gap-6 lg:grid-cols-3 lg:gap-8">
            {TECHNIQUES.map((t) => (
              <div
                key={t.name}
                className="rounded-rpc-card border border-rpc-border bg-rpc-bg p-8"
              >
                <dt className="flex items-center gap-2 font-rpc-heading text-lg text-rpc-text sm:text-xl">
                  <span
                    aria-hidden
                    className="h-2 w-2 rounded-full bg-rpc-accent"
                  />
                  {t.name}
                </dt>
                <dd className="mt-3 font-rpc-body text-sm normal-case tracking-normal text-rpc-text/75">
                  {t.blurb}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <CtaFooter />
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="font-rpc-heading text-3xl font-bold leading-none text-rpc-text sm:text-4xl">
        {value}
      </dt>
      <dd className="mt-2 font-rpc-body text-xs uppercase tracking-[0.18em] text-rpc-text/55">
        {label}
      </dd>
    </div>
  );
}
