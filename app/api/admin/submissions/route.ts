import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin';
import connectToDatabase from '@/lib/db';
import Submission from '@/models/Submission';

export async function GET(req: NextRequest) {
  try {
    if (!verifyAdmin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const formType = searchParams.get('formType');
    const keyword = searchParams.get('keyword');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    if (formType) {
      query.formType = formType;
    }

    if (keyword) {
      query.$or = [
        { 'data.profile.name': { $regex: keyword, $options: 'i' } },
        { 'data.profile.studentPhone': { $regex: keyword, $options: 'i' } },
        { 'data.profile.examCandidateNumber': { $regex: keyword, $options: 'i' } },
      ];
    }

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) {
        query.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        // End of day
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        query.createdAt.$lte = toDate;
      }
    }

    await connectToDatabase();

    const submissions = await Submission.find(query)
      .sort({ createdAt: -1 })
      .limit(1000)
      .exec();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return NextResponse.json(submissions.map((s: any) => ({
      _id: s._id,
      token: s.token,
      formType: s.formType,
      data: s.data,
      createdAt: s.createdAt,
    })));
  } catch (error) {
    console.error('Admin fetch submissions error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
