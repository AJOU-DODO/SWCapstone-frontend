"use client";

import { Category, CategoryName } from '@/types/indexAdmin';
import { updateCategory } from '@/lib/adminApi/category';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import EditCategoryButton from '@/components/admin/category/EditCategoryButton';
import DeleteCategoryButton from '@/components/admin/category/DeleteCategoryButton';

export default function CategoryCard({ category }: { category: Category }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(category.name);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const isSaveDisabled = editName.trim() === "" || isLoading;
  const isDeleted = category.deletedAt !== null;

  const handleSave = async () => {
    if (isSaveDisabled) return;

    const body: CategoryName = {
        name: editName.trim()
      };

    try {
      setIsLoading(true);

      const res = await updateCategory(category.id, body);

      router.refresh();
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`
      min-w-[240px] max-w-[360px] rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 border-2
      ${isDeleted 
        ? "bg-[#969696] border-[#676767] text-gray-400"
        : "bg-[#538752] border-[#2B6340]"
      }
    `}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          {/* 카테고리 정보 */}
          <div className={`
            flex items-center gap-3 border px-3 py-2 rounded-xl flex-1 max-w-[190px] min-w-0 transition-colors
            ${isDeleted 
              ? "bg-[#D9D9D9] border-[#676767] text-[#676767]"
              : "bg-[#9FC077] border-[#2B6340] text-[#2B6340]"
            }
          `}>
            <span className="font-semibold">
              #{category.id}
            </span>
            {isEditing ? (
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                disabled={isLoading}
                autoFocus
                onClick={(e) => e.stopPropagation()}
                className="h-8 bg-white/90 text-gray-800 border-[#2B6340] focus-visible:ring-[#2B6340] text-sm font-medium rounded-md w-full px-2"
                placeholder="이름 입력"
              />
            ) : (
              <span className="font-medium truncate">
                {category.name}
              </span>
            )}
          </div>

          {/* 수정, 삭제 핸들러 */}
          {!isDeleted && (
            <div className="flex flex-row text-xs text-white/80 gap-5 shrink-0">
              {isEditing ? (
                <>
                  <button
                    disabled={isLoading}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(false);
                      setEditName(category.name);
                    }}
                    className="hover:text-white transition-colors disabled:opacity-50"
                  >
                    취소
                  </button>
                  <button
                    disabled={isSaveDisabled}
                    onClick={handleSave}
                    className="font-semibold text-white bg-[#2B6340] px-2 py-1 rounded-md hover:bg-[#1E472D] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "중..." : "완료"}
                  </button>
                </>
              ) : (
                <>
                  <EditCategoryButton 
                    onEditClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                    }} 
                  />
                  <DeleteCategoryButton category={category} />
                </>
              )}
            </div>
          )}
        </div>

        {/* 카테고리 정보 */}
        <div className="flex items-center justify-between text-xs text-white/90 border-t border-[#2B6340]/30 pt-2">
          <span>
            {new Date(category.createdAt).toLocaleDateString()}
          </span>
          <span className="font-medium">
            생성둥지 • {category.nestCount}개
          </span>
        </div>

      </div>
    </div>
  );
}
