import Link from "next/link";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { QuoteMiniCart } from "./QuoteMiniCart";

const NAV_LINKS = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/como-funciona", label: "Cómo funciona" },
  { href: "/casos-de-exito", label: "Clientes" },
  { href: "/contacto", label: "Contacto" },
];

export function BrandHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-rpc-border bg-rpc-bg/95 backdrop-blur">
      {/*
        Announcement bar — ÚNICA mención demo de todo el sitio.
        Es una vista previa para el cliente: catálogo y precios son de
        referencia hasta conectar su Shopify real.
      */}
      <p className="flex items-center justify-center gap-2 bg-rpc-announcement px-4 py-1.5 text-center text-[11px] leading-snug text-white sm:text-xs">
        <span aria-hidden className="inline-block h-1.5 w-1.5 shrink-0 rotate-45 bg-rpc-accent" />
        Vista previa para el cliente — precios de referencia que se confirman al
        cotizar
      </p>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6 lg:px-10">
        <Link
          href="/"
          aria-label="Ropa Publicitaria Chile — inicio"
          className="inline-flex shrink-0 items-center"
        >
          <Logo className="h-9 w-auto sm:h-10" priority />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href as never}
              className="whitespace-nowrap text-[13px] font-medium text-rpc-text/70 transition hover:text-rpc-text"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Mini-cart: badge + drawer lateral con resumen y CTA a /cotizador. */}
          <QuoteMiniCart />
          {/* CTA primaria: coral = acción en toda la plataforma. */}
          <Link
            href="/catalogo"
            className="hidden whitespace-nowrap rounded-rpc-button bg-rpc-accent px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-rpc-accent-dark md:inline-flex"
          >
            Cotizar
          </Link>
          {/* Mobile: hamburguesa abre drawer con nav + CTAs grandes. */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
