# WarHex architecture

```text
flutter-app/  -> mobile UI + auth token -> backend/
admin-panel/  -> admin token -----------> backend/
backend/      -> Supabase + business logic
```

The player app and admin panel have separate URLs and deployments. The admin URL is never used as the mobile app URL.
