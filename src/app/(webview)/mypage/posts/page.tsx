"use client";

import MyPageHeader from '@/components/webview/mypage/MyPageHeader';
import PostCardTap from '@/components/webview/mypage/Postcard/PostcardTab';
import PostcardGrid from '@/components/webview/mypage/Postcard/PostcardGrid';
import PostcardModal from '@/components/webview/mypage/Postcard/PostcardModal';
import Spinner from "@/components/webview/Spinner";
import { fetchUserPostcards } from "@/lib/apiMypage";
import type { MyPostcard } from "@/types/indexMypage";
import { useInfiniteQuery } from "@tanstack/react-query";

import { useState, useEffect, useMemo } from "react";

// filter 매칭 함수
const getFilter = (tab: 'mine' | 'sent' | 'received') => {
  if (tab === 'mine') return 'CREATED_NOT_SHARED';
  if (tab === 'sent') return 'CREATED_SHARED';
  return 'ACQUIRED';
};

export default function Page() {
  const [activeTab, setActiveTab] = useState<'mine' | 'sent' | 'received'>('mine');
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
  const { 
    data: postcardData, 
    isLoading: isPostCardLoading, 
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['userPostcard', accessToken, activeTab], 
    
    queryFn: ({ pageParam = 0 }) => {
      return fetchUserPostcards(accessToken, getFilter(activeTab), pageParam);
    },
    initialPageParam: 0,
    enabled: !!accessToken,
    
    getNextPageParam: (lastPage) => {
      if (lastPage.data.last) return undefined;
      return lastPage.data.number + 1;
    }
  });

  useEffect(() => {
    // 안드로이드가 엽서작성완료 신호를 보낼 시 실행될 함수
    const handleAndroidRefresh = () => {
      refetch(); 
    };

    window.requestReload = handleAndroidRefresh;

    return () => {
      window.requestReload = () => {};
    };
  }, [refetch]);

  const displayList = useMemo(() => {
    return postcardData?.pages.flatMap((page) => page?.data?.content || []) || [];
  }, [postcardData]);

  if (!accessToken) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <MyPageHeader title='엽서함'/>
      <PostCardTap currentTab={activeTab} onTabChange={setActiveTab}/>
      
      {isPostCardLoading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <Spinner size="md" />
        </div>
      ) : (
        <PostcardGrid items={displayList} activeTab={activeTab} onItemClick={(item) => setSelectedPostcard(item)} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} />
      )}

      <PostcardModal 
        isOpen={!!selectedPostcard} 
        postcardData={selectedPostcard}
        onClose={() => setSelectedPostcard(null)} 
      />
    </div>
  );
}
