"use client";

import MyPageHeader from '@/components/webview/mypage/MyPageHeader';
import PostCardTap from '@/components/webview/mypage/Postcard/PostcardTab';
import PostcardGrid from '@/components/webview/mypage/Postcard/PostcardGrid';

import { MOCK_USER_POSTCARDS } from "@/app/(webview)/mypage/MockData"; // 임시 데이터 경로

import { useState, useEffect } from "react";

export default function Page() {
  const [activeTab, setActiveTab] = useState<'mine' | 'received'>('mine');

  const postcard = MOCK_USER_POSTCARDS.data.content;

  const displayList = postcard.filter(post => 
    activeTab === 'mine' ? post.mine === true : post.mine === false
  );

  return (
    <div>
      <MyPageHeader title='엽서함'/>
      <PostCardTap currentTab={activeTab} onTabChange={setActiveTab}/>
      <PostcardGrid items={displayList} />
    </div>
  );
}
