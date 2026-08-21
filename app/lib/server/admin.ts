import { requireUser } from '@/app/lib/server/supabase';

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
  return isAdmin(auth.user) ? auth : null;
}
