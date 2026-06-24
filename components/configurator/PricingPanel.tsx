"use client";

import { useId } from "react";
import { formatCLP } from "@/lib/utils/money";
import type { LinePricing } from "@/lib/quote/types";
import type { VolumeBreak } from "@/lib/shopify/types";
import { cn } from "@/lib/utils/cn";

type Props = {
  pricing: LinePricing;
  quantity: number;
  /** Mínimo cotizable del producto — punto de partida del slider. */
  minQty?: number;
  /** Tabla completa de breaks para mostrar el ladder. */
  volumePricing: VolumeBreak[];
  onJumpToQuantity?: (q: number) => void;
};

/**
 * Resolución interna del slider. El track usa escala cuadrática (sqrt para
 * ir de cantidad → posición) para que los breaks chicos (30, 50, 100) no
 * queden apelotonados a la izquierda cuando el rango llega a 750+.
 */
const SLIDER_STEPS = 1000;

/**
 * Panel de pricing completo.
 *
 * Diferencias vs PricingPanelMini:
 *  - Slider de cantidad con los breaks marcados, sincronizado con el
 *    QuantityStepper (ambos mueven el mismo estado del configurador).
 *  - Tabla de breaks de volumen con el actual destacado, clickeable.
 *  - Callout más prominente del próximo break.
 *  - Desglose con jerarquía visual fuerte.
 *  - Badge de ahorro vs baseline destacado.
 */
