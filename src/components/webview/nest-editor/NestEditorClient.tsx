"use client";

import { useCallback, useState } from "react";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useBridge } from "@/lib/hooks/useBridge";
import { useNestEditorStore } from "@/lib/store/nestEditorStore";
import { saveDraft, publishNest } from "@/lib/api";
import { ImageUploader } from "./ImageUploader";
import { CategorySelector } from "./CategorySelector";
import { UnlockRadiusSelector } from "./UnlockRadiusSelector";
import { ContentEditor } from "./ContentEditor";

type ToastState = { type: "success" | "error"; message: string } | null;

export function NestEditorClient() {
  useBridge();
  const {
    accessToken,
    isSubmitting,
    setSubmitting,
    getDraftPayload,
    getPublishPayload,
    errors,
  } = useNestEditorStore();

  const [toast, setToast] = useState<ToastState>(null);

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
      await publishNest(payload, accessToken);
      showToast("success", "게시물이 발행되었습니다.");
    } catch {
      showToast("error", "발행에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }, [isSubmitting, accessToken, getPublishPayload, setSubmitting]);

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="min-h-screen bg-[#F7F4EC] flex flex-col">
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

      <div className="flex-1 px-5 pt-5 pb-4 space-y-5">
        <section>
          <ImageUploader />
        </section>

        <div className="h-px bg-[#E0DDD3]" />

        <section className="space-y-3">
          <CategorySelector />
          <UnlockRadiusSelector />
        </section>

        <div className="h-px bg-[#E0DDD3]" />

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
