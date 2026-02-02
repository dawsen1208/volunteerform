import mongoose, { Schema, Model } from 'mongoose';
import { IFormSubmission } from '@/types';

const SubmissionSchema = new Schema<IFormSubmission>({
  formType: { type: String, enum: ['undergrad', 'junior'], required: true },
  data: {
    profile: {
      name: { type: String, required: true },
      gender: { type: String, enum: ['男', '女'], required: true },
      ethnicity: String,
      birthDate: String,
      heightCm: Number,
      weightKg: Number,
      studentPhone: { type: String, required: true },
      address: String,
      idNumber: { type: String, required: true },
      examCandidateNumber: { type: String, required: true },
      candidateType: { type: String, enum: ['普通', '艺术', '体育', '其他'] },
      referrer: String,
      family: {
        fatherName: String,
        motherName: String,
        fatherWork: String,
        motherWork: String,
        fatherJob: String,
        motherJob: String,
      },
      schoolClassTeacher: String,
    },
    health: {
      medicalConclusion: String,
      leftEye: String,
      rightEye: String,
      colorVision: String,
      hepatitisB: Boolean,
      limbDisability: Boolean,
      heartHistory: String,
      others: String,
    },
    exam: {
      totalScore: { type: Number, required: true },
      rankPosition: { type: Number, required: true },
      selectedSubjects: [String],
      subjectScores: {
        chinese: Number,
        math: Number,
        english: Number,
        physics: Number,
        chemistry: Number,
        biology: Number,
        history: Number,
        politics: Number,
        geography: Number,
        tech: Number,
      },
      oralEnglish: String,
    },
    preference: {
      intendedProvinces: [String],
      schoolNature: [String],
      tuitionRange: String,
      hukou: String,
      careerPlan: [String],
      remarks: String,
    },
    majors: [{
      category: String,
      majorName: String,
      remarks: String,
    }],
    undergradSpecial: {
      universityLevel: [String],
      earlyBatchIntentLine1: [String],
      earlyBatchIntentLine2Type: String,
      earlyBatchIntentLine2School: String,
      earlyBatchIntent: String,
      specialPlans: [String],
      freeStudentIntent: String,
    },
    juniorSpecial: {
      upgradeIntent: String,
      upgradeDifficulty: String,
      undergradLevel: String,
      majorCount: Number,
      feeRank: String,
      examSubjects: String,
      internationalPath: String,
    }
  },
  meta: {
    userAgent: String,
    ip: String,
    source: String,
  },
  createdAt: { type: Date, default: Date.now },
});

// Indexes for faster filtering
SubmissionSchema.index({ formType: 1 });
SubmissionSchema.index({ createdAt: -1 });
SubmissionSchema.index({ 'data.profile.name': 1 });
SubmissionSchema.index({ 'data.profile.studentPhone': 1 });
SubmissionSchema.index({ 'data.profile.examCandidateNumber': 1 });

const Submission: Model<IFormSubmission> =
  mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema, 'form_submissions');

export default Submission;
