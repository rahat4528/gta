# Neon Monorepo

Monorepo for futuristic web simulations, interactive OS experiences, and creative applications.

## Apps

- **Neon Highway Drive** (`apps/neon-highway-drive`): Endless, rain-soaked neon cyberpunk highway driving simulation built with React Three Fiber, TypeScript, drei, custom GLSL shaders, and Tailwind CSS. Runs on port 3001.
- **In-Browser Phone OS** (`apps/in-browser-phone-os`): Interactive smartphone OS simulation running in the browser, built with React, TypeScript, Motion, use-gesture, Zustand, and Tailwind CSS. Runs on port 3002.

## Structure

```
neon-monorepo/
├── apps/
│   ├── in-browser-phone-os/
│   └── neon-highway-drive/
├── packages/
│   └── config/
├── pnpm-workspace.yaml
└── package.json
```

## Quick Start

```bash
# Install dependencies
pnpm install

# Start In-Browser Phone OS (port 3002)
pnpm dev:phone

# Start Neon Highway Drive (port 3001)
pnpm dev

# Build all applications
pnpm build
```
