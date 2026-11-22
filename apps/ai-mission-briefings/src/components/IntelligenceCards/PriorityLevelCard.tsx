'use client';

import { Flame, ShieldCheck, Zap } from 'lucide-react';
import { IntelligenceCard, PriorityData, PriorityLevel } from '../../types';

export function PriorityLevelCard({ card }: { card: IntelligenceCard }) {
  const data = card.data as PriorityData;

  const getPriorityStyle = (level: PriorityLevel) => {
    if (level.includes('P1')) {
      return {
        bg: 'from-rose-600/30 via-rose-950/20 to-transparent',
        border: 'border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.2)]',
        badge: 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse',
        accentText: 'text-rose-400',
      };
    }
    if (level.includes('P2')) {
      return {
        bg: 'from-amber-600/30 via-amber-950/20 to-transparent',
        border: 'border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.2)]',
        badge: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
        accentText: 'text-amber-400',
      };
    }
    return {
      bg: 'from-cyan-600/30 via-cyan-950/20 to-transparent',
      border: 'border-cyan-500/50',
      badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50',
      accentText: 'text-cyan-400',
    };
  };

  const style = getPriorityStyle(data.level);

  return (
    <div
      className={`bg-intel-card border ${style.border} rounded-2xl p-5 shadow-xl transition-all relative overflow-hidden`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${style.bg} pointer-events-none`} />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Priority Badge & Level */}
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-intel-panel border border-intel-border flex items-center justify-center text-rose-400 shadow-md">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-xs font-mono font-black uppercase px-2.5 py-0.5 rounded-full border ${style.badge}`}>
                {data.level}
              </span>
              <span className="text-[10px] font-mono text-intel-muted">OPERATIONAL PRIORITY</span>
            </div>
            <p className="text-xs text-intel-text mt-1 font-medium">{data.reason}</p>
          </div>
        </div>

        {/* Tactical Response Seal */}
        <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-intel-border/60">
          <div className="text-[10px] font-mono text-intel-muted flex items-center space-x-1">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Timeframe:</span>
            <span className="text-intel-text font-bold">{data.responseTimeframe}</span>
          </div>
          <div className="text-[10px] font-mono text-intel-cyan flex items-center space-x-1 mt-1">
            <ShieldCheck className="w-3 h-3" />
            <span>Seal: {data.authorizationSeal}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
