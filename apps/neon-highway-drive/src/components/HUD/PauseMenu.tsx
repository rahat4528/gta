import { Play, RotateCcw, X } from 'lucide-react';
import { useDrivingStore } from '../../stores/useDrivingStore';

interface PauseMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PauseMenu({ isOpen, onClose }: PauseMenuProps) {
  const { setPaused, resetDistance } = useDrivingStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="relative w-full max-w-lg cyber-panel clip-corner p-6 font-cyber border border-neon-cyan/50 shadow-[0_0_35px_rgba(0,240,255,0.25)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-pink">
            SYSTEM PAUSED
          </h2>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">
            Neon Highway Drive // Cyberpunk Simulation
          </p>
        </div>

        {/* Driving Controls Guide */}
        <div className="bg-slate-950/80 rounded-lg p-4 border border-slate-800 mb-6 text-xs">
          <h3 className="text-neon-cyan font-bold text-xs uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
            <span>Flight & Drive Controls</span>
          </h3>
          <div className="grid grid-cols-2 gap-2 text-slate-300">
            <div className="flex justify-between items-center bg-slate-900/60 p-1.5 rounded">
              <span className="text-slate-400">Throttle / Accelerate</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-neon-cyan font-bold">W / ↑</kbd>
            </div>
            <div className="flex justify-between items-center bg-slate-900/60 p-1.5 rounded">
              <span className="text-slate-400">Foot Brake / Reverse</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-neon-cyan font-bold">S / ↓</kbd>
            </div>
            <div className="flex justify-between items-center bg-slate-900/60 p-1.5 rounded">
              <span className="text-slate-400">Steer Left / Right</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-neon-cyan font-bold">A / D</kbd>
            </div>
            <div className="flex justify-between items-center bg-slate-900/60 p-1.5 rounded">
              <span className="text-slate-400">Handbrake (Drift)</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-red-400 font-bold">SPACE</kbd>
            </div>
            <div className="flex justify-between items-center bg-slate-900/60 p-1.5 rounded">
              <span className="text-slate-400">Nitro Boost</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold">SHIFT</kbd>
            </div>
            <div className="flex justify-between items-center bg-slate-900/60 p-1.5 rounded">
              <span className="text-slate-400">Cycle Camera</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-neon-pink font-bold">C</kbd>
            </div>
            <div className="flex justify-between items-center bg-slate-900/60 p-1.5 rounded">
              <span className="text-slate-400">Auto-Drive AI Pilot</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-neon-green font-bold">Z</kbd>
            </div>
            <div className="flex justify-between items-center bg-slate-900/60 p-1.5 rounded">
              <span className="text-slate-400">Toggle Headlights</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-yellow-300 font-bold">L</kbd>
            </div>
            <div className="flex justify-between items-center bg-slate-900/60 p-1.5 rounded">
              <span className="text-slate-400">Toggle HUD</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">H</kbd>
            </div>
            <div className="flex justify-between items-center bg-slate-900/60 p-1.5 rounded">
              <span className="text-slate-400">Mute / Audio</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">M</kbd>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              setPaused(false);
              onClose();
            }}
            className="flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded bg-neon-cyan hover:bg-cyan-300 text-black font-black uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,240,255,0.6)]"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Resume Simulation</span>
          </button>
          <button
            onClick={() => {
              resetDistance();
              setPaused(false);
              onClose();
            }}
            className="flex items-center justify-center space-x-2 py-2.5 px-4 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all border border-slate-600"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Run</span>
          </button>
        </div>
      </div>
    </div>
  );
}
