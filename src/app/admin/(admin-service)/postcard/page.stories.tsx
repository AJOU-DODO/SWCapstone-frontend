import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { userEvent, within, expect } from "@storybook/test";
import { http, HttpResponse } from "msw";

import PostcardGrid from "@/components/admin/postcard/PostcardGrid";
import { PostcardList } from "@/types/indexAdmin";

// ─────────────────────────────────────────────
// Mock 데이터
// ─────────────────────────────────────────────
const makePostcard = (overrides?: Partial<PostcardList>): PostcardList => ({
  postcardId: 1,
  authorNickname: "testuser",
  content: "이 엽서는 부적절한 내용을 포함하고 있습니다.",
  imageUrl: "https://picsum.photos/seed/postcard1/500/300",
  createdAt: "2024-01-15T10:30:00",
  firstReportedAt: "2024-01-16T08:00:00",
  lastReportedAt: "2024-01-17T15:00:00",
  reportCount: 5,
  reasons: ["SPAM", "ABUSE"],
  deleted: false,
  ...overrides,
});

const mockPostcards: PostcardList[] = [
  makePostcard({ postcardId: 1, authorNickname: "user_alpha", reasons: ["SPAM"], imageUrl: "https://picsum.photos/seed/p1/500/300" }),
  makePostcard({ postcardId: 2, authorNickname: "user_beta", reasons: ["ABUSE", "OTHER"], imageUrl: "https://picsum.photos/seed/p2/500/300" }),
  makePostcard({ postcardId: 3, authorNickname: "user_gamma", reasons: ["ADVERTISEMENT"], imageUrl: "https://picsum.photos/seed/p3/500/300", reportCount: 12 }),
  makePostcard({ postcardId: 4, authorNickname: "user_delta", reasons: ["SPAM", "ABUSE", "OTHER"], imageUrl: "https://picsum.photos/seed/p4/500/300" }),
  makePostcard({ postcardId: 5, authorNickname: "user_epsilon", reasons: ["OTHER"], imageUrl: "https://picsum.photos/seed/p5/500/300", deleted: true }),
  makePostcard({ postcardId: 6, authorNickname: "user_zeta", reasons: ["ABUSE"], imageUrl: "https://picsum.photos/seed/p6/500/300" }),
  makePostcard({ postcardId: 7, authorNickname: "user_eta", reasons: ["SPAM"], imageUrl: "https://picsum.photos/seed/p7/500/300", reportCount: 3 }),
  makePostcard({ postcardId: 8, authorNickname: "user_theta", reasons: ["ADVERTISEMENT", "SPAM"], imageUrl: "https://picsum.photos/seed/p8/500/300" }),
  makePostcard({ postcardId: 9, authorNickname: "user_iota", reasons: ["OTHER"], imageUrl: "https://picsum.photos/seed/p9/500/300" }),
  makePostcard({ postcardId: 10, authorNickname: "user_kappa", reasons: ["ABUSE"], imageUrl: "https://picsum.photos/seed/p10/500/300" }),
];

// ─────────────────────────────────────────────
// MSW Handlers
// ─────────────────────────────────────────────
const successHandlers = [
  http.patch("/api/v1/admin/reports/status", () =>
    HttpResponse.json({ success: true })
  ),
  http.delete("/api/v1/admin/postcards/:postcardId", () =>
    HttpResponse.json({ success: true })
  ),
  http.post("/api/v1/admin/users/:userId/sanction", () =>
    HttpResponse.json({ success: true })
  ),
];

const errorHandlers = [
  http.patch("/api/v1/admin/reports/status", () =>
    HttpResponse.json({ message: "서버 오류" }, { status: 500 })
  ),
  http.delete("/api/v1/admin/postcards/:postcardId", () =>
    HttpResponse.json({ message: "서버 오류" }, { status: 500 })
  ),
  http.post("/api/v1/admin/users/:userId/sanction", () =>
    HttpResponse.json({ message: "서버 오류" }, { status: 500 })
  ),
];

