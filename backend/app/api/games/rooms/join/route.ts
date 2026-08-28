import { NextResponse } from 'next/server';
import { requireUser, supabaseServiceFetch } from '@/app/lib/server/supabase';
export async function POST(request: Request) {
  const auth = await requireUser();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { roomId } = await request.json();
  const get = await supabaseServiceFetch(`/rest/v1/game_rooms?id=eq.${encodeURIComponent(roomId)}&select=*&limit=1`);
  const rows = await get.json();
  if (!get.ok || !rows.length) return NextResponse.json({ error: 'Room not found.' }, { status: 404 });
  const room = rows[0];
  if (room.host_id === auth.user.id) return NextResponse.json({ room });
  if (room.guest_id && room.guest_id !== auth.user.id) return NextResponse.json({ error: 'Room is full.' }, { status: 409 });
  const r = await supabaseServiceFetch(`/rest/v1/game_rooms?id=eq.${encodeURIComponent(roomId)}`, { method: 'PATCH', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ guest_id: auth.user.id, status: 'playing' }) });
  if (!r.ok) return NextResponse.json({ error: 'Unable to join room.' }, { status: 500 });
  return NextResponse.json({ room: (await r.json())[0] });
}
