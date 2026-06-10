import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";
import { DeleteCommentDialog } from "./DeleteCommentDialog";

const meta: Meta<typeof DeleteCommentDialog> = {
  title: "Webview/NestDetail/DeleteCommentDialog",
  component: DeleteCommentDialog,
  parameters: { layout: "centered" },
  args: {
    open: true,
    isPending: false,
    onClose: fn(),
    onConfirm: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof DeleteCommentDialog>;

export const Default: Story = {};

export const Pending: Story = {
  args: { isPending: true },
};
