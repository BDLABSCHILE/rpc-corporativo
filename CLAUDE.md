@AGENTS.md

# RPC Corporativo — notas para agentes

Web corporativa B2B de **Ropa Publicitaria Chile** (Comercial Franca Pisani Ltda.), fabricantes de vestuario corporativo y merchandising con más de 40 años. Dominio objetivo `ropapublicitariachile.cl`. Base: kit corporativo headless (Next.js 16 + React 19 + TS estricto + Tailwind v4) re-tematizado para RPC.

## Reglas duras

- **Voz:** chileno neutro, SIEMPRE tú (puedes, cotiza, sube), NUNCA voseo. Tono cercano y directo, orgullo de fábrica — sin tono lujo.
- **No inventar datos del negocio** (cifras, plazos exactos, precios). Claims permitidos: "más de 40 años", "respuesta en menos de 24 horas", **"más de 500 empresas han confiado en nosotros"** (aprobado por la marca 2026-06-23), **stock en Chile listo para personalizar con tu logo** + **fabricación propia SOLO de la línea de ropa de cocina y uniformes** (delantales, chaquetas de chef, gorros, cofias), los clientes reales listados en el sitio. **NO** decir "fabricación a medida" como capacidad general ni "fábricas en Oriente" — RPC consigue/stockea las demás prendas y las personaliza; solo fabrica la línea de cocina. (Corregido por la marca 2026-06-23.)
- **Catálogo demo:** los precios de los mocks son de referencia, no del cliente. `USE_MOCK_PRODUCTS=true` hasta conectar su Shopify.
- **Factor humano:** flujo B2B sin checkout ni pago online. Todo termina en "el equipo te contacta para cerrar".
- **Marca:** tokens en `lib/brand/rpc-tokens.ts` + `app/globals.css` (coral `rpc-accent` = acción, celeste `rpc-info` = informativo). Contacto real en `lib/brand/contacts.ts`. Logo en `public/brand/rpc-logo.webp` y favicon en `public/brand/rpc-favicon.png`. No inventar otra identidad.
- **Contratos estables:** tipos en `lib/shopify/types.ts`, `CartLine` en `lib/quote/storage.ts` (no cambiar su shape), store del logo en `lib/logo/store.ts`.
- **Push:** lo hace Claude (Benja lo autorizó 2026-06-23: "tú haz los push"). Push a `main` → Vercel despliega solo. Commitea y pushea sin pedir permiso salvo que Benja diga lo contrario.
