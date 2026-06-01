"use client";

import { useState } from "react";
import Image from "next/image";

import { PostcardList } from '@/types/indexAdmin';

export default function PostcardGrid({postcards} : {postcards: PostcardList[]}) {
  const [selectedPostcard, setSelectedPostcard] = useState< PostcardList | null >(null);

  const handleOpenModal = (postcard: PostcardList) => {
    setSelectedPostcard(postcard);
  };

  const handleCloseModal = () => {
    setSelectedPostcard(null);
  };

  const handleAction = (type: "APPROVE" | "DELETE") => {
    if (type === "APPROVE") {
      alert("신고 반려 처리되었습니다.");
    } else {
      alert("엽서 강제 삭제 처리되었습니다.");
    }
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
        <div 
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
          onClick={handleCloseModal} // 바깥 검은 배경 클릭 시 닫힘
        >
          {/* 모달 알맹이 (이 안쪽을 클릭했을 땐 닫히지 않도록 e.stopPropagation 처리) */}
          <div 
            className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col md:flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 좌측: 큰 이미지 구역 */}
            <div className="relative aspect-[5/3] md:w-full bg-black flex-shrink-0">
              <Image
                src={selectedPostcard.imageUrl}
                alt="상세 보기"
                fill
                className="object-cover object-center" // 원본 비율 보존하면서 크게 보여주기
              />
            </div>

            {/* 우측: 신고 상세 내용 및 관리자 액션 구역 */}
            <div className="p-6 md:w-full flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex items-center justify-between border-b pb-3 mb-4">
                  <span className="text-sm font-bold text-gray-800">@{selectedPostcard.authorNickname}의 엽서</span>
                  <button 
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600 text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-semibold text-gray-400 mb-1">엽서 본문 내용</h3>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100 leading-relaxed">
                      {selectedPostcard.content}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-gray-400 mb-1">신고 사유 태그</h3>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {selectedPostcard.reasons.map((reason: string, idx: number) => (
                        <span key={idx} className="text-[11px] bg-red-50 text-red-600 px-2 py-0.5 rounded-md border border-red-100 font-medium">
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 하단 관리자 기능 버튼들 */}
              <div className="flex space-x-2 mt-6 pt-4 border-t">
                <button 
                  onClick={() => { alert("반려 처리"); setSelectedPostcard(null); }}
                  className="flex-1 py-2 rounded-xl text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                >
                  신고 반려 (유지)
                </button>
                <button 
                  onClick={() => { alert("삭제 처리"); setSelectedPostcard(null); }}
                  className="flex-1 py-2 rounded-xl text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition shadow-sm"
                >
                  엽서 강제 삭제
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}