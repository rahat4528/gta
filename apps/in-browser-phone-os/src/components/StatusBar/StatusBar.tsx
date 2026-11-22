import { useState, useEffect } from 'react';
import { Wifi, WifiOff, BatteryCharging } from 'lucide-react';
import { useOSStore } from '../../stores/useOSStore';

interface StatusBarProps {
  light?: boolean;
}

export function StatusBar({ light = true }: StatusBarProps) {
  const {
    batteryLevel,
    isCharging,
    isLowPowerMode,
    wifi,
    airplaneMode,
    cellularSignal,
    toggleNotificationCenter,
    toggleControlCenter,
  } = useOSStore();

  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const textColor = light ? 'text-white' : 'text-black dark:text-white';

  return (
    <div className={`relative z-40 w-full h-11 px-7 flex items-center justify-between text-xs font-semibold ${textColor} select-none`}>
      {/* Left side: Time & Notification Center Swipe Hotspot */}
      <div
        onClick={toggleNotificationCenter}
        title="Tap or Swipe Down for Notification Center"
        className="flex items-center space-x-1 cursor-pointer py-1 pr-4 -ml-2 hover:opacity-80 active:scale-95 transition-all"
      >
        <span className="font-semibold text-sm tracking-tight">{time || '9:41'}</span>
      </div>

      {/* Right side: Network & Battery & Control Center Swipe Hotspot */}
      <div
        onClick={toggleControlCenter}
        title="Tap or Swipe Down for Control Center"
        className="flex items-center space-x-2 cursor-pointer py-1 pl-4 -mr-2 hover:opacity-80 active:scale-95 transition-all"
      >
        {/* Cellular Signal Bars */}
        {!airplaneMode ? (
          <div className="flex items-end space-x-[1.5px] h-3">
            {[1, 2, 3, 4].map((bar) => (
              <div
                key={bar}
                className={`w-[3px] rounded-full ${
                  bar <= cellularSignal
                    ? light
                      ? 'bg-white'
                      : 'bg-black dark:bg-white'
                    : 'bg-neutral-500/40'
                }`}
                style={{ height: `${bar * 25}%` }}
              />
            ))}
          </div>
        ) : (
          <span className="text-[10px] uppercase font-bold tracking-wider">SOS</span>
        )}

        {/* Wi-Fi Icon */}
        {wifi && !airplaneMode ? (
          <Wifi className="w-3.5 h-3.5" />
        ) : (
          <WifiOff className="w-3.5 h-3.5 opacity-50" />
        )}

        {/* Battery Container */}
        <div className="flex items-center space-x-1">
          <span className="text-[11px] font-mono leading-none">{batteryLevel}%</span>
          <div className="relative w-6 h-3 rounded-[4px] border border-current p-[1.5px] flex items-center">
            {/* Battery Level Fill */}
            <div
              className={`h-full rounded-sm transition-all duration-300 ${
                isCharging
                  ? 'bg-ios-green'
                  : isLowPowerMode
                  ? 'bg-ios-yellow'
                  : batteryLevel < 20
                  ? 'bg-ios-red'
                  : light
                  ? 'bg-white'
                  : 'bg-black dark:bg-white'
              }`}
              style={{ width: `${Math.max(10, batteryLevel)}%` }}
            />
            {/* Charging Bolt or Low Power icon */}
            {isCharging && (
              <BatteryCharging className="absolute inset-0 m-auto w-2.5 h-2.5 text-black drop-shadow" />
            )}
            {/* Battery Terminal Nub */}
            <div className="absolute -right-[3.5px] top-1/2 -translate-y-1/2 w-[2px] h-[4px] bg-current rounded-r-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
