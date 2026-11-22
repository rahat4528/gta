# Deployment Guide — Neon Highway Drive

## Recommended Hosting Platform
**Static SPA Hosting (Vercel, Cloudflare Pages, Netlify, or AWS S3 + CloudFront)**

Neon Highway Drive is a purely client-side WebGL / Three.js 3D application. It does not require a persistent Node.js runtime or backend database in production.

---

## Build Configuration

| Setting | Value |
| :--- | :--- |
| **Framework Preset** | Vite |
| **Build Command** | `pnpm build` |
| **Output Directory** | `dist` |
| **Node Version** | Node 18+ or 20+ |

---

## Environment Variables
None required for base operation.

Optional:
```env
PORT=3001 # Local dev port
```

---

## Production Caveats & Requirements

1. **GPU & WebGL2 Requirement**:
   - The application leverages WebGL2, post-processing bloom shaders, instanced rendering, and custom GLSL vertex/fragment shaders.
   - Client hardware requires WebGL2 support. All modern desktop and mobile browsers (Chrome 56+, Safari 15+, Firefox 51+, Edge 79+) support WebGL2 out of the box.

2. **Performance Mode on Mobile / Low-End Hardware**:
   - Skyscraper matrices utilize `InstancedMesh` to keep draw calls minimal (~40 draw calls total).
   - If deploying to low-power mobile devices, advise users to toggle "Low-End Performance Mode" in the in-game HUD control bar, which dynamically lowers the rain particle density and disables heavy screen-space bloom passes.

3. **Audio Autoplay Policies**:
   - The procedural Web Audio API engine begins upon the first user interaction (key press or click) in compliance with browser autoplay restrictions.
