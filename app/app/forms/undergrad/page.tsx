'use client';

import React, { useState } from 'react';
import { Form, Button, message, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import BaseFormSections from '@/components/BaseFormSections';
import MajorsTable from '@/components/MajorsTable';
import UndergradSpecialSection from '@/components/UndergradSpecialSection';
import { IFormData } from '@/types';

const { Title } = Typography;

export default function UndergradFormPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: IFormData) => {
    try {
      setLoading(true);
      const res = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formType: 'undergrad', data: values }),
      });

      const data = await res.json();
      if (res.ok) {
        message.success('提交成功');
        router.push('/app/submissions');
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

  return (
    <div className="max-w-4xl mx-auto">
      <Title level={2} className="mb-6 text-center">本科志愿约谈表</Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          profile: { gender: '其他/未说明' },
          health: { physicalStatusNormal: true },
          majors: [],
        }}
      >
        <BaseFormSections />
        <UndergradSpecialSection />
        <MajorsTable />

        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" block loading={loading}>
            提交表单
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
