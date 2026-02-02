export type FormType = 'undergrad' | 'junior';

export interface IAdminSession {
  _id: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface IFormSubmission {
  _id: string;
  formType: FormType;
  data: IFormData;
  meta: {
    userAgent?: string;
    ip?: string;
    source?: string;
  };
  createdAt: Date;
}

export interface IFormData {
  profile: IProfile;
  health: IHealth;
  exam: IExam;
  preference: IPreference;
  majors: IMajorRow[];
  undergradSpecial?: IUndergradSpecial;
  juniorSpecial?: IJuniorSpecial;
}

export interface IProfile {
  name: string;
  gender: '男' | '女';
  ethnicity?: string;
  birthDate?: string; // YYYY-MM-DD
  heightCm?: number;
  weightKg?: number;
  studentPhone: string;
  address?: string;
  idNumber: string;
  examCandidateNumber: string;
  candidateType?: string; // 普通/艺/体...
  referrer?: string; // 推荐人
  familyInfo?: string; // 家庭信息 (JSON or text description)
  schoolClassTeacher?: string; // 学校/班主任
}

export interface IHealth {
  medicalConclusion?: string; // 体检结论
  myopia?: string; // 近视情况
  colorVision?: string; // 色盲色弱
  hepatitisB?: boolean; // 乙肝
  limbDisability?: boolean; // 肢体
  heartHistory?: string; // 心脏病史
  others?: string;
}

export interface IExam {
  totalScore: number;
  rankPosition: number;
  subjectScores?: {
    chinese?: number;
    math?: number;
    english?: number;
    physics?: number;
    chemistry?: number;
    biology?: number;
    history?: number;
    politics?: number;
    geography?: number;
    tech?: number;
  };
  oralEnglish?: string; // 口语
}

export interface IPreference {
  intendedProvinces?: string[]; // 意向省份
  schoolNature?: string[]; // 院校性质 (公办/民办/...)
  tuitionRange?: string; // 学费区间
  hukou?: string; // 户口
  careerPlan?: string[]; // 读研/就业意向
  remarks?: string; // 备注
}

export interface IMajorRow {
  category: string; // 专业大类
  majorName: string; // 具体专业
  remarks?: string;
}

export interface IUndergradSpecial {
  universityLevel?: string[]; // 985/211/双一流
  earlyBatchIntent?: string; // 提前批意向
  specialPlans?: string[]; // 专项计划 (强基/综合评价...)
  freeStudentIntent?: string; // 公费生意向
}

export interface IJuniorSpecial {
  upgradeIntent?: string; // 是否升本/升研
  upgradeDifficulty?: string; // 升本难易
  undergradLevel?: string; // 本科层次
  majorCount?: number; // 专业数量
  feeRank?: string; // 费用排名
  examSubjects?: string; // 考试科目
  internationalPath?: string; // 国际本科/出国路径
}
