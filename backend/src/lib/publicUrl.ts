import type { Request } from "express";

/**
 * Convert a relative path to a public absolute URL
 * Handles X-Forwarded-Proto and X-Forwarded-Host headers for reverse proxies
 */
export function toPublicUrl(req: Request | any, src: string): string {
  const url = String(src ?? "").trim();
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }

  // Try X-Forwarded headers first (reverse proxy/load balancer)
  const forwardedProto = String(req.headers?.["x-forwarded-proto"] ?? "").split(",")[0].trim();
  const forwardedHost = String(req.headers?.["x-forwarded-host"] ?? "").trim();

  // Fallback to direct values
  const protocol = forwardedProto || (req.secure ? "https" : "http") || "http";
  const host = forwardedHost || req.get?.("host") || req.headers?.["host"] || "127.0.0.1:8080";

  return `${protocol}://${host}${url}`;
}
