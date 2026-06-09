"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAdProposal } from "@/lib/apiAdvertiser";
import AdProposalForm, {
  AdProposalFormData,
} from "@/components/advertiser/AdProposalForm";

export default function NewProposalPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: AdProposalFormData) => {
    if (!formData.title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }
    if (!formData.content.trim()) {
      setError("내용을 입력해주세요.");
      return;
    }
    if (!formData.latitude || !formData.longitude) {
      setError("위도와 경도를 입력해주세요.");
      return;
    }
    if (formData.categoryIds.length === 0) {
      setError("카테고리를 1개 이상 선택해주세요.");
      return;
    }
    const filteredImageUrls = formData.imageUrls.filter((url) => url.trim());

    setError(null);
    setIsSubmitting(true);
    try {
      await createAdProposal({
        title: formData.title,
        content: formData.content,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        unlockRadius: formData.unlockRadius,
        imageUrls: filteredImageUrls,
        categoryIds: formData.categoryIds,
      });
      router.push("/advertiser");
    } catch (error) {
      console.error("광고 신청 실패:", error);
      setError("광고 신청에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-10 pr-20 flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← 뒤로
        </button>
        <h1 className="text-2xl font-bold text-gray-800">새 광고 신청</h1>
      </div>

      <div className="max-w-xl mx-auto w-full">
        <AdProposalForm
          isSubmitting={isSubmitting}
          error={error}
          submitLabel="광고 신청"
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
