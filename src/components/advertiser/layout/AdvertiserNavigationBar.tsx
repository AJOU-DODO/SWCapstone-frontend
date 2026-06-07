"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "대시보드", path: "/advertiser" },
  { name: "광고 신청", path: "/advertiser/proposals/new" },
  { name: "신청 내역", path: "/advertiser/proposals" },
  { name: "성과 통계", path: "/advertiser/statistics" },
];

export default function AdvertiserNavigationBar() {
  const pathname = usePathname();

  return (
    <aside className="w-42.5 h-[80vh] bg-[#538752] text-white border-3 border-[#2B6340]">
      <nav>
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "h-[8vh] flex items-center justify-center border-b-3 border-[#2B6340] transition-all",
                isActive
                  ? "bg-[#457044] font-black shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"
                  : "hover:bg-[#5da05c]",
              )}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
