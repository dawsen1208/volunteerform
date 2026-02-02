'use client';

import React, { useState, Suspense } from 'react';
import { Form, Button, message, Typography, Checkbox } from 'antd';
import { useRouter } from 'next/navigation';
import BaseFormSections from '@/components/BaseFormSections';
import MajorsTable from '@/components/MajorsTable';
import UndergradSpecialSection from '@/components/UndergradSpecialSection';
import JuniorSpecialSection from '@/components/JuniorSpecialSection';
import { IFormData, FormType } from '@/types';

const { Title } = Typography;

function FormContent({ type }: { type: FormType }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: IFormData) => {
    try {
      setLoading(true);
      const res = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formType: type, data: values }),
      });

      const data = await res.json();
      if (res.ok) {
        message.success('提交成功');
        router.push(`/thanks?id=${data.id}`);
      } else {
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
        >
          <BaseFormSections />
          
          {type === 'undergrad' && <UndergradSpecialSection />}
          {type === 'junior' && <JuniorSpecialSection />}

          <MajorsTable />

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

          <div className="mt-8 flex justify-center">
            <Button type="primary" htmlType="submit" size="large" loading={loading} className="w-full max-w-xs h-12 text-lg">
              提交表单
            </Button>
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
