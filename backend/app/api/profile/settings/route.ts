import { NextResponse } from 'next/server';
import { requireUser, supabaseServiceFetch } from '@/app/lib/server/supabase';
export async function PATCH(request: Request) {
  const auth = await requireUser();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const allowed = ['notifications','sound','haptics','publicProfile','showOnlineStatus','language'];
  const payload: Record<string, unknown> = {};
  for (const key of allowed) if (key in body) payload[key === 'publicProfile' ? 'public_profile' : key === 'showOnlineStatus' ? 'show_online_status' : key] = body[key];
  const r = await supabaseServiceFetch(`/rest/v1/profiles?id=eq.${auth.user.id}`, { method: 'PATCH', headers: { Prefer: 'return=representation' }, body: JSON.stringify(payload) });
  if (!r.ok) return NextResponse.json({ error: 'Unable to save settings.' }, { status: 500 });
  return NextResponse.json({ profile: (await r.json())[0] });
}
