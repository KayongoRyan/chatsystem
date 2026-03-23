# Pulse (chatsystem) — architecture

## Logical view

```mermaid
flowchart TB
  subgraph browser [Browser]
    SPA[React SPA]
  end

  subgraph node [Node.js process]
    HTTP[HTTP Server]
    Express[Express]
    ViteDev[Vite middleware dev only]
    API["REST /api/*"]
    IO[Socket.IO]
    Static["Static dist/public prod only"]
  end

  subgraph data [Data]
    MySQL[(MySQL)]
    Drizzle[Drizzle ORM]
  end

  subgraph shared [Shared code]
    Schema["shared/schema.ts Drizzle + Zod"]
  end

  SPA -->|HTTP + WebSocket| HTTP
  HTTP --> Express
  Express --> API
  Express --> ViteDev
  Express --> Static
  Express --> IO
  API --> Drizzle
  Drizzle --> MySQL
  Schema --> Drizzle
  Schema --> API
```

## Session and auth

Express uses **`express-session`** with an in-memory store (`memorystore`) so `req.session.userId` works for `/api/auth/*` and protected routes. Set a strong **`SESSION_SECRET`** in production.

## Modes

| Command | UI | API / DB / sessions |
|---------|-----|----------------------|
| `npm run dev` | Vite (middleware) | Same process |
| `npm run dev:client` | Vite only | Not started |
| `npm run build` + `npm start` | `dist/public` static | Express + bundled server |

## Build

`script/build.ts` runs Vite for the client, then esbuild for `server/index.ts` → `dist/index.cjs`.
