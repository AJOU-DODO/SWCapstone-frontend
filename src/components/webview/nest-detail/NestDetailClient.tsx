"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ThumbsUp,
  ThumbsDown,
  Hash,
  AlertCircle,
  Mail,
  MessageCircle,
  ChevronDown,
  Send,
  CheckCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ImageSlider } from "./ImageSlider";
import { PostcardModal } from "./PostcardModal";
import { CommentItem } from "./CommentItem";
import { ReportModal } from "./ReportModal";
import {
  fetchNestDetail,
  postReaction,
  fetchComments,
  postComment,
} from "@/lib/api";
import type { ReactionType, CommentSortType, NestComment } from "@/types";

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

const SORT_LABELS: Record<CommentSortType, string> = {
  LIKE: "좋아요순",
  LATEST: "최신순",
  DEFAULT: "등록순",
};

interface Props {
  nestId: string;
}

export function NestDetailClient({ nestId }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const commentInputRef = useRef<HTMLInputElement>(null);

  const [reportOpen, setReportOpen] = useState(false);
  const [postcardModalOpen, setPostcardModalOpen] = useState(false);

  // 낙관적 업데이트를 위한 로컬 reaction 상태
  const [localReaction, setLocalReaction] = useState<ReactionType | null>(null);
  const [likeOffset, setLikeOffset] = useState(0);
  const [dislikeOffset, setDislikeOffset] = useState(0);
  const [isReactionInitialized, setIsReactionInitialized] = useState(false);

  const [commentText, setCommentText] = useState("");
  const [sortBy, setSortBy] = useState<CommentSortType>("DEFAULT");

  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  //브릿지로 accesstoken 수신
  const [accessToken] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    try {
      const token = window.AndroidBridge.getAccessToken();
      console.log(token, nestId);
      return token ?? "";
    } catch {
      return "";
    }
  });
  // 둥지 상세 정보
  const { data: nestData, isLoading: isNestLoading } = useQuery({
    queryKey: ["nest", nestId],
    queryFn: () => fetchNestDetail(nestId, accessToken),
    enabled: !!accessToken,
  });

  const nest = nestData?.data;

  // YES 버튼 클릭 시 이동할 페이지
  const handlePostcardConfirm = () => {
    setPostcardModalOpen(false);
    router.push(`/nests/${nestId}/exchange-post`);
  };

  // 초기 reaction 상태 확인 및 동기화
  if (nest && !isReactionInitialized) {
    setLocalReaction(nest.myReaction ?? null);
    setIsReactionInitialized(true);
  }
  const displayLikeCount = (nest?.likeCount ?? 0) + likeOffset;
  const displayDislikeCount = (nest?.dislikeCount ?? 0) + dislikeOffset;

  // 댓글 목록
  const { data: commentsData, isLoading: isCommentsLoading } = useQuery({
    queryKey: ["comments", nestId, sortBy],
    queryFn: () => fetchComments(nestId, sortBy, accessToken),
    enabled: !!accessToken,
  });

  const comments: NestComment[] = commentsData ?? [];

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

  // 댓글 작성
  const commentMutation = useMutation({
    mutationFn: () => postComment(nestId, commentText, accessToken),
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: ["comments", nestId, sortBy] });
    },
  });

  const handleSendComment = () => {
    if (!commentText.trim() || commentMutation.isPending) return;
    commentMutation.mutate();
  };

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
      {/* 토스트 */}
      {toast && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl shadow-lg text-sm font-medium whitespace-nowrap ${
            toast.type === "success"
              ? "bg-[#5C5346] text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {toast.message}
        </div>
      )}

      <div className="flex-1 overflow-y-auto pb-24">
        {/* 이미지 + 편지 버튼 */}
        <div className="relative">
          <ImageSlider imageUrls={nest.imageUrls} title={nest.title} />
          {nest.hasPostcard && (
            <button
              type="button"
              onClick={() => setPostcardModalOpen(true)}
              className="absolute top-3 left-3 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm transition-all active:scale-95 hover:bg-white"
            >
              <Mail className="w-4 h-4 text-[#5C5346]" />
            </button>
          )}
        </div>

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

          <div className="h-px bg-[#E0DDD3]" />

          {/* 댓글 섹션 헤더 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-[#8B8070]" />
              <span className="text-sm font-medium text-[#5C5346]">
                댓글 {comments.length}
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-1 text-xs text-[#8B8070] hover:text-[#5C5346] transition-colors"
                >
                  {SORT_LABELS[sortBy]}
                  <ChevronDown className="w-3 h-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-[#F7F4EC] border-[#E0DDD3] rounded-2xl min-w-25"
              >
                {(Object.keys(SORT_LABELS) as CommentSortType[]).map((key) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => setSortBy(key)}
                    className={`text-xs cursor-pointer rounded-xl ${
                      sortBy === key
                        ? "text-[#5C5346] font-semibold"
                        : "text-[#8B8070]"
                    }`}
                  >
                    {SORT_LABELS[key]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* 댓글 목록 */}
          <div className="space-y-3 pb-2">
            {isCommentsLoading ? (
              <div className="flex justify-center py-6">
                <div className="w-5 h-5 rounded-full border-2 border-[#5C5346] border-t-transparent animate-spin" />
              </div>
            ) : comments.length === 0 ? (
              <p className="text-xs text-[#B0AC9C] text-center py-6">
                첫 번째 댓글을 남겨보세요.
              </p>
            ) : (
              comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  nestId={nestId}
                  accessToken={accessToken}
                  sortBy={sortBy}
                  onReportSuccess={() =>
                    showToast("success", "신고가 완료되었습니다.")
                  }
                  onReportError={() =>
                    showToast(
                      "error",
                      "신고가 실패했습니다. 다시 시도해주세요.",
                    )
                  }
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* 댓글 입력창 - 하단 고정 */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#F7F4EC] border-t border-[#E0DDD3] px-4 py-3">
        <div className="flex items-center gap-2 bg-white border border-[#E0DDD3] rounded-2xl px-3.5 py-2">
          <MessageCircle className="w-4 h-4 text-[#B0AC9C] shrink-0" />
          <input
            ref={commentInputRef}
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendComment()}
            placeholder="댓글을 작성하세요."
            className="flex-1 text-sm text-[#3D3830] placeholder:text-[#B0AC9C] outline-none bg-transparent"
          />
          <button
            type="button"
            onClick={handleSendComment}
            disabled={!commentText.trim() || commentMutation.isPending}
            className="w-7 h-7 rounded-full bg-[#5C5346] flex items-center justify-center transition-all active:scale-95 disabled:opacity-40"
          >
            <Send className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>

      {/* 엽서 모달 */}
      <PostcardModal
        open={postcardModalOpen}
        accessToken={accessToken}
        onClose={() => setPostcardModalOpen(false)}
        onConfirm={handlePostcardConfirm}
      />
      {/* 신고 모달 */}
      <ReportModal
        open={reportOpen}
        reportType="NEST"
        targetId={nest.id}
        accessToken={accessToken}
        onClose={() => setReportOpen(false)}
        onSuccess={() => {
          setReportOpen(false);
          showToast("success", "신고가 완료되었습니다.");
        }}
        onError={() =>
          showToast("error", "신고가 실패했습니다. 다시 시도해주세요.")
        }
      />
    </div>
  );
}
