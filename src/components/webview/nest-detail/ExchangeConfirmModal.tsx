"use client";

import Image from "next/image";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { MyPostcard } from "@/types/indexMypage";

interface Props {
  open: boolean;
  postcard: MyPostcard | null;
  isExchanging: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ExchangeConfirmModal({
  open,
  postcard,
  isExchanging,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="flex flex-col items-center gap-5 bg-[#F7F4EC] border-[#E0DDD3] rounded-3xl w-[calc(100vw-2rem)] max-w-sm px-6 py-8">
        {/* 선택된 엽서 이미지 */}
        {postcard && (
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden">
            <Image
              src={postcard.imageUrl}
              alt="선택한 엽서"
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
        )}

        <p className="text-sm text-[#3D3830] font-medium">
          이 엽서와 교환하시겠어요?
        </p>

        <div className="w-full grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isExchanging}
            className="h-11 rounded-2xl border-2 border-[#C8C4B0] bg-transparent text-[#5C5346] text-sm font-semibold transition-all active:scale-95 hover:bg-[#EDE9DA] disabled:opacity-40"
          >
            NO
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isExchanging}
            className="h-11 rounded-2xl bg-[#5C5346] text-white text-sm font-semibold transition-all active:scale-95 hover:bg-[#4A4237] disabled:opacity-40"
          >
            {isExchanging ? (
              <Loader2 className="w-4 h-4 animate-spin mx-auto" />
            ) : (
              "YES"
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
