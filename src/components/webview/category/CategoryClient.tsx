"use client";

import { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Search, X, Hash, Check, Loader2, CheckCircle } from "lucide-react";
import {
  fetchCategories,
  fetchUserInterests,
  updateUserInterests,
} from "@/lib/api";
import type { Category } from "@/types";

export default function CategoryClient() {
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState(false);

  //브릿지로 accesstoken 수신
  const [accessToken] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    try {
      const token = window.AndroidBridge.getAccessToken();
      return token ?? "";
    } catch {
      return "";
    }
  });

  // 전체 카테고리 목록
  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(accessToken),
    enabled: !!accessToken,
    staleTime: 1000 * 60 * 5,
  });

  // 유저 관심 카테고리r수신
  const { data: interestsData, isLoading: isInterestsLoading } = useQuery({
    queryKey: ["userInterests"],
    queryFn: () => fetchUserInterests(accessToken),
    enabled: !!accessToken,
    staleTime: 0,
  });
  // selectedIds 초기값을 interestData로부터 계산
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  if (interestsData && !isInitialized) {
    setSelectedIds(interestsData.data.map((cat: Category) => cat.id));
    setIsInitialized(true);
  }

  // 관심 카테고리 설정
  const { mutate: saveInterests, isPending: isSaving } = useMutation({
    mutationFn: () => updateUserInterests(selectedIds, accessToken),
    onSuccess: () => {
      setToast(true);
      setTimeout(() => setToast(false), 3000);
    },
  });

  const categories = useMemo<Category[]>(
    () => categoriesData?.data ?? [],
    [categoriesData],
  );

  const filteredCategories = useMemo(() => {
    if (!query.trim()) return categories;
    return categories.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [categories, query]);

  const selectedCategories = useMemo(
    () => categories.filter((c) => selectedIds.includes(c.id)),
    [categories, selectedIds],
  );

  const toggleCategory = useCallback((id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }, []);

  const handleComplete = () => {
    if (isSaving) return;
    saveInterests();
  };

  const isLoading = isCategoriesLoading || isInterestsLoading;

  return (
    <div className="min-h-screen bg-[#F7F4EC] flex flex-col">
      {/* 토스트 */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#5C5346] text-white text-sm font-medium shadow-lg">
          <CheckCircle className="w-4 h-4" />
          카테고리 설정이 완료되었습니다.
        </div>
      )}
      {/* 검색 바 */}
      <div className="px-5 pt-5 pb-3">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="카테고리 검색"
            className="w-full h-11 pl-4 pr-10 rounded-2xl bg-[#EDEAE0] text-sm text-[#3D3830] placeholder:text-[#B0AC9C] outline-none focus:ring-2 focus:ring-[#5C5346]/30 transition-all"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#B0AC9C] hover:text-[#5C5346] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#B0AC9C]">
              <Search className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-32 space-y-5">
        {/* 전체 카테고리 목록 */}
        <section>
          <p className="text-xs font-semibold text-[#8B8070] mb-2.5">
            {query.trim() ? `"${query}" 검색 결과` : "전체 카테고리"}
          </p>

          {isLoading ? (
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-8 rounded-full bg-[#E8E5DB] animate-pulse"
                  style={{ width: `${60 + ((i * 13) % 40)}px` }}
                />
              ))}
            </div>
          ) : isCategoriesError ? (
            <p className="text-sm text-red-400">
              카테고리를 불러오지 못했습니다.
            </p>
          ) : filteredCategories.length === 0 ? (
            <p className="text-sm text-[#B0AC9C]">검색 결과가 없습니다.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {filteredCategories.map((cat) => {
                const selected = selectedIds.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium transition-all active:scale-95 ${
                      selected
                        ? "bg-[#5C5346] text-white"
                        : "bg-[#EDEAE0] text-[#5C5346] hover:bg-[#E2DFD5]"
                    }`}
                  >
                    {selected ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <Hash className="w-3 h-3" />
                    )}
                    {cat.name}
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* 선택된 카테고리 */}
        <section>
          <p className="text-xs font-semibold text-[#8B8070] mb-2.5">
            선택된 카테고리
          </p>
          {selectedCategories.length === 0 ? (
            <p className="text-sm text-[#B0AC9C]">
              선택된 카테고리가 없습니다.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((cat) => (
                <span
                  key={cat.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#5C5346] text-white text-xs font-medium rounded-full"
                >
                  <Hash className="w-3 h-3" />
                  {cat.name}
                  <button
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className="ml-0.5 hover:opacity-70 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 px-5 pb-8 pt-3 bg-[#F7F4EC] border-t border-[#E0DDD3]">
        <button
          type="button"
          onClick={handleComplete}
          disabled={isSaving}
          className="h-12 rounded-2xl bg-[#5C5346] text-white text-sm font-semibold transition-all active:scale-95 hover:bg-[#4A4237] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
          ) : (
            "설정하기"
          )}
        </button>
      </div>
    </div>
  );
}
