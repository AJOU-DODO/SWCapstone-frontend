import { useState } from "react";
import { updateReportStatus } from '@/lib/adminApi/nest';

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

  // 🛑 1.2 콘텐츠 삭제 기능 (나중에 여기에 이어서 구현하시면 편리합니다!)
  const handleDeleteContent = async () => {
    // 삭제 API 로직...
  };

  return {
    handleNestRejectReport,
    handleCommentRejectReport,
    handleDeleteContent,
    isLoading
  };
}