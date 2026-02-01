'use client';

import React, { useEffect, useState, use } from 'react';
import { Card, Typography, Descriptions, message, Button, Spin, Tag, Divider } from 'antd';
import { useRouter } from 'next/navigation';
import { ArrowLeftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;

export default function SubmissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const fetchData = async (subId: string) => {
    try {
      const res = await fetch(`/api/submissions/my/${subId}`);
      const json = await res.json();
      if (res.ok) {
        setData(json);
      } else {
        message.error('加载详情失败');
      }
    } catch (error) {
      console.error(error);
      message.error('网络错误');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-12"><Spin size="large" /></div>;
  if (!data) return <div className="text-center p-12">未找到记录</div>;

  const { formType, createdAt, data: formData } = data;
  const { profile, health, exam, preference, majors, undergradSpecial, juniorSpecial } = formData;

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>返回</Button>
        <Title level={3} style={{ margin: 0 }}>提交详情</Title>
      </div>

      <Card className="mb-6">
        <Descriptions title="基本信息" bordered column={{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
          <Descriptions.Item label="表单类型">
            <Tag color={formType === 'undergrad' ? 'blue' : 'green'}>
              {formType === 'undergrad' ? '本科志愿约谈表' : '专科志愿单'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="提交时间">{dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
          <Descriptions.Item label="姓名">{profile?.name}</Descriptions.Item>
          <Descriptions.Item label="性别">{profile?.gender}</Descriptions.Item>
          <Descriptions.Item label="电话">{profile?.studentPhone}</Descriptions.Item>
          <Descriptions.Item label="身份证">{profile?.idNumber}</Descriptions.Item>
          <Descriptions.Item label="考生号">{profile?.examCandidateNumber}</Descriptions.Item>
          <Descriptions.Item label="总分">{exam?.totalScore}</Descriptions.Item>
          <Descriptions.Item label="位次">{exam?.rankPosition}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card className="mb-6" title="详细数据">
        <div className="bg-gray-50 p-4 rounded overflow-auto">
          <pre className="whitespace-pre-wrap text-sm">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      </Card>
    </div>
  );
}
