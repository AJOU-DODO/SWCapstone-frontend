"use client";

import type { UserStatistics, UserDetail} from "@/types/indexMypage";
import { useState } from "react";
import Image from 'next/image';
import ProfileEditModal from '@/components/webview/mypage/ProfileEditModal';

interface Props {
  userStats: UserStatistics | undefined;
  userDetail: UserDetail | undefined;
  onSave: (nickname: string, bio: string) => Promise<boolean>;
}

export default function UserDetail({ userStats, userDetail, onSave }: Props) {

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleSaveSubmit = async (nickname: string, bio: string) => {
    const success = await onSave(nickname, bio);

    if (success) {
      setIsEditModalOpen(false);
    }
  };

  return (
    <div>
      <div className="flex flex-rows width=device-width justify-between items-center pl-6 pr-6 pt-6">
        {/* 프로필 이미지 컨테이너 */}
        <div className="relative w-24 h-24 mb-4">
          <Image
            src={userDetail?.profileImageUrl || "/default-profile.png"}
            alt={userDetail?.nickname || ""}
            fill
            className="w-full h-full object-cover rounded-full border-2 border-[#54513E] shadow-md"
          />
        </div>
          {/* 유저 활동 통계 */}
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900">{userStats?.commentCount}</h2>
            <p className="text-sm text-gray-500 mt-1">댓글 수</p>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900">{userStats?.nestCount}</h2>
            <p className="text-sm text-gray-500 mt-1">둥지 수</p>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900">{userStats?.postcardCount}</h2>
            <p className="text-sm text-gray-500 mt-1">엽서 수</p>
          </div>
      </div>

      {/* 유저 정보 */}
      <div className="text-center flex flex-cols items-center justify-between pl-8 pr-8">
        <h2 className="text-xl font-bold text-gray-900">{userDetail?.nickname}</h2>
        <p className="text-sm text-gray-500">{userDetail?.email}</p>
      </div>
      {/* 자기소개 (Bio) */}
        {userDetail?.bio && (
          <div className="px-4 py-2 rounded-lg w-full text-center">
            <p className="text-sm text-[#54513E] italic">
              &quot;{userDetail.bio}&quot;
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
            onSave={handleSaveSubmit}
            initialData={{
              nickname: userDetail?.nickname || "",
              profileImageUrl: userDetail?.profileImageUrl || "",
              bio: userDetail?.bio || ""
            }}
          />
        </div>
    </div>
  );
}