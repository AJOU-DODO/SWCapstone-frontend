import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";
import { userEvent, within, expect } from "@storybook/test";
import { http, HttpResponse } from "msw";
import { ReportModal } from "./ReportModal";

const meta: Meta<typeof ReportModal> = {
  title: "Webview/NestDetail/ReportModal",
  component: ReportModal,
  parameters: {
    layout: "centered",
    msw: {
      handlers: [
        http.post("*/api/v1/reports", () =>
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
  args: {
    open: true,
    reportType: "NEST",
    targetId: 1,
    accessToken: "mock-token",
    onClose: fn(),
    onSuccess: fn(),
    onError: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ReportModal>;

export const Default: Story = {};

export const SelectReason: Story = {
  play: async () => {
    const body = within(document.body);
    const spamButton = body.getByText("스팸");
    await userEvent.click(spamButton);
    await expect(spamButton).toBeInTheDocument();
  },
};

export const SelectOtherReason: Story = {
  play: async () => {
    const body = within(document.body);
    await userEvent.click(body.getByText("기타"));
    await expect(
      body.getByPlaceholderText("상세 사유를 작성해주세요."),
    ).toBeInTheDocument();
  },
};
