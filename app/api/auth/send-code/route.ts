import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import VerificationCode from '@/models/VerificationCode';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json({ error: '手机号不能为空' }, { status: 400 });
    }

    // Check if user already exists (optional, depending on flow. Here we allow code for existing users too if they forgot password?)
    // For registration flow, usually we check if user exists.
    // But since this endpoint might be used for reset password too, let's just send code.

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Save to DB
    await VerificationCode.deleteMany({ phone }); // Clear old codes
    await VerificationCode.create({
      phone,
      code,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 mins
    });

    // In a real app, send SMS here.
    // For this demo, we return it in response (or log it)
    console.log(`[MOCK SMS] Code for ${phone} is ${code}`);

    return NextResponse.json({ 
      success: true, 
      message: '验证码已发送 (开发模式: 请查看控制台或响应)',
      mockCode: process.env.NODE_ENV === 'development' ? code : undefined // Only show in dev
    });
  } catch (error) {
    console.error('Send code error:', error);
    return NextResponse.json({ error: '发送失败' }, { status: 500 });
  }
}
