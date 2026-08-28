/**
 * Creates deterministic WarHex test accounts in Supabase.
 * Run manually only: npm run seed:test
 * Required: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 */
const url = String(process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
const key = String(process.env.SUPABASE_SERVICE_ROLE_KEY || '');
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const permissions = [
  'dashboard','users','campaigns','payments','packages','rewards_ads','notifications',
  'ad_analytics','vip_pro','reports','admin_logs','settings','admin_manage','user_points',
  'user_moderation','password_reset','payment_review','live_control','game_control','catalog_manage'
];

const normalUsers = Array.from({ length: 5 }, (_, i) => ({
  email: `testuser${i + 1}@warhex.test`,
  username: `testuser${i + 1}`,
  password: 'WarHex@12345',
}));
const admins = Array.from({ length: 5 }, (_, i) => ({
  email: `admin${i + 1}@warhex.test`,
  username: `admin${i + 1}`,
  password: 'WarHexAdmin@12345',
  role: i === 0 ? 'SUPER_ADMIN' : 'ADMIN',
  scope: 'both',
}));

async function request(path, options = {}) {
  const response = await fetch(`${url}${path}`, {
    ...options,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${path} -> ${response.status}: ${data.msg || data.message || data.error || text}`);
  return data;
}

async function allAuthUsers() {
  const data = await request('/auth/v1/admin/users?per_page=1000');
  return data.users || [];
}

async function ensureAuthUser(account, users) {
  let user = users.find(u => String(u.email || '').toLowerCase() === account.email.toLowerCase());
  if (!user) {
    const created = await request('/auth/v1/admin/users', {
      method: 'POST',
      body: JSON.stringify({
        email: account.email,
        password: account.password,
        email_confirm: true,
        user_metadata: { username: account.username },
      }),
    });
    user = created.user || created;
  } else {
    await request(`/auth/v1/admin/users/${encodeURIComponent(user.id)}`, {
      method: 'PUT',
      body: JSON.stringify({
        password: account.password,
        email_confirm: true,
        user_metadata: { ...(user.user_metadata || {}), username: account.username },
      }),
    });
  }
  if (!user?.id) throw new Error(`Could not resolve user id for ${account.email}`);
  await request(`/rest/v1/profiles?on_conflict=id`, {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ id: user.id, username: account.username }),
  });
  return user.id;
}

async function ensureAdmin(account, userId) {
  await request('/rest/v1/admin_accounts?on_conflict=user_id', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({
      user_id: userId,
      email: account.email,
      role: account.role,
      scope: account.scope,
      permissions,
      active: true,
    }),
  });
}

const users = await allAuthUsers();
for (const account of normalUsers) {
  const id = await ensureAuthUser(account, users);
  console.log(`USER  ${account.email}  id=${id}`);
}
for (const account of admins) {
  const id = await ensureAuthUser(account, users);
  await ensureAdmin(account, id);
  console.log(`ADMIN ${account.email}  role=${account.role} scope=${account.scope} id=${id}`);
}
console.log('\nDone. Test passwords: users=WarHex@12345, admins=WarHexAdmin@12345');
