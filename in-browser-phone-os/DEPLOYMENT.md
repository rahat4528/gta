# Deployment Guide — In-Browser Phone OS

## Recommended Hosting Platform
**Static SPA Hosting (Vercel, Cloudflare Pages, Netlify, GitHub Pages)**

In-Browser Phone OS is an interactive browser simulation written in React 19 and Vite. All system state, procedural sound synthesis, and mobile applications run entirely client-side.

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
PORT=3002 # Local dev server port
```

---

## Production Caveats & Requirements

1. **Browser Touch & Gesture Emulation**:
   - The OS simulation supports both touch events (mobile phones/tablets) and mouse pointer dragging (desktop).
   - On desktop viewports, the phone is rendered within an authentic titanium chassis with working external hardware buttons (Power, Volume Rocker, Action Button).
   - On mobile viewports (< 640px), the chassis automatically scales to fit the viewport edge-to-edge.

2. **Audio Autoplay Considerations**:
   - The custom procedural sound engine generates haptic clicks, lock/unlock whooshes, and Lo-Fi synth music via the Web Audio API. Audio context initializes upon the user's first click or swipe to adhere strictly to browser autoplay policies.
