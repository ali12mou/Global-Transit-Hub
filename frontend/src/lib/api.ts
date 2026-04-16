const API_PREFIX = "/api";
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();

function makeApiUrl(path: string, useFallbackRoot = false): string {
  if (path.startsWith("http")) return path;
  if (API_BASE_URL) {
    const base = API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    return `${base}${path}`;
  }
  if (useFallbackRoot) return path;
  return `${API_PREFIX}${path}`;
}

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers);
  const body = init?.body;
  const isFormData =
    typeof FormData !== "undefined" && body != null && body instanceof FormData;
  // Important: do NOT set Content-Type for FormData. The browser must add the multipart boundary.
  if (body != null && !headers.has("Content-Type") && !isFormData) {
    headers.set("Content-Type", "application/json");
  }
  const requestInit: RequestInit = {
    ...init,
    credentials: "include",
    headers,
  };

  const firstResponse = await fetch(makeApiUrl(path), requestInit);
  if (firstResponse.status !== 404) return firstResponse;

  // Compatibility fallback: some environments expose API routes without "/api" prefix.
  const canFallback = !path.startsWith("http") && !API_BASE_URL && API_PREFIX === "/api";
  if (!canFallback) return firstResponse;

  return fetch(makeApiUrl(path, true), requestInit);
}
