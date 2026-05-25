import { Category } from '@/types/indexAdmin';

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <div className="min-w-[240px] max-w-[360px] bg-[#538752] border-2 border-[#2B6340] rounded-xl shadow-sm hover:shadow-md transition-shadow p-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          {/* 아이디네임 (기존의 번호+이름 박스) */}
          <div className="flex items-center gap-10 bg-[#9FC077] border border-[#2B6340] px-5 py-3 rounded-xl">
            <span className="font-semibold text-[#2B6340]">
              #{category.id}
            </span>
            <span className="font-medium text-[#2B6340]">
              {category.name}
            </span>
          </div>

          {/* 수정, 삭제 핸들러 */}
          <div className="text-xs text-white/80 gap-3">
            <button>
              수정
            </button>
            <button>
              삭제
            </button>
          </div>
        </div>

        {/* 카테고리 정보 */}
        <div className="flex items-center justify-between text-xs text-white/90 border-t border-[#2B6340]/30 pt-2">
          <span>
            {new Date(category.createdAt).toLocaleDateString()}
          </span>
          <span className="font-medium">
            생성둥지 • {category.nestCount}개
          </span>
        </div>

      </div>
    </div>
  );
}
