import { NextResponse } from 'next/server';
import { requireUser, supabaseServiceFetch } from '@/app/lib/server/supabase';

async function member(roomId: string, userId: string) {
  const r = await supabaseServiceFetch(`/rest/v1/live_rooms?id=eq.${encodeURIComponent(roomId)}&select=id,host_id,status`);
  if (!r.ok) return null;
  const rows = await r.json();
  const room = rows[0];
  if (!room || room.status !== 'live') return null;
  return room.host_id === userId ? room : room;
}

export async function GET(request: Request) {
  const auth = await requireUser();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const url = new URL(request.url); const roomId = url.searchParams.get('roomId'); const since = url.searchParams.get('since') || '1970-01-01T00:00:00.000Z';
  if (!roomId || !(await member(roomId, auth.user.id))) return NextResponse.json({ error: 'Room unavailable.' }, { status: 404 });
  const q = `/rest/v1/live_signals?room_id=eq.${encodeURIComponent(roomId)}&created_at=gt.${encodeURIComponent(since)}&or=(recipient_id.is.null,recipient_id.eq.${encodeURIComponent(auth.user.id)})&select=*&order=created_at.asc&limit=200`;
  const r = await supabaseServiceFetch(q); if (!r.ok) return NextResponse.json({ signals: [] });
  return NextResponse.json({ signals: await r.json() });
}

export async function POST(request: Request) {
  const auth = await requireUser();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const roomId = typeof body.roomId === 'string' ? body.roomId : '';
  const type = typeof body.type === 'string' ? body.type : '';
  const payload = body.payload ?? null;
  const recipientId = typeof body.recipientId === 'string' ? body.recipientId : null;
  if (!roomId || !['join','offer','answer','candidate','leave'].includes(type)) return NextResponse.json({ error: 'Invalid signaling message.' }, { status: 400 });
  if (!(await member(roomId, auth.user.id))) return NextResponse.json({ error: 'Room unavailable.' }, { status: 404 });
  const r = await supabaseServiceFetch('/rest/v1/live_signals', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ room_id: roomId, sender_id: auth.user.id, recipient_id: recipientId, type, payload }) });
  if (!r.ok) return NextResponse.json({ error: 'Unable to signal.' }, { status: 500 });
  return NextResponse.json({ ok: true });
}
