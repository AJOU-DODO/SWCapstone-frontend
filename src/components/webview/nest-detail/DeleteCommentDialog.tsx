"use client";

import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteCommentDialog({
  open,
  isPending,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="bg-[#F7F4EC] border-[#E0DDD3] rounded-3xl w-[calc(100vw-2rem)] max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold text-[#3D3830]">
            댓글 삭제
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-[#5C5346] py-2">
          정말 이 댓글을 삭제하시겠습니까? 삭제된 댓글은 복구할 수 없습니다.
        </p>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="h-11 rounded-2xl border-2 border-[#C8C4B0] bg-transparent text-[#5C5346] text-sm font-semibold transition-all active:scale-95 disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="h-11 rounded-2xl bg-red-400 text-white text-sm font-semibold transition-all active:scale-95 hover:bg-red-500 disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mx-auto" />
            ) : (
              "삭제"
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
