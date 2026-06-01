"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "유저 관리", path: "/admin/users"},
  { name: "둥지 관리", path: "/admin/nests"},
  { name: "신고된 엽서", path: "/admin/postcard"},
  { name: "카테고리 관리", path: "/admin/categories"},
  { name: "공지사항", path: "/admin/notices"},
  { name: "통계 확인", path: "/admin/stats"},
  { name: "문의사항", path: "/admin/inquiry"},
  { name: "광고 관리", path: "/admin/ads"},
];

export default function NavigationBar() {
  const pathname = usePathname();

  return (
    <aside className="w-42.5 h-[80vh] bg-[#538752] text-white border-3 border-[#2B6340]">
      <nav>
          {menuItems.map((item) => {
            const isActive = pathname === item.path;

            return(
              <Link key={item.path} href={item.path} 
                className={cn(
                  "block h-[8vh] flex items-center justify-center border-b-3 border-[#2B6340] transition-all",

                  //선택 시 진하게 스타일 변경
                  isActive 
                    ? "bg-[#457044] font-black shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]" 
                    : "hover:bg-[#5da05c]" //선택 안된 칸 호버 옵션
                    )}>
                {item.name}
              </Link>
            );
          })}
      </nav>
    </aside>
  );
}