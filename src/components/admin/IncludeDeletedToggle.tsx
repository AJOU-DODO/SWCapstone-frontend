"use client";

import { useUpdateQuery } from "@/hooks/admin/useUpdateQuery";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface IncludeDeletedToggleProps {
  label: string;
  queryKey?: string;
  trueValue?: string;
  falseValue?: string | null;
  isDisabled?: boolean;
}

export default function IncludeDeletedToggle({
  label,
  queryKey = "includeDeleted",
  trueValue = "true",
  falseValue = null,
  isDisabled = false, // 기본값은 활성화 상태
}: IncludeDeletedToggleProps) {
  const { updateQuery, searchParams } = useUpdateQuery();

  const effectivelyDisabled = isDisabled;

  const isChecked = !effectivelyDisabled && searchParams.get(queryKey) === trueValue;

  const handleToggleChange = (checked: boolean) => {
    if (effectivelyDisabled) return;
    updateQuery({
      [queryKey]: checked ? trueValue : falseValue,
    });
  };

  return (
    <div 
      className={`flex items-center space-x-2 bg-white px-3 py-2 rounded-xl border border-2 border-[#538752] shadow-sm transition-all duration-200 ${
        effectivelyDisabled ? "opacity-40 pointer-events-none select-none" : ""
      }`}
    >
      <Switch
        id="deleted-toggle"
        checked={isChecked}
        onCheckedChange={handleToggleChange}
        disabled={effectivelyDisabled}
        className="data-[state=checked]:bg-[#538752]"
      />
      <Label 
        htmlFor="deleted-toggle" 
        className="text-sm font-medium text-[#54513E] cursor-pointer select-none"
      >
        {label}
      </Label>
    </div>
  );
}