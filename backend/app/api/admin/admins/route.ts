import { NextResponse } from 'next/server';
import { requireAdminPermission, requireSuperAdmin, ADMIN_PERMISSIONS } from '@/app/lib/server/admin-rbac';
import { supabaseServiceFetch } from '@/app/lib/server/supabase';

async function resolveUserId(email: string) {
  const r = await supabaseServiceFetch('/auth/v1/admin/users?per_page=1000');
  if (!r.ok) return null;
  const data = await r.json() as { users?: Array<{ id: string; email?: string }> };
  return data.users?.find(u => u.email?.toLowerCase() === email.toLowerCase())?.id ?? null;
}

export async function GET() {
  const a = await requireAdminPermission('admin_manage');
  if (!a) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const r = await supabaseServiceFetch('/rest/v1/admin_accounts?select=id,user_id,email,role,permissions,active,scope,created_at&order=created_at');
  return NextResponse.json({ admins: r.ok ? await r.json() : [] });
}

export async function POST(req: Request) {
  const a = await requireSuperAdmin();
  if (!a) return NextResponse.json({ error: 'Only SUPER_ADMIN can create administrators.' }, { status: 403 });
  const b = await req.json().catch(() => ({}));
  const email = String(b.email || '').trim().toLowerCase();
  const password = String(b.password || '');
  const role = b.role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'ADMIN';
  const scope = ['web','app','both'].includes(b.scope) ? b.scope : 'web';
  const permissions = Array.isArray(b.permissions) ? b.permissions.filter((p: unknown): p is string => typeof p === 'string' && (ADMIN_PERMISSIONS as readonly string[]).includes(p)) : [];
  if (!email || password.length < 8) return NextResponse.json({ error: 'Email and password (8+ chars) are required.' }, { status: 400 });

  let userId = await resolveUserId(email);
  if (!userId) {
    const r = await supabaseServiceFetch('/auth/v1/admin/users', {
      method: 'POST', body: JSON.stringify({ email, password, email_confirm: true, user_metadata: { username: email.split('@')[0] } })
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) return NextResponse.json({ error: data.msg || data.message || 'Unable to create Auth user.' }, { status: 400 });
    userId = data.user?.id || data.id || null;
  }
  if (!userId) return NextResponse.json({ error: 'Could not resolve user id.' }, { status: 500 });

  const r = await supabaseServiceFetch('/rest/v1/admin_accounts', {
    method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify({ user_id: userId, email, role, scope, permissions, active: true })
  });
  if (!r.ok) return NextResponse.json({ error: 'Unable to save administrator.' }, { status: 500 });
  await supabaseServiceFetch('/rest/v1/admin_logs', { method: 'POST', body: JSON.stringify({ admin_user_id: a.user.id, action: 'admin_create', target_type: 'admin', target_id: userId, details: { email, role, scope } }) }).catch(() => undefined);
  return NextResponse.json({ ok: true, admin: (await r.json().catch(() => []))[0] ?? null });
}

export async function PATCH(req: Request) {
  const a = await requireSuperAdmin();
  if (!a) return NextResponse.json({ error: 'Only SUPER_ADMIN can edit administrators.' }, { status: 403 });
  const b = await req.json().catch(() => ({}));
  if (!b.id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const patch: Record<string, unknown> = {};
  if (b.role === 'ADMIN' || b.role === 'SUPER_ADMIN') patch.role = b.role;
  if (['web','app','both'].includes(b.scope)) patch.scope = b.scope;
  if (Array.isArray(b.permissions)) patch.permissions = b.permissions.filter((p: unknown): p is string => typeof p === 'string' && (ADMIN_PERMISSIONS as readonly string[]).includes(p));
  if (typeof b.active === 'boolean') patch.active = b.active;
  const r = await supabaseServiceFetch(`/rest/v1/admin_accounts?id=eq.${encodeURIComponent(String(b.id))}`, { method: 'PATCH', headers: { Prefer: 'return=representation' }, body: JSON.stringify(patch) });
  if (!r.ok) return NextResponse.json({ error: 'Unable to update administrator.' }, { status: 500 });
  return NextResponse.json({ ok: true, admin: (await r.json().catch(() => []))[0] ?? null });
}

export async function DELETE(req: Request) {
  const a = await requireSuperAdmin();
  if (!a) return NextResponse.json({ error: 'Only SUPER_ADMIN can delete administrators.' }, { status: 403 });
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const rowResponse = await supabaseServiceFetch(`/rest/v1/admin_accounts?id=eq.${encodeURIComponent(id)}&select=user_id,role`);
  const row = rowResponse.ok ? (await rowResponse.json() as Array<{ user_id: string; role: string }>)[0] : null;
  if (!row) return NextResponse.json({ error: 'Administrator not found.' }, { status: 404 });
  if (row.role === 'SUPER_ADMIN' && row.user_id === a.user.id) return NextResponse.json({ error: 'You cannot delete your own SUPER_ADMIN account.' }, { status: 400 });
  const r = await supabaseServiceFetch(`/rest/v1/admin_accounts?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' });
  if (!r.ok) return NextResponse.json({ error: 'Unable to remove administrator.' }, { status: 500 });
  await supabaseServiceFetch(`/auth/v1/admin/users/${encodeURIComponent(row.user_id)}`, { method: 'DELETE' }).catch(() => undefined);
  return NextResponse.json({ ok: true });
}
