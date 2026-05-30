"use client";

import { sanctionUser } from '@/lib/adminApi/user';
import { useState } from "react";
import { SelectBox, SelectOption } from "@/components/admin/SelectBox";

interface UserSanctionModalProps {
  userId: number;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

const sanctionOptions: SelectOption[] = [
  { value: "NONE", label: "제재 없음" },
  { value: "SEVEN_DAYS", label: "7일 정지" },
  { value: "THIRTY_DAYS", label: "30일 정지" },
  { value: "PERMANENT", label: "영구 정지" },
];

export default function UserSanctionModal ({ userId, isOpen, onClose, onConfirm }: UserSanctionModalProps) {
  const [sanctionType, setSanctionType] = useState<'SEVEN_DAYS' | 'THIRTY_DAYS' | 'PERMANENT' | 'NONE'>('SEVEN_DAYS');
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (sanctionType === "NONE") {
      setReason("");
      onConfirm(reason);
      onClose();
      return;
    }

    try {
      setIsLoading(true);
      
      const payload = {
        sanctionType: sanctionType,
        reason: reason.trim(),
      };

      await sanctionUser({ userId, body: payload });
      
      setReason("");
      onConfirm(reason);
      onClose();

    } catch (error) {
      console.error("유저 제재 처리 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={(e) => {e.stopPropagation(); onClose();}}>
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[#FAF7E4] rounded-2xl p-6 w-full max-w-sm shadow-xl transform transition-all flex flex-col gap-4 text-center">
        <h3 className='font-bold text-[#54513E]'>유저 제재 처리</h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* 제재 유형 설정 */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-semibold text-[#54513E] pl-0.5">제재 유형 설정</label>
            <SelectBox value={sanctionType} onChange={(val) => setSanctionType(val as 'SEVEN_DAYS' | 'THIRTY_DAYS' | 'PERMANENT')} options={sanctionOptions}/>
          </div>

          {/* 제재 이유 입력창 */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-semibold text-[#54513E] pl-0.5">제재 사유</label>
            <input 
              type="text"
              placeholder={sanctionType === "NONE" ? "제재 필요 없음" : "해당 유저의 제재 이유를 적어주세요"}
              value={sanctionType === "NONE" ? "" : reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isLoading || sanctionType === "NONE"}
              required={sanctionType !== "NONE"}
              className="w-full border-2 border-[#54513E]/50 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[#54513E] disabled:bg-gray-100"
            />
          </div>

          {/* 하단 버튼 영역 */}
          <div className="flex flex-row justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-sm text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading || (sanctionType !== "NONE" && !reason.trim())}
              className="px-4 py-2 bg-[#54513E] text-white rounded-sm text-sm hover:bg-[#54513E]/90 disabled:bg-gray-400 font-medium transition-colors"
            >
              {isLoading 
                ? "등록 중..." 
                : sanctionType === "NONE" 
                  ? "삭제하기" 
                  : "제재 및 삭제"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}