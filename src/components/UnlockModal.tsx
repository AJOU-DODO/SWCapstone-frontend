import { NestSummary } from "@/app/(webview)/nests/page";
import { Lock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

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
        className="max-w-sm rounded-[2.5rem] border-none bg-white p-6 shadow-2xl"
      >
        <div className="flex flex-col">
          {/* Post Preview Area */}
          <div className="bg-[#FAF7E4] rounded-[2rem] p-4 border border-[#F0EBE0] mb-8">
            {nest.thumbnailUrl ? (
              <div
                className={`w-full aspect-[4/3] rounded-2xl bg-gradient-to-br mb-3 flex items-center justify-center overflow-hidden`}
                style={{ backgroundImage: `url(${nest.thumbnailUrl})` }}
              >
                <Lock size={24} className="text-white/40" />
              </div>
            ) : null}
            <p className="text-[#4A4A4A] text-sm leading-relaxed line-clamp-2 text-center font-medium">
              {nest.title}
            </p>
          </div>

          {/* Text Section */}
          <div className="text-center mb-10">
            <DialogHeader>
              <DialogTitle className="text-[#2D2D2D] text-lg font-bold tracking-tight text-center">
                해당 둥지를 찾으러 가시겠습니까?
              </DialogTitle>
            </DialogHeader>
          </div>

          {/* Buttons Section */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 h-16 rounded-2xl border border-[#F0EBE0] text-[#8E8A7E] font-bold text-lg active:bg-gray-50 transition-colors cursor-pointer"
            >
              NO
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 h-16 rounded-2xl border border-[#F0EBE0] text-[#2D2D2D] font-bold text-lg active:bg-gray-50 transition-colors cursor-pointer"
            >
              YES
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
