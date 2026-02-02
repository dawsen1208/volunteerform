import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import connectToDatabase from '@/lib/db';
import Submission from '@/models/Submission';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key-change-it';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const token = (await cookies()).get('user_token')?.value;

    if (!token) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    const phone = payload.phone;

    await connectToDatabase();
    const submission = await Submission.findById(id);

    if (!submission) {
      return NextResponse.json({ error: '未找到表单' }, { status: 404 });
    }

    // Security check: ensure the submission belongs to the logged-in user (via phone)
    // Note: submission.data.profile.studentPhone might be deep, need to check if it matches
    // Also user might change phone in profile? 
    // Usually we trust the stored data. If user modifies phone in form, that's fine, 
    // but fetching should check if CURRENT stored phone matches logged in user.
    if (submission.data.profile.studentPhone !== phone) {
        return NextResponse.json({ error: '无权访问此表单' }, { status: 403 });
    }

    return NextResponse.json({ submission });
  } catch (error) {
    console.error('Fetch submission error:', error);
    return NextResponse.json({ error: '获取失败' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
      const { id } = await params;
      const token = (await cookies()).get('user_token')?.value;
  
      if (!token) {
        return NextResponse.json({ error: '未登录' }, { status: 401 });
      }
  
      const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
      const phone = payload.phone;
      
      const body = await req.json();
      const { data } = body;

      await connectToDatabase();
      const submission = await Submission.findById(id);
  
      if (!submission) {
        return NextResponse.json({ error: '未找到表单' }, { status: 404 });
      }
  
      // Security check
      if (submission.data.profile.studentPhone !== phone) {
          return NextResponse.json({ error: '无权修改此表单' }, { status: 403 });
      }
      
      // Update data
      // Note: If user changes phone number in the form, they might lose access if we only check by phone!
      // But for now let's assume phone is immutable or warn user. 
      // Ideally we should link by userId, but we are using phone linking for simplicity with legacy data.
      
      submission.data = { ...submission.data, ...data };
      // Update meta if needed?
      
      await submission.save();
  
      return NextResponse.json({ success: true, message: '更新成功' });
    } catch (error) {
      console.error('Update submission error:', error);
      return NextResponse.json({ error: '更新失败' }, { status: 500 });
    }
  }
