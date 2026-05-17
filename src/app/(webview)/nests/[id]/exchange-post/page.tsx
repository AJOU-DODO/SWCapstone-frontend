"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchUserPostcards } from "@/lib/apiMypage";
import { exchangePostcard } from "@/lib/api";
import { MyPostcard } from "@/types/indexMypage";
import { ExchangedPostcard } from "@/types";
import PostcardGrid from "@/components/webview/mypage/Postcard/PostcardGrid";
import { ExchangeConfirmModal } from "@/components/webview/nest-detail/ExchangeConfirmModal";
import { ExchangeResultModal } from "@/components/webview/nest-detail/ExchangeResultModal";

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [selectedPostcard, setSelectedPostcard] = useState<MyPostcard | null>(
    null,
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [exchangedPostcard, setExchangedPostcard] =
    useState<ExchangedPostcard | null>(null);

  //브릿지로 accesstoken 수신
  const [accessToken] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    try {
      const token = window.AndroidBridge.getAccessToken();
      console.log(token, "엽서함");
      return token ?? "";
    } catch {
      return "";
    }
  });

  //엽서 리스트 정보
  const {
    data: postcardData,
    isLoading: isPostCardLoading,
    refetch,
  } = useQuery({
    queryKey: ["userPostcard", accessToken],
    queryFn: () => fetchUserPostcards(accessToken),
    enabled: !!accessToken,
  });

  useEffect(() => {
    // 안드로이드가 엽서작성완료 신호를 보낼 시 실행될 함수
    if (typeof window !== "undefined" && window.AndroidBridge) {
      window.AndroidBridge.requestReload = () => {
        // 리로드 시 실행할 로직
        refetch();
      };
    }

    return () => {
      window.AndroidBridge.requestReload = () => {};
    };
  }, [refetch]);

  // 엽서 교환 mutation
  const { mutate: exchange, isPending: isExchanging } = useMutation({
    mutationFn: () => exchangePostcard(id, selectedPostcard!.id, accessToken),
    onSuccess: (data) => {
      setConfirmOpen(false);
      setExchangedPostcard(data.data);
      setResultOpen(true);
    },
  });

  const displayList = useMemo(() => {
    const postcards = postcardData?.data?.content || [];
    return postcards.filter((post: MyPostcard) => post.mine === true);
  }, [postcardData]);

  const handleItemClick = (item: MyPostcard) => {
    setSelectedPostcard(item);
    setConfirmOpen(true);
  };

  // 결과 모달 닫기 → 원래 둥지 페이지로 이동
  const handleResultClose = () => {
    setResultOpen(false);
    router.push(`/nests/${id}`);
  };

  if (!accessToken || isPostCardLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        로딩 중...
      </div>
    );
  }

  return (
    <div>
      <header className="sticky top-0 z-50 bg-[#FAF7E4] flex items-center h-12 px-4 border-b border-[#54513E]">
        <Link href={`/nests/${id}`} className="mr-4 px-2 py-1 rounded">
          <ArrowLeft size={24} strokeWidth={2.5} className="text-gray-700" />
        </Link>
        <h1 className="font-semibold">엽서 교환하기</h1>
      </header>
      <PostcardGrid
        items={displayList}
        activeTab="mine"
        onItemClick={handleItemClick}
      />

      {/* 교환 확인 모달 */}
      <ExchangeConfirmModal
        open={confirmOpen}
        postcard={selectedPostcard}
        isExchanging={isExchanging}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => exchange()}
      />

      {/* 교환 결과 모달 */}
      <ExchangeResultModal
        open={resultOpen}
        postcard={exchangedPostcard}
        onClose={handleResultClose}
      />
    </div>
  );
}
