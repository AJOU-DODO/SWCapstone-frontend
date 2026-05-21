'use client';

import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_IP || 'http://localhost:8080';
    const CALLBACK_URL = encodeURIComponent(window.location.origin + "/admin/login/callback");

    window.location.href = `${SERVER_URL}/oauth2/authorization/google?redirect_uri=${CALLBACK_URL}`;
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#E8E4CD]">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-[#FAF7E4] p-10 shadow-xl">
        
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#2B6340]">
            DODO ADMIN
          </h1>
          <p className="mt-3 text-sm text-[#2B6340]">
            도도 서비스 관리를 위한 총괄 관리자 페이지입니다.
          </p>
        </div>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-[#54513E]"></div>
          <span className="flex-shrink mx-4 text-[#54513E] text-xs uppercase tracking-wider">
            소셜 로그인 인증
          </span>
          <div className="flex-grow border-t border-[#54513E]"></div>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#54513E] bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <svg className="h-5 w-5 animate-spin text-slate-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <FcGoogle className="text-xl" />
            )}
            {isLoading ? '구글 로그인 페이지로 이동 중...' : 'Google 계정으로 로그인'}
          </button>
        </div>

        <div className="text-center text-xs text-[#54513E]/50">
          &copy; {new Date().getFullYear()} DODO Team. All rights reserved.
        </div>
      </div>
    </div>
  );
}