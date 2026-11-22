# Neon Monorepo

Monorepo containing five independent applications themed around futuristic web simulations, interactive OS experiences, and real-time engineering systems.

## Monorepo Status Matrix

| App | Port | Status | Known Gaps |
| :--- | :---: | :---: | :--- |
| **Neon Highway Drive** (`apps/neon-highway-drive`) | 3001 | Done | None (Full procedural endless simulation, shaders, HUD, controls, audio) |
| **In-Browser Phone OS** (`apps/in-browser-phone-os`) | 3002 | Done | None (Lock screen, swipe gestures, 7 interactive apps, Zustand store, audio) |
| **Real-Time Crew Chat** (`apps/real-time-crew-chat`) | 3003 | Done | None (Real-time socket engine, offline queue, deduplication, reactions, presence; WebRTC audio planned for future) |
| **AI Mission Briefings** (`apps/ai-mission-briefings`) | 3004 | Done | None (Streaming token typewriter, tool validation, intelligence cards, mission history; real OpenAI key optional via mock provider) |
| **Scroll-Driven Newspaper** (`apps/scroll-driven-newspaper`) | 3005 | In progress | Building Project 5 (Next.js, GSAP ScrollTrigger, Lenis, Tailwind) |

---

## Apps Overview

- **Neon Highway Drive** (`apps/neon-highway-drive`): Endless, rain-soaked neon cyberpunk highway driving simulation built with React Three Fiber, TypeScript, drei, custom GLSL shaders, and Tailwind CSS. Runs on port 3001.
- **In-Browser Phone OS** (`apps/in-browser-phone-os`): Interactive smartphone OS simulation running in the browser, built with React, TypeScript, Motion, use-gesture, Zustand, and Tailwind CSS. Runs on port 3002.
- **Real-Time Crew Chat** (`apps/real-time-crew-chat`): Real-time collaborative team chat platform with custom Next.js + Socket.IO server, PostgreSQL & Prisma, TanStack Query, resilient offline queue, message deduplication, presence sync, and typing indicators. Runs on port 3003.
- **AI Mission Briefings** (`apps/ai-mission-briefings`): Real-time streaming AI mission intelligence interface built with Next.js, Vercel AI SDK, Zod, and Tailwind CSS. Transforms tool calls into interactive structured intelligence cards with offline mock provider support. Runs on port 3004.
- **Scroll-Driven Newspaper** (`apps/scroll-driven-newspaper`): Immersive broadsheet journalism platform (*The Los Santos Chronicle / Weazel News*) built with Next.js, GSAP ScrollTrigger, Lenis smooth scrolling, Tailwind CSS, and TypeScript. Runs on port 3005.

---

## Directory Structure

```
neon-monorepo/
├── apps/
│   ├── ai-mission-briefings/     # Port 3004 (Next.js, Vercel AI SDK, Zod)
│   ├── in-browser-phone-os/      # Port 3002 (React, Motion, use-gesture, Zustand)
│   ├── neon-highway-drive/       # Port 3001 (React Three Fiber, drei, GLSL)
│   ├── real-time-crew-chat/      # Port 3003 (Next.js, Socket.IO, Prisma)
│   └── scroll-driven-newspaper/  # Port 3005 (Next.js, GSAP ScrollTrigger, Lenis)
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
pnpm dev:newspaper    # Port 3005 - Scroll-Driven Newspaper

# Run automated tests
pnpm --filter real-time-crew-chat test:realtime
pnpm --filter ai-mission-briefings test:briefing
```
