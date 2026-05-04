"use client"

import { useUpdateQuery } from "@/hooks/admin/useUpdateQuery";
import SortFilterGroup from "@/components/admin/SortFilterGroup";

export interface SortOption {
  label: string;
  value: string;
}

interface SortSectionProps {
  options: SortOption[];
  defaultSort: string;
}

export default function UserSortSection({ options, defaultSort}: SortSectionProps) {
  const { updateQuery, searchParams } = useUpdateQuery();

  const currentSort = searchParams.get("sort") || defaultSort;
  const currentOrder = searchParams.get("order") || "asc";

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
      options={options}
      currentValue={currentSort}
      currentOrder={currentOrder}
      onChange={handleSort}
    />
  );
}