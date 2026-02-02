'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout, Button, Table, Tag, message, Tabs, Card, InputNumber, Select, Input, Space, Typography } from 'antd';
import { LogoutOutlined, ReloadOutlined, PlusOutlined, DownloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useCallback } from 'react';

const { Header, Content } = Layout;

export default function AdminDashboard() {
  const router = useRouter();
  const [adminKey, setAdminKey] = useState('');
  const [activeTab, setActiveTab] = useState('submissions');
  
  // Data states
  const [submissions, setSubmissions] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);

  // Token generation
  const [genCount, setGenCount] = useState(1);
  const [genType, setGenType] = useState('undergrad');
  const [genDesc, setGenDesc] = useState('');
  const [genLoading, setGenLoading] = useState(false);

  const fetchData = useCallback(async (key: string) => {
    setLoading(true);
    try {
      if (activeTab === 'submissions') {
        const res = await fetch(`/api/admin/submissions?adminKey=${key}`);
        if (res.status === 403) throw new Error('Auth failed');
        const data = await res.json();
        setSubmissions(data);
      } else {
        const res = await fetch(`/api/admin/tokens?adminKey=${key}`);
        if (res.status === 403) throw new Error('Auth failed');
        const data = await res.json();
        setTokens(data);
      }
    } catch (error) {
      if ((error as Error).message === 'Auth failed') {
        router.push('/admin');
      } else {
        message.error('获取数据失败或密钥失效');
      }
    } finally {
      setLoading(false);
    }
  }, [activeTab, router]);

  useEffect(() => {
    const key = localStorage.getItem('adminKey');
    if (!key) {
      router.push('/admin');
      return;
    }
    setAdminKey(key);
    fetchData(key);
  }, [router, activeTab, fetchData]);

  const handleLogout = () => {
    localStorage.removeItem('adminKey');
    router.push('/admin');
  };

  const handleGenerateTokens = async () => {
    setGenLoading(true);
    try {
      const res = await fetch(`/api/admin/tokens?adminKey=${adminKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: genType,
          count: genCount,
          description: genDesc,
          daysValid: 30 // Default 30 days
        })
      });
      
      if (res.ok) {
        message.success(`成功生成 ${genCount} 个 Token`);
        setGenDesc('');
        fetchData(adminKey); // Refresh list
      } else {
        message.error('生成失败');
      }
    } catch {
      message.error('网络错误');
    } finally {
      setGenLoading(false);
    }
  };
  
  const exportCSV = () => {
     if (!submissions.length) return;
     
     // Simple CSV export logic
     const headers = ['提交时间', '类型', '姓名', '电话', '考号', 'Token'];
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
     const rows = submissions.map((s: any) => [
         new Date(s.createdAt).toLocaleString(),
         s.formType === 'undergrad' ? '本科' : '专科',
         s.data.profile.name,
         s.data.profile.studentPhone,
         s.data.profile.examCandidateNumber,
         s.token
     ]);
     
     const csvContent = "\uFEFF" + [headers, ...rows].map(e => e.join(",")).join("\n");
     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
     const url = URL.createObjectURL(blob);
     const link = document.createElement("a");
     link.setAttribute("href", url);
     link.setAttribute("download", `submissions_${new Date().toISOString().slice(0,10)}.csv`);
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submissionColumns: ColumnsType<any> = [
    { title: '姓名', dataIndex: ['data', 'profile', 'name'], key: 'name' },
    { title: '电话', dataIndex: ['data', 'profile', 'studentPhone'], key: 'phone' },
    { 
      title: '类型', 
      dataIndex: 'formType', 
      key: 'type',
      render: (t) => <Tag color={t === 'undergrad' ? 'blue' : 'orange'}>{t === 'undergrad' ? '本科' : '专科'}</Tag>
    },
    { title: '提交时间', dataIndex: 'createdAt', key: 'time', render: (t) => new Date(t).toLocaleString() },
    { title: 'Token', dataIndex: 'token', key: 'token', ellipsis: true },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tokenColumns: ColumnsType<any> = [
    { 
      title: 'Token', 
      dataIndex: 'token', 
      key: 'token', 
      render: (text) => <Typography.Text copyable>{text}</Typography.Text> 
    },
    { 
      title: '类型', 
      dataIndex: 'formType', 
      key: 'type',
      render: (t) => <Tag color={t === 'undergrad' ? 'blue' : 'orange'}>{t === 'undergrad' ? '本科' : '专科'}</Tag>
    },
    { title: '描述', dataIndex: 'description', key: 'desc' },
    { title: '过期时间', dataIndex: 'expiresAt', key: 'expires', render: (t) => new Date(t).toLocaleDateString() },
    { 
       title: '链接 (点击复制)', 
       key: 'link',
       render: (_, record) => {
           const url = `${window.location.origin}/form/${record.formType}?token=${record.token}`;
           return (
               <Button size="small" type="link" onClick={() => {
                   navigator.clipboard.writeText(url);
                   message.success('链接已复制');
               }}>
                   复制链接
               </Button>
           )
       }
    }
  ];

  return (
    <Layout className="min-h-screen">
      <Header className="flex justify-between items-center px-6 bg-gray-900 text-white">
        <div className="text-lg font-bold">格学志愿 - 管理后台</div>
        <Button icon={<LogoutOutlined />} onClick={handleLogout} ghost>退出</Button>
      </Header>
      <Content className="p-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            type="card"
            items={[
              {
                label: '提交记录',
                key: 'submissions',
                children: (
                  <Card title="提交列表" extra={<Button icon={<DownloadOutlined />} onClick={exportCSV}>导出CSV</Button>}>
                    <Table 
                      dataSource={submissions} 
                      columns={submissionColumns} 
                      rowKey="_id" 
                      loading={loading}
                      pagination={{ pageSize: 20 }}
                    />
                  </Card>
                ),
              },
              {
                label: 'Token 管理',
                key: 'tokens',
                children: (
                  <div className="space-y-6">
                    <Card title="生成新 Token">
                      <Space wrap>
                        <Select value={genType} onChange={setGenType} options={[
                          { label: '本科志愿表', value: 'undergrad' },
                          { label: '专科志愿表', value: 'junior' }
                        ]} style={{ width: 150 }} />
                        <InputNumber min={1} max={50} value={genCount} onChange={(v) => setGenCount(v || 1)} addonBefore="数量" />
                        <Input placeholder="备注 (如: 三班学生)" value={genDesc} onChange={e => setGenDesc(e.target.value)} style={{ width: 200 }} />
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleGenerateTokens} loading={genLoading}>生成</Button>
                      </Space>
                    </Card>
                    <Card title="有效 Token 列表" extra={<Button icon={<ReloadOutlined />} onClick={() => fetchData(adminKey)} />}>
                      <Table 
                        dataSource={tokens} 
                        columns={tokenColumns} 
                        rowKey="_id" 
                        loading={loading}
                        pagination={{ pageSize: 10 }}
                      />
                    </Card>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </Content>
    </Layout>
  );
}
