import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import { BrandHeader } from "@/components/brand/BrandHeader";
import { BrandFooter } from "@/components/brand/BrandFooter";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default:
      "Ropa Publicitaria Chile — Vestuario corporativo y merchandising con tu logo",
    template: "%s · Ropa Publicitaria Chile",
  },
  description:
    "Fabricantes con más de 40 años de experiencia. Cotiza poleras, polerones, camisas y merchandising personalizados con tu logo: precios por volumen, stock express en Chile y fabricación a medida.",
  metadataBase: new URL(
    process.env["NEXT_PUBLIC_SITE_URL"] ?? "https://ropapublicitariachile.cl",
  ),
  // OpenGraph + Twitter cards para previews al compartir el link (WhatsApp,
  // LinkedIn, etc.). Declarado acá para que TODAS las rutas hijas lo hereden.
  openGraph: {
    type: "website",
    locale: "es_CL",
    siteName: "Ropa Publicitaria Chile",
    title: "Ropa Publicitaria Chile — Vestuario corporativo con tu logo",
    description:
      "Cotiza en línea vestuario corporativo y merchandising personalizado: sube tu logo, míralo sobre los productos y recibe tu cotización en menos de 24 horas.",
    images: [
      {
        url: "/og/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Ropa Publicitaria Chile",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ropa Publicitaria Chile — Vestuario corporativo con tu logo",
    description:
      "Cotiza en línea vestuario corporativo y merchandising personalizado: sube tu logo, míralo sobre los productos y recibe tu cotización en menos de 24 horas.",
    images: ["/og/twitter-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-CL"
      className={`${archivo.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-rpc-bg text-rpc-text">
        <BrandHeader />
        <main className="flex-1">{children}</main>
        <BrandFooter />
      </body>
    </html>
  );
}
