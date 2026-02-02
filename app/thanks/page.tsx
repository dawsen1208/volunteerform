'use client';

import React, { Suspense } from 'react';
import { Result, Button } from 'antd';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ThanksContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Result
        status="success"
        title="提交成功！"
        subTitle={
          <div className="space-y-2">
            <p>您的志愿表单已成功提交。</p>
            {id && <p className="text-gray-400 text-xs">提交编号: {id}</p>}
          </div>
        }
        extra={[
          <Link key="home" href="/">
            <Button type="primary">返回首页</Button>
          </Link>
        ]}
      />
    </div>
  );
}

export default function ThanksPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThanksContent />
    </Suspense>
  );
}
