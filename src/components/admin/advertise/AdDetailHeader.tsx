"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from 'next/navigation';

import { AdNestDetailHeader } from '@/types/indexAdmin';
import AdDeleteButton from "@/components/admin/advertise/AdDeleteButton";

export default function AdDetailHeader ({ header, listUrl}: { header: AdNestDetailHeader; listUrl: string}) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const router = useRouter();

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
    <div className="flex flex-row gap-6 md:gap-8 text-xs text-gray-500 flex-1 justify-start md:justify-center whitespace-nowrap pb-0.5">
      <div>
        📍
      </div>
      <div>
        {header.latitude.toFixed(4)}
      </div>
      <div>
        {header.longitude.toFixed(4)}
      </div>
    </div>
    
    <div 
    className="flex flex-row gap-2 items-end flex-shrink-0 w-full md:w-auto justify-end">
      {!header.deleted && (
        <>
          <button 
          onClick={() => setIsDeleteModalOpen(true)}
          className="rounded-md border-2 h-9 w-16 border-black text-sm hover:bg-black/5 transition-colors">
            삭제 
          </button>
        </>
      )}

      <AdDeleteButton
        nestId={header.nestId}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={() => router.push(listUrl)}
        title="광고 삭제 확인"
        message="정말로 이 콘텐츠를 삭제하시겠습니까?"
      />
    </div>
  </div>
  );
};