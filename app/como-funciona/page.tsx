import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  QuoteIcon,
  ApproveIcon,
  ConfigureIcon,
  DeliveryIcon,
  BoltIcon,
  PencilIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Cómo funciona",
  description:
    "Stock en Chile listo para personalizar con tu logo, más fabricación propia de ropa de cocina y uniformes. Cotiza online, recibe mockup y confirmación en menos de 24 horas, y entregamos.",
};

/**
 * /como-funciona — el modelo de Ropa Publicitaria Chile como protagonista.
 *
 * Modelo real del cliente: stock en Chile que se personaliza con tu logo +
 * fabricación propia de la línea de cocina y uniformes (40+ años de oficio).
 * Sin plazos numéricos: cada ficha del catálogo indica el suyo y el equipo lo
 * confirma al cerrar. Promesa real: respuesta en menos de 24 horas.
 */
export default function ComoFuncionaPage() {
  return (
    <>
      {/* Header editorial */}
      <section className="border-b border-rpc-border bg-rpc-bg">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-28">
          <p className="text-[10px] uppercase tracking-[0.25em] text-rpc-text/60 sm:text-xs">
            Cómo funciona
          </p>
          <h1 className="mt-4 max-w-4xl text-3xl leading-[1.05] sm:mt-6 sm:text-5xl lg:text-6xl">
            Dos caminos, un mismo equipo detrás.
          </h1>
          <p className="mt-6 max-w-2xl font-rpc-body text-base normal-case tracking-normal text-rpc-text/75 sm:mt-8 sm:text-lg">
            Llevamos más de 40 años en vestuario corporativo y merchandising.
            Por eso podemos ofrecerte lo mejor de dos mundos: stock listo en
            Chile para personalizar rápido, y fabricación propia de nuestra
            línea de ropa de cocina y uniformes.
          </p>
        </div>
      </section>

      {/* Modelo dual — protagonista */}
      <section className="border-b border-rpc-border bg-rpc-surface">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
          <p className="text-xs uppercase tracking-[0.25em] text-rpc-text/60">
            Nuestro modelo
          </p>
          <h2 className="mt-4 max-w-3xl text-2xl leading-[1.1] sm:text-3xl lg:text-4xl">
            Elige el camino que tu proyecto necesita.
          </h2>

          <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:gap-8">
            <article className="rounded-rpc-card border border-rpc-info/40 bg-rpc-bg p-8 lg:p-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rpc-info/10 text-rpc-info-dark">
                <BoltIcon className="h-6 w-6" />
              </div>
              <p className="mt-5 text-[10px] uppercase tracking-[0.22em] text-rpc-info-dark">
                Camino A
              </p>
              <h3 className="mt-3 font-rpc-heading text-xl text-rpc-text sm:text-2xl">
                Stock en Chile
              </h3>
              <p className="mt-4 font-rpc-body text-sm normal-case tracking-normal text-rpc-text/70 sm:text-base">
                Productos en stock en Chile, listos para personalizar con tu
                logo. Respuesta rápida y mínimos bajos: la opción cuando el
                tiempo apremia o el pedido es acotado. Cada ficha del catálogo
                indica su disponibilidad y su plazo.
              </p>
              <ul className="mt-6 space-y-2">
                {[
                  "Stock disponible en Chile",
                  "Mínimos bajos por producto",
                  "Solo pasa por personalización: bordado, serigrafía, DTF o sublimación",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 font-rpc-body text-sm normal-case tracking-normal text-rpc-text/85"
                  >
                    <span
                      aria-hidden
                      className="mt-[7px] inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-rpc-info"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-rpc-card border border-rpc-border bg-rpc-bg p-8 lg:p-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rpc-accent/10 text-rpc-accent-dark">
                <PencilIcon className="h-6 w-6" />
              </div>
              <p className="mt-5 text-[10px] uppercase tracking-[0.22em] text-rpc-accent-dark">
                Camino B
              </p>
              <h3 className="mt-3 font-rpc-heading text-xl text-rpc-text sm:text-2xl">
                Fabricación propia: cocina y uniformes
              </h3>
              <p className="mt-4 font-rpc-body text-sm normal-case tracking-normal text-rpc-text/70 sm:text-base">
                Fabricamos nuestra propia línea de ropa de cocina y uniformes
                —delantales, chaquetas de chef, gorros y cofias— a tu medida y
                con asesoría de diseño. Telas, colores y acabados a elección,
                con tu marca. El plazo se planifica contigo al cotizar.
              </p>
              <ul className="mt-6 space-y-2">
                {[
                  "Más de 40 años de oficio fabricando uniformes",
                  "Asesoría de diseño para tu línea",
                  "Telas, colores y acabados a tu elección",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 font-rpc-body text-sm normal-case tracking-normal text-rpc-text/85"
                  >
                    <span
                      aria-hidden
                      className="mt-[7px] inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-rpc-accent"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* 4 pasos */}
      <section className="border-b border-rpc-border bg-rpc-bg">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <Step
            number="01"
            title="Cotiza online"
            icon={<QuoteIcon className="h-7 w-7 text-rpc-text" />}
            body="Explora el catálogo, sube tu logo y míralo aplicado sobre los productos. Eliges técnica, cantidades y zona de aplicación, y envías tu cotización. Sin compromiso y sin pago online: cotizar no te ata a nada."
            highlights={[
              "Mira el catálogo con tu logo aplicado",
              "Mezcla varios productos en una sola cotización",
              "Cotiza sin compromiso",
            ]}
          />
          <Step
            number="02"
            title="Mockup y confirmación"
            icon={<ApproveIcon className="h-7 w-7 text-rpc-text" />}
            body="Te respondemos en menos de 24 horas. El equipo revisa tu cotización, confirma disponibilidad, precios y plazos, y te envía un mockup de cómo queda tu logo aplicado. Nada entra a producción sin tu visto bueno."
            highlights={[
              "Respuesta en menos de 24 horas",
              "Mockup de aprobación antes de producir",
              "Una persona del equipo te acompaña hasta cerrar",
            ]}
          />
          <Step
            number="03"
            title="Producción"
            icon={<ConfigureIcon className="h-7 w-7 text-rpc-text" />}
            body="Con tu aprobación, partimos. Si es un producto en stock, tu pedido pasa directo a personalización en Chile. Si es ropa de cocina o uniformes que fabricamos a medida, la producción corre en nuestro taller con seguimiento del equipo de principio a fin."
            highlights={[
              "Bordado, serigrafía, transfer DTF y sublimación",
              "Más de 40 años de oficio detrás de cada prenda",
              "Cada ficha del catálogo indica el plazo de su flujo",
            ]}
          />
          <Step
            number="04"
            title="Entrega"
            icon={<DeliveryIcon className="h-7 w-7 text-rpc-text" />}
            body="Coordinamos la entrega directamente contigo. El plazo total depende del producto y la técnica: lo ves en cada ficha y el equipo te lo confirma por escrito al cerrar la cotización."
            highlights={[
              "Plazo confirmado por el equipo al cerrar",
              "Coordinación directa, sin intermediarios",
              "Te avisamos en cada etapa del pedido",
            ]}
            last
          />
        </div>
      </section>

      {/* Técnicas de personalización */}
      <section className="border-b border-rpc-border bg-rpc-bg">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
          <p className="text-xs uppercase tracking-[0.25em] text-rpc-text/60">
            Técnicas de personalización
          </p>
          <h2 className="mt-4 max-w-3xl text-2xl leading-[1.1] sm:text-3xl lg:text-4xl">
            La técnica correcta para cada prenda y cada logo.
          </h2>
          <p className="mt-4 max-w-2xl font-rpc-body text-sm normal-case tracking-normal text-rpc-text/70 sm:text-base">
            No todas las técnicas sirven para todo. Al cotizar te recomendamos
            la que mejor calza con tu arte, la prenda y el tiraje.
          </p>

          <dl className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            <TechniqueCard
              name="Bordado"
              detail="El acabado más durable y premium para vestuario corporativo. Ideal para logos al pecho, jockeys y poleras piqué."
            />
            <TechniqueCard
              name="Serigrafía"
              detail="En 1 color o full color. Económica y resistente para tirajes grandes: poleras de evento, bolsas y activaciones."
            />
            <TechniqueCard
              name="Transfer DTF"
              detail="Full color con gran detalle en cualquier tela. Recomendado para tirajes pequeños y medianos."
            />
            <TechniqueCard
              name="Sublimación"
              detail="Impresión integrada a la tela (poliéster claro) o al tazón. Colores vivos que no se despegan."
            />
          </dl>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-rpc-announcement text-rpc-button-text">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-6 py-20 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-24">
          <div className="max-w-2xl">
            <h2 className="text-2xl leading-[1.1] sm:text-3xl lg:text-4xl">
              Cotiza sin compromiso.
            </h2>
            <p className="mt-3 font-rpc-body text-sm normal-case tracking-normal opacity-75 sm:text-base">
              Te respondemos en menos de 24 horas.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/catalogo"
              className="inline-flex items-center justify-center gap-2 rounded-rpc-button bg-rpc-accent px-8 py-4 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-rpc-accent-dark"
            >
              Ver catálogo
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center rounded-rpc-button border border-rpc-button-text px-8 py-4 text-xs uppercase tracking-[0.2em] text-rpc-button-text transition hover:bg-rpc-button-text hover:text-rpc-announcement"
            >
              Hablar con el equipo
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Step({
  number,
  title,
  icon,
  body,
  highlights,
  last,
}: {
  number: string;
  title: string;
  icon: ReactNode;
  body: string;
  highlights: readonly string[];
  last?: boolean;
}) {
  return (
    <article
      className={
        last
          ? "grid gap-6 py-12 first:pt-0 lg:grid-cols-[140px_1fr] lg:gap-16 lg:py-20"
          : "grid gap-6 border-b border-rpc-border py-12 first:pt-0 lg:grid-cols-[140px_1fr] lg:gap-16 lg:py-20"
      }
    >
      <div className="flex items-start gap-4 lg:flex-col lg:gap-5">
        <p className="font-rpc-heading text-5xl leading-none text-rpc-text/20 sm:text-6xl lg:text-7xl">
          {number}
        </p>
        {/* Icon en círculo: refuerza el tema del paso sin competir con el número */}
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-rpc-text/30 lg:h-14 lg:w-14">
          {icon}
        </div>
      </div>

      <div className="max-w-3xl">
        <h3 className="font-rpc-heading text-2xl text-rpc-text sm:text-3xl">
          {title}
        </h3>
        <p className="mt-4 font-rpc-body text-base normal-case tracking-normal text-rpc-text/75 sm:mt-5 sm:text-lg">
          {body}
        </p>
        <ul className="mt-6 space-y-2 sm:mt-8">
          {highlights.map((h) => (
            <li
              key={h}
              className="flex items-start gap-3 font-rpc-body text-sm normal-case tracking-normal text-rpc-text/85"
            >
              <span
                aria-hidden
                className="mt-[6px] inline-block h-1 w-3 flex-shrink-0 bg-rpc-accent"
              />
              {h}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function TechniqueCard({ name, detail }: { name: string; detail: string }) {
  return (
    <div className="border-t-2 border-rpc-accent pt-5">
      <dt className="font-rpc-heading text-xl text-rpc-text sm:text-2xl">
        {name}
      </dt>
      <dd className="mt-3 font-rpc-body text-sm normal-case tracking-normal text-rpc-text/70">
        {detail}
      </dd>
    </div>
  );
}
