'use client';

import { useState, useRef } from 'react';
import { Send, Smile, Paperclip, X, WifiOff } from 'lucide-react';
import { MessageItem } from '../../types';
import { useSocket } from '../../hooks/useSocket';

interface MessageInputProps {
  channelId: string;
  replyTo: MessageItem | null;
  onClearReply: () => void;
}

const COMMON_EMOJIS = ['👍', '❤️', '🔥', '🚀', '🎉', '👀', '💯', '⚡', '✨', '🙌', '🤝', '✅'];

export function MessageInput({ channelId, replyTo, onClearReply }: MessageInputProps) {
  const { isConnected, sendMessage, sendTyping, channelTypers } = useSocket();
  const [content, setContent] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const typers = channelTypers[channelId] || [];

  // Notify server of typing state
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);

    // Emit typing:start
    sendTyping(channelId, true);

    // Debounce typing:stop after 2.5s of inactivity
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      sendTyping(channelId, false);
    }, 2500);
  };

  const handleSend = async () => {
    const trimmed = content.trim();
    if (!trimmed) return;

    // Clear typing indicator immediately
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    sendTyping(channelId, false);

    setContent('');
    const replyId = replyTo ? replyTo.id : null;
    onClearReply();

    try {
      await sendMessage(channelId, trimmed, replyId);
    } catch {
      // Optimistic update handled it; errors will flag on the message item
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const insertEmoji = (emoji: string) => {
    setContent((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="p-4 bg-crew-bg border-t border-crew-border/60 relative">
      {/* Typing Indicators Banner */}
      {typers.length > 0 && (
        <div className="absolute -top-6 left-4 text-[11px] text-crew-accent flex items-center space-x-1 animate-pulse">
          <div className="flex space-x-1 mr-1">
            <span className="w-1.5 h-1.5 rounded-full bg-crew-accent animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-crew-accent animate-bounce [animation-delay:0.2s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-crew-accent animate-bounce [animation-delay:0.4s]" />
          </div>
          <span>
            {typers.length === 1
              ? `${typers[0]} is typing...`
              : typers.length === 2
              ? `${typers[0]} and ${typers[1]} are typing...`
              : `${typers.length} members are typing...`}
          </span>
        </div>
      )}

      {/* Disconnected / Offline Banner */}
      {!isConnected && (
        <div className="mb-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center space-x-2">
          <WifiOff className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>
            Offline mode active. Messages will queue and auto-deliver when socket reconnects.
          </span>
        </div>
      )}

      {/* Replying-to Preview Bar */}
      {replyTo && (
        <div className="mb-2 px-3 py-1.5 rounded-xl bg-crew-surface/80 border border-crew-border flex items-center justify-between text-xs text-neutral-300">
          <div className="flex items-center space-x-2 truncate">
            <span className="font-semibold text-crew-accent">
              Replying to @{replyTo.sender.username}:
            </span>
            <span className="truncate italic text-neutral-400">{replyTo.content}</span>
          </div>
          <button
            onClick={onClearReply}
            className="text-neutral-400 hover:text-white p-0.5 rounded hover:bg-crew-hover"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Message Input Box */}
      <div className="relative flex items-center bg-crew-surface rounded-2xl border border-crew-border focus-within:border-crew-accent focus-within:ring-1 focus-within:ring-crew-accent/50 transition-all shadow-md">
        {/* Attachment Mock Button */}
        <button
          type="button"
          onClick={() => {
            setContent((prev) => prev + ' 📎 [telemetry-report.log]');
          }}
          className="p-3 text-neutral-400 hover:text-white transition-colors"
          title="Attach telemetry / file"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={content}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Message #channel... (Enter to send)"
          className="flex-1 bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-none py-3 px-1"
        />

        {/* Emoji Trigger */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-3 text-neutral-400 hover:text-white transition-colors"
            title="Emoji reactions"
          >
            <Smile className="w-4 h-4" />
          </button>

          {showEmojiPicker && (
            <div className="absolute right-0 bottom-12 bg-crew-panel border border-crew-border rounded-xl shadow-2xl p-2 grid grid-cols-4 gap-1 z-30 animate-in fade-in zoom-in-95">
              {COMMON_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => insertEmoji(emoji)}
                  className="w-8 h-8 rounded-lg hover:bg-crew-hover flex items-center justify-center text-base hover:scale-125 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={!content.trim()}
          className="mr-2 p-2 rounded-xl bg-crew-accent hover:bg-indigo-600 disabled:opacity-40 disabled:hover:bg-crew-accent text-white transition-all shadow-sm"
          title="Send"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
