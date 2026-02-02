import mongoose, { Schema, Model } from 'mongoose';
import { IAccessToken } from '@/types';

const AccessTokenSchema = new Schema<IAccessToken>({
  token: { type: String, required: true, unique: true },
  formType: { type: String, enum: ['undergrad', 'junior'], required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  description: { type: String },
});

// Index for expiry
AccessTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const AccessToken: Model<IAccessToken> = mongoose.models.AccessToken || mongoose.model<IAccessToken>('AccessToken', AccessTokenSchema);

export default AccessToken;
