'use client';

import React, { useState, Suspense, useEffect } from 'react';
import { Form, Button, message, Typography, Checkbox, Steps } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import ProfileSection from '@/components/form-sections/ProfileSection';
import HealthSection from '@/components/form-sections/HealthSection';
import ExamSection from '@/components/form-sections/ExamSection';
import PreferenceSection from '@/components/form-sections/PreferenceSection';
import MajorsTable from '@/components/MajorsTable';
import UndergradSpecialSection from '@/components/UndergradSpecialSection';
import JuniorSpecialSection from '@/components/JuniorSpecialSection';
import { IFormData, FormType } from '@/types';

const { Title } = Typography;
const { Step } = Steps;

function FormContent({ type }: { type: FormType }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setSubmissionId(id);
      fetchSubmission(id);
    }
  }, [searchParams]);

  const fetchSubmission = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/submissions/${id}`); // We can reuse admin API if permission allows or use a new user API
      // Since admin API might need admin auth, better create a specific endpoint or use the one we have? 
      // Actually we don't have a public "get by id" for users yet. 
      // But we can try the user auth one or just assume admin API is protected.
      // Let's use a new user-specific endpoint or modify the admin one.
      // For now, let's assume we can fetch it via a new endpoint or the user needs to be logged in.
      // Wait, we can reuse `/api/admin/submissions/[id]` if we loosen the check OR create `/api/user/submissions/[id]`.
      // Creating `/api/user/submissions/[id]` is safer.
      const res2 = await fetch(`/api/user/submissions/${id}`);
      const data = await res2.json();
      if (res2.ok) {
         // Data structure is { submission: { data: ... } }
         form.setFieldsValue(data.submission.data);
      } else {
         message.error('加载表单失败');
      }
    } catch (error) {
      message.error('网络错误');
    }
  };

  const steps = [
    {
      title: '基本信息',
      content: <ProfileSection />,
      fields: ['profile'],
    },
    {
      title: '体检信息',
      content: <HealthSection />,
      fields: ['health'],
    },
    {
      title: '考试成绩',
      content: <ExamSection />,
      fields: ['exam'],
    },
    {
      title: '报考意向',
      content: <PreferenceSection />,
      fields: ['preference'],
    },
    {
      title: '专属信息',
      content: type === 'undergrad' ? <UndergradSpecialSection /> : <JuniorSpecialSection />,
      fields: type === 'undergrad' ? ['undergradSpecial'] : ['juniorSpecial'],
    },
    {
      title: '意向专业',
      content: <MajorsTable />,
      fields: ['majors'],
    },
  ];

  const next = async () => {
    try {
      // Validate based on current step
      let fieldsToValidate: any[] = [];
      switch (currentStep) {
        case 0: // Profile
          fieldsToValidate = [
            ['profile', 'name'], ['profile', 'gender'], 
            ['profile', 'studentPhone'], ['profile', 'idNumber'], 
            ['profile', 'examCandidateNumber']
          ];
          break;
        case 2: // Exam
          fieldsToValidate = [['exam', 'totalScore'], ['exam', 'rankPosition']];
          break;
        case 4: // Special
          if (type === 'undergrad') {
            const line2Type = form.getFieldValue(['undergradSpecial', 'earlyBatchIntentLine2Type']);
            if (line2Type === '直招士官' || line2Type === '飞行技术') {
              fieldsToValidate = [['undergradSpecial', 'earlyBatchIntentLine2School']];
            }
          }
          break;
        default:
          fieldsToValidate = [];
      }
      
      if (fieldsToValidate.length > 0) {
        await form.validateFields(fieldsToValidate);
      }

      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Validation failed:', error);
      message.error('请完善当前页面的必填信息');
    }
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const onFinish = async (values: IFormData) => {
    try {
      setLoading(true);
      const url = submissionId 
        ? `/api/user/submissions/${submissionId}` 
        : '/api/forms/submit';
      
      const method = submissionId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formType: type, data: values }),
      });

      if (res.ok) {
        message.success(submissionId ? '提交更新成功' : '提交成功');
        router.push('/thanks');
      } else {
        const data = await res.json();
        message.error(data.error || '提交失败');
      }
    } catch (error) {
      console.error(error);
      message.error('网络错误');
    } finally {
      setLoading(false);
    }
  };

  const formTitle = type === 'undergrad' ? '本科志愿约谈表' : '专科志愿单';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <Title level={2}>{formTitle}</Title>
          <p className="text-gray-500">请认真填写以下信息，带 * 号为必填项</p>
        </div>

        <div className="mb-8">
            <Steps current={currentStep}>
                {steps.map((item) => (
                    <Step key={item.title} title={item.title} />
                ))}
            </Steps>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            profile: { gender: '男' },
            exam: { subjectScores: {} },
            preference: { intendedProvinces: [], schoolNature: [] },
            majors: [],
          }}
          preserve={true}
        >
          <div className="steps-content mt-8">
            {/* Render all steps but control visibility via CSS to keep them in DOM for validation */}
            {steps.map((step, index) => (
              <div key={index} style={{ display: currentStep === index ? 'block' : 'none' }}>
                {step.content}
              </div>
            ))}
          </div>
          
          {/* Agreement only on last step */}
          <div style={{ display: currentStep === steps.length - 1 ? 'block' : 'none' }}>
              <Form.Item 
                name="agreement" 
                valuePropName="checked" 
                rules={[
                  { 
                    validator: (_, value) => 
                      value ? Promise.resolve() : Promise.reject(new Error('请确认信息真实性')) 
                  }
                ]}
                className="text-center mt-6"
              >
                <Checkbox>我确认以上填写的信息真实有效</Checkbox>
              </Form.Item>
          </div>

          <div className="steps-action mt-8 flex justify-center gap-4">
            {currentStep > 0 && (
              <Button style={{ margin: '0 8px' }} onClick={() => prev()} size="large">
                上一步
              </Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button type="primary" onClick={() => next()} size="large">
                下一步
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button type="primary" htmlType="submit" size="large" loading={loading}>
                提交表单
              </Button>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
}

export default function FormPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = React.use(params);

  if (type !== 'undergrad' && type !== 'junior') {
    return <div className="p-8 text-center">Invalid Form Type</div>;
  }

  return (
    <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
      <FormContent type={type as FormType} />
    </Suspense>
  );
}
