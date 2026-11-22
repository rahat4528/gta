# Neon Highway Drive (Project 1 of 5)

An endless, rain-soaked cyberpunk highway driving simulation built with **React Three Fiber**, **TypeScript**, **@react-three/drei**, **custom GLSL shaders**, and **Tailwind CSS**.

---

## Overview

**Neon Highway Drive** delivers an authentic, high-speed driving simulation experience set across infinite procedural cyberpunk megacities. Featuring a custom physics engine, automatic transmission with power bands and turbo boost pressure, responsive keyboard steering and drifting mechanics, procedural Web Audio API sound synthesis, and real-time wet asphalt reflections powered by custom GLSL shaders.

---

## Tech Stack & Architecture

- **Rendering Engine**: [React Three Fiber](https://r3f.docs.pmnd.rs/) (v9) & [Three.js](https://threejs.org/) (v0.174)
- **Shader Pipeline**: Custom GLSL shaders for:
  - Wet asphalt with Voronoi rain ripple interference, Fresnel glancing reflections, dynamic neon road stripes, and real-time headlight/taillight light pools.
  - Directional rain streaks with velocity slanting dynamically stretched by driving speed.
- **Controls & Physics**: Custom continuous vehicle physics model with automatic 6-speed transmission, engine RPM curve, turbo boost simulation, aerodynamic drag, lateral drift physics, and speed-sensitive steering damping.
- **HUD & UI**: [Tailwind CSS](https://tailwindcss.com/) with custom cyberpunk theme, glowing SVG radial speedometer, digital gear matrix, turbo bar, live FPS counter, and responsive cockpit telemetry.
- **Audio Synthesis**: Procedural Web Audio API sound engine (zero audio asset dependencies):
  - Multi-oscillator sports car engine with lowpass resonance tracking RPM
  - High-frequency turbo blow-off valve chirps
  - Continuous bandpassed rain ambient noise
  - Lateral tire slip / screech synthesizer
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) for low-latency telemetry updates.
- **Build Tool**: Vite on port `3001`.

---

## Directory Structure

```
apps/neon-highway-drive/
├── public/
│   ├── audio/
│   ├── environments/
│   ├── models/
│   └── textures/
├── src/
│   ├── components/
│   │   ├── City/             # Procedural skyscrapers with instanced meshes, neon ads, antennas
│   │   ├── Effects/          # Rain particles, tire spray, speed warp lines, postprocessing
│   │   ├── Highway/          # Endless recycled highway chunks, streetlamps, gantries, traffic AI
│   │   ├── HUD/              # Speedometer, telemetry panel, control bar, pause/help modal
│   │   ├── Scene/            # Scene root, camera controller (chase/cockpit/hood/cinematic), lighting
│   │   └── Vehicle/          # Cyberpunk sports car with headlights, taillights, spinning wheels, physics
│   ├── hooks/
│   │   └── useKeyboardControls.ts  # Responsive multi-key keyboard input handler
│   ├── shaders/
│   │   ├── rainShader.ts     # Custom GLSL rain streak vertex and fragment shaders
│   │   └── roadShader.ts     # Custom GLSL wet road shader with rain ripples and reflections
│   ├── stores/
│   │   └── useDrivingStore.ts# Zustand telemetry and simulation state store
│   ├── types/
│   │   └── index.ts          # Simulation, vehicle, and environment types
│   ├── utils/
│   │   └── audio.ts          # Procedural Web Audio API sound engine
│   ├── App.tsx               # Main app container
│   ├── index.css             # Tailwind CSS & custom cyber styling
│   └── main.tsx              # Application entry point
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## Installation & Setup

From the monorepo root:

```bash
# 1. Install all monorepo dependencies
pnpm install

# 2. Run typecheck
pnpm --filter neon-highway-drive typecheck

# 3. Run linter
pnpm --filter neon-highway-drive lint

# 4. Build production bundle
pnpm --filter neon-highway-drive build
```

---

## Running the App

Start the development server:

```bash
pnpm --filter neon-highway-drive dev
```

The app will be live at:
**`http://localhost:3001`**

---

## Controls

| Key | Action |
| --- | --- |
| `W` / `Arrow Up` | Throttle / Accelerate |
| `S` / `Arrow Down` | Foot Brake / Reverse |
| `A` / `Arrow Left` | Steer Left |
| `D` / `Arrow Right` | Steer Right |
| `Space` | Handbrake (Initiates Drift) |
| `Shift` | Nitro Overdrive Boost |
| `Z` | Toggle Auto-Drive AI Pilot |
| `C` | Cycle Camera View (`Follow Cam` / `Cockpit` / `Hood` / `Cinematic`) |
| `L` | Toggle Headlight Beams |
| `H` | Toggle HUD visibility |
| `M` | Mute / Unmute Audio |
| `Escape` / `P` | Pause / System Menu |

---

## Features: Implemented vs. Planned

### Implemented Features
- [x] **Endless Procedural Highway**: Seamless chunk recycling system spanning 600m+, zero memory growth, and constant high frame rate.
- [x] **Custom GLSL Wet Road Shader**:
  - Procedural rain ripples with animated Voronoi/sine wave interference.
  - Fresnel glance reflections of ambient city neon.
  - Dynamic glowing lane dashes and neon border curb lights.
  - Interactive car headlight and taillight illumination pools on the wet asphalt.
- [x] **Procedural Cyberpunk City**:
  - High-performance `InstancedMesh` skyscrapers with variable heights (40m - 220m).
  - Glowing window matrices on skyscraper facades.
  - Animated neon holographic billboards.
  - Rooftop antennas with blinking red aviation lights.
  - Flying sky-car spinners cruising in the upper atmosphere.
- [x] **Cyberpunk Sports Car & Physics**:
  - Aerodynamic wedge design with carbon fiber front splitter, rear wing, and diffuser.
  - Dual headlight beams casting real 3D spotlights.
  - Full-width neon taillight bar with dynamic brake brightening.
  - Underglow chassis neon lighting.
  - Interactive wheel steering, spinning, and glowing rim accents.
  - Exhaust ports with nitro flames under boost.
  - 6-speed automatic transmission simulation with RPM curve, torque falloff, and reverse gear.
  - Turbo boost pressure simulation up to 1.8 Bar.
  - Lateral tire slip and drift mechanics.
- [x] **Smooth Multi-Angle Camera Controller**:
  - Smooth follow chase cam with lateral sway and acceleration pitch.
  - Cockpit camera positioned inside the driver cabin.
  - Low-slung front hood camera for intense sense of speed.
  - Cinematic orbiting camera.
  - High-speed camera shake and dynamic FOV warp (60° to 85°).
- [x] **Live Cyberpunk HUD (Tailwind CSS)**:
  - SVG animated radial speedometer with real-time needle arc.
  - RPM tachometer bar with redline warning.
  - Digital gear indicator with gear shift highlight.
  - Turbo boost meter (Bar).
  - Trip odometer in meters / km.
  - Dynamic driving status badge (`CRUISING`, `DRIFTING`, `HARD BRAKE`, `AUTOPILOT`, `NITRO`).
  - Live FPS counter.
- [x] **Interactive Controls & Presets**:
  - 4 Environment Presets: **Neo Shibuya 2077**, **Outrun Sunset 1984**, **Los Angeles 2049**, and **Tokyo Bay Wangan**.
  - 4 Weather Presets: **Rain**, **Downpour**, **Storm**, and **Mist**.
  - Auto-Drive AI Pilot (automatic lane keeping, cruising, and lane changes).
  - Low-End Performance Mode toggle (HQ / Lite mode).
  - Audio volume slider and mute toggle.
  - Full Pause & Help drawer.
- [x] **Procedural Web Audio Engine**: Real-time synthesized engine harmonics, turbo blow-off hiss, rain ambiance, and drift tire screech.
- [x] **Highway Traffic AI**: 9 moving traffic vehicles across 4 lanes with dynamic relative velocity and lane respawning.
- [x] **Atmospheric Effects**:
  - Instanced GLSL rain particle system with speed-slanted streaks.
  - Wet tire road spray mist particles behind rear wheels.
  - High-speed warp streaks past the vehicle at speeds > 150 km/h.
  - Postprocessing: Bloom, chromatic aberration, and vignette.

### Planned Enhancements
- [ ] Speed radar checkpoints with photo flash on overhead gantries.
- [ ] Radio station selector featuring procedural synthwave tracks.
- [ ] Time-of-day dynamic progression slider (Dawn, Noon, Dusk, Midnight).
