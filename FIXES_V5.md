# WarHex v5 fixes

- Flutter signup screen is present and calls `/api/auth/signup`.
- Flutter APK CI uses `https://project-111111111.onrender.com` as the API base URL.
- Admin panel Next.js `@/*` path alias is configured correctly.
- Admin panel defaults to `https://project-111111111.onrender.com` when `NEXT_PUBLIC_API_URL` is not set.
- Admin Render service should set `NEXT_PUBLIC_API_URL=https://project-111111111.onrender.com`.
- Node.js 24 is retained for the Next.js/Supabase packages.
