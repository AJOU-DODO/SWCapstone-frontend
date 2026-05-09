"use client";

import { useBridge } from "@/lib/hooks/useBridge";
import { useState, useEffect } from "react";
import UserDetail from '@/components/webview/mypage/UserDetail';
import MenuButtons from "@/components/webview/mypage/MenuButtons";
import MyNestList from "@/components/webview/mypage/MyNestList";

export default function Page() {
  //const [accessToken, setAccessToken] = useState<string>("");
  
  /*useEffect(() => {
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
    }, []);

  if(accessToken) console.log("성공");*/

  return (
    <div>
      <UserDetail/>
      <MenuButtons/>
      <MyNestList/>
    </div>
  );
}
