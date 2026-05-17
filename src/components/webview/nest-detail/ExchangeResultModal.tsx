"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { ExchangedPostcard } from "@/types";

interface Props {
  open: boolean;
  postcard: ExchangedPostcard | null;
  onClose: () => void;
}

export function ExchangeResultModal({ open, postcard, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="flex flex-col gap-4 bg-[#F7F4EC] border-[#E0DDD3] rounded-3xl w-[calc(100vw-2rem)] max-w-sm px-6 py-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[#3D3830]">
            엽서가 도착했어요!
          </p>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center text-[#8B8070] hover:text-[#3D3830] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 엽서 이미지 */}
        {postcard && (
          <>
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden">
              <Image
                src={postcard.imageUrl}
                alt="도착한 엽서"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>

            {/* 엽서 내용 */}
            <p className="text-sm text-[#3D3830] leading-relaxed text-center">
              {postcard.content}
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
