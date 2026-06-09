"use client";

import { Button } from "@/components/ui/button";
import { Category } from "@/types/indexAdmin";
import { deleteCategory } from '@/lib/adminApi/category';
import { useState } from "react";

interface DeleteCategoryButtonProps {
  category: Category;
  onRefresh?: () => void;
}

export default function DeleteCategoryButton({ category, onRefresh }: DeleteCategoryButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    setIsLoading(true);
    try {
      await deleteCategory(category.id);

      setIsOpen(false);
      onRefresh?.();
    } catch (error) {
      console.error("삭제 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.stopPropagation(); 
          setIsOpen(true);
        }}
        disabled={isLoading}
        className="flex items-center gap-1 border-[#2B6340] bg-[#9FC077] text-red-600 hover:bg-red-50 hover:text-red-700"
      >
        삭제
      </Button>

      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(false); 
          }}
        >
          <div 
            className="w-full max-w-md bg-white rounded-xl shadow-xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-900">
              카테고리 삭제 확인
            </h3>
            
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              정말로 <span className="font-semibold text-red-600">[{category.name}]</span> 카테고리를 삭제하시겠습니까?
              <br />
              이 작업은 되돌릴 수 없으며, 포함된 데이터에 영향을 줄 수 있습니다.
            </p>

            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                disabled={isLoading}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                취소
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? "삭제 중..." : "확인 및 삭제"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}