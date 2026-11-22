import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDrag } from '@use-gesture/react';
import { Flashlight, Camera, ChevronUp, Music, Play, Pause, SkipForward } from 'lucide-react';
import { useOSStore } from '../../stores/useOSStore';

export function LockScreen() {
  const {
    unlockPhone,
    notifications,
    isFlashlightOn,
    toggleFlashlight,
    openApp,
    tracks,
    currentTrackIndex,
    isPlayingMusic,
    togglePlayPauseMusic,
    nextTrack,
  } = useOSStore();

  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: false })
      );
      setCurrentDate(
        now.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })
      );
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Swipe up to unlock gesture
  const [dragY, setDragY] = useState(0);

  const bind = useDrag(
    ({ movement: [_, my], velocity: [_vx, vy], down }) => {
      if (down) {
        // Dragging upwards (negative my)
        setDragY(Math.min(0, my));
      } else {
        if (my < -90 || vy < -0.4) {
          unlockPhone();
        }
        setDragY(0);
      }
    },
    {
      axis: 'y',
      filterTaps: true,
    }
  );

  return (
    <div
      {...bind()}
      className="relative z-30 flex-1 flex flex-col justify-between p-6 pt-4 text-white select-none overflow-hidden touch-none"
    >
      <motion.div
        animate={{ y: dragY }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full h-full flex flex-col justify-between"
      >
        {/* Top: Date and Big Lock Screen Clock */}
        <div className="flex flex-col items-center mt-6 text-center">
          <span className="text-sm font-semibold tracking-wide text-neutral-200/90 drop-shadow">
            {currentDate || 'Monday, November 23'}
          </span>
          <h1 className="text-7xl font-bold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)] mt-0.5">
            {currentTime || '10:45'}
          </h1>
        </div>

        {/* Middle: Music Widget or Notification Previews */}
        <div className="flex-1 flex flex-col justify-center my-4 space-y-3 max-h-[320px] overflow-hidden">
          {/* Media Now Playing Card if music is active */}
          {isPlayingMusic && currentTrack && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={() => {
                unlockPhone();
                openApp('music');
              }}
              className="glass-panel-dark rounded-[24px] p-4 shadow-xl cursor-pointer hover:border-white/30 transition-all"
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shadow"
                  style={{ background: currentTrack.coverGradient }}
                >
                  <Music className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {currentTrack.title}
                  </p>
                  <p className="text-xs text-neutral-300 truncate">
                    {currentTrack.artist}
                  </p>
                </div>

                {/* Controls */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center space-x-2"
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
            </motion.div>
          )}

          {/* Lock Screen Notification Previews */}
          {notifications.slice(0, 2).map((n) => (
            <motion.div
              key={n.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              onClick={() => {
                unlockPhone();
                openApp(n.appId);
              }}
              className="glass-panel-dark rounded-[22px] p-3.5 shadow-lg cursor-pointer hover:border-white/30 transition-all"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  {n.appId}
                </span>
                <span className="text-[10px] text-neutral-400">{n.timeAgo}</span>
              </div>
              <h4 className="text-xs font-semibold text-white truncate">{n.title}</h4>
              <p className="text-[11px] text-neutral-300 line-clamp-1 mt-0.5">
                {n.message}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom: Quick Actions (Flashlight & Camera) and Swipe Prompt */}
        <div className="flex flex-col items-center space-y-4">
          {/* Swipe to unlock indicator */}
          <div
            onClick={unlockPhone}
            className="flex flex-col items-center space-y-1 cursor-pointer group"
          >
            <ChevronUp className="w-4 h-4 text-white/60 group-hover:text-white animate-bounce" />
            <span className="text-xs font-medium tracking-wide text-white/80 group-hover:text-white transition-colors">
              Swipe up to unlock
            </span>
          </div>

          {/* Flashlight & Camera Buttons */}
          <div className="w-full flex items-center justify-between px-2">
            {/* Flashlight Button */}
            <button
              onClick={toggleFlashlight}
              className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
                isFlashlightOn
                  ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.8)]'
                  : 'glass-panel-dark text-white hover:bg-white/20'
              }`}
            >
              <Flashlight className="w-5 h-5" />
            </button>

            {/* Camera / Gallery Button */}
            <button
              onClick={() => {
                unlockPhone();
                openApp('gallery');
              }}
              className="w-12 h-12 rounded-full glass-panel-dark flex items-center justify-center text-white hover:bg-white/20 shadow-lg transition-colors"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
