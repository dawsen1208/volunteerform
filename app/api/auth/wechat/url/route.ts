import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';

export async function GET() {
  const appId = process.env.WECHAT_APP_ID;
  const redirectUri = process.env.WECHAT_REDIRECT_URI;

  if (!appId || !redirectUri) {
    return NextResponse.json({ error: 'Missing WeChat configuration' }, { status: 500 });
  }

  const state = uuidv4();
  const url = `https://open.weixin.qq.com/connect/qrconnect?appid=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=snsapi_login&state=${state}#wechat_redirect`;

  const cookieStore = await cookies();
  cookieStore.set('wx_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 5, // 5 minutes
    path: '/',
  });

  return NextResponse.json({ url });
}
