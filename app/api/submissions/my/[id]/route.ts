import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import connectToDatabase from '@/lib/db';
import Submission from '@/models/Submission';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await connectToDatabase();

    const submission = await Submission.findById(id).exec();

    if (!submission) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (submission.userId !== user._id.toString()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(submission);
  } catch (error) {
    console.error('Fetch submission error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
