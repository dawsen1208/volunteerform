import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key-change-it';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /dashboard and /form routes
  // Users must be logged in to access dashboard or fill forms (to ensure data linkage)
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/form')) {
    const token = request.cookies.get('user_token')?.value;

    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('returnUrl', pathname + request.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (error) {
      // Invalid token
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('returnUrl', pathname + request.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/form/:path*'],
};
