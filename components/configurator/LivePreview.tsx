"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva";
import type Konva from "konva";
import type { PrintArea, ShopifyImage } from "@/lib/shopify/types";
import { cn } from "@/lib/utils/cn";

/**
 * Handle imperativo expuesto al parent (ProductConfigurator) para capturar
 * el mockup compuesto al momento de agregar la línea al carrito. La captura
 * mergea el producto (img HTML normal) + el logo (Konva stage) en un canvas
 * temporal porque hoy son dos capas separadas en el DOM.
 *
 * Returns DataURL PNG o null si no hay logo / la captura falló (ej. CORS).
 */
export type LivePreviewHandle = {
  captureMockup: () => string | null;
};

type Props = {
  /** Imagen "preferida" para arrancar (definida por la zona seleccionada o la principal). */
  productImage: ShopifyImage;
  /** Todas las imágenes del producto. El cliente puede cambiar cuál ve via thumbnails. */
  allImages: ShopifyImage[];
  /** Zona "principal" para referencia de cm reales. Puede ser null. */
  area: PrintArea | null;
  logoUrl: string | null;
  /**
   * Color hex (#RRGGBB) para teñir la foto del producto según la variante
   * seleccionada. Se aplica como overlay con `mix-blend-mode: multiply` sobre
   * la foto base crema/blanca: el blanco toma el color exacto y las sombras
   * horneadas dan volumen. Null = sin tinte.
   */
  tintColor?: string | null;
  /**
   * Reporta el lado más largo del logo en cm (o null si no hay logo/área).
   * Lo usa el configurador para elegir el tramo de precio por tamaño. Debe ser
   * estable (useCallback) para no re-disparar el efecto que lo llama.
   */
  onLogoSizeChange?: (longSideCm: number | null) => void;
};

/**
 * Tamaño interno del Stage Konva. CSS responsive lo escala al container,
 * la lógica interna trabaja en este sistema de coordenadas.
 */
const CANVAS_SIZE = 900;

/**
 * Celeste informativo (token rpc-info de globals.css). Konva no puede leer
 * CSS variables, así que duplicamos el hex aquí con referencia al token.
 */
const RPC_INFO_HEX = "#18c0f0";

type LogoBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
};

type Rect = { x: number; y: number; width: number; height: number };

function useHtmlImage(src: string | null): HTMLImageElement | null {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    if (!src) {
      setImg(null);
      return;
    }
    const el = new window.Image();
    el.crossOrigin = "anonymous";
    el.onload = () => setImg(el);
    el.src = src;
    return () => {
      el.onload = null;
    };
  }, [src]);
  return img;
}

function clampValue(v: number, min: number, max: number): number {
  return Math.min(Math.max(v, min), Math.max(min, max));
}

/** Bounding box del polígono del área imprimible (en px de la imagen original). */
function polygonBounds(poly: Array<[number, number]>): Rect | null {
  if (poly.length === 0) return null;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [px, py] of poly) {
    minX = Math.min(minX, px);
    minY = Math.min(minY, py);
    maxX = Math.max(maxX, px);
    maxY = Math.max(maxY, py);
  }
  if (maxX <= minX || maxY <= minY) return null;
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

/**
 * Re-encaja un LogoBox dentro del área imprimible: si quedó más grande que el
 * área (o que el máximo en cm), lo achica manteniendo aspecto; luego ajusta
 * x/y para que no se salga. Se usa al cambiar de zona/imagen y como red de
 * seguridad después de drag/transform.
 */
function clampBoxToRect(
  box: LogoBox,
  rect: Rect,
  maxPx: { w: number; h: number } | null,
): LogoBox {
  const aspect = box.width / box.height || 1;
  let width = box.width;
  let height = box.height;
  const maxW = Math.min(rect.width, maxPx?.w ?? Infinity);
  const maxH = Math.min(rect.height, maxPx?.h ?? Infinity);
  if (width > maxW) {
    width = maxW;
    height = width / aspect;
  }
  if (height > maxH) {
    height = maxH;
    width = height * aspect;
  }
  return {
    ...box,
    width,
    height,
    x: clampValue(box.x, rect.x, rect.x + rect.width - width),
    y: clampValue(box.y, rect.y, rect.y + rect.height - height),
  };
}

