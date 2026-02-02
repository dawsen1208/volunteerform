import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import connectToDatabase from '@/lib/db';
import Submission from '@/models/Submission';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key-change-it';

export async function GET() {
  try {
    const token = (await cookies()).get('user_token')?.value;

    if (!token) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    const phone = payload.phone;

    await connectToDatabase();
    // Find submissions by phone number
    const submissions = await Submission.find({ 'data.profile.studentPhone': phone })
      .select('formType createdAt _id')
      .sort({ createdAt: -1 });

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Fetch user submissions error:', error);
    return NextResponse.json({ error: '获取失败' }, { status: 500 });
  }
}
