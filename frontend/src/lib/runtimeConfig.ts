declare global {
  interface Window {
    __GTT_CONFIG__?: {
      /** URL de base de l’API Express, avec le suffixe `/api` (ex. https://domaine.com/api) */
      apiBaseUrl?: string;
    };
  }
}

/**
 * Base URL de l’API : `env-config.js` (runtime, sans rebuild) puis `VITE_API_BASE_URL` (build).
 * Exemple env-config : `window.__GTT_CONFIG__ = { apiBaseUrl: "https://votredomaine.com/api" };`
 */
export function getApiBaseUrl(): string | undefined {
  if (typeof window !== "undefined") {
    const fromWindow = window.__GTT_CONFIG__?.apiBaseUrl?.trim();
    if (fromWindow) {
      return fromWindow.endsWith("/") ? fromWindow.slice(0, -1) : fromWindow;
    }
  }
  const fromEnv = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();
  if (fromEnv) {
    return fromEnv.endsWith("/") ? fromEnv.slice(0, -1) : fromEnv;
  }
  return undefined;
}
