/**
 * "Nuestros trabajos" — galería de trabajos REALES de Ropa Publicitaria Chile.
 *
 * Cada entrada corresponde a una foto real de producción entregada por la
 * marca (public/trabajos/*.webp). La copy describe SOLO lo que se ve en la
 * foto —prenda, color, técnica y la marca cuyo logo aparece— sin inventar
 * cantidades, plazos ni historias. Es prueba social honesta.
 *
 * `productHandles` cruza cada trabajo con los productos del catálogo que
 * aparecen en la foto, para mostrarlo en la PDP ("así se ve con tu logo").
 * Solo se listan handles que existen en el catálogo (mock.ts).
 */

export type WorkTechnique = "Bordado" | "Serigrafía" | "DTF" | "Estampado";

export type RealWork = {
  /** Slug estable = nombre del archivo en public/trabajos/. */
  slug: string;
  /** Marca cuyo logo aparece en la prenda. `null` cuando es una tanda multimarca. */
  client: string | null;
  /** Etiqueta corta para la tarjeta (sin la marca, se muestra aparte). */
  summary: string;
  /** 1–2 frases describiendo lo que se ve. Chileno neutro, "tú". */
  detail: string;
  /** Prendas visibles en la foto. */
  garments: readonly string[];
  /** Técnicas de personalización aplicadas. */
  techniques: readonly WorkTechnique[];
  /** Imagen en public/trabajos/. */
  image: string;
  width: number;
  height: number;
  /** Handles del catálogo que aparecen en la foto (para cruce en la PDP). */
  productHandles: readonly string[];
};

/**
 * Orden curado de la galería: parte por marcas reconocibles y variedad de
 * técnica, para dar confianza apenas se entra a la página.
 */
