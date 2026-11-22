# Neon Monorepo

Monorepo for futuristic web simulations, interactive OS experiences, and real-time engineering systems.

## Apps

- **Neon Highway Drive** (`apps/neon-highway-drive`): Endless, rain-soaked neon cyberpunk highway driving simulation built with React Three Fiber, TypeScript, drei, custom GLSL shaders, and Tailwind CSS. Runs on port 3001.
- **In-Browser Phone OS** (`apps/in-browser-phone-os`): Interactive smartphone OS simulation running in the browser, built with React, TypeScript, Motion, use-gesture, Zustand, and Tailwind CSS. Runs on port 3002.
- **Real-Time Crew Chat** (`apps/real-time-crew-chat`): Real-time collaborative team chat platform with custom Next.js + Socket.IO server, PostgreSQL & Prisma, TanStack Query, resilient offline queue, message deduplication, presence sync, and typing indicators. Runs on port 3003.
- **AI Mission Briefings** (`apps/ai-mission-briefings`): Real-time streaming AI mission intelligence interface built with Next.js, Vercel AI SDK, Zod, and Tailwind CSS. Transforms tool calls into interactive structured intelligence cards with offline mock provider support. Runs on port 3004.

## Structure

```
neon-monorepo/
├── apps/
│   ├── ai-mission-briefings/
│   ├── in-browser-phone-os/
│   ├── neon-highway-drive/
│   └── real-time-crew-chat/
├── packages/
│   └── config/
├── pnpm-workspace.yaml
└── package.json
```

## Quick Start

```bash
# Install dependencies
pnpm install

# Start AI Mission Briefings (port 3004)
pnpm dev:briefings

# Start Real-Time Crew Chat (port 3003)
pnpm dev:chat

# Start In-Browser Phone OS (port 3002)
pnpm dev:phone

# Start Neon Highway Drive (port 3001)
pnpm dev:highway

# Build all applications
pnpm build
```
