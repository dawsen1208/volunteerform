import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Simple check: if accessing /admin/dashboard directly without a key in query param?
  // Actually, we are using client-side localStorage for admin key, so we can't verify it in middleware easily
  // without sending it as a cookie. 
  // For this simple "Scan-to-Access" model, we rely on API security and Client-side redirect.
  // Middleware is less critical now, but we can keep it for redirects if needed.
  
  // Let's just remove the old logic.
  return NextResponse.next();
}

export const config = {
  matcher: [],
};

