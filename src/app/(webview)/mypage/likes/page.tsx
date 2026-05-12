"use client";

import MyNestList from "@/components/webview/mypage/MyNestList";
import MypageHeader from '@/components/webview/mypage/MyPageHeader';

import { useState, useEffect } from "react";
import { fetchLikesNests } from "@/lib/apiMypage";
import { useQuery, useMutation } from "@tanstack/react-query";

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

  //좋아요 누른 둥지 정보
  const { data: nestsData, isLoading: isNestLoading} = useQuery({
    queryKey: ['userNests', accessToken],
    queryFn: () => fetchLikesNests(accessToken),
    enabled: !!accessToken,
  });

  return (
    <div>
      <MypageHeader title='좋아요 둥지'/>
      <MyNestList nestsData={nestsData?.data}/>
    </div>
  );
}
