"use client";

import type { UserStatistics, UserDetail} from "@/types/indexMypage";
import { useState, useEffect } from "react";
import ProfileEditModal from '@/components/webview/mypage/ProfileEditModal';

import { MOCK_USER_PROFILE, MOCK_USER_STATISTICS } from "@/app/(webview)/mypage/MockData"; // 임시 데이터 경로

interface Props {
  userStats: UserStatistics | undefined;
  userDetail: UserDetail | undefined;
}

export default function UserDetail({ userStats, userDetail }: Props) {
  const user = MOCK_USER_PROFILE.data;
  const statics = MOCK_USER_STATISTICS.data;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div>
      <div className="flex flex-rows width=device-width justify-between items-center pl-6 pr-6 pt-6">
        {/* 프로필 이미지 컨테이너 */}
        <div className="relative w-24 h-24 mb-4">
          <img
            src={user.profileImageUrl}
            alt={user.nickname}
            className="w-full h-full object-cover rounded-full border-2 border-[#54513E] shadow-md"
          />
        </div>
          {/* 유저 활동 통계 */}
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900">{statics.commentCount}</h2>
            <p className="text-sm text-gray-500 mt-1">댓글 수</p>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900">{statics.nestCount}</h2>
            <p className="text-sm text-gray-500 mt-1">둥지 수</p>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900">{statics.postcardCount}</h2>
            <p className="text-sm text-gray-500 mt-1">엽서 수</p>
          </div>
      </div>

      {/* 유저 정보 */}
      <div className="text-center flex flex-cols items-center justify-between pl-8 pr-8">
        <h2 className="text-xl font-bold text-gray-900">{user.nickname}</h2>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>
      {/* 자기소개 (Bio) */}
        {user.bio && (
          <div className="px-4 py-2 rounded-lg w-full text-center">
            <p className="text-sm text-[#54513E] italic">
              "{user.bio}"
            </p>
          </div>
        )}
        {/* 프로필 수정 버튼*/}
        <div className="w-[80vw] mx-auto">
          <button 
          onClick={() => setIsEditModalOpen(true)}
          className="mt-3 w-full py-2 border-[#54513E] border-2 text-[#54513E] rounded-xl font-medium active:scale-95 transition-transform">
          프로필 수정하기
          </button>

          {/* 프로필 수정시 팝업화면 */}
          <ProfileEditModal 
            isOpen={isEditModalOpen} 
            onClose={() => setIsEditModalOpen(false)}
            initialData={user}
          />
        </div>
    </div>
  );
}