'use client';

import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from "react";

function AdvertiseTabButtonInner(){
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'APPROVED';

  const handleTabChange = (tab: string) => {
    router.push(`/admin/ads?tab=${tab}`);
  };

  const getTabStyle = (tab: string) => 
    `rounded-sm transition-all border-2 h-[7vh] pl-20 pr-20 border-[#54513E] bg-transparent flex items-center gap-1 ${activeTab === tab ? 'bg-[#54513E]/70 text-white hover:bg-[#54513E]/80 hover:text-white' : 'text-[#54513E] hover:bg-[#54513E]/30'}`;

  return (
    <div className="flex gap-2">
      <Button onClick={() => handleTabChange('APPROVED')} className={getTabStyle('APPROVED')}>
        광고글 관리
      </Button>
      <Button onClick={() => handleTabChange('PENDING')} className={getTabStyle('PENDING')}>
        승인 요청 광고
      </Button>
    </div>
  );
}
export default function AdvertiseTabButton() {
  return (
    <Suspense fallback={null}>
      <AdvertiseTabButtonInner />
    </Suspense>
  );
}