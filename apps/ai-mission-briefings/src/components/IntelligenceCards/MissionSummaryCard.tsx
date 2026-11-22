'use client';

import { Shield, MapPin, User, Clock, AlertTriangle } from 'lucide-react';
import { IntelligenceCard, MissionSummaryData } from '../../types';

export function MissionSummaryCard({ card }: { card: IntelligenceCard }) {
  const data = card.data as MissionSummaryData;

  const getClassificationColor = (classification: string) => {
    if (classification.includes('TOP SECRET')) return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    if (classification.includes('SECRET')) return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
  };

  return (
    <div className="bg-intel-card border border-intel-border hover:border-intel-cyan/40 rounded-2xl p-5 shadow-xl transition-all duration-200 relative overflow-hidden group">
      {/* Top Banner Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-intel-cyan via-intel-accent to-transparent" />

      {/* Header */}
      <div className="flex items-start justify-between mb-4 gap-2">
        <div>
          <div className="flex items-center space-x-2 mb-1.5 flex-wrap gap-y-1">
            <span
              className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border ${getClassificationColor(
                data.classification
              )}`}
            >
              {data.classification}
            </span>
            <span className="text-[10px] font-mono text-intel-muted flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{new Date(data.timestamp).toLocaleTimeString()}</span>
            </span>
          </div>
          <h3 className="text-base font-bold text-intel-text tracking-wide group-hover:text-intel-cyan transition-colors">
            {data.title}
          </h3>
        </div>

        <div className="w-8 h-8 rounded-xl bg-intel-cyan/10 border border-intel-cyan/30 flex items-center justify-center text-intel-cyan shrink-0">
          <Shield className="w-4 h-4" />
        </div>
      </div>

      {/* Objective */}
      <div className="mb-4 p-3 rounded-xl bg-intel-panel/60 border border-intel-border/60">
        <div className="text-[10px] font-bold text-intel-cyan uppercase tracking-wider mb-1">
          Direct Tactical Objective
        </div>
        <p className="text-xs text-intel-text leading-relaxed font-medium">{data.objective}</p>
      </div>

      {/* Overview */}
      <p className="text-xs text-intel-muted leading-relaxed mb-4">{data.overview}</p>

      {/* Metadata Badges Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-3 border-t border-intel-border/60 text-[11px]">
        <div className="flex items-center space-x-1.5 text-intel-muted truncate">
          <MapPin className="w-3.5 h-3.5 text-intel-cyan shrink-0" />
          <span className="truncate">{data.sector}</span>
        </div>
        <div className="flex items-center space-x-1.5 text-intel-muted truncate">
          <User className="w-3.5 h-3.5 text-intel-accent shrink-0" />
          <span className="truncate">{data.commander}</span>
        </div>
        <div className="flex items-center space-x-1.5 text-intel-muted truncate">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate">{data.threatAssessment}</span>
        </div>
      </div>
    </div>
  );
}
