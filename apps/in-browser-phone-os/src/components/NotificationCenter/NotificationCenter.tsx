import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Calendar, FileText, Music } from 'lucide-react';
import { useOSStore } from '../../stores/useOSStore';
import { AppId } from '../../types';

export function NotificationCenter() {
  const {
    isNotificationCenterOpen,
    setNotificationCenter,
    notifications,
    dismissNotification,
    clearAllNotifications,
    openApp,
  } = useOSStore();

  const getAppIcon = (appId: AppId) => {
    switch (appId) {
      case 'calendar':
        return <Calendar className="w-3.5 h-3.5 text-ios-red" />;
      case 'notes':
        return <FileText className="w-3.5 h-3.5 text-ios-yellow" />;
      case 'music':
        return <Music className="w-3.5 h-3.5 text-ios-pink" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-ios-blue" />;
    }
  };

  return (
    <AnimatePresence>
      {isNotificationCenterOpen && (
        <motion.div
          initial={{ y: '-100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 350 }}
          className="absolute inset-0 z-50 bg-black/60 backdrop-blur-3xl p-5 pt-12 flex flex-col justify-between text-white select-none overflow-hidden"
        >
          {/* Backdrop click to dismiss */}
          <div
            onClick={() => setNotificationCenter(false)}
            className="absolute inset-0 z-0"
          />

          <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-ios-blue" />
                <h3 className="text-sm font-semibold tracking-tight">Notification Center</h3>
              </div>

              {notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-colors"
                  title="Clear All Notifications"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Notification List */}
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-2.5 pr-0.5">
              {notifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-neutral-400 space-y-2 opacity-60">
                  <Bell className="w-8 h-8 stroke-1" />
                  <p className="text-xs font-medium">No Older Notifications</p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {notifications.map((n) => (
                    <motion.div
                      key={n.id}
                      layout
                      initial={{ scale: 0.9, opacity: 0, y: 10 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.85, opacity: 0, x: -100 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      onClick={() => {
                        setNotificationCenter(false);
                        openApp(n.appId);
                      }}
                      className="glass-panel-dark rounded-[20px] p-3 shadow-lg cursor-pointer hover:border-white/30 transition-all group"
                    >
                      {/* Top Header of Card */}
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-1.5">
                          <div className="p-1 rounded-md bg-white/10 flex items-center justify-center">
                            {getAppIcon(n.appId)}
                          </div>
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-300">
                            {n.appId}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] text-neutral-400 font-medium">
                            {n.timeAgo}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              dismissNotification(n.id);
                            }}
                            className="p-0.5 rounded-full hover:bg-white/20 text-neutral-400 hover:text-white transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <h4 className="text-xs font-semibold text-white leading-tight">
                        {n.title}
                      </h4>
                      <p className="text-[11px] text-neutral-300 leading-relaxed mt-0.5 line-clamp-2">
                        {n.message}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* Bottom Swipe Bar to close */}
          <div
            onClick={() => setNotificationCenter(false)}
            className="w-full flex justify-center py-2 cursor-pointer z-10"
          >
            <div className="w-32 h-1 rounded-full bg-white/40" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
