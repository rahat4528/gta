'use client';

import { useState } from 'react';
import { Send, Square, BookOpen, AlertCircle } from 'lucide-react';
import { MISSION_TEMPLATES } from '../../ai/prompts';
import { MissionTemplate } from '../../types';

interface MissionInputProps {
  isLoading: boolean;
  onSend: (prompt: string) => void;
  onStop: () => void;
  onSelectTemplate: (template: MissionTemplate) => void;
  onTriggerAnomalyFallback: () => void;
}

export function MissionInput({
  isLoading,
  onSend,
  onStop,
  onSelectTemplate,
  onTriggerAnomalyFallback,
}: MissionInputProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onSend(prompt.trim());
    setPrompt('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-4 bg-intel-sidebar border-t border-intel-border select-none">
      {/* Quick Mission Templates */}
      <div className="mb-3 flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1 text-xs">
        <span className="text-[10px] font-mono font-bold text-intel-muted uppercase tracking-wider shrink-0 flex items-center space-x-1">
          <BookOpen className="w-3 h-3 text-intel-cyan" />
          <span>Presets:</span>
        </span>

        {MISSION_TEMPLATES.map((tmpl) => (
          <button
            key={tmpl.id}
            type="button"
            onClick={() => onSelectTemplate(tmpl)}
            className="px-2.5 py-1 rounded-xl bg-intel-panel hover:bg-intel-card border border-intel-border hover:border-intel-cyan/40 text-intel-text text-[11px] font-medium transition-all shrink-0 hover:text-intel-cyan"
          >
            {tmpl.title.split(' ')[0]} {tmpl.title.split(' ')[1]}
          </button>
        ))}

        {/* Test Safe Fallback Button */}
        <button
          type="button"
          onClick={onTriggerAnomalyFallback}
          className="px-2.5 py-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[11px] font-medium transition-all shrink-0 flex items-center space-x-1"
          title="Inject malformed stream data to verify safe Zod fallback quarantine without crash"
        >
          <AlertCircle className="w-3 h-3 text-rose-400" />
          <span>Test Anomaly Fallback</span>
        </button>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="bg-intel-card rounded-2xl border border-intel-border focus-within:border-intel-cyan focus-within:ring-1 focus-within:ring-intel-cyan/40 transition-all p-2 shadow-lg">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter mission directive or reconnaissance order... (Enter to send, Shift+Enter for newline)"
            rows={2}
            className="w-full bg-transparent text-xs text-intel-text placeholder-intel-muted focus:outline-none resize-none px-2 py-1 leading-relaxed"
          />

          <div className="flex items-center justify-between pt-2 border-t border-intel-border/60 px-1">
            <div className="text-[10px] font-mono text-intel-muted flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-intel-cyan animate-pulse" />
              <span>AURA-9 AI Core Operational</span>
            </div>

            <div className="flex items-center space-x-2">
              {isLoading ? (
                <button
                  type="button"
                  onClick={onStop}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Stop Generation</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!prompt.trim()}
                  className="px-4 py-1.5 rounded-xl bg-intel-accent hover:bg-blue-600 disabled:opacity-40 disabled:hover:bg-intel-accent text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Execute Directive</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
