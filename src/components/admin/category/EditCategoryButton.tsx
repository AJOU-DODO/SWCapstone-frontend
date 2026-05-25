"use client";

import { Button } from "@/components/ui/button";

interface EditCategoryButtonProps {
  onEditClick: (e: React.MouseEvent) => void;
}

export default function EditCategoryButton({ onEditClick }: EditCategoryButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onEditClick}
      className="flex items-center gap-1 border-[#2B6340] text-[#2B6340] bg-[#9FC077] hover:bg-[#9FC077]/50 hover:text-white"
    >
      수정
    </Button>
  );
}