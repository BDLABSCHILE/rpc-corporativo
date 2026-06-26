import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import type { CartLine } from "./storage";
import { formatCLP, IVA_RATE } from "@/lib/utils/money";
import { CONTACT } from "@/lib/brand/contacts";

/**
 * Generación del PDF de cotización corporativa — Ropa Publicitaria Chile.
 *
 * Stack: @react-pdf/renderer corre server-side, no usa DOM. La salida es un
 * Buffer/Uint8Array que se attachea al email.
 *
 * Diseño: banda de marca en tinta oscura, regla de acento coral, ficha de
 * cliente + meta, tabla de líneas con filas cebra y la miniatura del MOCKUP
 * (el producto con el logo del cliente, en JPEG → renderiza confiable, a
 * diferencia de los .webp del catálogo), y un bloque de total en coral.
 * Tipografía Helvetica nativa (sin fetch de fuentes).
 */

const colors = {
  ink: "#101418",
  text: "#1c2126",
  textMuted: "#6b7178",
  border: "#e6e8ea",
  bg: "#ffffff",
  bgMuted: "#f5f6f7",
  bgCard: "#fafbfb",
  accent: "#f07848",
  accentDark: "#d65f33",
  accentSoft: "#fdeee7",
  info: "#18c0f0",
  white: "#ffffff",
  whiteMuted: "#aeb3b9",
} as const;

