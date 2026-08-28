import { headers } from 'next/headers';
import { requireAdmin } from '@/app/lib/server/admin';
import { supabaseServiceFetch } from '@/app/lib/server/supabase';

export const ADMIN_PERMISSIONS = [
  'dashboard','users','campaigns','payments','packages','rewards_ads','notifications',
  'ad_analytics','vip_pro','reports','admin_logs','settings','admin_manage','user_points',
  'user_moderation','password_reset','payment_review','live_control','game_control','catalog_manage'
] as const;
export type AdminPermission = typeof ADMIN_PERMISSIONS[number];

type AdminRow = { role?: string; permissions?: unknown; active?: boolean; scope?: string };

function permissionList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === 'string');
}

export async function getAdminAccount(userId: string) {
  const r = await supabaseServiceFetch(`/rest/v1/admin_accounts?user_id=eq.${encodeURIComponent(userId)}&select=id,user_id,email,role,permissions,active,scope&limit=1`);
  if (!r.ok) return null;
  const rows = await r.json() as AdminRow[];
  return rows[0] ?? null;
}

/** Permission checks are deliberately based on the request surface:
 * browser /admin uses web scope; the native app sends X-WarHex-Mobile: 1 and uses app scope.
 */
export async function requireAdminPermission(permission: AdminPermission) {
  const auth = await requireAdmin();
  if (!auth) return null;
  const row = await getAdminAccount(auth.user.id);
  if (!row || row.active === false) return null;

  const requestHeaders = await headers();
  const mobile = requestHeaders.get('x-warhex-mobile') === '1';
  const allowedScope = mobile ? ['app', 'both'] : ['web', 'both'];
  if (row.scope && !allowedScope.includes(row.scope)) return null;

  const permissions = permissionList(row.permissions);
  if (row.role === 'SUPER_ADMIN' || permissions.includes(permission)) return auth;

  const email = String(auth.user.email || '').toLowerCase();
  if ((process.env.ADMIN_EMAILS || '').split(',').map(v => v.trim().toLowerCase()).includes(email)) return auth;
  return null;
}

export async function requireSuperAdmin() {
  const auth = await requireAdmin();
  if (!auth) return null;
  const row = await getAdminAccount(auth.user.id);
  if (!row || row.active === false || row.role !== 'SUPER_ADMIN') return null;
  return auth;
}
