import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import PostCard from "./PostCard";

const meta: Meta<typeof PostCard> = {
  title: "Webview/PostCard",
  component: PostCard,
  parameters: {
    layout: "centered",
    nextjs: { appDirectory: true },
  },
};

export default meta;
type Story = StoryObj<typeof PostCard>;

const basePost = {
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
};

// ────────────────────────────────────────────────
// 1. 해금된 둥지
// ────────────────────────────────────────────────
export const Unlocked: Story = {
  args: {
    post: basePost,
    selectNest: () => {},
    index: 0,
  },
};

// ────────────────────────────────────────────────
// 2. 미해금 둥지
// ────────────────────────────────────────────────
export const Locked: Story = {
  args: {
    post: {
      ...basePost,
      unlocked: false,
    },
    selectNest: () => {},
    index: 0,
  },
};

// ────────────────────────────────────────────────
// 3. 엽서 있는 둥지
// ────────────────────────────────────────────────
export const WithPostcard: Story = {
  args: {
    post: {
      ...basePost,
      hasPostcard: true,
      postcardId: 1,
    },
    selectNest: () => {},
    index: 0,
  },
};

// ────────────────────────────────────────────────
// 4. 광고 둥지
// ────────────────────────────────────────────────
export const Advertisement: Story = {
  args: {
    post: {
      ...basePost,
      ad: true,
    },
    selectNest: () => {},
    index: 0,
  },
};

// ────────────────────────────────────────────────
// 5. 썸네일 없는 둥지
// ────────────────────────────────────────────────
export const NoThumbnail: Story = {
  args: {
    post: {
      ...basePost,
      thumbnailUrl: undefined,
    },
    selectNest: () => {},
    index: 0,
  },
};

// ────────────────────────────────────────────────
// 6. 카테고리 없는 둥지
// ────────────────────────────────────────────────
export const NoCategories: Story = {
  args: {
    post: {
      ...basePost,
      categoryNames: [],
    },
    selectNest: () => {},
    index: 0,
  },
};

// ────────────────────────────────────────────────
// 7. staggered animation 확인 (여러 카드)
// ────────────────────────────────────────────────
export const StaggeredAnimation: Story = {
  render: () => (
    <div className="flex flex-col w-[380px]">
      {[0, 1, 2].map((index) => (
        <PostCard
          key={index}
          post={{
            ...basePost,
            id: index + 1,
            thumbnailUrl: `https://loremflickr.com/400/300?lock=${index + 1}`,
            unlocked: index % 2 === 0,
          }}
          selectNest={() => {}}
          index={index}
        />
      ))}
    </div>
  ),
};

// ────────────────────────────────────────────────
// 8. 모든 요소 포함 (엽서 + 광고 + 미해금)
// ────────────────────────────────────────────────
export const AllFeatures: Story = {
  args: {
    post: {
      ...basePost,
      ad: true,
      hasPostcard: true,
      postcardId: 1,
      unlocked: false,
    },
    selectNest: () => {},
    index: 0,
  },
};
