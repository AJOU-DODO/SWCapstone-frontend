import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "@storybook/test";
import { http, HttpResponse } from "msw";

// ────────────────────────────────────────────────────────────────────────────────
// Mock data
// ────────────────────────────────────────────────────────────────────────────────

const mockNests = Array.from({ length: 5 }, (_, i) => ({
  nestId: i + 1,
  authorNickname: `유저${i + 1}`,
  content: `둥지 본문 내용 샘플입니다. 항목 번호 ${i + 1}`,
  createdAt: "2024-03-01T10:00:00",
  likeCount: i * 3,
  commentCount: i * 2,
  reportCount: i,
  reasons: [],
  deleted: i === 4, // 마지막 항목은 삭제된 글
}));

const mockReportedNests = Array.from({ length: 4 }, (_, i) => ({
  nestId: 10 + i,
  authorNickname: `신고유저${i + 1}`,
  content: `신고된 둥지 본문 ${i + 1}`,
  nestTitle: `신고 둥지 제목 ${i + 1}`,
  firstReportedAt: "2024-02-15T09:00:00",
  lastReportedAt: "2024-03-10T12:00:00",
  reportCount: (i + 1) * 2,
  reasons: ["SPAM"],
  status: i % 2 === 0 ? "PENDING" : "PROCESSED",
}));

const mockReportedComments = Array.from({ length: 4 }, (_, i) => ({
  commentId: 100 + i,
  nestId: i + 1,
  authorNickname: `댓글유저${i + 1}`,
  commentContent: `신고된 댓글 내용 ${i + 1}`,
  nestTitle: `부모 둥지 제목 ${i + 1}`,
  lastReportedAt: "2024-03-08T15:00:00",
  reportCount: i + 1,
  commentCount: 0,
  reasons: ["INAPPROPRIATE"],
  status: "PENDING",
}));

const mockNestDetail = {
  status: "SUCCESS",
  code: "200",
  message: null,
  data: {
    authorId: 1,
    profileImageUrl: "https://placecats.com/80/80",
    nestId: 1,
    title: "샘플 둥지 제목",
    content: "샘플 둥지 본문 내용입니다. 상세보기 패널에 렌더링됩니다.",
    authorNickname: "유저1",
    latitude: 37.5665,
    longitude: 126.978,
    imageUrls: ["https://placecats.com/300/200"],
    categoryIds: [1],
    categoryNames: ["여행"],
    firstReportedAt: "2024-02-15T09:00:00",
    lastReportedAt: "2024-03-10T12:00:00",
    createdAt: "2024-03-01T10:00:00",
    likeCount: 12,
    dislikeCount: 2,
    deleted: false,
  },
};

const mockReportDetail = {
  status: "SUCCESS",
  code: "200",
  message: null,
  data: {
    targetType: "NEST",
    targetId: 1,
    stats: { SPAM: 3, INAPPROPRIATE: 1 },
    otherReportContents: ["기타 신고 내용"],
  },
};

const mockComments = {
  status: "SUCCESS",
  code: "200",
  message: null,
  data: [
    {
      authorId: 2,
      profileImageUrl: "https://placecats.com/40/40",
      commentId: 201,
      parentId: 0,
      authorNickname: "댓글러1",
      content: "첫 번째 댓글입니다.",
      createdAt: "2024-03-02T11:00:00",
      pendingReportCount: 0,
      likeCount: 3,
      children: [],
      deleted: false,
    },
  ],
};

// 페이지 응답 래퍼 헬퍼
const pageResponse = (content: unknown[]) => ({
  status: "SUCCESS",
  code: "200",
  message: null,
  data: {
    content,
    last: false,
    totalElements: content.length,
    totalPages: 2,
    size: 10,
    number: 0,
    empty: content.length === 0,
  },
});

// ────────────────────────────────────────────────────────────────────────────────
// MSW handlers
// ────────────────────────────────────────────────────────────────────────────────

const handlers = {
  allNests: http.get("/api/v1/admin/nests", () =>
    HttpResponse.json(pageResponse(mockNests))
  ),
  reportedNests: http.get("/api/v1/admin/reports/nests", () =>
    HttpResponse.json(pageResponse(mockReportedNests))
  ),
  reportedComments: http.get("/api/v1/admin/reports/comments", () =>
    HttpResponse.json(pageResponse(mockReportedComments))
  ),
  nestDetail: http.get("/api/v1/admin/nests/:nestId", () =>
    HttpResponse.json(mockNestDetail)
  ),
  reportDetail: http.get("/api/v1/admin/reports/details", () =>
    HttpResponse.json(mockReportDetail)
  ),
  comments: http.get("/api/v1/admin/nests/:nestId/comments", () =>
    HttpResponse.json(mockComments)
  ),
};


