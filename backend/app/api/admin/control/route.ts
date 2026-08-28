import { NextResponse } from 'next/server';
import { requireAdminPermission } from '@/app/lib/server/admin-rbac';
import { supabaseServiceFetch } from '@/app/lib/server/supabase';

export async function POST(req: Request) {
  const auth = await requireAdminPermission('user_moderation');
  if (!auth) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const body = await req.json().catch(() => ({}));
  const action = String(body.action || '');
  const userId = String(body.userId || '');
  if (!userId || !['freeze','ban','unban','points'].includes(action)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const patch: Record<string, string | number> = {};
  if (action === 'freeze') patch.status = 'FROZEN';
  if (action === 'ban') patch.status = 'BANNED';
  if (action === 'unban') patch.status = 'ACTIVE';
  if (action === 'points') {
    const value = Number(body.value);
    if (!Number.isFinite(value)) return NextResponse.json({ error: 'Invalid points value' }, { status: 400 });
    patch[String(body.type) === 'gems' ? 'gems' : 'coins'] = value;
  }
  const r = await supabaseServiceFetch(`/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}`, {
    method: 'PATCH', headers: { Prefer: 'return=representation' }, body: JSON.stringify(patch)
  });
  if (!r.ok) return NextResponse.json({ error: 'Control action failed' }, { status: 500 });
  await supabaseServiceFetch('/rest/v1/admin_logs', {
    method: 'POST', body: JSON.stringify({ admin_user_id: auth.user.id, action: `user_${action}`, target_type: 'user', target_id: userId, details: body })
  }).catch(() => undefined);
  return NextResponse.json({ ok: true, user: (await r.json().catch(() => []))[0] ?? null });
}
