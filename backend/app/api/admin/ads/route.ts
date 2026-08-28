import { NextResponse } from 'next/server';
import { requireAdminPermission } from '@/app/lib/server/admin-rbac';
import { supabaseServiceFetch } from '@/app/lib/server/supabase';

export async function GET() {
  const auth = await requireAdminPermission('rewards_ads');
  if (!auth) return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  const r = await supabaseServiceFetch('/rest/v1/ads?select=*&order=created_at.desc');
  return NextResponse.json({ ads: r.ok ? await r.json() : [] });
}

export async function POST(request: Request) {
  const auth = await requireAdminPermission('rewards_ads');
  if (!auth) return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  const b = await request.json().catch(() => ({}));
  const title = String(b.title || '').trim().slice(0, 120);
  const body = String(b.body || '').trim().slice(0, 500);
  const clickUrl = String(b.click_url || '').trim().slice(0, 500);
  const imageUrl = String(b.image_url || '').trim().slice(0, 500);
  const placement = ['global','home','games','live'].includes(b.placement) ? b.placement : 'global';
  if (!title || !body) return NextResponse.json({ error: 'Title and body are required.' }, { status: 400 });
  const r = await supabaseServiceFetch('/rest/v1/ads', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ title, body, click_url: clickUrl || null, image_url: imageUrl || null, placement, active: b.active !== false, priority: Number.isFinite(Number(b.priority)) ? Number(b.priority) : 0, created_by: auth.user.id })
  });
  if (!r.ok) return NextResponse.json({ error: 'Unable to create ad.' }, { status: 500 });
  return NextResponse.json({ ad: (await r.json())[0] });
}

export async function PATCH(request: Request) {
  const auth = await requireAdminPermission('rewards_ads');
  if (!auth) return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  const b = await request.json().catch(() => ({}));
  const id = String(b.id || '');
  if (!id) return NextResponse.json({ error: 'Ad id is required.' }, { status: 400 });
  const patch: Record<string, unknown> = {};
  for (const key of ['title','body','click_url','image_url','placement','priority','active']) if (key in b) patch[key] = b[key];
  const r = await supabaseServiceFetch(`/rest/v1/ads?id=eq.${encodeURIComponent(id)}`, { method: 'PATCH', headers: { Prefer: 'return=representation' }, body: JSON.stringify(patch) });
  if (!r.ok) return NextResponse.json({ error: 'Unable to update ad.' }, { status: 500 });
  return NextResponse.json({ ad: (await r.json())[0] });
}

export async function DELETE(request: Request) {
  const auth = await requireAdminPermission('rewards_ads');
  if (!auth) return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Ad id is required.' }, { status: 400 });
  const r = await supabaseServiceFetch(`/rest/v1/ads?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' });
  if (!r.ok) return NextResponse.json({ error: 'Unable to delete ad.' }, { status: 500 });
  return NextResponse.json({ ok: true });
}
