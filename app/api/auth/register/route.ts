import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { phone, password } = await req.json();

    if (!phone || !password) {
      return NextResponse.json({ error: '请填写所有必填项' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return NextResponse.json({ error: '该手机号已注册' }, { status: 400 });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    await User.create({
      phone,
      passwordHash
    });

    return NextResponse.json({ success: true, message: '注册成功' });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: '注册失败' }, { status: 500 });
  }
}
