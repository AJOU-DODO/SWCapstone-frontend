"use client";

import { useBridge } from "@/lib/hooks/useBridge";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchUserStatistics, fetchUserDetail, fetchUserNests } from "@/lib/apiMypage";
import UserDetail from '@/components/webview/mypage/UserDetail';
import MenuButtons from "@/components/webview/mypage/MenuButtons";
import MyNestList from "@/components/webview/mypage/MyNestList";

export default function Page() {
  const [accessToken, setAccessToken] = useState<string>("");
  
  
  //브릿지를 통한 accessToken 수신
  useEffect(() => {
      if (typeof window !== "undefined" && window.AndroidBridge) {
        try {
          const token = window.AndroidBridge.getAccessToken();
  
          console.log("네이티브에서 꺼내온 토큰:", token);
  
          if (token) {
            setAccessToken(token);
            localStorage.setItem("accessToken", token);
          }
        } catch (error) {
          console.error("브릿지 데이터 가져오기 실패:", error);
        }
      } else {
        console.log("안드로이드 브릿지가 아직 연결되지 않았습니다.");
      }

      window.onImageReceived = (Base64: String) => {
        const base64Data = Base64;
      }
    }, []);

  if(accessToken) console.log("성공");

  //유저 활동 정보
  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ['userStats', accessToken],
    queryFn: () => fetchUserStatistics(accessToken),
    enabled: !!accessToken,
  });

  //유저 정보
  const { data: userData, isLoading: isDetailLoading} = useQuery({
    queryKey: ['userDetail', accessToken],
    queryFn: () => fetchUserDetail(accessToken),
    enabled: !!accessToken,
  });

  //유저 둥지 정보
  const { data: nestsData, isLoading: isNestLoading} = useQuery({
    queryKey: ['userNests', accessToken],
    queryFn: () => fetchUserNests(accessToken),
    enabled: !!accessToken,
  });

  if (!accessToken || isStatsLoading || isDetailLoading || isNestLoading) {
    return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
  }

  return (
    <div>
      <UserDetail userStats={statsData?.data} userDetail={userData?.data}/>
      <MenuButtons/>
      <MyNestList nestsData={nestsData?.data}/>
    </div>
  );
}
