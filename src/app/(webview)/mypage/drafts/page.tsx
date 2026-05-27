"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchDrafts } from "@/lib/api";
import type { DraftItem } from "@/types";
import { useNestEditorStore } from "@/lib/store/nestEditorStore";
import { MapPin } from "lucide-react";
import MypageHeader from '@/components/webview/mypage/MyPageHeader';

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function formatCoord(lat: number, lng: number) {
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

export default function Page() {
  const router = useRouter();

  const [accessToken] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    try {
      const token = window.AndroidBridge.getAccessToken();
      return token ?? "";
    } catch {
      return "";
    }
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["drafts", accessToken],
    queryFn: () => fetchDrafts(accessToken),
    staleTime: 0,
  });

  const drafts: DraftItem[] = data?.data ?? [];

  const handleNavigate = (draft: DraftItem) => {
    useNestEditorStore.setState({
      accessToken: accessToken,
      loadedDraftId: draft.id,
      title: draft.title ?? "",
      content: draft.content ?? "",
      unlockRadius: draft.unlockRadius,
      categoryIds: draft.categoryIds ?? [],
      imageUrls: draft.imageUrls ?? [],
      latitude: draft.latitude ?? null,
      longitude: draft.longitude ?? null,
    });

    router.push("/nest-editor");
  };

  if (isLoading) return <div className="p-5 text-center text-sm text-gray-400">불러오는 중...</div>;
  if (isError) return <div className="p-5 text-center text-sm text-red-400">목록을 불러오지 못했습니다.</div>;

  return(
    <>
      <MypageHeader title='임시저장 둥지'/>

      <section className="w-full mt-8 space-y-3 px-5 pb-20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">임시저장 글 목록</h3>
          <span className="text-sm text-gray-400">{drafts.length}개</span>
        </div>
        {drafts.map((draft) => {
          return (
            <button
              key={draft.id}
              type="button"
              onClick={()=>handleNavigate(draft)}
              className="w-full text-left flex items-start gap-3 py-3.5 px-5 rounded-2xl border transition-all border-[#54513E] bg-white hover:border-[#C8C4B0]"
            >
              {/* 내용 */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-1 text-[10px] text-[#8B8070]">
                  <MapPin className="w-2.5 h-2.5 shrink-0" />
                  <span>
                    {formatCoord(draft.latitude, draft.longitude)}
                  </span>
                </div>
                <p className="text-xs text-[#3D3830] leading-relaxed line-clamp-2">
                  {draft.content ?? (
                    <span className="text-[#B0AC9C] italic">본문 없음</span>
                  )}
                </p>
              </div>

              {/* 날짜 */}
              <span className="shrink-0 text-[10px] text-[#B0AC9C] mt-0.5">
                {formatDate(draft.createdAt)}
              </span>
            </button>
          );
        })}
      </section>
    </>
  );
}