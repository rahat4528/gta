# Neon Monorepo

Monorepo for futuristic 3D web simulations and experiences.

## Apps

- **Neon Highway Drive** (`apps/neon-highway-drive`): Endless, rain-soaked neon cyberpunk highway driving simulation built with React Three Fiber, TypeScript, drei, custom GLSL shaders, and Tailwind CSS. Runs on port 3001.

## Structure

```
neon-monorepo/
├── apps/
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

# Start Neon Highway Drive dev server (port 3001)
pnpm dev

# Build for production
pnpm build
```
