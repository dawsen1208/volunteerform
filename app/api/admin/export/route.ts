import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin';
import connectToDatabase from '@/lib/db';
import Submission from '@/models/Submission';
import { FilterQuery } from 'mongoose';
import { IFormSubmission } from '@/types';

function escapeCsv(field: unknown): string {
    if (field === undefined || field === null) return '';
    const stringField = String(field);
    if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
        return `"${stringField.replace(/"/g, '""')}"`;
    }
    return stringField;
}

export async function GET(req: NextRequest) {
  try {
    const isAuthenticated = await verifyAdmin();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    
    const formType = searchParams.get('formType');
    const keyword = searchParams.get('keyword');
    const province = searchParams.get('province');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    const query: FilterQuery<IFormSubmission> = {};
    
    if (formType) query.formType = formType;
    
    if (keyword) {
        const regex = { $regex: keyword, $options: 'i' };
        query['$or'] = [
            { 'data.profile.name': regex },
            { 'data.profile.studentPhone': regex },
            { 'data.profile.examCandidateNumber': regex }
        ];
    }
    
    if (province) {
        query['data.preference.intendedProvinces'] = province;
    }
    
    if (dateFrom || dateTo) {
        query.createdAt = {};
        if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
        if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    const items = await Submission.find(query).sort({ createdAt: -1 });

    // CSV Headers
    const headers = [
        '提交时间', '表单类型',
        // Profile
        '姓名', '性别', '民族', '出生日期', '身高(cm)', '体重(kg)', 
        '电话', '身份证号', '考生号', '考生类型', 
        '学校/班主任', '推荐人', '地址',
        '父亲姓名', '父亲单位', '父亲职务',
        '母亲姓名', '母亲单位', '母亲职务',
        // Health
        '体检结论', '左眼视力', '右眼视力', '色盲色弱', '乙肝', '肢体残疾', '心脏病史', '其他病史',
        // Exam
        '总分', '位次', '英语口语', '选考科目', '单科成绩',
        // Preference
        '意向省份', '院校性质', '学费区间', '户口性质', '读研/就业', '备注',
        // Undergrad Special
        '本科-院校层次', '本科-提前批(一段上)', '本科-提前批(一段下二段上)-类型', '本科-提前批(一段下二段上)-院校', '本科-专项计划', '本科-公费生',
        // Junior Special
        '专科-专升本意向', '专科-升学难度', '专科-本科层次', '专科-专业数量', '专科-费用排名', '专科-考试科目', '专科-国际升学',
        // Majors
        '意向专业(JSON)'
    ].join(',');

    // CSV Rows
    const rows = items.map(item => {
        const p = item.data.profile || {};
        const f = p.family || {};
        const h = item.data.health || {};
        const e = item.data.exam || {};
        const pref = item.data.preference || {};
        const us = item.data.undergradSpecial || {};
        const js = item.data.juniorSpecial || {};
        
        // Helper to join array or return string
        const join = (arr: any[]) => Array.isArray(arr) ? arr.join('|') : (arr || '');

        return [
            escapeCsv(new Date(item.createdAt).toLocaleString()),
            escapeCsv(item.formType === 'undergrad' ? '本科' : '专科'),
            
            // Profile
            escapeCsv(p.name),
            escapeCsv(p.gender),
            escapeCsv(p.ethnicity),
            escapeCsv(p.birthDate),
            escapeCsv(p.heightCm),
            escapeCsv(p.weightKg),
            escapeCsv(p.studentPhone),
            escapeCsv(p.idNumber),
            escapeCsv(p.examCandidateNumber),
            escapeCsv(p.candidateType),
            escapeCsv(p.schoolClassTeacher),
            escapeCsv(p.referrer),
            escapeCsv(p.address),
            escapeCsv(f.fatherName),
            escapeCsv(f.fatherWork),
            escapeCsv(f.fatherJob),
            escapeCsv(f.motherName),
            escapeCsv(f.motherWork),
            escapeCsv(f.motherJob),

            // Health
            escapeCsv(h.medicalConclusion),
            escapeCsv(h.leftEye),
            escapeCsv(h.rightEye),
            escapeCsv(h.colorVision),
            escapeCsv(h.hepatitisB ? '有' : '无'),
            escapeCsv(h.limbDisability ? '有' : '无'),
            escapeCsv(h.heartHistory),
            escapeCsv(h.others),

            // Exam
            escapeCsv(e.totalScore),
            escapeCsv(e.rankPosition),
            escapeCsv(e.oralEnglish),
            escapeCsv(join(e.selectedSubjects)),
            escapeCsv(JSON.stringify(e.subjectScores || {})),

            // Preference
            escapeCsv(join(pref.intendedProvinces)),
            escapeCsv(join(pref.schoolNature)),
            escapeCsv(pref.tuitionRange),
            escapeCsv(pref.hukou),
            escapeCsv(join(pref.careerPlan)),
            escapeCsv(pref.remarks),

            // Undergrad Special
            escapeCsv(join(us.universityLevel)),
            escapeCsv(join(us.earlyBatchIntentLine1)),
            escapeCsv(us.earlyBatchIntentLine2Type),
            escapeCsv(us.earlyBatchIntentLine2School),
            escapeCsv(join(us.specialPlans)),
            escapeCsv(us.freeStudentIntent),

            // Junior Special
            escapeCsv(js.upgradeIntent),
            escapeCsv(js.upgradeDifficulty),
            escapeCsv(js.undergradLevel),
            escapeCsv(js.majorCount),
            escapeCsv(js.feeRank),
            escapeCsv(js.examSubjects),
            escapeCsv(js.internationalPath),

            // Majors
            escapeCsv(JSON.stringify(item.data.majors || []))
        ].join(',');
    });

    const csvContent = '\uFEFF' + [headers, ...rows].join('\n');

    return new NextResponse(csvContent, {
        headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': `attachment; filename="submissions-${new Date().toISOString().slice(0,10)}.csv"`
        }
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
