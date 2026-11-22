'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, Shield, Truck, Terminal } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  const [selectedTier, setSelectedTier] = useState<'paperboy' | 'safehouse' | 'digital'>('safehouse');
  const [address, setAddress] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/80 backdrop-blur-sm select-none">
      <div className="bg-paper-100 border-4 border-ink-900 max-w-lg w-full p-6 sm:p-8 shadow-newsprint-lg relative text-ink-900">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-paper-300 rounded border border-ink-900 text-ink-900"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="border-b-2 border-ink-900 pb-3 mb-6">
          <div className="font-mono text-xs uppercase text-crime-red font-bold tracking-widest">
            CIRCULATION & DISPATCH DESK
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-black uppercase tracking-tight">
            Dispatch Delivery To Your Safehouse
          </h2>
          <p className="text-xs font-serif text-ink-600 mt-1">
            Fresh morning newsprint tossed over your front gate before the sunrise smog sets in.
          </p>
        </div>

        {isSubmitted ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3 animate-bounce" />
            <h3 className="text-xl font-serif font-bold uppercase mb-1">Dispatch Route Confirmed</h3>
            <p className="text-xs font-serif text-ink-600">
              Delivery route #{Math.floor(1000 + Math.random() * 9000)} registered to "{address}". First broadsheet arrives at 04:30 AM tomorrow.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Tier Selector */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedTier('paperboy')}
                className={`p-3 border-2 text-left rounded transition-all ${
                  selectedTier === 'paperboy'
                    ? 'border-crime-red bg-paper-200 shadow-sm'
                    : 'border-ink-900/40 hover:bg-paper-200'
                }`}
              >
                <Truck className="w-4 h-4 text-crime-red mb-1" />
                <div className="text-xs font-bold uppercase">Lawn Toss</div>
                <div className="text-[10px] font-mono text-ink-600">$12 / MO</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTier('safehouse')}
                className={`p-3 border-2 text-left rounded transition-all ${
                  selectedTier === 'safehouse'
                    ? 'border-crime-red bg-paper-200 shadow-sm'
                    : 'border-ink-900/40 hover:bg-paper-200'
                }`}
              >
                <Shield className="w-4 h-4 text-accent-gold mb-1" />
                <div className="text-xs font-bold uppercase">Safehouse Guard</div>
                <div className="text-[10px] font-mono text-ink-600">$28 / MO</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTier('digital')}
                className={`p-3 border-2 text-left rounded transition-all ${
                  selectedTier === 'digital'
                    ? 'border-crime-red bg-paper-200 shadow-sm'
                    : 'border-ink-900/40 hover:bg-paper-200'
                }`}
              >
                <Terminal className="w-4 h-4 text-ink-900 mb-1" />
                <div className="text-xs font-bold uppercase">Teletype Wire</div>
                <div className="text-[10px] font-mono text-ink-600">$45 / MO</div>
              </button>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase font-bold text-ink-800 mb-1">
                Drop Address / Penthouse / Safehouse Sector
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 3604 Whispymound Dr, Vinewood Hills"
                className="w-full bg-paper-50 border-2 border-ink-900 px-3 py-2 text-sm font-mono text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-crime-red"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-crime-red text-white py-2.5 font-mono text-xs uppercase tracking-widest font-black rounded shadow-newsprint hover:bg-crime-darkRed transition-colors"
            >
              Confirm Subscription Route
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
