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
 * Buffer/Uint8Array que se puede attachear al email o devolver como descarga.
 *
 * Identidad: wordmark texto "ROPA PUBLICITARIA CHILE" + rombo coral (shape
 * simple rotado 45°), paleta RPC (tinta #101418, coral #f07848, celeste
 * #18c0f0). Tipografía Helvetica nativa de react-pdf (sin fetch de fuentes).
 */

const colors = {
  text: "#101418",
  textMuted: "#5b6168",
  border: "#e6e8ea",
  bg: "#ffffff",
  bgMuted: "#f6f7f8",
  accent: "#f07848",
  info: "#18c0f0",
} as const;

const SITE_URL = "ropapublicitariachile.cl";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: colors.text,
    padding: 48,
    paddingBottom: 64,
  },
  // --- Header ---
  brandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 2,
    borderBottomColor: colors.accent,
    paddingBottom: 16,
    marginBottom: 24,
  },
  brandMark: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  // Rombo coral del logo: cuadrado rotado 45°.
  diamond: {
    width: 11,
    height: 11,
    backgroundColor: colors.accent,
    transform: "rotate(45deg)",
    marginRight: 4,
  },
  brand: {
    fontFamily: "Helvetica-Bold",
    fontSize: 15,
    letterSpacing: 1.5,
    color: colors.text,
  },
  brandSub: {
    fontSize: 7,
    letterSpacing: 3,
    color: colors.textMuted,
    marginTop: 5,
    textTransform: "uppercase",
  },
  quoteMetaCol: {
    alignItems: "flex-end",
  },
  quoteNumber: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    letterSpacing: 1,
    color: colors.text,
  },
  quoteMetaItem: {
    fontSize: 7,
    color: colors.textMuted,
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  quoteMetaAccent: {
    fontSize: 7,
    color: colors.accent,
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  // --- Section headings ---
  sectionLabel: {
    fontSize: 7,
    letterSpacing: 2,
    color: colors.textMuted,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    color: colors.text,
    marginBottom: 14,
  },
  // --- Customer block ---
  customerBlock: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
    marginBottom: 24,
  },
  customerRow: {
    flexDirection: "row",
    gap: 24,
  },
  customerCol: {
    flex: 1,
  },
  customerName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 13,
    color: colors.text,
    marginBottom: 4,
  },
  customerLine: {
    fontSize: 9,
    color: colors.text,
    marginBottom: 2,
  },
  // --- Lines table ---
  table: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.bgMuted,
  },
  tableHeaderCell: {
    fontSize: 7,
    letterSpacing: 1,
    color: colors.textMuted,
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cellProduct: { width: "44%", paddingRight: 8, flexDirection: "row" },
  cellQty: { width: "10%", textAlign: "right" },
  cellUnit: { width: "22%", textAlign: "right" },
  cellTotal: { width: "24%", textAlign: "right" },
  thumb: {
    width: 38,
    height: 38,
    marginRight: 8,
    objectFit: "contain",
    backgroundColor: colors.bgMuted,
  },
  productInfo: { flex: 1 },
  productTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: colors.text,
    marginBottom: 3,
  },
  productMeta: {
    fontSize: 8,
    color: colors.textMuted,
    marginBottom: 1,
  },
  // --- Totals block ---
  totals: {
    marginTop: 16,
    alignItems: "flex-end",
  },
  totalsRow: {
    flexDirection: "row",
    width: 220,
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  totalsRowGrand: {
    flexDirection: "row",
    width: 220,
    justifyContent: "space-between",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.text,
    marginTop: 4,
  },
  totalsLabel: { color: colors.textMuted, fontSize: 9 },
  totalsValue: { color: colors.text, fontSize: 9 },
  totalsLabelGrand: {
    fontSize: 9,
    letterSpacing: 2,
    color: colors.text,
    textTransform: "uppercase",
  },
  totalsValueGrand: {
    fontFamily: "Helvetica-Bold",
    fontSize: 14,
    color: colors.text,
  },
  // --- Terms ---
  termsBlock: {
    marginTop: 32,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  termsTitle: {
    fontSize: 7,
    letterSpacing: 2,
    color: colors.textMuted,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  termsList: {
    fontSize: 8,
    color: colors.text,
    lineHeight: 1.5,
  },
  termItem: {
    marginBottom: 4,
  },
  // --- Footer ---
  footer: {
    position: "absolute",
    bottom: 32,
    left: 48,
    right: 48,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 7,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
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
        {/* Header con marca + datos de la cotización */}
        <View style={styles.brandRow}>
          <View>
            <View style={styles.brandMark}>
              <View style={styles.diamond} />
              <Text style={styles.brand}>ROPA PUBLICITARIA CHILE</Text>
            </View>
            <Text style={styles.brandSub}>
              Vestuario corporativo · Cotización
            </Text>
          </View>
          <View style={styles.quoteMetaCol}>
            <Text style={styles.quoteNumber}>{quoteNumber}</Text>
            <Text style={styles.quoteMetaItem}>
              Emitida {formatDateLong(createdAt)}
            </Text>
            <Text style={styles.quoteMetaAccent}>
              Referencial · sujeta a confirmación
            </Text>
          </View>
        </View>

        {/* Cliente */}
        <View style={styles.customerBlock}>
          <Text style={styles.sectionLabel}>Cliente</Text>
          <View style={styles.customerRow}>
            <View style={styles.customerCol}>
              <Text style={styles.customerName}>{customer.companyName}</Text>
              <Text style={styles.customerLine}>RUT {customer.rut}</Text>
            </View>
            <View style={styles.customerCol}>
              <Text style={styles.customerLine}>{customer.contactName}</Text>
              <Text style={styles.customerLine}>{customer.contactEmail}</Text>
              {customer.contactPhone && (
                <Text style={styles.customerLine}>{customer.contactPhone}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Tabla de líneas */}
        <Text style={styles.sectionTitle}>Detalle de productos</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.cellProduct]}>Producto</Text>
            <Text style={[styles.tableHeaderCell, styles.cellQty]}>Cant.</Text>
            <Text style={[styles.tableHeaderCell, styles.cellUnit]}>Unitario neto</Text>
            <Text style={[styles.tableHeaderCell, styles.cellTotal]}>Total bruto</Text>
          </View>
          {lines.map((line) => {
            const unitTotal =
              line.pricing.unitPriceNet + line.pricing.customizationUnitPrice;
            return (
              <View key={line.id} style={styles.tableRow} wrap={false}>
                <View style={styles.cellProduct}>
                  {/* Thumbnail del producto + textos al lado, para que el
                      cliente recuerde visualmente qué cotizó. react-pdf
                      descarga la imagen del CDN al generar el PDF. */}
                  {line.productImageUrl ? (
                    <Image src={line.productImageUrl} style={styles.thumb} />
                  ) : (
                    <View style={styles.thumb} />
                  )}
                  <View style={styles.productInfo}>
                    <Text style={styles.productTitle}>{line.productTitle}</Text>
                    <Text style={styles.productMeta}>
                      {line.productCategory} · Variante: {line.variantTitle}
                    </Text>
                    <Text style={styles.productMeta}>
                      Técnica: {line.techniqueLabel} · Zona: {line.areaLabel}
                    </Text>
                    <Text style={styles.productMeta}>
                      Fecha objetivo: {formatDateLong(new Date(line.requiredDate))}
                    </Text>
                  </View>
                </View>
                <Text style={styles.cellQty}>{line.quantity}</Text>
                <Text style={styles.cellUnit}>{formatCLP(unitTotal)}</Text>
                <Text style={styles.cellTotal}>{formatCLP(line.pricing.totalGross)}</Text>
              </View>
            );
          })}
        </View>

        {/* Totales */}
        <View style={styles.totals}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>
              {lines.length} {lines.length === 1 ? "línea" : "líneas"} · {totalUnits} unidades
            </Text>
          </View>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Subtotal neto</Text>
            <Text style={styles.totalsValue}>{formatCLP(subtotalNet)}</Text>
          </View>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>IVA 19%</Text>
            <Text style={styles.totalsValue}>{formatCLP(iva)}</Text>
          </View>
          <View style={styles.totalsRowGrand}>
            <Text style={styles.totalsLabelGrand}>Total bruto</Text>
            <Text style={styles.totalsValueGrand}>{formatCLP(totalGross)}</Text>
          </View>
        </View>

        {/* Condiciones comerciales — genéricas del rubro, sin cifras inventadas. */}
        <View style={styles.termsBlock}>
          <Text style={styles.termsTitle}>Condiciones comerciales</Text>
          <View style={styles.termsList}>
            <Text style={styles.termItem}>
              · Esta cotización es referencial y será confirmada por nuestro equipo en menos de 24 horas hábiles.
            </Text>
            <Text style={styles.termItem}>
              · Antes de producir te enviamos el mockup digital con tu logo aplicado, para tu aprobación.
            </Text>
            <Text style={styles.termItem}>
              · Plazos de entrega según disponibilidad: stock en Chile para personalizar o fabricación de la línea de cocina y uniformes. El equipo te confirma el plazo exacto.
            </Text>
            <Text style={styles.termItem}>
              · Costo y plazo de despacho a confirmar según volumen y destino.
            </Text>
            <Text style={styles.termItem}>
              · Forma de pago y condiciones de facturación se coordinan directamente con nuestro equipo.
            </Text>
            <Text style={styles.termItem}>
              · Emitimos factura electrónica a nombre de tu empresa (necesitamos razón social, RUT y giro).
            </Text>
          </View>
        </View>

        {/* Footer fijo */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Ropa Publicitaria Chile · {SITE_URL} · {CONTACT.email}
          </Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
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
