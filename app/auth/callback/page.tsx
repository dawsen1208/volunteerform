'use client';

import { useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Spin, message, Typography } from 'antd';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;

    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code || !state) {
      message.error('参数错误');
      router.push('/login');
      return;
    }

    const login = async () => {
      try {
        const res = await fetch('/api/auth/wechat/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, state }),
        });

        const data = await res.json();

        if (res.ok) {
          message.success('登录成功');
          router.push('/app');
        } else {
          message.error(data.error || '登录失败');
          router.push('/login');
        }
      } catch (error) {
        console.error(error);
        message.error('网络错误');
        router.push('/login');
      }
    };

    login();
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Spin size="large" />
        <Typography.Paragraph className="mt-4">正在登录...</Typography.Paragraph>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Spin size="large" />
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
