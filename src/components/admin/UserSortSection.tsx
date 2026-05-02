// src/app/admin/users/_components/UserSortSection.tsx
"use client"

import { useUpdateQuery } from "@/hooks/admin/useUpdateQuery";
import SortFilterGroup from "@/components/admin/SortFilterGroup";

interface UserSortSectionProps {
  initialSort: string;
}

export default function UserSortSection() {
  const { updateQuery, searchParams } = useUpdateQuery();

  const currentSort = searchParams.get("sort") || "id";
  const currentOrder = searchParams.get("order") || "asc";

  //정렬 옵션
  const sortOptions = [
    { label: "유저 ID", value: "id" },
    { label: "가입 날짜", value: "createdAt" },
    { label: "유저 유형", value: "role" },
    { label: "게시글 수", value: "nestCount" },
    { label: "댓글 수", value: "commentCount" },
  ];

  //정렬 변경
  const handleSort = (newField: string) => {
    if (currentSort === newField) {
      const nextOrder = currentOrder === "asc" ? "desc" : "asc";
      updateQuery({ order: nextOrder });
    } else {
      updateQuery({ sort: newField, order: "asc" });
    }
  };

  return (
    <SortFilterGroup
      options={sortOptions}
      currentValue={currentSort}
      onChange={handleSort}
    />
  );
}