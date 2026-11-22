# GTA V Five Independent Simulation & Engineering Projects

This repository contains **exactly five independent projects**, each built completely separately in its own self-contained folder with its own codebase, structure, components, dependencies, build pipeline, and dev port.

No applications import code from each other, and all projects are completely decoupled with zero shared package dependencies.

---

## Projects Matrix

| Project | Folder | Port | Stack | Status |
| :--- | :--- | :---: | :--- | :---: |
| **1. Neon Highway Drive** | `neon-highway-drive/` | `3001` | React Three Fiber, TypeScript, drei, GLSL Shaders, Tailwind CSS | **Done** |
| **2. In-Browser Phone OS** | `in-browser-phone-os/` | `3002` | React, TypeScript, Motion, use-gesture, Zustand, Tailwind CSS | **Done** |
| **3. Real-Time Crew Chat** | `real-time-crew-chat/` | `3003` | Next.js, TypeScript, Socket.IO, TanStack Query, Prisma, Tailwind CSS | **Done** |
| **4. AI Mission Briefings** | `ai-mission-briefings/` | `3004` | Next.js, TypeScript, Vercel AI SDK, Zod, Tailwind CSS | **Done** |
| **5. Scroll-Driven Newspaper** | `scroll-driven-newspaper/` | `3005` | Next.js, TypeScript, GSAP ScrollTrigger, Lenis, Tailwind CSS | **Done** |

---

## Repository Structure

```
gta/
├── neon-highway-drive/           # Project 1: Endless 3D neon driving simulation (Port 3001)
│   ├── src/components/           # 3D highway, city, vehicle, HUD, effects, shaders
│   ├── package.json              # Standalone dependencies and build scripts
│   ├── tsconfig.json             # Self-contained TypeScript configuration
│   └── README.md
│
├── in-browser-phone-os/          # Project 2: Interactive mobile phone OS (Port 3002)
│   ├── src/apps/                 # 7 functional apps (Clock, Calc, Notes, Gallery, Music, etc.)
│   ├── src/components/           # Lock screen, dynamic island, control center, gestures
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── real-time-crew-chat/          # Project 3: Resilient team chat & presence engine (Port 3003)
│   ├── server/                   # Standalone Node + Socket.IO server & Prisma DB service
│   ├── src/components/           # Real-time message feed, channel switcher, presence roster
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── ai-mission-briefings/         # Project 4: Streaming AI mission briefing terminal (Port 3004)
│   ├── src/ai/                   # Providers (Mock & OpenAI), Zod schemas, server tool calls
│   ├── src/components/           # Typewriter streaming, intelligence cards, mission history
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── scroll-driven-newspaper/      # Project 5: Broadsheet investigative newspaper (Port 3005)
│   ├── src/components/           # Pinned evidence dossier, multiplane parallax, breaking ticker
│   ├── src/animations/           # Lenis smooth scroll ticker & GSAP ScrollTrigger sync
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── package.json                  # Root workspace runner scripts
├── pnpm-workspace.yaml           # Workspace registry pointing to the 5 project folders
└── README.md
```

---

## Running Each Project Independently

Every project is completely self-contained and can be run independently from within its own directory:

```bash
# Project 1: Neon Highway Drive (Port 3001)
cd neon-highway-drive
pnpm install
pnpm dev

# Project 2: In-Browser Phone OS (Port 3002)
cd in-browser-phone-os
pnpm install
pnpm dev

# Project 3: Real-Time Crew Chat (Port 3003)
cd real-time-crew-chat
pnpm install
pnpm dev

# Project 4: AI Mission Briefings (Port 3004)
cd ai-mission-briefings
pnpm install
pnpm dev

# Project 5: Scroll-Driven Newspaper (Port 3005)
cd scroll-driven-newspaper
pnpm install
pnpm dev
```

---

## Convenience Workspace Commands

From the root directory, convenience scripts are available to run, test, or build across all projects:

```bash
# Start any individual dev server
pnpm dev:highway       # Port 3001
pnpm dev:phone         # Port 3002
pnpm dev:chat          # Port 3003
pnpm dev:briefings     # Port 3004
pnpm dev:newspaper     # Port 3005

# Workspace verification
pnpm typecheck         # Typechecks all 5 projects
pnpm lint              # Lints all 5 projects
pnpm build             # Builds all 5 projects for production
```
