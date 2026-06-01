"use client";

import { useState } from "react";
import Image from "next/image";

import { PostcardList } from "@/types/indexAdmin";
import { useReportActions } from "@/hooks/admin/useReportActions";
import RejectModal from "@/components/admin/nest/RejectModal";
import DeleteModal from "@/components/admin/nest/DeleteModal";

interface PostcardDetailModalProps {
  postcard: PostcardList;
  onClose: () => void;
  triggerRefresh: () => void;
}

export default function PostcardDetailModal({ postcard, onClose, triggerRefresh,}: PostcardDetailModalProps) {
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { handlePostcardRejectReport, isLoading: isRejectLoading } =
    useReportActions({
      targetId: postcard.postcardId,
      onSuccess: () => {
        setIsRejectModalOpen(false);
        triggerRefresh();
      },
    });

  const { handlePostcardDelete, isLoading: isDeleteLoading } =
    useReportActions({
      targetId: postcard.postcardId,
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        triggerRefresh();
        onClose();
      },
    });

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col md:flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 이미지 영역 */}
        <div className="relative aspect-[5/3] md:w-full bg-black flex-shrink-0">
          <Image
            src={postcard.imageUrl}
            alt="상세 보기"
            fill
            className="object-cover object-center"
          />
        </div>

        {/* 신고 상세 내용 및 관리자 액션 */}
        <div className="p-6 md:w-full flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <span className="text-sm font-bold text-gray-800">
                @{postcard.authorNickname}의 엽서
              </span>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-gray-400 mb-1">
                  엽서 본문 내용
                </h3>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100 leading-relaxed">
                  {postcard.content}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-400 mb-1">
                  신고 사유 태그
                </h3>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {postcard.reasons.map((reason: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-red-50 text-red-600 px-2 py-0.5 rounded-md border border-red-100 font-medium"
                    >
                      {reason}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 관리자 액션 버튼 */}
          <div className="flex space-x-2 mt-6 pt-4 border-t">
            <button
              onClick={() => setIsRejectModalOpen(true)}
              className="flex-1 py-2 rounded-xl text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
            >
              신고 반려 (유지)
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex-1 py-2 rounded-xl text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition shadow-sm"
            >
              엽서 강제 삭제
            </button>

            <RejectModal
              isOpen={isRejectModalOpen}
              onClose={() => setIsRejectModalOpen(false)}
              onConfirm={handlePostcardRejectReport}
              isLoading={isRejectLoading}
              title="신고 반려 확인"
              message="정말로 이 콘텐츠에 들어온 대기 상태의 신고를 반려하시겠습니까?"
            />

            <DeleteModal
              authorId={postcard.postcardId}
              isOpen={isDeleteModalOpen}
              onClose={() => setIsDeleteModalOpen(false)}
              onConfirm={handlePostcardDelete}
              isLoading={isDeleteLoading}
              title="엽서 삭제 확인"
              message="정말로 이 콘텐츠를 삭제하시겠습니까?"
            />
          </div>
        </div>
      </div>
    </div>
  );
}