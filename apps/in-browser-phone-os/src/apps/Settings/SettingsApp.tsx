import { useState } from 'react';
import {
  Wifi,
  Bluetooth,
  Plane,
  Sun,
  Image,
  Battery,
  Info,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useOSStore } from '../../stores/useOSStore';
import { WALLPAPERS } from '../../utils/wallpapers';

export function SettingsApp() {
  const {
    isDarkMode,
    toggleDarkMode,
    brightness,
    setBrightness,
    volume,
    setVolume,
    wifi,
    toggleWifi,
    bluetooth,
    toggleBluetooth,
    airplaneMode,
    toggleAirplaneMode,
    isLowPowerMode,
    toggleLowPowerMode,
    wallpaperId,
    setWallpaper,
    batteryLevel,
  } = useOSStore();

  const [activeSubpage, setActiveSubpage] = useState<string | null>(null);

  return (
    <div className="flex-1 flex flex-col bg-neutral-950 text-white select-none overflow-hidden">
      {/* Subpage Header if drilled into a section */}
      {activeSubpage && (
        <div className="flex items-center px-4 py-2 border-b border-neutral-800">
          <button
            onClick={() => setActiveSubpage(null)}
            className="flex items-center space-x-1 text-ios-blue hover:opacity-80 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-semibold">Settings</span>
          </button>
        </div>
      )}

      {/* WALLPAPER SUBPAGE */}
      {activeSubpage === 'wallpaper' ? (
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
          <h2 className="text-xl font-bold">Choose Wallpaper</h2>
          <div className="grid grid-cols-2 gap-3">
            {WALLPAPERS.map((wp) => {
              const isSelected = wp.id === wallpaperId;
              return (
                <div
                  key={wp.id}
                  onClick={() => setWallpaper(wp.id)}
                  className={`h-40 rounded-2xl p-3 flex flex-col justify-between cursor-pointer border-2 transition-all shadow-md ${
                    isSelected
                      ? 'border-ios-blue shadow-[0_0_12px_rgba(0,122,255,0.5)]'
                      : 'border-transparent hover:border-white/30'
                  }`}
                  style={{ background: wp.gradient }}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">
                    {wp.category}
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white drop-shadow">
                      {wp.name}
                    </span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-ios-blue flex items-center justify-center text-[10px] text-white">
                        ✓
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : activeSubpage === 'about' ? (
        /* ABOUT PHONE SUBPAGE */
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
          <h2 className="text-xl font-bold">About Phone</h2>
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 divide-y divide-neutral-800 text-xs">
            <div className="flex justify-between p-3.5">
              <span className="text-neutral-400">Name</span>
              <span className="text-white font-medium">iPhone 16 Pro</span>
            </div>
            <div className="flex justify-between p-3.5">
              <span className="text-neutral-400">iOS Version</span>
              <span className="text-white font-medium">18.3 (22D63)</span>
            </div>
            <div className="flex justify-between p-3.5">
              <span className="text-neutral-400">Model Name</span>
              <span className="text-white font-medium">A3102 (Titanium)</span>
            </div>
            <div className="flex justify-between p-3.5">
              <span className="text-neutral-400">Storage</span>
              <span className="text-white font-medium">512 GB (128 GB Free)</span>
            </div>
            <div className="flex justify-between p-3.5">
              <span className="text-neutral-400">Simulation Engine</span>
              <span className="text-ios-blue font-medium">React + Zustand</span>
            </div>
          </div>
        </div>
      ) : (
        /* MAIN SETTINGS LIST */
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>

          {/* Apple ID Profile Card */}
          <div className="bg-neutral-900 rounded-2xl p-3.5 flex items-center space-x-3 border border-neutral-800">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-ios-blue flex items-center justify-center text-white font-bold text-base shadow">
              R
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-white truncate">Rahat</h3>
              <p className="text-[11px] text-neutral-400 truncate">
                Apple Account, iCloud+, Media & Purchases
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
          </div>

          {/* Network Section */}
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 divide-y divide-neutral-800 text-xs overflow-hidden">
            {/* Airplane Mode */}
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 rounded-lg bg-ios-orange flex items-center justify-center text-white">
                  <Plane className="w-4 h-4" />
                </div>
                <span className="text-white font-medium">Airplane Mode</span>
              </div>
              <button
                onClick={toggleAirplaneMode}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                  airplaneMode ? 'bg-ios-green' : 'bg-neutral-800'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                    airplaneMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Wi-Fi */}
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 rounded-lg bg-ios-blue flex items-center justify-center text-white">
                  <Wifi className="w-4 h-4" />
                </div>
                <span className="text-white font-medium">Wi-Fi</span>
              </div>
              <button
                onClick={toggleWifi}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                  wifi && !airplaneMode ? 'bg-ios-green' : 'bg-neutral-800'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                    wifi && !airplaneMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Bluetooth */}
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 rounded-lg bg-ios-blue flex items-center justify-center text-white">
                  <Bluetooth className="w-4 h-4" />
                </div>
                <span className="text-white font-medium">Bluetooth</span>
              </div>
              <button
                onClick={toggleBluetooth}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                  bluetooth && !airplaneMode ? 'bg-ios-green' : 'bg-neutral-800'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                    bluetooth && !airplaneMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Display & Sound Controls */}
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-3.5 space-y-3.5 text-xs">
            {/* Dark Mode toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <Sun className="w-4 h-4" />
                </div>
                <span className="text-white font-medium">Dark Appearance</span>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                  isDarkMode ? 'bg-ios-green' : 'bg-neutral-800'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                    isDarkMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Brightness Slider */}
            <div>
              <div className="flex justify-between text-neutral-400 mb-1">
                <span>Display Brightness</span>
                <span className="text-white font-mono">{brightness}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={brightness}
                onChange={(e) => setBrightness(parseInt(e.target.value))}
                className="w-full accent-ios-blue cursor-pointer h-1.5 rounded-full"
              />
            </div>

            {/* Sound Volume Slider */}
            <div>
              <div className="flex justify-between text-neutral-400 mb-1">
                <span>Media Volume</span>
                <span className="text-white font-mono">{volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="w-full accent-ios-pink cursor-pointer h-1.5 rounded-full"
              />
            </div>
          </div>

          {/* Wallpaper & Battery Links */}
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 divide-y divide-neutral-800 text-xs overflow-hidden">
            {/* Wallpaper link */}
            <div
              onClick={() => setActiveSubpage('wallpaper')}
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-neutral-800/80 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 rounded-lg bg-cyan-600 flex items-center justify-center text-white">
                  <Image className="w-4 h-4" />
                </div>
                <span className="text-white font-medium">Wallpaper</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500" />
            </div>

            {/* Battery Low Power Mode */}
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 rounded-lg bg-ios-green flex items-center justify-center text-white">
                  <Battery className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-white font-medium block">Low Power Mode</span>
                  <span className="text-[10px] text-neutral-400">
                    Battery at {batteryLevel}%
                  </span>
                </div>
              </div>
              <button
                onClick={toggleLowPowerMode}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                  isLowPowerMode ? 'bg-ios-green' : 'bg-neutral-800'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                    isLowPowerMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* About Phone */}
            <div
              onClick={() => setActiveSubpage('about')}
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-neutral-800/80 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 rounded-lg bg-neutral-700 flex items-center justify-center text-white">
                  <Info className="w-4 h-4" />
                </div>
                <span className="text-white font-medium">About Phone</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
