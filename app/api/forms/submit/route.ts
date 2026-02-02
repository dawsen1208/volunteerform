import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Submission from '@/models/Submission';
import AccessToken from '@/models/AccessToken';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, formType, data } = body;

    if (!token || !formType || !data) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();

    // Verify token again before submission
    const accessToken = await AccessToken.findOne({ token }).exec();
    
    if (!accessToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }

    if (new Date() > accessToken.expiresAt) {
      return NextResponse.json({ error: 'Token expired' }, { status: 403 });
    }

    if (accessToken.formType !== formType) {
      return NextResponse.json({ error: 'Token form type mismatch' }, { status: 400 });
    }

    // Create submission
    const submission = await Submission.create({
      token,
      formType,
      data,
    });

    return NextResponse.json({ success: true, id: submission._id });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
