// 마이페이지 하위 페이지 공통 뒤로가기 헤더
"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function MypageHeader({ title }: { title: string }) {
  return (
    <header className="sticky top-0 bg-[#FAF7E4] flex items-center h-12 px-4 border-b border-[#54513E]">
      <Link href="/mypage" className="mr-4 px-2 py-1 rounded">
        <ArrowLeft size={24} strokeWidth={2.5} className="text-gray-700" />
      </Link>
      <h1 className="font-semibold">{title}</h1>
    </header>
  );
}