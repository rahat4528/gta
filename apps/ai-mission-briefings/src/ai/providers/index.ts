import { generateMockScenario, StreamChunk } from './mock';
import { executeServerTool } from '../tools';
import { safeParseCard } from '../schemas';

export interface StreamBriefingOptions {
  prompt: string;
  history?: Array<{ role: string; content: string }>;
  signal?: AbortSignal;
  onChunk: (chunk: StreamChunk) => void;
}

export async function streamBriefing({
  prompt,
  signal,
  onChunk,
}: StreamBriefingOptions) {
  const provider = (process.env.AI_PROVIDER || 'mock').toLowerCase();
  const hasOpenAiKey = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 5);

  if (provider === 'openai' && hasOpenAiKey) {
    // OpenAI Vercel AI SDK integration can be hooked here if a real key is present
    // Fall back gracefully to mock if OpenAI request encounters issues
  }

  // Built-in High-Fidelity Tactical Mock Provider
  await streamMockBriefing({ prompt, signal, onChunk });
}

async function streamMockBriefing({
  prompt,
  signal,
  onChunk,
}: {
  prompt: string;
  signal?: AbortSignal;
  onChunk: (chunk: StreamChunk) => void;
}) {
  const scenario = generateMockScenario(prompt);

  const delay = (ms: number) =>
    new Promise((resolve) => {
      const timeout = setTimeout(resolve, ms);
      if (signal) {
        signal.addEventListener('abort', () => clearTimeout(timeout));
      }
    });

  // 1. Stream Introduction
  for (const line of scenario.intro) {
    if (signal?.aborted) return;
    for (const char of line) {
      if (signal?.aborted) return;
      onChunk({ type: 'token', content: char });
      await delay(12);
    }
  }

  await delay(150);

  // 2. Execute Approved Server Tools sequentially
  for (const tool of scenario.toolsToCall) {
    if (signal?.aborted) return;

    const callId = `call-${Math.random().toString(36).slice(2, 8)}`;

    // Notify client that tool has started
    onChunk({
      type: 'tool_start',
      record: {
        toolCallId: callId,
        toolName: tool.toolName,
        status: 'running',
        input: tool.input,
        timestamp: new Date().toISOString(),
      },
    });

    await delay(350);
    if (signal?.aborted) return;

    // Execute server tool with strict allowlist and Zod validation
    const { record, suggestedCard } = await executeServerTool(callId, tool.toolName, tool.input);

    onChunk({
      type: 'tool_end',
      record,
    });

    if (suggestedCard) {
      const parsed = safeParseCard(suggestedCard);
      onChunk({
        type: 'card',
        card: parsed.success ? parsed.card : parsed.fallback,
      });
    }

    await delay(200);
  }

  // 3. Stream Analysis Synthesis
  for (const token of scenario.analysisTokens) {
    if (signal?.aborted) return;
    const words = token.split(' ');
    for (const word of words) {
      if (signal?.aborted) return;
      onChunk({ type: 'token', content: word + ' ' });
      await delay(20);
    }
  }

  await delay(200);

  // 4. Emit Intelligence Cards
  for (const card of scenario.cards) {
    if (signal?.aborted) return;
    const parsed = safeParseCard(card);
    onChunk({
      type: 'card',
      card: parsed.success ? parsed.card : parsed.fallback,
    });
    await delay(150);
  }

  // 5. Completion
  onChunk({ type: 'done' });
}
