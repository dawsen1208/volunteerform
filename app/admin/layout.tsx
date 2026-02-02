'use client';

import { Layout, Menu, Button, message } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import { UnorderedListOutlined, LogoutOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      message.success('已退出登录');
      // Use window.location.href to force a full reload and ensure clean state
      window.location.href = '/';
    } catch {
      message.error('退出失败');
    }
  };

  const menuItems = [
    { key: '/admin/submissions', icon: <UnorderedListOutlined />, label: '提交管理' },
  ];

  return (
    <Layout className="min-h-screen">
      <Header className="flex items-center justify-between px-4 bg-gray-900 shadow-sm">
        <div className="text-lg font-bold text-white">格学志愿 - 管理后台</div>
        <div className="flex items-center gap-4">
          <Menu 
            theme="dark"
            mode="horizontal" 
            selectedKeys={[pathname]} 
            items={menuItems} 
            onClick={({ key }) => router.push(key)}
            className="border-none w-64 bg-gray-900"
          />
          <Button icon={<LogoutOutlined />} onClick={handleLogout} ghost>退出</Button>
        </div>
      </Header>
      <Content className="p-6 bg-gray-100">
        <div className="mx-auto max-w-6xl bg-white p-6 rounded shadow">
          {children}
        </div>
      </Content>
    </Layout>
  );
}
