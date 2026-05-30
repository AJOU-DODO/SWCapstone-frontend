import { useState } from "react";
import { updateReportStatus, deleteNestAdmin, deleteCommentAdmin } from '@/lib/adminApi/nest';

interface UseReportActionsProps {
  targetId: number;
  onSuccess?: () => void; 
}

export function useReportActions({ targetId, onSuccess }: UseReportActionsProps) {
  const [isLoading, setIsLoading] = useState(false);

  // 둥지 신고 반려 (취소) 기능
  const handleNestRejectReport = async () => {
    setIsLoading(true);
    try {
      const payload = {
        targetType: "NEST" as const,
        targetId: targetId,
        newStatus: "REJECTED" as const
      };

      await updateReportStatus(payload);
      
      if (onSuccess) onSuccess(); 
    } catch (error) {
      console.error("둥지 신고 반려 처리 실패:", error);

    } finally {
      setIsLoading(false);
    }
  };

  // 댓글 신고 반려 (취소) 기능
  const handleCommentRejectReport = async () => {
    setIsLoading(true);
    try {
      const payload = {
        targetType: "COMMENT" as const,
        targetId: Number(targetId),
        newStatus: "REJECTED" as const
      };

      await updateReportStatus(payload);
      
      if (onSuccess) onSuccess(); 
    } catch (error) {
      console.error("댓글 신고 반려 처리 실패:", error);

    } finally {
      setIsLoading(false);
    }
  };

  // 관리자 권한으로 둥지 강제 삭제
  const handleNestDelete = async (reason: string) => {
    setIsLoading(true);
    try {

      await deleteNestAdmin(targetId, reason);
      
      if (onSuccess) onSuccess(); 
    } catch (error) {
      console.error("둥지 삭제 처리 실패:", error);

    } finally {
      setIsLoading(false);
    }
  };

  // 관리자 권한으로 댓글 강제 삭제
  const handleCommentDelete = async () => {
    setIsLoading(true);
    try {

      await deleteCommentAdmin(targetId);
      
      if (onSuccess) onSuccess(); 
    } catch (error) {
      console.error("댓글 삭제 처리 실패:", error);

    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleNestRejectReport,
    handleCommentRejectReport,
    handleNestDelete,
    handleCommentDelete,
    isLoading
  };
}