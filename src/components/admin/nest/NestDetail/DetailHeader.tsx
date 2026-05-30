"use client";

import Image from "next/image";
import { useState } from "react";

import { NestDetailHeader } from '@/types/indexAdmin';
import { useReportActions } from "@/hooks/admin/useReportActions";
import RejectModal from "@/components/admin/nest/RejectModal";

export default function DetailHeader ({ header, triggerRefresh }: { header: NestDetailHeader; triggerRefresh: () => void; }) {
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const { handleNestRejectReport, isLoading } = useReportActions({
    targetId: header.nestId,
    onSuccess: () => {
      setIsRejectModalOpen(false);
      triggerRefresh();
    }
  });

  return (
  <div className="flex flex-row justify-between items-start md:items-end gap-4 p-4 border-b bg-[#E8E4CD] w-full">
    <div className="flex flex-row items-end gap-2 flex-shrink-0">
      <Image 
        src="/DODOLogo.png"
        alt="DODO 로고"
        width={50}
        height={50}
        className="rounded-full object-cover border-2 border-[#54513E]"
      />
      <div className="text-[#54513E] truncate font-medium whitespace-nowrap">
        {header.authorNickname}
      </div>
      <div className="pl-3 text-xs text-gray-500 whitespace-nowrap pb-0.5">
        {new Date(header.createdAt).toLocaleDateString()} {/*생성일*/}
      </div>
    </div>
    <div className="flex flex-row gap-6 md:gap-8 text-xs text-gray-500 flex-1 justify-start md:justify-center whitespace-nowrap pb-0.5">
      <div>
        최초 신고일: {header.firstReportedAt ? new Date(header.firstReportedAt).toLocaleDateString() : "--.--.--"}
      </div>
      <div>
        최근 신고일: {header.lastReportedAt ? new Date(header.lastReportedAt).toLocaleDateString() : "--.--.--"}
      </div>
    </div>
    
    <div 
    className="flex flex-row gap-2 items-end flex-shrink-0 w-full md:w-auto justify-end">
      {header.firstReportedAt && (
        <button 
        onClick={() => setIsRejectModalOpen(true)}
        className="rounded-md border-2 h-9 w-16 border-black text-sm hover:bg-black/5 transition-colors"> 
          취소 
        </button>
      )}
      
      <button 
      className="rounded-md border-2 h-9 w-16 border-black text-sm hover:bg-black/5 transition-colors">
        삭제 
      </button>

      <RejectModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleNestRejectReport} // 모달 안에서 확인을 누르면 실제 API 호출 로직 실행!
        isLoading={isLoading}
        title="신고 반려 확인"
        message="정말로 이 콘텐츠에 들어온 모든 대기 상태의 신고를 반려하시겠습니까?"
      />
    </div>
  </div>
  );
};