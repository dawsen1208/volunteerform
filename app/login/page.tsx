'use client';

import { useState, Suspense } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const { Title } = Typography;

function LoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.ok) {
        message.success('登录成功');
        const returnUrl = searchParams.get('returnUrl');
        window.location.href = returnUrl || '/dashboard'; // Force reload to update auth state
      } else {
        message.error(data.error || '登录失败');
      }
    } catch (error) {
      message.error('网络错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm shadow-lg">
      <div className="text-center mb-6">
        <Title level={3}>用户登录</Title>
      </div>

      <Form
        name="login"
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="phone"
          rules={[{ required: true, message: '请输入手机号' }]}
        >
          <Input 
            prefix={<UserOutlined />} 
            placeholder="手机号" 
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="密码" 
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block size="large" loading={loading}>
            登录
          </Button>
        </Form.Item>
        
        <div className="text-center">
           <Link href="/register">没有账号？去注册</Link>
        </div>
      </Form>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Suspense fallback={<Card className="w-full max-w-sm shadow-lg p-8 text-center">加载中...</Card>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
