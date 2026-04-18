import { getApiBaseUrl } from "./runtimeConfig";

const API_PREFIX = "/api";

function makeApiUrl(path: string, useFallbackRoot = false): string {
  if (path.startsWith("http")) return path;
  const API_BASE_URL = getApiBaseUrl();
  if (API_BASE_URL) {
    return `${API_BASE_URL}${path}`;
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
  const canFallback = !path.startsWith("http") && !getApiBaseUrl() && API_PREFIX === "/api";
  if (!canFallback) return firstResponse;

  return fetch(makeApiUrl(path, true), requestInit);
}
