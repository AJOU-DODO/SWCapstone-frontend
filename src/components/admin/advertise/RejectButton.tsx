"use client";

import { useState } from "react";
import { rejectAdvertisement } from '@/lib/adminApi/advertise';

interface RejectButtonProps {
  adId: number;
  onSuccess: () => void; // 반려 성공 후 목록 새로고침 및 모달 닫기용 콜백
}

export default function RejectButton({ adId, onSuccess }: RejectButtonProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rejectReason.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await rejectAdvertisement({
        proposalId: adId,
        rejectReason: rejectReason.trim(),
      });

      setIsFormOpen(false);
      setRejectReason("");
      onSuccess();
    } catch (error) {
      console.error("광고 반려 처리 실패:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsFormOpen(true)}
        className="px-4 py-2 text-sm font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
      >
        반려하기
      </button>

      {isFormOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
          onClick={() => setIsFormOpen(false)}
        >
          {/* 모달 본체 (승인 모달과 동일한 톤앤매너) */}
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
            className="bg-[#FAF7E4] rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4 text-left shadow-2xl"
          >
            <div>
              <h4 className="text-lg font-bold text-rose-700">광고 신청 반려</h4>
              <p className="text-xs text-[#54513E]/80 mt-1">
                광고주에게 전달될 반려 사유를 명확하게 작성해 주세요.
              </p>
            </div>

            <hr className="border-gray-200" />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#54513E]/70">반려 사유</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="예: 첨부된 이미지의 화질이 너무 낮거나, 광고 규정에 맞지 않는 문구가 포함되어 있습니다."
                rows={4}
                maxLength={500} // 과도하게 긴 텍스트 방어
                className="w-full px-3 py-2 border-2 border-[#54513E]/30 focus:border-rose-600 rounded-xl text-sm bg-[#FAF7E4] focus:outline-none font-medium resize-none placeholder:text-gray-400"
                required
              />
              <div className="text-right text-[10px] text-gray-400">
                {rejectReason.length} / 500자
              </div>
            </div>

            {/* 하단 버튼 묶음 */}
            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                disabled={isSubmitting}
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors disabled:bg-gray-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? "처리 중..." : "반려 확정"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}