const SITE_URL = "ropapublicitariachile.cl";
const PAD = 36; // padding horizontal del cuerpo

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: colors.text,
    paddingBottom: 44,
  },

  // --- Header band (tinta, full-bleed) ---
  headerBand: {
    backgroundColor: colors.ink,
    paddingHorizontal: PAD,
    paddingTop: 24,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  brandMark: { flexDirection: "row", alignItems: "center" },
  diamond: {
    width: 12,
    height: 12,
    backgroundColor: colors.accent,
    transform: "rotate(45deg)",
    marginRight: 9,
  },
  brandName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 15,
    letterSpacing: 1.4,
    color: colors.white,
  },
  brandSub: {
    fontSize: 7,
    letterSpacing: 2.5,
    color: colors.whiteMuted,
    marginTop: 7,
    marginLeft: 21,
    textTransform: "uppercase",
  },
  docKicker: {
    fontSize: 8,
    letterSpacing: 3,
    color: colors.accent,
    textTransform: "uppercase",
    fontFamily: "Helvetica-Bold",
  },
  docNumber: {
    fontFamily: "Helvetica-Bold",
    fontSize: 16,
    letterSpacing: 0.5,
    color: colors.white,
    marginTop: 5,
  },
  docDate: {
    fontSize: 8,
    color: colors.whiteMuted,
    marginTop: 5,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  accentRule: { height: 4, backgroundColor: colors.accent },

  // --- Body ---
  body: { paddingHorizontal: PAD, paddingTop: 16 },

  // --- Cards row (cliente + meta) ---
  infoRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    padding: 12,
  },
  cardLabel: {
    fontSize: 7,
    letterSpacing: 1.8,
    color: colors.textMuted,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  companyName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 13,
    color: colors.ink,
    marginBottom: 5,
  },
  cardLine: { fontSize: 9, color: colors.text, marginBottom: 2.5 },
  metaItem: { marginBottom: 9 },
  metaValue: { fontSize: 9.5, color: colors.ink, fontFamily: "Helvetica-Bold" },
  statusPill: {
    marginTop: 2,
    alignSelf: "flex-start",
    backgroundColor: colors.accentSoft,
    color: colors.accentDark,
    fontSize: 7,
    letterSpacing: 1,
    textTransform: "uppercase",
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 3,
  },

  // --- Section ---
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    color: colors.ink,
    marginBottom: 8,
  },

  // --- Table ---
  table: { borderRadius: 6, overflow: "hidden", borderWidth: 1, borderColor: colors.border },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.ink,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  th: {
    fontSize: 7,
    letterSpacing: 1,
    color: colors.whiteMuted,
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 9,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  rowAlt: { backgroundColor: colors.bgMuted },

  cellProduct: { width: "50%", paddingRight: 8, flexDirection: "row", alignItems: "center" },
  cellQty: { width: "10%", textAlign: "right" },
  cellUnit: { width: "20%", textAlign: "right" },
  cellTotal: { width: "20%", textAlign: "right" },

  thumb: {
    width: 42,
    height: 42,
    marginRight: 10,
    objectFit: "cover",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  thumbPlaceholder: {
    width: 42,
    height: 42,
    marginRight: 10,
    borderRadius: 4,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbDiamond: {
    width: 9,
    height: 9,
    backgroundColor: colors.accent,
    transform: "rotate(45deg)",
  },
  productInfo: { flex: 1 },
  productTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
    color: colors.ink,
    marginBottom: 3,
  },
  productMeta: { fontSize: 7.5, color: colors.textMuted, marginBottom: 1.5 },
  cellNumStrong: { fontFamily: "Helvetica-Bold", fontSize: 9.5, color: colors.ink },
  cellNum: { fontSize: 9, color: colors.text },

  // --- Totals ---
  totalsWrap: { flexDirection: "row", justifyContent: "flex-end", marginTop: 12 },
  totalsCard: { width: 248 },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  totalsLabel: { fontSize: 9, color: colors.textMuted },
  totalsValue: { fontSize: 9, color: colors.text },
  grandBox: {
    backgroundColor: colors.accent,
    borderRadius: 6,
    paddingVertical: 11,
    paddingHorizontal: 14,
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  grandLabel: {
    fontSize: 9,
    letterSpacing: 2,
    color: colors.white,
    textTransform: "uppercase",
  },
  grandValue: { fontFamily: "Helvetica-Bold", fontSize: 16, color: colors.white },
  totalsFoot: {
    fontSize: 7.5,
    color: colors.textMuted,
    textAlign: "right",
    marginTop: 6,
  },

  // --- Condiciones ---
  termsCard: {
    marginTop: 16,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    padding: 13,
  },
  termsTitle: {
    fontSize: 7.5,
    letterSpacing: 2,
    color: colors.ink,
    textTransform: "uppercase",
    fontFamily: "Helvetica-Bold",
    marginBottom: 9,
  },
  termRow: { flexDirection: "row", marginBottom: 5, paddingRight: 8 },
  termBullet: {
    width: 4,
    height: 4,
    backgroundColor: colors.accent,
    transform: "rotate(45deg)",
    marginTop: 3.5,
    marginRight: 7,
  },
  termText: { fontSize: 8, color: colors.text, lineHeight: 1.4, flex: 1 },

  // --- CTA ---
  cta: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 8.5,
    color: colors.textMuted,
  },
  ctaStrong: { color: colors.ink, fontFamily: "Helvetica-Bold" },

  // --- Footer ---
  footer: {
    position: "absolute",
    bottom: 24,
    left: PAD,
    right: PAD,
    paddingTop: 9,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 7,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
});

export type QuotePDFInput = {
  quoteNumber: string;
  createdAt: Date;
  customer: {
    companyName: string;
    rut: string;
    contactName: string;
    contactEmail: string;
    contactPhone?: string;
  };
  lines: CartLine[];
};

function formatDateLong(d: Date): string {
  return new Intl.DateTimeFormat("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

const TERMS: readonly string[] = [
  "Esta cotización es referencial y la confirma nuestro equipo en menos de 24 horas hábiles.",
  "Antes de producir te enviamos el mockup digital con tu logo aplicado, para tu aprobación.",
  "Plazos según disponibilidad: stock en Chile para personalizar, o fabricación de la línea de cocina y uniformes. El equipo confirma el plazo exacto.",
  "Costo y plazo de despacho a confirmar según volumen y destino.",
  "Forma de pago y facturación se coordinan con el equipo. Emitimos factura electrónica (razón social, RUT y giro).",
];

export function QuotePDF({
  quoteNumber,
  createdAt,
  customer,
  lines,
}: QuotePDFInput) {
  const subtotalNet = lines.reduce((s, l) => s + l.pricing.subtotalNet, 0);
  const iva = subtotalNet * IVA_RATE;
  const totalGross = subtotalNet + iva;
  const totalUnits = lines.reduce((s, l) => s + l.quantity, 0);

  return (
    <Document
      title={`Cotización ${quoteNumber} · Ropa Publicitaria Chile`}
      author={CONTACT.razonSocial}
      subject="Cotización corporativa Ropa Publicitaria Chile"
    >
      <Page size="A4" style={styles.page}>
        {/* Banda de marca */}
        <View style={styles.headerBand} fixed>
          <View>
            <View style={styles.brandMark}>
              <View style={styles.diamond} />
              <Text style={styles.brandName}>ROPA PUBLICITARIA CHILE</Text>
            </View>
            <Text style={styles.brandSub}>
              Vestuario corporativo y merchandising
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.docKicker}>Cotización</Text>
            <Text style={styles.docNumber}>{quoteNumber}</Text>
            <Text style={styles.docDate}>{formatDateLong(createdAt)}</Text>
          </View>
        </View>
        <View style={styles.accentRule} fixed />

        <View style={styles.body}>
          {/* Cliente + meta */}
          <View style={styles.infoRow}>
            <View style={[styles.card, { flex: 2 }]}>
              <Text style={styles.cardLabel}>Cliente</Text>
              <Text style={styles.companyName}>{customer.companyName}</Text>
              <Text style={styles.cardLine}>RUT {customer.rut}</Text>
              <Text style={styles.cardLine}>{customer.contactName}</Text>
              <Text style={styles.cardLine}>
                {customer.contactEmail}
                {customer.contactPhone ? ` · ${customer.contactPhone}` : ""}
              </Text>
            </View>
            <View style={[styles.card, { flex: 1 }]}>
              <View style={styles.metaItem}>
                <Text style={styles.cardLabel}>Emitida</Text>
                <Text style={styles.metaValue}>{formatDateLong(createdAt)}</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.cardLabel}>Válida por</Text>
                <Text style={styles.metaValue}>15 días</Text>
              </View>
              <Text style={styles.statusPill}>Referencial</Text>
            </View>
          </View>

          {/* Detalle */}
          <Text style={styles.sectionTitle}>Detalle de la cotización</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.th, styles.cellProduct]}>Producto</Text>
              <Text style={[styles.th, styles.cellQty]}>Cant.</Text>
              <Text style={[styles.th, styles.cellUnit]}>Unitario neto</Text>
              <Text style={[styles.th, styles.cellTotal]}>Total bruto</Text>
            </View>
            {lines.map((line, i) => {
              const unitTotal =
                line.pricing.unitPriceNet + line.pricing.customizationUnitPrice;
              return (
                <View
                  key={line.id}
                  style={[styles.tableRow, i % 2 === 1 ? styles.rowAlt : {}]}
                  wrap={false}
                >
                  <View style={styles.cellProduct}>
                    {line.mockupDataUrl ? (
                      <Image src={line.mockupDataUrl} style={styles.thumb} />
                    ) : (
                      <View style={styles.thumbPlaceholder}>
                        <View style={styles.thumbDiamond} />
                      </View>
                    )}
                    <View style={styles.productInfo}>
                      <Text style={styles.productTitle}>{line.productTitle}</Text>
                      <Text style={styles.productMeta}>
                        {line.productCategory} · {line.variantTitle}
                      </Text>
                      <Text style={styles.productMeta}>
                        {line.techniqueLabel} · {line.areaLabel}
                      </Text>
                      <Text style={styles.productMeta}>
                        Entrega objetivo:{" "}
                        {formatDateLong(new Date(line.requiredDate))}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.cellQty, styles.cellNum]}>
                    {line.quantity}
                  </Text>
                  <Text style={[styles.cellUnit, styles.cellNum]}>
                    {formatCLP(unitTotal)}
                  </Text>
                  <Text style={[styles.cellTotal, styles.cellNumStrong]}>
                    {formatCLP(line.pricing.totalGross)}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Totales */}
          <View style={styles.totalsWrap}>
            <View style={styles.totalsCard}>
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>Subtotal neto</Text>
                <Text style={styles.totalsValue}>{formatCLP(subtotalNet)}</Text>
              </View>
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>IVA 19%</Text>
                <Text style={styles.totalsValue}>{formatCLP(iva)}</Text>
              </View>
              <View style={styles.grandBox}>
                <Text style={styles.grandLabel}>Total</Text>
                <Text style={styles.grandValue}>{formatCLP(totalGross)}</Text>
              </View>
              <Text style={styles.totalsFoot}>
                {lines.length} {lines.length === 1 ? "línea" : "líneas"} ·{" "}
                {totalUnits} unidades · IVA incluido
              </Text>
            </View>
          </View>

          {/* Condiciones */}
          <View style={styles.termsCard} wrap={false}>
            <Text style={styles.termsTitle}>Condiciones comerciales</Text>
            {TERMS.map((t) => (
              <View key={t} style={styles.termRow}>
                <View style={styles.termBullet} />
                <Text style={styles.termText}>{t}</Text>
              </View>
            ))}
          </View>

          {/* CTA */}
          <Text style={styles.cta} wrap={false}>
            ¿Dudas o ajustes?{" "}
            <Text style={styles.ctaStrong}>{CONTACT.email}</Text> ·{" "}
            <Text style={styles.ctaStrong}>{CONTACT.whatsappDisplay}</Text> ·
            Respondemos en menos de 24 horas.
          </Text>
        </View>

        {/* Footer fijo */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            {CONTACT.razonSocial} · {SITE_URL}
          </Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}

/** Renderiza el PDF a Buffer/Uint8Array para attacheo a email. */
export async function renderQuotePDFBuffer(
  input: QuotePDFInput,
): Promise<Buffer> {
  const stream = await pdf(<QuotePDF {...input} />).toBuffer();
  // toBuffer() devuelve un NodeJS.ReadableStream. Lo consumimos a Buffer.
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk: Buffer) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}
