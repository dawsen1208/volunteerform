import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import AccessToken from '@/models/AccessToken';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    await connectToDatabase();

    const accessToken = await AccessToken.findOne({ token }).exec();

    if (!accessToken) {
      return NextResponse.json({ valid: false, message: 'Invalid token' }, { status: 404 });
    }

    if (new Date() > accessToken.expiresAt) {
      return NextResponse.json({ valid: false, message: 'Token expired' }, { status: 403 });
    }

    return NextResponse.json({ 
      valid: true, 
      formType: accessToken.formType,
      expiresAt: accessToken.expiresAt 
    });

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
