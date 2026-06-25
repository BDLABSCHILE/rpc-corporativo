"use server";

import { z } from "zod";
import { Resend } from "resend";
import { renderQuotePDFBuffer } from "./pdf";
import { calculateLinePricing } from "./pricing";
import { QuoteCreated } from "@/emails/QuoteCreated";
import { QuoteToSales } from "@/emails/QuoteToSales";
import { getCorporateProductByHandle } from "@/lib/shopify/storefront";
import { isValidRut } from "@/lib/utils/rut";
import { CONTACT } from "@/lib/brand/contacts";
import type { CorporateProduct } from "@/lib/shopify/types";
import type { CartLine } from "./storage";

/**
 * Server Action de envío de cotización — Ropa Publicitaria Chile.
 *
 * Flujo:
 *  1. Valida payload con Zod (cliente + carrito). RUT con módulo 11 real.
 *  2. RECALCULA el pricing de cada línea server-side contra el catálogo
 *     (anti-tampering: el pricing del browser solo se usa para detectar
 *     y loggear discrepancias, nunca para cobrar/cotizar).
 *  3. Genera número de cotización Q-YYYYMMDD-XXX.
 *  4. Renderiza PDF con @react-pdf/renderer (server-side, sin DOM).
 *  5. Envía 2 emails vía Resend (cliente + equipo comercial) con PDF adjunto.
 *  6. Devuelve { ok: true, quoteNumber } o { ok: false, errors }.
 *
 * Modo dry-run: si falta RESEND_API_KEY (dev local sin creds o build),
 * NO falla — solo loggea por consola para que el flujo se pueda probar
 * sin gastar quota ni necesitar dominio verificado.
 */

// --- Schema -----------------------------------------------------------------

// Validación del payload de línea. El pricing que viene del browser se acepta
// en el schema pero NO se usa para los montos finales: repriceLines() lo
// recalcula contra el catálogo real (ver más abajo).
const CartLineSchema = z.object({
  id: z.string(),
  addedAt: z.string(),
  productId: z.string(),
  productHandle: z.string(),
  productTitle: z.string().min(1),
  productImageUrl: z.string(),
  productCategory: z.string(),
  variantId: z.string(),
  variantTitle: z.string(),
  quantity: z.number().int().positive(),
  techniqueId: z.string(),
  techniqueLabel: z.string(),
  areaId: z.string(),
  areaLabel: z.string(),
  requiredDate: z.string(),
  occasion: z.string().nullable(),
  pricing: z.object({
    unitPriceNet: z.number(),
    customizationUnitPrice: z.number(),
    setupFee: z.number(),
    subtotalNet: z.number(),
    iva: z.number(),
    totalGross: z.number(),
    appliedBreak: z.object({
      minQty: z.number(),
      unitPriceNet: z.number(),
    }),
    nextBreak: z
      .object({
        minQty: z.number(),
        unitPriceNet: z.number(),
        savings: z.number(),
        savingsGross: z.number().optional(),
      })
      .nullable(),
    savingsVsBaseline: z.number(),
    savingsVsBaselineGross: z.number().optional(),
  }),
  // Adjuntos opcionales: logo original del cliente + mockup compuesto.
  // base64 dataURL ("data:image/png;base64,...") o null si no hay logo.
  logoDataUrl: z.string().nullable().optional(),
  logoFileName: z.string().nullable().optional(),
  logoMimeType: z.string().nullable().optional(),
  mockupDataUrl: z.string().nullable().optional(),
});

// RUT chileno: formato 11.111.111-K (con o sin puntos/guión) + dígito
// verificador real (módulo 11) vía isValidRut.
const RUT_REGEX = /^[0-9]{1,2}\.?[0-9]{3}\.?[0-9]{3}-?[0-9Kk]$/;

const SubmitSchema = z.object({
  companyName: z
    .string()
    .min(2, "Ingresa la razón social de la empresa")
    .max(120),
  rut: z
    .string()
    .regex(RUT_REGEX, "Formato RUT inválido (ej: 76.123.456-7)")
    .refine(isValidRut, "RUT inválido: el dígito verificador no coincide"),
  contactName: z.string().min(2, "Ingresa tu nombre").max(80),
  contactEmail: z.string().email("Email inválido"),
  contactPhone: z
    .string()
    .max(40)
    .optional()
    .transform((v) => (v && v.trim().length > 0 ? v.trim() : null)),
  occasion: z
    .string()
    .max(120)
    .optional()
    .transform((v) => (v && v.trim().length > 0 ? v.trim() : null)),
  notes: z
    .string()
    .max(2000)
    .optional()
    .transform((v) => (v && v.trim().length > 0 ? v.trim() : null)),
  lines: z.array(CartLineSchema).min(1, "El carrito está vacío"),
});

