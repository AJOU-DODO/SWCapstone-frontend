import type { Meta, StoryObj } from "@storybook/react-vite";
import ProposalItem from "./ProposalItem";

const meta: Meta<typeof ProposalItem> = {
  title: "Advertiser/ProposalItem",
  component: ProposalItem,
  parameters: {
    layout: "padded",
    nextjs: { appDirectory: true },
  },
};

export default meta;
type Story = StoryObj<typeof ProposalItem>;

const baseProposal = {
  id: 1,
  title: "카페 도도: 아메리카노 1+1 이벤트",
  status: "PENDING" as const,
  rejectReason: null,
  createdAt: "2026-05-20T10:00:00",
  latitude: 37.4979,
  longitude: 127.0276,
  unlockRadius: 100,
  content: "산책 중 들러서 시원한 아메리카노 1+1 혜택을 받아보세요!",
  imageUrls: [],
  categoryNames: ["카페", "이벤트"],
};

export const Pending: Story = {
  args: { proposal: baseProposal },
};

export const Approved: Story = {
  args: {
    proposal: {
      ...baseProposal,
      status: "APPROVED" as const,
    },
  },
};

export const Rejected: Story = {
  args: {
    proposal: {
      ...baseProposal,
      status: "REJECTED" as const,
      rejectReason: "이미지 화질이 낮습니다. 고화질 이미지로 교체해주세요.",
    },
  },
};

export const NoCategories: Story = {
  args: {
    proposal: {
      ...baseProposal,
      categoryNames: [],
    },
  },
};
