# WarHex Suite

Professional split package:
- `flutter-app/` — real Flutter client with a polished startup/loading screen and token-based API login.
- `backend/` — isolated Next.js API service containing the existing auth, games, chat, live, voice, payments and admin API routes.
- `admin-panel/` — separate admin UI that authenticates against the backend.
- `docs/` — deployment architecture.

Do not put Supabase service-role keys in Flutter or admin-panel.
