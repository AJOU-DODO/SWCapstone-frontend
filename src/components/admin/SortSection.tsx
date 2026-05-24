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

export default function SortSection({ options, defaultSort}: SortSectionProps) {
  const { updateQuery, searchParams } = useUpdateQuery();

  const rawSort = searchParams.get("sort") || defaultSort;

  const [currentField, currentOrder] = rawSort.includes(",") ? rawSort.split(",") : [rawSort, "asc"];

  //정렬 변경
  const handleSort = (newField: string) => {
    if (currentField === newField) {
      const nextOrder = currentOrder === "asc" ? "desc" : "asc";
      updateQuery({ sort: `${newField},${nextOrder}` });
    } else {
      updateQuery({ sort: `${newField},desc` });
    }
  };

  return (
    <SortFilterGroup
      options={options}
      currentValue={currentField}
      currentOrder={currentOrder}
      onChange={handleSort}
    />
  );
}