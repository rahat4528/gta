# Real-Time Crew Chat (`apps/real-time-crew-chat`)

A high-reliability, real-time team messaging platform built with **Next.js 15**, **TypeScript**, **Socket.IO**, **Prisma ORM**, **PostgreSQL**, **TanStack Query**, and **Tailwind CSS**.

Engineered for mission-critical team coordination where consistent message delivery, presence tracking, and network fault tolerance are required.

---

## 🚀 Key Architecture & Real-Time Engineering

A connected socket alone does not guarantee message delivery. Real-Time Crew Chat solves network flakiness, unexpected drops, and reconnection sync through a comprehensive multi-layered reliability architecture:

1. **Client-Generated Message IDs (`clientTempId`)**:
   - Every outgoing message is assigned a unique client temporary ID (`temp-${timestamp}-${random}`) before transmission.
   - UI immediately reflects the message in TanStack Query cache with `status: 'sending'`.
2. **Server Acknowledgements (ACKs)**:
   - Sockets emit messages with an acknowledgement callback.
   - Upon persistent DB storage, the server returns the canonical message payload with `status: 'ok'`, reconciling the optimistic state.
3. **Idempotent Storage & Deduplication**:
   - The server verifies `clientTempId` prior to inserting into the database or memory cache.
   - Re-sent packets are recognized and return the existing record without duplicate insertion.
4. **Offline Message Queue**:
   - If the network drops or the socket disconnects, messages are pushed to an in-memory offline queue.
   - When the socket reconnects (`onConnect`), the queue is automatically flushed sequentially with ACKs.
5. **Reconnect & Resync (`resync:messages`)**:
   - The client tracks the latest timestamp received per channel (`lastMessageTimestamps`).
   - On reconnect, the client issues a resync request with `lastTimestamp`.
   - The server queries and returns all missed messages during the disconnection window, seamlessly merged into the query cache.
6. **Presence & Heartbeat Synchronization**:
   - Socket connection events update user online status in real time across the crew room.
   - Live socket disconnection triggers immediate presence updates to fellow crew members.
7. **Typing Indicators with Auto-Expiration**:
   - Ephemeral typing broadcasts with debouncing.
   - Inactive typers are automatically pruned after 3 seconds on the server.

---

## 🔐 Authentication Choice

### Why JWT over NextAuth/Auth.js for Custom Next + Socket.IO?
- **Universal Token Verification**: NextAuth / Auth.js introduces complexity when bridging session validation across standard HTTP routes and a custom WebSocket/Socket.IO upgrade handshake.
- **Unified Middleware**: Signed JSON Web Tokens (stored in HTTP-only `crew_token` cookies or passed via `Authorization: Bearer` headers) allow identical, synchronous authentication logic in:
  1. Next.js API route handlers (`req.cookies.get('crew_token')`)
  2. Socket.IO connection middleware (`socket.handshake.auth.token || socket.handshake.headers.cookie`)
- **Zero External Overhead**: Eliminates external OAuth roundtrips for local development and self-contained team deployments, while offering BCrypt password hashing for credentials.

---

## 🗄️ Data Models (Prisma)

- `User`: Identity, credentials, display name, avatar URL, custom status message, presence flags, timestamps.
- `Crew`: Workspaces/teams with unique invite codes and ownership.
- `CrewMember`: Join table with role-based permissions (`OWNER`, `ADMIN`, `MEMBER`).
- `Channel`: Text, voice, or DM channels within a crew.
- `Message`: Rich message storage supporting `clientTempId`, edit history, soft deletes, and threading (`replyToId`).
- `MessageReaction`: Emoji reactions indexed uniquely by `[messageId, userId, emoji]`.
- `Attachment`: File attachments and mock telemetry uploads.
- `ReadReceipt`: Read tracking per user and channel.

---

## 📦 Setup & Prerequisites

### 1. Environment Configuration
Ensure `.env` exists in `apps/real-time-crew-chat/`:

```env
PORT=3003
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/crewchat?schema=public"
JWT_SECRET="crew-mission-control-jwt-secret-key-3003"
NEXT_PUBLIC_APP_URL="http://localhost:3003"
```

### 2. PostgreSQL (Docker Compose)
A production-ready `docker-compose.yml` is provided for local PostgreSQL:

```bash
# Start PostgreSQL & Redis
cd apps/real-time-crew-chat
docker-compose up -d

# Generate Prisma Client & Run Migrations
pnpm db:generate
pnpm prisma db push
```

*Note: The server includes an active in-memory resilience store pre-seeded with demo accounts and crews, allowing the app to run and build seamlessly even before Docker is started.*

---

## 🛠️ Running the Application

From the monorepo root:

```bash
# Start dev server on port 3003 (Next.js + Socket.IO custom server)
pnpm dev:chat

# Run TypeScript typechecking
pnpm --filter real-time-crew-chat typecheck

# Run ESLint
pnpm --filter real-time-crew-chat lint

# Production Build
pnpm build:chat

# Run Production Server
pnpm --filter real-time-crew-chat start
```

Open [http://localhost:3003](http://localhost:3003) in your browser.

---

## 👥 Instant Demo Accounts (1-Click Login)

For multi-user and multi-window real-time testing, the login screen provides 1-click authentication for three pre-configured operators:

1. **Alex Rivera** (`alex@crew.local` / `password123`) — Lead Systems Engineer (Apollo Engineering)
2. **Sarah Chen** (`sarah@crew.local` / `password123`) — Network & Security Architect (Apollo Engineering)
3. **Marcus Vance** (`marcus@crew.local` / `password123`) — Operations & Reliability Specialist (Cyber Operations)

Open two different browser windows (or one incognito window) to chat live between operators.

---

## 📋 Implemented vs Planned Features

### ✅ Implemented
- [x] Full custom Next.js 15 + Socket.IO server on unified port **3003**
- [x] JWT cookie and header authentication with registration, login, and sessions
- [x] 1-Click quick login demo users for instant multi-client testing
- [x] Complete Prisma schema with all 8 requested models (`User`, `Crew`, `CrewMember`, `Channel`, `Message`, `MessageReaction`, `Attachment`, `ReadReceipt`)
- [x] Resilient DB layer with Postgres + fallback memory store
- [x] Crew management: Create crews, join via 8-character invite codes, owner badges
- [x] Channel management: Create text and voice channels, unread badges
- [x] Real-time messaging with instant delivery across socket rooms
- [x] Message replies with quoted preview banner
- [x] Inline message editing and soft deletion
- [x] Emoji reactions with live counts and active user states
- [x] Real-time presence updates (Online/Offline) and member count
- [x] Real-time typing indicators with 3s auto-expiration
- [x] Search filter for channel messages
- [x] **Network resilience simulation button** to test disconnection, offline queuing, and reconnect resync directly from the UI
- [x] Clean dark theme UI with custom scrollbars and responsive panels

### 🔮 Planned (Post-MVP)
- [ ] WebRTC peer-to-peer audio streaming for voice channels
- [ ] Multi-file drag-and-drop S3 / R2 upload integration
- [ ] End-to-end message encryption with client key pairs
- [ ] Full text Elasticsearch / Meilisearch indexing for cross-crew search
