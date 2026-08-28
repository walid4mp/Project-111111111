import { NextResponse } from 'next/server';
import { requireUser, supabaseServiceFetch } from '@/app/lib/server/supabase';
export async function GET() {
  const auth = await requireUser();
  if (!auth) return NextResponse.json({ user: null }, { status: 401 });
  await supabaseServiceFetch(`/rest/v1/profiles?id=eq.${auth.user.id}`, { method: 'PATCH', body: JSON.stringify({ is_online: true }) });
  const response = await supabaseServiceFetch(`/rest/v1/profiles?id=eq.${encodeURIComponent(auth.user.id)}&select=*`);
  const profiles = response.ok ? await response.json() : [];
  return NextResponse.json({ user: auth.user, profile: profiles[0] ?? null });
}
