import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseFetch } from '@/app/lib/server/supabase';

export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get('code');
  const verifier = (await cookies()).get('warhex_pkce_verifier')?.value;
  if (!code || !verifier) return NextResponse.redirect(new URL('/auth/login?error=oauth', request.url));
  const response = await supabaseFetch('/auth/v1/token?grant_type=pkce', { method: 'POST', body: JSON.stringify({ auth_code: code, code_verifier: verifier }) });
  const data = await response.json();
  if (!response.ok || typeof data.access_token !== 'string' || data.access_token.length === 0) return NextResponse.redirect(new URL('/auth/login?error=oauth', request.url));
  const out = NextResponse.redirect(new URL('/', request.url));
  out.cookies.delete('warhex_pkce_verifier');
  out.cookies.set('warhex_access_token', data.access_token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 });
  if (typeof data.refresh_token === 'string' && data.refresh_token.length > 0) out.cookies.set('warhex_refresh_token', data.refresh_token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 30 });
  return out;
}
