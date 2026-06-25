/**
 * Info detallada de cada técnica de impresión para el modal del configurador.
 *
 * Los `id` deben coincidir con los IDs de las PrintTechniques que vienen de
 * Shopify (ej. "serigrafia-1-color", "bordado", "dtf", "laser"). Si una técnica
 * no está mapeada acá, el modal cae a un texto genérico desde el product data.
 *
 * Cuando Benja pase fotos de muestras reales (mochila bordada, polera con
 * serigrafía, etc.), agregamos `imageUrl` a cada entrada y el modal las
 * mostrará. Por ahora son sólo texto.
 */

export type TechniqueDetail = {
  /** Match con t.id o t.label normalizado del producto. */
  matchKeys: string[];
  /** Título corto del modal. */
  headline: string;
  /** Párrafo descriptivo: qué es y cómo se ve. */
  description: string;
  /** Lista de características concretas. */
  features: string[];
  /** Para qué tipo de logo/diseño funciona mejor. */
  bestFor: string;
  /** Limitaciones honestas. */
  limitations?: string;
  /** URL de foto de muestra real (opcional, completar cuando lleguen assets). */
  imageUrl?: string;
};

export const TECHNIQUE_INFO: readonly TechniqueDetail[] = [
  {
    matchKeys: [
      "serigrafia-1-color",
      "serigrafia_1c",
      "serigrafia",
      "serigrafía",
      "serigrafía 1 color",
    ],
    headline: "Serigrafía 1 color",
    description:
      "Estampa por capas, similar a un sello industrial. Se aplica tinta sólida en una sola tonalidad sobre la prenda. Tacto firme, durable a lavados y al uso diario. Es la técnica clásica de uniformes y bolsos corporativos.",
    features: [
      "1 sola tinta plana (ej: blanco sobre negro)",
      "Durable: aguanta lavado de máquina y uso intensivo",
      "Precios por tamaño: insignia (5–12 cm) $1.000, carta (~28 cm) $2.000 por prenda",
      "Mínimo 20 unidades · costo por unidad muy bajo en volúmenes grandes",
    ],
    bestFor:
      "Logos simples de 1 a 2 colores planos, sin degradados ni detalles finos.",
    limitations:
      "No reproduce degradados ni fotos. Si tu logo tiene más de 2 colores, conviene serigrafía full color o DTF.",
  },
  {
    matchKeys: ["serigrafia-full-color", "serigrafia_full", "serigrafía full color", "full color"],
    headline: "Serigrafía full color",
    description:
      "Variante de serigrafía con varias capas de tinta para reproducir logos con hasta 4 colores. Cada color es una pasada distinta y el resultado es premium: colores planos vivos y precisión cromática.",
    features: [
      "Hasta 4 colores planos por logo",
      "Excelente fidelidad de color",
      "Tacto firme y resistente",
      "Precios por tamaño: insignia (5–12 cm) $2.000, carta (~28 cm) $3.000 por prenda",
      "Mínimo 20 unidades",
    ],
    bestFor:
      "Logos con 2 a 4 colores sólidos, sin degradados. Marcas con identidad cromática fuerte.",
    limitations:
      "No reproduce degradados, fotos ni detalles muy finos. Para eso, DTF.",
  },
  {
    matchKeys: ["bordado", "embroidery"],
    headline: "Bordado",
    description:
      "Aplicación con hilo cosido directo sobre la tela. Es la técnica más premium en percepción: textura tridimensional, brillo del hilo y sensación artesanal. Imprescindible en camisas, polerones y jockeys de uniforme corporativo.",
    features: [
      "Textura 3D real con hilo poliéster",
      "Mayor durabilidad: no se desgasta como una impresión",
      "Precios por tamaño: insignia (5–12 cm) $2.500, carta (~28 cm) $5.000, gigantografía (>33 cm) $7.000 por prenda",
      "Matriz del logo: se cobra una sola vez por arte · gratis sobre 50 unidades",
      "Mínimo 10 unidades",
    ],
    bestFor:
      "Logos compactos sobre camisas, polerones, jockeys y polar. Marcas que comunican calidad y legado.",
    limitations:
      "No funciona bien con detalles finos (texto chico <8 mm), degradados ni fotos. Tarda algo más que las técnicas planas.",
  },
  {
    matchKeys: ["dtf", "transfer_dtf", "transfer-dtf", "transfer dtf"],
    headline: "DTF",
    description:
      "Direct-To-Film: imprime tu diseño en una película especial que se transfiere por calor a la tela. Permite full color, degradados, fotos y detalles finos. Es la técnica más versátil para artes complejos.",
    features: [
      "Reproduce cualquier color, degradados y fotos",
      "Detalles finos perfectos, incluso texto chico",
      "Sin setup: pagas solo por prenda",
      "Precios por tamaño: insignia (5–12 cm) $2.500, carta (~28 cm) $4.500, gigantografía (>33 cm) $6.500 por prenda",
      "Mínimo 10 unidades · resistente al lavado",
    ],
    bestFor:
      "Logos full color, ilustraciones, fotos y diseños complejos. Cuando la fidelidad visual importa más que la textura.",
    limitations:
      "Tacto más plástico que serigrafía (se siente la película). En zonas muy grandes, el tacto es notorio.",
  },
  {
    matchKeys: ["vinilo", "vinilo textil", "vinilo textil (corte)", "vinilo-textil"],
    headline: "Vinilo textil (corte)",
    description:
      "Lámina de vinilo termoadhesivo que se corta con la forma del diseño y se aplica por calor sobre la tela. Acabado liso y prolijo, muy usado para números, nombres y logos planos en ropa deportiva.",
    features: [
      "Colores planos sólidos, bordes nítidos",
      "Ideal para nombres y números personalizados por prenda",
      "Sin costo de setup",
      "Precios por tamaño: insignia (5–12 cm) $2.800, carta (~28 cm) $5.000 por prenda",
    ],
    bestFor:
      "Logos y textos de 1 a 2 colores planos, numeración y nombres. Equipos deportivos y prendas donde cada unidad lleva un dato distinto.",
    limitations:
      "No reproduce degradados, fotos ni muchos colores: cada color es una lámina aparte. Para full color, DTF.",
  },
  {
    matchKeys: ["sublimacion", "sublimación"],
    headline: "Sublimación",
    description:
      "La tinta se integra a la fibra del poliéster claro o a la superficie del accesorio (tazones, bandanas). Reproduce full color y se siente como parte de la tela: no hay textura adicional.",
    features: [
      "Full color con degradados y fotos",
      "Sin tacto añadido: el color es parte de la tela",
      "Ideal para poliéster claro, no funciona en algodón ni colores oscuros",
      "Precio se confirma al cotizar (tarifa por definir con la marca)",
    ],
    bestFor:
      "Bandanas, tazones, banderines, prendas deportivas claras 100% poliéster con artes a todo color.",
    limitations:
      "Solo funciona sobre poliéster claro o accesorios con coating sublimable. No sirve en algodón ni en prendas oscuras.",
  },
  {
    matchKeys: ["laser", "grabado-laser", "grabado láser"],
    headline: "Grabado láser",
    description:
      "Quema controlada del material para dejar el logo grabado en relieve (sin tinta). Se usa sobre cuero, madera, metal o productos duros. Es elegante, permanente y muy premium en percepción.",
    features: [
      "Permanente — no se borra ni con lavado",
      "Sin tinta: el grabado es el material mismo",
      "Look minimalista premium",
      "Ideal para billeteras, llaveros, botellas metálicas",
    ],
    bestFor:
      "Productos rígidos: cuero (billeteras), madera, metal (botellas, llaveros). Logos minimalistas, wordmarks, monogramas.",
    limitations:
      "Solo en materiales rígidos compatibles. No funciona en tela suave (mochilas, poleras). Es monocromo por naturaleza (el color del material grabado).",
  },
] as const;

/**
 * Busca info detallada de una técnica por id o label.
 * Si no hay match, devuelve null y el modal cae a la descripción del product.
 */
export function findTechniqueDetail(
  idOrLabel: string,
): TechniqueDetail | null {
  const normalized = idOrLabel.toLowerCase().trim();
  for (const detail of TECHNIQUE_INFO) {
    if (detail.matchKeys.some((k) => k.toLowerCase() === normalized)) {
      return detail;
    }
  }
  return null;
}
