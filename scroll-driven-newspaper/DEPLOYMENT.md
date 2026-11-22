# Deployment Guide — Scroll-Driven Broadsheet Newspaper

## Recommended Hosting Platform
**Vercel, Netlify, Cloudflare Pages, or Node.js Container**

The Los Santos Chronicle is built on Next.js 15 (App Router) with GSAP ScrollTrigger and Lenis smooth scrolling.

---

## Build Configuration

| Setting | Value |
| :--- | :--- |
| **Framework Preset** | Next.js |
| **Build Command** | `pnpm build` |
| **Start Command** | `pnpm start` (`next start -p 3005`) |
| **Node Version** | Node 18+ or 20+ |

---

## Environment Variables

```env
# Server Port
PORT=3005

# Optional Application URL
NEXT_PUBLIC_APP_URL="https://chronicle.yourdomain.com"
```

---

## Production Caveats & Requirements

1. **Client-Side Scroll Physics (Lenis & GSAP ScrollTrigger)**:
   - Lenis smooth scrolling and GSAP ScrollTrigger are executed in client components (`'use client'`).
   - On server-rendered passes (SSR), layouts render standard broadsheet markup to maintain SEO crawlability.
   - On route transitions (e.g. navigation from Front Page to `/articles/[slug]`), `ScrollTrigger.refresh()` is invoked to recalculate pin markers.

2. **Reduced Motion Accessibility**:
   - The broadsheet includes a header toggle that allows visitors to disable smooth scrolling and pinning entirely. The CSS print stylesheet also defaults to a zero-scroll, high-contrast broadsheet layout.
