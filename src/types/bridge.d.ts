import { NestSummary } from "@/app/(webview)/nests/page";

declare global {
  interface Window {
    AndroidBridge: {
      getNestIds: () => string;
      getAccessToken: () => string;
      getLocation: () => string;
      sendNestIdSelected: (nestId: number) => void;
      requestImageUpload: () => string;
      onCategorySelected?: (categoryIds: string) => void;
    };
    onInitialData?: (data: string) => void;
    onImageUploaded?: (imageUrl: string) => void;
    onImageReceived: () => string;
  }
}

export const sendNestToNative = (nest: NestSummary) => {
  if (window.AndroidBridge && window.AndroidBridge.sendNestIdSelected) {
    window.AndroidBridge.sendNestIdSelected(nest.id);
  }
};
