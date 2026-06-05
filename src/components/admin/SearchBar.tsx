"use client";

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

interface SearchBarProps {
  placeholder?: string; 
}

export default function SearchBar({ placeholder = "검색어를 입력하세요" }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get("search") || "");

  useEffect(() => {
    const delayDebounceTimer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (keyword.trim()) {
        params.set("search", keyword.trim());
        params.set("page", "1");
      } else {
        params.delete("search");
      }

      router.push(`?${params.toString()}`);
    }, 500);

    return () => clearTimeout(delayDebounceTimer);
  }, [keyword, router, searchParams]);

  useEffect(() => {
    setKeyword(searchParams.get("search") || "");
  }, [searchParams]);

  return (
    <div className="relative w-full">
      <Input 
        type="search" 
        placeholder={placeholder}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="h-[7vh] w-full pl-10 rounded-md border-[#2B6340] border-2 focus-visible:ring-1" 
      />

      {/* 아이콘 */}
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2B6340] text-400" />
    </div>
  )
}