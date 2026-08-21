import { NextResponse } from 'next/server';
import { requireUser, supabaseServiceFetch } from '@/app/lib/server/supabase';
export async function GET(request: Request) {
  const auth = await requireUser(); if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const roomId = new URL(request.url).searchParams.get('roomId'); if (!roomId) return NextResponse.json({ messages: [] });
  const r = await supabaseServiceFetch(`/rest/v1/live_messages?room_id=eq.${encodeURIComponent(roomId)}&select=*&order=created_at.asc&limit=100`);
  return NextResponse.json({ messages: r.ok ? await r.json() : [] });
}
export async function POST(request: Request) {
  const auth = await requireUser(); if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const b = await request.json().catch(() => ({})); const roomId = String(b.roomId || ''); const content = String(b.content || '').trim().slice(0, 500);
  if (!roomId || !content) return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
  const r = await supabaseServiceFetch('/rest/v1/live_messages', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ room_id: roomId, sender_id: auth.user.id, content }) });
  if (!r.ok) return NextResponse.json({ error: 'Unable to send message.' }, { status: 500 });
  return NextResponse.json({ message: (await r.json())[0] });
}
