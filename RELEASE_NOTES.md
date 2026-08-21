# WarHex release notes

This package is the cleaned production source for the WarHex mobile/web application.

## Fixed in this release
- Protected the main application: unauthenticated users are sent to `/auth/login` instead of seeing a guest/mock home screen.
- Supabase authentication remains the source of truth; local demo account storage is not used for login/signup.
- Store checkout now shows API/PayPal errors and sends the user to sign-in when the session is missing.
- Added a real USD/EUR selector for PayPal checkout.
- Removed the render-time `Math.random()` ad selection that broke the React lint rules.
- Removed the language-provider state update from inside an effect.
- Improved mobile/standalone behavior with safe-area handling and a real app manifest/icons.
- Capacitor remains configured for the deployed WarHex backend so server-side auth, Supabase, WebRTC and PayPal routes continue to work.

## Required production secrets
Set these on Render (and locally in `.env.local` when testing):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (or `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `PAYPAL_ENV=sandbox` for testing or `live` for production
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `PAYPAL_WEBHOOK_ID` when using the PayPal webhook
- `PAYPAL_EUR_RATE`

Never commit `.env.local` or any PayPal secret.
