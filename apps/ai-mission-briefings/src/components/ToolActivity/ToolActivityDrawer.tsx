'use client';

import { useState } from 'react';
import {
  Wrench,
  CheckCircle,
  Loader2,
  XCircle,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Database,
  Radio,
} from 'lucide-react';
import { ToolExecutionRecord, ToolStatus } from '../../types';

export function ToolActivityDrawer({
  tools,
}: {
  tools: ToolExecutionRecord[];
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (tools.length === 0) return null;

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const getStatusBadge = (status: ToolStatus) => {
    switch (status) {
      case 'running':
        return (
          <span className="flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>RUNNING</span>
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <CheckCircle className="w-3 h-3" />
            <span>APPROVED &amp; EXECUTED</span>
          </span>
        );
      case 'denied':
        return (
          <span className="flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <XCircle className="w-3 h-3" />
            <span>ACCESS DENIED</span>
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <XCircle className="w-3 h-3" />
            <span>FAILED</span>
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-intel-panel text-intel-muted">
            PENDING
          </span>
        );
    }
  };

  return (
    <div className="bg-intel-sidebar border border-intel-border rounded-2xl p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-xl bg-intel-cyan/15 border border-intel-cyan/30 flex items-center justify-center text-intel-cyan">
            <Wrench className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-intel-text tracking-wide uppercase flex items-center space-x-1.5">
              <span>Server Tool Activity</span>
              <span className="text-[10px] font-mono text-intel-muted font-normal">
                ({tools.length} Invocations)
              </span>
            </h4>
          </div>
        </div>

        <div className="flex items-center space-x-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
          <ShieldCheck className="w-3 h-3" />
          <span>Server Allowlist &amp; Zod Enforced</span>
        </div>
      </div>

      {/* Tool Execution List */}
      <div className="space-y-2">
        {tools.map((t) => {
          const isExpanded = expandedId === t.toolCallId;
          return (
            <div
              key={t.toolCallId}
              className="border border-intel-border rounded-xl bg-intel-panel/60 overflow-hidden text-xs transition-colors"
            >
              {/* Tool Header row */}
              <button
                type="button"
                onClick={() => toggleExpand(t.toolCallId)}
                className="w-full p-2.5 flex items-center justify-between hover:bg-intel-card/50 transition-colors text-left"
              >
                <div className="flex items-center space-x-2 truncate">
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-intel-muted shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-intel-muted shrink-0" />
                  )}
                  <span className="font-mono text-intel-cyan font-bold truncate">
                    {t.toolName}()
                  </span>
                  {t.durationMs !== undefined && (
                    <span className="text-[10px] font-mono text-intel-muted shrink-0">
                      ({t.durationMs}ms)
                    </span>
                  )}
                </div>

                <div className="shrink-0">{getStatusBadge(t.status)}</div>
              </button>

              {/* Collapsible Inspector */}
              {isExpanded && (
                <div className="p-3 border-t border-intel-border/60 bg-black/40 space-y-2.5 font-mono text-[11px]">
                  {/* Inputs */}
                  <div>
                    <div className="text-[10px] font-semibold text-intel-muted uppercase mb-1 flex items-center space-x-1">
                      <Radio className="w-3 h-3 text-intel-cyan" />
                      <span>Validated Input Parameters:</span>
                    </div>
                    <pre className="p-2 rounded-lg bg-intel-panel border border-intel-border/60 text-intel-text overflow-x-auto text-[10px]">
                      {JSON.stringify(t.input, null, 2)}
                    </pre>
                  </div>

                  {/* Outputs */}
                  {t.output && (
                    <div>
                      <div className="text-[10px] font-semibold text-intel-muted uppercase mb-1 flex items-center space-x-1">
                        <Database className="w-3 h-3 text-emerald-400" />
                        <span>Verified Server Telemetry Output:</span>
                      </div>
                      <pre className="p-2 rounded-lg bg-intel-panel border border-intel-border/60 text-emerald-300 overflow-x-auto text-[10px]">
                        {JSON.stringify(t.output, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* Error if any */}
                  {t.error && (
                    <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[10px]">
                      Error: {t.error}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
