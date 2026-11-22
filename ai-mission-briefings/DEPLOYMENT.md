# Deployment Guide — AI Mission Briefings

## Recommended Hosting Platform
**Vercel, AWS Amplify, Render, or Node.js Container**

AI Mission Briefings is a Next.js 15 App Router application featuring real-time Server-Sent Events (SSE) token streaming, Zod schema validation, and server tool calling.

---

## Build Configuration

| Setting | Value |
| :--- | :--- |
| **Framework Preset** | Next.js |
| **Build Command** | `pnpm build` |
| **Start Command** | `pnpm start` (`next start -p 3004`) |
| **Node Version** | Node 18+ or 20+ |

---

## Environment Variables

```env
# AI Provider: 'mock' for standalone offline operations (zero keys required)
# Or 'openai' to connect to live OpenAI GPT-4o
AI_PROVIDER="mock"

# OpenAI API Key (optional when AI_PROVIDER="mock")
OPENAI_API_KEY=""

# Server Port
PORT=3004
```

---

## Production Caveats & Requirements

1. **Streaming Execution Timeouts (Serverless vs Node Runtime)**:
   - When deploying to serverless hosts like Vercel Serverless Functions, ensure the route maximum duration (`maxDuration`) is set sufficiently high (e.g. `export const maxDuration = 60;`) or execute using the Next.js Edge Runtime (`export const runtime = 'edge';`) to prevent serverless function timeouts during long-form briefing streams.
2. **Zero-Key Mock Provider in Production Demos**:
   - For demo or evaluation deployments where live API credits are not provisioned, setting `AI_PROVIDER="mock"` provides a complete, realistic intelligence simulation with zero cost and 100% availability.
