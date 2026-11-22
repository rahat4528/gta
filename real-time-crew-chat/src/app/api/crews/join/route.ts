import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@server/services/db';
import { verifyToken } from '@/lib/auth/jwt';

export async function POST(req: NextRequest) {
  try {
    const cookieToken = req.cookies.get('crew_token')?.value;
    const token = req.headers.get('authorization')?.replace('Bearer ', '') || cookieToken;
    const payload = token ? verifyToken(token) : null;

    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { inviteCode } = await req.json();
    if (!inviteCode?.trim()) {
      return NextResponse.json({ error: 'Invite code is required' }, { status: 400 });
    }

    const crew = await dbService.joinCrewByInvite(payload.userId, inviteCode.trim());
    if (!crew) {
      return NextResponse.json({ error: 'Invalid invite code' }, { status: 404 });
    }

    return NextResponse.json({ crew });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
