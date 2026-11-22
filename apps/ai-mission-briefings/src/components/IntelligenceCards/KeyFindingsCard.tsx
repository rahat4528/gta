'use client';

import { CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';
import { IntelligenceCard, KeyFindingsData } from '../../types';

export function KeyFindingsCard({ card }: { card: IntelligenceCard }) {
  const data = card.data as KeyFindingsData;

  const getConfidenceBadge = (confidence: 'HIGH' | 'MEDIUM' | 'LOW') => {
    switch (confidence) {
      case 'HIGH':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'MEDIUM':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'LOW':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    }
  };

  return (
    <div className="bg-intel-card border border-intel-border hover:border-intel-accent/40 rounded-2xl p-5 shadow-xl transition-all duration-200 relative overflow-hidden group">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-intel-accent via-indigo-500 to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-intel-accent/10 border border-intel-accent/30 flex items-center justify-center text-intel-accent">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-intel-text tracking-wide">
              {card.title || 'Key Intelligence Findings'}
            </h3>
            <span className="text-[10px] text-intel-muted">
              {data.findings.length} Verified Observations
            </span>
          </div>
        </div>

        {/* Confidence Gauge */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-intel-panel border border-intel-border text-xs font-mono">
          <TrendingUp className="w-3.5 h-3.5 text-intel-accent" />
          <span className="text-intel-text font-bold">{data.overallConfidence}%</span>
          <span className="text-intel-muted text-[10px]">Confidence</span>
        </div>
      </div>

      {/* Summary statement */}
      {data.summaryStatement && (
        <p className="text-xs text-intel-muted mb-4 italic px-3 py-2 rounded-xl bg-intel-panel/40 border border-intel-border/40">
          &ldquo;{data.summaryStatement}&rdquo;
        </p>
      )}

      {/* Findings List */}
      <div className="space-y-3">
        {data.findings.map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-xl bg-intel-panel/60 border border-intel-border/60 hover:border-intel-accent/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-intel-accent shrink-0" />
                <span className="text-xs font-bold text-intel-text">{item.title}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-intel-card border border-intel-border text-intel-muted uppercase">
                  {item.category}
                </span>
                <span
                  className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${getConfidenceBadge(
                    item.confidence
                  )}`}
                >
                  {item.confidence}
                </span>
              </div>
            </div>

            <p className="text-xs text-intel-muted leading-relaxed pl-6">{item.description}</p>

            {item.impact && (
              <div className="mt-2 pl-6 text-[11px] text-amber-300/90 font-mono">
                <span className="text-intel-muted font-normal mr-1">Impact:</span>
                {item.impact}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
