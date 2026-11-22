'use client';

import { useState } from 'react';
import { X, User, LogOut, Check } from 'lucide-react';
import { UserProfile } from '../../types';

interface ProfileModalProps {
  isOpen: boolean;
  currentUser: UserProfile;
  onClose: () => void;
  onUpdated: (user: UserProfile) => void;
  onLogout: () => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&crop=faces',
];

export function ProfileModal({
  isOpen,
  currentUser,
  onClose,
  onUpdated,
  onLogout,
}: ProfileModalProps) {
  const [displayName, setDisplayName] = useState(currentUser.displayName || '');
  const [statusMessage, setStatusMessage] = useState(currentUser.statusMessage || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || PRESET_AVATARS[0]);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    const updated: UserProfile = {
      ...currentUser,
      displayName: displayName.trim() || null,
      statusMessage: statusMessage.trim() || null,
      avatarUrl,
    };
    onUpdated(updated);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-crew-panel border border-crew-border rounded-2xl shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-crew-hover"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-crew-accent/20 border border-crew-accent/40 flex items-center justify-center text-crew-accent">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Your Operator Profile</h2>
            <p className="text-xs text-neutral-400">Manage identity, presence status, and session</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Avatar selector */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-2 uppercase tracking-wider">
              Profile Avatar
            </label>
            <div className="flex items-center space-x-3">
              {PRESET_AVATARS.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setAvatarUrl(url)}
                  className={`w-11 h-11 rounded-full overflow-hidden border-2 transition-all ${
                    avatarUrl === url
                      ? 'border-crew-accent scale-105 shadow-[0_0_12px_rgba(99,102,241,0.6)]'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  {/* Avatar img */}
                  <img src={url} alt="Avatar" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5 uppercase tracking-wider">
              Username & Email
            </label>
            <div className="px-3.5 py-2.5 rounded-xl bg-crew-surface/60 border border-crew-border/60 text-xs text-neutral-400 flex justify-between items-center">
              <span>@{currentUser.username}</span>
              <span className="font-mono text-[11px] text-neutral-500">{currentUser.email}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5 uppercase tracking-wider">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Alex Rivera"
              className="w-full px-3.5 py-2.5 rounded-xl bg-crew-surface border border-crew-border text-white text-sm focus:outline-none focus:border-crew-accent transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5 uppercase tracking-wider">
              Status Message
            </label>
            <input
              type="text"
              value={statusMessage}
              onChange={(e) => setStatusMessage(e.target.value)}
              placeholder="e.g. Deploying socket cluster v2..."
              maxLength={60}
              className="w-full px-3.5 py-2 rounded-xl bg-crew-surface border border-crew-border text-white text-sm focus:outline-none focus:border-crew-accent transition-colors"
            />
          </div>

          <div className="pt-4 border-t border-crew-border/60 flex items-center justify-between">
            <button
              type="button"
              onClick={onLogout}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/30 flex items-center space-x-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-crew-accent hover:bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] flex items-center space-x-1.5 transition-all"
            >
              {isSaved ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
