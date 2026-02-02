"use client";

import { Button, Card, Typography, Divider } from 'antd';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';

const { Title, Paragraph } = Typography;

export default function Home() {
  const PRODUCTION_URL = 'https://volunteerform-kappa.vercel.app/';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg text-center">
        <Title level={2} className="!mb-2">志愿填报系统</Title>
        <Paragraph className="text-gray-500 mb-8">
          请选择对应的表单类型进行填写
        </Paragraph>

        <div className="space-y-4">
          <Link href="/form/undergrad" className="block">
            <Button type="primary" size="large" block className="h-12 text-lg">
              本科志愿约谈表
            </Button>
          </Link>
          
          <Link href="/form/junior" className="block">
            <Button size="large" block className="h-12 text-lg">
              专科志愿单
            </Button>
          </Link>
        </div>

        <div className="hidden md:flex flex-col items-center justify-center mt-8">
          <Divider>手机扫码填写</Divider>
          <div className="p-2 bg-white rounded-xl border border-gray-100 shadow-sm">
            <QRCodeSVG value={PRODUCTION_URL} size={150} level="H" />
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-100">
          <Link href="/admin/login" className="text-gray-400 hover:text-gray-600 text-sm">
            管理员入口
          </Link>
        </div>
      </Card>
    </div>
  );
}