/**
 * Topa el tamaño del logo al máximo de la zona (en px del Stage), preservando
 * el aspecto. NO toca la posición. Se usa al soltar un transform para que el
 * logo nunca quede más grande que el máximo en cm que definió la marca.
 */
function clampSizeToMax(
  box: LogoBox,
  maxPx: { w: number; h: number } | null,
): LogoBox {
  if (!maxPx) return box;
  const aspect = box.width / box.height || 1;
  let width = box.width;
  let height = box.height;
  if (width > maxPx.w) {
    width = maxPx.w;
    height = width / aspect;
  }
  if (height > maxPx.h) {
    height = maxPx.h;
    width = height * aspect;
  }
  return { ...box, width, height };
}

/**
 * Posición inicial del logo: centrado dentro del área imprimible, al 70% de
 * su tamaño (sin pasar el máximo en cm) para que caiga cómodo dentro de la
 * guía y el cliente lo ajuste desde ahí. Sin área conocida, cae al centro
 * del canvas con el tamaño histórico (25% del stage).
 */
function initialLogoBox(
  logoImg: HTMLImageElement,
  rect: Rect | null,
  maxPx: { w: number; h: number } | null,
): LogoBox {
  const aspect = logoImg.width / logoImg.height || 1;

  if (!rect) {
    const target = CANVAS_SIZE * 0.25;
    const width = aspect >= 1 ? target : target * aspect;
    const height = aspect >= 1 ? target / aspect : target;
    return {
      x: (CANVAS_SIZE - width) / 2,
      y: (CANVAS_SIZE - height) / 2,
      width,
      height,
      rotation: 0,
    };
  }

  const targetW = Math.min(rect.width * 0.7, maxPx?.w ?? Infinity);
  const targetH = Math.min(rect.height * 0.7, maxPx?.h ?? Infinity);
  let width = targetW;
  let height = width / aspect;
  if (height > targetH) {
    height = targetH;
    width = height * aspect;
  }
  return {
    x: rect.x + (rect.width - width) / 2,
    y: rect.y + (rect.height - height) / 2,
    width,
    height,
    rotation: 0,
  };
}

