# WarHex release notes

- Fixed the Next.js tournament route so it no longer uses the client `useParams` implementation that triggered the route-segment analyzer failure in CI.
- Replaced fake login/signup timers with calls to the existing WarHex authentication API.
- Added persistent browser session tokens.
- Added PWA manifest and launcher icons.
- Added Capacitor configuration and Android CI workflow.
- Android CI targets API 36 for Google Play submissions in 2026.
- The current Project-2 game screens remain the visual/game-hub layer; simulated players and rooms are clearly demo entities. A true server-authoritative realtime chess/ludo/domino service still requires dedicated room/game endpoints and WebSocket state handling.
