"use client";

import MyPageHeader from '@/components/webview/mypage/MyPageHeader';
import PostCardTap from '@/components/webview/mypage/Postcard/PostcardTab';
import PostcardGrid from '@/components/webview/mypage/Postcard/PostcardGrid';
import PostcardModal from '@/components/webview/mypage/Postcard/PostcardModal';
import { fetchUserPostcards } from "@/lib/apiMypage";
import type { MyPostcard } from "@/types/indexMypage";
import { useQuery, useMutation } from "@tanstack/react-query";

import { MOCK_USER_POSTCARDS } from "@/app/(webview)/mypage/MockData"; // 임시 데이터 경로

import { useState, useEffect } from "react";

export default function Page() {
  const [activeTab, setActiveTab] = useState<'mine' | 'received'>('mine');
  const [selectedPostcard, setSelectedPostcard] = useState<MyPostcard | null>(null);

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

  //유저 활동 정보
  const { data: postcardData, isLoading: isStateLoading } = useQuery({
    queryKey: ['userPostcard', accessToken],
    queryFn: () => fetchUserPostcards(accessToken),
    enabled: !!accessToken,
  });

  const postcard = MOCK_USER_POSTCARDS.data.content;
  //const postcard = postcardData.data.content;

  // mine 값 비교로 보여줄 엽서 필터링
  const displayList = postcard.filter(post => 
    activeTab === 'mine' ? post.mine === true : post.mine === false
  );

  return (
    <div>
      <MyPageHeader title='엽서함'/>
      <PostCardTap currentTab={activeTab} onTabChange={setActiveTab}/>
      <PostcardGrid items={displayList} onItemClick={(item) => setSelectedPostcard(item)} />

      <PostcardModal 
        isOpen={!!selectedPostcard} 
        postcardData={selectedPostcard}
        onClose={() => setSelectedPostcard(null)} 
      />
    </div>
  );
}
