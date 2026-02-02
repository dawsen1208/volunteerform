import { NextRequest, NextResponse } from 'next/server';
import { createAdminSession } from '@/lib/admin';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const correctPassword = process.env.ADMIN_PASSWORD;

    if (!correctPassword) {
      console.error('ADMIN_PASSWORD not set');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    if (password !== correctPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const { token, expiresAt } = await createAdminSession();

    const response = NextResponse.json({ ok: true });
    
    response.cookies.set({
        name: process.env.ADMIN_COOKIE_NAME || 'admin_session',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: expiresAt,
        path: '/'
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 });
  }
}
