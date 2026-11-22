'use client';

import { useState } from 'react';
import {
  Hash,
  Volume2,
  Plus,
  Copy,
  Check,
  ChevronDown,
  Mic,
  MicOff,
  Settings,
  Shield,
} from 'lucide-react';
import { ChannelSummary, CrewSummary, UserProfile } from '../../types';

interface ChannelSidebarProps {
  activeCrew: CrewSummary | null;
  channels: ChannelSummary[];
  activeChannelId: string | null;
  currentUser: UserProfile;
  onSelectChannel: (channelId: string) => void;
  onCreateChannel: () => void;
  onOpenProfile: () => void;
}

export function ChannelSidebar({
  activeCrew,
  channels,
  activeChannelId,
  currentUser,
  onSelectChannel,
  onCreateChannel,
  onOpenProfile,
}: ChannelSidebarProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const textChannels = channels.filter((c) => c.type === 'TEXT');
  const voiceChannels = channels.filter((c) => c.type === 'VOICE');

  const copyInvite = () => {
    if (!activeCrew) return;
    navigator.clipboard.writeText(activeCrew.inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="w-60 h-full bg-crew-sidebar flex flex-col border-r border-crew-border/60 select-none">
      {/* Crew Header */}
      <div className="h-14 px-4 border-b border-crew-border/60 flex items-center justify-between bg-crew-sidebar/90 backdrop-blur-md">
        <div className="flex items-center space-x-2 truncate">
          <span className="text-sm font-bold text-white tracking-wide truncate">
            {activeCrew ? activeCrew.name : 'Crew Chat'}
          </span>
          {activeCrew?.role === 'OWNER' && (
            <span title="Crew Owner" className="shrink-0">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
            </span>
          )}
        </div>

        {activeCrew && (
          <button
            onClick={copyInvite}
            className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-crew-surface hover:bg-crew-hover text-[11px] text-neutral-300 border border-crew-border/80 transition-colors"
            title={`Copy Invite Code: ${activeCrew.inviteCode}`}
          >
            {copiedCode ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-neutral-400" />
                <span className="font-mono">{activeCrew.inviteCode}</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Channel Lists */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4 no-scrollbar">
        {/* Text Channels */}
        <div>
          <div className="flex items-center justify-between px-2 mb-1">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center space-x-1">
              <ChevronDown className="w-3 h-3" />
              <span>Text Channels</span>
            </span>
            <button
              onClick={onCreateChannel}
              className="text-neutral-400 hover:text-white p-0.5 rounded hover:bg-crew-hover transition-colors"
              title="Create Channel"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-0.5">
            {textChannels.map((channel) => {
              const isActive = channel.id === activeChannelId;
              return (
                <button
                  key={channel.id}
                  onClick={() => onSelectChannel(channel.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-crew-surface text-white border border-crew-accent/40 shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-crew-hover/70'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <Hash className={`w-4 h-4 shrink-0 ${isActive ? 'text-crew-accent' : 'text-neutral-500'}`} />
                    <span className="truncate">{channel.name}</span>
                  </div>
                  {channel.unreadCount && channel.unreadCount > 0 ? (
                    <span className="w-4 h-4 rounded-full bg-crew-accent text-white text-[10px] font-bold flex items-center justify-center">
                      {channel.unreadCount}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* Voice Channels */}
        {voiceChannels.length > 0 && (
          <div>
            <div className="flex items-center justify-between px-2 mb-1">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center space-x-1">
                <ChevronDown className="w-3 h-3" />
                <span>Voice Channels</span>
              </span>
            </div>

            <div className="space-y-0.5">
              {voiceChannels.map((channel) => {
                const isActive = channel.id === activeChannelId;
                return (
                  <button
                    key={channel.id}
                    onClick={() => onSelectChannel(channel.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-crew-surface text-emerald-400 border border-emerald-500/40 shadow-sm'
                        : 'text-neutral-400 hover:text-neutral-200 hover:bg-crew-hover/70'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <Volume2 className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-neutral-500'}`} />
                      <span className="truncate">{channel.name}</span>
                    </div>
                    <span className="text-[10px] text-emerald-400/80 font-mono">Live</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* User Footer */}
      <div className="h-14 px-3 bg-crew-panel/90 border-t border-crew-border/60 flex items-center justify-between">
        <button
          onClick={onOpenProfile}
          className="flex items-center space-x-2.5 truncate hover:opacity-85 text-left transition-opacity flex-1 min-w-0"
        >
          <div className="relative shrink-0">
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.username}
                className="w-8 h-8 rounded-full object-cover border border-crew-border"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-crew-accent flex items-center justify-center font-bold text-xs text-white">
                {currentUser.username.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-crew-panel" />
          </div>

          <div className="truncate">
            <div className="text-xs font-semibold text-white truncate leading-tight">
              {currentUser.displayName || currentUser.username}
            </div>
            <div className="text-[10px] text-neutral-400 truncate">
              {currentUser.statusMessage || `@${currentUser.username}`}
            </div>
          </div>
        </button>

        <div className="flex items-center space-x-1 shrink-0 ml-1">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-1.5 rounded-lg transition-colors ${
              isMuted
                ? 'text-rose-400 hover:bg-rose-500/10'
                : 'text-neutral-400 hover:text-white hover:bg-crew-hover'
            }`}
            title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
          >
            {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenProfile}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-crew-hover transition-colors"
            title="Profile & Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
