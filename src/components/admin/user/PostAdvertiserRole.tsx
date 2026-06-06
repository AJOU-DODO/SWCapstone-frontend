"use client";

import { addAdvertiserAuthority } from '@/lib/adminApi/advertise';
import { useState } from "react";

interface UserSanctionModalProps {
  userId: number;
  isOpen: boolean;
  onClose: () => void;
  setIsUpdated: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PostAdvertiserRole ({ userId, isOpen, onClose, setIsUpdated }: UserSanctionModalProps) {
  const [adCount, setAdCount] = useState(0);
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      
      const payload = {
        allowedAdCount: adCount,
        expiredAt: new Date(`${expiryDate}T23:59:59.999Z`).toISOString(),
      };

      await addAdvertiserAuthority({ userId, body: payload });

      setIsUpdated(prev => !prev);
      
      setAdCount(0);
      onClose();

    } catch (error) {
      console.error("광고주 권한 부여 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={(e) => {e.stopPropagation(); onClose();}}>
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[#FAF7E4] rounded-2xl p-6 w-full max-w-sm shadow-xl transform transition-all flex flex-col gap-4 text-center">
        <h3 className='font-bold text-[#54513E]'>광고주 권한 부여</h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* 제재 이유 입력창 */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-semibold text-[#54513E] pl-0.5">부여할 광고 게시글 수</label>
            <input 
              type="number"
              min={0}
              placeholder="부여할 광고 게시글 수를 입력하세요 (숫자)"
              defaultValue={adCount}
              onChange={(e) => {
                const val = e.target.value;
                setAdCount(val === "" ? 0 : parseInt(val, 10));
              }}
              disabled={isLoading}
              required
              className="w-full border-2 border-[#54513E]/50 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[#54513E] disabled:bg-gray-100"
            />
          </div>

          {/* 만료일 입력창 */}
          <div className="flex flex-col gap-1.5 text-left mt-4">
            <label className="text-xs font-semibold text-[#54513E] pl-0.5">권한 만료일 선택</label>
            <input 
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              disabled={isLoading}
              required
              min={(() => {
                  const today = new Date();
                  const yyyy = today.getFullYear();
                  const mm = String(today.getMonth() + 1).padStart(2, '0');
                  const dd = String(today.getDate()).padStart(2, '0');
                  return `${yyyy}-${mm}-${dd}`;
                })()}
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
              disabled={isLoading || adCount <= 0}
              className="px-4 py-2 bg-[#54513E] text-white rounded-sm text-sm hover:bg-[#54513E]/90 disabled:bg-gray-400 font-medium transition-colors"
            >
              {isLoading ? "등록 중..." : "권한부여"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}