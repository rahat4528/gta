import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '../../../../../server/services/db';
import { hashPassword, signToken } from '@/lib/auth/jwt';

export async function POST(req: NextRequest) {
  try {
    const { email, username, password, displayName } = await req.json();

    if (!email || !username || !password) {
      return NextResponse.json({ error: 'Email, username, and password are required' }, { status: 400 });
    }

    const existingUser = await dbService.findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await dbService.createUser({
      email,
      username,
      passwordHash,
      displayName: displayName || username,
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        statusMessage: user.statusMessage,
        isOnline: true,
      },
      token,
    });

    response.cookies.set('crew_token', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
