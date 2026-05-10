"use client";

import Link from "next/link";
import type { MyNestData } from "@/types/indexMypage";

import { MOCK_USER_NESTS } from "@/app/(webview)/mypage/MockData"; // 임시 데이터 경로

interface Props {
  nestsData: MyNestData | undefined;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default function MyNestList({ nestsData }: Props) {
  const nests = MOCK_USER_NESTS.data.content;
  //const nests = nestsData.content;
  return (
    <section className="w-full mt-8 px-5 pb-20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900">내 둥지 목록</h3>
        <span className="text-sm text-gray-400">{nests.length}개</span>
      </div>

      {/* 리스트 영역 */}
      <div className="flex flex-col gap-3">
        {nests.map((nest) => (
          <Link
            key={nest.id}
            href={`/mypage/nest/${nest.id}`} // 상세 페이지 경로
            className="flex flex-row gap-5 p-4 w-[90vw] bg-white rounded-2xl border border-gray-100 shadow-sm active:bg-gray-50 active:scale-[0.98] transition-all"
          >
            {nest.thumbnailUrl && (
              <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={nest.thumbnailUrl}
                  alt="thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="text-[15px] font-semibold text-gray-800 mb-3">
                {nest.title}
              </h4>

              <div className="flex items-center text-[12px] text-gray-500">
                <div className="flex items-center gap-1 truncate">
                  {nest.content}
                </div>
              </div>
              <span className="text-[11px] text-gray-400">작성 {formatDate(nest.createdAt)} • 수정 {formatDate(nest.updatedAt)}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* 데이터가 없을 때 처리 (예시) */}
      {nests.length === 0 && (
        <div className="py-20 text-center text-gray-400 text-sm">
          아직 가입한 둥지가 없어요!
        </div>
      )}
    </section>
  );
}