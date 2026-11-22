# The Los Santos Chronicle — Scroll-Driven Broadsheet Newspaper

An editorial, scroll-driven interactive digital broadsheet simulating the investigative press of San Andreas. Built using **Next.js 15**, **GSAP ScrollTrigger**, **Lenis smooth scrolling**, **TypeScript**, and **Tailwind CSS**. Runs independently on port **3005**.

---

## Architecture & Features

- **Smooth Scroll & GSAP ScrollTrigger Integration**: Lenis smooth physics tied directly to GSAP's animation ticker, triggering scroll-bound animations with zero stutter.
- **Pinned Split-Screen Evidence Dossier**: Left-hand evidence board pins dynamically while multi-column investigative reporting scrolls through testimonies, surveillance logs, and financial records.
- **Multiplane Parallax Section**: Three independent depth layers (Vinewood skyline, signal wiretaps, teletype typography) shifting at varying velocity multipliers.
- **Dynamic Breaking News Ticker**: Real-time rotating emergency ticker reporting metropolitan incidents, vault alarms, and police dispatches with pause/play control.
- **Interactive Modals**: Full keyboard-accessible (`Cmd+K` / `Ctrl+K`) archival article search modal and broadsheet subscription delivery modal.
- **Reduced Motion Mode**: Accessible toggle that immediately tears down Lenis and ScrollTrigger pins, gracefully rendering static readable layouts.
- **Broadsheet Print Styles**: Dedicated CSS print layouts formatted like actual vintage newsprint broadsheets.

---

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Scroll & Animation**: GSAP 3.12 (ScrollTrigger), Lenis 1.1
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

---

## Getting Started & Configuration

### Environment Variables
Copy `.env.example` to `.env`:
```env
PORT=3005
```

### Running the App
Run standalone in its own independent folder:

```bash
cd scroll-driven-newspaper
pnpm install
pnpm dev
```

Visit [http://localhost:3005](http://localhost:3005) in your browser.

---

## Features: Implemented vs. Planned

### Implemented Features (MVP)
- [x] **Front Page Broadsheet**: Multi-column editorial layout with date, weather meta bar, and classic newsprint halftone styling.
- [x] **Hero Investigative Lead**: Main story headline with animated word reveal and investigative photo frame.
- [x] **Pinned Evidence Dossier**: Left-hand surveillance card pins in place on desktop while right-hand report narrative scrolls through field notes.
- [x] **Multiplane Parallax Section**: 3 distinct depth layers shifting at differential scroll velocities.
- [x] **Metropolitan Stories Grid**: Curated grid of filed articles across Municipal, Crime, and Financial beats.
- [x] **Article Detail Pages (`/articles/[slug]`)**: Full broadsheet reader with lead paragraph styling, drop-caps, callout boxes, and subheadings.
- [x] **Section Archive Pages (`/categories/[slug]`)**: Filtered archival dispatches by editorial desk.
- [x] **Interactive Search Modal**: Instant article search with `Cmd+K` / `Ctrl+K` shortcut support.
- [x] **Subscription Delivery Modal**: Broadsheet home-delivery sign-up form with instant feedback.
- [x] **Accessible Reduced Motion Toggle**: Immediate teardown of Lenis and ScrollTrigger pins for motion-sensitive readers.

### Planned Enhancements (Post-MVP)
- [ ] Interactive crossword puzzle broadsheet widget with local storage persistence.
- [ ] Audio broadsheet reader (TTS narrator reading article lead paragraphs).
- [ ] Reader classifieds submission portal with mock moderation queue.
