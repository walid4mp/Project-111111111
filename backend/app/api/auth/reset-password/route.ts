import { NextResponse } from 'next/server';
import { supabaseFetch } from '@/app/lib/server/supabase';
export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const site = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    const r = await supabaseFetch('/auth/v1/recover', { method: 'POST', body: JSON.stringify({ email: String(email).trim().toLowerCase(), redirect_to: `${site}/auth/reset-password` }) });
    if (!r.ok) return NextResponse.json({ error: 'Unable to send reset email.' }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: 'Unable to send reset email.' }, { status: 500 }); }
}
