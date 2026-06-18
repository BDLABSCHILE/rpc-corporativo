/**
 * FAQ B2B del rubro textil corporativo. Respuestas honestas sin cifras
 * inventadas: donde el dato depende del producto, se dice explícitamente
 * ("lo ves en cada ficha" / "se confirma en la cotización").
 * Claims permitidos: 40+ años, modelo dual, respuesta <24 h.
 */
const FAQS = [
  {
    q: "¿Cuál es el mínimo de pedido por producto?",
    a: "Depende del producto y del modo de trabajo. Los productos con stock express en Chile operan con mínimos bajos; los proyectos de fabricación a medida requieren volúmenes mayores porque se producen desde cero. El mínimo concreto lo ves en cada ficha del catálogo, y si tienes dudas el equipo te lo confirma al cotizar.",
  },
  {
    q: "¿Qué técnica de personalización me conviene?",
    a: "Trabajamos bordado, serigrafía (1 color y full color), transfer DTF, vinilo textil y sublimación. La elección depende de la prenda, del diseño y de la cantidad: el bordado da un acabado premium en camisas y polerones; la serigrafía rinde muy bien en volúmenes altos; el DTF permite full color con detalle fino; el vinilo es ideal para nombres y números; y la sublimación integra el color a la tela. Cada ficha muestra las técnicas disponibles, y al cotizar te recomendamos la que mejor calza con tu caso.",
  },
  {
    q: "¿Puedo mezclar tallas en un mismo pedido?",
    a: "Sí. Defines tu curva de tallas dentro de la cantidad total del pedido — por ejemplo, distintas cantidades de S, M, L y XL de la misma prenda. Si no tienes clara la distribución para tu equipo, te ayudamos a armarla.",
  },
  {
    q: "¿Puedo ver una muestra antes de producir?",
    a: "Sí, en dos niveles. En el sitio puedes subir tu logo y verlo aplicado sobre el producto al instante. Y antes de entrar a producción, el equipo valida contigo el arte final (mockup) para que apruebes sobre seguro.",
  },
  {
    q: "¿Cuáles son los plazos de entrega?",
    a: "Depende del modo. Los pedidos con stock express en Chile salen más rápido, porque la prenda ya está acá y solo se personaliza. Los proyectos de fabricación a medida toman más tiempo, porque se producen desde cero en nuestras fábricas. El plazo concreto depende del producto, la cantidad y la técnica — te lo confirmamos en la cotización, con respuesta en menos de 24 horas.",
  },
  {
    q: "¿Emiten factura? ¿Cómo se manejan los precios con IVA?",
    a: "Sí, emitimos factura electrónica a nombre de tu empresa (necesitamos razón social, RUT y giro). En la cotización formal ves el detalle de valores netos e IVA línea por línea, para que tu equipo de finanzas lo revise sin ambigüedad.",
  },
  {
    q: "¿Despachan a regiones?",
    a: "Sí, despachamos a todo Chile. El costo y el plazo del despacho dependen del volumen y del destino, y se confirman en la cotización final junto con el resto de las condiciones.",
  },
] as const;

export function FaqB2B() {
  return (
    <section className="border-b border-rpc-border bg-rpc-bg">
      <div className="mx-auto max-w-4xl px-6 py-20 lg:px-10 lg:py-24">
        <p className="text-xs font-semibold uppercase tracking-wide text-rpc-info-dark">
          Preguntas frecuentes
        </p>
        <h2 className="mt-3 text-3xl tracking-tight sm:text-4xl">
          Las dudas que escuchamos más seguido.
        </h2>

        <dl className="mt-12 divide-y divide-rpc-border border-t border-b border-rpc-border">
          {FAQS.map((faq) => (
            <details key={faq.q} className="group py-6">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
                <dt className="font-rpc-heading text-base font-bold tracking-tight text-rpc-text sm:text-lg">
                  {faq.q}
                </dt>
                <span
                  aria-hidden
                  className="mt-0.5 select-none font-rpc-heading text-2xl leading-none text-rpc-accent transition group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <dd className="mt-4 max-w-3xl text-sm leading-relaxed text-rpc-text/70 sm:text-base">
                {faq.a}
              </dd>
            </details>
          ))}
        </dl>
      </div>
    </section>
  );
}
