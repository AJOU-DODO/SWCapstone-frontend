'use client';

import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post('/api/v1/auth/logout', {});
      console.log('서버 로그아웃 처리 완료');
    } catch (error) {
      console.error('서버 로그아웃 요청 실패:', error);
    } finally {
      document.cookie = 'accessToken=; path=/; max-age=0; SameSite=Lax; Secure';
      document.cookie = 'refreshToken=; path=/; max-age=0; SameSite=Lax; Secure';

      router.replace('/admin/login');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-[#2B6340] hover:bg-red-50 hover:text-red-700 transition-colors mt-auto"
    >
      <LogOut className="h-5 w-5" />
      <span>로그아웃</span>
    </button>
  );
}