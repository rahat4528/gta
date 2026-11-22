import { useState } from 'react';
import { Speedometer } from './Speedometer';
import { TelemetryPanel } from './TelemetryPanel';
import { ControlBar } from './ControlBar';
import { PauseMenu } from './PauseMenu';
import { useDrivingStore } from '../../stores/useDrivingStore';

export function HUD() {
  const showHUD = useDrivingStore((state) => state.settings.showHUD);
  const isPaused = useDrivingStore((state) => state.settings.isPaused);
  const setPaused = useDrivingStore((state) => state.setPaused);
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <>
      {/* Main HUD Overlays (hidden if showHUD is false) */}
      {showHUD && (
        <div className="absolute inset-0 pointer-events-none p-4 sm:p-6 flex flex-col justify-between z-20">
          {/* Top Control Header */}
          <div className="flex justify-center w-full pointer-events-auto">
            <ControlBar onOpenHelp={() => setHelpOpen(true)} />
          </div>

          {/* Bottom Cockpit Instrument Cluster */}
          <div className="flex flex-col sm:flex-row items-end justify-between gap-4 w-full">
            {/* Left: Speedometer & Tachometer */}
            <div className="pointer-events-auto cyber-panel clip-corner p-3 sm:p-4 border border-cyan-500/30">
              <Speedometer />
            </div>

            {/* Right: Telemetry & Drive Status */}
            <div className="pointer-events-auto">
              <TelemetryPanel />
            </div>
          </div>
        </div>
      )}

      {/* Pause & Help Menu Modal */}
      <PauseMenu
        isOpen={isPaused || helpOpen}
        onClose={() => {
          setPaused(false);
          setHelpOpen(false);
        }}
      />
    </>
  );
}
