"use client";

import MyPageHeader from '@/components/webview/mypage/MyPageHeader';
import PostCardTap from '@/components/webview/mypage/Postcard/PostcardTab';
import PostcardGrid from '@/components/webview/mypage/Postcard/PostcardGrid';
import PostcardModal from '@/components/webview/mypage/Postcard/PostcardModal';
import { fetchUserPostcards } from "@/lib/apiMypage";
import type { MyPostcard } from "@/types/indexMypage";
import { useQuery, useMutation } from "@tanstack/react-query";

import { MOCK_USER_POSTCARDS } from "@/app/(webview)/mypage/MockData"; // 임시 데이터 경로

import { useState, useEffect, useMemo } from "react";

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

  //엽서 리스트 정보
  const { data: postcardData, isLoading: isPostCardLoading, refetch } = useQuery({
    queryKey: ['userPostcard', accessToken],
    queryFn: () => fetchUserPostcards(accessToken),
    enabled: !!accessToken,
  });

  useEffect(() => {
    // 안드로이드가 엽서작성완료 신호를 보낼 시 실행될 함수
    const handleAndroidRefresh = () => {
      refetch(); 
    };

    (window as any).refreshPostcards = handleAndroidRefresh;

    return () => {
      delete (window as any).refreshPostcards; // 컴포넌트 나갈 때 정리
    };
  }, [refetch]);

  //const postcard = MOCK_USER_POSTCARDS.data.content;
  const displayList = useMemo(() => {
    const postcards = postcardData?.data?.content || [];
    return postcards.filter((post: any) => 
      activeTab === 'mine' ? post.mine === true : post.mine === false
    );
  }, [postcardData, activeTab]);

  if (!accessToken || isPostCardLoading) {
    return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
  }

  return (
    <div>
      <MyPageHeader title='엽서함'/>
      <PostCardTap currentTab={activeTab} onTabChange={setActiveTab}/>
      <PostcardGrid items={displayList} activeTab={activeTab} onItemClick={(item) => setSelectedPostcard(item)} />

      <PostcardModal 
        isOpen={!!selectedPostcard} 
        postcardData={selectedPostcard}
        onClose={() => setSelectedPostcard(null)} 
      />
    </div>
  );
}
