import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin';
import connectToDatabase from '@/lib/db';
import Submission from '@/models/Submission';
import { FilterQuery } from 'mongoose';
import { ISubmission } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(req);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const formType = searchParams.get('formType');

    const query: FilterQuery<ISubmission> = {};
    if (formType) {
      query.formType = formType;
    }

    await connectToDatabase();
    const submissions = await Submission.find(query).sort({ createdAt: -1 }).exec();

    // Generate CSV
    const header = [
      'createdAt',
      'formType',
      'name',
      'studentPhone',
      'examCandidateNumber',
      'totalScore',
      'rankPosition',
      'intendedProvinces',
      'majors',
    ].join(',');

    const rows = submissions.map((sub: ISubmission) => {
      const data = sub.data || {};
      const profile = data.profile || {};
      const exam = data.exam || {};
      const preference = data.preference || {};
      const majors = data.majors || [];

      const intendedProvinces = Array.isArray(preference.intendedProvinces) 
        ? preference.intendedProvinces.join('|') 
        : '';
      
      const majorsStr = JSON.stringify(majors).replace(/"/g, '""'); // Escape quotes for CSV

      return [
        sub.createdAt ? new Date(sub.createdAt).toISOString() : '',
        sub.formType,
        `"${profile.name || ''}"`,
        `"${profile.studentPhone || ''}"`,
        `"${profile.examCandidateNumber || ''}"`,
        exam.totalScore || 0,
        exam.rankPosition || 0,
        `"${intendedProvinces}"`,
        `"${majorsStr}"`,
      ].join(',');
    });

    const csvContent = [header, ...rows].join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="submissions-${Date.now()}.csv"`,
      },
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