export const REAL_WORKS: readonly RealWork[] = [
  {
    slug: "claro-poleras-pique",
    client: "Claro",
    summary: "Poleras piqué rojas con logo bordado",
    detail:
      "Polera piqué en rojo corporativo con el logo de Claro bordado al pecho. El bordado aguanta lavados y uso diario sin perder definición — ideal para equipos en terreno y atención a público.",
    garments: ["Polera piqué cuello y botones"],
    techniques: ["Bordado"],
    image: "/trabajos/claro-poleras-pique.webp",
    width: 1200,
    height: 1235,
    productHandles: ["polera-pique-cuello-botones-manga-corta"],
  },
  {
    slug: "funpark-mix",
    client: "Funpark",
    summary: "Softshell y blusa bordadas + polerones estampados",
    detail:
      "Programa de vestuario completo para Funpark: softshell azul marino y blusa celeste con el logo bordado, más polerones canguro naranjo y morado con estampado full color. Una misma identidad, consistente en prendas y técnicas distintas.",
    garments: ["Softshell", "Blusa Oxford", "Polerón canguro"],
    techniques: ["Bordado", "Estampado"],
    image: "/trabajos/funpark-mix.webp",
    width: 1200,
    height: 1033,
    productHandles: ["softshell-hombre", "blusa-oxford", "poleron-canguro"],
  },
  {
    slug: "mcdonalds-mcdelivery",
    client: "McDonald's",
    summary: "Uniforme McDelivery: cortavientos, poleras y polar",
    detail:
      "Programa para McDonald's / McDelivery: cortavientos negro estampado, polar y poleras piqué (azul, verde, gris) con los arcos dorados bordados, más camisa con el sello McDelivery. Bordado y estampado conviviendo en un mismo uniforme.",
    garments: ["Cortavientos", "Polera piqué", "Polar", "Camisa"],
    techniques: ["Bordado", "Estampado"],
    image: "/trabajos/mcdonalds-mcdelivery.webp",
    width: 1200,
    height: 1313,
    productHandles: [
      "cortavientos",
      "polera-pique-cuello-botones-manga-corta",
      "polar-manga-larga",
    ],
  },
  {
    slug: "agendapro-pique-poleron",
    client: "AgendaPro",
    summary: "Polera bordada y polerón con doble estampado",
    detail:
      "Para AgendaPro: polera piqué azul marino con el logo bordado y polerón con doble estampado —logo al pecho y mensaje de marca («Gestiona citas, clientes y pagos en un solo lugar» + el sitio). Prenda que además vende.",
    garments: ["Polera piqué", "Polerón"],
    techniques: ["Bordado", "Estampado"],
    image: "/trabajos/agendapro-pique-poleron.webp",
    width: 750,
    height: 901,
    productHandles: [
      "polera-pique-cuello-botones-manga-corta",
      "poleron-polo-cuello-redondo",
    ],
  },
  {
    slug: "ibm-transportes",
    client: "IBM Transportes",
    summary: "Uniforme de equipo: polar, polera y chaleco bordados",
    detail:
      "Set completo para IBM Transportes: polar con cierre, polera piqué gris y chaleco multibolsillos, todo con el logo bordado en el mismo lugar. Un equipo entero vestido parejo, prenda por prenda.",
    garments: ["Polar manga larga", "Polera piqué", "Chaleco de trabajo"],
    techniques: ["Bordado"],
    image: "/trabajos/ibm-transportes.webp",
    width: 1200,
    height: 1811,
    productHandles: ["polar-manga-larga", "polera-pique-cuello-botones-manga-corta"],
  },
  {
    slug: "edenred-poleron-polo",
    client: "Edenred",
    summary: "Polerón rojo con estampado al pecho y espalda",
    detail:
      "Polerón rojo para Edenred con doble serigrafía: logo al pecho y mensaje de campaña a la espalda («Impulsamos la alegría de vivir»). Ropa corporativa que además comunica.",
    garments: ["Polerón cuello redondo"],
    techniques: ["Serigrafía"],
    image: "/trabajos/edenred-poleron-polo.webp",
    width: 1200,
    height: 1588,
    productHandles: ["poleron-polo-cuello-redondo"],
  },
  {
    slug: "natura-jockey-cortavientos",
    client: "Natura",
    summary: "Jockeys y cortavientos con el isotipo estampado",
    detail:
      "Jockeys blanco y naranjo y cortavientos para Natura, con el isotipo de la flor estampado —a gran tamaño en la prenda y en versión chica al frente del jockey. Una marca que se reconoce de lejos.",
    garments: ["Jockey", "Cortavientos"],
    techniques: ["Estampado"],
    image: "/trabajos/natura-jockey-cortavientos.webp",
    width: 1200,
    height: 1059,
    productHandles: ["jockey", "cortavientos"],
  },
  {
    slug: "dtf-canguros-colores",
    client: null,
    summary: "Polerones canguro en seis colores, estampado DTF",
    detail:
      "Una misma tanda de polerones canguro en seis colores con estampado DTF full color en espalda y pecho. El DTF rinde degradés e ilustraciones con muchos colores sin recargo por tono.",
    garments: ["Polerón canguro"],
    techniques: ["DTF"],
    image: "/trabajos/dtf-canguros-colores.webp",
    width: 1200,
    height: 1833,
    productHandles: ["poleron-canguro"],
  },
  {
    slug: "maihue-cortavientos",
    client: "Maihue",
    summary: "Cortavientos deportivo azulino con logo bordado",
    detail:
      "Conjunto cortavientos para Maihue en azul, con el logo bordado al pecho y en la pierna. Liviano, plegable y resistente al viento para uso deportivo y de terreno.",
    garments: ["Cortavientos", "Pantalón cortaviento"],
    techniques: ["Bordado"],
    image: "/trabajos/maihue-cortavientos.webp",
    width: 1200,
    height: 1794,
    productHandles: ["cortavientos"],
  },
  {
    slug: "chile-hockey-cortavientos",
    client: "Chile Hockey",
    summary: "Cortavientos y jockeys rojos para los Panamericanos Junior",
    detail:
      "Cortavientos y jockeys rojos para la delegación de Chile Hockey en los Junior Pan American Cups 2020, Santiago. Estampado nítido del logo del equipo y del evento sobre rojo.",
    garments: ["Cortavientos", "Jockey"],
    techniques: ["Estampado"],
    image: "/trabajos/chile-hockey-cortavientos.webp",
    width: 1200,
    height: 924,
    productHandles: ["cortavientos", "jockey"],
  },
  {
    slug: "bluey-canguro-serigrafia",
    client: "Bluey's Playground",
    summary: "Polerón canguro celeste, serigrafía pecho y espalda",
    detail:
      "Polerón canguro celeste con serigrafía en la espalda (logo grande + «STAFF») y al pecho. Para uniformar a un equipo de evento, la serigrafía rinde mejor el costo por unidad en tiradas grandes.",
    garments: ["Polerón canguro"],
    techniques: ["Serigrafía"],
    image: "/trabajos/bluey-canguro-serigrafia.webp",
    width: 1200,
    height: 1630,
    productHandles: ["poleron-canguro"],
  },
  {
    slug: "del-cerro-polar-sin-manga",
    client: "Hotel y Restaurante del Cerro",
    summary: "Polar sin manga negro con dos bordados dorados",
    detail:
      "Polar sin manga negro para Hotel y Restaurante del Cerro, con dos logos bordados en hilo dorado al pecho. Dos marcas de una misma casa, juntas en una sola prenda.",
    garments: ["Polar sin manga"],
    techniques: ["Bordado"],
    image: "/trabajos/del-cerro-polar-sin-manga.webp",
    width: 1200,
    height: 1585,
    productHandles: ["polar-sin-manga"],
  },
  {
    slug: "dunalastair-polera-dryfit",
    client: "Dunalastair School",
    summary: "Polera dry-fit jaspeada con escudo y nombre estampados",
    detail:
      "Polera dry-fit celeste jaspeada para Dunalastair School, con el escudo del colegio al pecho y el rol del equipo («Coach», «Dobs & Dunners») estampado. Pensada para deportes y educación física.",
    garments: ["Polera dry-fit cuello redondo"],
    techniques: ["Estampado"],
    image: "/trabajos/dunalastair-polera-dryfit.webp",
    width: 1200,
    height: 1588,
    productHandles: ["polera-dry-fit-cuello-redondo"],
  },
  {
    slug: "family-festival-canguro",
    client: "Family Festival",
    summary: "Polerón canguro verde pistacho estampado",
    detail:
      "Polerón canguro en verde pistacho con el logo de Family Festival estampado full color al frente. Un color de prenda fuera de lo común, elegido a tono con la identidad del evento.",
    garments: ["Polerón canguro"],
    techniques: ["Estampado"],
    image: "/trabajos/family-festival-canguro.webp",
    width: 1200,
    height: 1694,
    productHandles: ["poleron-canguro"],
  },
  {
    slug: "bice-ventures-poleron",
    client: "BICE Ventures",
    summary: "Poleras negras estampadas para tres marcas BICE",
    detail:
      "Poleras negras para el ecosistema BICE Ventures: estampados de BICE Ventures, amparo id y beliv (by BICE). Una identidad por equipo, misma prenda base.",
    garments: ["Polera cuello redondo"],
    techniques: ["Estampado"],
    image: "/trabajos/bice-ventures-poleron.webp",
    width: 1200,
    height: 1204,
    productHandles: ["polera-cuello-redondo-manga-corta"],
  },
  {
    slug: "maz-honda-pique",
    client: "Maz Honda",
    summary: "Poleras piqué en cuatro colores con logo bordado",
    detail:
      "Poleras piqué para Maz Honda en blanco, rojo, azul marino y negro, con el logo bordado al pecho. Un mismo bordado, prolijo en cada color de la prenda.",
    garments: ["Polera piqué cuello y botones"],
    techniques: ["Bordado"],
    image: "/trabajos/maz-honda-pique.webp",
    width: 1200,
    height: 1007,
    productHandles: ["polera-pique-cuello-botones-manga-corta"],
  },
  {
    slug: "fanys-bakery-uniformes",
    client: "Fany's Bakery",
    summary: "Delantales, chaqueta de chef y poleras a juego",
    detail:
      "Línea de cocina para Fany's Bakery: delantales y chaqueta de chef con el logo bordado, más poleras y bolsa estampadas. Justo la línea de ropa de cocina y uniformes que fabricamos a medida.",
    garments: ["Delantal", "Chaqueta de chef", "Polera"],
    techniques: ["Bordado", "Estampado"],
    image: "/trabajos/fanys-bakery-uniformes.webp",
    width: 1200,
    height: 1800,
    productHandles: ["pechera", "chaqueta-chef", "polera-cuello-redondo-manga-corta"],
  },
  {
    slug: "denisse-malebran-corazon-salvaje",
    client: "Denisse Malebrán",
    summary: "Poleras de gira con estampado full color DTF",
    detail:
      "Merch de la gira «Corazón Salvaje» de Denisse Malebrán: poleras negras con estampado full color en DTF —ilustración a la espalda y foto a todo color al frente. El DTF rinde fotografías sin perder detalle.",
    garments: ["Polera cuello redondo"],
    techniques: ["DTF"],
    image: "/trabajos/denisse-malebran-corazon-salvaje.webp",
    width: 1200,
    height: 1111,
    productHandles: ["polera-cuello-redondo-manga-corta"],
  },
  {
    slug: "ignamar-savory",
    client: "Ignamar",
    summary: "Poleras y camisas para la distribuidora de Savory",
    detail:
      "Vestuario para Ignamar, distribuidora de Nestlé Savory: poleras piqué (negro, gris) y camisas outdoor y de jeans con el logo del búho bordado, más el parche de Savory. Para equipos de venta y reparto en terreno.",
    garments: ["Polera piqué", "Camisa outdoor", "Camisa de jeans"],
    techniques: ["Bordado"],
    image: "/trabajos/ignamar-savory.webp",
    width: 1200,
    height: 1111,
    productHandles: [
      "polera-pique-cuello-botones-manga-corta",
      "camisa-outdoor",
      "camisa-jeans",
    ],
  },
  {
    slug: "cardinale-polar-pique",
    client: "Cardinale",
    summary: "Polar sin manga y polera negros con bordado",
    detail:
      "Para Cardinale («Zapateros desde 1964»): polar sin manga y polera piqué negros, con el nombre bordado al pecho. Sobrio y a tono con una marca de tradición.",
    garments: ["Polar sin manga", "Polera piqué"],
    techniques: ["Bordado"],
    image: "/trabajos/cardinale-polar-pique.webp",
    width: 1200,
    height: 1123,
    productHandles: ["polar-sin-manga", "polera-pique-cuello-botones-manga-corta"],
  },
  {
    slug: "chile-hockey-nations-cup",
    client: "Chile Hockey",
    summary: "Poleras dry-fit rojas para la Nations Cup NZ",
    detail:
      "Poleras dry-fit rojas para la selección de Chile Hockey en la Nations Cup (Nueva Zelanda), con estampado blanco del equipo y el evento al pecho y la espalda. Livianas y transpirables para competir.",
    garments: ["Polera dry-fit"],
    techniques: ["Estampado"],
    image: "/trabajos/chile-hockey-nations-cup.webp",
    width: 1200,
    height: 1340,
    productHandles: ["polera-dry-fit-cuello-redondo"],
  },
  {
    slug: "ef-gorros-lana",
    client: "EF",
    summary: "Gorros de lana fucsia con logo bordado",
    detail:
      "Gorros de lana en fucsia para EF, con el logo bordado en el doblez. Color fuerte y bordado que resiste el frío y el uso diario.",
    garments: ["Gorro de lana"],
    techniques: ["Bordado"],
    image: "/trabajos/ef-gorros-lana.webp",
    width: 750,
    height: 1049,
    productHandles: ["gorro-lana"],
  },
  {
    slug: "el-parque-softshell",
    client: "Jardín Infantil El Parque",
    summary: "Softshell negro con logo bordado a color",
    detail:
      "Softshell negro para el Jardín Infantil El Parque, con el logo bordado a color al pecho. Abrigador y resistente para el equipo educativo, dentro y fuera de la sala.",
    garments: ["Softshell"],
    techniques: ["Bordado"],
    image: "/trabajos/el-parque-softshell.webp",
    width: 750,
    height: 937,
    productHandles: ["softshell-hombre"],
  },
  {
    slug: "malls-poleron-polo",
    client: "Malls",
    summary: "Poleras para Mall Marina, Curicó y más",
    detail:
      "Poleras negras para varios centros comerciales —Mall Marina, Mall Curicó, Mall Barrio Independencia y MallCentro— cada uno con su logo estampado. Una misma prenda, varias marcas de un mismo grupo.",
    garments: ["Polera cuello redondo"],
    techniques: ["Estampado"],
    image: "/trabajos/malls-poleron-polo.webp",
    width: 1200,
    height: 878,
    productHandles: ["polera-cuello-redondo-manga-corta"],
  },
  {
    slug: "bolsas-lona-personalizadas",
    client: null,
    summary: "Bolsas de lona con diseños y frases personalizadas",
    detail:
      "Bolsas de lona personalizadas con ilustraciones y frases —prácticas, livianas y reutilizables. Otra forma de llevar tu marca (o tu mensaje) a la calle.",
    garments: ["Bolsa de lona"],
    techniques: ["Estampado"],
    image: "/trabajos/bolsas-lona-personalizadas.webp",
    width: 1200,
    height: 1594,
    productHandles: [],
  },
  // — Generación / egresados (destacados) —
  {
    slug: "grange-school-gen-26",
    client: "The Grange School",
    summary: "Polerón de generación 2026, todo bordado",
    detail:
      "Polerón canguro azul marino para la Generación 2026 de The Grange School: el nombre del colegio al pecho, el apodo de cada quien al frente y la espalda con todos los nombres del curso y la mascota — todo bordado. El clásico polerón de generación que se usa por años.",
    garments: ["Polerón canguro"],
    techniques: ["Bordado"],
    image: "/trabajos/grange-school-gen-26.webp",
    width: 1200,
    height: 1600,
    productHandles: ["poleron-canguro"],
  },
  {
    slug: "studi-generacion",
    client: "Studi",
    summary: "Polerones de generación con el nombre de cada quien",
    detail:
      "Set de generación para Studi: polerones canguro azul marino con el logo al pecho y el nombre de cada integrante estampado a la espalda, más polera blanca y un código QR. Personalización uno a uno, prenda por prenda.",
    garments: ["Polerón canguro", "Polera"],
    techniques: ["Estampado"],
    image: "/trabajos/studi-generacion.webp",
    width: 1009,
    height: 1280,
    productHandles: ["poleron-canguro", "polera-cuello-redondo-manga-corta"],  },
  {
    slug: "grange-school-gen-2023",
    client: "The Grange School",
    summary: "Chalecos de generación 2023 con escudo bordado",
    detail:
      "Chalecos sin manga acolchados azul marino para la Generación 2023 de The Grange School, con el escudo del colegio bordado al pecho y «GEN 2023». Abrigan sin estorbar — pensados para usar sobre el uniforme.",
    garments: ["Chaleco sin manga"],
    techniques: ["Bordado"],
    image: "/trabajos/grange-school-gen-2023.webp",
    width: 768,
    height: 1024,
    productHandles: [],  },
  // — Corporativos (tanda 2026-06-24) —
  {
    slug: "petrobras-polera-jockey",
    client: "Petrobras",
    summary: "Polera piqué y jockey con logo bordado",
    detail:
      "Polera piqué blanca y jockey gris para Petrobras, con el logo BR bordado al pecho y al frente del jockey. El combo clásico de uniforme corporativo: prolijo, sobrio y a juego.",
    garments: ["Polera piqué", "Jockey"],
    techniques: ["Bordado"],
    image: "/trabajos/petrobras-polera-jockey.webp",
    width: 1200,
    height: 1033,
    productHandles: ["polera-pique-cuello-botones-manga-corta", "jockey"],
  },
  {
    slug: "caleta-austral-pique",
    client: "Caleta Austral",
    summary: "Poleras piqué en tres colores, logo bordado",
    detail:
      "Poleras piqué para Caleta Austral – Mercado del Mar en blanco, azul marino y naranjo, con el logo circular bordado al pecho. Un mismo bordado, parejo en cada color de la prenda.",
    garments: ["Polera piqué cuello y botones"],
    techniques: ["Bordado"],
    image: "/trabajos/caleta-austral-pique.webp",
    width: 750,
    height: 726,
    productHandles: ["polera-pique-cuello-botones-manga-corta"],
  },
  {
    slug: "santo-tomas-softshell",
    client: "Santo Tomás",
    summary: "Softshell azul marino con logo bordado",
    detail:
      "Softshell azul marino para el Área de Recursos Naturales de Santo Tomás, con el logo bordado al pecho. Cortavientos y abrigador, pensado para trabajo en terreno.",
    garments: ["Softshell"],
    techniques: ["Bordado"],
    image: "/trabajos/santo-tomas-softshell.webp",
    width: 1200,
    height: 1500,
    productHandles: ["softshell-hombre"],
  },
  {
    slug: "wwf-cortavientos",
    client: "WWF",
    summary: "Cortavientos «Hazte Socio» estampado",
    detail:
      "Cortavientos azul marino para la campaña «Hazte Socio» de WWF, con el panda estampado al pecho. Liviano y plegable, ideal para activaciones y captación en la calle.",
    garments: ["Cortavientos"],
    techniques: ["Estampado"],
    image: "/trabajos/wwf-cortavientos.webp",
    width: 750,
    height: 652,
    productHandles: ["cortavientos"],
  },
  {
    slug: "owens-corning-cargo-chaleco",
    client: "Owens Corning",
    summary: "Pantalón cargo y parka sin manga con logo bordado",
    detail:
      "Vestuario de terreno para Owens Corning: pantalón cargo forro polar y parka sin manga acolchada, con la marca y su mascota bordadas. Ropa de trabajo abrigada y resistente para el día a día.",
    garments: ["Pantalón cargo", "Parka sin manga"],
    techniques: ["Bordado"],
    image: "/trabajos/owens-corning-cargo-chaleco.webp",
    width: 1200,
    height: 1600,
    productHandles: ["pantalon-cargo-forro-polar"],
  },
  {
    slug: "gabri-mandil-comedy",
    client: "Gabrí",
    summary: "Mandil y lanyards para barra, bordado y estampado",
    detail:
      "Mandil corto de poliéster negro y lanyards para Gabrí (Wild Patagonian Gin & Vodka) y Comedy, con las marcas bordadas y estampadas. Parte de la línea de delantales y uniformes que sí fabricamos a medida.",
    garments: ["Mandil", "Lanyard"],
    techniques: ["Bordado", "Estampado"],
    image: "/trabajos/gabri-mandil-comedy.webp",
    width: 1200,
    height: 1313,
    productHandles: ["pechera"],
  },
  {
    slug: "jockeys-trucker-estampados",
    client: null,
    summary: "Jockeys trucker bicolor con personaje estampado",
    detail:
      "Jockeys trucker azul y blanco, con malla atrás y un personaje estampado al frente. Gorros frescos para merch y eventos de verano.",
    garments: ["Jockey"],
    techniques: ["Estampado"],
    image: "/trabajos/jockeys-trucker-estampados.webp",
    width: 1200,
    height: 668,
    productHandles: ["jockey"],
  },
  {
    slug: "cool-price-jockeys",
    client: "Cool Price",
    summary: "Jockeys rojos con logo bordado",
    detail:
      "Jockeys rojos para Cool Price con el logo circular bordado al frente en hilo blanco. Bordado prolijo y durable para una tanda completa de gorros.",
    garments: ["Jockey"],
    techniques: ["Bordado"],
    image: "/trabajos/cool-price-jockeys.webp",
    width: 1200,
    height: 1494,
    productHandles: ["jockey"],
  },
  {
    slug: "klog-poleron-dtf",
    client: "Klog.co",
    summary: "Polerón canguro blanco con estampado full color DTF",
    detail:
      "Polerón canguro blanco para Klog.co: el logo al pecho, una ilustración a todo color en el bolsillo y un gran diseño en DTF a la espalda con el logo «KLOG.CO». El DTF rinde full color y degradés sin recargo por tono.",
    garments: ["Polerón canguro"],
    techniques: ["DTF"],
    image: "/trabajos/klog-poleron-dtf.webp",
    width: 1200,
    height: 905,
    productHandles: ["poleron-canguro"],
  },
  {
    slug: "howdy-cuadernos",
    client: "Howdy",
    summary: "Cuadernos, libretas y lápices personalizados",
    detail:
      "Para Howdy: cuaderno con resorte «Howdy Olympics» ilustrado a todo color, libreta «Keeping my notes weird» y lápices con la marca. También hacemos merchandising más allá de la ropa.",
    garments: ["Cuaderno con resorte", "Libreta", "Lápices"],
    techniques: ["Estampado"],
    image: "/trabajos/howdy-cuadernos.webp",
    width: 1200,
    height: 1311,
    productHandles: [],
  },
] as const;

/** Trabajos reales que incluyen un producto dado (para mostrar en su PDP). */
export function worksForProduct(handle: string): RealWork[] {
  return REAL_WORKS.filter((w) => w.productHandles.includes(handle));
}

/** Lista única de técnicas presentes en la galería, en orden de aparición. */
export function allWorkTechniques(): WorkTechnique[] {
  const seen = new Set<WorkTechnique>();
  for (const w of REAL_WORKS) {
    for (const t of w.techniques) seen.add(t);
  }
  return [...seen];
}
