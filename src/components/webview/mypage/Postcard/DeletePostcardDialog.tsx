"use client";

import { Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePostcard } from "@/lib/apiMypage";
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

export default function DeletePostcardDialog({
  isOpen,
  postcard,
  accessToken,
  activeTab,
  onClose,
  onSuccess,
  onError,
}: Props) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => deletePostcard(postcard!.id, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userPostcard", accessToken, activeTab],
      });
      onSuccess();
      onClose();
    },
    onError: () => {
      onError();
      onClose();
    },
  });

  if (!isOpen || !postcard) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-sm font-semibold text-[#3D3830]">엽서 삭제</h2>
        <p className="text-sm text-[#54513E]">
          정말 이 엽서를 삭제하시겠습니까? 삭제된 엽서는 복구할 수 없습니다.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleteMutation.isPending}
            className="h-11 rounded-xl border-2 border-[#C8C4B0] bg-transparent text-[#54513E] text-sm font-semibold transition-all active:scale-95 disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
            className="h-11 rounded-xl bg-red-400 text-white text-sm font-semibold transition-all active:scale-95 hover:bg-red-500 disabled:opacity-50"
          >
            {deleteMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mx-auto" />
            ) : (
              "삭제"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
