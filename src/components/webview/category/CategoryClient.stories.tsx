import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, waitFor, expect } from "@storybook/test";
import { http, HttpResponse } from "msw";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CategoryClient from "./CategoryClient";

// ────────────────────────────────────────────────
// Mock 데이터
// ────────────────────────────────────────────────
const mockCategories = [
  { id: 1, name: "카페" },
  { id: 2, name: "산책" },
  { id: 3, name: "맛집" },
  { id: 4, name: "운동" },
  { id: 5, name: "독서" },
  { id: 6, name: "음악" },
  { id: 7, name: "여행" },
  { id: 8, name: "자연" },
];

const mockInterests = [
  { id: 1, name: "카페" },
  { id: 2, name: "산책" },
];

// ────────────────────────────────────────────────
// MSW 핸들러
// ────────────────────────────────────────────────
const successHandlers = [
  http.get("*/api/v1/categories", () =>
    HttpResponse.json({
      status: "SUCCESS",
      code: "200",
      message: null,
      data: mockCategories,
    }),
  ),
  http.get("*/api/v1/users/interests", () =>
    HttpResponse.json({
      status: "SUCCESS",
      code: "200",
      message: null,
      data: mockInterests,
    }),
  ),
  http.put("*/api/v1/users/interests", () =>
    HttpResponse.json({
      status: "SUCCESS",
      code: "200",
      message: null,
      data: null,
    }),
  ),
];

// ────────────────────────────────────────────────
// Meta
// ────────────────────────────────────────────────
const meta: Meta<typeof CategoryClient> = {
  title: "Webview/Category/CategoryClient",
  component: CategoryClient,
  parameters: {
    layout: "fullscreen",
    msw: { handlers: successHandlers },
  },
};

export default meta;
type Story = StoryObj<typeof CategoryClient>;

// ────────────────────────────────────────────────
// 스토리
// ────────────────────────────────────────────────
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      expect(canvas.getAllByText("카페")[0]).toBeInTheDocument();
    });
  },
};

export const NoInterests: Story = {
  decorators: [
    (Story) => (
      <QueryClientProvider
        client={
          new QueryClient({ defaultOptions: { queries: { retry: false } } })
        }
      >
        <Story />
      </QueryClientProvider>
    ),
  ],
  parameters: {
    msw: {
      handlers: [
        http.get("*/api/v1/categories", () =>
          HttpResponse.json({
            status: "SUCCESS",
            code: "200",
            message: null,
            data: mockCategories,
          }),
        ),
        http.get("*/api/v1/users/interests", () =>
          HttpResponse.json({
            status: "SUCCESS",
            code: "200",
            message: null,
            data: [],
          }),
        ),
        ...successHandlers.slice(2),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      expect(
        canvas.getByText("선택된 카테고리가 없습니다."),
      ).toBeInTheDocument();
    });
  },
};

export const ApiError: Story = {
  decorators: [
    (Story) => (
      <QueryClientProvider
        client={
          new QueryClient({ defaultOptions: { queries: { retry: false } } })
        }
      >
        <Story />
      </QueryClientProvider>
    ),
  ],
  parameters: {
    msw: {
      handlers: [
        http.get("*/api/v1/categories", () =>
          HttpResponse.json({ message: "서버 오류" }, { status: 500 }),
        ),
        http.get("*/api/v1/users/interests", () =>
          HttpResponse.json({ message: "서버 오류" }, { status: 500 }),
        ),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      expect(
        canvas.getByText("카테고리를 불러오지 못했습니다."),
      ).toBeInTheDocument();
    });
  },
};

export const SearchCategory: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      expect(canvas.getAllByText("카페")[0]).toBeInTheDocument();
    });

    const searchInput = canvas.getByPlaceholderText("카테고리 검색");
    await userEvent.type(searchInput, "카");

    await waitFor(() => {
      expect(canvas.getByText('"카" 검색 결과')).toBeInTheDocument();
    });
  },
};

export const SearchNoResult: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      expect(canvas.getAllByText("카페")[0]).toBeInTheDocument();
    });

    const searchInput = canvas.getByPlaceholderText("카테고리 검색");
    await userEvent.type(searchInput, "없는카테고리");

    await waitFor(() => {
      expect(canvas.getByText("검색 결과가 없습니다.")).toBeInTheDocument();
    });
  },
};

export const ToggleCategory: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      expect(canvas.getAllByText("맛집")[0]).toBeInTheDocument();
    });

    await userEvent.click(canvas.getAllByText("맛집")[0]);

    await waitFor(() => {
      expect(canvas.getByText("선택된 카테고리")).toBeInTheDocument();
    });
  },
};

export const SaveSuccess: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      expect(canvas.getAllByText("카페")[0]).toBeInTheDocument();
    });

    await userEvent.click(canvas.getByRole("button", { name: "설정하기" }));

    await waitFor(() => {
      expect(
        canvas.getByText("카테고리 설정이 완료되었습니다."),
      ).toBeInTheDocument();
    });
  },
};
