'use client';

import { Shield, Radio, ShieldAlert } from 'lucide-react';
import { Role, UserProfile } from '../../types';
import { useSocket } from '../../hooks/useSocket';

export interface CrewMemberItem {
  id: string;
  role: Role;
  user: UserProfile;
}

interface PresenceListProps {
  members: CrewMemberItem[];
}

export function PresenceList({ members }: PresenceListProps) {
  const { onlineUserIds, isConnected, socket } = useSocket();

  // Split into Online and Offline based on live socket onlineUserIds or user's stored presence
  const onlineMembers = members.filter(
    (m) => onlineUserIds.has(m.user.id) || (m.user.isOnline && !onlineUserIds.size)
  );
  const offlineMembers = members.filter(
    (m) => !onlineUserIds.has(m.user.id) && !(m.user.isOnline && !onlineUserIds.size)
  );

  const simulateNetworkCut = () => {
    if (!socket) return;
    if (isConnected) {
      socket.disconnect();
    } else {
      socket.connect();
    }
  };

  return (
    <div className="w-56 h-full bg-crew-sidebar border-l border-crew-border/60 flex flex-col select-none">
      {/* Header */}
      <div className="h-14 px-4 border-b border-crew-border/60 flex items-center justify-between bg-crew-sidebar/90 backdrop-blur-md">
        <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center space-x-1.5">
          <Radio className="w-3.5 h-3.5 text-crew-accent" />
          <span>Crew Frequency</span>
        </span>
        <span className="text-[11px] font-mono text-neutral-400">
          {onlineMembers.length}/{members.length}
        </span>
      </div>

      {/* Network Resilience Test Button */}
      <div className="p-3 border-b border-crew-border/40 bg-crew-panel/40">
        <button
          onClick={simulateNetworkCut}
          className={`w-full py-1.5 px-2.5 rounded-xl text-[11px] font-semibold border flex items-center justify-center space-x-1.5 transition-all shadow-sm ${
            isConnected
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30 animate-pulse'
          }`}
          title="Simulate network disconnect and test automatic reconnect / resync"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>{isConnected ? 'Simulate Network Drop' : 'Restore Connection'}</span>
        </button>
      </div>

      {/* Members Scroll List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 no-scrollbar">
        {/* Online Section */}
        <div>
          <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>Online — {onlineMembers.length}</span>
          </div>

          <div className="space-y-1">
            {onlineMembers.map((m) => (
              <div
                key={m.id}
                className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-crew-surface/60 transition-colors"
              >
                <div className="relative shrink-0">
                  {m.user.avatarUrl ? (
                    <img
                      src={m.user.avatarUrl}
                      alt={m.user.username}
                      className="w-8 h-8 rounded-full object-cover border border-crew-border"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-crew-accent flex items-center justify-center font-bold text-xs text-white">
                      {m.user.username.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-crew-sidebar shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                </div>

                <div className="truncate flex-1 min-w-0">
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-semibold text-white truncate">
                      {m.user.displayName || m.user.username}
                    </span>
                    {m.role === 'OWNER' && (
                      <span title="Crew Owner" className="shrink-0">
                        <Shield className="w-3 h-3 text-amber-400" />
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-neutral-400 truncate">
                    {m.user.statusMessage || `@${m.user.username}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Offline Section */}
        {offlineMembers.length > 0 && (
          <div>
            <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-neutral-600 inline-block" />
              <span>Offline — {offlineMembers.length}</span>
            </div>

            <div className="space-y-1 opacity-70">
              {offlineMembers.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-crew-surface/40 transition-colors"
                >
                  <div className="relative shrink-0">
                    {m.user.avatarUrl ? (
                      <img
                        src={m.user.avatarUrl}
                        alt={m.user.username}
                        className="w-8 h-8 rounded-full object-cover border border-crew-border/60"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center font-bold text-xs text-neutral-400">
                        {m.user.username.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-neutral-600 border-2 border-crew-sidebar" />
                  </div>

                  <div className="truncate flex-1 min-w-0">
                    <div className="flex items-center space-x-1">
                      <span className="text-xs font-medium text-neutral-400 truncate">
                        {m.user.displayName || m.user.username}
                      </span>
                    </div>
                    <div className="text-[10px] text-neutral-500 truncate">
                      offline
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
