'use client';

import { AlertOctagon, ShieldAlert, ArrowRight } from 'lucide-react';
import { IntelligenceCard, RiskAssessmentData, RiskLevel } from '../../types';

export function RiskAssessmentCard({ card }: { card: IntelligenceCard }) {
  const data = card.data as RiskAssessmentData;

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case 'CRITICAL':
        return {
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse',
          border: 'border-rose-500/40 bg-rose-500/5',
          text: 'text-rose-400',
        };
      case 'HIGH':
        return {
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          border: 'border-amber-500/40 bg-amber-500/5',
          text: 'text-amber-400',
        };
      case 'MEDIUM':
        return {
          badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
          border: 'border-yellow-500/40 bg-yellow-500/5',
          text: 'text-yellow-400',
        };
      case 'LOW':
        return {
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          border: 'border-emerald-500/40 bg-emerald-500/5',
          text: 'text-emerald-400',
        };
    }
  };

  return (
    <div className="bg-intel-card border border-intel-border hover:border-intel-rose/40 rounded-2xl p-5 shadow-xl transition-all duration-200 relative overflow-hidden group">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-500 to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <AlertOctagon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-intel-text tracking-wide">
              {card.title || 'Threat & Risk Matrix'}
            </h3>
            <span className="text-[10px] text-intel-muted">
              Containment: <span className="font-mono text-amber-400 font-bold">{data.containmentStatus}</span>
            </span>
          </div>
        </div>

        {/* Composite Score Meter */}
        <div className="flex items-center space-x-2">
          <div className="text-right">
            <div className="text-[10px] text-intel-muted">Composite Risk</div>
            <div className="text-xs font-mono font-bold text-rose-400">
              {data.compositeRiskScore}/100
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center font-mono font-bold text-rose-300 text-sm">
            {data.compositeRiskScore}
          </div>
        </div>
      </div>

      {/* Risks List */}
      <div className="space-y-3">
        {data.risks.map((risk) => {
          const colors = getRiskColor(risk.level);
          return (
            <div
              key={risk.id}
              className={`p-3.5 rounded-xl border ${colors.border} transition-all`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center space-x-2">
                  <ShieldAlert className={`w-4 h-4 ${colors.text} shrink-0`} />
                  <span className="text-xs font-bold text-intel-text">{risk.threat}</span>
                </div>
                <div className="flex items-center space-x-1.5 shrink-0">
                  <span className="text-[10px] font-mono text-intel-muted">
                    {risk.probability}% Prob
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${colors.badge}`}>
                    {risk.level}
                  </span>
                </div>
              </div>

              {/* Mitigation Protocol */}
              <div className="text-xs text-intel-text bg-intel-panel/80 p-2.5 rounded-lg border border-intel-border/60 mb-2">
                <div className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider mb-0.5 flex items-center space-x-1">
                  <span>Mitigation Action</span>
                </div>
                {risk.mitigation}
              </div>

              {/* Escalation */}
              {risk.escalationProtocol && (
                <div className="flex items-center space-x-1.5 text-[11px] text-intel-muted">
                  <ArrowRight className="w-3 h-3 text-intel-cyan" />
                  <span>Escalation: {risk.escalationProtocol}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