export type SubmitInput = z.input<typeof SubmitSchema>;
export type SubmitResult =
  | { ok: true; quoteNumber: string; dryRun: boolean }
  | { ok: false; errors: Record<string, string>; formError?: string };

// --- Quote number -----------------------------------------------------------

function generateQuoteNumber(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  // Sufijo random de 4 chars para evitar colisiones sin storage server-side.
  // Cuando haya storage server-side (KV) se puede pasar a contador atómico.
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `Q-${y}${m}${d}-${suffix}`;
}

// --- Resend setup -----------------------------------------------------------

const RESEND_API_KEY = process.env.RESEND_API_KEY;
// Buzones del cliente. cotizaciones@ es el FROM transaccional; hola@ recibe
// la copia interna del equipo. Ambos overrideables por env var sin tocar código.
const RESEND_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "cotizaciones@ropapublicitariachile.cl";
const RESEND_INTERNAL_EMAIL =
  process.env.RESEND_INTERNAL_EMAIL || CONTACT.email;

// --- Reprice (anti-tampering) -------------------------------------------------

type RepriceResult =
  | { ok: true; lines: CartLine[] }
  | { ok: false; formError: string };

/**
 * Recalcula el pricing de cada línea server-side contra el catálogo real.
 *
 *  - Busca el producto por handle (cache por handle para no repetir fetches).
 *  - Recalcula con calculateLinePricing usando quantity + técnica de la línea.
 *  - Si el total difiere del que mandó el browser, lo loggea (tampering o
 *    cantidad ajustada en el carrito sin recotizar) y usa SIEMPRE el server.
 *  - Si el producto o la técnica ya no existen, corta con error claro.
 */
async function repriceLines(lines: CartLine[]): Promise<RepriceResult> {
  const productCache = new Map<string, CorporateProduct | null>();
  const repriced: CartLine[] = [];

  // Descuento por VOLUMEN aplica sobre el TOTAL del pedido (confirmado por
  // RPC). El tramo de cada línea se calcula con esta suma, no con su quantity.
  const cartTotalQty = lines.reduce((sum, l) => sum + l.quantity, 0);

  for (const line of lines) {
    let product = productCache.get(line.productHandle);
    if (product === undefined) {
      try {
        product = await getCorporateProductByHandle(line.productHandle);
      } catch (err) {
        console.error(
          `[submitQuoteAction] error consultando catálogo para "${line.productHandle}"`,
          err,
        );
        return {
          ok: false,
          formError:
            "No pudimos validar los precios contra el catálogo. Inténtalo de nuevo en unos minutos o escríbenos a " +
            CONTACT.email +
            ".",
        };
      }
      productCache.set(line.productHandle, product);
    }

    if (!product) {
      return {
        ok: false,
        formError: `El producto "${line.productTitle}" ya no está disponible en el catálogo. Elimínalo de tu cotización e inténtalo de nuevo.`,
      };
    }

    const technique = product.printTechniques.find(
      (t) => t.id === line.techniqueId,
    );
    if (!technique) {
      return {
        ok: false,
        formError: `La técnica "${line.techniqueLabel}" ya no está disponible para "${line.productTitle}". Vuelve a configurar esa línea desde el catálogo.`,
      };
    }

    let pricing: CartLine["pricing"];
    try {
      pricing = calculateLinePricing({
        product,
        quantity: line.quantity,
        // Cada CartLine tiene una sola zona de impresión (areaId), por eso
        // printPositions es siempre 1 en este flujo.
        technique,
        printPositions: 1,
        // Descuento por TOTAL del pedido (ver comentario en repriceLines).
        cartTotalQty,
        // Tamaño del logo que eligió el cliente → tramo de precio por tamaño.
        // Si la línea es vieja y no lo trae, cae al tramo base (insignia).
        logoLongSideCm: line.logoLongSideCm ?? null,
      });
    } catch (err) {
      console.error(
        `[submitQuoteAction] error recalculando pricing de "${line.productHandle}"`,
        err,
      );
      return {
        ok: false,
        formError: `No pudimos recalcular el precio de "${line.productTitle}". Elimínalo de tu cotización e inténtalo de nuevo.`,
      };
    }

    // El pricing del browser solo sirve para detectar discrepancias.
    // Diferencias esperables: cantidad ajustada con ± en el carrito (la UI lo
    // marca como estimado) o intento de tampering del payload.
    const browserTotal = Math.round(line.pricing.totalGross);
    const serverTotal = Math.round(pricing.totalGross);
    if (browserTotal !== serverTotal) {
      console.warn(
        `[submitQuoteAction] discrepancia de pricing en línea ${line.id} ` +
          `(${line.productHandle} × ${line.quantity}): ` +
          `browser ${browserTotal} vs server ${serverTotal}. Se usa el cálculo server-side.`,
      );
    }

    repriced.push({ ...line, pricing });
  }

  return { ok: true, lines: repriced };
}

