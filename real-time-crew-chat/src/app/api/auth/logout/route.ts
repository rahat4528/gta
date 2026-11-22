import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ status: 'ok' });
  response.cookies.delete('crew_token');
  return response;
}
