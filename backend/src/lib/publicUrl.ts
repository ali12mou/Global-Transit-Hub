import type { Request } from "express";

/**
 * Normalise l’URL ou le chemin stocké en base pour l’API / l’admin.
 * Retourne des chemins relatifs `/uploads/...` (pas d’hôte) pour que le navigateur
 * les charge via le même origine que le frontend (proxy Vite en dev) ou
 * pour que le frontend préfixe avec VITE_API_BASE_URL en prod.
 */
export function toPublicUrl(_req: Request | any, src: string): string {
  const raw = String(src ?? "").trim();
  if (!raw) return "";
  if (raw.startsWith("data:")) return raw;

  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    try {
      const u = new URL(raw);
      const h = u.hostname;
      if ((h === "127.0.0.1" || h === "localhost") && u.pathname.startsWith("/uploads")) {
        return u.pathname + u.search;
      }
    } catch {
      return raw;
    }
    return raw;
  }

  return raw.startsWith("/") ? raw : `/${raw.replace(/^\/+/, "")}`;
}
