import { NestSummary } from "@/app/(webview)/nests/page";

declare global {
  interface Window {
    AndroidBridge: {
      //common
      getNestIds: () => string;
      getAccessToken: () => string;
      getLocation: () => string;
      onCategorySelected?: (categoryIds: string) => void;
      //nest-editor
      sendNestIdSelected: (nestId: number) => void;
      requestImageUpload: () => string;
      // nest-detail
      getNestDetailId: () => string;

      requestPostcardMake: () => void;
    };
    onInitialData?: (data: string) => void;
    onImageUploaded?: (imageUrl: string) => void;
    onImageReceived?: (base64Data: string) => void;
    
    requestReload: () => void;
  }
}

export const sendNestToNative = (nest: NestSummary) => {
  if (window.AndroidBridge && window.AndroidBridge.sendNestIdSelected) {
    window.AndroidBridge.sendNestIdSelected(nest.id);
  }
};
