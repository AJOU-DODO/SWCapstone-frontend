"use client";

import Image from "next/image";
import { useState } from "react";

import { NestDetailHeader } from '@/types/indexAdmin';
import { useReportActions } from "@/lib/hooks/useReportActions";
import RejectModal from "@/components/admin/nest/RejectModal";
import DeleteModal from "@/components/admin/nest/DeleteModal";

export default function DetailHeader ({ header, triggerRefresh, onClose }: { header: NestDetailHeader; triggerRefresh: () => void; onClose: () => void; }) {
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { handleNestRejectReport, isLoading: isRejectLoading } = useReportActions({
    targetId: header.nestId,
    onSuccess: () => {
      setIsRejectModalOpen(false);
      triggerRefresh();
    }
  });

  const { handleNestDelete, isLoading: isDeleteLoading } = useReportActions({
    targetId: header.nestId,
    onSuccess: () => {
      setIsDeleteModalOpen(false);
      triggerRefresh();
      onClose();
    }
  });

  return (
  <div className="flex flex-row justify-between items-start md:items-end gap-4 p-4 border-b bg-[#E8E4CD] w-full">
    <div className="flex flex-row items-end gap-2 flex-shrink-0">
      <div className="w-[50px] h-[50px] rounded-full overflow-hidden border-2 border-[#54513E] flex-shrink-0">
        <Image 
          src={header.profileImageUrl}
          alt="DODO 로고"
          width={50}
          height={50}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="text-[#54513E] truncate font-medium whitespace-nowrap">
        {header.authorNickname}
      </div>
      <div className="pl-3 text-xs text-gray-500 whitespace-nowrap pb-0.5">
        {new Date(header.createdAt).toLocaleDateString()} {/*생성일*/}
      </div>
    </div>
    <div className="flex flex-col gap-1 text-[11px] leading-tight text-gray-500 justify-center flex-1 min-w-0 px-2 items-end text-right">
      <div>
        최초 신고일: {header.firstReportedAt ? new Date(header.firstReportedAt).toLocaleDateString() : "--.--.--"}
      </div>
      <div>
        최근 신고일: {header.lastReportedAt ? new Date(header.lastReportedAt).toLocaleDateString() : "--.--.--"}
      </div>
    </div>
    
    <div 
    className="flex flex-row gap-2 items-end flex-shrink-0 w-full md:w-auto justify-end">
      {!header.deleted && (
        <>
        {header.firstReportedAt && (
          <button 
          onClick={() => setIsRejectModalOpen(true)}
          className="rounded-md border-2 h-9 w-16 border-black text-sm hover:bg-black/5 transition-colors"> 
            취소 
          </button>
        )}
        
        <button 
        onClick={() => setIsDeleteModalOpen(true)}
        className="rounded-md border-2 h-9 w-16 border-black text-sm hover:bg-black/5 transition-colors">
          삭제 
        </button>
        </>
      )}

      <RejectModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleNestRejectReport}
        isLoading={isRejectLoading}
        title="신고 반려 확인"
        message="정말로 이 콘텐츠에 들어온 모든 대기 상태의 신고를 반려하시겠습니까?"
      />

      <DeleteModal
        authorId={header.authorId}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleNestDelete}
        isLoading={isDeleteLoading}
        title="게시물 삭제 확인"
        message="정말로 이 콘텐츠를 삭제하시겠습니까?"
      />
    </div>
  </div>
  );
};