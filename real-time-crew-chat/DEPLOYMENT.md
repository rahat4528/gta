# Deployment Guide — Real-Time Crew Chat

## Recommended Hosting Platform
**Persistent Container / Node Host (Render Web Service, Railway, Fly.io, or Linux VPS)**

> ⚠️ **CRITICAL ARCHITECTURAL REQUIREMENT: CANNOT RUN ON SERVERLESS (e.g. Pure Vercel Serverless Functions)**
> Real-Time Crew Chat uses a custom HTTP + Socket.IO server (`server.ts`) listening on a persistent port (`PORT=3003`). Long-lived WebSocket connections, stateful in-memory room broadcasts, offline queues, and real-time presence heartbeats require a persistent, non-ephemeral Node.js process. Serverless functions terminate after each request and will sever WebSocket connections.

---

## Infrastructure Requirements

1. **Persistent Node Runtime**: Node.js 18+ or 20+
2. **PostgreSQL Database**: PostgreSQL 14+ (hosted via Supabase, Neon, AWS RDS, Railway, or local Docker)
3. **Optional Redis**: Redis 6+ (for horizontal scaling across multiple Socket.IO server nodes using `@socket.io/redis-adapter`)

---

## Build & Start Commands

| Command | Purpose |
| :--- | :--- |
| `pnpm install` | Install all dependencies |
| `pnpm db:generate` | Generate Prisma ORM Client |
| `pnpm prisma db push` | Push database schema to PostgreSQL |
| `pnpm build` | Build Next.js 15 production bundle |
| `pnpm start` | Run production server (`cross-env NODE_ENV=production PORT=3003 tsx server.ts`) |

---

## Required Environment Variables

```env
# Server Port
PORT=3003

# PostgreSQL Connection String
DATABASE_URL="postgresql://postgres:password@postgres-host:5432/crewchat?schema=public"

# Secret Key for JWT token signing (use 64-char random hex string)
JWT_SECRET="generate-a-secure-random-64-character-jwt-secret-in-production"

# Canonical URL for CORS and origin validation
NEXT_PUBLIC_APP_URL="https://crewchat.yourdomain.com"
```

---

## Production Caveats & Best Practices

1. **Reverse Proxy & WebSockets (Nginx / Cloudflare)**:
   - When deploying behind Nginx or Cloudflare, ensure HTTP upgrade headers are configured:
     ```nginx
     proxy_set_header Upgrade $http_upgrade;
     proxy_set_header Connection "upgrade";
     proxy_http_version 1.1;
     ```
2. **CORS Allowlist**:
   - In production, set `NEXT_PUBLIC_APP_URL` to your production domain so Socket.IO and Next.js restrict cross-origin access.
3. **Database Migration Pipeline**:
   - Always run `prisma migrate deploy` or `prisma db push` during deployment before starting the `server.ts` process.
