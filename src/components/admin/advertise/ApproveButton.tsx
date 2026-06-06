"use client";

import { useState } from "react";
import { approveAdvertisement } from '@/lib/adminApi/advertise';
import { AdvertisementPayload } from '@/types/indexAdmin';

interface ApproveButtonProps {
  adId: number;
  onSuccess: () => void; 
}

export default function ApproveButton({ adId, onSuccess }: ApproveButtonProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [expiryDate, setExpiryDate] = useState("");
  const [exposureType, setExposureType] = useState<string>("20");
  const [customExposure, setCustomExposure] = useState<number>(50);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expiryDate) {
      alert("광고 만료일을 선택해 주세요.");
      return;
    }

    let finalExposureRate = exposureType === "custom" ? customExposure : Number(exposureType);

    if (exposureType === "custom") {
      if (
        isNaN(finalExposureRate) || 
        finalExposureRate === 0 || 
        !Number.isInteger(finalExposureRate)
      ) {
        alert("노출도에 올바른 숫자를 입력해 주세요. (1부터 100 사이의 정수만 가능)");
        return;
      }

      if (finalExposureRate > 100) finalExposureRate = 100;
      if (finalExposureRate < 1) finalExposureRate = 1;
    }

      setIsSubmitting(true);
    try {
      const params: { proposalId: number; body: AdvertisementPayload } = {
        proposalId: adId,
        body: {
          expiredAt: new Date(`${expiryDate}T23:59:59.999Z`).toISOString(),
          priorityScore: finalExposureRate
        }
      };

      await approveAdvertisement(params);
      
      setIsFormOpen(false);
      onSuccess(); 
    } catch (error) {
      console.error("광고 승인 처리 실패:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* 트리거 버튼 */}
      <button
        onClick={() => setIsFormOpen(true)}
        className="px-4 py-2 text-sm font-semibold text-white bg-[#54513E] hover:bg-[#2B6340] rounded-xl transition-colors"
      >
        승인하기
      </button>

      {/* 승인 조건 입력 서브 모달 */}
      {isFormOpen && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
          onClick={() => setIsFormOpen(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()} 
            onSubmit={handleSubmit}
            className="bg-[#FAF7E4] rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4 text-left shadow-2xl"
          >
            <div>
              <h4 className="text-lg font-bold text-[#54513E]">광고 승인 조건 설정</h4>
              <p className="text-xs text-[#54513E]/80 mt-1">광고주가 신청한 광고의 활성화 조건을 입력하세요.</p>
            </div>

            <hr className="border-gray-100" />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#54513E]/70">광고 만료일</label>
              <input
                type="date"
                value={expiryDate}
                min={(() => {
                  const today = new Date();
                  const yyyy = today.getFullYear();
                  const mm = String(today.getMonth() + 1).padStart(2, '0');
                  const dd = String(today.getDate()).padStart(2, '0');
                  return `${yyyy}-${mm}-${dd}`;
                })()}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3 py-2 border border-[#54513E]/50 rounded-xl text-sm focus:outline-none focus:border-[#2B6340] border-2 font-medium"
                required
              />
            </div>

            {/* 입력 필드 2: 노출도 선택 영역 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#54513E]/70">광고 노출도 (우선순위)</label>
              <select
                value={exposureType} // 👈 exposureRate 대신 정돈된 exposureType 상태 연결
                onChange={(e) => setExposureType(e.target.value)}
                className="w-full px-3 py-2 border border-[#54513E]/50 rounded-xl text-sm bg-[#FAF7E4] focus:outline-none focus:border-[#2B6340] border-2 font-medium"
              >
                <option value="20">1단계 (20점 - 기본 노출)</option>
                <option value="40">2단계 (40점 - 중간 노출)</option>
                <option value="60">3단계 (60점 - 상단 노출)</option>
                <option value="80">4단계 (80점 - 고우선 노출)</option>
                <option value="100">5단계 (100점 - 최상단 노출)</option>
                <option value="custom">직접 입력 (1 ~ 100)</option>
              </select>
            </div>

            {/* 하단 조건부 렌더링: 직접 입력을 선택했을 때만 등장 */}
            {exposureType === "custom" && (
              <div className="flex items-center gap-2 mt-1 animate-fadeIn">
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={customExposure === 0 ? "" : customExposure}
                  
                  onChange={(e) => {
                    const val = e.target.value === "" ? 0 : Number(e.target.value);
                    setCustomExposure(val);
                  }}

                  onBlur={() => {
                    if (customExposure > 100) setCustomExposure(100);
                    if (customExposure < 1) setCustomExposure(1);
                  }}
                  className="w-full px-3 py-1.5 border border-2 border-[#2B6340] bg-[#FAF7E4] rounded-xl text-sm focus:outline-none font-semibold text-[#54513E]"
                  placeholder="숫자 입력 (1~100)"
                  required
                />
                <span className="text-xs font-medium text-blue-500 flex-shrink-0">점</span>
              </div>
            )}

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
                className="px-4 py-2 text-sm font-semibold text-white bg-[#54513E] hover:bg-[#2B6340] rounded-xl transition-colors disabled:bg-gray-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? "처리 중..." : "최종 승인"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}