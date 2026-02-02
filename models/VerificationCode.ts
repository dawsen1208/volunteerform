import mongoose, { Schema, Model } from 'mongoose';

export interface IVerificationCode {
  phone: string;
  code: string;
  expiresAt: Date;
}

const VerificationCodeSchema = new Schema<IVerificationCode>({
  phone: { type: String, required: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: { expires: '5m' } }, // Auto-delete after 5 mins
});

const VerificationCode: Model<IVerificationCode> = 
  mongoose.models.VerificationCode || mongoose.model('VerificationCode', VerificationCodeSchema, 'verification_codes');

export default VerificationCode;
