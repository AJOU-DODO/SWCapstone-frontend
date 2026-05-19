import { NestSummary } from "@/app/(webview)/nests/page";
import { Lock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import Image from "next/image";

interface UnlockModalProps {
  nest: NestSummary;
  onClose: () => void;
  onConfirm: () => void;
}

export default function UnlockModal({
  nest,
  onClose,
  onConfirm,
}: UnlockModalProps) {
  return (
    <Dialog open={!!nest} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[320px] rounded-[2rem] border-none bg-white p-5 shadow-2xl"
      >
        <div className="flex flex-col">
          {/* Post Preview Area */}
          <div className="bg-[#FAF7E4] rounded-2xl p-4 border border-[#F0EBE0] mb-5">
            <div className="w-full aspect-4/3 rounded-xl overflow-hidden relative bg-linear-to-br from-rose-100 to-teal-100 mb-2">
              {nest.thumbnailUrl && (
                <Image
                  src={nest.thumbnailUrl}
                  alt="둥지 썸네일"
                  fill
                  className="object-cover blur-lg scale-110"
                  sizes="280px"
                />
              )}
              {/* 한가운데 lock 아이콘 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock size={20} className="text-black/40 relative z-10" />
              </div>
            </div>
            <p className="text-[#4A4A4A] text-[13px] leading-relaxed line-clamp-2 text-center font-medium">
              {nest.content}
            </p>
          </div>

          {/* Text Section */}
          <div className="text-center mb-6">
            <DialogHeader>
              <DialogTitle className="text-[#2D2D2D] text-[16px] font-bold tracking-tight text-center">
                해당 둥지를 찾으러 가시겠습니까?
              </DialogTitle>
            </DialogHeader>
          </div>

          {/* Buttons Section */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 h-14 rounded-xl border border-[#F0EBE0] text-[#8E8A7E] font-bold text-base active:bg-gray-50 transition-colors cursor-pointer"
            >
              NO
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 h-14 rounded-xl border border-[#F0EBE0] text-[#2D2D2D] font-bold text-base active:bg-gray-50 transition-colors cursor-pointer"
            >
              YES
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
