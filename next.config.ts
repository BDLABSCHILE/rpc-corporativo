import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // typedRoutes: true,  // TODO Fase 7: re-enable cuando todas las rutas estén estables.
  // Cotizar CON logo manda el logo + el mockup compuesto (base64) al Server
  // Action. El default de 1MB se queda corto cuando hay mockup, así que lo
  // subimos a 4MB (bajo el tope ~4.5MB de Vercel). El mockup además va en JPEG.
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
