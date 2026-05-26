"use client";

import { useUpdateQuery } from "@/hooks/admin/useUpdateQuery";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function IncludeDeletedToggle() {
  const { updateQuery, searchParams } = useUpdateQuery();

  const isExcludeDeleted = searchParams.get("includeDeleted") === "false";

  const handleToggleChange = (checked: boolean) => {
    updateQuery({
      includeDeleted: checked ? "false" : null,
    });
  };

  return (
    <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-xl border border-2 border-[#538752] shadow-sm">
      <Switch
        id="deleted-toggle"
        checked={isExcludeDeleted}
        onCheckedChange={handleToggleChange}
        className="data-[state=checked]:bg-[#538752]"
      />
      <Label 
        htmlFor="deleted-toggle" 
        className="text-sm font-medium text-[#54513E] cursor-pointer select-none"
      >
        삭제된 카테고리 제외
      </Label>
    </div>
  );
}