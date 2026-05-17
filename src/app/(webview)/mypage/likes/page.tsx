"use client";

import MyNestList from "@/components/webview/mypage/MyNestList";
import MypageHeader from '@/components/webview/mypage/MyPageHeader';

import { useState } from "react";
import { fetchLikesNests } from "@/lib/apiMypage";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function Page() {
  //브릿지로 accesstoken 수신
  const [accessToken] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    try {
      const token = window.AndroidBridge.getAccessToken();
      console.log(token, "좋아요 둥지");
      return token ?? "";
    } catch {
      return "";
    }
  });

  // 좋아요 누른 둥지 정보
  const { 
    data: nestsData, 
    isLoading: isLikesLoading,
    fetchNextPage,      // 다음 페이지를 불러오는 함수
    hasNextPage,        // 다음 페이지가 있는지 여부 (last 기반)
    isFetchingNextPage  // 추가 페이지를 로딩 중인지 여부
  } = useInfiniteQuery({
    queryKey: ['likedNests', accessToken],
    queryFn: ({ pageParam = 0 }) => fetchLikesNests(accessToken, pageParam), 
    enabled: !!accessToken,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.data.last) return undefined;
      return lastPage.data.number + 1;
    },
  });

  const allNests = nestsData?.pages.flatMap((page) => page.data.content) || [];

  if (!accessToken || isLikesLoading) {
    return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
  }

  return (
    <div>
      <MypageHeader title='좋아요 둥지'/>
      <MyNestList nestsData={allNests} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage}/>
    </div>
  );
}
