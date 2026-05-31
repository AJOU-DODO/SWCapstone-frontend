"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackHeader() {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-10 px-4 py-3 flex items-center bg-[#FAF7E4]">
      <button
        type="button"
        onClick={() => router.back()}
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#EDEAE0] transition-colors"
      >
        <ChevronLeft className="w-5 h-5 text-[#5C5346]" />
      </button>
    </div>
  );
}
