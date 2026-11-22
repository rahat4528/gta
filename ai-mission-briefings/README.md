# AI Mission Briefings (`apps/ai-mission-briefings`)

An AI-powered tactical intelligence briefing platform built with **Next.js 15**, **TypeScript**, **Vercel AI SDK**, **Zod**, and **Tailwind CSS**.

Engineered for mission-critical operations where LLM output is streamed token-by-token and tool calls are transformed into interactive, structured intelligence cards rather than unstructured chatbot text.

---

## 🚀 Key Architecture & Real-Time Intelligence

### 1. Dual-View Intelligence Interface
- **Dossier View**: Structured visual intelligence cards displaying tactical summaries, key findings, composite risk matrices, operational priorities, actionable checklists, and telemetry metrics.
- **Terminal View**: Raw, low-latency typewriter token stream with terminal buffer inspection.

### 2. Server-Enforced Tool Calling (Security Allowlist & Zod Validation)
The AI model cannot execute arbitrary code. Every tool call undergoes a strict two-stage server verification process:
1. **Server Allowlist**: Only tools explicitly declared in `ALLOWED_TOOLS` (`scan_threat_intelligence`, `satellite_reconnaissance`, `assess_resource_readiness`, `analyze_telemetry_anomalies`) are authorized. Any undeclared tool call is immediately denied with `status: 'denied'`.
2. **Strict Zod Input Validation**: Every parameter is validated against its respective Zod schema before server execution.
3. **Card Transformation**: Validated tool outputs are automatically transformed into rich Intelligence Cards.

### 3. Graceful Error Handling & Anomaly Quarantine (Safe Fallbacks)
- If the model generates malformed JSON, missing fields, or unrecognized card structures, `safeParseCard()` intercepts the payload without crashing the application.
- It renders a dedicated **FallbackCard** with anomaly diagnostics, field error reports, and the raw payload preserved for technical audit.

### 4. Configurable Provider Abstraction (Zero-Key Mock Mode)
- **Built-in Mock Provider**: Allows running and thoroughly testing the platform offline without any API keys. Generates high-fidelity scenarios (Orbital Satellite Intercept, Critical Cyber Infrastructure Ingress, Tactical Perimeter Reconnaissance), token-by-token streaming, tool calls, and structured card output.
- **OpenAI / External Provider**: Configurable via `AI_PROVIDER="openai"` and `OPENAI_API_KEY`.

---

## 🗂️ Intelligence Card Types

1. **Mission Summary Card**: Direct tactical objectives, classification banner, sector, commander, and operational overview.
2. **Key Findings Card**: Observations with confidence ratings (`HIGH`, `MEDIUM`, `LOW`), category tags, and impact analysis.
3. **Risk Assessment Card**: Severity levels (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`), probability percentages, mitigation procedures, and escalation protocols.
4. **Priority Level Card**: Prominent operational priority badge (`P1 - CRITICAL` to `P4 - ROUTINE`), response timeframe alert, and authorization seal.
5. **Recommended Actions Card**: Interactive tactical checklist with assignees, risk factors, deadlines, and clickable completion toggles with live progress tracking.
6. **Supporting Data Card**: Real-time telemetry metrics grid (units, deviation deltas, status badges), telemetry node routing, and citations.
7. **Execution Status Card**: Mission timeline phase, percentage progress bar, checkpoint, and cryptographic verification code.
8. **Fallback Anomaly Card**: Safe quarantine view for corrupt or non-conformant model outputs.

---

## 📦 Setup & Prerequisites

### 1. Environment Configuration
Ensure `.env` exists in `apps/ai-mission-briefings/`:

```env
# Set to 'mock' for local offline testing (no API key required)
# Set to 'openai' to use OpenAI GPT-4o
AI_PROVIDER="mock"

# OpenAI API Key (optional if AI_PROVIDER="mock")
OPENAI_API_KEY=""

# Server Port
PORT=3004
```

---

## 🛠️ Running the Application

From the monorepo root:

```bash
# Start development server on port 3004
pnpm dev:briefings

# Run TypeScript typechecking
pnpm --filter ai-mission-briefings typecheck

# Run ESLint
pnpm --filter ai-mission-briefings lint

# Production Build
pnpm build:briefings

# Run Production Server
pnpm --filter ai-mission-briefings start
```

Open [http://localhost:3004](http://localhost:3004) in your browser.

---

## 🧪 Verification & Automated Testing

Run the automated verification suite:

```bash
pnpm --filter ai-mission-briefings test:briefing
```

This tests:
1. Streaming SSE connection on `/api/briefing`
2. Token-by-token streaming chunk delivery
3. Server-side tool execution (`satellite_reconnaissance`, `scan_threat_intelligence`)
4. Zod schema validation of intelligence cards
5. Safe fallback recovery on malformed input streams.

---

## 📋 Implemented vs Planned Features

### ✅ Implemented
- [x] Next.js 15 App Router on port **3004**
- [x] Configurable AI provider abstraction (Mock provider + OpenAI readiness)
- [x] Zero-key high-fidelity Mock Provider with realistic token streaming and delays
- [x] Server-side tool allowlist (`scan_threat_intelligence`, `satellite_reconnaissance`, `assess_resource_readiness`, `analyze_telemetry_anomalies`)
- [x] Strict Zod schemas for all cards and tool parameter inputs
- [x] 8 Intelligence card variants (Summary, Findings, Risks, Priority, Actions, Supporting Data, Execution, Safe Fallback)
- [x] Live Tool Activity drawer with raw JSON parameter & output inspector
- [x] Stream cancellation / stop-generation button (`AbortController`)
- [x] Interactive action items checklist with completion progress meter
- [x] Preset mission templates (Orbital Satellite Intercept, Cyber Threat Breach, Deep Sea Cable Anomaly, Drone Swarm Intercept)
- [x] In-app "Test Anomaly Fallback" button to demonstrate safe quarantine of malformed outputs
- [x] Mission history & vault sidebar with search/filter, mission creation, and deletion
- [x] One-click Dossier Export (JSON download)
- [x] Dedicated `/missions` directory page for viewing and launching templates

### 🔮 Planned (Post-MVP)
- [ ] Export to PDF tactical dossier
- [ ] Multi-turn autonomous tool chaining with human-in-the-loop approvals
- [ ] Live WebSocket telemetry streaming into cards
