import { Button } from "@/components/ui/button"
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowUpNarrowWide, ArrowDownWideNarrow } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface SortFilterGroupProps {
  options: Option[];
  currentValue: string;
  currentOrder: string;
  onChange: (value: string) => void;
}

export default function SortFilterGroup({ options, currentValue, currentOrder, onChange }: SortFilterGroupProps) {
  return (
    <div className="flex gap-2">
      {options.map((opt) => {
        // 현재 이 버튼이 선택된 상태인지 확인
        const isSelected = currentValue === opt.value;

        return (
          <Button
            key={opt.value}
            variant="ghost"
            size="sm"
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-sm transition-all border-2 border-[#54513E] flex items-center gap-1",
              "text-[#54513E] hover:bg-[#54513E]/30",
              // 선택되었을 때 스타일
              isSelected && "bg-[#54513E]/70 text-white hover:bg-[#54513E]/80 hover:text-white"
            )}
          >
            {opt.label}

            {/* ✅ 화살표 적용 로직 */}
            {isSelected && (
              <span className="ml-1">
                {currentOrder === "asc" ? (
                  <ArrowUpNarrowWide size={14} className="animate-in fade-in zoom-in duration-200" />
                ) : (
                  <ArrowDownWideNarrow size={14} className="animate-in fade-in zoom-in duration-200" />
                )}
              </span>
            )}
          </Button>
        );
      })}
    </div>
  );
}