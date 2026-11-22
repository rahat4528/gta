import { NextRequest, NextResponse } from 'next/server';
import { streamBriefing } from '@/ai/providers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { prompt, history } = await req.json();

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json({ error: 'Mission directive prompt is required' }, { status: 400 });
    }

    const encoder = new TextEncoder();
    const abortController = new AbortController();

    // Listen to client disconnect
    req.signal.addEventListener('abort', () => {
      abortController.abort();
    });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          await streamBriefing({
            prompt: prompt.trim(),
            history,
            signal: abortController.signal,
            onChunk: (chunk) => {
              if (abortController.signal.aborted) return;
              try {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
              } catch {
                // Controller may be closed
              }
            },
          });
        } catch (err: unknown) {
          const errorMsg = err instanceof Error ? err.message : 'Streaming failed';
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'error', error: errorMsg })}\n\n`)
          );
        } finally {
          try {
            controller.close();
          } catch {
            // Already closed
          }
        }
      },
      cancel() {
        abortController.abort();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
