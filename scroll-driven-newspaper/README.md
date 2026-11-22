# The Los Santos Chronicle — Scroll-Driven Broadsheet Newspaper

An editorial, scroll-driven interactive digital broadsheet simulating the investigative press of San Andreas. Built using Next.js 15, GSAP ScrollTrigger, Lenis smooth scrolling, TypeScript, and Tailwind CSS. Runs independently on port 3005.

## Architecture & Features

- **Smooth Scroll & GSAP ScrollTrigger Integration**: Lenis smooth physics tied directly to GSAP's animation ticker, triggering scroll-bound animations with zero stutter.
- **Pinned Split-Screen Evidence Dossier**: Left-hand evidence board pins dynamically while multi-column investigative reporting scrolls through testimonies, surveillance logs, and financial records.
- **Multiplane Parallax Section**: Three independent depth layers (Vinewood skyline, signal wiretaps, teletype typography) shifting at varying velocity multipliers.
- **Dynamic Breaking News Ticker**: Real-time rotating emergency ticker reporting metropolitan incidents, vault alarms, and police dispatches with pause/play control.
- **Interactive Modals**: Full keyboard-accessible (`Cmd+K` / `Ctrl+K`) archival article search modal and broadsheet subscription delivery modal.
- **Reduced Motion Mode**: Accessible toggle that immediately tears down Lenis and ScrollTrigger pins, gracefully rendering static readable layouts.
- **Broadsheet Print Styles**: Dedicated CSS print layouts formatted like actual vintage newsprint broadsheets.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Scroll & Animation**: GSAP 3.12 (ScrollTrigger), Lenis 1.1
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Getting Started

Run standalone in its own independent folder:

```bash
cd scroll-driven-newspaper
pnpm install
pnpm dev
```

Visit [http://localhost:3005](http://localhost:3005) in your browser.
