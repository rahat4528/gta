'use client';

import { AlertTriangle, ShieldX } from 'lucide-react';
import { IntelligenceCard, FallbackErrorData } from '../../types';

export function FallbackCard({ card }: { card: IntelligenceCard }) {
  const data = card.data as FallbackErrorData;

  return (
    <div className="bg-rose-950/20 border border-rose-500/40 rounded-2xl p-5 shadow-xl transition-all relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500 animate-pulse" />

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <ShieldX className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-rose-300">
              {card.title || 'Malformed Stream Handled (Safe Fallback)'}
            </h3>
            <span className="text-[10px] text-rose-400/80">
              Payload was safely intercepted without application crash
            </span>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
          ANOMALY QUARANTINED
        </span>
      </div>

      {/* Error reason */}
      <div className="p-3 rounded-xl bg-black/40 border border-rose-500/30 mb-3 text-xs text-rose-200">
        <div className="flex items-center space-x-1.5 text-rose-400 font-bold mb-1">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Validation Diagnostic:</span>
        </div>
        <p className="font-mono text-[11px] leading-relaxed">{data.errorMessage}</p>

        {data.schemaIssues && data.schemaIssues.length > 0 && (
          <ul className="mt-2 pl-4 list-disc space-y-0.5 text-[10px] text-rose-300 font-mono">
            {data.schemaIssues.map((issue, idx) => (
              <li key={idx}>{issue}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Raw Payload Preview */}
      {data.rawContent && (
        <div className="text-[10px] font-mono text-intel-muted bg-intel-panel/60 p-2.5 rounded-xl border border-intel-border/60 max-h-32 overflow-y-auto no-scrollbar">
          <div className="text-neutral-400 mb-1 uppercase tracking-wider font-semibold">Raw Stream Data:</div>
          <pre className="whitespace-pre-wrap break-all">{data.rawContent}</pre>
        </div>
      )}
    </div>
  );
}
