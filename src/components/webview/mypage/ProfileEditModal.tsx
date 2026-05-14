"use client";

import { X, Camera } from "lucide-react";
import Image from 'next/image';
import { useState, useEffect } from "react";

interface ProfileEditModalProps {
  isOpen: boolean;
  onSave: (nickname: string, bio: string) => Promise<void>;
  onClose: () => void;
  initialData: {
    nickname: string;
    bio: string;
    profileImageUrl: string;
  };
}

export default function ProfileEditModal({ isOpen, onClose, onSave,  initialData }: ProfileEditModalProps) {
  if (!isOpen) return null;

  const handleCameraClick = () => {
    if (typeof window !== "undefined" && window.AndroidBridge?.requestImageUpload) {
      window.AndroidBridge.requestImageUpload();
    } else {
      console.log("앱 브릿지를 찾을 수 없습니다.");
    }
  };

  const [nickname, setNickname] = useState(initialData.nickname);
  const [bio, setBio] = useState(initialData.bio);
  const [currentImg, setCurrentImg] = useState(initialData.profileImageUrl);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setCurrentImg(initialData.profileImageUrl);
  }, [initialData.profileImageUrl]);

  const handleSaveClick = async () => {
    setIsSaving(true);
    try {
      await onSave(nickname, bio);
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md bg-[#FAF7E4] rounded-2xl overflow-hidden shadow-xl mx-4">
        
        {/* 헤더 (닫기버튼) */}
        <div className="flex items-center justify-between p-4 border-b-2 border-[#54513E]">
          <h2 className="text-lg font-bold text-[#54513E]">프로필 수정</h2>
          <button onClick={onClose} className="p-1">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 프로필 이미지 수정 */}
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24">
              <Image 
                src={currentImg} 
                fill
                unoptimized
                className="w-full h-full border-[#54513E] rounded-full object-cover border" 
                alt="프로필"
              />
              <button 
              onClick={handleCameraClick}
              className="absolute bottom-0 right-0 p-2 bg-white border rounded-full shadow-sm hover:bg-gray-50">
                <Camera size={16} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* 닉네임과 바이오 수정 */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#54513E]">닉네임</label>
              <input 
                type="text" 
                value={nickname} 
                onChange={(e) => setNickname(e.target.value)}
                className="w-full mt-1 p-2 border border-[#54513E] rounded-lg focus:ring-2 focus:ring-[#54513E] outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#54513E]">바이오</label>
              <textarea 
                rows={3}
                value={bio} 
                onChange={(e) => setBio(e.target.value)}
                className="w-full mt-1 p-2 border border-[#54513E] rounded-lg focus:ring-2 focus:ring-[#54513E] outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <button 
            disabled={isSaving}
            onClick={handleSaveClick}
            className="w-full py-3 bg-[#54513E] text-white rounded-xl font-bold hover:bg-gray-800 transition-colors">
            {isSaving ? "저장 중..." : "저장하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
