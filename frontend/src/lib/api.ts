const API_PREFIX = "/api";

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const url = path.startsWith("http") ? path : `${API_PREFIX}${path}`;
  const headers = new Headers(init?.headers);
  const body = init?.body;
  const isFormData =
    typeof FormData !== "undefined" && body != null && body instanceof FormData;
  // Important: do NOT set Content-Type for FormData. The browser must add the multipart boundary.
  if (body != null && !headers.has("Content-Type") && !isFormData) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(url, {
    ...init,
    credentials: "include",
    headers,
  });
}
