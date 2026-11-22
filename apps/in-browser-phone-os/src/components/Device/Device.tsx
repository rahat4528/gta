import React from 'react';
import { DynamicIsland } from './DynamicIsland';
import { HomeIndicator } from './HomeIndicator';
import { useOSStore } from '../../stores/useOSStore';
import { WALLPAPERS } from '../../utils/wallpapers';
import { Power, Volume2, Volume1, BatteryCharging, Bell, SunMoon } from 'lucide-react';

interface DeviceProps {
  children: React.ReactNode;
}

export function Device({ children }: DeviceProps) {
  const {
    screenState,
    lockPhone,
    unlockPhone,
    brightness,
    volume,
    setVolume,
    toggleCharging,
    isCharging,
    addNotification,
    wallpaperId,
    toggleDarkMode,
  } = useOSStore();

  const currentWallpaper =
    WALLPAPERS.find((w) => w.id === wallpaperId) || WALLPAPERS[0];

  const handlePowerClick = () => {
    if (screenState === 'locked') {
      unlockPhone();
    } else {
      lockPhone();
    }
  };

  const handleVolumeUp = () => setVolume(Math.min(100, volume + 10));
  const handleVolumeDown = () => setVolume(Math.max(0, volume - 10));

  const handleTestNotification = () => {
    addNotification({
      appId: 'notes',
      title: 'Reminder // Calendar',
      message: 'Design sync starting in 5 minutes with engineering team.',
    });
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-6 p-4 sm:p-6 w-full h-full max-w-7xl mx-auto">
      {/* Outer Phone Hardware Body */}
      <div className="relative flex items-center justify-center">
        {/* PHYSICAL HARDWARE BUTTONS (Left Side) */}
        {/* Action Button */}
        <button
          onClick={handlePowerClick}
          title="Action Button (Toggle Lock)"
          className="absolute -left-[5px] top-[110px] w-[5px] h-[26px] bg-[#444448] hover:bg-neutral-400 active:w-[3px] rounded-l-sm transition-all"
        />
        {/* Volume Up */}
        <button
          onClick={handleVolumeUp}
          title="Volume Up"
          className="absolute -left-[5px] top-[155px] w-[5px] h-[48px] bg-[#3a3a3d] hover:bg-neutral-400 active:w-[3px] rounded-l-sm transition-all"
        />
        {/* Volume Down */}
        <button
          onClick={handleVolumeDown}
          title="Volume Down"
          className="absolute -left-[5px] top-[215px] w-[5px] h-[48px] bg-[#3a3a3d] hover:bg-neutral-400 active:w-[3px] rounded-l-sm transition-all"
        />

        {/* PHYSICAL HARDWARE BUTTONS (Right Side) */}
        {/* Power Button */}
        <button
          onClick={handlePowerClick}
          title="Power / Lock Button"
          className="absolute -right-[5px] top-[170px] w-[5px] h-[72px] bg-[#3a3a3d] hover:bg-neutral-400 active:w-[3px] rounded-r-sm transition-all"
        />

        {/* Main Phone Titanium Chassis Frame */}
        <div className="relative w-[385px] sm:w-[395px] h-[815px] sm:h-[835px] bg-[#1d1d1f] rounded-[54px] p-[10px] shadow-phone ring-1 ring-white/20 select-none">
          {/* Natural Titanium Metallic Border Inset */}
          <div className="w-full h-full rounded-[46px] p-[3px] bg-gradient-to-b from-[#48484a] via-[#2c2c2e] to-[#1c1c1e] shadow-inner">
            {/* Display Bezel & Glass Screen Container */}
            <div
              className="relative w-full h-full rounded-[44px] overflow-hidden bg-black flex flex-col"
              style={{
                filter: `brightness(${brightness}%)`,
                transition: 'filter 0.15s ease-out',
              }}
            >
              {/* Wallpaper Background Layer */}
              <div
                className="absolute inset-0 z-0 transition-all duration-700 ease-in-out pointer-events-none"
                style={{ background: currentWallpaper.gradient }}
              />

              {/* Dynamic Island */}
              <DynamicIsland />

              {/* Main OS Screen Layers (StatusBar, Screen, Notifications, ControlCenter) */}
              <div className="relative z-10 w-full h-full overflow-hidden flex flex-col">
                {children}
              </div>

              {/* Home Bar Gesture Indicator */}
              <HomeIndicator light={currentWallpaper.textColor === 'light'} />
            </div>
          </div>
        </div>
      </div>

      {/* External Desktop Tooling & Quick Actions Sidebar */}
      <div className="hidden lg:flex flex-col space-y-4 bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 rounded-3xl p-6 text-sm text-neutral-300 w-80 shadow-2xl">
        <div>
          <h2 className="text-base font-semibold text-white tracking-tight flex items-center space-x-2">
            <span>iPhone 16 Pro OS</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
              iOS 18.3 Sim
            </span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
            Miniature browser smartphone OS simulation with real gestures, apps, and audio synthesis.
          </p>
        </div>

        {/* Hardware Controls */}
        <div className="space-y-2 pt-2 border-t border-neutral-800">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
            Hardware Controls
          </span>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handlePowerClick}
              className="flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs transition-colors"
            >
              <Power className="w-3.5 h-3.5 text-red-400" />
              <span>{screenState === 'locked' ? 'Unlock' : 'Lock Phone'}</span>
            </button>

            <button
              onClick={toggleCharging}
              className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-xl font-medium text-xs transition-colors ${
                isCharging
                  ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-white'
              }`}
            >
              <BatteryCharging className="w-3.5 h-3.5" />
              <span>{isCharging ? 'Unplug' : 'Plug In'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleVolumeDown}
              className="flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs transition-colors"
            >
              <Volume1 className="w-3.5 h-3.5" />
              <span>Vol Down</span>
            </button>

            <button
              onClick={handleVolumeUp}
              className="flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Vol Up ({volume}%)</span>
            </button>
          </div>

          <button
            onClick={handleTestNotification}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs transition-colors"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span>Send Notification Alert</span>
          </button>

          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs transition-colors"
          >
            <SunMoon className="w-3.5 h-3.5 text-purple-400" />
            <span>Toggle Dark / Light Mode</span>
          </button>
        </div>

        {/* Gestures Cheat Sheet */}
        <div className="space-y-1.5 pt-2 border-t border-neutral-800 text-xs">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
            Gesture Guide
          </span>
          <ul className="space-y-1 text-neutral-400 text-[11px] leading-relaxed">
            <li>• <strong className="text-neutral-200">Swipe Up from bottom:</strong> Unlock or return Home.</li>
            <li>• <strong className="text-neutral-200">Top Left swipe down:</strong> Notification Center.</li>
            <li>• <strong className="text-neutral-200">Top Right swipe down:</strong> Control Center.</li>
            <li>• <strong className="text-neutral-200">Swipe Left/Right:</strong> Paginated home pages.</li>
            <li>• <strong className="text-neutral-200">Tap Dynamic Island:</strong> Expand current activity.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
