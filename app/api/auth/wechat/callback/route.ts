import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Session from '@/models/Session';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, state } = body;

    if (!code || !state) {
      return NextResponse.json({ error: 'Missing code or state' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const savedState = cookieStore.get('wx_state')?.value;

    if (!savedState || savedState !== state) {
      return NextResponse.json({ error: 'Invalid state' }, { status: 400 });
    }

    // Clear state cookie
    cookieStore.delete('wx_state');

    const appId = process.env.WECHAT_APP_ID;
    const secret = process.env.WECHAT_APP_SECRET;

    if (!appId || !secret) {
      return NextResponse.json({ error: 'Missing WeChat configuration' }, { status: 500 });
    }

    const tokenUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appId}&secret=${secret}&code=${code}&grant_type=authorization_code`;
    
    const tokenRes = await fetch(tokenUrl);
    const tokenData = await tokenRes.json();

    if (tokenData.errcode) {
      return NextResponse.json({ error: `WeChat API Error: ${tokenData.errmsg}` }, { status: 400 });
    }

    const { openid, unionid } = tokenData;

    await connectToDatabase();

    // Determine role
    const adminOpenIds = (process.env.ADMIN_OPENIDS || '').split(',');
    const role = adminOpenIds.includes(openid) ? 'admin' : 'user';

    // Upsert User
    let user = await User.findOne({ wechatOpenId: openid });
    if (user) {
      // Update role if changed (e.g. added to whitelist)
      if (user.role !== role) {
        user.role = role;
        await user.save();
      }
      // Update unionId if present
      if (unionid && user.unionId !== unionid) {
        user.unionId = unionid;
        await user.save();
      }
    } else {
      user = await User.create({
        wechatOpenId: openid,
        unionId: unionid,
        role,
      });
    }

    // Create Session
    const sessionToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await Session.create({
      token: sessionToken,
      userId: user._id,
      expiresAt,
    });

    // Set Session Cookie
    cookieStore.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    });

    return NextResponse.json({ role: user.role });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
