import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";
import { http, HttpResponse } from "msw";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CommentItem } from "./CommentItem";
import type { NestComment } from "@/types";

const queryClient = new QueryClient();

const meta: Meta<typeof CommentItem> = {
  title: "Webview/NestDetail/CommentItem",
  component: CommentItem,
  parameters: {
    layout: "padded",
    msw: {
      handlers: [
        http.post("*/api/v1/comments/*/like", () =>
          HttpResponse.json({
            status: "SUCCESS",
            code: "200",
            message: null,
            data: null,
          }),
        ),
        http.post("*/api/v1/nests/*/comments", () =>
          HttpResponse.json({
            status: "SUCCESS",
            code: "200",
            message: null,
            data: null,
          }),
        ),
        http.put("*/api/v1/comments/*", () =>
          HttpResponse.json({
            status: "SUCCESS",
            code: "200",
            message: null,
            data: null,
          }),
        ),
      ],
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <div className="w-95">
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
  args: {
    nestId: "1",
    accessToken: "mock-token",
    sortBy: "DEFAULT",
    onReportClick: fn(),
    onDeleteClick: fn(),
    onEditSuccess: fn(),
    onEditError: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof CommentItem>;

const baseComment: NestComment = {
  id: 1,
  content: "정말 좋은 산책로네요! 다음에 꼭 가봐야겠어요.",
  nickname: "산책왕",
  profileImageUrl: "https://loremflickr.com/100/100?lock=1",
  createdAt: "2026-05-20T10:00:00",
  likeCount: 5,
  liked: false,
  mine: false,
  children: [],
};

export const Default: Story = {
  args: { comment: baseComment },
};

export const Liked: Story = {
  args: {
    comment: { ...baseComment, liked: true, likeCount: 6 },
  },
};

export const Mine: Story = {
  args: {
    comment: { ...baseComment, mine: true },
  },
};

export const Deleted: Story = {
  args: {
    comment: {
      ...baseComment,
      nickname: "익명",
      content: "삭제된 댓글입니다.",
      profileImageUrl: "",
    },
  },
};

export const WithChildren: Story = {
  args: {
    comment: {
      ...baseComment,
      children: [
        {
          id: 2,
          content: "저도 동의해요!",
          nickname: "동의왕",
          profileImageUrl: "https://loremflickr.com/100/100?lock=2",
          createdAt: "2026-05-20T11:00:00",
          likeCount: 2,
          liked: false,
          mine: false,
          children: [],
        },
      ],
    },
  },
};

export const IsChild: Story = {
  args: {
    comment: {
      ...baseComment,
      id: 2,
      content: "저도 동의해요!",
      nickname: "동의왕",
    },
    isChild: true,
  },
};

export const LongContent: Story = {
  args: {
    comment: {
      ...baseComment,
      content:
        "이 산책로는 정말 아름답고 조용한 곳이에요. 봄에는 벚꽃이 만개하고 가을에는 단풍이 정말 예쁘게 물들어요. 주말에 가족과 함께 방문하기 딱 좋은 장소입니다.",
    },
  },
};
