import { NextRequest, NextResponse } from 'next/server';
import { destroyAdminSession } from '@/lib/admin';

export async function POST(req: NextRequest) {
    await destroyAdminSession();
    const response = NextResponse.json({ ok: true });
    response.cookies.delete(process.env.ADMIN_COOKIE_NAME || 'admin_session');
    return response;
}