// --- Action -----------------------------------------------------------------

export async function submitQuoteAction(
  _prevState: SubmitResult | null,
  formData: FormData,
): Promise<SubmitResult> {
  // 1. Parsear payload.
  let raw: Record<string, unknown>;
  try {
    const linesJson = formData.get("linesJson");
    if (typeof linesJson !== "string") {
      return {
        ok: false,
        errors: {},
        formError: "Carrito no recibido. Recarga la página e intenta de nuevo.",
      };
    }
    raw = {
      companyName: formData.get("companyName"),
      rut: formData.get("rut"),
      contactName: formData.get("contactName"),
      contactEmail: formData.get("contactEmail"),
      contactPhone: formData.get("contactPhone") || undefined,
      occasion: formData.get("occasion") || undefined,
      notes: formData.get("notes") || undefined,
      lines: JSON.parse(linesJson),
    };
  } catch (err) {
    console.error("[submitQuoteAction] parse error", err);
    return {
      ok: false,
      errors: {},
      formError: "No pudimos leer los datos del formulario.",
    };
  }

  // 2. Validar con Zod.
  const parsed = SubmitSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !errors[key]) {
        errors[key] = issue.message;
      }
    }
    return { ok: false, errors };
  }

  const data = parsed.data;

  // 3. Recalcular pricing server-side (anti-tampering). De aquí en adelante
  //    PDF, emails y totales usan SOLO estas líneas recalculadas.
  const repriceResult = await repriceLines(data.lines as CartLine[]);
  if (!repriceResult.ok) {
    return { ok: false, errors: {}, formError: repriceResult.formError };
  }
  const lines = repriceResult.lines;

  const createdAt = new Date();
  const quoteNumber = generateQuoteNumber(createdAt);

  // 4. Renderizar PDF.
  let pdfBuffer: Buffer;
  try {
    pdfBuffer = await renderQuotePDFBuffer({
      quoteNumber,
      createdAt,
      customer: {
        companyName: data.companyName,
        rut: data.rut,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone ?? undefined,
      },
      lines,
    });
  } catch (err) {
    console.error("[submitQuoteAction] PDF render error", err);
    return {
      ok: false,
      errors: {},
      formError:
        "No pudimos generar el PDF de la cotización. Inténtalo de nuevo o escríbenos a " +
        CONTACT.email +
        ".",
    };
  }

  // 5. Enviar emails (o dry-run si no hay credenciales).
  const pdfFilename = `Cotizacion-${quoteNumber}-RopaPublicitariaChile.pdf`;

  if (!RESEND_API_KEY) {
    // Dry-run: log y devuelve éxito para que el dev pueda iterar sin Resend.
    console.warn(
      "[submitQuoteAction] DRY-RUN — sin RESEND_API_KEY. " +
        `Cotización ${quoteNumber} de ${data.companyName} (${data.contactEmail}) ` +
        `· ${lines.length} líneas · PDF ${pdfBuffer.byteLength} bytes`,
    );
    return { ok: true, quoteNumber, dryRun: true };
  }

  const resend = new Resend(RESEND_API_KEY);

  // Construimos los attachments de logos + mockups con dedupe.
  // - Logos: si el cliente subió el mismo archivo para varias líneas, va una
  //   sola copia (matcheamos por dataUrl exacto).
  // - Mockups: uno por línea (cada producto se ve distinto con el logo aplicado).
  // Los mismos adjuntos van al cliente y al equipo comercial.
  const lineAttachments = buildLineAttachments(lines);

  try {
    // Email al cliente con PDF adjunto + mockups + logo.
    const clientEmail = await resend.emails.send({
      from: `Ropa Publicitaria Chile <${RESEND_FROM_EMAIL}>`,
      to: data.contactEmail,
      replyTo: RESEND_INTERNAL_EMAIL,
      subject: `Cotización ${quoteNumber} · Ropa Publicitaria Chile`,
      react: QuoteCreated({
        quoteNumber,
        createdAt,
        customer: {
          companyName: data.companyName,
          contactName: data.contactName,
          contactEmail: data.contactEmail,
        },
        lines,
      }),
      attachments: [
        {
          filename: pdfFilename,
          content: pdfBuffer,
        },
        ...lineAttachments,
      ],
    });

    if (clientEmail.error) {
      console.error("[submitQuoteAction] client email error", clientEmail.error);
    }

    // Email interno al equipo comercial (con el mismo PDF adjunto y reply-to
    // al cliente para que un "Responder" vaya directo a él).
    const salesEmail = await resend.emails.send({
      from: `Ropa Publicitaria Chile <${RESEND_FROM_EMAIL}>`,
      to: RESEND_INTERNAL_EMAIL,
      replyTo: data.contactEmail,
      subject: `[Lead] ${quoteNumber} · ${data.companyName}`,
      react: QuoteToSales({
        quoteNumber,
        createdAt,
        customer: {
          companyName: data.companyName,
          rut: data.rut,
          contactName: data.contactName,
          contactEmail: data.contactEmail,
          contactPhone: data.contactPhone,
        },
        occasion: data.occasion,
        notes: data.notes,
        lines,
      }),
      attachments: [
        {
          filename: pdfFilename,
          content: pdfBuffer,
        },
        ...lineAttachments,
      ],
    });

    if (salesEmail.error) {
      console.error("[submitQuoteAction] sales email error", salesEmail.error);
      // No fallamos al cliente si el email interno falla; el cliente sí recibió
      // su copia. Lo loggeamos para corregir DNS/template.
    }
  } catch (err) {
    console.error("[submitQuoteAction] resend error", err);
    return {
      ok: false,
      errors: {},
      formError:
        `Tu cotización se generó pero el envío del email falló. Escríbenos a ${CONTACT.email} mencionando este código: ` +
        quoteNumber,
    };
  }

  return { ok: true, quoteNumber, dryRun: false };
}

