import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin';
import connectToDatabase from '@/lib/db';
import Submission from '@/models/Submission';
import { FilterQuery } from 'mongoose';
import { IFormSubmission } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const isAuthenticated = await verifyAdmin(req);
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const formType = searchParams.get('formType');
    const keyword = searchParams.get('keyword');
    const province = searchParams.get('province');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    const query: FilterQuery<IFormSubmission> = {};
    
    if (formType) query.formType = formType;
    
    if (keyword) {
        const regex = { $regex: keyword, $options: 'i' };
        query['$or'] = [
            { 'data.profile.name': regex },
            { 'data.profile.studentPhone': regex },
            { 'data.profile.examCandidateNumber': regex }
        ];
    }
    
    if (province) {
        query['data.preference.intendedProvinces'] = province;
    }
    
    if (dateFrom || dateTo) {
        query.createdAt = {};
        if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
        if (dateTo) query.createdAt.$lte = new Date(dateTo); // Should probably set to end of day
    }

    const total = await Submission.countDocuments(query);
    const items = await Submission.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize);

    return NextResponse.json({ items, total });
  } catch (error) {
    console.error('Fetch submissions error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
