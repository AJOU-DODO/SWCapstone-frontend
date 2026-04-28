"use client";

import { useQuery } from "@tanstack/react-query";
import { X, Hash } from "lucide-react";
import { useNestEditorStore } from "@/lib/store/nestEditorStore";
import { fetchCategories } from "@/lib/api";
import type { Category } from "@/types";

export function CategorySelector() {
  const { categoryIds, setCategoryIds, accessToken, errors } =
    useNestEditorStore();

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(accessToken ?? ""),
    enabled: !!accessToken,
    staleTime: 1000 * 60 * 5,
  });

  const categories: Category[] = data?.data ?? [];
  const selectedCategories = categories.filter((c) =>
    categoryIds.includes(c.id),
  );

  const toggleCategory = (id: number) => {
    if (categoryIds.includes(id)) {
      setCategoryIds(categoryIds.filter((cid) => cid !== id));
    } else {
      setCategoryIds([...categoryIds, id]);
    }
  };

  return (
    <div className="space-y-2">
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedCategories.map((cat) => (
            <span
              key={cat.id}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#5C5346] text-white text-xs rounded-full"
            >
              <Hash className="w-2.5 h-2.5" />
              {cat.name}
              <button
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className="ml-0.5 hover:opacity-70 transition-opacity"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div>
        {isLoading ? (
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-7 w-16 bg-[#E8E5DB] animate-pulse rounded-full"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => {
              const selected = categoryIds.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95 ${
                    selected
                      ? "bg-[#5C5346] text-white"
                      : "bg-[#E8E5DB] text-[#5C5346] hover:bg-[#D8D4CA]"
                  }`}
                >
                  <Hash className="w-2.5 h-2.5" />
                  {cat.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {errors.categoryIds && (
        <p className="text-xs text-red-400">{errors.categoryIds}</p>
      )}
    </div>
  );
}
