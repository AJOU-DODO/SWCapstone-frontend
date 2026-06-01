"use client";

import { useState } from "react";
import Image from "next/image";

import { PostcardList } from '@/types/indexAdmin';
import PostcardDetailModal from "@/components/admin/postcard/PostcardDetailModal";

export default function PostcardGrid({postcards, triggerRefresh} : {postcards: PostcardList[]; triggerRefresh: () => void;}) {
  const [selectedPostcard, setSelectedPostcard] = useState< PostcardList | null >(null);

  const handleOpenModal = (postcard: PostcardList) => {
    setSelectedPostcard(postcard);
  };

  const handleCloseModal = () => {
    setSelectedPostcard(null);
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {postcards.map((postcard) => (
          <div
            key={postcard.postcardId}
            onClick={() => handleOpenModal(postcard)}
            className="group relative aspect-[5/3] w-full overflow-hidden rounded-xl bg-gray-200 border border-[#54513E] shadow-sm cursor-pointer"
          >
            <Image
              src={postcard.imageUrl}
              alt={postcard.content}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw" //사이즈 비율 나중에 확인 후 수정하기
              className="object-cover transition-transform duration-300 group-hover:scale-105" 
            />

            {/* 엽서에 마우스 호버 시 나타나는 정보 */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3 text-white">
              <span className="text-[11px] font-semibold bg-red-600 px-1.5 py-0.5 rounded-md self-start mb-1">
                🚨 {postcard.reasons}
              </span>
              <p className="text-xs truncate font-medium">@{postcard.authorNickname}</p>
              <p className="text-xs truncate font-medium">{postcard.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ➡️ 2. 사진 클릭 시 뜨는 대형 상세보기 모달 (라이트박스) */}
      {selectedPostcard && (
        <PostcardDetailModal
          postcard={selectedPostcard}
          onClose={handleCloseModal}
          triggerRefresh={triggerRefresh}
        />
      )}
    </div>
  );
}