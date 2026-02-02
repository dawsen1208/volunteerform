export type FormType = 'undergrad' | 'junior';

export interface IAccessToken {
  _id: string;
  token: string;
  formType: FormType;
  used: boolean; // Optional: track if used, or allow multiple uses? User didn't specify one-time use, but "expiresAt" implies time-bound. 
                 // User requirement: "校验 token 是否存在且未过期". Doesn't say "consume". Assuming reusable until expiry.
  expiresAt: Date;
  createdAt: Date;
  description?: string; // e.g. "For Class 3 Students"
}

export interface ISubmission {
  _id: string;
  token: string; // The token string used to submit
  formType: FormType;
  data: IFormData;
  createdAt: Date;
}

export interface IFormData {
  profile: IProfile;
  health: IHealth;
  scores: ISubjectScores;
  // Specific fields
  undergrad?: {
    interviewIntent: string; // e.g. "意向约谈时间"
    targetMajor?: string;
  };
  junior?: {
    targetColleges?: string;
  };
}

export interface IProfile {
  name: string;
  gender: '男' | '女' | '其他/未说明';
  ethnicity?: string;
  birthDate?: string; // YYYY-MM-DD
  heightCm?: number;
  weightKg?: number;
  studentPhone: string;
  address?: string;
  idNumber: string;
  examCandidateNumber: string;
  candidateType?: '普通' | '艺' | '体' | '其他';
  referrer?: string;
  parents?: {
    fatherName?: string;
    motherName?: string;
    parentsOccupation?: string;
  };
  schoolClassTeacher?: string;
}

export interface IHealth {
  physicalStatusNormal: boolean;
  medicalConclusion?: string;
  myopia?: {
    has: boolean;
    leftDegree?: string;
    rightDegree?: string;
  };
  leftHanded?: boolean;
  colorBlind?: boolean;
  colorWeak?: boolean;
  monochromeIncomplete?: boolean;
  hepatitisB?: boolean;
  limbDisability?: boolean;
  heartHistory?: '有' | '无' | '不详';
}

export interface ISubjectScores {
  chinese: number;
  math: number;
  english: number;
  physics: number;
  chemistry: number;
  biology: number;
  history: number;
  politics: number;
  geography: number;
}

export interface IExam {
  totalScore: number;
  rankPosition: number;
  subjectScores?: ISubjectScores;
  oralEnglish?: '合格' | '不合格' | '未参加' | '不详';
  advantageSubjects?: string;
}

export interface IPreference {
  intendedProvinces?: string[];
  schoolOwnership?: '公办' | '民办' | '港澳台合作' | '中外合作' | '其他/不详';
  tuitionRange?: '无要求' | '1万以内' | '1-2万' | '2-3万' | '3-5万' | '5-10万' | '10万以上';
  hukou?: '城市' | '农村' | '不详';
  postGradIntent?: boolean;
  employmentIntent?: boolean;
  otherOptionsNote?: string;
}

export interface IMajor {
  majorCategory?: string;
  majorName?: string;
  note?: string;
}

export interface IUndergradSpecial {
  schoolTierPreference?: ('985' | '211' | '双一流')[];
  earlyBatchIntent?: string;
  collegeSpecialPlan?: ('高校专项' | '农村地方专项' | '强基计划' | '综合评价' | '小语种' | '涉农专业')[];
  publicFundedStudent?: '有意向' | '无意向' | '不详';
}

export interface IJuniorSpecial {
  upgradeToBachelor?: '升本' | '不升本' | '不详';
  upgradeToMaster?: '升研' | '不升研' | '不详';
  upgradeDifficulty?: string;
  bachelorTier?: string;
  majorCount?: string;
  costRank?: string;
  examSubjects?: string;
  internationalPath?: string;
}

export interface IFormData {
  profile: IProfile;
  health: IHealth;
  exam: IExam;
  preference: IPreference;
  majors: IMajor[];
  undergradSpecial?: IUndergradSpecial;
  juniorSpecial?: IJuniorSpecial;
}

export interface ISubmission {
  _id: string;
  userId: string; // ObjectId string
  formType: FormType;
  data: IFormData;
  createdAt: Date;
}
