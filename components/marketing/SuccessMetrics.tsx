/**
 * Cifras defendibles de Ropa Publicitaria Chile — SOLO claims permitidos:
 * 40+ años (desde 1982), modelo dual, respuesta <24 h y las 30+ marcas
 * del muro de clientes. Nada inventado.
 */
const METRICS = [
  { value: "40+", label: "años de experiencia, desde 1982" },
  { value: "2 modos", label: "stock para personalizar y fabricación propia de cocina" },
  { value: "<24 h", label: "tiempo de respuesta a tu cotización" },
  { value: "30+", label: "marcas nos avalan" },
] as const;

export function SuccessMetrics() {
  return (
    <section className="border-b border-rpc-border bg-rpc-announcement text-white">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
        <p className="text-xs font-semibold uppercase tracking-wide text-rpc-info">
          Track record
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl tracking-tight sm:text-4xl">
          Lo que respalda cada pedido.
        </h2>

        <dl className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {METRICS.map((m) => (
            <div key={m.label} className="border-t-2 border-rpc-accent pt-6">
              <dd className="font-rpc-heading text-4xl font-bold leading-none tracking-tight sm:text-5xl">
                {m.value}
              </dd>
              <dt className="mt-3 text-sm leading-snug text-white/70">
                {m.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
