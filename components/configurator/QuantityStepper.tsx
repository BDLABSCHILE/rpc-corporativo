"use client";

import { useId } from "react";
import { formatCLP } from "@/lib/utils/money";
import { cn } from "@/lib/utils/cn";

type Props = {
  value: number;
  minQty: number;
  onChange: (q: number) => void;
  /**
   * Próximo break sugerido por el engine. `savingsGross` es el ahorro con IVA
   * (lo mostramos para consistencia con el "Total bruto" del cotizador).
   */
  nextBreak: { minQty: number; savingsGross: number } | null;
};

export function QuantityStepper({ value, minQty, onChange, nextBreak }: Props) {
  const id = useId();
  const isBelowMin = value < minQty;

  // Click suelto = ±1 unidad. Para saltos grandes el usuario tipea en el input,
  // o usa el botón del "próximo break" abajo que salta al siguiente tramo.
  const dec = () => onChange(Math.max(1, value - 1));
  const inc = () => onChange(value + 1);

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label
          htmlFor={id}
          className="text-xs uppercase tracking-[0.2em] text-rpc-text/60"
        >
          Cantidad
        </label>
        <span className="text-[10px] uppercase tracking-[0.18em] text-rpc-text/50">
          Mínimo {minQty} u
        </span>
      </div>

      <div className="mt-3 flex items-stretch gap-2">
        <button
          type="button"
          onClick={dec}
          aria-label="Restar 1"
          className="flex h-12 w-12 items-center justify-center rounded-rpc-button border border-rpc-border text-2xl font-light text-rpc-text transition hover:border-rpc-text"
        >
          −
        </button>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={1}
          value={value}
          onChange={(e) => {
            const n = Number.parseInt(e.target.value, 10);
            onChange(Number.isFinite(n) && n > 0 ? n : 1);
          }}
          className={cn(
            "h-12 flex-1 rounded-rpc-input border bg-rpc-bg px-4 text-center font-rpc-heading text-2xl font-light tracking-tight outline-none focus:border-rpc-text",
            isBelowMin ? "border-rpc-error text-rpc-error" : "border-rpc-border text-rpc-text",
          )}
        />
        <button
          type="button"
          onClick={inc}
          aria-label="Sumar 1"
          className="flex h-12 w-12 items-center justify-center rounded-rpc-button border border-rpc-border text-2xl font-light text-rpc-text transition hover:border-rpc-text"
        >
          +
        </button>
      </div>

      {isBelowMin && (
        <p className="mt-2 text-xs text-rpc-error">
          Bajo el mínimo de cotización ({minQty} unidades). Sube para tarifa corporativa.
        </p>
      )}

      {nextBreak && nextBreak.savingsGross > 0 && (
        <button
          type="button"
          onClick={() => onChange(nextBreak.minQty)}
          className="mt-3 flex w-full items-center justify-between gap-3 rounded-rpc-button border border-rpc-text bg-rpc-image-bg-light px-4 py-3 text-left transition hover:bg-rpc-text hover:text-rpc-button-text"
        >
          <span className="text-xs uppercase tracking-[0.18em]">
            Sube a {nextBreak.minQty} unidades
          </span>
          <span className="font-rpc-body text-xs tracking-normal">
            ahorras {formatCLP(nextBreak.savingsGross)}
          </span>
        </button>
      )}
    </div>
  );
}
