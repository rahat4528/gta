import { useDrivingStore } from '../../stores/useDrivingStore';

export function TelemetryPanel() {
  const distance = useDrivingStore((state) => state.telemetry.distanceTraveled);
  const turbo = useDrivingStore((state) => state.telemetry.turboPressure);
  const isBraking = useDrivingStore((state) => state.telemetry.isBraking);
  const isNitro = useDrivingStore((state) => state.telemetry.isNitro);
  const driftAngle = useDrivingStore((state) => state.telemetry.driftAngle);
  const acceleration = useDrivingStore((state) => state.telemetry.acceleration);
  const isAutoDrive = useDrivingStore((state) => state.settings.isAutoDrive);
  const fps = useDrivingStore((state) => state.fps);

  // Format distance
  const distanceFormatted =
    distance >= 1000
      ? `${(distance / 1000).toFixed(2)} KM`
      : `${Math.round(distance)} M`;

  // Determine current driving state
  let statusText = 'CRUISING';
  let statusBadgeStyle = 'border-cyan-500/40 text-neon-cyan bg-cyan-950/40';

  if (isAutoDrive) {
    statusText = 'AUTOPILOT';
    statusBadgeStyle = 'border-green-500/50 text-neon-green bg-green-950/50 animate-pulse';
  } else if (isNitro) {
    statusText = 'NITRO OVERDRIVE';
    statusBadgeStyle = 'border-neon-cyan text-neon-cyan bg-cyan-950/70 shadow-[0_0_12px_#00f0ff] animate-pulse';
  } else if (isBraking) {
    statusText = 'HARD BRAKE';
    statusBadgeStyle = 'border-red-500/60 text-red-400 bg-red-950/60 shadow-[0_0_8px_#ff0033]';
  } else if (Math.abs(driftAngle) > 0.08) {
    statusText = 'DRIFTING';
    statusBadgeStyle = 'border-orange-500/60 text-orange-400 bg-orange-950/60';
  } else if (acceleration > 0.6) {
    statusText = 'THROTTLE FULL';
    statusBadgeStyle = 'border-yellow-500/50 text-yellow-300 bg-yellow-950/40';
  }

  return (
    <div className="cyber-panel clip-corner-sm p-3 flex flex-col space-y-2.5 text-xs font-cyber w-44 sm:w-52">
      {/* Status Badge */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">STATUS</span>
        <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${statusBadgeStyle}`}>
          {statusText}
        </span>
      </div>

      {/* Turbo Boost Bar */}
      <div>
        <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
          <span>TURBO BOOST</span>
          <span className="text-neon-cyan font-bold">{turbo.toFixed(2)} BAR</span>
        </div>
        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-700/60">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-neon-pink transition-all duration-75"
            style={{ width: `${Math.min((turbo / 1.8) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Trip Distance */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-800">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">ODOMETER</span>
        <span className="text-slate-200 font-bold tracking-wider">{distanceFormatted}</span>
      </div>

      {/* Live FPS */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">ENGINE SYNC</span>
        <span className={`font-bold ${fps >= 55 ? 'text-green-400' : fps >= 30 ? 'text-yellow-400' : 'text-red-400'}`}>
          {fps} FPS
        </span>
      </div>
    </div>
  );
}
