import { Scene } from './components/Scene/Scene';
import { HUD } from './components/HUD/HUD';

export default function App() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#030408]">
      {/* 3D WebGL Driving Simulation Canvas */}
      <Scene />

      {/* Cyberpunk Cockpit HUD & Controls */}
      <HUD />

      {/* CRT Scanline & Grain Subtle Aesthetic Overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.5)_100%)]" />
    </main>
  );
}
