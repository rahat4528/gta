'use client';

import { Activity, Radio, FileText } from 'lucide-react';
import { IntelligenceCard, SupportingData } from '../../types';

export function SupportingDataCard({ card }: { card: IntelligenceCard }) {
  const data = card.data as SupportingData;

  const getMetricStatusStyle = (status: 'nominal' | 'warning' | 'critical') => {
    switch (status) {
      case 'critical':
        return 'border-rose-500/50 bg-rose-500/10 text-rose-300';
      case 'warning':
        return 'border-amber-500/50 bg-amber-500/10 text-amber-300';
      case 'nominal':
        return 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300';
    }
  };

  return (
    <div className="bg-intel-card border border-intel-border hover:border-intel-cyan/40 rounded-2xl p-5 shadow-xl transition-all duration-200 relative overflow-hidden group">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-intel-cyan via-blue-500 to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-intel-cyan/10 border border-intel-cyan/30 flex items-center justify-center text-intel-cyan">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-intel-text tracking-wide">
              {card.title || 'Telemetry & Supporting Data'}
            </h3>
            <span className="text-[10px] text-intel-muted">
              Live Sensor Readings & Data Nodes
            </span>
          </div>
        </div>

        {card.sourceTool && (
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-intel-panel border border-intel-cyan/30 text-intel-cyan">
            via {card.sourceTool}
          </span>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
        {data.metrics.map((m, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl border flex flex-col justify-between ${getMetricStatusStyle(
              m.status
            )}`}
          >
            <span className="text-[10px] font-mono uppercase tracking-wider text-intel-muted truncate">
              {m.label}
            </span>
            <div className="mt-1 flex items-baseline space-x-1">
              <span className="text-base font-bold font-mono">{m.value}</span>
              {m.unit && <span className="text-[10px] font-mono text-intel-muted">{m.unit}</span>}
            </div>
            {m.change && (
              <span className="text-[10px] font-mono mt-0.5 text-intel-muted">
                {m.change}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Raw Sensor / Telemetry Nodes */}
      {data.telemetryNodes && data.telemetryNodes.length > 0 && (
        <div className="mb-3 flex items-center space-x-1.5 flex-wrap gap-y-1 text-[11px]">
          <Radio className="w-3.5 h-3.5 text-intel-cyan shrink-0" />
          <span className="text-intel-muted">Telemetry Nodes:</span>
          {data.telemetryNodes.map((node) => (
            <span
              key={node}
              className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-intel-panel border border-intel-border text-intel-text"
            >
              {node}
            </span>
          ))}
        </div>
      )}

      {/* Raw Sensor Feed */}
      {data.rawSensorFeed && (
        <div className="p-2.5 rounded-xl bg-black/40 border border-intel-border font-mono text-[10px] text-intel-cyan/90 truncate">
          &gt; {data.rawSensorFeed}
        </div>
      )}

      {/* Citations Footer */}
      {data.sourceCitations && data.sourceCitations.length > 0 && (
        <div className="mt-3 pt-2 border-t border-intel-border/60 flex items-center space-x-2 text-[10px] text-intel-muted">
          <FileText className="w-3 h-3" />
          <span>Verified Sources: {data.sourceCitations.join(', ')}</span>
        </div>
      )}
    </div>
  );
}
