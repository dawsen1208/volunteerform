'use client';

import React, { useEffect, useState } from 'react';
import { Typography, Descriptions, Card, Tag, Button, Spin, message, Table } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { ISubmission } from '@/types';

const { Title } = Typography;

export default function SubmissionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [submission, setSubmission] = useState<ISubmission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchSubmission();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchSubmission = async () => {
    try {
      const res = await fetch(`/api/admin/submissions/${id}`);
      if (res.ok) {
        const data = await res.json();
        setSubmission(data);
      } else {
        message.error('获取详情失败');
      }
    } catch (error) {
      console.error(error);
      message.error('网络错误');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-10"><Spin size="large" /></div>;
  if (!submission) return <div className="text-center p-10">未找到提交记录</div>;

  const { data, formType, createdAt } = submission;
  const { profile, health, exam, preference, majors, undergradSpecial, juniorSpecial } = data;

  return (
    <div className="max-w-4xl mx-auto">
      <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()} className="mb-4">
        返回列表
      </Button>

      <div className="flex justify-between items-center mb-6">
        <Title level={3} style={{ margin: 0 }}>
          {profile.name} 的提交详情
        </Title>
        <Space>
          <Tag color={formType === 'undergrad' ? 'blue' : 'green'}>
            {formType === 'undergrad' ? '本科志愿约谈表' : '专科志愿单'}
          </Tag>
          <span className="text-gray-500">
            提交时间: {dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')}
          </span>
        </Space>
      </div>

      {/* 1. 基本信息 */}
      <Card title="基本信息 (Profile)" className="mb-6 shadow-sm">
        <Descriptions bordered column={{ xs: 1, sm: 2, md: 3 }}>
          <Descriptions.Item label="姓名">{profile.name}</Descriptions.Item>
          <Descriptions.Item label="性别">{profile.gender}</Descriptions.Item>
          <Descriptions.Item label="民族">{profile.ethnicity || '-'}</Descriptions.Item>
          <Descriptions.Item label="出生日期">{profile.birthDate || '-'}</Descriptions.Item>
          <Descriptions.Item label="身高">{profile.heightCm ? `${profile.heightCm}cm` : '-'}</Descriptions.Item>
          <Descriptions.Item label="体重">{profile.weightKg ? `${profile.weightKg}kg` : '-'}</Descriptions.Item>
          <Descriptions.Item label="电话">{profile.studentPhone}</Descriptions.Item>
          <Descriptions.Item label="身份证号">{profile.idNumber}</Descriptions.Item>
          <Descriptions.Item label="考生号">{profile.examCandidateNumber}</Descriptions.Item>
          <Descriptions.Item label="考生类型">{profile.candidateType || '-'}</Descriptions.Item>
          <Descriptions.Item label="学校/班主任">{profile.schoolClassTeacher || '-'}</Descriptions.Item>
          <Descriptions.Item label="推荐人">{profile.referrer || '-'}</Descriptions.Item>
          <Descriptions.Item label="地址" span={3}>{profile.address || '-'}</Descriptions.Item>
          <Descriptions.Item label="家庭信息" span={3}>
            <pre className="whitespace-pre-wrap font-sans">{profile.familyInfo || '-'}</pre>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 2. 体检信息 */}
      <Card title="体检信息 (Health)" className="mb-6 shadow-sm">
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="体检结论">{health.medicalConclusion || '-'}</Descriptions.Item>
          <Descriptions.Item label="近视情况">{health.myopia || '-'}</Descriptions.Item>
          <Descriptions.Item label="色盲色弱">{health.colorVision || '-'}</Descriptions.Item>
          <Descriptions.Item label="乙肝">{health.hepatitisB ? '有' : '无'}</Descriptions.Item>
          <Descriptions.Item label="肢体残疾">{health.limbDisability ? '有' : '无'}</Descriptions.Item>
          <Descriptions.Item label="心脏病史">{health.heartHistory || '-'}</Descriptions.Item>
          <Descriptions.Item label="其他病史" span={2}>{health.others || '-'}</Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 3. 考试成绩 */}
      <Card title="考试成绩 (Exam)" className="mb-6 shadow-sm">
        <Descriptions bordered column={{ xs: 1, sm: 2, md: 4 }}>
          <Descriptions.Item label="总分" labelStyle={{ fontWeight: 'bold' }}>{exam.totalScore}</Descriptions.Item>
          <Descriptions.Item label="位次" labelStyle={{ fontWeight: 'bold' }}>{exam.rankPosition}</Descriptions.Item>
          <Descriptions.Item label="英语口语">{exam.oralEnglish || '-'}</Descriptions.Item>
          <Descriptions.Item label="单科成绩" span={4}>
            {exam.subjectScores ? (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {Object.entries(exam.subjectScores).map(([subject, score]) => (
                  <div key={subject} className="border p-2 rounded bg-gray-50">
                    <span className="text-gray-500 mr-2">{getSubjectName(subject)}:</span>
                    <span className="font-medium">{score}</span>
                  </div>
                ))}
              </div>
            ) : '无'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 4. 报考意向 */}
      <Card title="报考意向 (Preference)" className="mb-6 shadow-sm">
        <Descriptions bordered column={1}>
          <Descriptions.Item label="意向省份">
            {preference.intendedProvinces?.map(p => <Tag key={p}>{p}</Tag>) || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="院校性质">
            {preference.schoolNature?.map(n => <Tag key={n}>{n}</Tag>) || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="学费区间">{preference.tuitionRange || '-'}</Descriptions.Item>
          <Descriptions.Item label="户口性质">{preference.hukou || '-'}</Descriptions.Item>
          <Descriptions.Item label="读研/就业">
            {preference.careerPlan?.map(c => <Tag key={c}>{c}</Tag>) || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="备注">
            <pre className="whitespace-pre-wrap font-sans">{preference.remarks || '-'}</pre>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 5. 意向专业 */}
      <Card title="意向专业 (Majors)" className="mb-6 shadow-sm">
        <Table
          dataSource={majors}
          rowKey={(record) => record.majorName + record.category}
          pagination={false}
          columns={[
            { title: '专业大类', dataIndex: 'category', key: 'category' },
            { title: '具体专业', dataIndex: 'majorName', key: 'majorName' },
            { title: '备注', dataIndex: 'remarks', key: 'remarks' },
          ]}
        />
      </Card>

      {/* 6. 扩展信息 (根据类型显示) */}
      {formType === 'undergrad' && undergradSpecial && (
        <Card title="本科扩展信息" className="mb-6 shadow-sm">
          <Descriptions bordered column={1}>
            <Descriptions.Item label="院校层次偏好">
              {undergradSpecial.universityLevel?.map(l => <Tag key={l}>{l}</Tag>) || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="提前批意向">{undergradSpecial.earlyBatchIntent || '-'}</Descriptions.Item>
            <Descriptions.Item label="专项计划">
              {undergradSpecial.specialPlans?.map(p => <Tag key={p}>{p}</Tag>) || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="公费生意向">{undergradSpecial.freeStudentIntent || '-'}</Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      {formType === 'junior' && juniorSpecial && (
        <Card title="专科扩展信息" className="mb-6 shadow-sm">
          <Descriptions bordered column={1}>
            <Descriptions.Item label="专升本意向">{juniorSpecial.upgradeIntent || '-'}</Descriptions.Item>
            <Descriptions.Item label="升学难度接受度">{juniorSpecial.upgradeDifficulty || '-'}</Descriptions.Item>
            <Descriptions.Item label="本科层次要求">{juniorSpecial.undergradLevel || '-'}</Descriptions.Item>
            <Descriptions.Item label="专业数量要求">{juniorSpecial.majorCount || '-'}</Descriptions.Item>
            <Descriptions.Item label="费用排名">{juniorSpecial.feeRank || '-'}</Descriptions.Item>
            <Descriptions.Item label="考试科目">{juniorSpecial.examSubjects || '-'}</Descriptions.Item>
            <Descriptions.Item label="国际升学路径">{juniorSpecial.internationalPath || '-'}</Descriptions.Item>
          </Descriptions>
        </Card>
      )}

    </div>
  );
}

function getSubjectName(key: string) {
  const map: Record<string, string> = {
    chinese: '语文', math: '数学', english: '英语',
    physics: '物理', chemistry: '化学', biology: '生物',
    history: '历史', politics: '政治', geography: '地理', tech: '技术'
  };
  return map[key] || key;
}

import { Space } from 'antd';
