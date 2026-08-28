import { requireUser, supabaseServiceFetch } from '@/app/lib/server/supabase';

function list(value?: string) {
  return (value ?? '').split(',').map(v => v.trim().toLowerCase()).filter(Boolean);
}

export function isAdmin(user: { id?: string; email?: string | null }) {
  const ids = list(process.env.ADMIN_USER_IDS);
  const emails = list(process.env.ADMIN_EMAILS);
  return (!!user.id && ids.includes(user.id.toLowerCase())) ||
    (!!user.email && emails.includes(user.email.toLowerCase()));
}

export async function requireAdmin() {
  const auth = await requireUser();
  if (!auth) return null;
  if (isAdmin(auth.user)) return auth;
  const r = await supabaseServiceFetch(`/rest/v1/admin_accounts?user_id=eq.${encodeURIComponent(auth.user.id)}&select=role,active&limit=1`);
  if (!r.ok) return null;
  const rows = await r.json() as Array<{role?: string; active?: boolean}>;
  const row = rows[0];
  if (!row || row.active === false) return null;
  return row.role === 'SUPER_ADMIN' || row.role === 'ADMIN' ? auth : null;
}
