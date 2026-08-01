import { customFetch, setBaseUrl } from "@workspace/api-client-react";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

setBaseUrl(apiBaseUrl || null);

export function apiUrl(path: string): string {
  if (!apiBaseUrl || /^https?:\/\//i.test(path)) return path;
  return `${apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function apiFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  return fetch(apiUrl(path), {
    ...init,
    credentials: init?.credentials ?? "include",
  });
}

export { customFetch };