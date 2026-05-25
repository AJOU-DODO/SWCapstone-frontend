"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { postCategory } from '@/lib/adminApi/category';

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateCategoryModal({ isOpen, onClose }: CreateCategoryModalProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isSubmitDisabled = name.trim() === "" || isLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitDisabled) return;

    setIsLoading(true);
    try {
      await postCategory({ name: name.trim() });
      
      setName("");
      onClose();
      router.refresh(); // 리스트 갱신
    } catch (error) {
      console.error("카테고리 생성 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div 
        className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-[#2B6340] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="bg-[#2B6340] p-4 text-white">
          <h3 className="text-lg font-bold text-center">새 카테고리 생성</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#2B6340] mb-2 px-1">
                카테고리 이름
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="카테고리 입력"
                autoFocus
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#538752] focus:outline-none transition-all text-gray-700 font-medium"
              />
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-bold text-gray-400 hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="flex-1 py-3 rounded-xl font-bold text-white bg-[#2B6340] hover:bg-[#1e462d] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
            >
              {isLoading ? "생성 중..." : "생성하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}