import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

const meta: Meta<typeof DeleteConfirmDialog> = {
  title: "Webview/NestDetail/DeleteConfirmDialog",
  component: DeleteConfirmDialog,
  parameters: { layout: "centered" },
  args: {
    open: true,
    isPending: false,
    onClose: fn(),
    onConfirm: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof DeleteConfirmDialog>;

export const Default: Story = {};

export const Pending: Story = {
  args: { isPending: true },
};
