'use client';

import { CheckCircle2, ShieldCheck, Compass } from 'lucide-react';
import { IntelligenceCard, ExecutionStatusData } from '../../types';

export function ExecutionStatusCard({ card }: { card: IntelligenceCard }) {
  const data = card.data as ExecutionStatusData;

  return (
    <div className="bg-intel-card border border-intel-border hover:border-intel-accent/40 rounded-2xl p-5 shadow-xl transition-all duration-200 relative overflow-hidden group">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-intel-accent via-cyan-500 to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-intel-accent/10 border border-intel-accent/30 flex items-center justify-center text-intel-accent">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-intel-text tracking-wide">
              {card.title || 'Mission Execution Telemetry'}
            </h3>
            <span className="text-[10px] text-intel-muted">
              Current Phase: <span className="font-semibold text-intel-cyan">{data.phase}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-intel-panel border border-intel-border text-xs font-mono text-intel-text">
          <CheckCircle2 className="w-3.5 h-3.5 text-intel-cyan" />
          <span className="font-bold">{data.progressPercentage}%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-intel-panel rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-intel-cyan to-intel-accent transition-all duration-500 rounded-full"
          style={{ width: `${data.progressPercentage}%` }}
        />
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-intel-panel/60 border border-intel-border/60">
          <div className="text-[10px] text-intel-muted font-mono uppercase tracking-wider mb-1">
            Current Tactical Checkpoint
          </div>
          <div className="font-semibold text-intel-text">{data.currentCheckpoint}</div>
        </div>

        <div className="p-3 rounded-xl bg-intel-panel/60 border border-intel-border/60">
          <div className="text-[10px] text-intel-muted font-mono uppercase tracking-wider mb-1">
            Authorization & Time
          </div>
          <div className="font-semibold text-intel-text">
            {data.authorizedBy} • <span className="text-intel-cyan">{data.estimatedCompletion}</span>
          </div>
        </div>
      </div>

      {/* Verification Seal */}
      <div className="mt-3 pt-3 border-t border-intel-border/60 flex items-center justify-between text-[11px] font-mono text-intel-muted">
        <span className="flex items-center space-x-1 text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Cryptographic Seal Verified</span>
        </span>
        <span className="text-intel-cyan">{data.verificationCode}</span>
      </div>
    </div>
  );
}
