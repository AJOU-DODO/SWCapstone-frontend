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
  disableToggle?: boolean;
}

export default function SortSection({ options, defaultSort, disableToggle = false}: SortSectionProps) {
  const { updateQuery, searchParams } = useUpdateQuery();

  const rawSort = searchParams.get("sort") || defaultSort;

  const [currentField, currentOrder] = rawSort.includes(",") ? rawSort.split(",") : [rawSort, "desc"];

  //정렬 변경
  const handleSort = (newField: string) => {
    if (currentField === newField) {
      if (disableToggle) {
        return; 
      }
      
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