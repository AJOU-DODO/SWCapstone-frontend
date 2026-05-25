"use client";

import { postWhitelist } from '@/lib/adminApi/user';
import { useEffect, useState } from "react";
import { Whitelists } from '@/types/indexAdmin';

interface WhitelistModalProps {
  isOpen: boolean;
  onClose: () => void;
  setIsUpdated: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function UserSanctionModal ({ isOpen, onClose, setIsUpdated }: WhitelistModalProps) {
  const [email, setEmail] = useState("");
  const [remark, setRemark] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("이메일을 입력해 주세요.");
      return;
    }

    try {
      setIsLoading(true);
      
      const payload = {
        email: email.trim(),
        remark: remark.trim(),
      };

      await postWhitelist(payload);

      setIsUpdated(prev => !prev);
      
      setEmail("");
      setRemark("");
      onClose();

    } catch (error) {
      console.error("화이트리스트 추가 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={(e) => {e.stopPropagation(); onClose();}}>
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl transform transition-all flex flex-col gap-4 text-center">
        <h3>유저 제재 처리</h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* 이메일 입력창 */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-semibold text-gray-600 pl-0.5">이메일 주소</label>
            <input 
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[#54513E] disabled:bg-gray-100"
              required
            />
          </div>

          {/* 비고(Remark) 입력창 */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-semibold text-gray-600 pl-0.5">비고 (Remark)</label>
            <input 
              type="text"
              placeholder="해당 유저에 대한 메모를 입력하세요 (선택)"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              disabled={isLoading}
              className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[#54513E] disabled:bg-gray-100"
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
              disabled={isLoading}
              className="px-4 py-2 bg-[#54513E] text-white rounded-sm text-sm hover:bg-[#54513E]/90 disabled:bg-gray-400 font-medium transition-colors"
            >
              {isLoading ? "등록 중..." : "추가하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}