import { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Volume1,
  Music,
  Shuffle,
  Repeat,
  ListMusic,
} from 'lucide-react';
import { useOSStore } from '../../stores/useOSStore';

export function MusicPlayerApp() {
  const {
    tracks,
    currentTrackIndex,
    isPlayingMusic,
    togglePlayPauseMusic,
    nextTrack,
    prevTrack,
    playTrack,
    volume,
    setVolume,
  } = useOSStore();

  const [currentTime, setCurrentTime] = useState(0);
  const [showQueue, setShowQueue] = useState(false);

  const currentTrack = tracks[currentTrackIndex] || tracks[0];

  // Simulated song playback progress
  useEffect(() => {
    let interval: number | null = null;
    if (isPlayingMusic) {
      interval = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= currentTrack.duration) {
            nextTrack();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlayingMusic, currentTrack.duration, nextTrack]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = Math.floor(secs % 60);
    return `${mins}:${remaining.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-gradient-to-b from-neutral-900 to-black text-white p-5 select-none overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-2">
        <span className="text-xs text-neutral-400 uppercase tracking-widest font-semibold">
          Now Playing
        </span>
        <button
          onClick={() => setShowQueue(!showQueue)}
          className={`p-1.5 rounded-full transition-colors ${
            showQueue ? 'bg-ios-pink text-white' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <ListMusic className="w-5 h-5" />
        </button>
      </div>

      {showQueue ? (
        /* Track Queue List */
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 py-4">
          <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-2">
            Up Next
          </h3>
          {tracks.map((track, idx) => (
            <div
              key={track.id}
              onClick={() => {
                playTrack(idx);
                setShowQueue(false);
              }}
              className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-colors ${
                currentTrackIndex === idx
                  ? 'bg-ios-pink/20 border border-ios-pink/40 text-ios-pink'
                  : 'bg-neutral-900/60 hover:bg-neutral-800 text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                  style={{ background: track.coverGradient }}
                >
                  <Music className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold">{track.title}</h4>
                  <p className="text-[10px] text-neutral-400">{track.artist}</p>
                </div>
              </div>
              <span className="text-xs font-mono text-neutral-400">
                {formatTime(track.duration)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        /* Main Player View */
        <>
          {/* Large Album Artwork */}
          <div className="flex-1 flex items-center justify-center my-4">
            <div
              className={`relative w-64 h-64 rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-500 ${
                isPlayingMusic ? 'scale-100' : 'scale-95 opacity-90'
              }`}
              style={{ background: currentTrack.coverGradient }}
            >
              <Music className="w-20 h-20 text-white/90 drop-shadow-lg" />

              {/* Animated waveform visualizer bars when playing */}
              {isPlayingMusic && (
                <div className="absolute bottom-4 flex items-end space-x-1.5 h-6">
                  {[40, 75, 55, 90, 60, 85, 45].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-white/80 rounded-full animate-pulse"
                      style={{
                        height: `${h}%`,
                        animationDelay: `${i * 0.15}s`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Track Info */}
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white truncate tracking-tight">
              {currentTrack.title}
            </h2>
            <p className="text-sm text-neutral-400 truncate mt-0.5 font-medium">
              {currentTrack.artist} • {currentTrack.album}
            </p>
          </div>

          {/* Scrubber Timeline */}
          <div className="mb-4">
            <div className="relative w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-200"
                style={{
                  width: `${(currentTime / currentTrack.duration) * 100}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-neutral-400 mt-1.5">
              <span>{formatTime(currentTime)}</span>
              <span>-{formatTime(currentTrack.duration - currentTime)}</span>
            </div>
          </div>

          {/* Transport Controls */}
          <div className="flex items-center justify-between px-4 mb-4">
            <button className="text-neutral-400 hover:text-white">
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              onClick={prevTrack}
              className="p-3 text-white hover:opacity-80 active:scale-95 transition-all"
            >
              <SkipBack className="w-7 h-7 fill-current" />
            </button>

            <button
              onClick={togglePlayPauseMusic}
              className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              {isPlayingMusic ? (
                <Pause className="w-7 h-7 fill-current" />
              ) : (
                <Play className="w-7 h-7 fill-current ml-1" />
              )}
            </button>

            <button
              onClick={nextTrack}
              className="p-3 text-white hover:opacity-80 active:scale-95 transition-all"
            >
              <SkipForward className="w-7 h-7 fill-current" />
            </button>

            <button className="text-neutral-400 hover:text-white">
              <Repeat className="w-4 h-4" />
            </button>
          </div>

          {/* Volume Slider Bar */}
          <div className="flex items-center space-x-3 px-2 mb-2">
            <Volume1 className="w-4 h-4 text-neutral-400" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value))}
              className="flex-1 accent-white h-1.5 rounded-full cursor-pointer"
            />
            <Volume2 className="w-4 h-4 text-neutral-400" />
          </div>
        </>
      )}
    </div>
  );
}
