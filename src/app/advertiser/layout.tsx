import "../globals.css";
import Header from "@/components/admin/layout/Header";
import LogoutButton from "@/components/admin/layout/LogoutButton";
import AdvertiserNavigationBar from "@/components/advertiser/layout/AdvertiserNavigationBar";

export const metadata = {
  title: "DODO 광고주 페이지",
  description: "DODO 서비스 광고주 전용 페이지입니다",
};

export default function AdvertiserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen min-w-300 overflow-x-auto overflow-y-hidden">
      {/* 왼쪽 영역 */}
      <aside className="w-64 flex flex-col gap-3 items-center">
        <Header />
        <AdvertiserNavigationBar />
        <LogoutButton />
      </aside>

      {/* 오른쪽 영역 */}
      <main className="flex-1 h-screen overflow-y-auto">{children}</main>
    </div>
  );
}