// --- Attachments helpers ----------------------------------------------------

type ResendAttachment = {
  filename: string;
  content: Buffer;
};

/**
 * Convierte cada línea del carrito en sus adjuntos (mockup + logo) con dedupe.
 *
 *  - Mockups: 1 por línea con logo (slug del producto en el filename para que
 *    el equipo comercial pueda mapear rápido).
 *  - Logos: dedupe por contenido del dataUrl. Si el cliente subió el mismo
 *    archivo 3 veces (uso típico: mismo logo para varias líneas), va una
 *    sola copia con nombre "logo-1.png". Si subió 2 distintos, "logo-1" y
 *    "logo-2".
 */
function buildLineAttachments(lines: CartLine[]): ResendAttachment[] {
  const attachments: ResendAttachment[] = [];
  // Map dataUrl → ordinal asignado (1, 2, ...) para dedupe estable.
  const logoOrdinals = new Map<string, number>();

  for (const [idx, line] of lines.entries()) {
    const lineNumber = idx + 1;

    // Mockup: uno por línea (siempre distinto por la composición con el
    // producto específico). Si captureMockup devolvió null, no agregamos.
    if (line.mockupDataUrl) {
      const buf = dataUrlToBuffer(line.mockupDataUrl);
      if (buf) {
        attachments.push({
          filename: `L${lineNumber}-mockup-${line.productHandle}.jpg`,
          content: buf,
        });
      }
    }

    // Logo: dedupe por contenido. Solo agregamos cuando lo vemos por primera vez.
    if (line.logoDataUrl) {
      if (!logoOrdinals.has(line.logoDataUrl)) {
        const ordinal = logoOrdinals.size + 1;
        logoOrdinals.set(line.logoDataUrl, ordinal);
        const buf = dataUrlToBuffer(line.logoDataUrl);
        if (buf) {
          const ext = extFromMime(line.logoMimeType ?? null);
          // Si hay más de un logo distinto en el carrito, los enumeramos
          // (logo-1, logo-2). Si es único, simplemente "logo-original".
          const baseName = lines.some(
            (l) =>
              l.logoDataUrl &&
              l.logoDataUrl !== line.logoDataUrl,
          )
            ? `logo-${ordinal}`
            : "logo-original";
          attachments.push({
            filename: `${baseName}${ext}`,
            content: buf,
          });
        }
      }
    }
  }

  return attachments;
}

/** Parsea "data:image/png;base64,XXXX..." → Buffer. Null si formato inválido. */
function dataUrlToBuffer(dataUrl: string): Buffer | null {
  const match = dataUrl.match(/^data:[^;]+;base64,(.+)$/);
  if (!match) return null;
  try {
    return Buffer.from(match[1]!, "base64");
  } catch {
    return null;
  }
}

/** Mime → extensión con punto (".png", ".svg"). Fallback ".bin". */
function extFromMime(mime: string | null): string {
  if (!mime) return ".bin";
  if (mime === "image/png") return ".png";
  if (mime === "image/jpeg") return ".jpg";
  if (mime === "image/svg+xml") return ".svg";
  if (mime === "image/webp") return ".webp";
  return ".bin";
}
