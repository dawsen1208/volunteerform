import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin';
import connectToDatabase from '@/lib/db';
import AccessToken from '@/models/AccessToken';
import { v4 as uuidv4 } from 'uuid';

export async function GET(req: NextRequest) {
  try {
    if (!verifyAdmin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectToDatabase();
    
    // Sort by creation date descending
    const tokens = await AccessToken.find().sort({ createdAt: -1 }).limit(100).exec();
    
    return NextResponse.json(tokens);
  } catch (error) {
    console.error('Fetch tokens error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!verifyAdmin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { formType, description, daysValid = 7, count = 1 } = body;

    if (!formType) {
      return NextResponse.json({ error: 'Missing formType' }, { status: 400 });
    }

    await connectToDatabase();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + daysValid);

    const tokensToCreate = [];
    for (let i = 0; i < count; i++) {
      tokensToCreate.push({
        token: uuidv4(), // or a shorter random string if preferred, but uuid is safe
        formType,
        expiresAt,
        description,
        used: false,
      });
    }

    const createdTokens = await AccessToken.insertMany(tokensToCreate);

    return NextResponse.json({ success: true, count: createdTokens.length, tokens: createdTokens });
  } catch (error) {
    console.error('Create token error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
