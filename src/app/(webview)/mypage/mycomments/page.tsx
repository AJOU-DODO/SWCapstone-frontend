"use client";

import { fetchMyComments } from "@/lib/apiMypage";
import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import MypageHeader from '@/components/webview/mypage/MyPageHeader';
import MyCommentList from '@/components/webview/mypage/MyCommentList';

export default function Page() {
  //브릿지로 accesstoken 수신
  const [accessToken] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    try {
      const token = window.AndroidBridge.getAccessToken();
      return token ?? "";
    } catch {
      return "";
    }
  });

  // 내가 쓴 댓글 
  const { 
    data: commentData, 
    isLoading: isCommentLoading,
    fetchNextPage,        // 다음 페이지 호출 함수
    hasNextPage,          // 다음 페이지 존재 여부
    isFetchingNextPage    // 추가 페이지 로딩 상태
  } = useInfiniteQuery({
    queryKey: ['myComments', accessToken],
    queryFn: ({ pageParam = 0 }) => fetchMyComments(accessToken, pageParam),
    enabled: !!accessToken,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.data.last) return undefined;
      return lastPage.data.number + 1;
    },
  });

  const allComments = commentData?.pages.flatMap((page) => page.data.content) || [];

  if (!accessToken || isCommentLoading) {
    return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
  }

  return(
    <div>
      <MypageHeader title='내 댓글'/>
      <MyCommentList commentData={allComments} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage}/>
    </div>
  );
}