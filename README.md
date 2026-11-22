# Neon Monorepo

Monorepo for futuristic web simulations, interactive OS experiences, and real-time engineering systems.

## Monorepo Status Matrix

| App | Port | Status | Last Checked Date | Known Gaps |
| :--- | :---: | :---: | :---: | :--- |
| **Neon Highway Drive** (`apps/neon-highway-drive`) | 3001 | Healthy / Working | 2026-11-23 | None (Full procedural endless simulation, shaders, HUD, controls, audio) |
| **In-Browser Phone OS** (`apps/in-browser-phone-os`) | 3002 | Healthy / Working | 2026-11-23 | None (Lock screen, swipe gestures, 7 interactive apps, Zustand store, audio) |
| **Real-Time Crew Chat** (`apps/real-time-crew-chat`) | 3003 | Healthy / Working | 2026-11-23 | None (Real-time socket engine, offline queue, deduplication, reactions, presence; WebRTC audio planned for future) |
| **AI Mission Briefings** (`apps/ai-mission-briefings`) | 3004 | Healthy / Working | 2026-11-23 | None (Streaming token typewriter, tool validation, intelligence cards, mission history; real OpenAI key optional via mock provider) |
| **Scroll-Driven Newspaper** (`apps/scroll-driven-newspaper`) | 3005 | Missing | 2026-11-23 | Project 5 of 5 has not yet been initialized or built in the monorepo |

---

## Apps Overview

- **Neon Highway Drive** (`apps/neon-highway-drive`): Endless, rain-soaked neon cyberpunk highway driving simulation built with React Three Fiber, TypeScript, drei, custom GLSL shaders, and Tailwind CSS. Runs on port 3001.
- **In-Browser Phone OS** (`apps/in-browser-phone-os`): Interactive smartphone OS simulation running in the browser, built with React, TypeScript, Motion, use-gesture, Zustand, and Tailwind CSS. Runs on port 3002.
- **Real-Time Crew Chat** (`apps/real-time-crew-chat`): Real-time collaborative team chat platform with custom Next.js + Socket.IO server, PostgreSQL & Prisma, TanStack Query, resilient offline queue, message deduplication, presence sync, and typing indicators. Runs on port 3003.
- **AI Mission Briefings** (`apps/ai-mission-briefings`): Real-time streaming AI mission intelligence interface built with Next.js, Vercel AI SDK, Zod, and Tailwind CSS. Transforms tool calls into interactive structured intelligence cards with offline mock provider support. Runs on port 3004.
- **Scroll-Driven Newspaper** (`apps/scroll-driven-newspaper`): Planned Project 5 of 5. Next.js, GSAP ScrollTrigger, Lenis, Tailwind CSS, TypeScript. Runs on port 3005.

---

## Tech Stack Verification

All existing applications strictly retain their specified stacks without substitution:
- `apps/neon-highway-drive`: React Three Fiber, drei, custom GLSL shaders, Tailwind CSS, TypeScript.
- `apps/in-browser-phone-os`: React, Motion (Framer Motion), use-gesture (`@use-gesture/react`), Zustand, Tailwind CSS, TypeScript.
- `apps/real-time-crew-chat`: Next.js 15, Socket.IO, TanStack Query, Tailwind CSS, TypeScript (PostgreSQL & Prisma).
- `apps/ai-mission-briefings`: Next.js 15, Vercel AI SDK, Zod, Tailwind CSS, TypeScript.
- `packages/config`: Holds shared configuration only (`eslint.config.js`, `prettier.config.js`, `tsconfig.base.json`). No app imports code from any other app.

---

## Directory Structure

```
neon-monorepo/
├── apps/
│   ├── ai-mission-briefings/     # Port 3004 (Next.js, Vercel AI SDK, Zod)
│   ├── in-browser-phone-os/      # Port 3002 (React, Motion, use-gesture, Zustand)
│   ├── neon-highway-drive/       # Port 3001 (React Three Fiber, drei, GLSL)
│   ├── real-time-crew-chat/      # Port 3003 (Next.js, Socket.IO, Prisma)
│   └── (scroll-driven-newspaper) # Port 3005 (Planned)
├── packages/
│   └── config/                   # Shared ESLint, Prettier, TSConfig
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

---

## Quick Start & Commands

```bash
# Install monorepo dependencies
pnpm install

# Run all quality checks across the workspace
pnpm typecheck
pnpm lint
pnpm build

# Start individual development servers
pnpm dev:highway      # Port 3001 - Neon Highway Drive
pnpm dev:phone        # Port 3002 - In-Browser Phone OS
pnpm dev:chat         # Port 3003 - Real-Time Crew Chat
pnpm dev:briefings    # Port 3004 - AI Mission Briefings

# Run automated tests
pnpm --filter real-time-crew-chat test:realtime
pnpm --filter ai-mission-briefings test:briefing
```
