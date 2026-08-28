import { NextResponse } from 'next/server';
import { requireUser, supabaseServiceFetch } from '@/app/lib/server/supabase';
export async function GET(request: Request) {
  if (!(await requireUser())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const ids = new URL(request.url).searchParams.get('ids')?.split(',').filter(Boolean).slice(0,50) || [];
  if (!ids.length) return NextResponse.json({ profiles: [] });
  const inList = `(${ids.join(',')})`;
  const r = await supabaseServiceFetch(`/rest/v1/profiles?id=in.${encodeURIComponent(inList)}&select=id,username,avatar,is_online,vip_level`);
  if (!r.ok) return NextResponse.json({ error: 'Unable to load profiles.' }, { status: 500 });
  return NextResponse.json({ profiles: await r.json() });
}
