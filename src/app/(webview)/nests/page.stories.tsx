import type { Meta, StoryObj } from "@storybook/react-vite";
import { http, HttpResponse } from "msw";
import { within, waitFor, expect } from "@storybook/test";
import Page from "./page";
import type { NestSummary } from "./page";

// ────────────────────────────────────────────────
// Mock AndroidBridge
// ────────────────────────────────────────────────
const mockAndroidBridge = {
  getAccessToken: () => "mock-access-token",
  getNestIds: () => JSON.stringify([1, 2, 3]),
  sendNestIdSelected: (_nestId: number) => {},
  getLocation: () => JSON.stringify({ latitude: 37.4979, longitude: 127.0276 }),
  requestImageUpload: () => "",
  getNestDetailId: () => "1",
  requestPostcardMake: () => {},
};

// ────────────────────────────────────────────────
// Mock 데이터
// ────────────────────────────────────────────────
const makeSummary = (overrides?: Partial<NestSummary>): NestSummary => ({
  id: 1,
  content:
    "이곳은 정말 아름다운 산책로입니다. 봄에 오면 벚꽃이 만개해서 정말 멋있어요!",
  thumbnailUrl: "https://loremflickr.com/400/300?lock=1",
  likeCount: 42,
  distance: 150,
  categoryNames: ["산책", "자연"],
  hasPostcard: false,
  postcardId: 0,
  ad: false,
  unlocked: true,
  ...overrides,
});

const mockSummaries: NestSummary[] = [
  makeSummary({
    id: 1,
    unlocked: true,
    thumbnailUrl: "https://loremflickr.com/400/300?lock=1",
  }),
  makeSummary({
    id: 2,
    unlocked: false,
    thumbnailUrl: "https://loremflickr.com/400/300?lock=2",
    content: "미해금 둥지입니다.",
  }),
  makeSummary({
    id: 3,
    unlocked: true,
    hasPostcard: true,
    postcardId: 1,
    thumbnailUrl: "https://loremflickr.com/400/300?lock=3",
  }),
];

// ────────────────────────────────────────────────
// MSW 핸들러
// ────────────────────────────────────────────────
const successHandlers = [
  http.get("*/api/v1/nests/summaries", () =>
    HttpResponse.json({
      status: "SUCCESS",
      code: "200",
      message: null,
      data: mockSummaries,
    }),
  ),
];

const emptyHandlers = [
  http.get("*/api/v1/nests/summaries", () =>
    HttpResponse.json({
      status: "SUCCESS",
      code: "200",
      message: null,
      data: [],
    }),
  ),
];

// ────────────────────────────────────────────────
// Meta
// ────────────────────────────────────────────────
const meta: Meta<typeof Page> = {
  title: "Webview/NestsPage",
  component: Page,
  parameters: {
    layout: "fullscreen",
    msw: { handlers: successHandlers },
    nextjs: { appDirectory: true },
  },
  decorators: [
    (Story) => {
      // AndroidBridge Mock 주입
      if (typeof window !== "undefined") {
        window.AndroidBridge = mockAndroidBridge;
      }
      return <Story />;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof Page>;

// ────────────────────────────────────────────────
// 스토리
// ────────────────────────────────────────────────
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      expect(canvas.getAllByRole("img").length).toBeGreaterThan(0);
    });
  },
};

export const Empty: Story = {
  parameters: {
    msw: { handlers: emptyHandlers },
  },
};

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("*/api/v1/nests/summaries", async () => {
          await new Promise((r) => setTimeout(r, 5000));
          return HttpResponse.json({ data: mockSummaries });
        }),
      ],
    },
  },
};

export const WithUnlockModal: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 미해금 둥지 카드 클릭
    await waitFor(() => {
      expect(canvas.getByText("미해금 둥지입니다.")).toBeInTheDocument();
    });

    const lockedCard = canvas.getByText("미해금 둥지입니다.").closest("div");
    lockedCard?.click();

    // UnlockModal 열렸는지 확인
    const body = within(document.body);
    await waitFor(() => {
      expect(
        body.getByText("해당 둥지를 찾으러 가시겠습니까?"),
      ).toBeInTheDocument();
    });
  },
};
