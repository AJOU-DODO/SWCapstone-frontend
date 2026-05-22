// 📂 src/components/common/RoundSelect.tsx (나만의 커스텀 격리소)
'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RoundSelectProps {
  value: string;
  onChange: (value: any) => void;
}

export function SelectBox({ value, onChange }: RoundSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className=" border-2 border-[#54513E] rounded-full px-5 py-2.5 font-bold text-[#54513E] bg-[#FAF7E4]">
        <SelectValue placeholder="선택" />
      </SelectTrigger>
      
      <SelectContent className="rounded-2xl border-2 border-[#54513E] bg-[#FAF7E4] p-1">
        <SelectItem value="UPDATE" className="rounded-xl py-2.5 focus:bg-[#54513E] focus:text-white">업데이트</SelectItem>
        <SelectItem value="EVENT" className="rounded-xl py-2.5 focus:bg-[#54513E] focus:text-white">이벤트</SelectItem>
        <SelectItem value="POLICY" className="rounded-xl py-2.5 focus:bg-[#54513E] focus:text-white">정책 변경</SelectItem>
      </SelectContent>
    </Select>
  );
}