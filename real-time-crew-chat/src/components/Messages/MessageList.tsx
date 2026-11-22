'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Hash,
  Search,
  Users,
  Edit2,
  Trash2,
  CornerDownRight,
  Check,
  Clock,
  AlertCircle,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { ChannelSummary, MessageItem, UserProfile } from '../../types';
import { useSocket } from '../../hooks/useSocket';

interface MessageListProps {
  channel: ChannelSummary;
  messages: MessageItem[];
  currentUser: UserProfile;
  showPresence: boolean;
  onTogglePresence: () => void;
  onReplyTo: (message: MessageItem) => void;
}

const QUICK_EMOJIS = ['👍', '🔥', '❤️', '🚀', '👀'];

export function MessageList({
  channel,
  messages,
  currentUser,
  showPresence,
  onTogglePresence,
  onReplyTo,
}: MessageListProps) {
  const { isConnected, isReconnecting, toggleReaction, editMessage, deleteMessage } = useSocket();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  const filteredMessages = messages.filter((m) =>
    searchQuery
      ? m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.sender.username.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  const startEdit = (msg: MessageItem) => {
    setEditingId(msg.id);
    setEditContent(msg.content);
  };

  const saveEdit = (messageId: string) => {
    if (editContent.trim()) {
      editMessage(messageId, editContent.trim());
    }
    setEditingId(null);
  };

  const formatTimestamp = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-crew-bg overflow-hidden relative">
      {/* Channel Header */}
      <div className="h-14 px-4 border-b border-crew-border/60 flex items-center justify-between bg-crew-bg/90 backdrop-blur-md z-10 shrink-0">
        <div className="flex items-center space-x-2.5 truncate">
          <Hash className="w-5 h-5 text-crew-accent shrink-0" />
          <span className="text-sm font-bold text-white truncate">{channel.name}</span>
          {channel.topic && (
            <>
              <div className="w-[1px] h-4 bg-crew-border mx-1" />
              <span className="text-xs text-neutral-400 truncate">{channel.topic}</span>
            </>
          )}
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          {/* Real-time Status Badge */}
          <div
            className={`flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono border ${
              isConnected
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : isReconnecting
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}
          >
            {isConnected ? (
              <>
                <Wifi className="w-3 h-3" />
                <span>LIVE</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3" />
                <span>OFFLINE</span>
              </>
            )}
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search channel..."
              className="pl-8 pr-3 py-1 rounded-lg bg-crew-surface border border-crew-border text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-crew-accent w-36 focus:w-48 transition-all"
            />
          </div>

          {/* Presence List Toggle */}
          <button
            onClick={onTogglePresence}
            className={`p-1.5 rounded-lg border transition-colors ${
              showPresence
                ? 'bg-crew-surface border-crew-accent/40 text-crew-accent'
                : 'border-transparent text-neutral-400 hover:text-white hover:bg-crew-hover'
            }`}
            title="Toggle Members List"
          >
            <Users className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-14 h-14 rounded-2xl bg-crew-surface/60 border border-crew-border flex items-center justify-center text-crew-accent mb-3">
              <Hash className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              Welcome to #{channel.name}!
            </h3>
            <p className="text-xs text-neutral-400 max-w-sm">
              This is the beginning of the #{channel.name} channel. Start the conversation with your crew.
            </p>
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const isSelf = msg.sender.id === currentUser.id;
            const isEditing = editingId === msg.id;

            return (
              <div
                key={msg.id}
                className="group relative flex items-start space-x-3 px-2 py-1.5 -mx-2 rounded-xl hover:bg-crew-surface/40 transition-colors"
              >
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full overflow-hidden bg-crew-panel border border-crew-border/60 shrink-0 mt-0.5">
                  {msg.sender.avatarUrl ? (
                    <img
                      src={msg.sender.avatarUrl}
                      alt={msg.sender.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-crew-accent flex items-center justify-center text-xs font-bold text-white">
                      {msg.sender.username.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Content Column */}
                <div className="flex-1 min-w-0">
                  {/* Reply Banner */}
                  {msg.replyTo && (
                    <div className="flex items-center space-x-1.5 text-[11px] text-neutral-400 mb-1">
                      <CornerDownRight className="w-3 h-3 text-neutral-500" />
                      <span className="font-semibold text-neutral-300">
                        @{msg.replyTo.sender.username}
                      </span>
                      <span className="truncate italic max-w-xs">{msg.replyTo.content}</span>
                    </div>
                  )}

                  {/* Header: Author + Timestamp + Status */}
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white">
                      {msg.sender.displayName || msg.sender.username}
                    </span>
                    <span className="text-[10px] text-neutral-500">
                      {formatTimestamp(msg.createdAt)}
                    </span>
                    {msg.isEdited && (
                      <span className="text-[10px] text-neutral-500 italic">(edited)</span>
                    )}

                    {/* Delivery Status */}
                    {msg.status === 'sending' && (
                      <span title="Sending...">
                        <Clock className="w-3 h-3 text-amber-400 animate-pulse" />
                      </span>
                    )}
                    {msg.status === 'sent' && (
                      <span title="Delivered">
                        <Check className="w-3 h-3 text-emerald-400/80" />
                      </span>
                    )}
                    {msg.status === 'error' && (
                      <span title="Failed to deliver">
                        <AlertCircle className="w-3 h-3 text-rose-400" />
                      </span>
                    )}
                  </div>

                  {/* Body / Edit Mode */}
                  {isEditing ? (
                    <div className="mt-1 flex items-center space-x-2">
                      <input
                        type="text"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit(msg.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        autoFocus
                        className="flex-1 px-2.5 py-1 text-xs rounded-lg bg-crew-surface border border-crew-accent text-white focus:outline-none"
                      />
                      <button
                        onClick={() => saveEdit(msg.id)}
                        className="px-2.5 py-1 text-xs font-semibold bg-crew-accent text-white rounded-lg hover:bg-indigo-600 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-2 py-1 text-xs text-neutral-400 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`text-xs mt-0.5 leading-relaxed break-words ${
                        msg.isDeleted ? 'italic text-neutral-500' : 'text-neutral-200'
                      }`}
                    >
                      {msg.content}
                    </div>
                  )}

                  {/* Reactions Chips */}
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {msg.reactions.map((r) => {
                        const hasReacted = r.users.some((u) => u.id === currentUser.id);
                        return (
                          <button
                            key={r.emoji}
                            onClick={() => toggleReaction(msg.id, r.emoji)}
                            className={`flex items-center space-x-1 px-2 py-0.5 rounded-lg text-xs border transition-all ${
                              hasReacted
                                ? 'bg-crew-accent/20 border-crew-accent text-crew-accent shadow-[0_0_8px_rgba(99,102,241,0.3)]'
                                : 'bg-crew-surface border-crew-border text-neutral-300 hover:bg-crew-hover'
                            }`}
                          >
                            <span>{r.emoji}</span>
                            <span className="text-[10px] font-mono font-bold">{r.count}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Hover Action Toolbar */}
                <div className="absolute right-3 -top-3.5 opacity-0 group-hover:opacity-100 transition-opacity bg-crew-panel border border-crew-border rounded-xl shadow-lg flex items-center p-1 space-x-1 z-20">
                  {QUICK_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => toggleReaction(msg.id, emoji)}
                      className="p-1 hover:bg-crew-hover rounded text-xs transition-transform hover:scale-125"
                      title={`React ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}

                  <div className="w-[1px] h-3 bg-crew-border mx-0.5" />

                  <button
                    onClick={() => onReplyTo(msg)}
                    className="p-1 text-neutral-400 hover:text-white hover:bg-crew-hover rounded transition-colors"
                    title="Reply"
                  >
                    <CornerDownRight className="w-3.5 h-3.5" />
                  </button>

                  {isSelf && !msg.isDeleted && (
                    <>
                      <button
                        onClick={() => startEdit(msg)}
                        className="p-1 text-neutral-400 hover:text-white hover:bg-crew-hover rounded transition-colors"
                        title="Edit message"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteMessage(msg.id)}
                        className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded transition-colors"
                        title="Delete message"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
