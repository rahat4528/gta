'use client';

import { useState } from 'react';
import { X, Hash, Volume2, Plus } from 'lucide-react';
import { ChannelType } from '../../types';

interface CreateChannelModalProps {
  isOpen: boolean;
  crewId: string;
  onClose: () => void;
  onCreated: (channelId: string) => void;
}

export function CreateChannelModal({
  isOpen,
  crewId,
  onClose,
  onCreated,
}: CreateChannelModalProps) {
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [type, setType] = useState<ChannelType>('TEXT');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    setError(null);

    // Format channel name as slug-like (e.g. dev-ops)
    const formattedName = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9_-]/g, '');

    try {
      const res = await fetch(`/api/crews/${crewId}/channels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formattedName, topic: topic.trim(), type }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create channel');
      }

      onCreated(data.id);
      onClose();
      setName('');
      setTopic('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
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

        <div className="flex items-center space-x-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-crew-accent/20 border border-crew-accent/40 flex items-center justify-center text-crew-accent">
            <Hash className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Create Channel</h2>
            <p className="text-xs text-neutral-400">Add a workspace or mission room for discussion</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-2 uppercase tracking-wider">
              Channel Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('TEXT')}
                className={`p-3 rounded-xl border flex flex-col items-start transition-all ${
                  type === 'TEXT'
                    ? 'border-crew-accent bg-crew-accent/15 text-white'
                    : 'border-crew-border bg-crew-surface text-neutral-400 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <Hash className="w-4 h-4 text-crew-accent" />
                  <span className="text-xs font-semibold">Text Channel</span>
                </div>
                <span className="text-[11px] text-neutral-400 text-left">
                  Real-time messages, attachments, reactions
                </span>
              </button>

              <button
                type="button"
                onClick={() => setType('VOICE')}
                className={`p-3 rounded-xl border flex flex-col items-start transition-all ${
                  type === 'VOICE'
                    ? 'border-crew-accent bg-crew-accent/15 text-white'
                    : 'border-crew-border bg-crew-surface text-neutral-400 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold">Voice Channel</span>
                </div>
                <span className="text-[11px] text-neutral-400 text-left">
                  Low-latency voice status and frequency room
                </span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5 uppercase tracking-wider">
              Channel Name *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-neutral-400 text-sm font-semibold">#</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="incident-response"
                required
                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-crew-surface border border-crew-border text-white text-sm focus:outline-none focus:border-crew-accent transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5 uppercase tracking-wider">
              Topic (Optional)
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Primary coordination channel for emergencies"
              className="w-full px-3.5 py-2 rounded-xl bg-crew-surface border border-crew-border text-white text-sm focus:outline-none focus:border-crew-accent transition-colors"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-300 hover:text-white hover:bg-crew-hover transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-crew-accent hover:bg-indigo-600 disabled:opacity-50 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] flex items-center space-x-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Creating...' : 'Create Channel'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
