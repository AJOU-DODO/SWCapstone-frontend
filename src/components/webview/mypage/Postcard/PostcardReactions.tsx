"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
  const [selectedReaction, setSelectedReaction] =
    useState<PostcardReactionType | null>(initialReaction);
  const [prevPostcardId, setPrevPostcardId] = useState(postcardId);

  // postcardId가 변경될 때 selectedReaction 동기화
  if (postcardId !== prevPostcardId) {
    setPrevPostcardId(postcardId);
    setSelectedReaction(initialReaction ?? null);
  }

  const reactionMutation = useMutation({
    mutationFn: (type: PostcardReactionType) =>
      togglePostcardReaction(postcardId, type, accessToken),
    onMutate: (type) => {
      // 같은 리액션 클릭 시 취소, 다른 리액션 클릭 시 변경
      setSelectedReaction((prev) => (prev === type ? null : type));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPostcard"] });
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
              className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-200 ease-in-out active:scale-95 ${
                selectedReaction === type
                  ? "bg-[#54513E] text-white scale-105"
                  : "bg-[#FAF7E4] text-[#54513E] hover:bg-[#F0EDE3]"
              } disabled:opacity-50`}
            >
              <span className="text-xl">{REACTION_LABELS[type]}</span>
            </button>
          ),
        )}
      </div>
    </div>
  );
}
