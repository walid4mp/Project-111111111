/**
 * DELETES every WarHex seeded test/admin account (auth users + admin_accounts + profiles).
 * Requires --yes flag to run. Use only on test environments.
 */
const url = String(process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
const key = String(process.env.SUPABASE_SERVICE_ROLE_KEY || '');
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
if (!process.argv.includes('--yes')) {
  console.error('Refusing to run without --yes flag. This script removes test accounts.');
  process.exit(2);
}

const ADMINS = Array.from({ length: 5 }, (_, i) => `admin${i + 1}@warhex.test`);
const USERS = Array.from({ length: 5 }, (_, i) => `testuser${i + 1}@warhex.test`);
const ALL = [...ADMINS, ...USERS];

async function request(path, options = {}) {
  const r = await fetch(`${url}${path}`, {
    ...options,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const text = await r.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }
  if (!r.ok && r.status !== 404) throw new Error(`${options.method || 'GET'} ${path} -> ${r.status}: ${data.msg || data.message || data.error || text}`);
  return { ok: r.ok, status: r.status, data };
}

const authResp = await request('/auth/v1/admin/users?per_page=1000');
const authUsers = (authResp.data.users || []).filter(u => ALL.includes(String(u.email || '').toLowerCase()));

console.log(`Found ${authUsers.length} seeded accounts to remove.`);
for (const u of authUsers) {
  const id = u.id;
  await request(`/rest/v1/admin_accounts?user_id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' });
  await request(`/rest/v1/profiles?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' });
  const r = await request(`/auth/v1/admin/users/${encodeURIComponent(id)}`, { method: 'DELETE' });
  console.log(`REMOVED ${u.email}  http=${r.status}`);
}
console.log('Done. Re-run `npm run seed:test` to recreate them.');
