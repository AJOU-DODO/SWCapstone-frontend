"use client";

import { useState } from "react";
import UserSanctionModal from "@/components/admin/nest/UserSanctionModal";

interface ConfirmModalProps {
  targetType?: string;
  authorId: number;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  title: string;
  message: string;
  isLoading?: boolean;
}

export default function DeleteModal({
  targetType,
  authorId, 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  isLoading 
}: ConfirmModalProps) {
  const [reason, setReason] = useState("");
  const [isSanctionModalOpen, setIsSanctionModalOpen] = useState(false);

  if (!isOpen) return null;

  const handleNextStep = () => {
    if (!reason.trim() && targetType !== "COMMENT") {
      return;
    }
    setIsSanctionModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center ">

      <div 
      className="fixed inset-0 w-screen h-screen bg-black/40 z-0" 
      onClick={onClose} 
    />
      
      {/* 모달 박스 */}
      <div 
      onClick={(e) => e.stopPropagation()}
      className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-4 border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
        <div>
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{message}</p>
        </div>

        {targetType !== "COMMENT" && (
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-semibold text-gray-700 pl-0.5">삭제 및 제재 사유</label>
            <input 
              type="text"
              placeholder="해당 콘텐츠를 삭제하는 사유를 입력하세요."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isLoading}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-red-500 disabled:bg-gray-100"
            />
          </div>
        )}

        {/* 하단 버튼 영역 */}
        <div className="flex flex-row justify-end gap-2 mt-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 cursor-pointer text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-md transition-colors disabled:opacity-50"
          >
            취소
          </button>
          <button
            onClick={handleNextStep}
            disabled={isLoading  || (targetType !== "COMMENT" && !reason.trim())}
            className="px-4 py-2 text-xs cursor-pointer font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50"
          >
            확인
          </button>

          <UserSanctionModal
            userId={authorId}
            isOpen={isSanctionModalOpen}
            onClose={() => setIsSanctionModalOpen(false)}
            onConfirm={() => onConfirm(reason)}
          />
        </div>
      </div>
    </div>
  );
}