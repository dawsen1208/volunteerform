import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Submission from '@/models/Submission';

// Simple in-memory rate limiting
const ipCache = new Map<string, number>();

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const lastRequest = ipCache.get(ip) || 0;
    
    // 3 seconds cooldown between submissions from same IP
    if (now - lastRequest < 3000) { 
        return true;
    }
    
    // Clean up old entries
    if (ipCache.size > 1000) {
        ipCache.clear();
    }
    
    ipCache.set(ip, now);
    return false;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Submission too frequent, please wait.' }, { status: 429 });
    }

    const body = await req.json();
    const { formType, data } = body;

    if (!formType || !data) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate MVP required fields
    const profile = data.profile || {};
    const exam = data.exam || {};
    
    const missingFields = [];
    if (!profile.name) missingFields.push('姓名');
    if (!profile.studentPhone) missingFields.push('电话');
    if (!profile.idNumber) missingFields.push('身份证号');
    if (!profile.examCandidateNumber) missingFields.push('考生号');
    if (exam.totalScore === undefined || exam.totalScore === null) missingFields.push('总分');
    if (exam.rankPosition === undefined || exam.rankPosition === null) missingFields.push('位次');

    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: `缺少必填字段: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }

    await connectToDatabase();

    // Create submission
    const submission = await Submission.create({
      formType,
      data,
      meta: {
        userAgent: req.headers.get('user-agent'),
        ip: ip,
        source: 'web'
      }
    });

    return NextResponse.json({ success: true, id: submission._id });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
