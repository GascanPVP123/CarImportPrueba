const API_BASE = "http://127.0.0.1:8080/api";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions {
  method: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
}

export async function apiRequest<T>(endpoint: string, options: RequestOptions): Promise<T> {
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: options.method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    throw new Error("Sesión expirada");
  }

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Error en la petición");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}