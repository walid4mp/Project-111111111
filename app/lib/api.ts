const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://project-111111111.onrender.com').replace(/\/$/, '');

export type ApiResponse<T> = { success?: boolean; data?: T; message?: string; error?: string; [key: string]: unknown };

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    cache: 'no-store',
  });
  const text = await response.text();
  let payload: ApiResponse<T> | null = null;
  try { payload = text ? JSON.parse(text) : null; } catch { payload = null; }
  if (!response.ok) {
    const message = payload?.message || payload?.error || `Request failed (${response.status})`;
    throw new Error(message);
  }
  return payload as T;
}

export async function signup(name: string, email: string, password: string) {
  return request<{ success: boolean; user: Record<string, unknown>; accessToken: string; refreshToken: string }>('/api/auth/signup', {
    method: 'POST', body: JSON.stringify({ name, email, password }),
  });
}

export async function login(email: string, password: string) {
  return request<{ success: boolean; user: Record<string, unknown>; accessToken: string; refreshToken: string }>('/api/auth/login', {
    method: 'POST', body: JSON.stringify({ email, password }),
  });
}

export async function me(accessToken: string) {
  return request<{ success: boolean; user: Record<string, unknown> }>('/api/auth/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
