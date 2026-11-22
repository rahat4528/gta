'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, FolderLock, ExternalLink } from 'lucide-react';
import { MISSION_TEMPLATES } from '../../ai/prompts';

export default function MissionsDirectoryPage() {
  const [filterTag, setFilterTag] = useState<string | null>(null);

  const filtered = filterTag
    ? MISSION_TEMPLATES.filter((t) => t.tags.includes(filterTag))
    : MISSION_TEMPLATES;

  const allTags = Array.from(new Set(MISSION_TEMPLATES.flatMap((t) => t.tags)));

  return (
    <div className="h-screen w-screen bg-intel-bg flex flex-col overflow-y-auto p-8 select-none">
      {/* Header */}
      <div className="max-w-6xl w-full mx-auto mb-8">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-xs font-mono text-intel-muted hover:text-intel-cyan transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Command Console</span>
        </Link>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-intel-cyan/15 border border-intel-cyan/30 flex items-center justify-center text-intel-cyan shadow-md">
              <FolderLock className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-intel-text tracking-wide">
                Tactical Mission Vault &amp; Directory
              </h1>
              <p className="text-xs text-intel-muted">
                Pre-authorized operational protocols, orbital reconnaissance vectors, and crisis responses
              </p>
            </div>
          </div>

          <div className="text-[11px] font-mono text-intel-muted px-3 py-1 rounded-xl bg-intel-panel border border-intel-border">
            <span>{MISSION_TEMPLATES.length} PROTOCOLS AVAILABLE</span>
          </div>
        </div>
      </div>

      {/* Filter Tags */}
      <div className="max-w-6xl w-full mx-auto mb-6 flex items-center space-x-2 flex-wrap gap-y-2">
        <button
          onClick={() => setFilterTag(null)}
          className={`px-3 py-1 rounded-xl text-xs font-mono transition-all ${
            filterTag === null
              ? 'bg-intel-cyan text-black font-bold shadow-md'
              : 'bg-intel-panel text-intel-muted hover:text-intel-text border border-intel-border'
          }`}
        >
          ALL CATEGORIES
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setFilterTag(tag)}
            className={`px-3 py-1 rounded-xl text-xs font-mono transition-all ${
              filterTag === tag
                ? 'bg-intel-cyan text-black font-bold shadow-md'
                : 'bg-intel-panel text-intel-muted hover:text-intel-text border border-intel-border'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((tmpl) => (
          <div
            key={tmpl.id}
            className="p-5 rounded-2xl bg-intel-card border border-intel-border hover:border-intel-cyan/40 transition-all shadow-xl flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  {tmpl.classification}
                </span>
                <span className="text-xs font-mono font-bold text-intel-cyan">
                  {tmpl.codename}
                </span>
              </div>

              <h3 className="text-base font-bold text-intel-text mb-2 group-hover:text-intel-cyan transition-colors">
                {tmpl.title}
              </h3>
              <p className="text-xs text-intel-muted leading-relaxed mb-4">
                {tmpl.description}
              </p>

              <div className="flex items-center space-x-1.5 flex-wrap gap-y-1 mb-4">
                {tmpl.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-intel-panel border border-intel-border text-intel-muted"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-intel-border/60 flex items-center justify-between">
              <span className="text-[10px] font-mono text-intel-muted">
                Suggested Tools: {tmpl.suggestedTools.join(', ')}
              </span>
              <Link
                href="/"
                className="px-3.5 py-1.5 rounded-xl bg-intel-cyan/20 hover:bg-intel-cyan text-intel-cyan hover:text-black border border-intel-cyan/40 text-xs font-bold transition-all flex items-center space-x-1"
              >
                <span>Launch</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
