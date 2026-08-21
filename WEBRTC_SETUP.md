# WarHex Online — WebRTC production setup

The project now contains real WebRTC signaling for Live Rooms and Voice Rooms.

## 1. Supabase
Run the complete `supabase.sql` against the production Supabase database. The added tables are:
- `live_rooms`
- `live_signals`
- `live_messages`
- `voice_rooms`
- `voice_signals`

The server uses the Supabase service-role key only from server-side API routes. It is never exposed to the browser.

## 2. Render
Deploy the updated repository to Render with the existing Next.js build. Required environment variables remain:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

The production URL used by Capacitor is:
`https://project-111111111.onrender.com`

## 3. WebRTC
The app uses STUN servers and browser WebRTC APIs. STUN helps peers establish direct connections. For restrictive mobile/carrier networks, add a TURN server later for the best global reliability. Without TURN, some NAT/firewall combinations can fail to connect.

## 4. Android
The Capacitor configuration already points to the Render HTTPS app. After installing dependencies:

```bash
npm install
npx cap add android
npx cap sync android
npx cap open android
```

Build debug APK:

```bash
cd android
./gradlew assembleDebug
```

Build Play Store bundle:

```bash
./gradlew bundleRelease
```

For release, configure a signing key in Android Studio/Gradle and do not commit the keystore or passwords.

## 5. Automatic APK
GitHub Actions now includes `.github/workflows/android.yml`. Every push to `main` can build a debug APK and publish it as a downloadable workflow artifact.
