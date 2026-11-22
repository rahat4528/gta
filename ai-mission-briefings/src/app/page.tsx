'use client';

import { useState, useRef } from 'react';
import {
  MissionDossier,
  MissionMessage,
  MissionTemplate,
  ToolExecutionRecord,
} from '../types';
import { MissionHistorySidebar } from '../components/MissionHistory/MissionHistorySidebar';
import { BriefingView } from '../components/Briefing/BriefingView';
import { MissionInput } from '../components/Chat/MissionInput';
import { MISSION_TEMPLATES } from '../ai/prompts';
import { safeParseCard } from '../ai/schemas';

const DEFAULT_DOSSIERS: MissionDossier[] = [
  {
    id: 'dos-astra',
    title: 'Orbital Satellite Intercept & Drift Analysis',
    codename: 'PROJECT ASTRA-VEGA',
    classification: 'TOP SECRET // SPECIAL ACCESS',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
    status: 'CRITICAL',
    tags: ['Orbital', 'Electronic Warfare'],
    messages: [
      {
        id: 'msg-seed-1',
        role: 'user',
        content: MISSION_TEMPLATES[0].prompt,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
    ],
    pinnedCards: [],
  },
];

export default function MissionBriefingsApp() {
  const [dossiers, setDossiers] = useState<MissionDossier[]>(DEFAULT_DOSSIERS);
  const [activeDossierId, setActiveDossierId] = useState<string>('dos-astra');
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeTools, setActiveTools] = useState<ToolExecutionRecord[]>([]);

  const abortControllerRef = useRef<AbortController | null>(null);

  const activeDossier = dossiers.find((d) => d.id === activeDossierId) || dossiers[0];

  const handleSendPrompt = async (promptText: string) => {
    if (isStreaming) return;

    // Reset tools for new run
    setActiveTools([]);

    // Add user message to active dossier
    const userMsgId = `msg-user-${Date.now()}`;
    const assistantMsgId = `msg-ast-${Date.now()}`;

    const userMessage: MissionMessage = {
      id: userMsgId,
      role: 'user',
      content: promptText,
      createdAt: new Date().toISOString(),
    };

    const initialAssistantMessage: MissionMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      createdAt: new Date().toISOString(),
      isStreaming: true,
    };

    setDossiers((prev) =>
      prev.map((d) =>
        d.id === activeDossier.id
          ? {
              ...d,
              updatedAt: new Date().toISOString(),
              messages: [...d.messages, userMessage, initialAssistantMessage],
            }
          : d
      )
    );

    setIsStreaming(true);

    const abortCtrl = new AbortController();
    abortControllerRef.current = abortCtrl;

    try {
      const response = await fetch('/api/briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText }),
        signal: abortCtrl.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error(`Briefing stream failed: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data: ')) continue;
          const jsonStr = trimmed.slice(6);
          if (!jsonStr) continue;

          try {
            const chunk = JSON.parse(jsonStr);

            if (chunk.type === 'token') {
              // Append streamed character to latest assistant message
              setDossiers((prev) =>
                prev.map((d) => {
                  if (d.id !== activeDossier.id) return d;
                  const msgs = [...d.messages];
                  const last = msgs[msgs.length - 1];
                  if (last && last.role === 'assistant') {
                    msgs[msgs.length - 1] = {
                      ...last,
                      content: last.content + chunk.content,
                    };
                  }
                  return { ...d, messages: msgs };
                })
              );
            } else if (chunk.type === 'tool_start') {
              setActiveTools((prev) => [...prev, chunk.record]);
            } else if (chunk.type === 'tool_end') {
              setActiveTools((prev) =>
                prev.map((t) =>
                  t.toolCallId === chunk.record.toolCallId ? chunk.record : t
                )
              );
            } else if (chunk.type === 'card') {
              // Validate card with Zod
              const parsed = safeParseCard(chunk.card);
              const cardToStore = parsed.success ? parsed.card : parsed.fallback;

              setDossiers((prev) =>
                prev.map((d) => {
                  if (d.id !== activeDossier.id) return d;
                  const existingIdx = d.pinnedCards.findIndex((c) => c.id === cardToStore.id);
                  const updatedCards =
                    existingIdx >= 0
                      ? d.pinnedCards.map((c, i) => (i === existingIdx ? cardToStore : c))
                      : [...d.pinnedCards, cardToStore];
                  return { ...d, pinnedCards: updatedCards };
                })
              );
            } else if (chunk.type === 'done') {
              break;
            }
          } catch (parseErr) {
            console.error('SSE JSON parse error:', parseErr);
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('Stream generation aborted by user.');
      } else {
        console.error('Stream execution error:', err);
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
      setDossiers((prev) =>
        prev.map((d) => {
          if (d.id !== activeDossier.id) return d;
          const msgs = [...d.messages];
          const last = msgs[msgs.length - 1];
          if (last) {
            msgs[msgs.length - 1] = { ...last, isStreaming: false };
          }
          return { ...d, messages: msgs };
        })
      );
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }
  };

  const handleSelectTemplate = (template: MissionTemplate) => {
    // Create new mission from template
    const newId = `dos-${Date.now()}`;
    const newDossier: MissionDossier = {
      id: newId,
      title: template.title,
      codename: template.codename,
      classification: template.classification,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'ACTIVE',
      tags: template.tags,
      messages: [],
      pinnedCards: [],
    };

    setDossiers((prev) => [newDossier, ...prev]);
    setActiveDossierId(newId);
    handleSendPrompt(template.prompt);
  };

  const handleNewMission = () => {
    const newId = `dos-${Date.now()}`;
    const newDossier: MissionDossier = {
      id: newId,
      title: 'Tactical Reconnaissance Directive',
      codename: `OPERATION-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      classification: 'SECRET',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'ACTIVE',
      tags: ['Tactical', 'Ad-hoc'],
      messages: [],
      pinnedCards: [],
    };
    setDossiers((prev) => [newDossier, ...prev]);
    setActiveDossierId(newId);
    setActiveTools([]);
  };

  const handleDeleteDossier = (dossierId: string) => {
    if (dossiers.length <= 1) return;
    const remaining = dossiers.filter((d) => d.id !== dossierId);
    setDossiers(remaining);
    if (activeDossierId === dossierId) {
      setActiveDossierId(remaining[0].id);
    }
  };

  const handleTriggerAnomalyFallback = () => {
    // Deliberately inject a malformed payload to verify Zod safe fallback handling
    const malformedPayload = {
      type: 'mission_summary',
      title: 'Corrupted Ingress Stream 0xBADF00D',
      data: {
        // Missing required objective & overview, invalid classification
        classification: 'NON_EXISTENT_CLEARANCE',
        sector: 12345, // invalid type
      },
    };

    const parsed = safeParseCard(malformedPayload);
    const fallbackCard = parsed.success ? parsed.card : parsed.fallback;

    setDossiers((prev) =>
      prev.map((d) =>
        d.id === activeDossier.id
          ? {
              ...d,
              pinnedCards: [fallbackCard, ...d.pinnedCards],
            }
          : d
      )
    );
  };

  const handleExport = () => {
    const exportData = {
      dossierId: activeDossier.id,
      title: activeDossier.title,
      codename: activeDossier.codename,
      classification: activeDossier.classification,
      exportedAt: new Date().toISOString(),
      cards: activeDossier.pinnedCards,
      messages: activeDossier.messages,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeDossier.codename.replace(/\s+/g, '_')}_DOSSIER.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-intel-bg">
      {/* 1. Left Sidebar: Mission Vault & History */}
      <MissionHistorySidebar
        dossiers={dossiers}
        activeDossierId={activeDossierId}
        onSelectDossier={setActiveDossierId}
        onNewMission={handleNewMission}
        onDeleteDossier={handleDeleteDossier}
      />

      {/* 2. Main Center & Right: Briefing View & Input */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <BriefingView
          messages={activeDossier.messages}
          currentCards={activeDossier.pinnedCards}
          tools={activeTools}
          isStreaming={isStreaming}
          onExport={handleExport}
        />

        <MissionInput
          isLoading={isStreaming}
          onSend={handleSendPrompt}
          onStop={handleStop}
          onSelectTemplate={handleSelectTemplate}
          onTriggerAnomalyFallback={handleTriggerAnomalyFallback}
        />
      </div>
    </div>
  );
}
