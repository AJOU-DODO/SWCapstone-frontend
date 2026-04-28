import { NestSummary } from "@/app/(webview)/nests/page";

declare global {
  interface Window {
    AndroidBridge: {
      getNestIds: () => string;
      getAccessToken: () => string;
      getLocation: () => string;
      sendNestIdSelected: (nestId: number) => void;
      requestImageUpload: () => void;
      onCategorySelected?: (categoryIds: string) => void;
    };
    onInitialData?: (data: string) => void;
    onImageUploaded?: (imageUrl: string) => void;
  }
}

export const sendNestToNative = (nest: NestSummary) => {
  if (window.AndroidBridge && window.AndroidBridge.sendNestIdSelected) {
    window.AndroidBridge.sendNestIdSelected(nest.id);
  }
};
