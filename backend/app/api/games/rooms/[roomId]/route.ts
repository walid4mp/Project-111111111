import { NextResponse } from 'next/server';
import { requireUser, supabaseServiceFetch } from '@/app/lib/server/supabase';
export async function GET(_: Request, { params }: { params: Promise<{ roomId: string }> }) {
  const auth = await requireUser();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { roomId } = await params;
  const r = await supabaseServiceFetch(`/rest/v1/game_rooms?id=eq.${encodeURIComponent(roomId)}&or=(host_id.eq.${auth.user.id},guest_id.eq.${auth.user.id})&select=*&limit=1`);
  const rows = await r.json();
  if (!r.ok || !rows.length) return NextResponse.json({ error: 'Room not found.' }, { status: 404 });
  return NextResponse.json({ room: rows[0] });
}
