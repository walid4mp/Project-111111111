import { NextResponse } from 'next/server';
import { supabaseFetch, supabaseServiceFetch } from '@/app/lib/server/supabase';

const PERMISSIONS = ['dashboard','users','campaigns','payments','packages','rewards_ads','notifications','ad_analytics','vip_pro','reports','admin_logs','settings','admin_manage','user_points','user_moderation','password_reset','payment_review','live_control','game_control','catalog_manage'];

function setSession(out: NextResponse, data: { access_token: string; refresh_token: string }) {
  out.cookies.set('warhex_access_token', data.access_token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 });
  out.cookies.set('warhex_refresh_token', data.refresh_token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 30 });
}

async function bootstrapMaster(email: string, password: string) {
  const masterEmail = String(process.env.MASTER_ADMIN_EMAIL || '').trim().toLowerCase();
  const masterPassword = String(process.env.MASTER_ADMIN_PASSWORD || '');
  if (!masterEmail || masterPassword.length < 8 || email !== masterEmail || password !== masterPassword) return null;

  let user: { id: string; email?: string } | null = null;
  const list = await supabaseServiceFetch('/auth/v1/admin/users?per_page=1000');
  if (list.ok) {
    const data = await list.json().catch(() => ({}));
    user = data.users?.find((u: { email?: string }) => u.email?.toLowerCase() === email) || null;
  }
  if (!user) {
    const created = await supabaseServiceFetch('/auth/v1/admin/users', { method: 'POST', body: JSON.stringify({ email, password, email_confirm: true, user_metadata: { username: 'warhex_admin' } }) });
    const data = await created.json().catch(() => ({}));
    if (!created.ok) throw new Error(data.msg || data.message || 'تعذر إنشاء حساب المدير في Supabase.');
    user = data.user || data;
  } else {
    const updated = await supabaseServiceFetch(`/auth/v1/admin/users/${encodeURIComponent(user.id)}`, { method: 'PUT', body: JSON.stringify({ password, email_confirm: true }) });
    if (!updated.ok) throw new Error('تعذر تحديث كلمة مرور المدير في Supabase.');
  }

  if (!user) throw new Error('تعذر إنشاء أو العثور على حساب المدير في Supabase.');
  const userId = user.id;

  const admin = await supabaseServiceFetch('/rest/v1/admin_accounts?on_conflict=user_id', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify({ user_id: userId, email, role: 'SUPER_ADMIN', scope: 'both', permissions: PERMISSIONS, active: true })
  });
  if (!admin.ok) throw new Error(`تعذر تجهيز صلاحيات المدير: ${await admin.text()}`);
  return true;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    if (!email || !password) return NextResponse.json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان.' }, { status: 400 });

    const masterConfigured = Boolean(process.env.MASTER_ADMIN_EMAIL && String(process.env.MASTER_ADMIN_PASSWORD || '').length >= 8);
    const isMaster = masterConfigured && email === String(process.env.MASTER_ADMIN_EMAIL).trim().toLowerCase() && password === String(process.env.MASTER_ADMIN_PASSWORD);
    if (isMaster) await bootstrapMaster(email, password);

    const session = await supabaseFetch('/auth/v1/token?grant_type=password', { method: 'POST', body: JSON.stringify({ email, password }) });
    const data = await session.json().catch(() => ({}));
    if (!session.ok) return NextResponse.json({ error: data.error_description || data.msg || 'Invalid email or password.' }, { status: 401 });
    if (!data.access_token || !data.refresh_token || !data.user?.id) return NextResponse.json({ error: 'تعذر إنشاء جلسة المدير.' }, { status: 502 });

    const admin = await supabaseServiceFetch(`/rest/v1/admin_accounts?user_id=eq.${encodeURIComponent(data.user.id)}&select=role,active,scope&limit=1`);
    const rows = admin.ok ? await admin.json() : [];
    const row = rows[0];
    if (!row || row.active === false || !['ADMIN','SUPER_ADMIN'].includes(row.role)) {
      return NextResponse.json({ error: 'هذا الحساب ليس لديه صلاحيات مدير.' }, { status: 403 });
    }

    const adminClient = request.headers.get('x-warhex-client') === 'admin';
    const out = NextResponse.json(adminClient ? { ok: true, role: row.role, scope: row.scope || 'both', access_token: data.access_token, refresh_token: data.refresh_token } : { ok: true, role: row.role, scope: row.scope || 'both' });
    setSession(out, { access_token: data.access_token, refresh_token: data.refresh_token });
    return out;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Server error' }, { status: 500 });
  }
}
