import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { within, userEvent, waitFor, expect, screen } from "@storybook/test";
import { http, HttpResponse } from "msw";
import { NestEditorClient } from "./NestEditorClient";
import { useNestEditorStore } from "@/lib/store/nestEditorStore";

// ────────────────────────────────────────────────
// Mock 데이터
// ────────────────────────────────────────────────
const mockCategories = [
  { id: 1, name: "산책", nestCount: 12 },
  { id: 2, name: "언덕", nestCount: 45 },
  { id: 3, name: "식당", nestCount: 8 },
];

const mockDrafts = [
  {
    id: 1,
    title: "임시저장 제목 1",
    content: "임시저장 본문 1",
    latitude: 37.2844251,
    longitude: 127.0442344,
    unlockRadius: 10,
    categoryIds: [1],
    imageUrls: [],
    createdAt: "2026-04-24T16:36:50.906456",
  },
  {
    id: 2,
    title: "임시저장 제목 2",
    content: "임시저장 본문 2",
    latitude: 37.2844251,
    longitude: 127.0442344,
    unlockRadius: 150,
    categoryIds: [1, 2],
    imageUrls: [],
    createdAt: "2026-04-23T10:00:00.000000",
  },
];

// ────────────────────────────────────────────────
// MSW 핸들러
// ────────────────────────────────────────────────
const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "";

const handlers = {
  getCategories: () =>
    http.get(`${BASE_URL}/api/v1/categories`, () =>
      HttpResponse.json({ data: mockCategories }),
    ),
  getDrafts: (drafts = mockDrafts) =>
    http.get(`${BASE_URL}/api/v1/nests/drafts`, () =>
      HttpResponse.json({ data: drafts }),
    ),
  saveDraft: (status = 200) =>
    http.post(`${BASE_URL}/api/v1/nests/drafts`, async () =>
      status === 200
        ? HttpResponse.json({ data: { id: 1 } })
        : new HttpResponse(null, { status: 500 }),
    ),
  updateDraft: (status = 200) =>
    http.patch(`${BASE_URL}/api/v1/nests/drafts/:id`, async () =>
      status === 200
        ? HttpResponse.json({ data: { id: 1 } })
        : new HttpResponse(null, { status: 500 }),
    ),
  publishNest: (status = 200) =>
    http.post(`${BASE_URL}/api/v1/nests`, async () =>
      status === 200
        ? HttpResponse.json({ data: { id: 1 } })
        : new HttpResponse(null, { status: 500 }),
    ),
  publishDraft: (status = 200) =>
    http.post(`${BASE_URL}/api/v1/nests/drafts/:id/publish`, async () =>
      status === 200
        ? HttpResponse.json({ data: { id: 1 } })
        : new HttpResponse(null, { status: 500 }),
    ),
};

// ────────────────────────────────────────────────
// 공통 Decorator
// ────────────────────────────────────────────────
const withDefaultStore = (Story: React.ComponentType) => {
  useNestEditorStore.setState({
    accessToken: "mock-token",
    latitude: 37.2844251,
    longitude: 127.0442344,
    isBridgeReady: true,
    imageUrls: [],
    categoryIds: [],
    content: "",
    title: "",
    postcardId: null,
    errors: {},
    loadedDraftId: null,
    loadedNestId: null,
    isSubmitting: false,
  });
  return <Story />;
};

// ────────────────────────────────────────────────
// Meta
// ────────────────────────────────────────────────
const meta: Meta<typeof NestEditorClient> = {
  title: "Webview/NestEditor/NestEditorClient",
  component: NestEditorClient,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    msw: {
      handlers: [handlers.getCategories(), handlers.getDrafts()],
    },
  },
  decorators: [withDefaultStore],
};

export default meta;
type Story = StoryObj<typeof NestEditorClient>;

// ────────────────────────────────────────────────
// 1. 기본 렌더링
// ────────────────────────────────────────────────
export const Default: Story = {
  name: "기본 - 초기 상태",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      await canvas.findByPlaceholderText(/제목을 입력하세요/i),
    ).toBeInTheDocument();
    expect(
      await canvas.findByPlaceholderText(/여기에 본문을 작성하세요/i),
    ).toBeInTheDocument();

    // ⚠️ 중복 방지: 정확히 "임시저장" 네 글자만 가진 하단 버튼 매칭
    expect(await canvas.findByText(/^임시저장$/)).toBeInTheDocument();
    expect(await canvas.findByText(/^발행하기$/)).toBeInTheDocument();
  },
};

// ────────────────────────────────────────────────
// 2. 임시저장 글 불러온 상태
// ────────────────────────────────────────────────
export const WithDraftLoaded: Story = {
  name: "임시저장 글 불러온 상태",
  decorators: [
    (Story) => {
      useNestEditorStore.setState({
        accessToken: "mock-token",
        latitude: 37.2844251,
        longitude: 127.0442344,
        isBridgeReady: true,
        title: "임시저장 제목 1",
        content: "임시저장 본문 1",
        categoryIds: [1],
        imageUrls: [],
        loadedDraftId: 1,
        postcardId: null,
        errors: {},
        isSubmitting: false,
      });
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(await canvas.findByText(/수정하기/)).toBeInTheDocument();
    expect(await canvas.findByText(/발행하기/)).toBeInTheDocument();
  },
};

// ────────────────────────────────────────────────
// 3. 임시저장 목록 모달 열기
// ────────────────────────────────────────────────
export const DraftModalOpen: Story = {
  name: "임시저장 목록 모달 열기",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByText("임시저장 목록"));

    await waitFor(() => {
      expect(screen.getByText(/임시저장 본문 1/)).toBeInTheDocument();
      expect(screen.getByText(/임시저장 본문 2/)).toBeInTheDocument();
    });
  },
};

