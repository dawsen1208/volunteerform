import mongoose, { Schema, Model } from 'mongoose';
import { IAdminSession } from '@/types';

const AdminSessionSchema = new Schema<IAdminSession>({
  token: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

// TTL index on expiresAt
AdminSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const AdminSession: Model<IAdminSession> =
  mongoose.models.AdminSession || mongoose.model('AdminSession', AdminSessionSchema, 'admin_sessions');

export default AdminSession;
