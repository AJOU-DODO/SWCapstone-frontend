"use client";

import { fetchMyComments } from "@/lib/apiMypage";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import MypageHeader from '@/components/webview/mypage/MyPageHeader';
import MyCommentList from '@/components/webview/mypage/MyCommentList';

export default function Page() {
  //브릿지로 accesstoken 수신
  const [accessToken] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    try {
      const token = window.AndroidBridge.getAccessToken();
      console.log(token, "내 댓글");
      return token ?? "";
    } catch {
      return "";
    }
  });

  //좋아요 누른 둥지 정보
  const { data: commentData, isLoading: isCommentLoading} = useQuery({
    queryKey: ['userComment', accessToken],
    queryFn: () => fetchMyComments(accessToken),
    enabled: !!accessToken,
  });

  if (!accessToken || isCommentLoading) {
    return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
  }

  return(
    <div>
      <MypageHeader title='내 댓글'/>
      <MyCommentList commentData={commentData?.data}/>
    </div>
  );
}