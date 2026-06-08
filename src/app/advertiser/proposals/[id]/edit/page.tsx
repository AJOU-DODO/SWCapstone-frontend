"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { updateAdProposal, getMyProposals } from "@/lib/apiAdvertiser";
import AdProposalForm, {
  AdProposalFormData,
} from "@/components/advertiser/AdProposalForm";
import type { AdProposal } from "@/types/indexAdvertiser";

export default function EditProposalPage() {
  const router = useRouter();
  const params = useParams();
  const proposalId = Number(params.id);

  const [proposal, setProposal] = useState<AdProposal | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const data = await getMyProposals();
        const found = data.data.find((p: AdProposal) => p.id === proposalId);
        if (found) setProposal(found);
      } catch (error) {
        console.error("신청 내역 로딩 실패:", error);
      }
    };
    fetchProposal();
  }, [proposalId]);

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
      await updateAdProposal(proposalId, {
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
      console.error("광고 수정 실패:", error);
      setError("광고 수정에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!proposal) {
    return (
      <div className="p-10 flex items-center justify-center text-gray-400">
        로딩 중...
      </div>
    );
  }

  return (
    <div className="p-10 pr-20 flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← 뒤로
        </button>
        <h1 className="text-2xl font-bold text-gray-800">광고 수정</h1>
      </div>

      {proposal.rejectReason && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <p className="text-sm text-red-600">
            <span className="font-semibold">반려 사유:</span>{" "}
            {proposal.rejectReason}
          </p>
        </div>
      )}

      <div className="max-w-xl mx-auto w-full">
        <AdProposalForm
          initialData={{
            title: proposal.title,
            content: proposal.content,
            latitude: String(proposal.latitude),
            longitude: String(proposal.longitude),
            unlockRadius: proposal.unlockRadius,
            imageUrls: proposal.imageUrls,
            categoryIds: [],
          }}
          isSubmitting={isSubmitting}
          error={error}
          submitLabel="수정 후 재심사 요청"
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
