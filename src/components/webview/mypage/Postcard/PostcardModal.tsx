// PostcardModal.tsx
import React from 'react';
import Image from 'next/image';
import type { MyPostcard } from "@/types/indexMypage";

interface PostcardModalProps {
  isOpen: boolean;
  onClose: () => void;
  postcardData: MyPostcard | null;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default function PostcardModal({ isOpen, onClose, postcardData }: PostcardModalProps) {
  if (!isOpen || !postcardData) return null;
  console.log(postcardData.content);

  return (
    // 1. 배경 (Dim 처리 및 클릭 시 닫기)
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose} // 배경 클릭 시 닫기
    >
      {/* 2. 모달 컨텐츠 바구니 (컨텐츠 영역 클릭 시 닫힘 방지) */}
      <div 
        className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* 닫기 버튼 */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-black/20 p-2 text-white hover:bg-black/40 transition-colors"
        >
          ✕
        </button>

        {/* 엽서 이미지 영역 */}
        <div className="relative relative aspect-[4/3] w-full bg-gray-100">
          <Image 
            src={postcardData.imageUrl} 
            alt={postcardData.content}
            fill
            className="h-full w-full object-cover"
          />
        </div>

        {/* 엽서 텍스트 영역 */}
        <div className="p-6">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[#54513E]">{postcardData.content}</p>
          </div>

          <div className="flex flex-row justify-between border-t pt-4">
            <span className="text-sm text-gray-500">{formatDate(postcardData.createdAt)}</span>
            <p className="text-right text-sm font-medium text-[#54513E]">
              From. {postcardData.authorNickname}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}