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
  const [nestIds, setNestIds] = useState<number[]>([]);
  const [accessToken, setAccessToken] = useState<string>("");
  const [nestSummaries, setNestSummaries] = useState<NestSummary[]>([]);
  const [selectedNest, setSelectedNest] = useState<NestSummary | null>(null);
  const [isReady, setIsReady] = useState(false);

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

  useEffect(() => {
    if (typeof window !== "undefined" && window.AndroidBridge) {
      try {
        const token = window.AndroidBridge.getAccessToken();
        const idsString = window.AndroidBridge.getNestIds();

        console.log("네이티브에서 꺼내온 토큰:", token);
        console.log("네이티브에서 꺼내온 IDs:", idsString);

        if (token) {
          setAccessToken(token);
        }

        // ID 배열이 정상적으로 들어왔다면 파싱 후 저장
        if (idsString) {
          const ids = JSON.parse(idsString);
          setNestIds(ids);
        }
      } catch (error) {
        console.error("브릿지 데이터 가져오기 실패:", error);
      }
    } else {
      console.log("안드로이드 브릿지가 아직 연결되지 않았습니다.");
    }
  }, []);

  useEffect(() => {
    async function fetchNestSummaries(idList: number[]) {
      const params = new URLSearchParams();

      idList.forEach((id) => {
        params.append("ids", id.toString());
      });

      const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/nests/summaries?${params.toString()}`;

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
    }

    fetchNestSummaries(nestIds);
  }, [nestIds, accessToken]);

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