// ────────────────────────────────────────────────
// 4. 임시저장 목록이 비어있는 상태
// ────────────────────────────────────────────────
export const DraftModalEmpty: Story = {
  name: "임시저장 목록 비어있는 상태",
  parameters: {
    msw: {
      handlers: [handlers.getCategories(), handlers.getDrafts([])],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText("임시저장 목록"));

    expect(
      await screen.findByText(/임시저장된 게시물이 없습니다/),
    ).toBeInTheDocument();
  },
};

// ────────────────────────────────────────────────
// 5. 유효성 검사 에러 상태
// ────────────────────────────────────────────────
export const ValidationError: Story = {
  name: "유효성 검사 에러 상태",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByText("발행하기"));

    await waitFor(() => {
      expect(
        canvas.getAllByText(/카테고리를 1개 이상 선택해주세요/)[0],
      ).toBeInTheDocument();
      expect(canvas.getAllByText(/본문을 작성해주세요/)[0]).toBeInTheDocument();
      expect(canvas.getAllByText(/제목을 작성해주세요/)[0]).toBeInTheDocument();
    });
  },
};

// ────────────────────────────────────────────────
// 6. 임시저장 성공
// ────────────────────────────────────────────────
export const SaveDraftSuccess: Story = {
  name: "임시저장 성공",
  parameters: {
    msw: {
      handlers: [handlers.getCategories(), handlers.saveDraft(200)],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByText(/^임시저장$/));

    expect(await canvas.findByText(/임시 저장되었습니다/)).toBeInTheDocument();
  },
};

// ────────────────────────────────────────────────
// 7. 임시저장 실패
// ────────────────────────────────────────────────
export const SaveDraftFail: Story = {
  name: "임시저장 실패",
  parameters: {
    msw: {
      handlers: [handlers.getCategories(), handlers.saveDraft(500)],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByText(/^임시저장$/));

    expect(
      await canvas.findByText(/임시 저장에 실패했습니다/),
    ).toBeInTheDocument();
  },
};

// ────────────────────────────────────────────────
// 8. 발행 성공
// ────────────────────────────────────────────────
export const PublishSuccess: Story = {
  name: "발행 성공",
  decorators: [
    (Story) => {
      useNestEditorStore.setState({
        accessToken: "mock-token",
        latitude: 37.2844251,
        longitude: 127.0442344,
        isBridgeReady: true,
        title: "테스트 제목",
        content: "테스트 본문",
        categoryIds: [1],
        imageUrls: [],
        loadedDraftId: null,
        postcardId: null,
        errors: {},
        isSubmitting: false,
      });
      return <Story />;
    },
  ],
  parameters: {
    msw: {
      handlers: [handlers.getCategories(), handlers.publishNest(200)],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText("발행하기"));

    expect(
      await canvas.findByText(/게시물이 발행되었습니다/),
    ).toBeInTheDocument();
  },
};

// ────────────────────────────────────────────────
// 9. 발행 실패
// ────────────────────────────────────────────────
export const PublishFail: Story = {
  name: "발행 실패",
  decorators: [
    (Story) => {
      useNestEditorStore.setState({
        accessToken: "mock-token",
        latitude: 37.2844251,
        longitude: 127.0442344,
        isBridgeReady: true,
        title: "테스트 제목",
        content: "테스트 본문",
        categoryIds: [1],
        imageUrls: [],
        loadedDraftId: null,
        postcardId: null,
        errors: {},
        isSubmitting: false,
      });
      return <Story />;
    },
  ],
  parameters: {
    msw: {
      handlers: [handlers.getCategories(), handlers.publishNest(500)],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText("발행하기"));

    expect(await canvas.findByText(/발행에 실패했습니다/)).toBeInTheDocument();
  },
};

// ────────────────────────────────────────────────
// 10. 제출 중 상태
// ────────────────────────────────────────────────
export const Submitting: Story = {
  name: "제출 중 상태",
  decorators: [
    (Story) => {
      useNestEditorStore.setState({
        accessToken: "mock-token",
        latitude: 37.2844251,
        longitude: 127.0442344,
        isBridgeReady: true,
        title: "테스트 제목",
        content: "테스트 본문",
        categoryIds: [1],
        imageUrls: [],
        loadedDraftId: null,
        postcardId: null,
        errors: {},
        isSubmitting: false,
      });
      return <Story />;
    },
  ],
  parameters: {
    msw: {
      handlers: [
        handlers.getCategories(),
        http.post(`${BASE_URL}/api/v1/nests`, async () => {
          await new Promise((r) => setTimeout(r, 3000));
          return HttpResponse.json({ data: { id: 1 } });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText("발행하기"));
  },
};
