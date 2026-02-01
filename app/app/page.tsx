'use client';

import { Card, Typography, Button } from 'antd';
import { useRouter } from 'next/navigation';
import { FormOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Title level={2}>欢迎使用志愿填报系统</Title>
        <Paragraph>请根据您的实际情况选择相应的表单进行填写</Paragraph>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card 
          title="本科志愿约谈表" 
          hoverable
          className="shadow-md"
          actions={[
            <Button type="primary" key="fill" onClick={() => router.push('/app/forms/undergrad')}>
              立即填写
            </Button>
          ]}
        >
          <div className="h-32 flex flex-col items-center justify-center text-gray-500">
            <FormOutlined style={{ fontSize: '48px', marginBottom: '16px', color: '#1890ff' }} />
            <p>适用于计划申请本科院校的学生</p>
          </div>
        </Card>

        <Card 
          title="专科志愿单" 
          hoverable
          className="shadow-md"
          actions={[
            <Button type="primary" key="fill" onClick={() => router.push('/app/forms/junior')}>
              立即填写
            </Button>
          ]}
        >
          <div className="h-32 flex flex-col items-center justify-center text-gray-500">
            <FormOutlined style={{ fontSize: '48px', marginBottom: '16px', color: '#52c41a' }} />
            <p>适用于计划申请专科院校的学生</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
