# WarHex Multiplayer status

This build contains playable Chess, Ludo and Domino game screens, a live-room lobby, bot opponents and a room API at `/api/rooms`.

## Important production note
The room API in this web package is an in-process demo room registry. It is suitable for testing the UI and gameplay flow, but it is **not** a distributed authoritative multiplayer server. For Google Play production multiplayer, connect the room/game events to the existing WarHex Node/Prisma backend using WebSocket/Socket.IO and persist room state in PostgreSQL/Redis.

The real WarHex account remains the only real account; demo opponents are explicitly labeled bots/demo players and must not be presented as real people.
