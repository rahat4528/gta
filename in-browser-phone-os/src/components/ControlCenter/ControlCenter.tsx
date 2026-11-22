import { motion, AnimatePresence } from 'framer-motion';
import {
  Wifi,
  Bluetooth,
  Plane,
  Radio,
  Sun,
  Volume2,
  Flashlight,
  Calculator,
  BatteryCharging,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useOSStore } from '../../stores/useOSStore';

export function ControlCenter() {
  const {
    isControlCenterOpen,
    setControlCenter,
    wifi,
    bluetooth,
    airplaneMode,
    toggleWifi,
    toggleBluetooth,
    toggleAirplaneMode,
    isFlashlightOn,
    toggleFlashlight,
    isLowPowerMode,
    toggleLowPowerMode,
    brightness,
    setBrightness,
    volume,
    setVolume,
    tracks,
    currentTrackIndex,
    isPlayingMusic,
    togglePlayPauseMusic,
    nextTrack,
    openApp,
  } = useOSStore();

  const currentTrack = tracks[currentTrackIndex];

  return (
    <AnimatePresence>
      {isControlCenterOpen && (
        <motion.div
          initial={{ y: '-100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 350 }}
          className="absolute inset-0 z-50 bg-black/50 backdrop-blur-3xl p-5 pt-12 flex flex-col justify-between text-white select-none overflow-hidden"
        >
          {/* Backdrop click to dismiss */}
          <div
            onClick={() => setControlCenter(false)}
            className="absolute inset-0 z-0"
          />

          <div className="relative z-10 space-y-4">
            {/* Top Grid: 2 Large Cards (Connectivity Pod & Music Player) */}
            <div className="grid grid-cols-2 gap-3.5">
              {/* 4-Toggle Connectivity Pod */}
              <div className="glass-panel-dark rounded-[24px] p-3 grid grid-cols-2 gap-2.5 shadow-control">
                {/* Airplane Mode */}
                <button
                  onClick={toggleAirplaneMode}
                  className={`flex items-center justify-center h-12 w-12 rounded-full transition-all ${
                    airplaneMode
                      ? 'bg-ios-orange text-white shadow-[0_0_12px_rgba(255,149,0,0.5)]'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <Plane className="w-5 h-5" />
                </button>

                {/* Cellular */}
                <button
                  className={`flex items-center justify-center h-12 w-12 rounded-full transition-all ${
                    !airplaneMode
                      ? 'bg-ios-green text-white shadow-[0_0_12px_rgba(52,199,89,0.5)]'
                      : 'bg-white/10 text-white/40'
                  }`}
                >
                  <Radio className="w-5 h-5" />
                </button>

                {/* Wi-Fi */}
                <button
                  onClick={toggleWifi}
                  className={`flex items-center justify-center h-12 w-12 rounded-full transition-all ${
                    wifi && !airplaneMode
                      ? 'bg-ios-blue text-white shadow-[0_0_12px_rgba(0,122,255,0.5)]'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <Wifi className="w-5 h-5" />
                </button>

                {/* Bluetooth */}
                <button
                  onClick={toggleBluetooth}
                  className={`flex items-center justify-center h-12 w-12 rounded-full transition-all ${
                    bluetooth && !airplaneMode
                      ? 'bg-ios-blue text-white shadow-[0_0_12px_rgba(0,122,255,0.5)]'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <Bluetooth className="w-5 h-5" />
                </button>
              </div>

              {/* Now Playing Widget Card */}
              <div
                onClick={() => {
                  setControlCenter(false);
                  openApp('music');
                }}
                className="glass-panel-dark rounded-[24px] p-3 flex flex-col justify-between shadow-control cursor-pointer hover:border-white/30 transition-colors"
              >
                <div>
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
                    Now Playing
                  </span>
                  <p className="text-xs font-semibold text-white truncate mt-0.5">
                    {currentTrack ? currentTrack.title : 'Not Playing'}
                  </p>
                  <p className="text-[11px] text-neutral-400 truncate">
                    {currentTrack ? currentTrack.artist : 'Select track'}
                  </p>
                </div>

                {/* Playback Controls */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-between pt-1"
                >
                  <button
                    onClick={togglePlayPauseMusic}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                  >
                    {isPlayingMusic ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current" />
                    )}
                  </button>
                  <button
                    onClick={nextTrack}
                    className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Middle Section: Sliders & Small Quick Toggles */}
            <div className="grid grid-cols-4 gap-3.5 h-36">
              {/* Orientation Lock */}
              <button className="glass-panel-dark rounded-[22px] flex flex-col items-center justify-center space-y-1 hover:bg-white/20 transition-colors">
                <RotateCcw className="w-5 h-5 text-neutral-300" />
                <span className="text-[9px] font-medium text-neutral-400">Lock</span>
              </button>

              {/* Low Power Mode */}
              <button
                onClick={toggleLowPowerMode}
                className={`glass-panel-dark rounded-[22px] flex flex-col items-center justify-center space-y-1 transition-all ${
                  isLowPowerMode
                    ? 'bg-ios-yellow/30 border-ios-yellow/60 text-ios-yellow'
                    : 'hover:bg-white/20 text-neutral-300'
                }`}
              >
                <BatteryCharging className="w-5 h-5" />
                <span className="text-[9px] font-medium">Eco</span>
              </button>

              {/* Vertical Brightness Slider */}
              <div className="relative glass-panel-dark rounded-[22px] overflow-hidden flex flex-col justify-end p-2 shadow-control">
                {/* Active Level Fill from bottom */}
                <div
                  className="absolute bottom-0 left-0 right-0 bg-white rounded-b-[20px] transition-all duration-75 pointer-events-none"
                  style={{ height: `${brightness}%` }}
                />
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value))}
                  className="absolute inset-0 opacity-0 cursor-pointer h-full w-full"
                  style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
                />
                <Sun
                  className={`relative z-10 w-5 h-5 mx-auto ${
                    brightness > 50 ? 'text-black' : 'text-white'
                  }`}
                />
              </div>

              {/* Vertical Volume Slider */}
              <div className="relative glass-panel-dark rounded-[22px] overflow-hidden flex flex-col justify-end p-2 shadow-control">
                <div
                  className="absolute bottom-0 left-0 right-0 bg-white rounded-b-[20px] transition-all duration-75 pointer-events-none"
                  style={{ height: `${volume}%` }}
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="absolute inset-0 opacity-0 cursor-pointer h-full w-full"
                  style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
                />
                <Volume2
                  className={`relative z-10 w-5 h-5 mx-auto ${
                    volume > 50 ? 'text-black' : 'text-white'
                  }`}
                />
              </div>
            </div>

            {/* Bottom Row: Quick Tools (Flashlight, Calculator) */}
            <div className="grid grid-cols-4 gap-3.5">
              {/* Flashlight */}
              <button
                onClick={toggleFlashlight}
                className={`glass-panel-dark rounded-[22px] h-16 flex items-center justify-center transition-all ${
                  isFlashlightOn
                    ? 'bg-white text-black shadow-[0_0_18px_rgba(255,255,255,0.7)]'
                    : 'hover:bg-white/20 text-white'
                }`}
              >
                <Flashlight className="w-5 h-5" />
              </button>

              {/* Calculator Shortcut */}
              <button
                onClick={() => {
                  setControlCenter(false);
                  openApp('calculator');
                }}
                className="glass-panel-dark rounded-[22px] h-16 flex items-center justify-center hover:bg-white/20 text-white transition-colors"
              >
                <Calculator className="w-5 h-5 text-neutral-300" />
              </button>

              {/* Notes Shortcut */}
              <button
                onClick={() => {
                  setControlCenter(false);
                  openApp('notes');
                }}
                className="glass-panel-dark rounded-[22px] h-16 flex items-center justify-center hover:bg-white/20 text-white transition-colors"
              >
                <Sparkles className="w-5 h-5 text-ios-yellow" />
              </button>

              {/* Close Control Center button */}
              <button
                onClick={() => setControlCenter(false)}
                className="glass-panel-dark rounded-[22px] h-16 flex items-center justify-center hover:bg-white/20 text-neutral-400 text-xs font-semibold uppercase"
              >
                Close
              </button>
            </div>
          </div>

          {/* Swipe indicator pill to close */}
          <div
            onClick={() => setControlCenter(false)}
            className="w-full flex justify-center py-2 cursor-pointer"
          >
            <div className="w-32 h-1 rounded-full bg-white/40" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
