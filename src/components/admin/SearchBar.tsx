"use client";

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, Suspense } from "react";

interface SearchBarProps {
  placeholder?: string; 
}

function SearchBarInner({ placeholder = "검색어를 입력하세요" }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSelfPush = useRef(false);

  const [keyword, setKeyword] = useState(searchParams.get("search") || "");

  useEffect(() => {
    if (isSelfPush.current) {
      isSelfPush.current = false;
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setKeyword(searchParams.get("search") || "");
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (value.trim()) {
        params.set("search", value.trim());
        params.set("page", "1");
      } else {
        params.delete("search");
      }

      isSelfPush.current = true;
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

export default function SearchBar(props: SearchBarProps) {
  return (
      <Suspense fallback={null}>
        <SearchBarInner {...props} />
      </Suspense>
    );
}