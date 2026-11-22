import { useState, useEffect, useRef } from 'react';
import { Clock, AlarmClock, Timer, Plus, Trash2, Flag } from 'lucide-react';
import { useOSStore } from '../../stores/useOSStore';

type ClockTab = 'world' | 'alarm' | 'stopwatch' | 'timer';

export function ClockApp() {
  const [activeTab, setActiveTab] = useState<ClockTab>('world');

  const {
    alarms,
    toggleAlarm,
    addAlarm,
    deleteAlarm,
    timerRemaining,
    setTimerRemaining,
    isTimerRunning,
    setIsTimerRunning,
  } = useOSStore();

  // World Clocks live times
  const [worldTimes, setWorldTimes] = useState({
    cupertino: '',
    london: '',
    tokyo: '',
    newyork: '',
  });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setWorldTimes({
        cupertino: now.toLocaleTimeString('en-US', {
          timeZone: 'America/Los_Angeles',
          hour: '2-digit',
          minute: '2-digit',
        }),
        london: now.toLocaleTimeString('en-GB', {
          timeZone: 'Europe/London',
          hour: '2-digit',
          minute: '2-digit',
        }),
        tokyo: now.toLocaleTimeString('ja-JP', {
          timeZone: 'Asia/Tokyo',
          hour: '2-digit',
          minute: '2-digit',
        }),
        newyork: now.toLocaleTimeString('en-US', {
          timeZone: 'America/New_York',
          hour: '2-digit',
          minute: '2-digit',
        }),
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Stopwatch state
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const stopwatchIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isStopwatchRunning) {
      const start = Date.now() - stopwatchTime;
      stopwatchIntervalRef.current = window.setInterval(() => {
        setStopwatchTime(Date.now() - start);
      }, 10);
    } else {
      if (stopwatchIntervalRef.current) clearInterval(stopwatchIntervalRef.current);
    }
    return () => {
      if (stopwatchIntervalRef.current) clearInterval(stopwatchIntervalRef.current);
    };
  }, [isStopwatchRunning, stopwatchTime]);

  const handleLap = () => {
    setLaps([stopwatchTime, ...laps]);
  };

  const handleResetStopwatch = () => {
    setIsStopwatchRunning(false);
    setStopwatchTime(0);
    setLaps([]);
  };

  const formatStopwatch = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  // Timer countdown
  useEffect(() => {
    let interval: number | null = null;
    if (isTimerRunning && timerRemaining && timerRemaining > 0) {
      interval = window.setInterval(() => {
        setTimerRemaining(timerRemaining - 1);
      }, 1000);
    } else if (timerRemaining === 0) {
      setIsTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerRemaining, setTimerRemaining, setIsTimerRunning]);

  // Add alarm modal state
  const [showAddAlarm, setShowAddAlarm] = useState(false);
  const [newAlarmTime, setNewAlarmTime] = useState('07:30');
  const [newAlarmLabel, setNewAlarmLabel] = useState('Morning');

  const handleCreateAlarm = () => {
    addAlarm({
      time: newAlarmTime,
      label: newAlarmLabel,
      isEnabled: true,
      days: ['Everyday'],
    });
    setShowAddAlarm(false);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-black text-white p-4 pt-1 select-none overflow-hidden">
      {/* Tab Content Container */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* WORLD CLOCK */}
        {activeTab === 'world' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight mb-2">World Clock</h2>
            {[
              { city: 'Cupertino', time: worldTimes.cupertino, offset: 'Today, -3HRS' },
              { city: 'New York', time: worldTimes.newyork, offset: 'Today, 0HRS' },
              { city: 'London', time: worldTimes.london, offset: 'Today, +5HRS' },
              { city: 'Tokyo', time: worldTimes.tokyo, offset: 'Tomorrow, +14HRS' },
            ].map((c) => (
              <div
                key={c.city}
                className="flex items-baseline justify-between py-3 border-b border-neutral-800"
              >
                <div>
                  <span className="text-xs text-neutral-400 block">{c.offset}</span>
                  <span className="text-lg font-semibold text-white">{c.city}</span>
                </div>
                <span className="text-3xl font-light font-mono tracking-tight text-white">
                  {c.time || '12:00'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ALARMS */}
        {activeTab === 'alarm' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold tracking-tight">Alarms</h2>
              <button
                onClick={() => setShowAddAlarm(true)}
                className="p-1 rounded-full bg-ios-orange/20 text-ios-orange hover:bg-ios-orange/30 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {showAddAlarm && (
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 mb-4 space-y-3">
                <h4 className="text-xs font-bold text-ios-orange uppercase">New Alarm</h4>
                <div className="flex space-x-2">
                  <input
                    type="time"
                    value={newAlarmTime}
                    onChange={(e) => setNewAlarmTime(e.target.value)}
                    className="flex-1 bg-black border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono text-base"
                  />
                  <input
                    type="text"
                    value={newAlarmLabel}
                    placeholder="Alarm label"
                    onChange={(e) => setNewAlarmLabel(e.target.value)}
                    className="flex-1 bg-black border border-neutral-700 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowAddAlarm(false)}
                    className="px-3 py-1.5 rounded-lg text-xs text-neutral-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateAlarm}
                    className="px-3 py-1.5 rounded-lg text-xs bg-ios-orange text-white font-semibold"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {alarms.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between py-2 border-b border-neutral-800"
                >
                  <div>
                    <span
                      className={`text-4xl font-light font-mono ${
                        a.isEnabled ? 'text-white' : 'text-neutral-500'
                      }`}
                    >
                      {a.time}
                    </span>
                    <span className="text-xs text-neutral-400 block mt-0.5">
                      {a.label} • {a.days.join(', ')}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => deleteAlarm(a.id)}
                      className="p-1 text-neutral-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {/* iOS Toggle Switch */}
                    <button
                      onClick={() => toggleAlarm(a.id)}
                      className={`w-12 h-7 rounded-full p-0.5 transition-colors duration-200 ${
                        a.isEnabled ? 'bg-ios-green' : 'bg-neutral-800'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                          a.isEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STOPWATCH */}
        {activeTab === 'stopwatch' && (
          <div className="flex flex-col items-center pt-8">
            <h1 className="text-6xl font-light font-mono text-white tracking-tight my-8">
              {formatStopwatch(stopwatchTime)}
            </h1>

            {/* Action buttons */}
            <div className="w-full flex items-center justify-between px-6 mb-8">
              <button
                onClick={isStopwatchRunning ? handleLap : handleResetStopwatch}
                disabled={stopwatchTime === 0 && !isStopwatchRunning}
                className="w-18 h-18 rounded-full bg-neutral-800 text-neutral-200 font-medium text-sm flex items-center justify-center hover:bg-neutral-700 active:scale-95 disabled:opacity-40 transition-all"
              >
                {isStopwatchRunning ? 'Lap' : 'Reset'}
              </button>

              <button
                onClick={() => setIsStopwatchRunning(!isStopwatchRunning)}
                className={`w-18 h-18 rounded-full font-medium text-sm flex items-center justify-center active:scale-95 transition-all ${
                  isStopwatchRunning
                    ? 'bg-red-950/80 text-red-400 border border-red-500/50'
                    : 'bg-green-950/80 text-green-400 border border-green-500/50'
                }`}
              >
                {isStopwatchRunning ? 'Stop' : 'Start'}
              </button>
            </div>

            {/* Laps List */}
            <div className="w-full max-h-44 overflow-y-auto no-scrollbar space-y-1.5 border-t border-neutral-800 pt-3">
              {laps.map((lapTime, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs py-1.5 px-3 border-b border-neutral-900 font-mono"
                >
                  <span className="text-neutral-400">Lap {laps.length - idx}</span>
                  <span className="text-white font-medium">{formatStopwatch(lapTime)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TIMER */}
        {activeTab === 'timer' && (
          <div className="flex flex-col items-center pt-8">
            {/* Countdown display */}
            <div className="relative w-56 h-56 rounded-full border-4 border-neutral-800 flex flex-col items-center justify-center my-6 shadow-inner">
              <span className="text-5xl font-light font-mono text-white tracking-tight">
                {timerRemaining !== null
                  ? `${Math.floor(timerRemaining / 60)
                      .toString()
                      .padStart(2, '0')}:${(timerRemaining % 60)
                      .toString()
                      .padStart(2, '0')}`
                  : '05:00'}
              </span>
              <span className="text-xs text-neutral-400 mt-1 uppercase font-semibold">
                {isTimerRunning ? 'Running' : 'Paused'}
              </span>
            </div>

            {/* Quick Timer presets */}
            {!isTimerRunning && (
              <div className="flex space-x-2 mb-6">
                {[1, 5, 10, 15].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setTimerRemaining(mins * 60)}
                    className="px-3 py-1.5 rounded-xl bg-neutral-800 text-xs font-semibold text-neutral-300 hover:bg-neutral-700 hover:text-white"
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            )}

            {/* Controls */}
            <div className="w-full flex items-center justify-between px-6">
              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerRemaining(null);
                }}
                className="w-18 h-18 rounded-full bg-neutral-800 text-neutral-200 font-medium text-sm flex items-center justify-center hover:bg-neutral-700 active:scale-95 transition-all"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  if (timerRemaining === null) setTimerRemaining(300); // 5 mins default
                  setIsTimerRunning(!isTimerRunning);
                }}
                className={`w-18 h-18 rounded-full font-medium text-sm flex items-center justify-center active:scale-95 transition-all ${
                  isTimerRunning
                    ? 'bg-ios-orange/30 text-ios-orange border border-ios-orange/60'
                    : 'bg-green-950/80 text-green-400 border border-green-500/50'
                }`}
              >
                {isTimerRunning ? 'Pause' : 'Start'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Tabs Bar */}
      <div className="flex items-center justify-around pt-3 border-t border-neutral-800 text-xs">
        {[
          { id: 'world', label: 'World Clock', icon: Clock },
          { id: 'alarm', label: 'Alarms', icon: AlarmClock },
          { id: 'stopwatch', label: 'Stopwatch', icon: Flag },
          { id: 'timer', label: 'Timer', icon: Timer },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ClockTab)}
              className={`flex flex-col items-center space-y-1 transition-colors ${
                isActive ? 'text-ios-orange' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
