"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { ThumbsUp, ThumbsDown, Hash, AlertCircle } from "lucide-react";
import { fetchNestDetail, postReaction } from "@/lib/api";
import type { ReactionType } from "@/types";

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

interface Props {
  nestId: string;
}

export function NestDetailClient({ nestId }: Props) {
  const [reportOpen, setReportOpen] = useState(false);

  // 낙관적 업데이트를 위한 로컬 reaction 상태
  const [localReaction, setLocalReaction] = useState<ReactionType | null>(null);
  const [likeOffset, setLikeOffset] = useState(0);
  const [dislikeOffset, setDislikeOffset] = useState(0);
  const [accessToken, setAccessToken] = useState<string>("");

  //브릿지로 accesstoken 수신
  useEffect(() => {
    if (typeof window !== "undefined" && window.AndroidBridge) {
      try {
        const token = window.AndroidBridge.getAccessToken();

        console.log("네이티브에서 꺼내온 토큰:", token);

        if (token) {
          setAccessToken(token);
          localStorage.setItem("accessToken", token);
        }
      } catch (error) {
        console.error("브릿지 데이터 가져오기 실패:", error);
      }
    } else {
      console.log("안드로이드 브릿지가 아직 연결되지 않았습니다.");
    }
  }, []);
  // 둥지 상세 정보
  const { data: nestData, isLoading: isNestLoading } = useQuery({
    queryKey: ["nest", nestId],
    queryFn: () => fetchNestDetail(nestId, accessToken),
    enabled: !!accessToken,
  });

  const nest = nestData?.data;

  console.log(nest?.imageUrls);
  console.log(nest?.creatorProfileImageUrl);

  // 초기 reaction 상태 동기화
  const displayLikeCount = (nest?.likeCount ?? 0) + likeOffset;
  const displayDislikeCount = (nest?.dislikeCount ?? 0) + dislikeOffset;

  // 댓글 목록

  // 좋아요/싫어요
  const reactionMutation = useMutation({
    mutationFn: (type: ReactionType) => postReaction(nestId, type, accessToken),
    onMutate: (type) => {
      const prevReaction = localReaction;

      if (type === "LIKE") {
        setLikeOffset((o) => (prevReaction === "LIKE" ? o - 1 : o + 1));
        if (prevReaction === "DISLIKE") setDislikeOffset((o) => o - 1);
      } else {
        setDislikeOffset((o) => (prevReaction === "DISLIKE" ? o - 1 : o + 1));
        if (prevReaction === "LIKE") setLikeOffset((o) => o - 1);
      }

      setLocalReaction(prevReaction === type ? null : type);
    },
    onError: () => {
      // 실패 시 offset 초기화
      setLikeOffset(0);
      setDislikeOffset(0);
      setLocalReaction(null);
    },
  });

  if (isNestLoading || !nest) {
    return (
      <div className="min-h-screen bg-[#F7F4EC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#5C5346] border-t-transparent animate-spin" />
          <p className="text-xs text-[#8B8070]">둥지 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F4EC] flex flex-col">
      <div className="flex-1 overflow-y-auto pb-24">
        {/* 이미지 슬라이더 */}
        {nest.imageUrls.length > 0 && (
          <div className="relative w-full aspect-4/3 bg-[#EDEAE0] overflow-hidden">
            <Image
              src={nest.imageUrls[0]}
              alt={nest.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            {nest.imageUrls.length > 1 && (
              <div className="absolute bottom-3 right-3 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full">
                1 / {nest.imageUrls.length}
              </div>
            )}
          </div>
        )}

        <div className="px-5 pt-4 space-y-4">
          {/* 카테고리 칩 + 작성자 */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
              {nest.categoryNames.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#EDEAE0] text-[#5C5346] text-xs font-medium rounded-full"
                >
                  <Hash className="w-2.5 h-2.5" />
                  {name}
                </span>
              ))}
            </div>

            {/* 작성자 */}
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="w-6 h-6 rounded-full overflow-hidden bg-[#EDEAE0] shrink-0">
                <Image
                  src={nest.creatorProfileImageUrl}
                  alt={nest.creatorNickname}
                  width={24}
                  height={24}
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="text-xs font-medium text-[#5C5346]">
                {nest.creatorNickname}
              </span>
            </div>
          </div>

          {/* 제목 */}
          {nest.title && (
            <h1 className="text-base font-semibold text-[#3D3830] leading-snug">
              {nest.title}
            </h1>
          )}

          {/* 본문 */}
          <p className="text-sm text-[#3D3830] leading-relaxed whitespace-pre-wrap">
            {nest.content}
          </p>

          {/* 구분선 */}
          <div className="h-px bg-[#E0DDD3]" />

          {/* 좋아요/싫어요 + 날짜 + 신고 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => reactionMutation.mutate("LIKE")}
                disabled={reactionMutation.isPending}
                className={`flex items-center gap-1.5 transition-colors ${
                  localReaction === "LIKE"
                    ? "text-[#5C5346]"
                    : "text-[#B0AC9C] hover:text-[#8B8070]"
                }`}
              >
                <ThumbsUp
                  className={`w-5 h-5 ${localReaction === "LIKE" ? "fill-[#5C5346]" : ""}`}
                />
                <span className="text-xs font-medium">{displayLikeCount}</span>
              </button>

              <button
                type="button"
                onClick={() => reactionMutation.mutate("DISLIKE")}
                disabled={reactionMutation.isPending}
                className={`flex items-center gap-1.5 transition-colors ${
                  localReaction === "DISLIKE"
                    ? "text-red-400"
                    : "text-[#B0AC9C] hover:text-[#8B8070]"
                }`}
              >
                <ThumbsDown
                  className={`w-5 h-5 ${localReaction === "DISLIKE" ? "fill-red-400" : ""}`}
                />
                <span className="text-xs font-medium">
                  {displayDislikeCount}
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#B0AC9C]">
                {formatDate(nest.createdAt)}
              </span>
              <button
                type="button"
                onClick={() => setReportOpen(true)}
                className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 transition-colors"
              >
                <AlertCircle className="w-3.5 h-3.5 text-red-400" />
              </button>
            </div>
          </div>

          {/* 구분선 */}
          <div className="h-px bg-[#E0DDD3]" />
        </div>
      </div>
    </div>
  );
}