export function PricingPanel({
  pricing,
  quantity,
  minQty,
  volumePricing,
  onJumpToQuantity,
}: Props) {
  const sliderId = useId();
  const unitTotal = pricing.unitPriceNet + pricing.customizationUnitPrice;
  const sortedBreaks = [...volumePricing].sort((a, b) => a.minQty - b.minQty);

  // Rango del slider: del mínimo cotizable hasta 1.5× el break más alto,
  // para que se pueda "jugar" más allá del último tramo. Si el cliente tipea
  // una cantidad mayor en el stepper, el rango se estira para alcanzarla.
  const lastBreak = sortedBreaks[sortedBreaks.length - 1] ?? null;
  const sliderMin = minQty ?? sortedBreaks[0]?.minQty ?? 1;
  const sliderMax = Math.max(
    lastBreak ? Math.round(lastBreak.minQty * 1.5) : sliderMin + 100,
    quantity,
    sliderMin + 1,
  );

  const toQty = (t: number): number =>
    Math.round(sliderMin + (t / SLIDER_STEPS) ** 2 * (sliderMax - sliderMin));
  const fromQty = (q: number): number => {
    const ratio = (q - sliderMin) / (sliderMax - sliderMin);
    return Math.round(Math.sqrt(Math.min(Math.max(ratio, 0), 1)) * SLIDER_STEPS);
  };

  return (
    <section className="rounded-rpc-card border border-rpc-border bg-rpc-image-bg-light p-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-rpc-text/60">
          Precio en vivo
        </p>
        <div className="mt-4 flex items-baseline gap-3">
          <span className="font-rpc-heading text-4xl font-light tracking-tight text-rpc-text">
            {formatCLP(pricing.totalGross)}
          </span>
          <span className="text-xs uppercase tracking-[0.18em] text-rpc-text/60">
            Total bruto
          </span>
        </div>
        <p className="mt-1 font-rpc-body text-sm normal-case tracking-normal text-rpc-text/70">
          {quantity} unidades · {formatCLP(pricing.subtotalNet)} neto + IVA
        </p>
      </header>

      {/* Slider de cantidad: misma fuente de verdad que el QuantityStepper
          (onJumpToQuantity → setQuantity en el configurador), así los dos se
          mueven juntos y el precio reacciona en vivo. */}
      <div className="mt-6">
        <div className="flex items-baseline justify-between">
          <label
            htmlFor={sliderId}
            className="text-[10px] uppercase tracking-[0.18em] text-rpc-text/60"
          >
            Juega con la cantidad
          </label>
          <span className="font-rpc-body text-xs tracking-normal text-rpc-text/70">
            {quantity} u
          </span>
        </div>
        <input
          id={sliderId}
          type="range"
          min={0}
          max={SLIDER_STEPS}
          step={1}
          value={fromQty(quantity)}
          onChange={(e) => onJumpToQuantity?.(toQty(Number(e.target.value)))}
          aria-label="Cantidad de unidades"
          aria-valuetext={`${quantity} unidades`}
          className="mt-3 w-full cursor-pointer accent-rpc-accent"
        />
        {/* Marcas de los breaks sobre el track (posición en la misma escala
            cuadrática del slider). Clickeables: saltan directo al tramo. */}
        <div className="relative mt-1 h-9">
          {sortedBreaks.map((b) => {
            const pos = fromQty(b.minQty) / SLIDER_STEPS;
            if (pos < 0 || pos > 1) return null;
            const isActive = b.minQty === pricing.appliedBreak.minQty;
            return (
              <button
                key={b.minQty}
                type="button"
                onClick={() => onJumpToQuantity?.(b.minQty)}
                style={{ left: `${pos * 100}%` }}
                className={cn(
                  "absolute top-0 flex -translate-x-1/2 flex-col items-center gap-0.5",
                  isActive ? "text-rpc-accent" : "text-rpc-text/45 hover:text-rpc-text",
                )}
                aria-label={`Saltar a ${b.minQty} unidades`}
              >
                <span
                  className={cn(
                    "h-2 w-px",
                    isActive ? "bg-rpc-accent" : "bg-rpc-border",
                  )}
                  aria-hidden
                />
                <span className="font-rpc-body text-[10px] tracking-normal">
                  {b.minQty}
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-1 font-rpc-body text-xs tracking-normal text-rpc-info-dark">
          En el tramo de {pricing.appliedBreak.minQty}+ pagas{" "}
          <span className="font-semibold">
            {formatCLP(pricing.appliedBreak.unitPriceNet)} c/u
          </span>
        </p>

        {pricing.appliedSizeTier && (
          <p className="mt-1 font-rpc-body text-xs tracking-normal text-rpc-text/70">
            Personalización tamaño{" "}
            <span className="font-semibold text-rpc-text">
              {pricing.appliedSizeTier.label}
            </span>{" "}
            · {formatCLP(pricing.appliedSizeTier.priceUnit)} c/u
          </p>
        )}
      </div>

      {pricing.sizeNeedsQuoteReview && (
        <div className="mt-4 flex items-start gap-2 rounded-rpc-button border border-rpc-accent/40 bg-rpc-accent/10 px-3 py-2.5 font-rpc-body text-xs tracking-normal text-rpc-text/80">
          <span
            aria-hidden
            className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-rpc-accent"
          />
          A este tamaño, en esta técnica, el precio final lo confirma el equipo
          al cotizar.
        </div>
      )}

      {pricing.savingsVsBaselineGross > 0 && (
        <div className="mt-5 inline-flex items-center gap-2 rounded-rpc-button border border-rpc-info/40 bg-rpc-info/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-rpc-info-dark">
          <span className="h-1.5 w-1.5 rounded-full bg-rpc-info" aria-hidden />
          Ahorras {formatCLP(pricing.savingsVsBaselineGross)} vs precio base
        </div>
      )}

      {pricing.nextBreak && pricing.nextBreak.savingsGross > 0 && (
        <button
          type="button"
          onClick={() => onJumpToQuantity?.(pricing.nextBreak!.minQty)}
          className="mt-4 flex w-full items-center justify-between gap-3 rounded-rpc-button border border-rpc-accent bg-rpc-bg px-4 py-3 text-left text-rpc-text transition hover:bg-rpc-accent hover:text-rpc-button-text"
        >
          <span className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-[0.18em] opacity-70">
              Próximo break
            </span>
            <span className="text-xs uppercase tracking-[0.18em]">
              Sube a {pricing.nextBreak.minQty} unidades
            </span>
          </span>
          <span className="font-rpc-body text-sm tracking-normal">
            ahorras {formatCLP(pricing.nextBreak.savingsGross)}
          </span>
        </button>
      )}

      <div className="mt-6 space-y-2 border-t border-rpc-border pt-5 font-rpc-body text-sm normal-case tracking-normal">
        <Row label={`Unitario neto (${quantity} u)`} value={formatCLP(unitTotal)} />
        <Row label="  Producto" value={formatCLP(pricing.unitPriceNet)} muted />
        <Row
          label="  Personalización"
          value={formatCLP(pricing.customizationUnitPrice)}
          muted
        />
        {pricing.setupFee > 0 && (
          <Row label="Setup (única vez)" value={formatCLP(pricing.setupFee)} />
        )}
        <Row label="Subtotal neto" value={formatCLP(pricing.subtotalNet)} />
        <Row label="IVA 19%" value={formatCLP(pricing.iva)} muted />
      </div>

      <div className="mt-6 border-t border-rpc-border pt-5">
        <p className="text-[10px] uppercase tracking-[0.18em] text-rpc-text/60">
          Tabla de descuentos por volumen
        </p>
        <ul className="mt-3 space-y-1.5">
          {sortedBreaks.map((b) => {
            const isActive = b.minQty === pricing.appliedBreak.minQty;
            return (
              <li key={b.minQty}>
                <button
                  type="button"
                  onClick={() => onJumpToQuantity?.(b.minQty)}
                  className={cn(
                    "flex w-full items-baseline justify-between gap-3 rounded-[3px] px-3 py-2 text-left transition",
                    isActive
                      ? "bg-rpc-text text-rpc-button-text"
                      : "bg-rpc-bg text-rpc-text/70 hover:bg-rpc-image-bg-dark hover:text-rpc-button-text",
                  )}
                >
                  <span className="text-xs uppercase tracking-[0.18em]">
                    {b.minQty}+ unidades
                  </span>
                  <span className="font-rpc-body text-sm tracking-normal">
                    {formatCLP(b.unitPriceNet)}{" "}
                    <span className="opacity-60">/u</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function Row({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-3 whitespace-pre",
        muted ? "text-rpc-text/55" : "text-rpc-text",
      )}
    >
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
