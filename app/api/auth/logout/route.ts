import { NextResponse } from 'next/server';
import { requireUser, supabaseServiceFetch } from '@/app/lib/server/supabase';
export async function POST() {
  const auth = await requireUser();
  if (auth) await supabaseServiceFetch(`/rest/v1/profiles?id=eq.${auth.user.id}`, { method: 'PATCH', body: JSON.stringify({ is_online: false }) });
  const out = NextResponse.json({ ok: true });
  out.cookies.delete('warhex_access_token'); out.cookies.delete('warhex_refresh_token');
  return out;
}
