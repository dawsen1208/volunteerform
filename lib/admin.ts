import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import AdminSession from '@/models/AdminSession';
import connectToDatabase from '@/lib/db';
import crypto from 'crypto';

const COOKIE_NAME = process.env.ADMIN_COOKIE_NAME || 'admin_session';
const SESSION_TTL_DAYS = parseInt(process.env.ADMIN_SESSION_TTL_DAYS || '7');

export async function createAdminSession() {
  await connectToDatabase();
  const token = crypto.randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_TTL_DAYS);

  await AdminSession.create({
    token,
    expiresAt
  });

  return { token, expiresAt };
}

export async function verifyAdmin(req: NextRequest): Promise<boolean> {
  try {
    await connectToDatabase();
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) return false;

    const session = await AdminSession.findOne({ token });
    if (!session) return false;
    
    if (session.expiresAt < new Date()) {
        await AdminSession.deleteOne({ _id: session._id });
        return false;
    }

    return true;
  } catch (error) {
    console.error('Admin verification error:', error);
    return false;
  }
}

export async function destroyAdminSession() {
    try {
        await connectToDatabase();
        const cookieStore = await cookies();
        const token = cookieStore.get(COOKIE_NAME)?.value;
        if (token) {
            await AdminSession.deleteOne({ token });
        }
    } catch (error) {
        console.error('Logout error:', error);
    }
}
