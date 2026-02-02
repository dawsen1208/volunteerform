'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button, message, Card, Typography } from 'antd';
import { LockOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!password) return;
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        message.success('登录成功');
        router.push('/admin/submissions');
        router.refresh(); // Refresh to update middleware/server components state
      } else {
        message.error('密码错误');
      }
    } catch {
      message.error('登录请求失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-sm shadow-xl">
        <div className="text-center mb-8">
          <Title level={3}>管理员登录</Title>
        </div>
        <div className="space-y-4">
          <Input.Password
            size="large"
            prefix={<LockOutlined />}
            placeholder="请输入管理员密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onPressEnter={handleLogin}
          />
          <Button 
            type="primary" 
            block 
            size="large" 
            onClick={handleLogin}
            loading={loading}
          >
            登录
          </Button>
        </div>
      </Card>
    </div>
  );
}
