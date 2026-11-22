import { motion } from 'framer-motion';
import { useDrag } from '@use-gesture/react';
import { useOSStore } from '../../stores/useOSStore';

interface HomeIndicatorProps {
  light?: boolean;
}

export function HomeIndicator({ light = false }: HomeIndicatorProps) {
  const { screenState, goHome, unlockPhone, toggleAppSwitcher } = useOSStore();

  const bind = useDrag(
    ({ movement: [_, my], velocity: [_vx, vy], down }) => {
      // Swipe up (my is negative)
      if (!down) {
        if (my < -60 || vy < -0.4) {
          if (screenState === 'locked') {
            unlockPhone();
          } else if (screenState === 'app') {
            goHome();
          } else if (screenState === 'home' && my < -100) {
            toggleAppSwitcher();
          }
        }
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
      className="absolute bottom-1.5 left-0 right-0 h-6 flex items-center justify-center cursor-grab active:cursor-grabbing z-50 touch-none"
    >
      <motion.div
        whileHover={{ scaleY: 1.3 }}
        whileTap={{ scaleY: 1.5, scaleX: 0.95 }}
        className={`w-36 h-1 rounded-full transition-colors duration-200 ${
          light ? 'bg-white/80' : 'bg-black/60 dark:bg-white/70'
        }`}
      />
    </div>
  );
}
