import { NextResponse } from 'next/server';
import { requireUser, supabaseServiceFetch } from '@/app/lib/server/supabase';

export async function GET() {
  const r = await supabaseServiceFetch('/rest/v1/live_rooms?status=eq.live&select=*&order=created_at.desc&limit=50');
  if (!r.ok) return NextResponse.json({ rooms: [] });
  return NextResponse.json({ rooms: await r.json() });
}

export async function POST(request: Request) {
  const auth = await requireUser();
  if (!auth) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const title = typeof body.title === 'string' ? body.title.trim().slice(0, 120) : '';
  const category = typeof body.category === 'string' ? body.category.trim().slice(0, 40) : 'Gaming';
  if (!title) return NextResponse.json({ error: 'Title is required.' }, { status: 400 });
  const r = await supabaseServiceFetch('/rest/v1/live_rooms', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ host_id: auth.user.id, title, category, status: 'live', viewer_count: 0 }) });
  if (!r.ok) return NextResponse.json({ error: 'Unable to create live room.' }, { status: 500 });
  return NextResponse.json({ room: (await r.json())[0] });
}