export const LivePreview = forwardRef<LivePreviewHandle, Props>(
  function LivePreview(
    { productImage, allImages, area, logoUrl, tintColor, onLogoSizeChange },
    ref,
  ) {
  const logoImg = useHtmlImage(logoUrl);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState<number>(CANVAS_SIZE);

  // Galería: dedupe por URL y cap a 6 thumbnails para no saturar.
  // Algunos productos en Shopify tienen 8-10 imágenes (incluye lifestyle);
  // el cliente solo necesita ver opciones de "cara" para personalizar.
  const galleryImages = useMemo(() => {
    const seen = new Set<string>();
    const out: ShopifyImage[] = [];
    for (const img of allImages) {
      if (img.url && !seen.has(img.url)) {
        seen.add(img.url);
        out.push(img);
      }
      if (out.length >= 6) break;
    }
    return out;
  }, [allImages]);

  // Imagen actualmente seleccionada para mostrar en el canvas. Cambia cuando
  // el cliente clickea un thumbnail o cuando cambia la zona en el configurador.
  const [activeImageUrl, setActiveImageUrl] = useState<string>(productImage.url);

  // Si la zona seleccionada cambia (lo que actualiza productImage), syncar.
  useEffect(() => {
    setActiveImageUrl(productImage.url);
  }, [productImage.url]);

  // Versión HTMLImageElement (CORS-aware) del producto. La usa el captureMockup
  // para dibujar en el canvas temporal — el <img> visible del DOM no nos sirve
  // porque no podemos garantizar que tenga crossOrigin habilitado.
  const productImg = useHtmlImage(activeImageUrl);

  // ResizeObserver para hacer responsive el Stage interno.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setContainerSize(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const [logoBox, setLogoBox] = useState<LogoBox | null>(null);
  const logoRef = useRef<Konva.Image | null>(null);
  const transformerRef = useRef<Konva.Transformer | null>(null);

  // Guía del área imprimible: visible mientras el cliente arrastra o
  // transforma el logo, se desvanece (CSS transition) al soltar.
  const [isAdjusting, setIsAdjusting] = useState(false);

  // Tamaño en cm "en vivo" mientras se transforma (logoBox solo se commitea
  // al soltar; esto alimenta el badge flotante durante el gesto).
  const [liveCm, setLiveCm] = useState<{ w: string; h: string } | null>(null);

  /**
   * Área imprimible proyectada al sistema del Stage (900×900). El polígono
   * viene en píxeles de la imagen original (1200×1200 en los mocks), así que
   * aplicamos la misma matemática object-contain que usa drawContained y el
   * <img> visible. Cuando lleguen las fotos reales del cliente se calibran
   * los polígonos por producto.
   */
  const printRect = useMemo<Rect | null>(() => {
    if (!area) return null;
    const bounds = polygonBounds(area.areaPolygon);
    if (!bounds) return null;
    const naturalW = productImg?.naturalWidth || productImage.width || CANVAS_SIZE;
    const naturalH = productImg?.naturalHeight || productImage.height || CANVAS_SIZE;
    const s = Math.min(CANVAS_SIZE / naturalW, CANVAS_SIZE / naturalH);
    const dx = (CANVAS_SIZE - naturalW * s) / 2;
    const dy = (CANVAS_SIZE - naturalH * s) / 2;
    return {
      x: bounds.x * s + dx,
      y: bounds.y * s + dy,
      width: bounds.width * s,
      height: bounds.height * s,
    };
  }, [area, productImg, productImage]);

  /** Tamaño máximo del logo en px del Stage según los cm máximos del área. */
  const maxLogoPx = useMemo(() => {
    if (!area) return null;
    return { w: area.maxWidthCm * area.pxPerCm, h: area.maxHeightCm * area.pxPerCm };
  }, [area]);

  // Coloca el logo al cargarlo o al cambiar de zona; si solo cambió la imagen
  // de fondo (galería), re-encaja la posición actual sin resetear el trabajo
  // que el cliente ya hizo.
  const placedKeyRef = useRef<string | null>(null);
  useEffect(() => {
    if (!logoImg) {
      setLogoBox(null);
      placedKeyRef.current = null;
      return;
    }
    const key = `${logoImg.src}|${area?.id ?? "none"}`;
    if (placedKeyRef.current !== key) {
      placedKeyRef.current = key;
      setLogoBox(initialLogoBox(logoImg, printRect, maxLogoPx));
    } else if (printRect) {
      setLogoBox((box) => (box ? clampBoxToRect(box, printRect, maxLogoPx) : box));
    }
  }, [logoImg, area, printRect, maxLogoPx]);

  useEffect(() => {
    if (transformerRef.current && logoRef.current) {
      transformerRef.current.nodes([logoRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [logoBox, logoImg]);

  // Reporta el lado más largo del logo en cm al configurador, para elegir el
  // tramo de precio por tamaño. Se recalcula al redimensionar el logo o al
  // cambiar de zona (cambia pxPerCm). onLogoSizeChange debe ser estable.
  useEffect(() => {
    if (!onLogoSizeChange) return;
    if (!area || !logoBox) {
      onLogoSizeChange(null);
      return;
    }
    onLogoSizeChange(Math.max(logoBox.width, logoBox.height) / area.pxPerCm);
  }, [logoBox, area, onLogoSizeChange]);

  const scale = containerSize / CANVAS_SIZE;

  const sizeCm =
    area && logoBox
      ? {
          w: (logoBox.width / area.pxPerCm).toFixed(1),
          h: (logoBox.height / area.pxPerCm).toFixed(1),
        }
      : null;

  // Lo que muestra el badge: el tamaño en vivo durante el gesto, o el
  // commiteado en reposo.
  const shownCm = liveCm ?? sizeCm;

  const resetLogo = () => {
    if (logoImg) setLogoBox(initialLogoBox(logoImg, printRect, maxLogoPx));
  };

  /**
   * Límite de arrastre: libre dentro de TODO el canvas (la imagen del
   * producto). El cliente puede mover el logo donde quiera para previsualizar
   * cómo se vería; el área imprimible queda como guía visual (rect punteado),
   * no como restricción. La zona seleccionada sigue definiendo precio y
   * tamaño máximo en cm reales que se aplica al confeccionar.
   */
  const dragBound = (pos: Konva.Vector2d): Konva.Vector2d => {
    const node = logoRef.current;
    const w = (node?.width() ?? logoBox?.width ?? 0) * scale;
    const h = (node?.height() ?? logoBox?.height ?? 0) * scale;
    const minX = 0;
    const maxX = CANVAS_SIZE * scale - w;
    const minY = 0;
    const maxY = CANVAS_SIZE * scale - h;
    return {
      x: clampValue(pos.x, minX, maxX),
      y: clampValue(pos.y, minY, maxY),
    };
  };

  /** Límite "blando": solo evita que el logo se vaya del canvas (no del área). */
  const clampToCanvas = (box: LogoBox): LogoBox => ({
    ...box,
    x: clampValue(box.x, 0, CANVAS_SIZE - box.width),
    y: clampValue(box.y, 0, CANVAS_SIZE - box.height),
  });

  const updateLiveCm = () => {
    const node = logoRef.current;
    if (!node || !area) return;
    setLiveCm({
      w: ((node.width() * node.scaleX()) / area.pxPerCm).toFixed(1),
      h: ((node.height() * node.scaleY()) / area.pxPerCm).toFixed(1),
    });
  };

  const endAdjusting = () => {
    setIsAdjusting(false);
    setLiveCm(null);
  };

  // Captura del mockup compuesto (producto + logo) a un canvas temporal y
  // devuelve DataURL PNG. Se invoca desde el padre vía ref al momento de
  // agregar la línea al carrito.
  useImperativeHandle(
    ref,
    () => ({
      captureMockup() {
        if (!productImg || !logoImg || !logoBox) return null;
        try {
          const canvas = document.createElement("canvas");
          canvas.width = CANVAS_SIZE;
          canvas.height = CANVAS_SIZE;
          const ctx = canvas.getContext("2d");
          if (!ctx) return null;

          // Fondo del slot (mismo color que el container visible) para que el
          // mockup no quede transparente si el producto no llena el cuadrado.
          ctx.fillStyle = "#f6f6f3";
          ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

          // Producto con object-contain: respeta aspect ratio, se centra
          drawContained(ctx, productImg, CANVAS_SIZE, CANVAS_SIZE);

          // Logo con rotación: trasladamos al centro del logo, rotamos,
          // dibujamos centrado en 0,0
          ctx.save();
          ctx.translate(
            logoBox.x + logoBox.width / 2,
            logoBox.y + logoBox.height / 2,
          );
          ctx.rotate((logoBox.rotation * Math.PI) / 180);
          ctx.drawImage(
            logoImg,
            -logoBox.width / 2,
            -logoBox.height / 2,
            logoBox.width,
            logoBox.height,
          );
          ctx.restore();

          return canvas.toDataURL("image/png");
        } catch (err) {
          // Si Shopify CDN no devuelve CORS, toDataURL lanza SecurityError.
          // En ese caso devolvemos null y el flujo sigue sin mockup adjunto.
          console.warn("[LivePreview] captureMockup failed:", err);
          return null;
        }
      },
    }),
    [productImg, logoImg, logoBox],
  );

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        className="relative mx-auto aspect-square w-full overflow-hidden rounded-rpc-card bg-rpc-image-bg-light"
      >
        {/* Foto del producto + tinte de color: el wrapper `isolate` aísla el
            blend mode del fondo gris del container. Los overlays de tinte
            usan `mask-image` con la MISMA foto del producto, así el color
            sólo se renderiza donde la prenda es opaca (cutout transparente).
            Resultado: la prenda toma el color de la variante con sombras
            preservadas (multiply + color) y el fondo gris queda intacto. */}
        <div className="absolute inset-0 isolate">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeImageUrl}
            alt={productImage.altText ?? "Producto"}
            className="absolute inset-0 h-full w-full object-contain"
            draggable={false}
          />

          {tintColor && (
            /* multiply puro sobre la foto base crema/blanca: blanco × color =
               color exacto, y las sombras horneadas en la foto (ghost-mannequin)
               oscurecen el tono proporcionalmente → la prenda toma el color real
               de la variante con volumen y pliegues, sin lavar el matiz. La
               máscara con la MISMA foto limita el tinte al cutout opaco, así el
               fondo gris del container queda intacto. */
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 transition-colors duration-200"
              style={{
                backgroundColor: tintColor,
                mixBlendMode: "multiply",
                WebkitMaskImage: `url("${activeImageUrl}")`,
                maskImage: `url("${activeImageUrl}")`,
                // CLAVE: usar el canal alpha del cutout como máscara, no la
                // luminancia (default `match-source` la diluiría y el multiply
                // saldría lavado/rosa en vez del color pleno).
                maskMode: "alpha",
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskPosition: "center",
                maskPosition: "center",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
              }}
            />
          )}
        </div>

        <Stage
          width={containerSize}
          height={containerSize}
          scaleX={scale}
          scaleY={scale}
          className="absolute inset-0"
        >
          <Layer>
            {logoImg && logoBox && (
              <>
                <KonvaImage
                  ref={(node) => {
                    logoRef.current = node;
                  }}
                  image={logoImg}
                  x={logoBox.x}
                  y={logoBox.y}
                  width={logoBox.width}
                  height={logoBox.height}
                  rotation={logoBox.rotation}
                  draggable
                  dragBoundFunc={dragBound}
                  onDragStart={() => setIsAdjusting(true)}
                  onDragEnd={(e) => {
                    endAdjusting();
                    const moved = { ...logoBox, x: e.target.x(), y: e.target.y() };
                    setLogoBox(clampToCanvas(moved));
                  }}
                  onTransformStart={() => setIsAdjusting(true)}
                  onTransform={updateLiveCm}
                  onTransformEnd={() => {
                    endAdjusting();
                    const node = logoRef.current;
                    if (!node) return;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();
                    node.scaleX(1);
                    node.scaleY(1);
                    const next: LogoBox = {
                      x: node.x(),
                      y: node.y(),
                      width: Math.max(20, node.width() * scaleX),
                      height: Math.max(20, node.height() * scaleY),
                      rotation: node.rotation(),
                    };
                    // Tope duro: el logo no puede superar el máximo en cm de la
                    // zona (lo que la marca definió como imprimible). Al soltar
                    // se reajusta al máximo si el cliente lo agrandó de más.
                    setLogoBox(clampToCanvas(clampSizeToMax(next, maxLogoPx)));
                  }}
                />
                <Transformer
                  ref={(node) => {
                    transformerRef.current = node;
                  }}
                  rotateEnabled
                  borderStroke={RPC_INFO_HEX}
                  anchorStroke={RPC_INFO_HEX}
                  anchorFill="#ffffff"
                  anchorSize={11}
                  anchorCornerRadius={3}
                  enabledAnchors={[
                    "top-left",
                    "top-right",
                    "bottom-left",
                    "bottom-right",
                  ]}
                  boundBoxFunc={(oldBox, newBox) => {
                    // Mínimo legible para no colapsar el logo a 0. El tope
                    // máximo (cm de la zona) se aplica al soltar en
                    // onTransformEnd vía clampSizeToMax — ahí trabajamos en el
                    // sistema de coordenadas del Stage (900px) donde el límite
                    // en px es inequívoco.
                    if (newBox.width < 20 || newBox.height < 20) return oldBox;
                    return newBox;
                  }}
                />
              </>
            )}
          </Layer>
        </Stage>

        {/* Badge flotante con el tamaño real del logo en cm, en vivo. */}
        {shownCm && area && logoImg && (
          <div className="pointer-events-none absolute left-3 top-3 z-10 rounded-rpc-button border border-rpc-info/50 bg-rpc-bg/90 px-3 py-1.5 backdrop-blur">
            <p className="font-rpc-body text-xs tracking-normal text-rpc-text">
              Tu logo:{" "}
              <span className="font-semibold">
                {shownCm.w} × {shownCm.h} cm
              </span>
              <span className="text-rpc-text/55">
                {" "}— máx {area.maxWidthCm} × {area.maxHeightCm} cm
              </span>
            </p>
          </div>
        )}

        {!logoImg && (
          <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
            <div className="rounded-rpc-card border border-rpc-border bg-rpc-bg/95 px-4 py-2 text-center backdrop-blur">
              <p className="text-[10px] uppercase tracking-[0.18em] text-rpc-text/60">
                Sube tu logo para previsualizarlo
              </p>
            </div>
          </div>
        )}
      </div>

      {/*
        Galería de thumbnails: deja al cliente elegir cuál cara del producto
        ve en el preview. Útil para llaveros / botellas / billeteras donde
        el grabado va por una cara distinta de la imagen principal.
      */}
      {galleryImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {galleryImages.map((img) => {
            const isActive = img.url === activeImageUrl;
            return (
              <button
                key={img.url}
                type="button"
                onClick={() => setActiveImageUrl(img.url)}
                className={cn(
                  "relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-[3px] border-2 bg-rpc-image-bg-light transition",
                  isActive
                    ? "border-rpc-text"
                    : "border-transparent hover:border-rpc-border",
                )}
                aria-label={`Ver ${img.altText ?? "cara del producto"}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.altText ?? ""}
                  className="h-full w-full object-contain"
                  draggable={false}
                />
              </button>
            );
          })}
        </div>
      )}

      {logoBox && area && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-rpc-card border border-rpc-border bg-rpc-bg px-4 py-3">
          <div className="flex items-baseline gap-3">
            <span className="text-[10px] uppercase tracking-[0.18em] text-rpc-text/60">
              Zona: {area.label}
            </span>
            <span className="font-rpc-body text-xs tracking-normal text-rpc-text/55">
              imprime hasta {area.maxWidthCm} × {area.maxHeightCm} cm
            </span>
          </div>

          <button
            type="button"
            onClick={resetLogo}
            className="rounded-rpc-button border border-rpc-border px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-rpc-text/70 transition hover:border-rpc-text hover:text-rpc-text"
          >
            Centrar
          </button>
        </div>
      )}
    </div>
  );
});

/**
 * Dibuja una imagen sobre un canvas respetando aspect ratio (object-contain).
 * Centra horizontal/verticalmente según corresponda. Idéntico al comportamiento
 * del <img className="object-contain"> que el cliente ve en pantalla.
 */
function drawContained(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvasW: number,
  canvasH: number,
): void {
  const imgAspect = img.naturalWidth / img.naturalHeight;
  const canvasAspect = canvasW / canvasH;
  let drawW: number;
  let drawH: number;
  let dx: number;
  let dy: number;
  if (imgAspect > canvasAspect) {
    drawW = canvasW;
    drawH = canvasW / imgAspect;
    dx = 0;
    dy = (canvasH - drawH) / 2;
  } else {
    drawH = canvasH;
    drawW = canvasH * imgAspect;
    dx = (canvasW - drawW) / 2;
    dy = 0;
  }
  ctx.drawImage(img, dx, dy, drawW, drawH);
}
