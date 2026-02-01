'use client';

import { Button, Card, Typography, message } from 'antd';
import { WechatOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/wechat/url');
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        message.error('获取登录链接失败');
      }
    } catch (error) {
      console.error(error);
      message.error('登录请求失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <Title level={3} className="mb-8">格学志愿填报系统</Title>
        <Button 
          type="primary" 
          icon={<WechatOutlined />} 
          size="large" 
          block 
          onClick={handleLogin}
          loading={loading}
          className="bg-[#07c160] hover:!bg-[#06ad56]"
        >
          微信扫码登录
        </Button>
      </Card>
    </div>
  );
}
