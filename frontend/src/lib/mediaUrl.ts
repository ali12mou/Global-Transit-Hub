import { getApiBaseUrl } from "./runtimeConfig";

/**
 * Résout les URLs des médias CMS (/uploads) pour le dev (proxy Vite) et la prod (API sur autre origine).
 */
function apiOriginFromConfig(): string | undefined {
  const base = getApiBaseUrl();
  if (!base) return undefined;
  try {
    return new URL(base).origin;
  } catch {
    return undefined;
  }
}

function isLocalDevOrigin(origin: string): boolean {
  try {
    const h = new URL(origin).hostname;
    return h === "127.0.0.1" || h === "localhost";
  } catch {
    return true;
  }
}

/**
 * @param src URL absolue, chemin /uploads/..., data URL, ou vide
 */
export function resolveMediaUrl(src: string): string {
  const s = String(src ?? "").trim();
  if (!s) return "";
  if (s.startsWith("data:") || s.startsWith("blob:")) return s;

  const apiOrigin = apiOriginFromConfig();

  if (s.startsWith("http://") || s.startsWith("https://")) {
    try {
      const u = new URL(s);
      const local = u.hostname === "127.0.0.1" || u.hostname === "localhost";
      if (local && u.pathname.startsWith("/uploads")) {
        return u.pathname + u.search + u.hash;
      }
    } catch {
      return s;
    }
    return s;
  }

  if (s.startsWith("/")) {
    if (!apiOrigin || isLocalDevOrigin(apiOrigin)) {
      return s;
    }
    return `${apiOrigin.replace(/\/$/, "")}${s}`;
  }

  return s.startsWith("uploads/") ? `/${s}` : s;
}
