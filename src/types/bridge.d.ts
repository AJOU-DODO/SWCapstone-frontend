import { NestSummary } from "@/app/(webview)/nests/page";

declare global {
  interface Window {
    AndroidBridge: {
      getNestIds: () => string;
      getAccessToken: () => string;
      getLocation: () => string;
      //nest-editor
      sendNestIdSelected: (nestId: number) => void;
      requestImageUpload: () => string;
      onCategorySelected?: (categoryIds: string) => void;
      // nest-detail
      getNestDetailId: () => string;

      requestPostcardMake: () => void;
      requestReload: () => void;
    };
    onInitialData?: (data: string) => void;
    onImageUploaded?: (imageUrl: string) => void;
    onImageReceived?: (base64Data: string) => void;
  }
}

export const sendNestToNative = (nest: NestSummary) => {
  if (window.AndroidBridge && window.AndroidBridge.sendNestIdSelected) {
    window.AndroidBridge.sendNestIdSelected(nest.id);
  }
};
