'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button, message, Card, Typography } from 'antd';
import { LockOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function AdminLoginPage() {
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!key) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/check?adminKey=${key}`);
      const data = await res.json();
      
      if (res.ok && data.valid) {
        message.success('验证成功');
        // Store in localStorage for persistence across admin pages
        localStorage.setItem('adminKey', key);
        router.push('/admin/dashboard');
      } else {
        message.error('密钥错误');
      }
    } catch {
      message.error('验证请求失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-sm shadow-xl">
        <div className="text-center mb-8">
          <Title level={3}>管理员验证</Title>
        </div>
        <div className="space-y-4">
          <Input.Password
            size="large"
            prefix={<LockOutlined />}
            placeholder="请输入 Admin Key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onPressEnter={handleLogin}
          />
          <Button 
            type="primary" 
            block 
            size="large" 
            onClick={handleLogin}
            loading={loading}
          >
            进入后台
          </Button>
        </div>
      </Card>
    </div>
  );
}
