import { motion, AnimatePresence } from 'framer-motion';
import { Device } from './components/Device/Device';
import { StatusBar } from './components/StatusBar/StatusBar';
import { LockScreen } from './components/LockScreen/LockScreen';
import { HomeScreen } from './components/HomeScreen/HomeScreen';
import { NotificationCenter } from './components/NotificationCenter/NotificationCenter';
import { ControlCenter } from './components/ControlCenter/ControlCenter';

import { ClockApp } from './apps/Clock/ClockApp';
import { CalculatorApp } from './apps/Calculator/CalculatorApp';
import { NotesApp } from './apps/Notes/NotesApp';
import { SettingsApp } from './apps/Settings/SettingsApp';
import { GalleryApp } from './apps/Gallery/GalleryApp';
import { MusicPlayerApp } from './apps/Music/MusicPlayerApp';
import { CalendarApp } from './apps/Calendar/CalendarApp';

import { useOSStore } from './stores/useOSStore';

export default function App() {
  const { screenState, activeAppId, isFlashlightOn } = useOSStore();

  const renderActiveApp = () => {
    switch (activeAppId) {
      case 'clock':
        return <ClockApp />;
      case 'calculator':
        return <CalculatorApp />;
      case 'notes':
        return <NotesApp />;
      case 'settings':
        return <SettingsApp />;
      case 'gallery':
        return <GalleryApp />;
      case 'music':
        return <MusicPlayerApp />;
      case 'calendar':
        return <CalendarApp />;
      default:
        return <NotesApp />;
    }
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden flex items-center justify-center bg-[#09090b] text-white">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(120,119,198,0.15),transparent_60%)] pointer-events-none" />

      {/* Photorealistic iPhone Device Container */}
      <Device>
        {/* Status Bar */}
        <StatusBar light={screenState !== 'app' || activeAppId === 'music'} />

        {/* Dynamic Screen Viewport */}
        <div className="relative flex-1 flex flex-col overflow-hidden">
          <AnimatePresence mode="wait">
            {screenState === 'locked' && (
              <motion.div
                key="lock-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.25 }}
                className="w-full h-full flex flex-col"
              >
                <LockScreen />
              </motion.div>
            )}

            {screenState === 'home' && (
              <motion.div
                key="home-screen"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className="w-full h-full flex flex-col"
              >
                <HomeScreen />
              </motion.div>
            )}

            {screenState === 'app' && (
              <motion.div
                key={`app-${activeAppId}`}
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: 50 }}
                transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                className="w-full h-full flex flex-col"
              >
                {renderActiveApp()}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Flashlight Active Glow Simulator on Device */}
          {isFlashlightOn && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 blur-3xl pointer-events-none rounded-full" />
          )}

          {/* Notification Center Slide Down */}
          <NotificationCenter />

          {/* Control Center Slide Down */}
          <ControlCenter />
        </div>
      </Device>
    </main>
  );
}
