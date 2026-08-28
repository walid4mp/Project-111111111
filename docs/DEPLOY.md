# Deployment

## Backend Render service
Root Directory: `backend`
Build Command: `npm install --no-audit --no-fund && npm run build`
Start Command: `npm run start`
Node: `24.14.1`
Health: `/api/health`

Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `MASTER_ADMIN_EMAIL`, `MASTER_ADMIN_PASSWORD`, `CORS_ORIGINS`.

## Admin Render service
Root Directory: `admin-panel`
Build Command: `npm install --no-audit --no-fund && npm run build`
Start Command: `npm run start`
Node: `24.14.1`
`NEXT_PUBLIC_API_URL=https://YOUR-BACKEND.onrender.com`

## Flutter
GitHub Actions creates the Android host project and builds a release APK. Set repository variable `WARHEX_API_URL` to the backend URL.

## Test accounts

The repository includes a manual, idempotent test-account seed. It is **not** run during deploy.
Run it from `backend` after Supabase is configured:

`NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run seed:test`

Accounts created:
- Users: `testuser1@warhex.test` … `testuser5@warhex.test` / `WarHex@12345`
- Admins: `admin1@warhex.test` … `admin5@warhex.test` / `WarHexAdmin@12345`
- `admin1` is `SUPER_ADMIN`; `admin2`–`admin5` are `ADMIN`.
- Admin scope is `both`, so the admin accounts can authenticate in the web admin panel and in the Flutter app.

These are test credentials only. Change/remove them before a public production launch.
