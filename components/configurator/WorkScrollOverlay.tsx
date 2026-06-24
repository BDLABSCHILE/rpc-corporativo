"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { RealWork } from "@/lib/works/works";

/** Offset del sticky del preview (lg:top-24 = 6rem = 96px). */
const STICKY_TOP = 96;
/** Tramo inicial del scroll donde se mantiene el preview del producto antes de
 *  empezar a revelar trabajos (para que primero se vea la prenda + el logo). */
const HOLD = 0.12;

type Props = {
  works: readonly RealWork[];
  /** Ref al grid completo del configurador — mide el rango en que el preview
   *  queda "pineado" mientras se scrollea la columna derecha. */
  containerRef: React.RefObject<HTMLElement | null>;
};

/**
 * Overlay sobre el preview sticky de la PDP: a medida que se scrollea la ficha
 * (cotización, stock, etc.), las fotos de TRABAJOS REALES con esta prenda van
 * apareciendo encima del preview del producto, en crossfade encadenado, en vez
 * de dejar la foto fija.
 *
 * - Solo desktop (lg+) y solo si el producto tiene trabajos. Sin trabajos no
 *   renderiza nada → el preview queda exactamente como hoy.
 * - Respeta prefers-reduced-motion (se desactiva).
 * - Decorativo (aria-hidden): la versión accesible y clickeable es la grilla
 *   ProductWorks al final de la página.
 */
export function WorkScrollOverlay({ works, containerRef }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  // Progreso en [0, works.length]: 0 = preview del producto, n = último trabajo.
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (works.length === 0) return;
    const mqDesktop = window.matchMedia("(min-width: 1024px)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;

    const compute = () => {
      raf = 0;
      const container = containerRef.current;
      const sticky = rootRef.current?.parentElement;
      if (!container || !sticky || !mqDesktop.matches || mqReduce.matches) {
        setActive(false);
        return;
      }
      const rect = container.getBoundingClientRect();
      // Distancia scrolleable mientras el preview está pineado.
      const total = rect.height - sticky.offsetHeight;
      if (total <= 0) {
        setActive(false);
        return;
      }
      setActive(true);
      const scrolledPast = STICKY_TOP - rect.top;
      const raw = Math.min(1, Math.max(0, scrolledPast / total));
      const held = Math.min(1, Math.max(0, (raw - HOLD) / (1 - HOLD)));
      setProgress(held * works.length);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    mqDesktop.addEventListener("change", compute);
    mqReduce.addEventListener("change", compute);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      mqDesktop.removeEventListener("change", compute);
      mqReduce.removeEventListener("change", compute);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [works.length, containerRef]);

  if (works.length === 0) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 z-20 hidden aspect-square overflow-hidden rounded-rpc-card lg:block"
    >
      {works.map((w, i) => {
        const layer = i + 1; // capa 0 = preview del producto (no se dibuja acá)
        // Cada capa se vuelve opaca al pasar su umbral y se queda opaca; la
        // siguiente entra encima → crossfade entre fotos sin que se cuele el
        // preview, salvo en la primera transición (preview → primer trabajo).
        const opacity = active
          ? Math.min(1, Math.max(0, progress - (layer - 1)))
          : 0;
        if (opacity <= 0.001) return null;
        return (
          <div key={w.slug} className="absolute inset-0" style={{ opacity }}>
            <Image
              src={w.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 48vw, 0px"
              className="object-cover"
            />
            <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-rpc-bg/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-rpc-text shadow-sm backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-rpc-accent" />
              Trabajo real
            </span>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-rpc-text/85 via-rpc-text/35 to-transparent p-4 pt-12">
              <p className="font-rpc-heading text-base font-bold leading-tight text-white">
                {w.client ?? "Tanda multimarca"}
              </p>
              <p className="mt-0.5 font-rpc-body text-xs normal-case tracking-normal text-white/85">
                {w.garments.join(" · ")} — {w.techniques.join(" + ")}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
