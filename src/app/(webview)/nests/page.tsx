"use client";

import FeedHeader from "@/components/webview/FeedHeader";
import PostCard from "@/components/webview/PostCard";
import UnlockModal from "@/components/webview/UnlockModal";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface ApiResponse {
  status: string;
  code: string;
  message: string;
  data: NestSummary[];
}

export interface NestSummary {
  id: number;
  content: string;
  thumbnailUrl?: string;
  likeCount: number;
  distance: number;
  categoryNames: string[];
  hasPostcard: boolean;
  postcardId: number;
  ad: boolean;
  unlocked: boolean;
}

type SortType = "createdAt,desc" | "likeCount,desc" | "viewCount,desc";

const SORT_OPTIONS: { label: string; value: SortType }[] = [
  { label: "최신순", value: "createdAt,desc" },
  { label: "좋아요순", value: "likeCount,desc" },
  { label: "조회수순", value: "viewCount,desc" },
];

export default function Page() {
  const router = useRouter();

  // useEffect 대신 useState initializer로 동기적으로 가져옴
  const [accessToken] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    try {
      return window.AndroidBridge.getAccessToken() ?? "";
    } catch (error) {
      console.log("accessToken을 가져오지 못했습니다.", error);
      return "";
    }
  });

  const [nestIds] = useState<number[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const idsString = window.AndroidBridge.getNestIds();
      return idsString ? JSON.parse(idsString) : [];
    } catch (error) {
      console.log("둥지의 id를 가져오지 못했습니다.", error);
      return [];
    }
  });

  const [nestSummaries, setNestSummaries] = useState<NestSummary[]>([]);
  const [selectedNest, setSelectedNest] = useState<NestSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sortType, setSortType] = useState<SortType>("createdAt,desc");

  useEffect(() => {
    async function fetchNestSummaries() {
      if (!accessToken || nestIds.length === 0) {
        setIsLoading(true);
        return;
      }
      setIsLoading(false);
      const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/nests/summaries?ids=${nestIds.join(",")}&sort=${sortType}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!response.ok) throw new Error("Network response was not ok");
        const results = await response.json();
        setNestSummaries(results.data);
      } catch (error) {
        console.error("조회 실패:", error);
      } finally {
        setIsLoading(true);
      }
    }
    fetchNestSummaries();
  }, [sortType, accessToken, nestIds]);

  const handleNestClick = (nest: NestSummary) => {
    if (nest.unlocked) {
      // 이미 해금된 둥지 -> 상세 페이지로 바로 이동
      router.push(`/nests/${nest.id}`);
    } else {
      // 미해금 둥지 -> UnlockModal 표시
      setSelectedNest(nest);
    }
  };

  const handleConfirmNest = () => {
    if (selectedNest) {
      sendNestToNative(selectedNest);
      setSelectedNest(null);
    }
  };

  const sendNestToNative = (nest: NestSummary) => {
    if (window.AndroidBridge && window.AndroidBridge.sendNestIdSelected) {
      window.AndroidBridge.sendNestIdSelected(nest.id);
    }
  };

  return (
    <div className="bg-[#FAF7E4] min-h-screen font-sans selection:bg-[#3C5A3E]/10">
      <div className="max-w-md mx-auto px-6 py-12">
        <FeedHeader />

        {/* 정렬 버튼 */}
        <div className="flex gap-2 mb-6">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSortType(option.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95 ${
                sortType === option.value
                  ? "bg-[#3C5A3E] text-white"
                  : "bg-white border border-[#F0EBE0] text-[#8E8A7E]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col">
          {isLoading
            ? // 스켈레톤 UI - 전체 화면 대신 카드 자리에만 표시
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-[2rem] p-5 border border-[#F0EBE0] mb-6 animate-pulse"
                >
                  <div className="w-full aspect-video rounded-2xl bg-[#F0EBE0] mb-4" />
                  <div className="h-4 bg-[#F0EBE0] rounded-full w-3/4 mb-2" />
                  <div className="h-4 bg-[#F0EBE0] rounded-full w-1/2" />
                </div>
              ))
            : nestSummaries.map((nestSummary) => (
                <PostCard
                  key={nestSummary.id}
                  post={nestSummary}
                  selectNest={() => handleNestClick(nestSummary)}
                />
              ))}
        </div>
      </div>

      {selectedNest && (
        <UnlockModal
          nest={selectedNest}
          onClose={() => setSelectedNest(null)}
          onConfirm={handleConfirmNest}
        />
      )}
    </div>
  );
}
