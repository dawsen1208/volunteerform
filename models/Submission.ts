import mongoose, { Schema, Model } from 'mongoose';
import { ISubmission } from '@/types';

const SubmissionSchema = new Schema<ISubmission>({
  userId: { type: String, required: true, index: true },
  formType: { type: String, enum: ['undergrad', 'junior'], required: true, index: true },
  data: {
    profile: {
      name: { type: String, required: true },
      gender: { type: String },
      ethnicity: { type: String },
      birthDate: { type: String },
      heightCm: { type: Number },
      weightKg: { type: Number },
      studentPhone: { type: String, required: true },
      address: { type: String },
      idNumber: { type: String, required: true },
      examCandidateNumber: { type: String, required: true },
      candidateType: { type: String },
      referrer: { type: String },
      parents: {
        fatherName: { type: String },
        motherName: { type: String },
        parentsOccupation: { type: String },
      },
      schoolClassTeacher: { type: String },
    },
    health: {
      physicalStatusNormal: { type: Boolean },
      medicalConclusion: { type: String },
      myopia: {
        has: { type: Boolean },
        leftDegree: { type: String },
        rightDegree: { type: String },
      },
      leftHanded: { type: Boolean },
      colorBlind: { type: Boolean },
      colorWeak: { type: Boolean },
      monochromeIncomplete: { type: Boolean },
      hepatitisB: { type: Boolean },
      limbDisability: { type: Boolean },
      heartHistory: { type: String },
    },
    exam: {
      totalScore: { type: Number, required: true },
      rankPosition: { type: Number, required: true },
      subjectScores: {
        chinese: { type: Number },
        math: { type: Number },
        english: { type: Number },
        physics: { type: Number },
        chemistry: { type: Number },
        biology: { type: Number },
        history: { type: Number },
        politics: { type: Number },
        geography: { type: Number },
      },
      oralEnglish: { type: String },
      advantageSubjects: { type: String },
    },
    preference: {
      intendedProvinces: [String],
      schoolOwnership: { type: String },
      tuitionRange: { type: String },
      hukou: { type: String },
      postGradIntent: { type: Boolean },
      employmentIntent: { type: Boolean },
      otherOptionsNote: { type: String },
    },
    majors: [{
      majorCategory: { type: String },
      majorName: { type: String },
      note: { type: String },
    }],
    undergradSpecial: {
      schoolTierPreference: [String],
      earlyBatchIntent: { type: String },
      collegeSpecialPlan: [String],
      publicFundedStudent: { type: String },
    },
    juniorSpecial: {
      upgradeToBachelor: { type: String },
      upgradeToMaster: { type: String },
      upgradeDifficulty: { type: String },
      bachelorTier: { type: String },
      majorCount: { type: String },
      costRank: { type: String },
      examSubjects: { type: String },
      internationalPath: { type: String },
    },
  },
  createdAt: { type: Date, default: Date.now, index: true },
});

// Create compound index for faster queries if needed, though single field indexes are defined above
SubmissionSchema.index({ createdAt: -1 });

const Submission: Model<ISubmission> = mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);

export default Submission;
