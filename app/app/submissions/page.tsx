'use client';

import React, { useEffect, useState } from 'react';
import { Table, Button, Typography, message, Tag } from 'antd';
import { useRouter } from 'next/navigation';
import { EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { ISubmission } from '@/types';

const { Title } = Typography;

export default function SubmissionsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ISubmission[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/submissions/my');
      const json = await res.json();
      if (res.ok) {
        setData(json);
      } else {
        message.error('加载记录失败');
      }
    } catch (error) {
      console.error(error);
      message.error('网络错误');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: '提交时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '表单类型',
      dataIndex: 'formType',
      key: 'formType',
      render: (type: string) => (
        <Tag color={type === 'undergrad' ? 'blue' : 'green'}>
          {type === 'undergrad' ? '本科志愿约谈表' : '专科志愿单'}
        </Tag>
      ),
    },
    {
      title: '姓名',
      dataIndex: ['data', 'profile', 'name'],
      key: 'name',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: ISubmission) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />} 
          onClick={() => router.push(`/app/submissions/${record._id}`)}
        >
          查看详情
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={3} className="mb-6">我的提交记录</Title>
      <Table 
        columns={columns} 
        dataSource={data} 
        rowKey="_id" 
        loading={loading}
      />
    </div>
  );
}
