"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, ImagePlus } from "lucide-react";
import { updatePostcard } from "@/lib/apiMypage";
import { fetchPresignedUrls, uploadImageToS3 } from "@/lib/api";
import type { MyPostcard } from "@/types/indexMypage";

interface Props {
  isOpen: boolean;
  postcard: MyPostcard | null;
  accessToken: string;
  activeTab: "mine" | "sent" | "received";
  onClose: () => void;
  onSuccess: () => void;
  onError: () => void;
}

export default function PostcardEditModal({
  isOpen,
  postcard,
  accessToken,
  activeTab,
  onClose,
  onSuccess,
  onError,
}: Props) {
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState(postcard?.imageUrl ?? "");
  const [isInitialized, setIsInitialized] = useState(false);

  // 수정 모달 열릴 때 기존 값으로 초기화
  if (postcard && !isInitialized) {
    setContent(postcard.content);
    setImagePreview(postcard.imageUrl);
    setIsInitialized(true);
  }

  // 이미지 수신 콜백 등록
  useEffect(() => {
    window.onImageReceived = (base64: string) => {
      setImagePreview(base64);
    };
    return () => {
      window.onImageReceived = undefined;
    };
  }, []);

  const handleImageChange = () => {
    window.AndroidBridge?.requestImageUpload?.();
  };

  const handleClose = () => {
    setIsInitialized(false);
    onClose();
  };

  const updateMutation = useMutation({
    mutationFn: async () => {
      let finalImageUrl = imagePreview;

      // base64이면 S3 업로드
      if (imagePreview.startsWith("data:")) {
        const fileNames = [`postcard_${Date.now()}.png`];
        const res = await fetchPresignedUrls(fileNames, accessToken);
        await uploadImageToS3(res.data[0].presignedUrl, imagePreview);
        finalImageUrl = res.data[0].fileUrl;
      }

      await updatePostcard(
        postcard!.id,
        { imageUrl: finalImageUrl, content },
        accessToken,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userPostcard", accessToken, activeTab],
      });
      onSuccess();
      onClose();
    },
    onError: () => {
      onError();
    },
  });

  if (!isOpen || !postcard) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 이미지 영역 */}
        <div className="relative aspect-4/3 w-full bg-gray-100">
          <Image
            src={imagePreview}
            alt="엽서 이미지"
            fill
            className="object-cover"
            unoptimized={imagePreview.startsWith("data:")}
          />
          {/* 이미지 변경 버튼 */}
          <button
            type="button"
            onClick={handleImageChange}
            className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/50 text-white text-xs font-medium transition-all active:scale-95"
          >
            <ImagePlus className="w-3.5 h-3.5" />
            이미지 변경
          </button>
        </div>

        {/* 내용 수정 영역 */}
        <div className="p-6 space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            placeholder="엽서 내용을 입력하세요."
            className="w-full resize-none bg-[#FAF7E4] border border-[#E0DDD3] rounded-xl px-4 py-3 text-sm text-[#3D3830] placeholder:text-[#B0AC9C] outline-none focus:ring-2 focus:ring-[#54513E]/30 transition-all"
          />

          {/* 버튼 */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={updateMutation.isPending}
              className="h-11 rounded-xl border-2 border-[#C8C4B0] bg-transparent text-[#54513E] text-sm font-semibold transition-all active:scale-95 disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="button"
              onClick={() => updateMutation.mutate()}
              disabled={!content.trim() || updateMutation.isPending}
              className="h-11 rounded-xl bg-[#54513E] text-white text-sm font-semibold transition-all active:scale-95 hover:bg-[#3D3830] disabled:opacity-50"
            >
              {updateMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
              ) : (
                "저장하기"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
