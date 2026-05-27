import Link from "next/link";

const MENUS = [
  { id: 1, label: "좋아요 둥지", path: "/mypage/likes" },
  { id: 2, label: "내 댓글", path: "/mypage/mycomments" },
  { id: 3, label: "엽서함", path: "/mypage/posts" },
  { id: 4, label: "해금한 둥지", path: "/mypage/unlocks" },
  { id: 5, label: "임시저장 글", path: "/mypage/drafts" },
];

export default function MenuButtons() {
  return (
    <section className="w-[92%] mx-auto mt-6 border-2 border-[#54513E] rounded-2xl p-4">
      <div className="flex justify-between items-center">
        {MENUS.map((menu) => (
          <Link 
            key={menu.id} 
            href={menu.path}
            className="flex flex-col items-center gap-2 flex-1 active:scale-90 transition-transform duration-100"
          >
            <span className="text-[11px] font-semibold text-gray-600">
              {menu.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}