import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import connectToDatabase from '@/lib/db';
import Submission from '@/models/Submission';

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { formType, data } = body;

    if (!formType || !data) {
      return NextResponse.json({ error: 'Missing formType or data' }, { status: 400 });
    }

    // Basic validation
    if (!data.profile?.name || !data.profile?.studentPhone || !data.profile?.idNumber || !data.profile?.examCandidateNumber || !data.exam?.totalScore || !data.exam?.rankPosition) {
       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();

    const submission = await Submission.create({
      userId: user._id,
      formType,
      data,
    });

    return NextResponse.json({ submissionId: submission._id });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
