/**
 * Logo global del visitante — la feature estrella del sitio.
 *
 * El cliente sube su logo UNA vez (en la home o en cualquier producto) y todo
 * el sitio lo recuerda: el catálogo completo se previsualiza con su marca y el
 * configurador lo carga automáticamente. Persistencia en localStorage con el
 * mismo patrón publisher/subscribe de lib/quote/storage.ts (sync entre tabs).
 *
 * El dataUrl se guarda re-escalado (máx 1024px) para no reventar la cuota de
 * localStorage (~5MB) con fotos de varios MB.
 */

export type StoredLogo = {
  /** Data URL (base64) re-escalado — se persiste y viaja en la cotización. */
  dataUrl: string;
  fileName: string;
  mimeType: string;
  /** Ancho/alto naturales del dataUrl guardado (para aspect ratio). */
  width: number;
  height: number;
};

const STORAGE_KEY = "rpc-logo-v1";

type Listener = () => void;
const listeners = new Set<Listener>();

function publish(): void {
  for (const l of listeners) l();
}

export function getStoredLogo(): StoredLogo | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredLogo;
    if (!parsed || typeof parsed.dataUrl !== "string") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function setStoredLogo(logo: StoredLogo): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(logo));
    publish();
    return true;
  } catch {
    // Cuota llena u otra falla de storage: el logo sigue vivo en memoria de la
    // página actual (el caller mantiene su propio estado), solo no persiste.
    publish();
    return false;
  }
}

export function clearStoredLogo(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* sin storage no hay nada que limpiar */
  }
  publish();
}

export function subscribeLogo(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Sync entre pestañas: si el logo cambia en otra tab, esta también se entera.
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) publish();
  });
}

/**
 * Re-escala una imagen (File) a máximo `maxPx` por lado y devuelve un dataUrl
 * PNG liviano + dimensiones. Los SVG no se rasterizan: se leen tal cual
 * (vectorial = liviano y nítido).
 */
export async function fileToStoredLogo(
  file: File,
  maxPx = 1024,
): Promise<StoredLogo> {
  if (file.type === "image/svg+xml") {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
    return { dataUrl, fileName: file.name, mimeType: file.type, width: 0, height: 0 };
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("No se pudo leer la imagen"));
      el.src = objectUrl;
    });
    const scale = Math.min(1, maxPx / Math.max(img.naturalWidth, img.naturalHeight));
    const w = Math.max(1, Math.round(img.naturalWidth * scale));
    const h = Math.max(1, Math.round(img.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas no disponible");
    ctx.drawImage(img, 0, 0, w, h);
    return {
      dataUrl: canvas.toDataURL("image/png"),
      fileName: file.name,
      mimeType: "image/png",
      width: w,
      height: h,
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

/** Hook-friendly: snapshot para useSyncExternalStore. */
export const logoStore = {
  subscribe: subscribeLogo,
  getSnapshot: (): string | null => getStoredLogo()?.dataUrl ?? null,
  getServerSnapshot: (): string | null => null,
};
