"use client";

import MyNestList from "@/components/webview/mypage/MyNestList";
import MypageHeader from '@/components/webview/mypage/MyPageHeader';

import { useState, useEffect } from "react";
import { fetchUnlockNests } from "@/lib/apiMypage";
import { useQuery, useMutation } from "@tanstack/react-query";

export default function Page() {
  //브릿지로 accesstoken 수신
  const [accessToken] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    try {
      const token = window.AndroidBridge.getAccessToken();
      console.log(token, "해금한 둥지");
      return token ?? "";
    } catch {
      return "";
    }
  });

  //해금한 둥지 정보
  const { data: nestsData, isLoading: isUnlockLoading} = useQuery({
    queryKey: ['userNests', accessToken],
    queryFn: () => fetchUnlockNests(accessToken),
    enabled: !!accessToken,
  });

  if (!accessToken || isUnlockLoading) {
    return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
  }

  return (
    <div>
      <MypageHeader title='해금한 둥지'/>
      <MyNestList nestsData={nestsData?.data}/>
    </div>
  );
}
