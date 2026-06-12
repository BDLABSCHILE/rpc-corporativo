import Link from "next/link";

export function CtaFooter() {
  return (
    <section className="bg-rpc-announcement text-rpc-button-text">
      <div className="mx-auto flex max-w-5xl flex-col items-center px-6 py-24 text-center lg:px-10 lg:py-32">
        <p className="text-xs uppercase tracking-[0.25em] opacity-60">
          Listos para cotizar
        </p>
        <h2 className="mt-4 max-w-3xl text-3xl font-light leading-[1.1] sm:text-4xl lg:text-5xl">
          Tu próximo regalo corporativo, listo en una sola conversación.
        </h2>
        <p className="mt-6 max-w-xl font-rpc-body text-base normal-case tracking-normal opacity-80">
          Explora el catálogo, configura tu logo y recibe una cotización
          profesional en menos de 5 minutos.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/catalogo"
            className="inline-flex items-center justify-center rounded-rpc-button bg-rpc-button-text px-8 py-4 text-xs uppercase tracking-[0.2em] text-rpc-announcement transition hover:opacity-90"
          >
            Ir al catálogo
          </Link>
          <Link
            href="/contacto"
            className="inline-flex items-center justify-center rounded-rpc-button border border-rpc-button-text px-8 py-4 text-xs uppercase tracking-[0.2em] text-rpc-button-text transition hover:bg-rpc-button-text hover:text-rpc-announcement"
          >
            Hablar con un asesor
          </Link>
        </div>
      </div>
    </section>
  );
}
