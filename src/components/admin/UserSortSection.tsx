// src/app/admin/users/_components/UserSortSection.tsx
"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import SortFilterGroup from "@/components/admin/SortFilterGroup";

interface UserSortSectionProps {
  initialSort: string;
}

export default function UserSortSection({ initialSort }: UserSortSectionProps) {
  // 클라이언트의 상태 관리
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || "id";
  const currentOrder = searchParams.get("order") || "asc";

  const sortOptions = [
    { label: "유저 ID", value: "id" },
    { label: "가입 날짜", value: "createdAt" },
    { label: "유저 유형", value: "role" },
    { label: "게시글 수", value: "nestCount" },
    { label: "댓글 수", value: "commentCount" },
  ];

  const handleSort = (newField: string) => {
    // 1. 기존의 모든 파라미터(page 등)를 복사한 새로운 바구니 생성
    const params = new URLSearchParams(searchParams.toString());

    // 2. 토글 로직: 같은 필드면 방향 전환, 새로운 필드면 asc로 시작
    if (params.get("sort") === newField) {
      const nextOrder = params.get("order") === "asc" ? "desc" : "asc";
      params.set("order", nextOrder);
    } else {
      params.set("sort", newField);
      params.set("order", "asc");
    }

    // 3. 정렬이 바뀌면 페이지는 항상 1페이지로!
    params.set("page", "1");

    // 4. 완성된 주소로 이동 (예: /admin/users?sort=id&order=desc&page=1)
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <SortFilterGroup
      options={sortOptions}
      currentValue={currentSort} // 현재 어떤 필드가 선택됐는지 전달
      onChange={handleSort}
    />
  );
}