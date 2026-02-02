import { Button, Result } from 'antd';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Result
        status="info"
        title="志愿填报系统"
        subTitle="请通过扫描管理员提供的二维码访问表单"
        extra={[
          <Link key="admin" href="/admin">
            <Button type="primary">管理员入口</Button>
          </Link>
        ]}
      />
    </div>
  );
}
