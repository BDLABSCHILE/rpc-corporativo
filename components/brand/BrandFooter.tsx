import Image from "next/image";
import Link from "next/link";
import { rpcTokens } from "@/lib/brand/rpc-tokens";
import { CONTACT, CONTACT_LINKS } from "@/lib/brand/contacts";

export function BrandFooter() {
  return (
    <footer className="mt-24 border-t border-rpc-border bg-rpc-bg">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4 lg:px-10">
        <div className="md:col-span-2">
          {/* Lockup "BØLG Corporativo" — misma marca que el header pero más grande */}
          <Image
            src="/brand/rpc-corporativo-lockup.png"
            alt="BØLG Corporativo"
            width={1902}
            height={936}
            className="h-16 w-auto"
          />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-rpc-text/70">
            Plataforma corporativa de BØLG. Cotiza productos personalizados con tu logo,
            con stock real, timelines y precios por volumen.
          </p>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.18em] text-rpc-text">Plataforma</h3>
          <ul className="mt-4 space-y-2 text-sm text-rpc-text/70">
            <li><Link href="/catalogo" className="transition hover:text-rpc-text">Catálogo</Link></li>
            <li><Link href="/cotizador" className="transition hover:text-rpc-text">Cotizador</Link></li>
            <li><Link href="/mis-cotizaciones" className="transition hover:text-rpc-text">Mis cotizaciones</Link></li>
            <li><Link href="/como-funciona" className="transition hover:text-rpc-text">Cómo funciona</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.18em] text-rpc-text">Contacto</h3>
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
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 text-xs uppercase tracking-[0.18em] text-rpc-text/50 lg:px-10">
          <span>© {new Date().getFullYear()} BØLG</span>
          <span>Hecho en Chile</span>
        </div>
      </div>
    </footer>
  );
}
