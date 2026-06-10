import type { Meta, StoryObj } from "@storybook/react-vite";
import { ImageSlider } from "./ImageSlider";

const meta: Meta<typeof ImageSlider> = {
  title: "Webview/NestDetail/ImageSlider",
  component: ImageSlider,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="w-95">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ImageSlider>;

export const SingleImage: Story = {
  args: {
    imageUrls: ["https://loremflickr.com/400/400?lock=1"],
    title: "둥지 제목",
  },
};

export const MultipleImages: Story = {
  args: {
    imageUrls: [
      "https://loremflickr.com/400/400?lock=1",
      "https://loremflickr.com/400/400?lock=2",
      "https://loremflickr.com/400/400?lock=3",
    ],
    title: "둥지 제목",
  },
};

export const Empty: Story = {
  args: {
    imageUrls: [],
    title: "둥지 제목",
  },
};
