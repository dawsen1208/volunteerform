import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import connectToDatabase from '@/lib/db';
import Submission from '@/models/Submission';
import { FilterQuery } from 'mongoose';
import { ISubmission } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const formType = searchParams.get('formType');
    const keyword = searchParams.get('keyword');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    const query: FilterQuery<ISubmission> = {};

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
      .limit(1000) // Limit for safety
      .exec();

    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Admin fetch submissions error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
