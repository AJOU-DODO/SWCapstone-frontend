import type { Preview } from "@storybook/nextjs-vite";
import { initialize, mswLoader } from "msw-storybook-addon";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type {} from "../src/types/bridge";
import api from "../src/lib/axios";

// @ts-expect-error 라이브러리 타입 미지원
import "@/app/globals.css";

initialize();
api.defaults.baseURL = "";
api.defaults.adapter = "fetch";

// AndroidBridge Mock 전역 설정
if (typeof window !== "undefined") {
  window.AndroidBridge = {
    getAccessToken: () => "mock-token",
    getLocation: () =>
      JSON.stringify({ latitude: 37.2844251, longitude: 127.0442344 }),
    getNestIds: () => JSON.stringify([1, 2, 3]),
    requestImageUpload: () => "",
    sendNestIdSelected: (nestId: number) =>
      console.log("[MockBridge] sendNestIdSelected:", nestId),
    requestPostcardMake: () => console.log("[MockBridge] requestPostcardMake"),
    getNestDetailId: () => "1",
    onCategorySelected: (categoryIds: string) =>
      console.log("[MockBridge] onCategorySelected:", categoryIds),
  };
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const preview: Preview = {
  loaders: [mswLoader],
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
  },
};

export default preview;
