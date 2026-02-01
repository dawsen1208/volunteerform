import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db';
import Session from '@/models/Session';
import User from '@/models/User';
import { IUser } from '@/types';

export async function getSessionUser(req?: NextRequest): Promise<IUser | null> {
  try {
    await connectToDatabase();

    let token: string | undefined;

    if (req) {
      token = req.cookies.get('session_token')?.value;
    } else {
      const cookieStore = await cookies();
      token = cookieStore.get('session_token')?.value;
    }

    if (!token) return null;

    const session = await Session.findOne({ token }).exec();

    if (!session) return null;

    if (new Date() > session.expiresAt) {
      // Session expired, optionally delete it
      await Session.deleteOne({ _id: session._id });
      return null;
    }

    const user = await User.findById(session.userId).exec();
    return user ? user.toObject() : null;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}
