import { create } from "zustand";
import { BridgeInitialData, NestPayload } from "@/types";

interface NestEditorState {
  title: string;
  latitude: number | null;
  longitude: number | null;
  accessToken: string | null;
  isBridgeReady: boolean;
  imageUrls: string[];
  categoryIds: number[];
  unlockRadius: 150 | 10;
  content: string;
  postcardId: number | null;
  postcardTitle: string | null;
  isSubmitting: boolean;
  errors: Partial<Record<keyof NestPayload, string>>;
  loadedDraftId: number | null;

  setBridgeData: (data: BridgeInitialData) => void;
  addImage: (url: string) => void;
  removeImage: (index: number) => void;
  setCategoryIds: (ids: number[]) => void;
  setUnlockRadius: (radius: 150 | 10) => void;
  setContent: (content: string) => void;
  setSubmitting: (value: boolean) => void;
  setTitle: (title: string) => void;
  setImageUrls: (urls: string[]) => void;
  setPostcard: (id: number, title: string) => void;
  clearPostcard: () => void;
  setErrors: (errors: Partial<Record<keyof NestPayload, string>>) => void;
  clearErrors: () => void;
  setLoadedDraftId: (id: number | null) => void;
  getDraftPayload: () => NestPayload;
  getPublishPayload: () => NestPayload | null;
}

export const useNestEditorStore = create<NestEditorState>((set, get) => ({
  title: "",
  latitude: null,
  longitude: null,
  accessToken: null,
  isBridgeReady: false,
  imageUrls: [],
  categoryIds: [],
  unlockRadius: 10,
  content: "",
  postcardId: null,
  postcardTitle: null,
  isSubmitting: false,
  errors: {},
  loadedDraftId: null,

  setBridgeData: (data) =>
    set({
      accessToken: data.accessToken,
      latitude: data.latitude,
      longitude: data.longitude,
      isBridgeReady: true,
    }),

  addImage: (url) => set((state) => ({ imageUrls: [...state.imageUrls, url] })),

  removeImage: (index) =>
    set((state) => ({
      imageUrls: state.imageUrls.filter((_, i) => i !== index),
    })),

  setCategoryIds: (ids) => set({ categoryIds: ids }),
  setUnlockRadius: (radius) => set({ unlockRadius: radius }),
  setContent: (content) => set({ content }),
  setSubmitting: (value) => set({ isSubmitting: value }),
  setTitle: (title) => set({ title }),
  setImageUrls: (urls) => set({ imageUrls: urls }),
  setPostcard: (id, title) => set({ postcardId: id, postcardTitle: title }),
  clearPostcard: () => set({ postcardId: null, postcardTitle: null }),
  setErrors: (errors) => set({ errors }),
  clearErrors: () => set({ errors: {} }),
  setLoadedDraftId: (id) => set({ loadedDraftId: id }),

  getDraftPayload: () => {
    const state = get();
    return {
      title: state.title,
      latitude: state.latitude,
      longitude: state.longitude,
      content: state.content || null,
      unlockRadius: state.unlockRadius,
      categoryIds: state.categoryIds.length > 0 ? state.categoryIds : null,
      imageUrls: state.imageUrls.length > 0 ? state.imageUrls : null,
      postcardId: state.postcardId,
    };
  },

  getPublishPayload: () => {
    const state = get();
    const errors: Partial<Record<keyof NestPayload, string>> = {};

    if (!state.latitude || !state.longitude) {
      errors.latitude = "위치 정보를 불러오는 중입니다.";
    }
    /*if (state.imageUrls.length === 0) {
      errors.imageUrls = "이미지를 1개 이상 업로드해주세요.";
    }*/
    if (state.categoryIds.length === 0) {
      errors.categoryIds = "카테고리를 1개 이상 선택해주세요.";
    }
    if (!state.content.trim()) {
      errors.content = "본문을 작성해주세요.";
    }
    if (!state.title.trim()) {
      errors.title = "제목을 작성해주세요.";
    }

    if (Object.keys(errors).length > 0) {
      set({ errors });
      return null;
    }

    return {
      title: state.title,
      latitude: state.latitude,
      longitude: state.longitude,
      content: state.content,
      unlockRadius: state.unlockRadius,
      categoryIds: state.categoryIds,
      imageUrls: state.imageUrls,
      postcardId: state.postcardId,
    };
  },
}));
