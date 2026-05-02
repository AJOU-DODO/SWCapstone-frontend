// src/app/admin/users/_components/UserSortSection.tsx
"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import SortFilterGroup from "@/components/admin/SortFilterGroup";

interface UserSortSectionProps {
  initialSort: string;
}

export default function UserSortSection() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || "id";

  //정렬 옵션
  const sortOptions = [
    { label: "유저 ID", value: "id" },
    { label: "가입 날짜", value: "createdAt" },
    { label: "유저 유형", value: "role" },
    { label: "게시글 수", value: "nestCount" },
    { label: "댓글 수", value: "commentCount" },
  ];

  const handleSort = (newField: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (params.get("sort") === newField) {
      const nextOrder = params.get("order") === "asc" ? "desc" : "asc";
      params.set("order", nextOrder);
    } else {
      params.set("sort", newField);
      params.set("order", "asc");
    }

    //옵션이 바뀌면 페이지는 1로 설정.
    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <SortFilterGroup
      options={sortOptions}
      currentValue={currentSort}
      onChange={handleSort}
    />
  );
}