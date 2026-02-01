'use client';

import { Layout, Menu, Button, message } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import { FileTextOutlined, HistoryOutlined, LogoutOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      message.error('退出失败');
    }
  };

  const menuItems = [
    { key: '/app', icon: <FileTextOutlined />, label: '填报志愿' },
    { key: '/app/submissions', icon: <HistoryOutlined />, label: '我的记录' },
  ];

  return (
    <Layout className="min-h-screen">
      <Header className="flex items-center justify-between px-4 bg-white shadow-sm">
        <div className="text-lg font-bold">格学志愿</div>
        <div className="flex items-center gap-4">
          <Menu 
            mode="horizontal" 
            selectedKeys={[pathname]} 
            items={menuItems} 
            onClick={({ key }) => router.push(key)}
            className="border-none w-64"
          />
          <Button icon={<LogoutOutlined />} onClick={handleLogout}>退出</Button>
        </div>
      </Header>
      <Content className="p-6 bg-gray-50">
        <div className="mx-auto max-w-5xl">
          {children}
        </div>
      </Content>
    </Layout>
  );
}
