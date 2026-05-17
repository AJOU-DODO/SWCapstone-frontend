"use client";

import { Mail, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fetchExchangeCheck } from "@/lib/api";

interface PostCardModalProps {
  open: boolean;
  accessToken: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function PostcardModal({
  open,
  accessToken,
  onClose,
  onConfirm,
}: PostCardModalProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["exchangeCheck"],
    queryFn: () => fetchExchangeCheck(accessToken),
    enabled: open && !!accessToken,
    staleTime: 0,
  });

  const exchangeCheck = data?.data;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="flex flex-col items-center gap-5 bg-[#F7F4EC] border-[#E0DDD3] rounded-3xl w-[calc(100vw-2rem)] max-w-sm px-6 py-8">
        <DialogHeader className="w-full">
          <DialogTitle className="text-sm font-semibold text-[#3D3830] text-center">
            엽서 교환
          </DialogTitle>
        </DialogHeader>
        {/* 편지 아이콘 */}
        <div className="w-28 h-28 rounded-2xl border-2 border-[#C8C4B0] bg-[#F0EDE3] flex items-center justify-center">
          <Mail className="w-14 h-14 text-[#5C5346]" strokeWidth={1.5} />
        </div>

        {/* 둥지 아이콘 */}
        <div className="text-2xl">🪹</div>

        {/* 안내 문구 */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-[#3D3830] font-medium">
            엽서를 가져가시겠습니까?
          </p>

          {/* 교환 가능 횟수 */}
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#8B8070]" />
          ) : (
            exchangeCheck && (
              <p className="text-xs">
                오늘 교환 가능한 엽서 개수는{" "}
                <span
                  className={
                    exchangeCheck.remainingCount === 0
                      ? "text-red-400 font-semibold"
                      : "text-green-500 font-semibold"
                  }
                >
                  {exchangeCheck.remainingCount}개
                </span>{" "}
                남았습니다.
              </p>
            )
          )}
        </div>

        {/* 버튼 */}
        <div className="w-full grid grid-cols-2 gap-3 mt-1">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-2xl border-2 border-[#C8C4B0] bg-transparent text-[#5C5346] text-sm font-semibold transition-all active:scale-95 hover:bg-[#EDE9DA]"
          >
            NO
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading || !exchangeCheck?.canExchange}
            className="h-11 rounded-2xl bg-[#5C5346] text-white text-sm font-semibold transition-all active:scale-95 hover:bg-[#4A4237] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            YES
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
