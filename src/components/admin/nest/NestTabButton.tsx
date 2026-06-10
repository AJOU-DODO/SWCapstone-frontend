'use client';

import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from "react";

function NestTabButtonInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'all'; // 기본값 'all'

  const handleTabChange = (tab: string) => {
    router.push(`/admin/nests?tab=${tab}`);
  };

  const getTabStyle = (tab: string) => 
    `rounded-sm transition-all border-2 h-[7vh] pl-20 pr-20 border-[#54513E] bg-transparent flex items-center gap-1 ${activeTab === tab ? 'bg-[#54513E]/70 text-white hover:bg-[#54513E]/80 hover:text-white' : 'text-[#54513E] hover:bg-[#54513E]/30'}`;

  return (
    <div className="flex gap-2">
      <Button onClick={() => handleTabChange('all')} className={getTabStyle('all')}>
        전체
      </Button>
      <Button onClick={() => handleTabChange('reported')} className={getTabStyle('reported')}>
        신고
      </Button>
      <Button onClick={() => handleTabChange('comments')} className={getTabStyle('comments')}>
        신고 댓글
      </Button>
    </div>
  );
}

export default function NestTabButton() {
  return (
    <Suspense fallback={null}>
      <NestTabButtonInner />
    </Suspense>
  );
}