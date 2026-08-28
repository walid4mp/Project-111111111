/**
 * Lists every WarHex seeded test/admin account.
 * Prints existence + Supabase role + admin row presence.
 */
const url = String(process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
const key = String(process.env.SUPABASE_SERVICE_ROLE_KEY || '');
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
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
  if (!r.ok) throw new Error(`${options.method || 'GET'} ${path} -> ${r.status}: ${data.msg || data.message || data.error || text}`);
  return data;
}

const authResp = await request('/auth/v1/admin/users?per_page=1000');
const authUsers = (authResp.users || []).filter(u => ALL.includes(String(u.email || '').toLowerCase()));

const adminEmails = authUsers.filter(u => ADMINS.includes(String(u.email || '').toLowerCase())).map(u => u.email);
if (adminEmails.length) {
  const filter = `(${adminEmails.map(e => `email.eq.${encodeURIComponent(e)}`).join(',')})`;
  const adminRows = await request(`/rest/v1/admin_accounts?select=email,role,scope,active,permissions&${filter}`);
  const byEmail = {};
  for (const r of adminRows) byEmail[String(r.email || '').toLowerCase()] = r;
  console.log('=== ADMIN ACCOUNTS ===');
  for (const email of ADMINS) {
    const auth = authUsers.find(u => String(u.email || '').toLowerCase() === email);
    const row = byEmail[email];
    const status = auth ? 'auth OK' : 'MISSING';
    const admin = row ? `role=${row.role} scope=${row.scope} active=${row.active} perms=${(row.permissions || []).length}` : 'NO ADMIN ROW';
    console.log(`${email.padEnd(28)} | ${status.padEnd(8)} | ${admin}`);
  }
}

const userEmails = authUsers.filter(u => USERS.includes(String(u.email || '').toLowerCase())).map(u => u.email);
if (userEmails.length) {
  const filter = `(${userEmails.map(e => `username.eq.${e.replace(/@warhex\.test$/, '')}`).join(',')})`;
  const profileRows = await request(`/rest/v1/profiles?select=username,level,coins,is_online&${filter}`);
  const byUsername = {};
  for (const r of profileRows) byUsername[String(r.username || '').toLowerCase()] = r;
  console.log('\n=== USER ACCOUNTS ===');
  for (const email of USERS) {
    const username = email.replace(/@warhex\.test$/, '');
    const auth = authUsers.find(u => String(u.email || '').toLowerCase() === email);
    const row = byUsername[username];
    const status = auth ? 'auth OK' : 'MISSING';
    const profile = row ? `level=${row.level} coins=${row.coins} online=${row.is_online}` : 'NO PROFILE';
    console.log(`${email.padEnd(28)} | ${status.padEnd(8)} | ${profile}`);
  }
}

console.log('\nPasswords: users=WarHex@12345, admins=WarHexAdmin@12345');
