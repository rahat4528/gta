import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@server/services/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ crewId: string }> }
) {
  try {
    const { crewId } = await params;
    const channels = await dbService.getCrewChannels(crewId);
    return NextResponse.json(channels);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ crewId: string }> }
) {
  try {
    const { crewId } = await params;
    const { name, topic, type } = await req.json();

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Channel name is required' }, { status: 400 });
    }

    const channel = await dbService.createChannel(crewId, {
      name,
      topic,
      type: type || 'TEXT',
    });

    return NextResponse.json(channel);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
