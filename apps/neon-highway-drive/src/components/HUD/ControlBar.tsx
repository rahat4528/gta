import { useState } from 'react';
import {
  Camera,
  Volume2,
  VolumeX,
  CloudRain,
  HelpCircle,
  Pause,
  Bot,
  Zap,
} from 'lucide-react';
import { useDrivingStore } from '../../stores/useDrivingStore';
import { EnvironmentPreset, WeatherType, CameraView } from '../../types';

interface ControlBarProps {
  onOpenHelp: () => void;
}

export function ControlBar({ onOpenHelp }: ControlBarProps) {
  const {
    settings,
    setPreset,
    setWeather,
    cycleCameraView,
    toggleAutoDrive,
    toggleAudio,
    setAudioVolume,
    toggleLowEndMode,
    togglePause,
  } = useDrivingStore();

  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const presets: { id: EnvironmentPreset; label: string }[] = [
    { id: 'cyberpunk', label: '2077 Cyber' },
    { id: 'synthwave', label: 'Outrun 84' },
    { id: 'bladerunner', label: 'LA 2049' },
    { id: 'midnight', label: 'Wangan Midnight' },
  ];

  const weathers: { id: WeatherType; label: string }[] = [
    { id: 'rain', label: 'Rain' },
    { id: 'heavy-rain', label: 'Downpour' },
    { id: 'storm', label: 'Storm' },
    { id: 'clear-mist', label: 'Mist' },
  ];

  const cameraNames: Record<CameraView, string> = {
    chase: 'Follow Cam',
    cockpit: 'Cockpit',
    hood: 'Hood Cam',
    cinematic: 'Cinematic',
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 cyber-panel clip-corner-sm px-3 py-2 text-xs font-cyber w-full max-w-5xl">
      {/* Left Section: Environment & Weather Presets */}
      <div className="flex items-center space-x-2">
        <span className="text-[10px] text-slate-400 uppercase tracking-widest hidden sm:inline">
          CITY:
        </span>
        <div className="flex space-x-1 bg-slate-900/80 p-0.5 rounded border border-slate-700/60">
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => setPreset(p.id)}
              className={`px-2 py-1 rounded text-[11px] font-bold transition-all ${
                settings.preset === p.id
                  ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/60 shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Weather Selector */}
        <div className="hidden md:flex items-center space-x-1 bg-slate-900/80 p-0.5 rounded border border-slate-700/60 ml-2">
          <CloudRain className="w-3.5 h-3.5 text-cyan-400 ml-1" />
          {weathers.map((w) => (
            <button
              key={w.id}
              onClick={() => setWeather(w.id)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                settings.weather === w.id
                  ? 'bg-neon-pink/20 text-neon-pink border border-neon-pink/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {w.label}
            </button>
          ))}
        </div>
      </div>

      {/* Right Section: Action Controls */}
      <div className="flex items-center space-x-1.5 sm:space-x-2">
        {/* Auto-Drive Toggle */}
        <button
          onClick={toggleAutoDrive}
          title="Toggle Auto-Drive AI Pilot (Key: Z)"
          className={`flex items-center space-x-1 px-2.5 py-1 rounded border text-[11px] font-bold transition-all ${
            settings.isAutoDrive
              ? 'bg-green-950/80 text-neon-green border-green-500 shadow-[0_0_8px_#00ff66]'
              : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-slate-500'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">AUTO-DRIVE</span>
          <span className="text-[9px] opacity-60 ml-0.5">[Z]</span>
        </button>

        {/* Camera View Switcher */}
        <button
          onClick={cycleCameraView}
          title="Cycle Camera View (Key: C)"
          className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-900/80 text-slate-300 border border-slate-700 hover:border-cyan-400 transition-all text-[11px] font-bold"
        >
          <Camera className="w-3.5 h-3.5 text-neon-cyan" />
          <span className="hidden sm:inline">{cameraNames[settings.cameraView]}</span>
          <span className="text-[9px] opacity-60 ml-0.5">[C]</span>
        </button>

        {/* Audio Volume & Mute */}
        <div className="relative flex items-center">
          <button
            onClick={toggleAudio}
            onMouseEnter={() => setShowVolumeSlider(true)}
            title="Mute/Unmute Audio (Key: M)"
            className={`p-1.5 rounded border transition-all ${
              settings.audioMuted
                ? 'bg-red-950/80 text-red-400 border-red-500/50'
                : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-slate-500'
            }`}
          >
            {settings.audioMuted ? (
              <VolumeX className="w-3.5 h-3.5" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
          </button>

          {showVolumeSlider && !settings.audioMuted && (
            <div
              onMouseLeave={() => setShowVolumeSlider(false)}
              className="absolute bottom-8 -left-12 cyber-panel p-2 rounded flex items-center space-x-2 z-50"
            >
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.audioVolume}
                onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
                className="w-20 accent-cyan-400 cursor-pointer h-1.5"
              />
            </div>
          )}
        </div>

        {/* Low-End Performance Mode */}
        <button
          onClick={toggleLowEndMode}
          title="Toggle Low-End Performance Mode"
          className={`flex items-center space-x-1 px-2 py-1 rounded border text-[11px] font-bold transition-all ${
            settings.lowEndPerformance
              ? 'bg-amber-950/80 text-amber-400 border-amber-500 shadow-[0_0_8px_#ffaa00]'
              : 'bg-slate-900/80 text-slate-400 border-slate-700 hover:text-slate-200'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span className="hidden md:inline">
            {settings.lowEndPerformance ? 'LITE MODE' : 'HQ MODE'}
          </span>
        </button>

        {/* Help / Controls modal button */}
        <button
          onClick={onOpenHelp}
          title="Controls & Instructions"
          className="p-1.5 rounded bg-slate-900/80 text-slate-300 border border-slate-700 hover:border-cyan-400 transition-all"
        >
          <HelpCircle className="w-3.5 h-3.5 text-neon-cyan" />
        </button>

        {/* Pause / Resume */}
        <button
          onClick={togglePause}
          title="Pause Drive (Key: ESC / P)"
          className="p-1.5 rounded bg-slate-900/80 text-slate-300 border border-slate-700 hover:border-red-400 transition-all"
        >
          <Pause className="w-3.5 h-3.5 text-red-400" />
        </button>
      </div>
    </div>
  );
}
