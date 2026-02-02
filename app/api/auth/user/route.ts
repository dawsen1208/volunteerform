import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key-change-it';

export async function GET() {
  try {
    const token = (await cookies()).get('user_token')?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    
    return NextResponse.json({ 
      user: {
        userId: payload.userId,
        phone: payload.phone,
        role: payload.role
      } 
    });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}
