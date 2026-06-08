//정렬 변경 시 파라미터 변경
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function useUpdateQuery() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateQuery = (updates: Record<string, string | null>, resetPage = true) => {
    const params = new URLSearchParams(searchParams.toString());

    // 파라미터 업데이트
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    // 페이지 초기화 (정렬이 바뀌면 페이지를 1로 초기화)
    if (resetPage) {
      params.set("page", "1");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return { updateQuery, searchParams, pathname };
}