import { NextResponse } from 'next/server';
import { createHash, randomBytes } from 'crypto';

function base64url(value: Buffer) { return value.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_'); }

export async function GET(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const site = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const provider = new URL(request.url).searchParams.get('provider');
  if (!supabaseUrl || !['google', 'apple'].includes(provider || '')) {
    const target = new URL('/auth/login', request.url);
    target.searchParams.set('error', !supabaseUrl ? 'supabase' : 'provider');
    return NextResponse.redirect(target);
  }
  const verifier = base64url(randomBytes(32));
  const challenge = base64url(createHash('sha256').update(verifier).digest());
  const authorize = new URL(`${supabaseUrl}/auth/v1/authorize`);
  authorize.searchParams.set('provider', provider!);
  authorize.searchParams.set('redirect_to', `${site}/api/auth/oauth/callback`);
  authorize.searchParams.set('code_challenge', challenge);
  authorize.searchParams.set('code_challenge_method', 's256');
  const out = NextResponse.redirect(authorize);
  out.cookies.set('warhex_pkce_verifier', verifier, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 600 });
  return out;
}
