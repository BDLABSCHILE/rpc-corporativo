/**
 * "Confían en nosotros" — muro de logos de clientes reales.
 *
 * Clientes relevados del sitio actual del cliente (ropapublicitariachile.cl).
 * Cada logo es un asset oficial descargado a /public/brand/clients (la mayoría
 * SVG de Wikimedia Commons; los demás del sitio oficial de cada marca). Se
 * muestran en escala de grises y pasan a color al hover. Las marcas sin un
 * logo limpio disponible caen a texto. El id="clientes" es el anchor del nav.
 */

type Client = {
  name: string;
  /** Archivo en /public/brand/clients. Si falta, se muestra el nombre en texto. */
  logo?: string;
};

const CLIENTS: Client[] = [
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

export function LogoWall() {
  return (
    <section id="clientes" className="scroll-mt-24 border-b border-rpc-border bg-rpc-bg">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
        <p className="text-center text-xs font-semibold uppercase tracking-wide text-rpc-info-dark">
          Confían en nosotros
        </p>
        <h2 className="mx-auto mt-3 max-w-3xl text-center text-3xl tracking-tight sm:text-4xl">
          Más de 40 años vistiendo a las marcas de Chile.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center font-rpc-body text-sm normal-case tracking-normal text-rpc-text/70 sm:text-base">
          Empresas, instituciones, universidades y colegios confían en nosotros
          para su vestuario corporativo y merchandising. Estas son algunas.
        </p>

        {/* Grid con hairlines: gap-px sobre fondo border simula la grilla */}
        <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-rpc-card border border-rpc-border bg-rpc-border sm:grid-cols-3 lg:grid-cols-4">
          {CLIENTS.map((client) => (
            <div
              key={client.name}
              className="group flex h-24 items-center justify-center bg-rpc-bg px-6"
            >
              {client.logo ? (
                // eslint-disable-next-line @next/next/no-img-element -- logos estáticos (svg/png) servidos desde /public; next/image no aporta y exige flag para SVG
                <img
                  src={`/brand/clients/${client.logo}`}
                  alt={client.name}
                  loading="lazy"
                  className="max-h-10 w-auto max-w-[78%] object-contain opacity-70 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
                />
              ) : (
                <span className="text-center font-rpc-heading text-sm font-bold tracking-tight text-rpc-text/45 transition group-hover:text-rpc-text sm:text-base">
                  {client.name}
                </span>
              )}
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-rpc-text/55">
          …y muchas marcas más.
        </p>
      </div>
    </section>
  );
}
