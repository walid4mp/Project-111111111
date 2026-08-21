# Android release

The repository includes a GitHub Actions workflow named **WarHex Android APK**.
It creates a debug APK artifact automatically on pushes to `main` and from `workflow_dispatch`.

After pushing:
1. Open GitHub → Actions → **WarHex Android APK**.
2. Open the successful run.
3. Download the artifact `warhex-online-debug-apk`.
4. Extract it and install `app-debug.apk` on Android.

The app uses the production URL `https://project-111111111.onrender.com` and requests camera/microphone permissions for WebRTC Live and Voice Rooms.

For Google Play, use Android Studio to configure a release signing key and build an AAB. Do not commit signing keys or passwords.
