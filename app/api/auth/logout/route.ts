import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  (await cookies()).delete('user_token');
  return NextResponse.json({ success: true, message: '已退出登录' });
}
