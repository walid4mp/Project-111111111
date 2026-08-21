# WarHex — Online Social Gaming Platform

WarHex is a Next.js social gaming UI upgraded with a real Supabase backend for authentication, profiles, online chat, persistent settings, and shared online game rooms.

## What is real

- Email/password account creation and login through Supabase Auth.
- Google/Apple OAuth entry points (providers must be enabled in Supabase).
- Secure HTTP-only session cookies with refresh-token renewal.
- Persistent player profiles and account settings.
- Online 1-to-1 chat stored in PostgreSQL and shared between devices.
- Online Tic Tac Toe and Connect Four rooms with shared game state.
- Supabase PostgreSQL schema and Row Level Security included in `supabase.sql`.
- Local practice modes remain available for the other games.

## 1. Create the backend

Create a project at Supabase and copy its Project URL, anon key, and service-role key.

Run **all** SQL in `supabase.sql` from the Supabase SQL Editor.

In Supabase Auth settings:

1. Enable Email provider.
2. Optionally enable Google and Apple providers.
3. Add your production URL to the allowed redirect/site URLs.

## 2. Configure WarHex

Copy `.env.example` to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Never expose `SUPABASE_SERVICE_ROLE_KEY` to browser code.** It is used only by Next.js server routes.

## 3. Run

```bash
npm install
npm run dev
```

Production:

```bash
npm run build
npm start
```

## Deploy to Vercel

Set the same four environment variables in Vercel, change `NEXT_PUBLIC_SITE_URL` to the deployed HTTPS URL, and add that URL to Supabase Auth redirect settings.

## Online game flow

1. Sign in on device A.
2. Open Tic Tac Toe or Connect Four.
3. Tap **Create Online Match**.
4. Send the room URL to another signed-in WarHex player.
5. Device B opens the URL and joins automatically.
6. Moves are saved to the shared Supabase database and both clients poll for updates.

## Important production notes

The included service-role API routes are intentionally server-only. For a large production deployment, move game move validation into Postgres functions/Edge Functions and add rate limiting, moderation, payment verification, anti-cheat, and abuse protection before enabling real-money features.


## Android / Capacitor

The project is prepared for Android packaging with Capacitor. Deploy the Next.js app to an HTTPS URL first, then set `CAPACITOR_SERVER_URL` to that URL and run:

```bash
npm install
npx cap add android
npx cap sync android
npx cap open android
```

Build a debug APK from Android Studio, or:

```bash
cd android
./gradlew assembleDebug
```

For Google Play, build a signed AAB (`bundleRelease`) and configure the production HTTPS URL in `capacitor.config.ts`.


## WarHex production setup

1. Create/configure a Supabase project and run **all of `supabase.sql`** in the SQL Editor.
2. On Render, set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.
3. Set `NEXT_PUBLIC_SITE_URL=https://project-111111111.onrender.com`.
4. Set `ADMIN_EMAILS` and/or `ADMIN_USER_IDS`. The `/vip` route is server-protected and is **admin-only**.
5. The advertising system uses the `ads` table. Admins can manage campaigns at `/admin/ads`; active campaigns appear in the app.
6. Arabic/RTL can be switched from the navigation. The choice is persisted locally.
7. All seven featured games can create server-backed online rooms. The existing WebRTC Live and Voice rooms require camera/microphone permission and a signed-in account.
