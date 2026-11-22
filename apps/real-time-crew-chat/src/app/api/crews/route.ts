import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@server/services/db';
import { verifyToken } from '@/lib/auth/jwt';

export async function GET(req: NextRequest) {
  try {
    const cookieToken = req.cookies.get('crew_token')?.value;
    const token = req.headers.get('authorization')?.replace('Bearer ', '') || cookieToken;
    const payload = token ? verifyToken(token) : null;

    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const crews = await dbService.getUserCrews(payload.userId);
    return NextResponse.json(crews);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieToken = req.cookies.get('crew_token')?.value;
    const token = req.headers.get('authorization')?.replace('Bearer ', '') || cookieToken;
    const payload = token ? verifyToken(token) : null;

    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, iconUrl } = await req.json();
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Crew name is required' }, { status: 400 });
    }

    const crew = await dbService.createCrew(payload.userId, {
      name,
      description,
      iconUrl,
    });

    return NextResponse.json(crew);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
