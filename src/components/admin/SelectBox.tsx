'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SelectOption {
  value: string;
  label: string;
}

interface RoundSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
}

export function SelectBox({ value, onChange, options }: RoundSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className=" border-2 border-[#54513E] rounded-full px-5 py-2.5 font-bold text-[#54513E] bg-[#FAF7E4]">
        <SelectValue placeholder="선택" />
      </SelectTrigger>
      
      <SelectContent className="rounded-2xl border-2 border-[#54513E] bg-[#FAF7E4] p-1">
        {options.map((option) => (
          <SelectItem 
            key={option.value} 
            value={option.value} 
            className="rounded-xl py-2.5 focus:bg-[#54513E] focus:text-white"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}