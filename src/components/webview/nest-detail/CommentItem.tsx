"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ThumbsUp,
  AlertCircle,
  Send,
  MessageCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  postComment,
  toggleCommentLike,
  updateComment,
  deleteComment,
} from "@/lib/api";
import type { NestComment, ReportType } from "@/types";

interface Props {
  comment: NestComment;
  nestId: string;
  accessToken: string;
  sortBy: string;
  isChild?: boolean;
  onReportClick: (type: ReportType, targetId: number) => void;
  onDeleteClick: (commentId: number) => void;
}

export function CommentItem({
  comment,
  nestId,
  accessToken,
  sortBy,
  isChild = false,
  onReportClick,
  onDeleteClick,
}: Props) {
  const queryClient = useQueryClient();
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [likeState, setLikeState] = useState({
    liked: comment.liked,
    likeCount: comment.likeCount,
  });

  const invalidateComments = () => {
    queryClient.invalidateQueries({ queryKey: ["comments", nestId, sortBy] });
  };

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
      invalidateComments();
    },
  });

  // 댓글 수정
  const editMutation = useMutation({
    mutationFn: () => updateComment(comment.id, editText, accessToken),
    onSuccess: () => {
      setIsEditing(false);
      invalidateComments();
    },
  });

  const handleSendReply = () => {
    if (!replyText.trim() || replyMutation.isPending) return;
    replyMutation.mutate();
  };

  const handleEdit = () => {
    if (!editText.trim() || editMutation.isPending) return;
    editMutation.mutate();
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
            {/* 수정 모드 */}
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleEdit()}
                  className="flex-1 text-xs text-[#3D3830] outline-none bg-transparent border-b border-[#E0DDD3]"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleEdit}
                  disabled={!editText.trim() || editMutation.isPending}
                  className="w-5 h-5 rounded-full bg-[#5C5346] flex items-center justify-center disabled:opacity-40"
                >
                  <Send className="w-2.5 h-2.5 text-white" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditText(comment.content);
                  }}
                  className="text-[10px] text-[#B0AC9C]"
                >
                  취소
                </button>
              </div>
            ) : (
              <p className="text-xs text-[#3D3830] leading-relaxed">
                {comment.content}
              </p>
            )}
          </div>

          {/* 좋아요 & 답글 & 신고 & 수정 & 삭제 */}
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
              onClick={() => onReportClick("COMMENT", comment.id)}
              className="flex items-center gap-1 text-[10px] text-[#B0AC9C] hover:text-red-400 transition-colors"
            >
              <AlertCircle className="w-3 h-3" />
              신고
            </button>

            {/* mine이 true일 때만 수정/삭제 버튼 표시 */}
            {comment.mine && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(true);
                    setEditText(comment.content);
                  }}
                  className="flex items-center gap-1 text-[10px] text-[#B0AC9C] hover:text-[#5C5346] transition-colors"
                >
                  <Pencil className="w-3 h-3" />
                  수정
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteClick(comment.id)}
                  className="flex items-center gap-1 text-[10px] text-[#B0AC9C] hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  삭제
                </button>
              </>
            )}
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
          onReportClick={onReportClick}
          onDeleteClick={onDeleteClick}
        />
      ))}
    </>
  );
}
