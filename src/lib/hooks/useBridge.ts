"use client";

import { useEffect } from "react";
import { useNestEditorStore } from "../store/nestEditorStore";
import type { BridgeInitialData } from "@/types";

export function useBridge() {
  const { setBridgeData, addImage } = useNestEditorStore();

  useEffect(() => {
    console.log("Bridge Hook Mounted");
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
      console.log("브릿지 실행 시작");
      const token = window.AndroidBridge.getAccessToken();
      const location = JSON.parse(window.AndroidBridge.getLocation());

      if (token && location) {
        try {
          const parsed: BridgeInitialData = {
            latitude: Number(location.latitude),
            longitude: Number(location.longitude),
            accessToken: token,
          };
          console.log(
            `token:${parsed.accessToken}, latitude:${parsed.latitude}, longitue:${parsed.longitude}`,
          );
          setBridgeData(parsed);
        } catch (e) {
          console.error("Bridge initial data parse error:", e);
        }
      } else {
        console.log("token, location 수신 실패");
      }
    }
    return () => {
      window.onInitialData = undefined;
      window.onImageUploaded = undefined;
    };
  }, []);

  const requestImageUpload = () => {
    window.AndroidBridge.requestImageUpload();
    const imageBase64 = window.onImageReceived();
    addImage(imageBase64);
  };

  const sendCategorySelection = (categoryIds: number[]) => {
    window.AndroidBridge.onCategorySelected?.(JSON.stringify(categoryIds));
  };

  return { requestImageUpload, sendCategorySelection };
}
