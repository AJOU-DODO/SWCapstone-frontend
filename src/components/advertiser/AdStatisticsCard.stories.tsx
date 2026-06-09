import type { Meta, StoryObj } from "@storybook/react-vite";
import AdStatisticsCard from "./AdStatisticsCard";

const meta: Meta<typeof AdStatisticsCard> = {
  title: "Advertiser/AdStatisticsCard",
  component: AdStatisticsCard,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof AdStatisticsCard>;

const baseNest = {
  id: 100,
  title: "카페 도도 광고",
  viewCount: 500,
  isAd: true,
};

const baseStats = {
  nestId: 100,
  title: "카페 도도: 아메리카노 1+1 이벤트",
  impressions: 1500,
  clicks: 120,
  expiredAt: "2026-07-03T23:59:59",
};

export const Default: Story = {
  args: {
    nest: baseNest,
    stats: baseStats,
  },
};

export const Loading: Story = {
  args: {
    nest: baseNest,
    stats: undefined,
  },
};
