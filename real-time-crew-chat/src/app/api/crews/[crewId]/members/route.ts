import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@server/services/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ crewId: string }> }
) {
  try {
    const { crewId } = await params;
    const members = await dbService.getCrewMembers(crewId);
    return NextResponse.json(members);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
