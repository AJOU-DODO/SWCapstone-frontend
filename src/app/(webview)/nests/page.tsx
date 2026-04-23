"use client";

import FeedHeader from "@/components/FeedHeader";
import PostCard from "@/components/PostCard";
import UnlockModal from "@/components/UnlockModal";
import { useState, useEffect } from "react";

export interface ApiResponse {
  status: string;
  code: string;
  message: string;
  data: NestSummary[];
}

export interface NestSummary {
  id: number;
  title: string;
  thumbnailUrl?: string;
  ad: boolean;
  unlocked: boolean;
}

export default function Page() {
  const [nestIds, setNestIds] = useState<number[]>([]);
  const [accessToken, setAccessToken] = useState<string>("");
  const [nestSummaries, setNestSummaries] = useState<NestSummary[]>([]);
  const [selectedNest, setSelectedNest] = useState<NestSummary | null>(null);

  const handleNestClick = (nest: NestSummary) => {
    setSelectedNest(nest);
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
          localStorage.setItem("accessToken", token);
        }

        // ID 배열이 정상적으로 들어왔다면 파싱 후 저장
        if (idsString) {
          const ids = JSON.parse(idsString);
          setNestIds(ids);
          localStorage.setItem("nestIds", JSON.stringify(ids));
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
      }
    }

    fetchNestSummaries(nestIds);
  }, [nestIds, accessToken]);

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
