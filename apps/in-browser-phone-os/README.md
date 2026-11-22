# In-Browser Phone OS (Project 2 of 5)

An authentic, miniature smartphone OS simulation that runs in the browser, built with **React 19**, **TypeScript**, **Framer Motion**, **@use-gesture/react**, **Zustand**, and **Tailwind CSS**.

> **SCOPE NOTE**: This is an interactive browser-based web simulation designed for testing UX patterns, gesture thresholds, and responsive mobile interfaces. It is **not** a real mobile operating system.

---

## Overview

**In-Browser Phone OS** recreates the tactile feel and responsiveness of a modern mobile operating system (inspired by iOS 18 / iPhone 16 Pro). It features realistic gesture thresholds, spring physics animations, stacked notification management, quick toggles via Control Center, interactive Dynamic Island alerts, procedural Web Audio API audio synthesis, and 7 fully functional built-in applications.

---

## Tech Stack & Architecture

- **UI Framework**: [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- **Animation Engine**: [Framer Motion](https://www.framer.com/motion/) (v12) for spring transitions, layout animations, and card carousels.
- **Gesture Engine**: [@use-gesture/react](https://use-gesture.netlify.app/) (v10) for swipe-to-unlock, horizontal home screen pagination, and swipe-down pull sheets with velocity detection and release snap-backs.
- **State Architecture**: [Zustand](https://github.com/pmndrs/zustand) central system store orchestrating screen state, active applications, audio playback, notifications, battery simulation, and device hardware settings.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom iOS glassmorphic blur filters, titanium chassis styling, and dynamic themes.
- **Audio Synthesizer**: Procedural Web Audio API sound engine (lock, unlock, touch tap, camera shutter, notification chime, and lo-fi chord progressions for the Music Player).
- **Build Tool**: Vite on port `3002`.

---

## Directory Structure

```
apps/in-browser-phone-os/
├── public/
│   ├── icons/
│   ├── sounds/
│   └── wallpapers/
├── src/
│   ├── apps/
│   │   ├── Calculator/       # Full arithmetic calculator with chaining & backspace
│   │   ├── Calendar/         # Monthly calendar with day selection & event creation
│   │   ├── Clock/            # World clock, alarms with toggles, stopwatch, timer
│   │   ├── Gallery/          # Photo grid, categories, and full-screen lightbox
│   │   ├── Music/            # Lo-Fi music player with procedural audio synthesis
│   │   ├── Notes/            # Note editor with search, pinning, and auto-saving
│   │   └── Settings/         # Toggles, wallpaper picker, brightness & volume controls
│   ├── components/
│   │   ├── ControlCenter/    # Quick toggles, vertical brightness & volume sliders
│   │   ├── Device/           # Titanium phone frame, side buttons, dynamic island, home bar
│   │   ├── HomeScreen/       # Paginated app grid, persistent dock, app switcher
│   │   ├── LockScreen/       # Date/time, notification previews, swipe-to-unlock
│   │   ├── NotificationCenter/ # Stacked dismissable notifications
│   │   └── StatusBar/        # Clock, cellular signal, Wi-Fi, battery percentage
│   ├── stores/
│   │   └── useOSStore.ts     # Central Zustand OS state store
│   ├── types/
│   │   └── index.ts          # Core OS interfaces and types
│   ├── utils/
│   │   ├── sound.ts          # Web Audio API procedural sound synthesizer
│   │   └── wallpapers.ts     # Curated gradient wallpaper definitions
│   ├── App.tsx               # Main application container
│   ├── index.css             # Tailwind CSS & iOS glassmorphism utilities
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
# 1. Install all dependencies
pnpm install

# 2. Run TypeScript check
pnpm --filter in-browser-phone-os typecheck

# 3. Run ESLint check
pnpm --filter in-browser-phone-os lint

# 4. Build production bundle
pnpm --filter in-browser-phone-os build
```

---

## Running the App

Start the development server on port **3002**:

```bash
pnpm --filter in-browser-phone-os dev
```

Visit in your browser:
**`http://localhost:3002`**

---

## Gestures & Navigation Guide

| Gesture / Action | Result |
| --- | --- |
| **Swipe Up from Bottom Bar** | Unlock phone (on Lock Screen) or return to Home Screen (from any app) |
| **Swipe Up & Hold from Bottom** | Open multi-tasking App Switcher |
| **Swipe Down from Top-Left** | Open Notification Center |
| **Swipe Down from Top-Right** | Open Control Center |
| **Swipe Left / Right on Home** | Switch between Paginated Home Pages |
| **Tap Dynamic Island** | Jump to active activity (Music playback or Countdown timer) |
| **Hardware Buttons (Desktop)** | Power button locks/unlocks phone; volume buttons adjust system volume |

---

## Features: Implemented vs. Planned

### Implemented Features
- [x] **Photorealistic Titanium Hardware Frame**: Curved bezel, speaker ear grille, action button, volume rocker, power button, and dynamic shadow.
- [x] **Dynamic Island**: Interactive morphing pill with spring animations for active music, timer countdowns, battery charging, and silent alerts.
- [x] **Lock Screen**: Live large digital clock, date, notification previews, now-playing card, quick flashlight & camera shortcuts, and swipe-to-unlock gesture with threshold and velocity snapping.
- [x] **Paginated Home Screen & Dock**: 2-page app grid with smooth horizontal dragging, page dots indicator, floating glassmorphic dock, and app launch animations.
- [x] **Control Center**:
  - 4-toggle connectivity pod (Airplane Mode, Cellular, Wi-Fi, Bluetooth).
  - Media now-playing widget with track details and transport controls.
  - Interactive vertical Brightness slider (adjusts screen filter live).
  - Interactive vertical Volume slider (adjusts audio output live).
  - Quick action shortcuts (Flashlight, Calculator, Low Power Mode).
- [x] **Notification Center**: Stacked glass cards with app icons, timestamps, individual dismiss actions, and "Clear All" button.
- [x] **7 Fully Interactive Working Apps**:
  1. **Clock**: World clock across 4 time zones, Alarms with toggle switches and add modal, Stopwatch with millisecond lap tracking, and Timer countdown synced to Dynamic Island.
  2. **Calculator**: Full arithmetic state machine (addition, subtraction, multiplication, division, percentages, negation, decimals, and display backspace).
  3. **Notes**: Rich notes list with search filtering, title & content editor, auto-saving, pinning, and deletion.
  4. **Settings**: Apple ID card, network toggles, Dark/Light appearance, live display brightness & volume controls, wallpaper picker, battery health, and About screen.
  5. **Gallery**: Curated photo grid with category filters (Nature, City, All, Favorites) and full-screen Lightbox modal with metadata and favorite toggling.
  6. **Music Player**: Playable procedural lo-fi synth tracks powered by Web Audio API, animated waveform visualizer, scrubber bar, volume control, and track queue.
  7. **Calendar**: Monthly interactive calendar grid, day event viewer, and new event creation modal.
- [x] **Procedural Audio Synthesizer**: Zero-asset audio engine generating tap haptics, lock clicks, unlock whooshes, camera shutter pops, and notification chimes.
- [x] **Personalization**: 6 curated gradient wallpapers with instant live preview.

### Planned Enhancements
- [ ] Passcode PIN screen toggle on Lock Screen.
- [ ] Siri-style voice prompt assistant simulator.
- [ ] Drag-and-drop icon reordering on the home grid.
