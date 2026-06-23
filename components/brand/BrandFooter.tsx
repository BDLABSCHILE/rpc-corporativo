import Link from "next/link";
import { Logo } from "./Logo";
import { rpcTokens } from "@/lib/brand/rpc-tokens";
import { CONTACT, CONTACT_LINKS } from "@/lib/brand/contacts";

export function BrandFooter() {
  return (
    <footer className="border-t border-rpc-border bg-rpc-surface">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4 lg:px-10">
        <div className="md:col-span-2">
          <Logo className="h-12 w-auto" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-rpc-text/70">
            Vestuario corporativo y merchandising desde 1982. Stock en Chile
            listo para personalizar con tu logo y fabricación propia de ropa de
            cocina y uniformes, con asesoría de diseño.
          </p>
          <p className="mt-4 text-sm text-rpc-text/55">{CONTACT.direccion}</p>
        </div>

        <div>
          <h3 className="font-rpc-heading text-sm font-bold tracking-tight text-rpc-text">
            Navegación
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-rpc-text/70">
            <li><Link href="/catalogo" className="transition hover:text-rpc-text">Catálogo</Link></li>
            <li><Link href="/como-funciona" className="transition hover:text-rpc-text">Cómo funciona</Link></li>
            <li><Link href={"/casos-de-exito" as never} className="transition hover:text-rpc-text">Clientes</Link></li>
            <li><Link href="/cotizador" className="transition hover:text-rpc-text">Cotizador</Link></li>
            <li><Link href="/mis-cotizaciones" className="transition hover:text-rpc-text">Mis cotizaciones</Link></li>
            <li><Link href="/contacto" className="transition hover:text-rpc-text">Contacto</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-rpc-heading text-sm font-bold tracking-tight text-rpc-text">
            Contacto
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-rpc-text/70">
            <li>
              <a href={CONTACT_LINKS.whatsapp} target="_blank" rel="noreferrer noopener" className="transition hover:text-rpc-text">
                WhatsApp · {CONTACT.whatsappDisplay}
              </a>
            </li>
            <li>
              <a href={CONTACT_LINKS.mailto} className="transition hover:text-rpc-text">
                {CONTACT.email}
              </a>
            </li>
            <li><Link href="/contacto" className="transition hover:text-rpc-text">Formulario</Link></li>
            <li>
              <a href={rpcTokens.social.instagram} target="_blank" rel="noreferrer noopener" className="transition hover:text-rpc-text">Instagram</a>
            </li>
            <li>
              <a href={rpcTokens.social.facebook} target="_blank" rel="noreferrer noopener" className="transition hover:text-rpc-text">Facebook</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-rpc-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-rpc-text/50 sm:flex-row lg:px-10">
          <span>
            © {new Date().getFullYear()} {CONTACT.razonSocial} · Ropa Publicitaria Chile
          </span>
          {/* Crédito discreto del estudio */}
          <a
            href="https://bdlabs.cl"
            target="_blank"
            rel="noreferrer noopener"
            className="text-rpc-text/40 transition hover:text-rpc-text/70"
          >
            Hecho por BDLABS · bdlabs.cl
          </a>
        </div>
      </div>
    </footer>
  );
}
