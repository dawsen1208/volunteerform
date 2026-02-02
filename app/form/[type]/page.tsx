'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Form, Button, message, Typography, Spin, Alert } from 'antd';
import { useSearchParams } from 'next/navigation';
import BaseFormSections from '@/components/BaseFormSections';
import MajorsTable from '@/components/MajorsTable';
import UndergradSpecialSection from '@/components/UndergradSpecialSection';
import JuniorSpecialSection from '@/components/JuniorSpecialSection';
import { IFormData, FormType } from '@/types';

const { Title } = Typography;

function FormContent({ type }: { type: FormType }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setTokenError('缺少 Token 参数');
      setVerifying(false);
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch(`/api/token/verify?token=${token}`);
        const data = await res.json();

        if (res.ok && data.valid) {
          if (data.formType !== type) {
             setTokenError(`此 Token 仅用于 ${data.formType === 'undergrad' ? '本科' : '专科'} 表单`);
             setTokenValid(false);
          } else {
             setTokenValid(true);
          }
        } else {
          setTokenError(data.message || 'Token 无效或已过期');
        }
      } catch {
        setTokenError('验证失败，请稍后重试');
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [token, type]);

  const onFinish = async (values: IFormData) => {
    try {
      setLoading(true);
      const res = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, formType: type, data: values }),
      });

      const data = await res.json();
      if (res.ok) {
        message.success('提交成功');
        setSubmitted(true);
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

  if (verifying) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spin size="large" tip="正在验证链接..." />
      </div>
    );
  }

  if (submitted) {
     return (
        <div className="max-w-md mx-auto mt-12 p-6 bg-green-50 rounded-lg text-center shadow">
           <Title level={3} type="success">提交成功</Title>
           <p className="text-gray-600 mb-4">您的志愿表单已成功提交。</p>
           <p className="text-sm text-gray-500">您可以直接关闭此页面。</p>
        </div>
     );
  }

  if (!tokenValid) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] px-4">
        <Alert
          message="链接无效"
          description={tokenError || "该二维码/链接已失效或不适用于此表单。"}
          type="error"
          showIcon
          className="max-w-md w-full"
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white shadow-sm rounded-lg my-8">
      <Title level={2} className="mb-6 text-center">
        {type === 'undergrad' ? '本科志愿约谈表' : '专科志愿单'}
      </Title>
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
        {type === 'undergrad' ? <UndergradSpecialSection /> : <JuniorSpecialSection />}
        <MajorsTable />

        <Form.Item className="mt-8">
          <Button type="primary" htmlType="submit" size="large" block loading={loading} className="h-12 text-lg">
            提交表单
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default function FormPage({ params }: { params: Promise<{ type: string }> }) {
  // We need to unwrap params in Next.js 15+
  const resolvedParams = React.use(params);
  const type = resolvedParams.type as FormType;

  if (type !== 'undergrad' && type !== 'junior') {
      return (
          <div className="flex justify-center mt-20">
              <Alert message="404" description="表单类型错误" type="error" />
          </div>
      )
  }

  return (
    <Suspense fallback={<div className="flex justify-center p-12"><Spin /></div>}>
      <FormContent type={type} />
    </Suspense>
  );
}
