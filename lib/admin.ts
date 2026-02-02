import { NextRequest } from 'next/server';

export function verifyAdmin(req: NextRequest): boolean {
  const { searchParams } = new URL(req.url);
  const adminKey = searchParams.get('adminKey') || req.headers.get('x-admin-key');
  const secret = process.env.ADMIN_SECRET;

  if (!secret) {
    console.error('ADMIN_SECRET not configured');
    return false;
  }

  return adminKey === secret;
}
