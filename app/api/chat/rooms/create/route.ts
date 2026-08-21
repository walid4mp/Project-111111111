import { NextResponse } from 'next/server';
import { requireUser, supabaseServiceFetch } from '@/app/lib/server/supabase';
export async function POST(request: Request) {
  const auth = await requireUser();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { username } = await request.json();
  const q = String(username || '').trim();
  if (!q) return NextResponse.json({ error: 'Username is required.' }, { status: 400 });
  const p = await supabaseServiceFetch(`/rest/v1/profiles?username=ilike.${encodeURIComponent(q)}&select=id,username&limit=1`);
  const users = await p.json();
  if (!p.ok || !users.length) return NextResponse.json({ error: 'Player not found.' }, { status: 404 });
  if (users[0].id === auth.user.id) return NextResponse.json({ error: 'You cannot chat with yourself.' }, { status: 400 });
  const a = [auth.user.id, users[0].id].sort();
  const existing = await supabaseServiceFetch(`/rest/v1/chat_rooms?user_a=eq.${a[0]}&user_b=eq.${a[1]}&select=*&limit=1`);
  const found = await existing.json();
  if (found.length) return NextResponse.json({ room: found[0] });
  const created = await supabaseServiceFetch('/rest/v1/chat_rooms', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ user_a: a[0], user_b: a[1] }) });
  if (!created.ok) return NextResponse.json({ error: 'Unable to create chat.' }, { status: 500 });
  return NextResponse.json({ room: (await created.json())[0] });
}
