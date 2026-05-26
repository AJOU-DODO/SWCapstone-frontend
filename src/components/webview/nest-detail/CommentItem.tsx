"use client";

import { useState } from "react";
import Image from "next/image";
import { ThumbsUp, AlertCircle, Send, MessageCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postComment, toggleCommentLike } from "@/lib/api";
import { ReportModal } from "./ReportModal";
import type { NestComment } from "@/types";

interface Props {
  comment: NestComment;
  nestId: string;
  accessToken: string;
  sortBy: string;
  isChild?: boolean;
  onReportSuccess: () => void;
  onReportError: () => void;
}

export function CommentItem({
  comment,
  nestId,
  accessToken,
  sortBy,
  isChild = false,
  onReportSuccess,
  onReportError,
}: Props) {
  const queryClient = useQueryClient();
  const [reportOpen, setReportOpen] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [likeState, setLikeState] = useState({
    liked: comment.liked,
    likeCount: comment.likeCount,
  });

  // 댓글 좋아요
  const likeMutation = useMutation({
    mutationFn: () => toggleCommentLike(comment.id, accessToken),
    onMutate: () => {
      setLikeState((prev) => ({
        liked: !prev.liked,
        likeCount: prev.liked ? prev.likeCount - 1 : prev.likeCount + 1,
      }));
    },
    onError: () => {
      // 실패 시 원래 상태로 복구
      setLikeState({
        liked: comment.liked,
        likeCount: comment.likeCount,
      });
    },
  });

  // 댓글 작성
  const replyMutation = useMutation({
    mutationFn: () => postComment(nestId, replyText, accessToken, comment.id),
    onSuccess: () => {
      setReplyText("");
      setReplyOpen(false);
      queryClient.invalidateQueries({ queryKey: ["comments", nestId, sortBy] });
    },
  });

  const handleSendReply = () => {
    if (!replyText.trim() || replyMutation.isPending) return;
    replyMutation.mutate();
  };

  return (
    <>
      <div className={`flex gap-2.5 ${isChild ? "pl-8 pt-2" : ""}`}>
        {/* 프로필 이미지 */}
        <div className="shrink-0 w-8 h-8 rounded-full overflow-hidden bg-[#EDEAE0]">
          <Image
            src={comment.profileImageUrl}
            alt={comment.nickname}
            width={32}
            height={32}
            className="object-cover w-full h-full"
          />
        </div>

        {/* 댓글 내용 */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl rounded-tl-sm px-3.5 py-2.5 border border-[#E0DDD3]">
            <p className="text-[11px] font-semibold text-[#5C5346] mb-1">
              {comment.nickname}
            </p>
            <p className="text-xs text-[#3D3830] leading-relaxed">
              {comment.content}
            </p>
          </div>

          {/* 좋아요 & 답글 & 신고 */}
          <div className="flex items-center gap-3 mt-1.5 px-1">
            <button
              type="button"
              onClick={() => likeMutation.mutate()}
              disabled={likeMutation.isPending}
              className={`flex items-center gap-1 text-[10px] transition-colors ${
                likeState.liked ? "text-[#5C5346]" : "text-[#B0AC9C]"
              }`}
            >
              <ThumbsUp
                className={`w-3 h-3 ${likeState.liked ? "fill-[#5C5346]" : ""}`}
              />
              {likeState.likeCount}
            </button>

            {/* 대댓글은 답글 버튼 숨김 */}
            {!isChild && (
              <button
                type="button"
                onClick={() => setReplyOpen((prev) => !prev)}
                className="flex items-center gap-1 text-[10px] text-[#B0AC9C] hover:text-[#5C5346] transition-colors"
              >
                <MessageCircle className="w-3 h-3" />
                답글
              </button>
            )}

            <button
              type="button"
              onClick={() => setReportOpen(true)}
              className="flex items-center gap-1 text-[10px] text-[#B0AC9C] hover:text-red-400 transition-colors"
            >
              <AlertCircle className="w-3 h-3" />
              신고
            </button>
          </div>

          {/* 대댓글 입력창 */}
          {replyOpen && (
            <div className="flex items-center gap-2 mt-2 bg-white border border-[#E0DDD3] rounded-2xl px-3 py-1.5">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendReply()}
                placeholder="답글을 작성하세요."
                className="flex-1 text-xs text-[#3D3830] placeholder:text-[#B0AC9C] outline-none bg-transparent"
              />
              <button
                type="button"
                onClick={handleSendReply}
                disabled={!replyText.trim() || replyMutation.isPending}
                className="w-6 h-6 rounded-full bg-[#5C5346] flex items-center justify-center transition-all active:scale-95 disabled:opacity-40"
              >
                <Send className="w-3 h-3 text-white" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 대댓글 목록 */}
      {comment.children.map((child) => (
        <CommentItem
          key={child.id}
          comment={child}
          nestId={nestId}
          accessToken={accessToken}
          sortBy={sortBy}
          isChild
          onReportSuccess={onReportSuccess}
          onReportError={onReportError}
        />
      ))}

      {/* 신고 모달 */}
      <ReportModal
        open={reportOpen}
        reportType="COMMENT"
        targetId={comment.id}
        accessToken={accessToken}
        onClose={() => setReportOpen(false)}
        onSuccess={() => {
          setReportOpen(false);
          onReportSuccess();
        }}
        onError={onReportError}
      />
    </>
  );
}
