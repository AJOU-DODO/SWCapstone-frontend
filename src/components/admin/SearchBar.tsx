"use client";

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef } from "react";

interface SearchBarProps {
  placeholder?: string; 
}

export default function SearchBar({ placeholder = "검색어를 입력하세요" }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const urlKeyword = searchParams.get("search") || "";
  const [keyword, setKeyword] = useState(urlKeyword);
  
  // 이전 URL 값을 기억할 Ref
  const prevUrlKeyword = useRef(urlKeyword);

  if (prevUrlKeyword.current !== urlKeyword) {
    setKeyword(urlKeyword);
    prevUrlKeyword.current = urlKeyword; // 동기화 후 마킹
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value); // 내 input 창은 즉시 업데이트

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    // 디바운스 시작
    debounceTimer.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (value.trim()) {
        params.set("search", value.trim());
        params.set("page", "1");
      } else {
        params.delete("search");
      }

      prevUrlKeyword.current = value.trim();
      router.push(`?${params.toString()}`);
    }, 500);
  };

  return (
    <div className="relative w-full">
      <Input 
        type="search" 
        placeholder={placeholder}
        value={keyword}
        onChange={handleChange}
        className="h-[7vh] w-full pl-10 rounded-md border-[#2B6340] border-2 focus-visible:ring-1" 
      />
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2B6340]" />
    </div>
  )
}