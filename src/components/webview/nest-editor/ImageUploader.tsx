"use client";

import { useCallback } from "react";
import { Plus, X, ImageIcon } from "lucide-react";
import { useNestEditorStore } from "@/lib/store/nestEditorStore";
import Image from "next/image";
import { useBridge } from "@/lib/hooks/useBridge";

export function ImageUploader() {
  const { imageUrls, removeImage, errors } = useNestEditorStore();
  const { requestImageUpload } = useBridge();

  const handleUpload = useCallback(() => {
    requestImageUpload();
  }, [requestImageUpload]);

  return (
    <div className="space-y-2">
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          type="button"
          onClick={handleUpload}
          className="shrink-0 w-24 h-24 rounded-2xl border-2 border-dashed border-[#C8C4B0] bg-[#F5F2E8] flex flex-col items-center justify-center gap-1 transition-all active:scale-95 hover:border-[#8B8070] hover:bg-[#EDE9DA]"
        >
          <Plus className="w-5 h-5 text-[#8B8070]" />
          <span className="text-[10px] text-[#8B8070] font-medium">
            {imageUrls.length}/10
          </span>
        </button>

        {imageUrls.map((url) => (
          <div
            key={url}
            className="relative shrink-0 w-24 h-24 rounded-2xl overflow-hidden group"
          >
            <Image
              src={`${url}`}
              alt="Base64 이미지"
              fill
              className="object-cover"
              sizes="96px"
            />
            <button
              type="button"
              onClick={() => removeImage(url)}
              className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        ))}

        {imageUrls.length === 0 && (
          <div className="shrink-0 w-48 h-24 rounded-2xl bg-[#ECEAE0] flex items-center justify-center">
            <div className="flex flex-col items-center gap-1">
              <ImageIcon className="w-6 h-6 text-[#B0AC9C]" />
              <span className="text-[10px] text-[#B0AC9C]">
                이미지를 추가하세요
              </span>
            </div>
          </div>
        )}
      </div>

      {errors.imageUrls && (
        <p className="text-xs text-red-400 px-1">{errors.imageUrls}</p>
      )}
    </div>
  );
}
