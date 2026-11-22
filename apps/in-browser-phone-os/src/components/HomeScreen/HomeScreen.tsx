import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDrag } from '@use-gesture/react';
import {
  Clock,
  Calculator,
  FileText,
  Settings,
  Image,
  Calendar,
  Music,
  Compass,
  Mail,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { useOSStore } from '../../stores/useOSStore';
import { AppId } from '../../types';

interface AppIconConfig {
  id: AppId | 'browser' | 'mail' | 'phone' | 'messages';
  name: string;
  icon: React.ReactNode;
  bgGradient: string;
  badge?: number;
  page: number;
}

export function HomeScreen() {
  const { openApp, currentPage, setCurrentPage, isAppSwitcherOpen, toggleAppSwitcher } =
    useOSStore();

  const [dragX, setDragX] = useState(0);

  // App definitions for Page 0 (Primary) and Page 1 (Secondary/Widgets)
  const apps: AppIconConfig[] = [
    {
      id: 'calendar',
      name: 'Calendar',
      icon: <Calendar className="w-7 h-7 text-white" />,
      bgGradient: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
      page: 0,
    },
    {
      id: 'clock',
      name: 'Clock',
      icon: <Clock className="w-7 h-7 text-white" />,
      bgGradient: 'linear-gradient(135deg, #18181b 0%, #09090b 100%)',
      page: 0,
    },
    {
      id: 'calculator',
      name: 'Calculator',
      icon: <Calculator className="w-7 h-7 text-white" />,
      bgGradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
      page: 0,
    },
    {
      id: 'notes',
      name: 'Notes',
      icon: <FileText className="w-7 h-7 text-white" />,
      bgGradient: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
      page: 0,
    },
    {
      id: 'gallery',
      name: 'Photos',
      icon: <Image className="w-7 h-7 text-white" />,
      bgGradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
      page: 0,
    },
    {
      id: 'music',
      name: 'Music',
      icon: <Music className="w-7 h-7 text-white" />,
      bgGradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
      page: 0,
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: <Settings className="w-7 h-7 text-white" />,
      bgGradient: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
      badge: 1,
      page: 0,
    },
    {
      id: 'browser',
      name: 'Safari',
      icon: <Compass className="w-7 h-7 text-white" />,
      bgGradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      page: 0,
    },

    // Page 1 Utilities
    {
      id: 'mail',
      name: 'Mail',
      icon: <Mail className="w-7 h-7 text-white" />,
      bgGradient: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
      badge: 4,
      page: 1,
    },
    {
      id: 'phone',
      name: 'Phone',
      icon: <Phone className="w-7 h-7 text-white" />,
      bgGradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
      page: 1,
    },
    {
      id: 'messages',
      name: 'Messages',
      icon: <MessageCircle className="w-7 h-7 text-white" />,
      bgGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      page: 1,
    },
  ];

  // Persistent Dock Apps (Bottom 4 items)
  const dockApps: AppIconConfig[] = [
    {
      id: 'notes',
      name: 'Notes',
      icon: <FileText className="w-6 h-6 text-white" />,
      bgGradient: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
      page: 0,
    },
    {
      id: 'music',
      name: 'Music',
      icon: <Music className="w-6 h-6 text-white" />,
      bgGradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
      page: 0,
    },
    {
      id: 'gallery',
      name: 'Photos',
      icon: <Image className="w-6 h-6 text-white" />,
      bgGradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
      page: 0,
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: <Settings className="w-6 h-6 text-white" />,
      bgGradient: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
      badge: 1,
      page: 0,
    },
  ];

  // Horizontal page drag gesture
  const bind = useDrag(
    ({ movement: [mx], velocity: [vx], down }) => {
      if (down) {
        setDragX(mx);
      } else {
        // Threshold check
        if (mx < -50 || vx < -0.4) {
          setCurrentPage(Math.min(1, currentPage + 1));
        } else if (mx > 50 || vx > 0.4) {
          setCurrentPage(Math.max(0, currentPage - 1));
        }
        setDragX(0);
      }
    },
    {
      axis: 'x',
      filterTaps: true,
    }
  );

  const handleAppClick = (appId: string) => {
    // If it's one of our 7 full interactive apps
    if (
      ['clock', 'calculator', 'notes', 'settings', 'gallery', 'calendar', 'music'].includes(
        appId
      )
    ) {
      openApp(appId as AppId);
    } else {
      // Default to notes or settings for stub icons
      openApp('notes');
    }
  };

  return (
    <div className="relative z-20 flex-1 flex flex-col justify-between p-4 pt-3 select-none overflow-hidden touch-none">
      {/* Paginated Home Screen Grid */}
      <div
        {...bind()}
        className="flex-1 flex overflow-hidden cursor-grab active:cursor-grabbing"
      >
        <motion.div
          animate={{ x: `calc(-${currentPage * 100}% + ${dragX}px)` }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="flex w-full h-full"
        >
          {/* PAGE 0 */}
          <div className="w-full flex-shrink-0 grid grid-cols-4 gap-x-4 gap-y-5 px-2 pt-3 content-start">
            {apps
              .filter((a) => a.page === 0)
              .map((app) => (
                <div
                  key={app.id}
                  onClick={() => handleAppClick(app.id)}
                  className="flex flex-col items-center space-y-1 cursor-pointer group"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative w-15 h-15 rounded-[18px] flex items-center justify-center shadow-app"
                    style={{ background: app.bgGradient }}
                  >
                    {app.icon}
                    {app.badge && (
                      <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1.5 rounded-full bg-ios-red text-white text-[10px] font-bold flex items-center justify-center border-2 border-black shadow">
                        {app.badge}
                      </span>
                    )}
                  </motion.div>
                  <span className="text-[11px] font-medium text-white tracking-tight drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] text-center truncate max-w-[65px]">
                    {app.name}
                  </span>
                </div>
              ))}
          </div>

          {/* PAGE 1 */}
          <div className="w-full flex-shrink-0 grid grid-cols-4 gap-x-4 gap-y-5 px-2 pt-3 content-start">
            {apps
              .filter((a) => a.page === 1)
              .map((app) => (
                <div
                  key={app.id}
                  onClick={() => handleAppClick(app.id)}
                  className="flex flex-col items-center space-y-1 cursor-pointer group"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative w-15 h-15 rounded-[18px] flex items-center justify-center shadow-app"
                    style={{ background: app.bgGradient }}
                  >
                    {app.icon}
                    {app.badge && (
                      <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1.5 rounded-full bg-ios-red text-white text-[10px] font-bold flex items-center justify-center border-2 border-black shadow">
                        {app.badge}
                      </span>
                    )}
                  </motion.div>
                  <span className="text-[11px] font-medium text-white tracking-tight drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] text-center truncate max-w-[65px]">
                    {app.name}
                  </span>
                </div>
              ))}
          </div>
        </motion.div>
      </div>

      {/* Pagination Dots Indicator */}
      <div className="flex items-center justify-center space-x-1.5 py-1 mb-2">
        <button
          onClick={() => setCurrentPage(0)}
          className={`h-1.5 rounded-full transition-all duration-200 ${
            currentPage === 0 ? 'w-4 bg-white' : 'w-1.5 bg-white/40'
          }`}
        />
        <button
          onClick={() => setCurrentPage(1)}
          className={`h-1.5 rounded-full transition-all duration-200 ${
            currentPage === 1 ? 'w-4 bg-white' : 'w-1.5 bg-white/40'
          }`}
        />
      </div>

      {/* Floating Bottom Dock */}
      <div className="glass-dock rounded-[32px] p-3 mx-1 mb-3 flex items-center justify-around shadow-dock">
        {dockApps.map((app) => (
          <motion.div
            key={`dock-${app.id}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleAppClick(app.id)}
            className="relative w-14 h-14 rounded-[16px] flex items-center justify-center cursor-pointer shadow-md"
            style={{ background: app.bgGradient }}
          >
            {app.icon}
            {app.badge && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-ios-red text-white text-[9px] font-bold flex items-center justify-center border border-black shadow">
                {app.badge}
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {/* App Switcher Carousel Modal */}
      <AnimatePresence>
        {isAppSwitcherOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleAppSwitcher}
            className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xl flex flex-col items-center justify-center p-6"
          >
            <div className="w-full text-center mb-6">
              <h3 className="text-base font-semibold text-white">App Switcher</h3>
              <p className="text-xs text-neutral-400">Tap an app card to switch</p>
            </div>

            <div className="flex space-x-4 overflow-x-auto no-scrollbar w-full py-4 px-2">
              {(['notes', 'calculator', 'clock', 'music', 'settings', 'gallery', 'calendar'] as AppId[]).map(
                (appId) => (
                  <motion.div
                    key={`switcher-${appId}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAppSwitcher();
                      openApp(appId);
                    }}
                    className="flex-shrink-0 w-44 h-72 rounded-[28px] bg-neutral-900 border border-white/20 p-4 flex flex-col justify-between shadow-2xl cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-white">
                        {appId}
                      </span>
                    </div>
                    <div className="text-center text-neutral-500 text-xs font-mono">
                      Active Instance
                    </div>
                  </motion.div>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
