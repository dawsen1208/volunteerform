import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin';

export async function GET(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ valid: false }, { status: 403 });
  }
  return NextResponse.json({ valid: true });
}