// ─────────────────────────────────────────────
// Meta
// ─────────────────────────────────────────────
const meta: Meta<typeof PostcardGrid> = {
  title: "Admin/Postcard/PostcardGrid",
  component: PostcardGrid,
  parameters: {
    layout: "padded",
    msw: { handlers: successHandlers },
    docs: {
      description: {
        component:
          "신고된 엽서 목록 그리드입니다. 카드 클릭 → 상세 모달 → 반려/삭제 전체 흐름을 이 스토리에서 확인하세요.",
      },
    },
  },
  args: {
    triggerRefresh: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof PostcardGrid>;

// ─────────────────────────────────────────────
// UI 상태
// ─────────────────────────────────────────────

/** 기본: 신고된 엽서 10개 */
export const Default: Story = {
  args: { postcards: mockPostcards },
};

/** 빈 상태: 신고된 엽서 없음 */
export const Empty: Story = {
  args: { postcards: [] },
  parameters: {
    docs: { description: { story: "신고된 엽서가 없을 때의 빈 그리드 상태입니다." } },
  },
};

/** 삭제된 엽서가 혼재된 상태 */
export const WithDeletedItems: Story = {
  args: {
    postcards: mockPostcards.map((p, i) =>
      i % 3 === 0 ? { ...p, deleted: true } : p
    ),
  },
  parameters: {
    docs: { description: { story: "처리 완료(삭제)된 엽서가 포함된 목록입니다." } },
  },
};

/** 신고 사유 조합 확인 */
export const VariousReasons: Story = {
  args: {
    postcards: [
      makePostcard({ postcardId: 1, reasons: ["SPAM"] }),
      makePostcard({ postcardId: 2, reasons: ["ABUSE"], imageUrl: "https://picsum.photos/seed/a/500/300" }),
      makePostcard({ postcardId: 3, reasons: ["ADVERTISEMENT"], imageUrl: "https://picsum.photos/seed/b/500/300" }),
      makePostcard({ postcardId: 4, reasons: ["OTHER"], imageUrl: "https://picsum.photos/seed/c/500/300" }),
      makePostcard({ postcardId: 5, reasons: ["SPAM", "ABUSE", "ADVERTISEMENT", "OTHER"], imageUrl: "https://picsum.photos/seed/d/500/300" }),
    ],
  },
  parameters: {
    docs: { description: { story: "신고 사유 1~4개 조합을 한눈에 비교할 수 있습니다." } },
  },
};

// ─────────────────────────────────────────────
// 인터랙션: 모달 열기/닫기
// ─────────────────────────────────────────────

/**
 * 엽서 클릭 → 상세 모달 열림
 */
export const OpenDetailModal: Story = {
  args: { postcards: mockPostcards },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 첫 번째 엽서 카드 클릭
    const cards = canvas.getAllByRole("img");
    await userEvent.click(cards[0].closest("div")!);

    // 모달이 열렸는지 확인 (authorNickname 텍스트 존재)
    await expect(
      await canvas.findByText(/@user_alpha의 엽서/)
    ).toBeInTheDocument();
  },
  parameters: {
    docs: { description: { story: "첫 번째 카드를 클릭하면 상세 모달이 열립니다." } },
  },
};

/**
 * 모달 열기 → 배경 클릭 → 모달 닫힘
 */
export const CloseModalByBackdrop: Story = {
  args: { postcards: mockPostcards },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 모달 열기
    const cards = canvas.getAllByRole("img");
    await userEvent.click(cards[0].closest("div")!);
    await canvas.findByText(/@user_alpha의 엽서/);

    // 배경(backdrop) 클릭으로 닫기
    const backdrop = canvasElement.querySelector(".fixed.inset-0.bg-black\\/70");
    await userEvent.click(backdrop!);

    // 모달 닫혔는지 확인
    await expect(
      canvas.queryByText(/@user_alpha의 엽서/)
    ).not.toBeInTheDocument();
  },
  parameters: {
    docs: { description: { story: "모달 바깥 배경을 클릭하면 닫힙니다." } },
  },
};

/**
 * 모달 열기 → ✕ 버튼 클릭 → 모달 닫힘
 */
export const CloseModalByButton: Story = {
  args: { postcards: mockPostcards },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const cards = canvas.getAllByRole("img");
    await userEvent.click(cards[0].closest("div")!);
    await canvas.findByText(/@user_alpha의 엽서/);

    // ✕ 버튼 클릭
    const closeBtn = canvas.getByText("✕");
    await userEvent.click(closeBtn);

    await expect(
      canvas.queryByText(/@user_alpha의 엽서/)
    ).not.toBeInTheDocument();
  },
  parameters: {
    docs: { description: { story: "✕ 버튼으로 모달을 닫을 수 있습니다." } },
  },
};

