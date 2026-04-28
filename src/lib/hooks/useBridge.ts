"use client";

import { useEffect } from "react";
import { useNestEditorStore } from "../store/nestEditorStore";
import type { BridgeInitialData } from "@/types";

export function useBridge() {
  const { setBridgeData, addImage } = useNestEditorStore();

  useEffect(() => {
    window.onInitialData = (dataStr: string) => {
      try {
        const parsed: BridgeInitialData = JSON.parse(dataStr);
        setBridgeData(parsed);
      } catch (e) {
        console.error("Brdige initial data parse error:", e);
      }
    };

    window.onImageUploaded = (imageUrl: string) => {
      addImage(imageUrl);
    };

    if (typeof window !== "undefined" && window.AndroidBridge) {
      const token = window.AndroidBridge.getAccessToken();
      const location = JSON.parse(window.AndroidBridge.getLocation());

      if (token && location) {
        try {
          const parsed: BridgeInitialData = {
            latitude: Number(location.latitude),
            longitude: Number(location.longitude),
            accessToken: token,
          };
          setBridgeData(parsed);
        } catch (e) {
          console.error("Bridge initial data parse error:", e);
        }
      }
    }
    return () => {
      window.onInitialData = undefined;
      window.onImageUploaded = undefined;
    };
  }, [setBridgeData, addImage]);

  const requestImageUpload = () => {
    window.AndroidBridge.requestImageUpload?.();
  };

  const sendCategorySelection = (categoryIds: number[]) => {
    window.AndroidBridge.onCategorySelected?.(JSON.stringify(categoryIds));
  };

  return { requestImageUpload, sendCategorySelection };
}
