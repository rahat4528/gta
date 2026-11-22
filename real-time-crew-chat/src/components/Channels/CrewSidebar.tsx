'use client';

import { useState } from 'react';
import { Plus, Wifi, WifiOff } from 'lucide-react';
import { CrewSummary } from '../../types';
import { useSocket } from '../../hooks/useSocket';

interface CrewSidebarProps {
  crews: CrewSummary[];
  activeCrewId: string | null;
  onSelectCrew: (crewId: string) => void;
  onCreateCrew: () => void;
  onJoinCrew: () => void;
}

export function CrewSidebar({
  crews,
  activeCrewId,
  onSelectCrew,
  onCreateCrew,
  onJoinCrew,
}: CrewSidebarProps) {
  const { isConnected, isReconnecting } = useSocket();
  const [showAddMenu, setShowAddMenu] = useState(false);

  return (
    <div className="w-[72px] h-full bg-crew-bg flex flex-col items-center py-3 border-r border-crew-border/60 select-none z-30">
      {/* Network Connection Indicator */}
      <div
        className="mb-3 group relative cursor-pointer"
        title={
          isConnected
            ? 'Socket connected (Real-time live)'
            : isReconnecting
            ? 'Socket reconnecting...'
            : 'Socket disconnected (Offline queue active)'
        }
      >
        <div
          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
            isConnected
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
              : isReconnecting
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse'
              : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
          }`}
        >
          {isConnected ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
        </div>
      </div>

      <div className="w-8 h-[1px] bg-crew-border/80 mb-3" />

      {/* Crews List */}
      <div className="flex-1 w-full overflow-y-auto no-scrollbar flex flex-col items-center space-y-2.5 px-2">
        {crews.map((crew) => {
          const isActive = crew.id === activeCrewId;
          return (
            <div key={crew.id} className="relative group flex items-center">
              {/* Active Indicator Pill */}
              <div
                className={`absolute -left-2 w-1 rounded-r-full transition-all duration-200 ${
                  isActive
                    ? 'h-8 bg-white'
                    : 'h-2 bg-neutral-500 group-hover:h-5 opacity-0 group-hover:opacity-100'
                }`}
              />

              {/* Crew Icon Button */}
              <button
                onClick={() => onSelectCrew(crew.id)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold transition-all duration-200 shadow-md ${
                  isActive
                    ? 'bg-crew-accent text-white rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                    : 'bg-crew-panel hover:bg-crew-hover text-neutral-300 hover:text-white hover:rounded-xl'
                }`}
              >
                {crew.iconUrl && crew.iconUrl.length <= 2 ? (
                  crew.iconUrl
                ) : (
                  crew.name.slice(0, 2).toUpperCase()
                )}
              </button>
            </div>
          );
        })}

        {/* Add / Join Crew Button */}
        <div className="relative">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="w-12 h-12 rounded-2xl bg-crew-panel hover:bg-emerald-600/30 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 flex items-center justify-center hover:rounded-xl transition-all shadow"
            title="Create or Join Crew"
          >
            <Plus className="w-6 h-6" />
          </button>

          {showAddMenu && (
            <div className="absolute left-14 top-0 w-36 bg-crew-surface border border-crew-border rounded-xl shadow-2xl p-1 z-50 text-xs">
              <button
                onClick={() => {
                  setShowAddMenu(false);
                  onCreateCrew();
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-crew-hover text-white transition-colors"
              >
                Create Crew
              </button>
              <button
                onClick={() => {
                  setShowAddMenu(false);
                  onJoinCrew();
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-crew-hover text-neutral-300 hover:text-white transition-colors"
              >
                Join via Code
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
