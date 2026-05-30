"use client";

import { useState } from "react";
import Image from "next/image";

import { ThumbsUp, AlertTriangle, ShieldCheck, Trash2, CornerDownRight } from "lucide-react";
import { NestComment } from '@/types/indexAdmin';
import { useReportActions } from "@/hooks/admin/useReportActions";
import RejectModal from "@/components/admin/nest/RejectModal";
import DeleteModal from "@/components/admin/nest/DeleteModal";

interface CommentItemProps {
  authorId: number;
  profileImageUrl: string;
  commentId: number;
  nickname: string;
  content: string;
  reportCount: number;
  likeCount: number;
  isSubComment?: boolean;
  childrenComments: NestComment[];
  createdAt: string;
  deleted: boolean;
  triggerRefresh: () => void;
}

// 댓글 신고 수에 따라 색상 표현
const getReportBgColor = (count: number) => {
    if (count >= 20) return "bg-red-200/90 border-red-300 hover:bg-red-300/80";
    if (count >= 10) return "bg-orange-200/80 border-orange-300 hover:bg-orange-300/70";
    if (count >= 1) return "bg-yellow-50 border-yellow-300 hover:bg-yellow-100/70";
    
    return "bg-[#FAF7E4]/50 hover:bg-[#FAF7E4]/80";
  };

export default function CommentList ({ comment, triggerRefresh }: { comment: NestComment[]; triggerRefresh: () => void; }) {

  return (
    <div className="p-4 flex flex-col gap-3 bg-[#E8E4CD] border-t border-[#54513E]">
      
      {/* 댓글 영역 타이틀 */}
      <div className="text-xs font-bold text-[#54513E] flex items-center gap-1.5 select-none">
        댓글 목록 <span className="text-red-500 font-extrabold">{comment.length}</span>
      </div>

      {/* 댓글 아이템들이 세로로 쌓이는 구역 */}
      <div className="flex flex-col gap-2.5">
        {comment.map((comment) => (
          <CommentItem
            key={comment.commentId}
            authorId={comment.authorId}
            profileImageUrl={comment.profileImageUrl}
            commentId={comment.commentId}
            nickname={comment.authorNickname}
            content={comment.content}
            reportCount={comment.pendingReportCount}
            likeCount={comment.likeCount}
            isSubComment={!!comment.parentId}
            childrenComments={comment.children}
            createdAt={comment.createdAt}
            deleted={comment.deleted}
            triggerRefresh={triggerRefresh}
          />
        ))}
      </div>

    </div>
  );
};

export function CommentItem({ authorId, profileImageUrl, commentId, nickname, content, reportCount, createdAt, likeCount, isSubComment, childrenComments, deleted, triggerRefresh }: CommentItemProps) {
  const bgStyles = getReportBgColor(reportCount);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { handleCommentRejectReport, isLoading } = useReportActions({
    targetId: commentId,
    onSuccess: () => {
      setIsRejectModalOpen(false);
      triggerRefresh();
    }
  });

  const { handleCommentDelete, isLoading: isDeleteLoading } = useReportActions({
    targetId: commentId,
    onSuccess: () => {
      setIsDeleteModalOpen(false);
      triggerRefresh();
    }
  });

  return (
    <>
    <div className={`flex flex-row items-start justify-between p-3.5 border border-[#54513E] rounded-xl shadow-sm ${bgStyles} ${isSubComment ? "pl-8" : ""}
    ${deleted 
          ? "bg-gray-50 border-gray-200 opacity-70 selection:bg-transparent"
          : `${bgStyles} border-[#54513E]`
        }`}>
      {isSubComment && (
        <CornerDownRight size={16} className="text-gray-400 mt-2 flex-shrink-0" />
      )}

      {/* 왼쪽: 프로필 + 유저 정보 + 댓글 본문 */}
      <div className="flex flex-row items-start gap-3 min-w-0 flex-1">
        
        {/* 프로필 사진 영역 */}
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 border border-[#54513E] flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-500 select-none">
          {profileImageUrl ? (
              <Image 
                src={profileImageUrl} 
                alt={`${nickname}의 프로필`} 
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            ) : (
              nickname[0]
            )}
        </div>

        {/* 유저 정보 및 댓글 내용 */}
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-800">{nickname}</span>
            <span className="text-[10px] text-gray-400">{new Date(createdAt).toLocaleDateString()}</span>
          </div>
          {/* 댓글 본문 */}
          <p className="text-xs text-gray-600 leading-relaxed break-all">
            {content}
          </p>
        </div>
      </div>

      {/* 오른쪽: 메트릭 지표(좋아요, 신고수) + 어드민 액션 버튼 */}
      <div className="flex flex-col items-end gap-3 flex-shrink-0">
        
        {/* 지표 레이어 ( 좋아요 & 신고수) */}
        <div className="flex flex-row items-center gap-2 select-none">
          <div className="flex items-center gap-1 text-[11px] font-medium text-[#2B6340] px-2 py-0.5">
            <ThumbsUp size={11} className="stroke-[2.5]" />
            <span>{likeCount}</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 px-2 py-0.5">
            <AlertTriangle size={11} className="stroke-[2.5]" />
            <span>{reportCount}</span>
          </div>
        </div>

        <div className="flex flex-row gap-1">
          {/* 정상 댓글이라 판단하여 신고 반려 (신고 취소) */}
          {!deleted && (
            <>
              {reportCount !==0 && (
              <button 
              onClick={() => setIsRejectModalOpen(true)}
              className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-green-600 bg-green-100 hover:bg-green-200 border border-gray-200 rounded-md transition-colors">
                <ShieldCheck size={12} />
                <span>취소</span>
              </button>
              )}
              
              {/* 악성 댓글이라 판단하여 삭제 조치 + 유저 제재 처리 */}
              <button 
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-md transition-colors">
                <Trash2 size={12} />
                <span>삭제</span>
              </button>
            </>
          )}

          <RejectModal
            isOpen={isRejectModalOpen}
            onClose={() => setIsRejectModalOpen(false)}
            onConfirm={handleCommentRejectReport} // 모달 안에서 확인을 누르면 실제 API 호출 로직 실행!
            isLoading={isLoading}
            title="신고 반려 확인"
            message="정말로 이 콘텐츠에 들어온 모든 대기 상태의 신고를 반려하시겠습니까?"
          />

          <DeleteModal
            targetType="COMMENT"
            authorId={authorId}
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleCommentDelete}
            isLoading={isDeleteLoading}
            title="댓글 삭제 확인"
            message="정말로 이 콘텐츠를 삭제하시겠습니까?"
          />
        </div>
      </div>
    </div>

    {childrenComments && childrenComments.length > 0 && (
      <div className="flex flex-col gap-2.5 mt-1">
        {childrenComments.map((subComment) => (
          <CommentItem
            key={subComment.commentId}
            authorId={subComment.authorId}
            profileImageUrl={subComment.profileImageUrl}
            commentId={subComment.commentId}
            nickname={subComment.authorNickname}
            content={subComment.content}
            reportCount={subComment.pendingReportCount}
            createdAt={subComment.createdAt}
            likeCount={subComment.likeCount}
            isSubComment={true}
            childrenComments={subComment.children}
            deleted={subComment.deleted}
            triggerRefresh={triggerRefresh}
          />
        ))}
      </div>
    )}
    </>
  );
}