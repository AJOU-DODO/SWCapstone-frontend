"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useBridge } from "@/lib/hooks/useBridge";
import { useNestEditorStore } from "@/lib/store/nestEditorStore";
import {
  fetchNestDetail,
  updateNest,
  fetchPresignedUrls,
  uploadImageToS3,
} from "@/lib/api";
import { ImageUploader } from "./ImageUploader";
import { CategorySelector } from "./CategorySelector";
import { UnlockRadiusSelector } from "./UnlockRadiusSelector";
import { PostcardSelector } from "./PostcardSelector";
import { ContentEditor } from "./ContentEditor";
import { TitleInput } from "./TitleInput";
import { BackHeader } from "../BackHeader";

type ToastState = { type: "success" | "error"; message: string } | null;

interface Props {
  nestId: string;
}

export function NestUpdateClient({ nestId }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    accessToken,
    imageUrls,
    isSubmitting,
    setSubmitting,
    setLoadedNestId,
    setInitialNestData,
    errors,
  } = useNestEditorStore();

  const [toast, setToast] = useState<ToastState>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  useState(() => {
    setLoadedNestId(nestId);
  });

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  useBridge();

  // 마운트 시 스토어 초기화 - 딱 한 번만 실행
  useEffect(() => {
    useNestEditorStore.setState({
      imageUrls: [],
      categoryIds: [],
      content: "",
      title: "",
      postcardId: null,
      errors: {},
    });
  }, []);

  // 기존 둥지 데이터 로드
  useEffect(() => {
    if (!accessToken || !isInitializing) return;

    async function loadNestData() {
      try {
        const res = await fetchNestDetail(nestId, accessToken!);
        const nest = res.data;
        setLoadedNestId(nestId);
        setInitialNestData({
          title: nest.title,
          content: nest.content,
          unlockRadius: nest.unlockRadius as 10 | 150,
          imageUrls: nest.imageUrls,
        });
      } catch {
        showToast("error", "둥지 정보를 불러오지 못했습니다.");
      } finally {
        setIsInitializing(false);
      }
    }

    loadNestData();
  }, [
    accessToken,
    nestId,
    setLoadedNestId,
    setInitialNestData,
    isInitializing,
  ]);

  // S3 업로드
  const uploadImages = useCallback(async () => {
    const tasks = imageUrls.map((url) => ({
      url,
      isNew: url.startsWith("data:"),
    }));
    const newImages = tasks.filter((t) => t.isNew);

    if (newImages.length === 0) return imageUrls;

    const fileNames = newImages.map((_, i) => `image_${Date.now()}_${i}.png`);
    const res = await fetchPresignedUrls(fileNames, accessToken!);

    await Promise.all(
      res.data.map((item, i) =>
        uploadImageToS3(item.presignedUrl, newImages[i].url),
      ),
    );

    let newIdx = 0;
    return tasks.map((t) => (t.isNew ? res.data[newIdx++].fileUrl : t.url));
  }, [imageUrls, accessToken]);

  // 수정하기
  const handleUpdate = useCallback(async () => {
    if (isSubmitting || !accessToken) return;
    setSubmitting(true);
    try {
      const fileUrls = await uploadImages();
      const state = useNestEditorStore.getState();
      const result = await updateNest(
        nestId,
        {
          title: state.title,
          content: state.content,
          unlockRadius: state.unlockRadius,
          categoryIds: state.categoryIds,
          imageUrls: fileUrls,
          postcardId: state.postcardId,
          ...(state.latitude !== null && { latitude: state.latitude }),
          ...(state.longitude !== null && { longitude: state.longitude }),
        },
        accessToken,
      );
      await queryClient.invalidateQueries({ queryKey: ["nest", nestId] });
      showToast("success", "둥지가 수정되었습니다.");
      setTimeout(() => router.push(`/nests/${result.id}`), 1000);
    } catch {
      showToast("error", "수정에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }, [isSubmitting, accessToken, nestId, uploadImages, setSubmitting, router]);

  const hasErrors = Object.keys(errors).length > 0;

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#FAF7E4] flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-[#5C5346] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7E4] flex flex-col">
      <BackHeader />
      {/* 토스트 */}
      {toast && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl shadow-lg text-sm font-medium whitespace-nowrap ${
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
          <PostcardSelector />
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

        <div className="px-5 pb-5">
          <button
            type="button"
            onClick={handleUpdate}
            disabled={isSubmitting}
            className="w-full h-12 rounded-2xl bg-[#5C5346] text-white text-sm font-semibold transition-all active:scale-95 hover:bg-[#4A4237] disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin mx-auto" />
            ) : (
              "수정하기"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
