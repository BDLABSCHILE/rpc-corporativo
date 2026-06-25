import Image from "next/image";
import Link from "next/link";
import { tintForColor } from "@/lib/brand/color-tints";

// Color con que se muestra el polo del hero: azul marino (su variante por
// defecto). La foto base es crema; el tinte multiply la lleva al color real.
const HERO_POLO_IMG = "/products/polera-pique-cuello-botones-manga-corta.webp";
const HERO_POLO_TINT = tintForColor("Azul marino");

/**
 * Hero de Ropa Publicitaria Chile.
 *
 * Izquierda: titular grande Archivo bold + propuesta (stock en Chile para
 * personalizar + fabricación propia de cocina/uniformes) + CTA dual. Derecha:
 * foto del polo (teñida a azul marino) con motivos de marca.
 *
 * Abajo: strip de categorías reales del cliente linkeando al catálogo.
 */

// Categorías reales del sitio del cliente — mismos strings que usa
// lib/shopify/mock.ts y el filtro ?category= de /catalogo.
const CATEGORIES = [
  "Poleras",
  "Polerones y Polar",
  "Camisas y Blusas",
  "Pantalones",
  "Ropa Técnica y Cortavientos",
  "Jockeys, Gorros y Accesorios",
  "Delantales y Uniformes",
] as const;

const TECHNIQUES = ["Bordado", "Serigrafía", "DTF", "Sublimación"] as const;

export function Hero() {
  return (
    <section className="border-b border-rpc-border bg-rpc-bg">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-10 lg:py-24">
        {/* Columna de texto */}
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-rpc-info/10 px-4 py-1.5 text-xs font-semibold text-rpc-info-dark">
            <span aria-hidden className="inline-block h-2 w-2 rotate-45 bg-rpc-accent" />
            Fabricantes desde 1982 · Recoleta, Santiago
          </p>

          <h1 className="mt-6 max-w-xl text-4xl leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
            Tu marca, puesta en la ropa de{" "}
            <span className="text-rpc-accent-dark">tu equipo</span>.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-rpc-text/75 sm:text-lg">
            Más de 40 años en vestuario corporativo y merchandising. Tenemos
            stock en Chile listo para personalizar con tu logo y entregar con
            poco plazo, y fabricamos nuestra propia línea de ropa de cocina y
            uniformes, con asesoría de diseño.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/catalogo"
              className="inline-flex items-center justify-center gap-2 rounded-rpc-button bg-rpc-accent px-8 py-4 text-sm font-semibold text-white transition hover:bg-rpc-accent-dark"
            >
              Explorar catálogo
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/catalogo"
              className="inline-flex items-center justify-center rounded-rpc-button border border-rpc-text px-8 py-4 text-sm font-semibold text-rpc-text transition hover:bg-rpc-text hover:text-white"
            >
              Sube tu logo y pruébalo
            </Link>
          </div>

          <p className="mt-6 text-sm text-rpc-text/55">
            Cotiza sin compromiso · Te respondemos en menos de 24 horas
          </p>
        </div>

        {/* Foto real de producto (prenda en blanco, lista para tu logo) con
            los motivos de marca: rombo coral 40+ años y chips de técnicas. */}
        <div className="relative mx-auto hidden w-full max-w-md lg:block">
          {/* Acentos de marca detrás de la foto */}
          <div aria-hidden className="absolute -left-6 -top-6 h-28 w-28 rotate-45 rounded-3xl bg-rpc-accent/15" />
          <div aria-hidden className="absolute -bottom-3 right-6 h-16 w-16 rotate-45 rounded-2xl border-2 border-rpc-info" />

          {/* Tarjeta con la foto de estudio (polo en azul marino vía tinte) */}
          <div className="relative aspect-square overflow-hidden rounded-[28px] bg-rpc-image-bg-light shadow-xl shadow-rpc-text/10 ring-1 ring-rpc-border isolate">
            <Image
              src={HERO_POLO_IMG}
              alt="Polera piqué corporativa azul marino, lista para personalizar con tu logo"
              fill
              priority
              sizes="(min-width: 1024px) 28rem, 0px"
              className="object-cover"
            />
            {HERO_POLO_TINT && (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundColor: HERO_POLO_TINT,
                  mixBlendMode: "multiply",
                  WebkitMaskImage: `url("${HERO_POLO_IMG}")`,
                  maskImage: `url("${HERO_POLO_IMG}")`,
                  maskMode: "alpha",
                  WebkitMaskSize: "cover",
                  maskSize: "cover",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                }}
              />
            )}
          </div>

          {/* Rombo coral con los +40 años, montado sobre la esquina */}
          <div className="absolute -bottom-5 -left-5 flex h-24 w-24 rotate-45 items-center justify-center rounded-[20px] bg-rpc-accent shadow-xl shadow-rpc-accent/30">
            <p className="-rotate-45 text-center font-rpc-heading leading-none text-white">
              <span className="block text-2xl font-bold">+40</span>
              <span className="mt-1 block text-[10px] font-semibold uppercase tracking-wide">años</span>
            </p>
          </div>

          {/* Chips flotantes con las técnicas reales */}
          <span className="absolute -right-3 top-[12%] rounded-full border border-rpc-border bg-rpc-bg px-4 py-1.5 text-xs font-semibold text-rpc-text shadow-sm">
            {TECHNIQUES[0]}
          </span>
          <span className="absolute -left-3 top-[60%] rounded-full border border-rpc-border bg-rpc-bg px-4 py-1.5 text-xs font-semibold text-rpc-text shadow-sm">
            {TECHNIQUES[1]}
          </span>
        </div>
      </div>

      {/* Strip de categorías reales → catálogo filtrado */}
      <div className="border-t border-rpc-border bg-rpc-surface">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-3 gap-y-2 px-6 py-5 lg:px-10">
          <span className="mr-2 text-xs font-semibold uppercase tracking-wide text-rpc-text/50">
            Catálogo
          </span>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/catalogo?category=${encodeURIComponent(cat)}` as never}
              className="rounded-full border border-rpc-border bg-rpc-bg px-4 py-1.5 text-sm font-medium text-rpc-text/75 transition hover:border-rpc-accent hover:text-rpc-accent-dark"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
