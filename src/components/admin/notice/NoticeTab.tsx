// src/components/admin/NoticeTabs.tsx
"use client";

import { useRouter, useSearchParams } from 'next/navigation';

export default function NoticeTab() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 현재 주소창에서 status 값을 읽어옴 (없으면 'ALL'이 기본값)
  const currentStatus = searchParams.get('status') ?? 'ALL';

  const tabs = [
    { id: 'ALL', label: '전체' },
    { id: 'PUBLISHED', label: '발행 완료' },
    { id: 'DRAFT', label: '임시 저장' },
  ];

  const handleTabChange = (status: string) => {
    if (status === 'ALL') {
      router.push('/admin/notices');
    } else {
      router.push(`/admin/notices?status=${status}`);
    }
  };

  return (
    <div className="flex gap-2 border-b border-gray-200 pb-2 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabChange(tab.id)}
          className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${
            currentStatus === tab.id
              ? 'border-b-2 border-[#2B6340] text-[#2B6340]'
              : 'text-gray-500 hover:text-black'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}