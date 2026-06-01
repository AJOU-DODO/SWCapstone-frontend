"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { togglePostcardReaction } from "@/lib/apiMypage";
import type { PostcardReactionType } from "@/types/indexMypage";
import { REACTION_LABELS } from "@/types/indexMypage";

interface Props {
  postcardId: number;
  accessToken: string;
  initialReaction?: PostcardReactionType | null;
}

export function PostcardReactions({
  postcardId,
  accessToken,
  initialReaction = null,
}: Props) {
  const [selectedReaction, setSelectedReaction] =
    useState<PostcardReactionType | null>(initialReaction);

  const reactionMutation = useMutation({
    mutationFn: (type: PostcardReactionType) =>
      togglePostcardReaction(postcardId, type, accessToken),
    onMutate: (type) => {
      // 같은 리액션 클릭 시 취소, 다른 리액션 클릭 시 변경
      setSelectedReaction((prev) => (prev === type ? null : type));
    },
    onError: () => {
      // 실패 시 이전 상태로 복구
      setSelectedReaction(initialReaction ?? null);
    },
  });

  return (
    <div className="mt-4 pt-4 border-t space-y-2">
      <p className="text-xs text-center text-[#8B8070]">
        당신의 감정을 엽서에 남겨주세요!
      </p>
      <div className="flex items-center justify-center gap-3">
        {(Object.keys(REACTION_LABELS) as PostcardReactionType[]).map(
          (type) => (
            <button
              key={type}
              type="button"
              onClick={() => reactionMutation.mutate(type)}
              disabled={reactionMutation.isPending}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all active:scale-95 ${
                selectedReaction === type
                  ? "bg-[#54513E] text-white"
                  : "bg-[#FAF7E4] text-[#54513E] hover:bg-[#F0EDE3]"
              } disabled:opacity-50`}
            >
              <span className="text-xl">{REACTION_LABELS[type]}</span>
              <span className="text-[10px] font-medium">{type}</span>
            </button>
          ),
        )}
      </div>
    </div>
  );
}
