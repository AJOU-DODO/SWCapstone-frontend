// src/app/admin/login/callback/page.tsx
'use client';

import { useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginCallbackPage() {
  return (
    <Suspense fallback={<LoadingUI />}>
      <CallbackContent />
    </Suspense>
  );
}

function LoadingUI() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#E8E4CD] gap-4">
      <svg className="h-10 w-10 animate-spin text-[#2B6340]" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <p className="text-sm font-semibold text-[#2B6340] animate-pulse">
        로그인 인증 정보를 확인 중입니다...
      </p>
    </div>
  );
}

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;

    const status = searchParams.get('status');
    if (!status) return;

    processed.current = true;

    if (status === 'SUCCESS') {
      const accessToken = searchParams.get('accessToken');
      const refreshToken = searchParams.get('refreshToken');

      if (accessToken) {
        // 30분
        const accessMaxAge = 60 * 30; 
        document.cookie = `accessToken=${accessToken}; path=/; max-age=${accessMaxAge}; SameSite=Lax; Secure`;

        if (refreshToken) {
          // 임시. 7일로 설정.
          const refreshMaxAge = 60 * 60 * 24 * 7;
          document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${refreshMaxAge}; SameSite=Lax; Secure`;
        }

        router.replace('/admin/users');
      }
    } else {
      const code = searchParams.get('code');
      const rawReason = searchParams.get('reason') || '알 수 없는 오류가 발생했습니다.';
      
      const reason = decodeURIComponent(rawReason);

      alert(`로그인 실패 [${code}]: ${reason}`);
      
      router.replace('/admin/login');
    }
  }, [searchParams, router]);
  
  return (
  <div className="fixed inset-0 flex items-center justify-center bg-[#E8E4CD] z-[9999]">
    <span className="text-sm font-semibold text-[#2B6340] animate-pulse">
      구글 로그인 처리 중입니다...
    </span>
  </div>
);;
}