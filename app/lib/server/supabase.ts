import { cookies } from 'next/headers';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function requireSupabaseEnv() {
  if (!url || !anonKey) throw new Error('Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.');
  return { url, anonKey };
}
export function getServiceConfig() {
  if (!url || !serviceKey) throw new Error('Supabase service role is not configured.');
  return { url, serviceKey };
}
export async function getAccessToken() { return (await cookies()).get('warhex_access_token')?.value ?? null; }
export async function supabaseFetch(path: string, init: RequestInit = {}, accessToken?: string) {
  const { url: base, anonKey: key } = requireSupabaseEnv();
  const headers = new Headers(init.headers); headers.set('apikey', key); headers.set('Content-Type', 'application/json');
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
  return fetch(`${base}${path}`, { ...init, headers, cache: 'no-store' });
}
export async function supabaseServiceFetch(path: string, init: RequestInit = {}) {
  const { url: base, serviceKey: key } = getServiceConfig();
  const headers = new Headers(init.headers); headers.set('apikey', key); headers.set('Authorization', `Bearer ${key}`); headers.set('Content-Type', 'application/json');
  return fetch(`${base}${path}`, { ...init, headers, cache: 'no-store' });
}
export async function requireUser() {
  const store = await cookies();
  const initialToken = store.get('warhex_access_token')?.value;
  if (typeof initialToken !== 'string' || initialToken.length === 0) return null;
  let token: string = initialToken;
  let response = await supabaseFetch('/auth/v1/user', { method: 'GET' }, token);
  if (response.ok) return { token, user: await response.json() };
  const refresh = store.get('warhex_refresh_token')?.value;
  if (!refresh) return null;
  const refreshed = await supabaseFetch('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: JSON.stringify({ refresh_token: refresh }) });
  if (!refreshed.ok) return null;
  const data = await refreshed.json();
  const refreshedAccessToken: string | undefined =
    typeof data.access_token === 'string' && data.access_token.length > 0
      ? data.access_token
      : undefined;
  if (!refreshedAccessToken) return null;
  token = refreshedAccessToken;
  store.set('warhex_access_token', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 });
  if (data.refresh_token) store.set('warhex_refresh_token', data.refresh_token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 30 });
  response = await supabaseFetch('/auth/v1/user', { method: 'GET' }, token);
  if (!response.ok) return null;
  return { token, user: await response.json() };
}