const defaultHandlers = Object.values(handlers);

// ────────────────────────────────────────────────────────────────────────────────
// Story setup
// ────────────────────────────────────────────────────────────────────────────────

// NOTE: AdminNestsPage는 useSearchParams를 사용하므로 Next.js App Router 환경이 필요합니다.
// 실제 프로젝트의 storybook decorator(예: RouterDecorator)로 감싸 주세요.
import Page from './page';

const meta: Meta<typeof Page> = {
  title: "Admin/Pages/AdminNestsPage",
  component: Page,
  parameters: {
    layout: "fullscreen",
    msw: { handlers: defaultHandlers },
    // Next.js App Router mock (next-storybook 또는 커스텀 데코레이터 사용 시)
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/admin/nests",
        query: { tab: "all", page: "1", sort: "latest", includeDeleted: "ACTIVE_ONLY" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Page>;

// ────────────────────────────────────────────────────────────────────────────────
// Visual (Chromatic) Stories
// ────────────────────────────────────────────────────────────────────────────────

/** 기본 진입: 전체 둥지 탭 */
export const AllNestsTab: Story = {};

/** 신고된 둥지 탭 */
export const ReportedNestsTab: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/admin/nests",
        query: { tab: "reported", page: "1", sort: "LATEST_REPORT" },
      },
    },
  },
};

/** 신고된 댓글 탭 */
export const ReportedCommentsTab: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/admin/nests",
        query: { tab: "comments", page: "1", sort: "LATEST_REPORT" },
      },
    },
  },
};

/** 삭제된 글 포함 보기 (includeDeleted=ALL) */
export const IncludeDeletedNests: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/admin/nests",
        query: { tab: "all", page: "1", sort: "latest", includeDeleted: "ALL" },
      },
    },
  },
};

/** 테이블 행 클릭 후 상세 패널이 열린 상태 */
export const NestDetailOpen: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 첫 번째 행이 렌더링될 때까지 대기
    const firstRow = await canvas.findByText("유저1");
    await userEvent.click(firstRow);

    // 상세 패널 헤더 확인
    await expect(
      await canvas.findByText("유저1", { selector: "*" })
    ).toBeInTheDocument();
  },
};

// ────────────────────────────────────────────────────────────────────────────────
// Interaction Stories
// ────────────────────────────────────────────────────────────────────────────────

/** 탭 전환: 전체 → 신고 → 댓글 순서로 클릭 */
export const TabNavigation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 신고 탭 클릭
    const reportedTab = await canvas.findByRole("button", { name: "신고" })
    await expect(reportedTab).toBeEnabled();
    await userEvent.click(reportedTab);

    // 댓글 탭 클릭
    const commentsTab = await canvas.findByRole("button", { name: "신고 댓글" });
    await expect(commentsTab).toBeEnabled();
    await userEvent.click(commentsTab);

    // 전체 탭으로 복귀
    const allTab = await canvas.findByRole("button", { name: "전체" });
    await expect(allTab).toBeEnabled();
    await userEvent.click(allTab);
  },
};

/** 행 클릭 → 상세 패널 열기 → 빈 영역 클릭 → 패널 닫힘 */
export const OpenAndCloseDetail: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 행 클릭
    const row = await canvas.findByText("유저1");
    await userEvent.click(row);
    await expect(await canvas.findByText("샘플 둥지 제목")).toBeInTheDocument();
  },
};

/** 삭제된 글 포함 체크박스 토글 */
export const ToggleIncludeDeleted: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const checkbox = await canvas.findByRole("checkbox");
    // 초기 상태: unchecked
    await expect(checkbox).not.toBeChecked();

    await expect(checkbox).toBeEnabled();
    await userEvent.click(checkbox);

    await expect(checkbox).toBeInTheDocument();
  },
};

/** 빈 데이터: 테이블에 아무 행도 없을 때 */
export const EmptyTable: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/api/v1/admin/nests", () =>
          HttpResponse.json(pageResponse([]))
        ),
        ...defaultHandlers.slice(1),
      ],
    },
  },
};