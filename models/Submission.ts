import mongoose, { Schema, Model } from 'mongoose';
import { ISubmission } from '@/types';

const SubmissionSchema = new Schema<ISubmission>({
  token: { type: String, required: true },
  formType: { type: String, enum: ['undergrad', 'junior'], required: true },
  data: { type: Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Submission: Model<ISubmission> = mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);

export default Submission;
