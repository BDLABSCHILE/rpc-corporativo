import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  HandshakeIcon,
  DiamondIcon,
  PencilIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Clientes",
  description:
    "Banco de Chile, Entel, LATAM, Ripley, Copec, Mercado Libre, LEGO y más confían en Ropa Publicitaria Chile para su vestuario corporativo y merchandising. Más de 40 años fabricando.",
};

/**
 * /casos-de-exito — visualmente "Clientes" (la ruta se mantiene por links ya
 * compartidos). Página de credibilidad B2B.
 *
 * Estrategia: en vez de inventar case studies, mostramos la realidad — el
 * muro de clientes reales del cliente (relevado de su sitio 2026-06-12) como
 * grid tipográfico, más 3 tipos de proyecto descritos en genérico honesto,
 * sin cifras ni contextos que no podemos verificar.
 */

const CLIENTS: readonly string[] = [
  "Banco de Chile",
  "Entel",
  "LATAM",
  "Copec",
  "Mercado Libre",
  "Ripley",
  "Natura",
  "LEGO",
  "Land Rover",
  "Jaguar",
  "Syngenta",
  "Carozzi",
  "Mega",
  "Turbus",
  "Colmena",
  "Sodimac",
  "Bosca",
  "Viña Santa Carolina",
  "Red de Salud UC Christus",
  "Facultad de Medicina UC",
  "Universidad Mayor",
  "The Grange School",
  "TECHO",
];

type ProjectType = {
  title: string;
  body: string;
  icon: ReactNode;
};

const PROJECT_TYPES: readonly ProjectType[] = [
  {
    title: "Uniformes corporativos",
    body: "Poleras, camisas, polerones y ropa técnica para equipos completos. Definimos juntos prendas, colores y técnica — bordado para el acabado más durable, estampado donde rinde mejor — y el equipo confirma cada detalle antes de producir.",
    icon: <HandshakeIcon className="h-6 w-6" />,
  },
  {
    title: "Merchandising para eventos",
    body: "Jockeys, gorros, bolsas y artículos promocionales con tu marca para activaciones, ferias y regalos corporativos. El camino stock express permite resolver pedidos con poco tiempo de anticipación.",
    icon: <DiamondIcon className="h-6 w-6" />,
  },
  {
    title: "Ropa de cocina y uniformes a medida",
    body: "Fabricamos nuestra propia línea de cocina y uniformes —delantales, chaquetas de chef, gorros y cofias— a tu medida y con asesoría de diseño. Para equipos que necesitan vestuario propio con su marca.",
    icon: <PencilIcon className="h-6 w-6" />,
  },
];

export default function ClientesPage() {
  return (
    <>
      {/* Header + muro de clientes */}
      <section className="border-b border-rpc-border bg-rpc-bg">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
          <p className="text-[10px] uppercase tracking-[0.25em] text-rpc-text/60 sm:text-xs">
            Clientes
          </p>
          <h1 className="mt-4 max-w-4xl text-3xl leading-[1.05] sm:mt-6 sm:text-4xl lg:text-5xl">
            Más de 40 años vistiendo a las marcas de Chile.
          </h1>
          <p className="mt-6 max-w-2xl font-rpc-body text-base normal-case tracking-normal text-rpc-text/75 sm:mt-8 sm:text-lg">
            Empresas, instituciones, universidades y colegios confían en
            nosotros para su vestuario corporativo y merchandising. Estos son
            algunos.
          </p>

          {/*
            Grid tipográfico: los nombres en Archivo, sin logos. Honesto y
            editorial — la prueba social está en la lista misma, no en
            archivos de logo que no tenemos autorizados.
          */}
          <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 lg:mt-16 lg:grid-cols-4 lg:gap-y-8">
            {CLIENTS.map((name) => (
              <li
                key={name}
                className="border-t border-rpc-border pt-3 font-rpc-heading text-sm leading-snug text-rpc-text sm:text-base lg:text-lg"
              >
                {name}
              </li>
            ))}
          </ul>
          <p className="mt-10 font-rpc-body text-sm normal-case tracking-normal text-rpc-text/55">
            …y muchas más.
          </p>
        </div>
      </section>

      {/* Tipos de proyecto */}
      <section className="border-b border-rpc-border bg-rpc-surface">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
          <p className="text-xs uppercase tracking-[0.25em] text-rpc-text/60">
            Lo que hacemos con ellos
          </p>
          <h2 className="mt-4 max-w-3xl text-2xl leading-[1.1] sm:text-3xl lg:text-4xl">
            Tres tipos de proyecto, el mismo oficio.
          </h2>

          <dl className="mt-12 grid gap-6 lg:grid-cols-3 lg:gap-8">
            {PROJECT_TYPES.map((p) => (
              <div
                key={p.title}
                className="rounded-rpc-card border border-rpc-border bg-rpc-bg p-8"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rpc-accent/10 text-rpc-accent-dark">
                  {p.icon}
                </div>
                <dt className="mt-5 font-rpc-heading text-lg text-rpc-text sm:text-xl">
                  {p.title}
                </dt>
                <dd className="mt-3 font-rpc-body text-sm normal-case tracking-normal text-rpc-text/75">
                  {p.body}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-rpc-announcement text-rpc-button-text">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-6 py-20 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] opacity-70">
              ¿Tu empresa es la próxima?
            </p>
            <h2 className="mt-3 text-2xl leading-[1.1] sm:text-3xl lg:text-4xl">
              Cotiza sin compromiso. Te respondemos en menos de 24 horas.
            </h2>
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
