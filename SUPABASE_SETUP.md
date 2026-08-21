# WarHex — Supabase production setup

1. Create a Supabase project.
2. In Project Settings > API copy:
   - Project URL
   - Publishable key (`sb_publishable_...`)
3. Put them in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

4. Open Supabase SQL Editor and run the complete `supabase.sql` file.
5. Configure Authentication > URL Configuration for your production HTTPS URL.
6. Never put `SUPABASE_SERVICE_ROLE_KEY` or `PAYPAL_CLIENT_SECRET` in the Android app, GitHub source, or `NEXT_PUBLIC_*` variables.
7. Install dependencies and run:

```bash
npm install
npm run lint
npm run build
```

The app no longer contains `app/data/mockData.ts`. Player accounts, balances, social data and live data must come from Supabase. The SQL seeds only the public WarHex catalog (games, gifts, store products, missions and achievements), not demo users or fake balances.
