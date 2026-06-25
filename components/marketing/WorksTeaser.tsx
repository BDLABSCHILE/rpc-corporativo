import Image from "next/image";
import Link from "next/link";
import { REAL_WORKS } from "@/lib/works/works";

/**
 * Teaser de "Nuestros trabajos" en la home: 4 fotos reales que enlazan a la
 * galería completa. Prueba social temprana — prendas reales con marca puesta,
 * no renders.
 */
const FEATURED_SLUGS = [
  "claro-poleras-pique",
  "funpark-mix",
  "dtf-canguros-colores",
  "edenred-poleron-polo",
] as const;

export function WorksTeaser() {
  const featured = FEATURED_SLUGS.map(
    (slug) => REAL_WORKS.find((w) => w.slug === slug)!,
  );

  return (
    <section className="border-b border-rpc-border bg-rpc-bg">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-rpc-info-dark">
              Nuestros trabajos
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl tracking-tight sm:text-4xl">
              Marcas reales, con su logo ya puesto.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-rpc-text/70">
              No son renders: son prendas que produjimos y personalizamos con
              bordado, serigrafía y DTF para equipos chilenos.
            </p>
          </div>
          <Link
            href="/nuestros-trabajos"
            className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-rpc-accent-dark transition hover:text-rpc-accent"
          >
            Ver todos los trabajos
            <span aria-hidden>→</span>
          </Link>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {featured.map((work) => (
            <li key={work.slug}>
              <Link
                href={`/nuestros-trabajos#${work.slug}` as never}
                className="group block overflow-hidden rounded-rpc-card border border-rpc-border bg-rpc-surface transition hover:border-rpc-accent/40 hover:shadow-md"
              >
                <div className="overflow-hidden bg-rpc-image-bg-light">
                  <Image
                    src={work.image}
                    alt={`${work.garments.join(", ")}${work.client ? ` para ${work.client}` : ""}`}
                    width={work.width}
                    height={work.height}
                    sizes="(min-width: 1024px) 22vw, 45vw"
                    className="h-44 w-full object-cover object-top transition duration-500 group-hover:scale-[1.04] sm:h-52"
                  />
                </div>
                <div className="px-4 py-3">
                  <span className="font-rpc-heading text-sm font-bold leading-tight text-rpc-text">
                    {work.client ?? "Tanda multimarca"}
                  </span>
                  <p className="mt-0.5 font-rpc-body text-xs normal-case leading-snug tracking-normal text-rpc-text/60">
                    {work.techniques.join(" · ")}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
