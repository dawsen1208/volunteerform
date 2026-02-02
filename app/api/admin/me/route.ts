import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin';

export async function GET(req: NextRequest) {
    const isValid = await verifyAdmin();
    return NextResponse.json({ authenticated: isValid });
}
