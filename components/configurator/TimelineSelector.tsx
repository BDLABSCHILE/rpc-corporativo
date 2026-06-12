"use client";

import { useId } from "react";

const OCCASIONS = [
  "Regalo navideño",
  "Evento corporativo",
  "Onboarding",
  "Aniversario",
  "Otro",
] as const;

/**
 * DateSelector — fecha objetivo de entrega. Va arriba en el configurador
 * porque define el escenario de stock (inmediato vs producción origen).
 */
export function DateSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (iso: string) => void;
}) {
  const dateId = useId();
  const todayIso = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <label
        htmlFor={dateId}
        className="text-xs uppercase tracking-[0.2em] text-rpc-text/60"
      >
        ¿Para qué fecha necesitas el producto?
      </label>
      <input
        id={dateId}
        type="date"
        min={todayIso}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-3 block h-12 w-full rounded-rpc-input border border-rpc-border bg-rpc-bg px-4 font-rpc-body text-base normal-case tracking-normal text-rpc-text outline-none focus:border-rpc-text"
      />
    </div>
  );
}

/**
 * OccasionSelector — contexto opcional. Va al final del configurador
 * (después del cotizador) porque es info nice-to-have para el equipo,
 * no parte del cálculo de pricing/stock.
 */
export function OccasionSelector({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (occasion: string | null) => void;
}) {
  return (
    <div>
      <span className="text-xs uppercase tracking-[0.2em] text-rpc-text/60">
        Contexto (opcional)
      </span>
      <div className="mt-3 flex flex-wrap gap-2">
        {OCCASIONS.map((opt) => {
          const isActive = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(isActive ? null : opt)}
              className={
                "rounded-rpc-button border px-3 py-2 text-[10px] uppercase tracking-[0.18em] transition " +
                (isActive
                  ? "border-rpc-text bg-rpc-text text-rpc-button-text"
                  : "border-rpc-border bg-rpc-bg text-rpc-text/70 hover:border-rpc-text hover:text-rpc-text")
              }
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * @deprecated — usar DateSelector + OccasionSelector por separado.
 * Lo dejo por compat por si algún consumer lo importa todavía.
 */
export function TimelineSelector(props: {
  value: string;
  onChange: (iso: string) => void;
  occasion: string | null;
  onOccasionChange: (occasion: string | null) => void;
}) {
  return (
    <div className="space-y-5">
      <DateSelector value={props.value} onChange={props.onChange} />
      <OccasionSelector
        value={props.occasion}
        onChange={props.onOccasionChange}
      />
    </div>
  );
}
