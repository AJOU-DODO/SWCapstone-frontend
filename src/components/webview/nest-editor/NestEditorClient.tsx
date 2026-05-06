"use client";

import { useCallback, useState } from "react";
import { Loader2, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { useBridge } from "@/lib/hooks/useBridge";
import { useNestEditorStore } from "@/lib/store/nestEditorStore";
import {
  saveDraft,
  publishNest,
  fetchPresignedUrls,
  uploadImageToS3,
} from "@/lib/api";
import { ImageUploader } from "./ImageUploader";
import { CategorySelector } from "./CategorySelector";
import { UnlockRadiusSelector } from "./UnlockRadiusSelector";
import { ContentEditor } from "./ContentEditor";
import { DraftListModal } from "./DraftListModal";
import type { DraftItem } from "@/types";
import { TitleInput } from "./TitleInput";

type ToastState = { type: "success" | "error"; message: string } | null;

export function NestEditorClient() {
  useBridge();
  const {
    accessToken,
    imageUrls,
    isSubmitting,
    setSubmitting,
    getDraftPayload,
    getPublishPayload,
    setContent,
    setUnlockRadius,
    setCategoryIds,
    setTitle,
    errors,
  } = useNestEditorStore();

  const [toast, setToast] = useState<ToastState>(null);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDraft = useCallback(async () => {
    if (isSubmitting || !accessToken) return;
    setSubmitting(true);
    try {
      const payload = getDraftPayload();
      await saveDraft(payload, accessToken);
      showToast("success", "임시 저장되었습니다.");
    } catch {
      showToast("error", "임시 저장에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }, [isSubmitting, accessToken, getDraftPayload, setSubmitting]);

  const handlePublish = useCallback(async () => {
    if (isSubmitting || !accessToken) return;
    const payload = getPublishPayload();
    if (!payload) return;
    setSubmitting(true);
    try {
      // 발행 시점에 파일명 생성
      const fileNames = imageUrls.map(
        (_, index) => `image_${Date.now()}_${index}.png`,
      );

      console.log(fileNames[0]);

      // presigned URL 발급
      const presignedItems = await fetchPresignedUrls(fileNames, accessToken);

      // 각 이미지를 S3에 병렬 업로드
      await Promise.all(
        presignedItems.data.map((item, index) =>
          uploadImageToS3(item.presignedUrl, imageUrls[index]),
        ),
      );

      // fileUrl 배열로 업데이트 후 발행
      const fileUrls = presignedItems.data.map((item) => item.fileUrl);
      await publishNest({ ...payload, imageUrls: fileUrls }, accessToken);

      showToast("success", "게시물이 발행되었습니다.");
    } catch {
      showToast("error", "발행에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }, [isSubmitting, accessToken, imageUrls, getPublishPayload, setSubmitting]);

  const handleLoadDraft = useCallback(
    (draft: DraftItem) => {
      setTitle(draft.title ?? "");
      setContent(draft.content ?? "");
      setUnlockRadius(draft.unlockRadius);
      setCategoryIds(draft.categoryIds ?? []);
      useNestEditorStore.setState({ imageUrls: draft.imageUrls ?? [] });
      setIsDraftModalOpen(false);
      showToast("success", "임시저장 내용을 불러왔습니다.");
    },
    [setTitle, setContent, setUnlockRadius, setCategoryIds],
  );

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="min-h-screen bg-[#FAF7E4] flex flex-col">
      {toast && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl shadow-lg text-sm font-medium transition-all ${
            toast.type === "success"
              ? "bg-[#5C5346] text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {toast.message}
        </div>
      )}

      {/* 임시저장 목록 모달 */}
      {isDraftModalOpen && accessToken && (
        <DraftListModal
          accessToken={accessToken}
          open={isDraftModalOpen}
          onClose={() => setIsDraftModalOpen(false)}
          onLoad={handleLoadDraft}
        />
      )}

      {/* 상단 헤더 */}
      <div className="flex justify-end px-5 pt-4">
        <button
          type="button"
          onClick={() => setIsDraftModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EDEAE0] text-[#5C5346] text-xs font-medium transition-all active:scale-95 hover:bg-[#E2DFD5]"
        >
          <Clock className="w-3.5 h-3.5" />
          임시저장 목록
        </button>
      </div>

      <div className="flex-1 px-5 pt-5 pb-4 space-y-5">
        <section>
          <ImageUploader />
        </section>

        <div className="h-px bg-[#E0DDD3]" />

        <section>
          <span className="text-s text-[#8B8070] font-medium">
            카테고리 선택
          </span>
          <CategorySelector />
        </section>

        <div className="h-px bg-[#E0DDD3]" />

        <section className="space-y-3">
          <UnlockRadiusSelector />
        </section>

        <div className="h-px bg-[#E0DDD3]" />

        <section>
          <TitleInput />
        </section>

        <section>
          <ContentEditor />
        </section>

        {hasErrors && (
          <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 space-y-1">
            {Object.values(errors).map((err, i) => (
              <p
                key={i}
                className="text-xs text-red-500 flex items-center gap-1.5"
              >
                <AlertCircle className="w-3 h-3 shrink-0" />
                {err}
              </p>
            ))}
          </div>
        )}

        <div className="px-5 pb-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleDraft}
            disabled={isSubmitting}
            className="h-12 rounded-2xl border-2 border-[#C8C4B0] bg-transparent text-[#5C5346] text-sm font-semibold transition-all active:scale-95 hover:bg-[#EDE9DA] disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin mx-auto" />
            ) : (
              "임시저장"
            )}
          </button>

          <button
            type="button"
            onClick={handlePublish}
            disabled={isSubmitting}
            className="h-12 rounded-2xl bg-[#5C5346] text-white text-sm font-semibold transition-all active:scale-95 hover:bg-[#4A4237] disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin mx-auto" />
            ) : (
              "발행하기"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
