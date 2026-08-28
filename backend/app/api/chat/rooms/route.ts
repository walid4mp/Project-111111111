import { NextResponse } from 'next/server';
import { requireUser, supabaseServiceFetch } from '@/app/lib/server/supabase';

export async function GET() {
  const auth = await requireUser();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const r = await supabaseServiceFetch(`/rest/v1/chat_rooms?or=(user_a.eq.${auth.user.id},user_b.eq.${auth.user.id})&select=*`);
  if (!r.ok) return NextResponse.json({ error: 'Unable to load chats.' }, { status: 500 });
  const rooms = await r.json();
  return NextResponse.json({ rooms });
}
