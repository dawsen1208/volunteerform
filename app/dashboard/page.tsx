"use client";

import { useEffect, useState } from 'react';
import { Card, Button, Typography, List, Tag, Skeleton, message, Divider } from 'antd';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogoutOutlined, FormOutlined, PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/user');
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        fetchSubmissions();
      } else {
        router.push('/login');
      }
    } catch (error) {
      router.push('/login');
    }
  };

  const fetchSubmissions = async () => {
    try {
      const res = await fetch('/api/user/submissions');
      const data = await res.json();
      if (res.ok) {
        setSubmissions(data.submissions || []);
      }
    } catch (error) {
      message.error('获取提交记录失败');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <Skeleton active />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Title level={3} className="!mb-0">个人中心</Title>
            <Text type="secondary">欢迎, {user?.phone}</Text>
          </div>
          <Button icon={<LogoutOutlined />} onClick={handleLogout}>退出登录</Button>
        </div>

        <Card title="我的表单" className="shadow-sm mb-6" extra={
             <Link href="/">
                <Button type="primary" icon={<PlusOutlined />}>新建表单</Button>
             </Link>
        }>
          {submissions.length === 0 ? (
             <div className="text-center py-8 text-gray-500">
                暂无提交记录
             </div>
          ) : (
            <List
                itemLayout="horizontal"
                dataSource={submissions}
                renderItem={(item) => (
                <List.Item
                    actions={[
                    <Link key="edit" href={`/form/${item.formType}?id=${item._id}`}>
                        <Button type="link" icon={<FormOutlined />}>修改</Button>
                    </Link>
                    ]}
                >
                    <List.Item.Meta
                    title={
                        <div className="flex items-center gap-2">
                            <span>{item.formType === 'undergrad' ? '本科志愿约谈表' : '专科志愿单'}</span>
                            <Tag color="blue">{new Date(item.createdAt).toLocaleDateString()}</Tag>
                        </div>
                    }
                    description={`提交ID: ${item._id}`}
                    />
                </List.Item>
                )}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
