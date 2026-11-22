import { motion, AnimatePresence } from 'framer-motion';
import { Music, Timer, BatteryCharging, Bell } from 'lucide-react';
import { useOSStore } from '../../stores/useOSStore';

export function DynamicIsland() {
  const activeIsland = useOSStore((state) => state.activeIsland);
  const openApp = useOSStore((state) => state.openApp);

  const handleClick = () => {
    if (activeIsland?.type === 'music') {
      openApp('music');
    } else if (activeIsland?.type === 'timer') {
      openApp('clock');
    }
  };

  return (
    <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center">
      <motion.div
        layout
        onClick={handleClick}
        className="bg-black text-white rounded-full flex items-center justify-between px-3 cursor-pointer shadow-lg overflow-hidden select-none"
        initial={{ width: 110, height: 30 }}
        animate={{
          width: activeIsland ? 190 : 110,
          height: activeIsland ? 34 : 30,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
      >
        {/* Left Side (Camera cutout / leading icon) */}
        <div className="flex items-center space-x-1.5 overflow-hidden">
          {activeIsland ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIsland.type}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="text-white flex items-center"
              >
                {activeIsland.type === 'music' && (
                  <Music className="w-3.5 h-3.5 text-ios-pink animate-pulse" />
                )}
                {activeIsland.type === 'timer' && (
                  <Timer className="w-3.5 h-3.5 text-ios-orange animate-spin" />
                )}
                {activeIsland.type === 'charging' && (
                  <BatteryCharging className="w-3.5 h-3.5 text-ios-green" />
                )}
                {activeIsland.type === 'silent' && (
                  <Bell className="w-3.5 h-3.5 text-ios-red" />
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 ring-1 ring-neutral-800" />
          )}

          {activeIsland && (
            <motion.span
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[11px] font-medium truncate max-w-[85px] leading-none"
            >
              {activeIsland.title}
            </motion.span>
          )}
        </div>

        {/* Center / Right side info */}
        <div className="flex items-center space-x-1.5">
          {activeIsland ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[11px] font-mono text-neutral-400 font-semibold leading-none"
            >
              {activeIsland.subtitle}
            </motion.span>
          ) : (
            <div className="w-2.5 h-2.5 rounded-full bg-blue-950/40 ring-1 ring-blue-900/30" />
          )}
        </div>
      </motion.div>
    </div>
  );
}
