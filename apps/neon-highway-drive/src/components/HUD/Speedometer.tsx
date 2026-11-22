import { useMemo } from 'react';
import { useDrivingStore } from '../../stores/useDrivingStore';

export function Speedometer() {
  const speed = useDrivingStore((state) => state.telemetry.speed);
  const rpm = useDrivingStore((state) => state.telemetry.rpm);
  const gear = useDrivingStore((state) => state.telemetry.gear);
  const isBraking = useDrivingStore((state) => state.telemetry.isBraking);
  const isNitro = useDrivingStore((state) => state.telemetry.isNitro);

  const absSpeed = Math.abs(speed);
  const maxSpeed = 320;
  const speedRatio = Math.min(absSpeed / maxSpeed, 1);

  // SVG circular arc calculations
  // Angle from -140 deg to +140 deg (total 280 deg)
  const arcLength = 280;
  const strokeDashoffset = useMemo(() => {
    const circumference = 2 * Math.PI * 72; // r = 72 => ~452.4
    const totalArc = (arcLength / 360) * circumference;
    return totalArc - speedRatio * totalArc;
  }, [speedRatio]);

  const circumference = 2 * Math.PI * 72;
  const totalArc = (arcLength / 360) * circumference;

  // RPM percentage
  const rpmRatio = Math.min(rpm / 8500, 1);
  const isRedline = rpm > 7200;

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Radial Speed Dial */}
      <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-[140deg] overflow-visible" viewBox="0 0 160 160">
          {/* Background Track Arc */}
          <circle
            cx="80"
            cy="80"
            r="72"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="8"
            strokeDasharray={`${totalArc} ${circumference}`}
            strokeLinecap="round"
          />

          {/* Active Speed Arc */}
          <circle
            cx="80"
            cy="80"
            r="72"
            fill="none"
            stroke={isNitro ? '#00f0ff' : isBraking ? '#ff0033' : '#00f0ff'}
            strokeWidth="9"
            strokeDasharray={`${totalArc} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-75 ease-out"
            style={{
              filter: isNitro
                ? 'drop-shadow(0 0 12px #00f0ff)'
                : isBraking
                ? 'drop-shadow(0 0 10px #ff0033)'
                : 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.6))',
            }}
          />

          {/* Inner Accent Ring */}
          <circle
            cx="80"
            cy="80"
            r="56"
            fill="none"
            stroke="rgba(0, 240, 255, 0.2)"
            strokeWidth="1.5"
            strokeDasharray="4 6"
          />
        </svg>

        {/* Center Digital Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="flex items-baseline space-x-1">
            <span
              className={`font-cyber text-4xl sm:text-5xl font-black tracking-tighter ${
                isNitro
                  ? 'text-neon-cyan drop-shadow-[0_0_15px_#00f0ff]'
                  : isBraking
                  ? 'text-red-500 drop-shadow-[0_0_12px_#ff0033]'
                  : 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]'
              }`}
            >
              {absSpeed}
            </span>
            <span className="font-cyber text-xs sm:text-sm text-neon-cyan/70 font-semibold uppercase">
              km/h
            </span>
          </div>

          {/* Current Gear Box */}
          <div className="mt-1 flex items-center space-x-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">GEAR</span>
            <span
              className={`px-2 py-0.5 rounded font-cyber text-sm font-bold border ${
                gear === 'R'
                  ? 'bg-red-950/80 text-red-400 border-red-500/50'
                  : gear === 'N'
                  ? 'bg-slate-800/80 text-slate-300 border-slate-600/50'
                  : 'bg-cyan-950/80 text-neon-cyan border-cyan-400/60 shadow-[0_0_8px_rgba(0,240,255,0.4)]'
              }`}
            >
              {gear}
            </span>
          </div>
        </div>
      </div>

      {/* Tachometer RPM Bar */}
      <div className="w-44 sm:w-52 mt-1 px-1">
        <div className="flex justify-between items-center text-[10px] font-cyber text-slate-400 mb-0.5">
          <span>RPM x1000</span>
          <span className={`font-bold ${isRedline ? 'text-red-400 animate-pulse' : 'text-neon-cyan'}`}>
            {(rpm / 1000).toFixed(1)}k
          </span>
        </div>
        <div className="h-2 w-full bg-slate-900/90 rounded border border-slate-700/60 overflow-hidden flex p-0.5">
          <div
            className={`h-full rounded-sm transition-all duration-75 ${
              isRedline
                ? 'bg-gradient-to-r from-neon-cyan via-yellow-400 to-red-500 shadow-[0_0_8px_#ff0033]'
                : 'bg-gradient-to-r from-cyan-600 via-neon-cyan to-neon-pink'
            }`}
            style={{ width: `${rpmRatio * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
