"use client";

import { deleteSanctionUser } from '@/lib/adminApi/user';
import { useState } from "react";

interface UserSanctionModalProps {
  userId: number;
  isOpen: boolean;
  onClose: () => void;
  setIsUpdated: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DeleteSanctionModal ({ userId, isOpen, onClose, setIsUpdated }: UserSanctionModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      await deleteSanctionUser({ userId });

      setIsUpdated(prev => !prev);
      onClose();
    } catch (error) {
      console.error("유저 제재 취소 처리 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={(e) => {e.stopPropagation(); onClose();}}>
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[#FAF7E4] rounded-2xl p-6 w-full max-w-sm shadow-xl transform transition-all flex flex-col gap-4 text-center">
        <h3 className='font-bold text-[#54513E]'>유저 제재 해제</h3>

        <p className="text-sm text-gray-600 text-center mt-4 leading-relaxed">
          정말 유저 제재를 해제하시겠습니까? <br />
          확인 즉시 유저 정지가 해제되며, <br />
          다시 모든 서비스를 정상적으로 이용할 수 있습니다.
        </p>

          <div className="flex flex-row justify-between gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-sm text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading }
              className="px-4 py-2 bg-[#54513E] text-white rounded-sm text-sm hover:bg-[#54513E]/90 disabled:bg-gray-400 font-medium transition-colors"
            >
              {isLoading ? "등록 중..." : "해제하기"}
            </button>
          </div>
      </div>
    </div>
  )
}