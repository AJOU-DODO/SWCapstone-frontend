import { create } from "zustand";
import { BridgeInitialData, NestPayload } from "@/types";

interface NestEditorState {
  latitude: number | null;
  longitude: number | null;
  accessToken: string | null;
  isBridgeReady: boolean;
  imageUrls: string[];
  categoryIds: number[];
  unlockRadius: 150 | 10;
  content: string;
  isSubmitting: boolean;
  errors: Partial<Record<keyof NestPayload, string>>;

  setBridgeData: (data: BridgeInitialData) => void;
  addImage: (url: string) => void;
  removeImage: (url: string) => void;
  setCategoryIds: (ids: number[]) => void;
  setUnlockRadius: (radius: 150 | 10) => void;
  setContent: (content: string) => void;
  setSubmitting: (value: boolean) => void;
  setErrors: (errors: Partial<Record<keyof NestPayload, string>>) => void;
  clearErrors: () => void;
  getDraftPayload: () => NestPayload;
  getPublishPayload: () => NestPayload | null;
}

export const useNestEditorStore = create<NestEditorState>((set, get) => ({
  latitude: null,
  longitude: null,
  accessToken: null,
  isBridgeReady: false,
  imageUrls: [],
  categoryIds: [],
  unlockRadius: 10,
  content: "",
  isSubmitting: false,
  errors: {},

  setBridgeData: (data) =>
    set({
      accessToken: data.accessToken,
      isBridgeReady: true,
    }),

  addImage: (url) => set((state) => ({ imageUrls: [...state.imageUrls, url] })),

  removeImage: (url) =>
    set((state) => ({ imageUrls: state.imageUrls.filter((u) => u !== url) })),

  setCategoryIds: (ids) => set({ categoryIds: ids }),
  setUnlockRadius: (radius) => set({ unlockRadius: radius }),
  setContent: (content) => set({ content }),
  setSubmitting: (value) => set({ isSubmitting: value }),
  setErrors: (errors) => set({ errors }),
  clearErrors: () => set({ errors: {} }),

  getDraftPayload: () => {
    const state = get();
    return {
      latitude: state.latitude,
      longitude: state.longitude,
      content: state.content || null,
      unlockRadius: state.unlockRadius,
      categoryIds: state.categoryIds.length > 0 ? state.categoryIds : null,
      imageUrls: state.imageUrls.length > 0 ? state.imageUrls : null,
    };
  },

  getPublishPayload: () => {
    const state = get();
    const errors: Partial<Record<keyof NestPayload, string>> = {};

    if (!state.latitude || !state.longitude) {
      errors.latitude = "위치 정보를 불러오는 중입니다.";
    }
    if (state.imageUrls.length === 0) {
      errors.imageUrls = "이미지를 1개 이상 업로드해주세요.";
    }
    if (state.categoryIds.length === 0) {
      errors.categoryIds = "카테고리를 1개 이상 선택해주세요.";
    }
    if (!state.content.trim()) {
      errors.content = "본문을 작성해주세요.";
    }

    if (Object.keys(errors).length > 0) {
      set({ errors });
      return null;
    }

    return {
      latitude: state.latitude,
      longitude: state.longitude,
      content: state.content,
      unlockRadius: state.unlockRadius,
      categoryIds: state.categoryIds,
      imageUrls: state.imageUrls,
    };
  },
}));
