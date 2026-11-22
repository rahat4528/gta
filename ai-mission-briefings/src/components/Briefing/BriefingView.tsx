'use client';

import { useState } from 'react';
import {
  FileText,
  Terminal,
  Download,
} from 'lucide-react';
import { IntelligenceCard, MissionMessage, ToolExecutionRecord } from '../../types';
import { CardRenderer } from '../IntelligenceCards/CardRenderer';
import { ToolActivityDrawer } from '../ToolActivity/ToolActivityDrawer';

interface BriefingViewProps {
  messages: MissionMessage[];
  currentCards: IntelligenceCard[];
  tools: ToolExecutionRecord[];
  isStreaming: boolean;
  onExport: () => void;
}

export function BriefingView({
  messages,
  currentCards,
  tools,
  isStreaming,
  onExport,
}: BriefingViewProps) {
  const [viewMode, setViewMode] = useState<'cards' | 'terminal'>('cards');

  return (
    <div className="flex-1 flex flex-col h-full bg-intel-bg overflow-hidden relative">
      {/* Top Classification Bar */}
      <div className="h-14 px-6 border-b border-intel-border flex items-center justify-between bg-intel-bg/90 backdrop-blur-md z-10 shrink-0">
        <div className="flex items-center space-x-3">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 tracking-widest uppercase">
            TOP SECRET // SPECIAL ACCESS
          </span>
          <div className="w-[1px] h-4 bg-intel-border" />
          <span className="text-xs font-bold text-intel-text tracking-wide truncate">
            AURA-9 Tactical Mission Briefing
          </span>
        </div>

        {/* View Switcher & Export */}
        <div className="flex items-center space-x-2">
          {/* Stream Progress indicator */}
          {isStreaming && (
            <div className="flex items-center space-x-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono animate-pulse">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>STREAMING INTEL...</span>
            </div>
          )}

          {/* Toggle Buttons */}
          <div className="flex rounded-xl bg-intel-panel p-1 border border-intel-border">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                viewMode === 'cards'
                  ? 'bg-intel-card text-intel-cyan shadow-sm border border-intel-cyan/40'
                  : 'text-intel-muted hover:text-intel-text'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Dossier View</span>
            </button>
            <button
              onClick={() => setViewMode('terminal')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                viewMode === 'terminal'
                  ? 'bg-intel-card text-intel-cyan shadow-sm border border-intel-cyan/40'
                  : 'text-intel-muted hover:text-intel-text'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Terminal View</span>
            </button>
          </div>

          {/* Export Button */}
          <button
            onClick={onExport}
            className="p-1.5 rounded-xl bg-intel-panel hover:bg-intel-card border border-intel-border text-intel-muted hover:text-intel-cyan transition-colors"
            title="Export Mission Intelligence Dossier (Markdown/JSON)"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content View Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Tool Activity Drawer (Visible whenever tools have been called) */}
        {tools.length > 0 && <ToolActivityDrawer tools={tools} />}

        {/* Mode 1: Intelligence Cards Dossier View */}
        {viewMode === 'cards' && (
          <div className="space-y-5">
            {currentCards.length === 0 && !isStreaming ? (
              <div className="h-96 flex flex-col items-center justify-center text-center p-8 border border-dashed border-intel-border rounded-3xl">
                <div className="w-16 h-16 rounded-2xl bg-intel-panel border border-intel-border flex items-center justify-center text-intel-cyan mb-4">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-intel-text mb-1">
                  Tactical Briefing Ready for Ingestion
                </h3>
                <p className="text-xs text-intel-muted max-w-md">
                  Select a preset directive from above or type a mission order. AURA-9 will stream
                  intelligence token-by-token and generate verified structured cards.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {currentCards.map((card) => (
                  <CardRenderer key={card.id} card={card} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mode 2: Terminal View (Live Typewriter Stream) */}
        {viewMode === 'terminal' && (
          <div className="bg-black/60 border border-intel-border rounded-2xl p-5 font-mono text-xs shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-intel-border text-intel-muted text-[11px]">
              <span className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span className="ml-2 font-bold text-intel-cyan">AURA-9 TTY STREAM</span>
              </span>
              <span>BUFFER STATUS: ACTIVE</span>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-3 rounded-xl border ${
                    m.role === 'user'
                      ? 'bg-intel-panel/60 border-intel-border text-intel-muted'
                      : 'bg-intel-panel/20 border-intel-cyan/30 text-intel-text'
                  }`}
                >
                  <div className="text-[10px] uppercase font-bold mb-1 text-intel-cyan">
                    &gt; {m.role === 'user' ? 'COMMANDER DIRECTIVE' : 'AURA-9 RESPONSE STREAM'}
                  </div>
                  <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed">
                    {m.content}
                  </pre>
                </div>
              ))}

              {isStreaming && (
                <div className="text-intel-cyan animate-pulse flex items-center space-x-1">
                  <span className="inline-block w-2 h-4 bg-intel-cyan" />
                  <span>AWAITING STREAM TERMINATION...</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
