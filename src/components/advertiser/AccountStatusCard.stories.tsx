import type { Meta, StoryObj } from "@storybook/react-vite";
import AccountStatusCard from "./AccountStatusCard";

const meta: Meta<typeof AccountStatusCard> = {
  title: "Advertiser/AccountStatusCard",
  component: AccountStatusCard,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof AccountStatusCard>;

const baseAccount = {
  allowedAdCount: 5,
  currentAdCount: 2,
  pendingAdCount: 1,
  remainingAdCount: 2,
  expiredAt: "2026-12-31T23:59:59",
  isExpired: false,
};

export const Default: Story = {
  args: { account: baseAccount },
};

export const Expired: Story = {
  args: {
    account: {
      ...baseAccount,
      isExpired: true,
      remainingAdCount: 0,
    },
  },
};

export const FullSlots: Story = {
  args: {
    account: {
      ...baseAccount,
      currentAdCount: 5,
      remainingAdCount: 0,
    },
  },
};

export const NoAdsYet: Story = {
  args: {
    account: {
      ...baseAccount,
      currentAdCount: 0,
      pendingAdCount: 0,
      remainingAdCount: 5,
    },
  },
};
