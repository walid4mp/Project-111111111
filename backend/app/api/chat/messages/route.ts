import { NextResponse } from 'next/server';
import { requireUser, supabaseServiceFetch } from '@/app/lib/server/supabase';

export async function GET(request: Request) {
  const auth = await requireUser();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const roomId = new URL(request.url).searchParams.get('roomId');
  if (!roomId) return NextResponse.json({ error: 'roomId is required.' }, { status: 400 });
  const r = await supabaseServiceFetch(`/rest/v1/messages?room_id=eq.${encodeURIComponent(roomId)}&select=*,sender:profiles!messages_sender_id_fkey(id,username,avatar)&order=created_at.asc&limit=200`);
  if (!r.ok) return NextResponse.json({ error: 'Unable to load messages.' }, { status: 500 });
  return NextResponse.json({ messages: await r.json() });
}

export async function POST(request: Request) {
  const auth = await requireUser();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { roomId, content } = await request.json();
  const text = String(content || '').trim();
  if (!roomId || !text || text.length > 4000) return NextResponse.json({ error: 'Invalid message.' }, { status: 400 });
  const check = await supabaseServiceFetch(`/rest/v1/chat_rooms?id=eq.${encodeURIComponent(roomId)}&or=(user_a.eq.${auth.user.id},user_b.eq.${auth.user.id})&select=id&limit=1`);
  const rooms = await check.json();
  if (!check.ok || !rooms.length) return NextResponse.json({ error: 'Chat not found.' }, { status: 404 });
  const r = await supabaseServiceFetch('/rest/v1/messages', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ room_id: roomId, sender_id: auth.user.id, content: text, type: 'text' }) });
  if (!r.ok) return NextResponse.json({ error: 'Unable to send message.' }, { status: 500 });
  return NextResponse.json({ message: (await r.json())[0] });
}
