import "../../globals.css";
import Header from "@/components/admin/layout/Header";
import NavigationBar from "@/components/admin/layout/NavigationBar";
import LogoutButton from "@/components/admin/layout/LogoutButton";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export const metadata = {
  title: 'DODO 관리자 페이지',
  description: 'DODO 서비스의 관리를 총괄합니다',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen min-w-[1200px] overflow-x-auto overflow-y-hidden"> 
      {/* 왼쪽 영역 (로고 + 메뉴) */}
      <aside className="w-64 flex flex-col gap-3 items-center">
        <Header /> 
        <NavigationBar />
        <LogoutButton />
      </aside>

      {/* 오른쪽 영역 (기능 페이지) */}
      <main className="flex-1 h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}