'use client';

import { useState } from 'react';
import {
  FolderLock,
  Plus,
  Search,
  Clock,
  Trash2,
} from 'lucide-react';
import { MissionDossier } from '../../types';

interface MissionHistorySidebarProps {
  dossiers: MissionDossier[];
  activeDossierId: string | null;
  onSelectDossier: (dossierId: string) => void;
  onNewMission: () => void;
  onDeleteDossier: (dossierId: string) => void;
}

export function MissionHistorySidebar({
  dossiers,
  activeDossierId,
  onSelectDossier,
  onNewMission,
  onDeleteDossier,
}: MissionHistorySidebarProps) {
  const [search, setSearch] = useState('');

  const filtered = dossiers.filter((d) =>
    search
      ? d.title.toLowerCase().includes(search.toLowerCase()) ||
        d.codename.toLowerCase().includes(search.toLowerCase())
      : true
  );

  return (
    <div className="w-64 h-full bg-intel-sidebar border-r border-intel-border flex flex-col select-none">
      {/* Header */}
      <div className="h-14 px-4 border-b border-intel-border flex items-center justify-between bg-intel-sidebar/90">
        <div className="flex items-center space-x-2">
          <FolderLock className="w-4 h-4 text-intel-cyan" />
          <span className="text-xs font-bold text-intel-text tracking-wider uppercase">
            Mission Vault
          </span>
        </div>

        <button
          onClick={onNewMission}
          className="p-1.5 rounded-lg bg-intel-panel hover:bg-intel-card text-intel-cyan border border-intel-border hover:border-intel-cyan/40 transition-all"
          title="Create New Mission Briefing"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-3 border-b border-intel-border/60">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-intel-muted absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search missions..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-intel-panel border border-intel-border text-xs text-intel-text placeholder-intel-muted focus:outline-none focus:border-intel-cyan"
          />
        </div>
      </div>

      {/* Dossier List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 no-scrollbar">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-intel-muted text-xs">
            No missions found.
          </div>
        ) : (
          filtered.map((d) => {
            const isActive = d.id === activeDossierId;
            return (
              <div
                key={d.id}
                onClick={() => onSelectDossier(d.id)}
                className={`group relative p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                  isActive
                    ? 'bg-intel-panel border-intel-cyan/50 shadow-md'
                    : 'bg-intel-card/40 border-intel-border/60 hover:border-intel-border hover:bg-intel-card'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-intel-cyan font-bold truncate">
                    {d.codename}
                  </span>
                  <div className="flex items-center space-x-1">
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                        d.status === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-300'
                          : d.status === 'ACTIVE'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-intel-panel text-intel-muted'
                      }`}
                    >
                      {d.status}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDossier(d.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-intel-muted hover:text-rose-400 transition-opacity"
                      title="Delete mission"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="text-xs font-semibold text-intel-text truncate">
                  {d.title}
                </div>

                <div className="flex items-center justify-between mt-1 text-[10px] text-intel-muted">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(d.createdAt).toLocaleDateString()}</span>
                  </span>
                  <span className="font-mono">{d.pinnedCards.length} cards</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-intel-border/60 bg-intel-panel/40 text-[10px] font-mono text-intel-muted flex justify-between items-center">
        <span>STORAGE: LOCAL PERSISTED</span>
        <span className="text-intel-cyan">{dossiers.length} DOSSIERS</span>
      </div>
    </div>
  );
}
