'use client';

import { useState } from 'react';
import { X, Users, Sparkles } from 'lucide-react';

interface CreateCrewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (crewId: string) => void;
}

const PRESET_ICONS = ['🚀', '⚡', '🛡️', '🛰️', '🔥', '🎮', '💡', '🤖'];

export function CreateCrewModal({ isOpen, onClose, onCreated }: CreateCrewModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [iconUrl, setIconUrl] = useState('🚀');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/crews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), description: description.trim(), iconUrl }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create crew');
      }

      onCreated(data.id);
      onClose();
      setName('');
      setDescription('');
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
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Create a Crew</h2>
            <p className="text-xs text-neutral-400">Assemble your team for mission-critical operations</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5 uppercase tracking-wider">
              Crew Icon
            </label>
            <div className="flex space-x-2">
              {PRESET_ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setIconUrl(icon)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg border transition-all ${
                    iconUrl === icon
                      ? 'border-crew-accent bg-crew-accent/20 shadow-[0_0_10px_rgba(99,102,241,0.4)]'
                      : 'border-crew-border bg-crew-surface hover:bg-crew-hover text-neutral-300'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5 uppercase tracking-wider">
              Crew Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Orbital Command"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-crew-surface border border-crew-border text-white text-sm focus:outline-none focus:border-crew-accent transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5 uppercase tracking-wider">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this crew is building or managing..."
              rows={3}
              className="w-full px-3.5 py-2 rounded-xl bg-crew-surface border border-crew-border text-white text-sm focus:outline-none focus:border-crew-accent transition-colors resize-none"
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
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Creating...' : 'Create Crew'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
