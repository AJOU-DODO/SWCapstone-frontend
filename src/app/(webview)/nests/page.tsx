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
  const [isReady, setIsReady] = useState(false);

  const fetchNestSummaries = async () => {
    if (!accessToken || nestIds.length === 0) {
      setIsReady(true);
      return;
    }
    setIsReady(false);
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/nests/summaries?ids=${nestIds.join(",")}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const results = await response.json();
      setNestSummaries(results.data);
      console.log(results);
    } catch (error) {
      console.error("조회 실패:", error);
    } finally {
      setIsReady(true);
    }
  };

  useEffect(() => {
    fetchNestSummaries();
  });

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

  // 데이터 로딩 전 빈 화면 대신 배경색 유지
  if (!isReady) {
    return (
      <div className="bg-[#FAF7E4] min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-[#3C5A3E] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7E4] min-h-screen font-sans selection:bg-[#3C5A3E]/10">
      <div className="max-w-md mx-auto px-6 py-12">
        <FeedHeader />

        <div className="flex flex-col">
          {nestSummaries.map((nestSummary) => (
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
