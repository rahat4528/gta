'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Bell, Eye, EyeOff, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenSubscribe: () => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenSubscribe,
  reducedMotion,
  onToggleReducedMotion,
}) => {
  return (
    <header className="w-full bg-paper-100 border-b-4 border-ink-900 select-none text-ink-900">
      {/* Top Meta Bar */}
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-wrap items-center justify-between text-xs font-serif border-b border-ink-900/30 tracking-tight">
        <div className="flex items-center space-x-4">
          <span className="font-bold uppercase tracking-wider">Monday, November 23, 2026</span>
          <span className="hidden sm:inline text-ink-600">|</span>
          <span className="hidden sm:inline">Downtown 84°F • Smog Alert</span>
          <span className="hidden md:inline text-ink-600">|</span>
          <span className="hidden md:inline italic">"The Truth at 120 MPH"</span>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <button
            onClick={onToggleReducedMotion}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded border transition-colors ${
              reducedMotion
                ? 'bg-ink-900 text-paper-50 border-ink-900'
                : 'bg-paper-200 text-ink-800 border-ink-800/40 hover:bg-paper-300'
            }`}
            title="Toggle Reduced Motion mode for gentle static layout"
          >
            {reducedMotion ? <EyeOff className="w-3 h-3 text-accent-gold" /> : <Eye className="w-3 h-3" />}
            <span className="font-mono text-[10px] uppercase font-bold">
              {reducedMotion ? 'Motion: OFF' : 'Motion: ON'}
            </span>
          </button>

          <button
            onClick={onOpenSearch}
            className="flex items-center space-x-1 hover:text-crime-red transition-colors px-1.5 py-0.5 border border-dashed border-ink-700/50 rounded"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-mono text-[10px] uppercase">Search</span>
            <kbd className="hidden lg:inline bg-paper-300 text-[9px] px-1 rounded font-mono">⌘K</kbd>
          </button>

          <button
            onClick={onOpenSubscribe}
            className="flex items-center space-x-1 bg-crime-red text-white font-bold px-2.5 py-0.5 rounded shadow-sm hover:bg-crime-darkRed transition-colors uppercase text-[10px] tracking-wider"
          >
            <Bell className="w-3 h-3" />
            <span>Delivery</span>
          </button>
        </div>
      </div>

      {/* Main Masthead Banner */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 text-center relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden lg:block text-left text-[11px] font-mono leading-tight text-ink-600 max-w-[140px] border-l-2 border-ink-900 pl-2">
          <div className="font-bold text-ink-900">VOL. CLXXXVI</div>
          <div>NO. 42,910</div>
          <div>FINAL EDITION</div>
          <div className="text-crime-red font-bold">$1.50 LS / $2.00 LC</div>
        </div>

        <Link href="/" className="inline-block group">
          <div className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-ink-700 font-mono mb-1">
            Incorporating the Daily Weazel & South Seas Gazette
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-black tracking-tight text-ink-900 uppercase transform transition-transform group-hover:scale-[1.005]">
            The Los Santos Chronicle
          </h1>
          <div className="flex items-center justify-center space-x-3 text-xs sm:text-sm font-serif italic text-ink-700 mt-1">
            <span className="h-px w-12 bg-ink-900/40 inline-block"></span>
            <span>SAN ANDREAS’ PREMIER INDEPENDENT NEWSPAPER OF RECORD</span>
            <span className="h-px w-12 bg-ink-900/40 inline-block"></span>
          </div>
        </Link>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:block text-right text-[11px] font-mono leading-tight text-ink-600 max-w-[140px] border-r-2 border-ink-900 pr-2">
          <div className="font-bold text-crime-red flex items-center justify-end space-x-1">
            <Sparkles className="w-3 h-3" />
            <span>WIRE DESK</span>
          </div>
          <div>TELETYPE ACTIVE</div>
          <div>ENCRYPTED SSL</div>
          <div className="text-ink-900 font-bold">24-HR DISPATCH</div>
        </div>
      </div>
    </header>
  );
};