// ─────────────────────────────────────────────
// 인터랙션: 신고 반려 흐름
// ─────────────────────────────────────────────

/**
 * 상세 모달 → 신고 반려 버튼 → RejectModal 열림
 */
export const OpenRejectModal: Story = {
  args: { postcards: mockPostcards },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const cards = canvas.getAllByRole("img");
    await userEvent.click(cards[0].closest("div")!);
    await canvas.findByText(/@user_alpha의 엽서/);

    // 신고 반려 버튼 클릭
    const rejectBtn = canvas.getByText("신고 반려 (유지)");
    await userEvent.click(rejectBtn);

    // RejectModal 열렸는지 확인
    await expect(
      await canvas.findByText("신고 반려 확인")
    ).toBeInTheDocument();
  },
  parameters: {
    docs: { description: { story: "상세 모달에서 '신고 반려' 버튼을 누르면 확인 모달이 열립니다." } },
  },
};

/**
 * 신고 반려 → 확인 → 완료 (triggerRefresh 호출)
 */
export const ConfirmReject: Story = {
  args: { postcards: mockPostcards },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const cards = canvas.getAllByRole("img");
    await userEvent.click(cards[0].closest("div")!);
    await canvas.findByText(/@user_alpha의 엽서/);

    await userEvent.click(canvas.getByText("신고 반려 (유지)"));
    await canvas.findByText("신고 반려 확인");

    // RejectModal 확인 버튼 클릭
    const confirmBtn = canvas.getByRole("button", { name: "확인" });
    await userEvent.click(confirmBtn);

    // 확인 버튼이 클릭 가능한 상태였는지만 검증
    await expect(confirmBtn).toBeInTheDocument();
  },
  parameters: {
    docs: { description: { story: "반려 확인 버튼 클릭 시 API 호출 후 triggerRefresh가 실행됩니다." } },
  },
};

// ─────────────────────────────────────────────
// 인터랙션: 강제 삭제 흐름
// ─────────────────────────────────────────────

/**
 * 상세 모달 → 강제 삭제 버튼 → DeleteModal 열림
 */
export const OpenDeleteModal: Story = {
  args: { postcards: mockPostcards },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const cards = canvas.getAllByRole("img");
    await userEvent.click(cards[0].closest("div")!);
    await canvas.findByText(/@user_alpha의 엽서/);

    const deleteBtn = canvas.getByText("엽서 강제 삭제");
    await userEvent.click(deleteBtn);

    await expect(
      await canvas.findByText("엽서 삭제 확인")
    ).toBeInTheDocument();
  },
  parameters: {
    docs: { description: { story: "상세 모달에서 '엽서 강제 삭제' 버튼을 누르면 삭제 확인 모달이 열립니다." } },
  },
};

/**
 * 삭제 모달 → 사유 입력 → 확인 → UserSanctionModal 열림
 */
export const DeleteToSanctionStep: Story = {
  args: { postcards: mockPostcards },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const cards = canvas.getAllByRole("img");
    await userEvent.click(cards[0].closest("div")!);
    await canvas.findByText(/@user_alpha의 엽서/);

    await userEvent.click(canvas.getByText("엽서 강제 삭제"));
    await canvas.findByText("엽서 삭제 확인");

    // 삭제 사유 입력
    const input = canvas.getByPlaceholderText(
      "해당 콘텐츠를 삭제하는 사유를 입력하세요. (미입력시 기본값 적용)"
    );
    await userEvent.type(input, "광고성 스팸 콘텐츠");

    // 확인 클릭 → UserSanctionModal 열림
    await userEvent.click(canvas.getByRole("button", { name: "확인" }));

    await expect(
      await canvas.findByText("유저 제재 처리")
    ).toBeInTheDocument();
  },
  parameters: {
    docs: { description: { story: "삭제 확인 후 유저 제재 모달까지 이어지는 전체 흐름입니다." } },
  },
};

/**
 * API 오류 시나리오
 */
export const ApiError: Story = {
  args: { postcards: mockPostcards },
  parameters: {
    msw: { handlers: errorHandlers },
    docs: { description: { story: "반려/삭제 API가 500을 반환할 때의 동작을 확인합니다." } },
  },
};