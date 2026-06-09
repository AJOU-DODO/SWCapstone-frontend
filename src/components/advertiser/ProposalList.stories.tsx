import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, expect } from "@storybook/test";
import ProposalList from "./ProposalList";
import type { AdProposal } from "@/types/indexAdvertiser";

const meta: Meta<typeof ProposalList> = {
  title: "Advertiser/ProposalList",
  component: ProposalList,
  parameters: {
    layout: "padded",
    nextjs: { appDirectory: true },
  },
};

export default meta;
type Story = StoryObj<typeof ProposalList>;

const mockProposals: AdProposal[] = [
  {
    id: 1,
    title: "카페 도도: 아메리카노 1+1 이벤트",
    status: "PENDING",
    rejectReason: null,
    createdAt: "2026-05-20T10:00:00",
    latitude: 37.4979,
    longitude: 127.0276,
    unlockRadius: 100,
    content: "산책 중 들러서 시원한 아메리카노 1+1 혜택을 받아보세요!",
    imageUrls: [],
    categoryNames: ["카페", "이벤트"],
  },
  {
    id: 2,
    title: "강남 맛집 홍보",
    status: "APPROVED",
    rejectReason: null,
    createdAt: "2026-05-15T10:00:00",
    latitude: 37.4979,
    longitude: 127.0276,
    unlockRadius: 150,
    content: "강남 최고의 맛집을 소개합니다.",
    imageUrls: [],
    categoryNames: ["식당"],
  },
  {
    id: 3,
    title: "헬스장 이벤트",
    status: "REJECTED",
    rejectReason: "이미지 화질이 낮습니다. 고화질 이미지로 교체해주세요.",
    createdAt: "2026-05-10T10:00:00",
    latitude: 37.4979,
    longitude: 127.0276,
    unlockRadius: 100,
    content: "헬스장 이벤트를 소개합니다.",
    imageUrls: [],
    categoryNames: ["운동"],
  },
];

export const Default: Story = {
  args: { proposals: mockProposals },
};

export const Empty: Story = {
  args: { proposals: [] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText("신청한 광고가 없습니다."),
    ).toBeInTheDocument();
  },
};

export const NewProposalButton: Story = {
  args: { proposals: mockProposals },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByText("+ 새 광고 신청");
    await expect(button).toBeInTheDocument();
    await userEvent.click(button);
  },
};
