"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { postReport } from "@/lib/api";
import type { ReportType, ReportReason } from "@/types";

interface Props {
  open: boolean;
  reportType: ReportType;
  targetId: number;
  accessToken: string;
  onClose: () => void;
  onSuccess: () => void;
  onError: () => void;
}

const REASON_LABELS: Record<ReportReason, string> = {
  ABUSE: "욕설 및 비방",
  SPAM: "스팸",
  ADVERTISEMENT: "광고",
  OTHER: "기타",
};

export function ReportModal({
  open,
  reportType,
  targetId,
  accessToken,
  onClose,
  onSuccess,
  onError,
}: Props) {
  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(
    null,
  );
  const [content, setContent] = useState("");
  const [validationError, setValidationError] = useState("");

  const reportMutation = useMutation({
    mutationFn: () =>
      postReport(
        {
          reportType,
          targetId,
          reason: selectedReason!,
          ...(selectedReason === "OTHER" ? { content } : {}),
        },
        accessToken,
      ),
    onSuccess: () => {
      handleReset();
      onSuccess();
    },
    onError: () => {
      onError();
    },
  });

  const handleReset = () => {
    setSelectedReason(null);
    setContent("");
    setValidationError("");
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSubmit = () => {
    if (!selectedReason) {
      setValidationError("신고 사유를 선택해주세요.");
      return;
    }
    if (selectedReason === "OTHER" && !content.trim()) {
      setValidationError("상세 사유를 작성해주세요.");
      return;
    }
    setValidationError("");
    reportMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="flex flex-col gap-4 bg-[#F7F4EC] border-[#E0DDD3] rounded-3xl w-[calc(100vw-2rem)] max-w-sm px-6 py-6">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold text-[#3D3830]">
            신고하기
          </DialogTitle>
        </DialogHeader>

        {/* 신고 사유 선택 */}
        <div className="space-y-2">
          {(Object.keys(REASON_LABELS) as ReportReason[]).map((reason) => (
            <button
              key={reason}
              type="button"
              onClick={() => {
                setSelectedReason(reason);
                setValidationError("");
                if (reason !== "OTHER") setContent("");
              }}
              className={`w-full text-left px-4 py-3 rounded-2xl border text-sm transition-all ${
                selectedReason === reason
                  ? "border-[#5C5346] bg-[#5C5346]/5 text-[#5C5346] font-medium"
                  : "border-[#E0DDD3] bg-white text-[#3D3830] hover:border-[#C8C4B0]"
              }`}
            >
              {REASON_LABELS[reason]}
            </button>
          ))}
        </div>

        {/* 기타 선택 시 상세 사유 입력 */}
        {selectedReason === "OTHER" && (
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setValidationError("");
            }}
            placeholder="상세 사유를 작성해주세요."
            rows={3}
            className="w-full resize-none bg-white border border-[#E0DDD3] rounded-2xl px-4 py-3 text-sm text-[#3D3830] placeholder:text-[#B0AC9C] outline-none focus:ring-2 focus:ring-[#5C5346]/30 transition-all"
          />
        )}

        {/* 유효성 검사 오류 */}
        {validationError && (
          <p className="text-xs text-red-400">{validationError}</p>
        )}

        {/* 신고하기 버튼 */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={reportMutation.isPending}
          className="w-full h-12 rounded-2xl bg-[#5C5346] text-white text-sm font-semibold transition-all active:scale-95 hover:bg-[#4A4237] disabled:opacity-50"
        >
          {reportMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
          ) : (
            "신고하기"
          )}
        </button>
      </DialogContent>
    </Dialog>
  );
}
