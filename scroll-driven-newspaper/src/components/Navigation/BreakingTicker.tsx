'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BREAKING_NEWS } from '../../data/breakingNews';
import { Radio, Pause, Play, ChevronRight } from 'lucide-react';

export const BreakingTicker: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BREAKING_NEWS.length);
    }, 5500);

    return () => clearInterval(interval);
  }, [isPaused]);

  const currentItem = BREAKING_NEWS[currentIndex];

  return (
    <div className="w-full bg-crime-darkRed text-paper-50 border-b border-ink-900 text-xs font-mono select-none">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between space-x-3">
        {/* Urgent Label */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <span className="inline-flex items-center justify-center p-1 bg-white text-crime-red rounded-sm animate-pulse">
            <Radio className="w-3.5 h-3.5" />
          </span>
          <span className="font-black tracking-widest text-[11px] bg-white text-crime-darkRed px-1.5 py-0.5 rounded font-sans uppercase">
            {currentItem.urgency}
          </span>
          <span className="hidden sm:inline text-white/70 text-[10px]">
            [{currentItem.timestamp}]
          </span>
        </div>

        {/* Rolling Story Headline */}
        <div className="flex-1 truncate">
          {currentItem.slug ? (
            <Link
              href={`/articles/${currentItem.slug}`}
              className="hover:underline flex items-center space-x-2 font-medium tracking-wide text-white group"
            >
              <span className="text-accent-gold font-bold text-[10px] hidden md:inline">
                [{currentItem.location}]
              </span>
              <span className="truncate">{currentItem.title}</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </Link>
          ) : (
            <div className="flex items-center space-x-2 font-medium tracking-wide text-white">
              <span className="text-accent-gold font-bold text-[10px] hidden md:inline">
                [{currentItem.location}]
              </span>
              <span className="truncate">{currentItem.title}</span>
            </div>
          )}
        </div>

        {/* Ticker Controls */}
        <div className="flex items-center space-x-1.5 flex-shrink-0">
          <button
            onClick={() => setIsPaused((prev) => !prev)}
            className="p-1 hover:bg-white/10 rounded transition-colors text-white/80 hover:text-white"
            title={isPaused ? 'Resume ticker' : 'Pause ticker'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
          <span className="text-[10px] text-white/60 font-mono hidden sm:inline">
            {currentIndex + 1}/{BREAKING_NEWS.length}
          </span>
        </div>
      </div>
    </div>
  );
};
