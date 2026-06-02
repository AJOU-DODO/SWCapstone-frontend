// PostcardModal.tsx
import React from "react";
import Image from "next/image";
import { Pencil, Trash2, AlertCircle } from "lucide-react";
import { PostcardReactions } from "./PostcardReactions";
import type { MyPostcard } from "@/types/indexMypage";
import { REACTION_LABELS, PostcardReactionType } from "@/types/indexMypage";

interface PostcardModalProps {
  isOpen: boolean;
  onClose: () => void;
  postcardData: MyPostcard | null;
  activeTab: "mine" | "sent" | "received";
  accessToken: string;
  onEditClick: () => void;
  onDeleteClick: () => void;
  onReportClick: () => void;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default function PostcardModal({
  isOpen,
  onClose,
  postcardData,
  activeTab,
  accessToken,
  onEditClick,
  onDeleteClick,
  onReportClick,
}: PostcardModalProps) {
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
        <div className="relative aspect-4/3 w-full bg-gray-100">
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
            <span className="text-sm text-gray-500">
              {formatDate(postcardData.createdAt)}
            </span>
            <p className="text-right text-sm font-medium text-[#54513E]">
              From. {postcardData.authorNickname}
            </p>
          </div>
          {/* mine 탭일 때만 수정/삭제 버튼 표시 */}
          {activeTab === "mine" && (
            <div className="flex items-center gap-2 justify-end mt-4 pt-4 border-t">
              <button
                type="button"
                onClick={onEditClick}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF7E4] text-[#54513E] text-xs font-medium transition-all active:scale-95 hover:bg-[#F0EDE3]"
              >
                <Pencil className="w-3.5 h-3.5" />
                수정
              </button>
              <button
                type="button"
                onClick={onDeleteClick}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 text-red-400 text-xs font-medium transition-all active:scale-95 hover:bg-red-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
                삭제
              </button>
            </div>
          )}

          {/* received 탭 - 리액션, 신고 버튼 표시 */}
          {activeTab === "received" && (
            <>
              <PostcardReactions
                postcardId={postcardData.id}
                accessToken={accessToken}
                initialReaction={
                  postcardData.reactionType as PostcardReactionType | null
                }
              />
              <div className="flex items-center justify-end mt-3">
                <button
                  type="button"
                  onClick={onReportClick}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 text-red-400 text-xs font-medium transition-all active:scale-95 hover:bg-red-100"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  신고
                </button>
              </div>
            </>
          )}

          {/* sent 탭 - 상대방이 남긴 리액션 표시 */}
          {activeTab === "sent" && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-center text-[#8B8070] mb-3">
                엽서를 가져간 유저가 남겨준 감정
              </p>
              <div className="flex items-center justify-center">
                {postcardData.reactionType ? (
                  <div className="flex flex-col items-center gap-1 px-4 py-2 rounded-2xl bg-[#FAF7E4]">
                    <span className="text-2xl">
                      {
                        REACTION_LABELS[
                          postcardData.reactionType as PostcardReactionType
                        ]
                      }
                    </span>
                    <span className="text-xs text-[#54513E] font-medium">
                      {postcardData.reactionType}
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-[#B0AC9C]">
                    아직 감정을 남기지 않았어요.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
