'use client';

import { useState } from 'react';
import { ListChecks, CheckSquare, Square, Clock, User } from 'lucide-react';
import { IntelligenceCard, RecommendedActionsData } from '../../types';

export function RecommendedActionsCard({ card }: { card: IntelligenceCard }) {
  const data = card.data as RecommendedActionsData;
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    data.actions.forEach((a) => {
      if (a.completed) initial[a.id] = true;
    });
    return initial;
  });

  const toggleComplete = (id: string) => {
    setCompletedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(completedMap).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / data.actions.length) * 100);

  return (
    <div className="bg-intel-card border border-intel-border hover:border-emerald-500/40 rounded-2xl p-5 shadow-xl transition-all duration-200 relative overflow-hidden group">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ListChecks className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-intel-text tracking-wide">
              {card.title || 'Tactical Action Directives'}
            </h3>
            <span className="text-[10px] text-intel-muted">
              {completedCount} of {data.actions.length} Completed ({progressPercent}%)
            </span>
          </div>
        </div>

        {/* Operational Window */}
        {data.operationalWindow && (
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-intel-panel border border-intel-border text-[11px] font-mono text-emerald-300">
            <Clock className="w-3.5 h-3.5" />
            <span>Window: {data.operationalWindow}</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-intel-panel rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Action Items List */}
      <div className="space-y-2.5">
        {data.actions.map((act) => {
          const isDone = Boolean(completedMap[act.id]);
          return (
            <div
              key={act.id}
              onClick={() => toggleComplete(act.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer select-none flex items-start space-x-3 ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/30 opacity-70'
                  : 'bg-intel-panel/60 border-intel-border/60 hover:border-emerald-500/40'
              }`}
            >
              <button
                type="button"
                className="mt-0.5 text-emerald-400 hover:text-emerald-300 transition-colors shrink-0"
              >
                {isDone ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-intel-muted" />}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                  <span
                    className={`text-xs font-semibold ${
                      isDone ? 'line-through text-intel-muted' : 'text-intel-text'
                    }`}
                  >
                    Step {act.order}: {act.step}
                  </span>
                  <div className="flex items-center space-x-1.5 shrink-0">
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-intel-card border border-intel-border text-intel-muted">
                      Risk: {act.riskFactor}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-[10px] text-intel-muted">
                  <span className="flex items-center space-x-1 truncate">
                    <User className="w-3 h-3 text-intel-cyan" />
                    <span>Assignee: {act.assignee}</span>
                  </span>
                  <span className="flex items-center space-x-1 shrink-0">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>Deadline: {act.deadline}</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
