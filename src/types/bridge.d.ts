import { NestSummary } from "@/app/(webview)/nests/page";

declare global {
  interface Window {
    AndroidBridge: {
      getNestIds: () => string;
      getAccessToken: () => string;
      sendNestIdSelected: (nestId: number) => void;
    };
  }
}

export const sendNestToNative = (nest: NestSummary) => {
  if (window.AndroidBridge && window.AndroidBridge.sendNestIdSelected) {
    window.AndroidBridge.sendNestIdSelected(nest.id);
  }
};
