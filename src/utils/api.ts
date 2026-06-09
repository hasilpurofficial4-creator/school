// ============================================================
// API Fetch Utility
// Study Hub Lahore - JWT stored in module scope (NO localStorage)
// ============================================================

import type { ApiResponse } from "../types";

// Token stored in module-level variable (NOT localStorage)
let token: string | null = null;

export function setToken(newToken: string | null) {
  token = newToken;
}

export function getToken(): string | null {
  return token;
}

// ============================================================
// Fetch wrapper with JWT header
// ============================================================
export async function apiFetch<T = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data = await res.json();

    // Handle 401 - clear token and redirect
    if (res.status === 401) {
      token = null;
      window.location.href = "/login";
      return { success: false, error: "Session expired" };
    }

    // Handle 403 - banned or forbidden
    if (res.status === 403) {
      return {
        success: false,
        error: data.error || "Access denied",
      };
    }

    return data as ApiResponse<T>;
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Network error",
    };
  }
}
