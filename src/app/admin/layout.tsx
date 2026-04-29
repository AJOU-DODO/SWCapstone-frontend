import "../globals.css";
import NavigationBar from "@/components/admin/layout/NavigationBar";
import Header from "@/components/admin/layout/Header";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export const metadata = {
  title: 'DODO 관리자 페이지',
  description: 'Next.js와 TypeScript로 제작함',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode; // React 컴포넌트가 들어온다는 뜻의 타입
}) {
  return (
    <html lang="ko" className={cn("font-sans", geist.variable)}>
      <body className="flex h-screen overflow-hidden"> 
        {/* 1. 왼쪽 사이드바 영역 (로고 + 네비게이션) */}
        <aside className="w-64 flex flex-col gap-3 items-center">
          <Header /> {/* 로고가 들어있는 컴포넌트 */}
          <NavigationBar />    {/* 메뉴 리스트가 들어있는 컴포넌트 */}
        </aside>

        {/* 2. 오른쪽 메인 콘텐츠 영역 */}
        <main className="flex-1 h-screen overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}