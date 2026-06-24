/**
 * Muro de clientes reales — source of truth para el home (LogoWall) y la
 * página /casos-de-exito. Si cambia la lista, se edita acá UNA vez.
 *
 * Clientes relevados del sitio actual del cliente (ropapublicitariachile.cl,
 * 2026-06-12). Cada logo es un asset oficial en /public/brand/clients (la
 * mayoría SVG de Wikimedia Commons; los demás del sitio oficial de cada
 * marca). Las marcas sin un logo limpio disponible caen a texto.
 */

export type Client = {
  name: string;
  /** Archivo en /public/brand/clients. Si falta, se muestra el nombre en texto. */
  logo?: string;
};

export const CLIENTS: readonly Client[] = [
  { name: "Banco de Chile", logo: "banco-de-chile.svg" },
  { name: "Entel", logo: "entel.svg" },
  { name: "LATAM", logo: "latam.svg" },
  { name: "Copec", logo: "copec.svg" },
  { name: "Mercado Libre", logo: "mercado-libre.svg" },
  { name: "Ripley", logo: "ripley.svg" },
  { name: "Natura", logo: "natura.svg" },
  { name: "LEGO", logo: "lego.svg" },
  { name: "Land Rover", logo: "land-rover.svg" },
  { name: "Jaguar", logo: "jaguar.svg" },
  { name: "Syngenta", logo: "syngenta.svg" },
  { name: "Carozzi", logo: "carozzi.png" },
  { name: "Mega", logo: "mega.svg" },
  { name: "Tur Bus", logo: "tur-bus.png" },
  { name: "Colmena", logo: "colmena.png" },
  { name: "Sodimac", logo: "sodimac.svg" },
  { name: "Bosca", logo: "bosca.png" },
  { name: "Viña Santa Carolina", logo: "vina-santa-carolina.png" },
  { name: "Red de Salud UC CHRISTUS", logo: "red-salud-uc-christus.svg" },
  { name: "Facultad de Medicina UC", logo: "medicina-uc.svg" },
  { name: "Universidad Mayor", logo: "universidad-mayor.jpg" },
  { name: "The Grange School" },
  { name: "TECHO", logo: "techo.png" },
];
