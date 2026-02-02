import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin';
import connectToDatabase from '@/lib/db';
import Submission from '@/models/Submission';
import { FilterQuery } from 'mongoose';
import { IFormSubmission } from '@/types';

function escapeCsv(field: any): string {
    if (field === undefined || field === null) return '';
    const stringField = String(field);
    if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
        return `"${stringField.replace(/"/g, '""')}"`;
    }
    return stringField;
}

export async function GET(req: NextRequest) {
  try {
    const isAuthenticated = await verifyAdmin(req);
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    
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
        if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    const items = await Submission.find(query).sort({ createdAt: -1 });

    // CSV Header
    const headers = [
        '提交时间', '表单类型', 
        '姓名', '电话', '考生号', 
        '总分', '位次', 
        '意向省份', '专业填报内容'
    ].join(',');

    // CSV Rows
    const rows = items.map(item => {
        const p = item.data.profile || {};
        const e = item.data.exam || {};
        const pref = item.data.preference || {};
        
        return [
            escapeCsv(new Date(item.createdAt).toLocaleString()),
            escapeCsv(item.formType === 'undergrad' ? '本科' : '专科'),
            escapeCsv(p.name),
            escapeCsv(p.studentPhone),
            escapeCsv(p.examCandidateNumber),
            escapeCsv(e.totalScore),
            escapeCsv(e.rankPosition),
            escapeCsv((pref.intendedProvinces || []).join('|')),
            escapeCsv(JSON.stringify(item.data.majors || []))
        ].join(',');
    });

    const csvContent = '\uFEFF' + [headers, ...rows].join('\n'); // Add BOM for Excel

    return new NextResponse(csvContent, {
        headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': `attachment; filename="submissions-${new Date().toISOString().slice(0,10)}.csv"`
        }
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
