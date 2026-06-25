/**
 * FAQ B2B del rubro textil corporativo. Respuestas honestas sin cifras
 * inventadas: donde el dato depende del producto, se dice explícitamente
 * ("lo ves en cada ficha" / "se confirma en la cotización").
 * Claims permitidos: 40+ años, modelo dual, respuesta <24 h.
 */
const FAQS = [
  {
    q: "¿Cuál es el mínimo de pedido por producto?",
    a: "Depende del producto. La mayoría son productos en stock en Chile que solo se personalizan, así que operan con mínimos bajos. Nuestra línea de ropa de cocina y uniformes, que fabricamos a tu medida, puede pedir un mínimo algo mayor. El mínimo concreto lo ves en cada ficha del catálogo, y si tienes dudas el equipo te lo confirma al cotizar.",
  },
  {
    q: "¿Qué técnica de personalización me conviene?",
    a: "Trabajamos bordado, serigrafía (1 color y full color), DTF, vinilo textil y sublimación. La elección depende de la prenda, del diseño y de la cantidad: el bordado da un acabado premium en camisas y polerones; la serigrafía rinde muy bien en volúmenes altos; el DTF permite full color con detalle fino; el vinilo es ideal para nombres y números; y la sublimación integra el color a la tela. Cada ficha muestra las técnicas disponibles, y al cotizar te recomendamos la que mejor calza con tu caso.",
  },
  {
    q: "¿Puedo mezclar tallas y colores en un mismo pedido?",
    a: "Sí. Defines tu curva de tallas y colores dentro de la cantidad total del pedido — por ejemplo, distintas cantidades de S, M, L y XL en negro y blanco de la misma prenda. Si no tienes clara la distribución para tu equipo, te ayudamos a armarla.",
  },
  {
    q: "¿Puedo ver una muestra antes de producir?",
    a: "Sí, en dos niveles. En el sitio puedes subir tu logo y verlo aplicado sobre el producto al instante. Y antes de entrar a producción, el equipo valida contigo el arte final (mockup) para que apruebes sobre seguro.",
  },
  {
    q: "¿Cuáles son los plazos de entrega? ¿Tienen plazo express?",
    a: "La mayoría de los productos están en stock en Chile y salen rápido, porque la prenda ya está acá y solo se personaliza. La ropa de cocina y los uniformes que fabricamos a medida toman algo más. Si necesitas algo realmente urgente, manejamos una opción express de 2 días para volúmenes bajos. El plazo concreto depende del producto, la cantidad y la técnica, y se confirma en la cotización en menos de 24 horas.",
  },
  {
    q: "¿Cómo funciona el descuento por volumen?",
    a: "El descuento se calcula sobre el TOTAL de unidades del pedido, no por cada producto. Si pides 5 poleras y 5 polerones, son 10 unidades en total y ambos entran al tramo de 10 u. Si pides 30 unidades repartidas entre poleras y gorros, los dos productos cotizan en el tramo de 25 u. Mientras más unidades suma el pedido completo, mejor precio unitario en todo lo que va dentro.",
  },
  {
    q: "¿Cuánto influye el tamaño del logo en el precio?",
    a: "Manejamos tres tamaños: insignia (5 a 12 cm, típico al pecho), tamaño carta (~28 cm, como una hoja A4) y gigantografía (sobre 33 cm, espalda completa). El precio del estampado sube según el tamaño, y cada logo en una zona extra (pecho + espalda, por ejemplo) se cobra aparte. En la ficha del producto eliges la zona; en la cotización afinamos el tamaño exacto.",
  },
  {
    q: "¿Cobran setup, fotolito o digitalización del logo?",
    a: "El bordado tiene una matriz (digitalización del logo) que se cobra una sola vez por logo, y queda gratis sobre 50 unidades. Para que la cotización salga limpia, idealmente nos envías el logo vectorizado: AI para estampado y PDF para bordado.",
  },
  {
    q: "¿Emiten factura? ¿Los precios incluyen IVA?",
    a: "Sí, emitimos factura electrónica a nombre de tu empresa (necesitamos razón social, RUT y giro). Todos los precios del catálogo y de la cotización son netos: el IVA del 19% se suma al final del documento, línea por línea, para que tu equipo de finanzas lo revise sin ambigüedad.",
  },
  {
    q: "¿Despachan a regiones?",
    a: "Sí, despachamos a todo Chile. En la Región Metropolitana el despacho es gratis sobre 25 unidades; a regiones se cotiza con el cliente según el destino y el volumen. El plazo y el valor del despacho se confirman en la cotización final.",
  },
  {
    q: "¿Cómo manejan el pago?",
    a: "Para clientes nuevos pedimos el 50% de adelanto al confirmar el pedido y el 50% restante contra entrega. También trabajamos con orden de compra contra entrega, o pago a 30 días si el cliente tiene historial o respaldo. La forma exacta la afinamos en la cotización.",
  },
  {
    q: "¿Hay cambios o devoluciones?",
    a: "Como las prendas se personalizan con el logo de cada cliente, los cambios y devoluciones aplican solo si hay un error de nuestro lado (defecto de producción, color o talla equivocada, arte distinto al aprobado). En cualquiera de esos casos lo resolvemos sin costo para ti.",
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
