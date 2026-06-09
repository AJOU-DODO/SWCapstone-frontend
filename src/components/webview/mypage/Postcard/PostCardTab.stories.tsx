import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect } from '@storybook/test';
import PostcardTab from './PostcardTab';

const meta: Meta<typeof PostcardTab> = {
  title: 'Webview/Postcard/PostcardTab',
  component: PostcardTab,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      viewports: {
        galaxyS22: {
          name: 'Galaxy S22 (Android)',
          styles: { width: '360px', height: '760px' },
          type: 'mobile',
        },
      },
      defaultViewport: 'galaxyS22',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PostcardTab>;

// 1. 보유 엽서함 탭 활성
export const MinTab: Story = {
  args: {
    currentTab: 'mine',
    onTabChange: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const mineButton = canvas.getByRole('button', { name: '보유 엽서함' });
    const sentButton = canvas.getByRole('button', { name: '보낸 엽서함' });
    const receivedButton = canvas.getByRole('button', { name: '받은 엽서함' });

    // 활성 탭 폰트 bold 확인
    await expect(mineButton).toHaveClass('font-bold');
    await expect(sentButton).not.toHaveClass('font-bold');
    await expect(receivedButton).not.toHaveClass('font-bold');
  },
};

// 2. 보낸 엽서함 탭 활성
export const SentTab: Story = {
  args: {
    currentTab: 'sent',
    onTabChange: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const sentButton = canvas.getByRole('button', { name: '보낸 엽서함' });
    await expect(sentButton).toHaveClass('font-bold');
  },
};

// 3. 받은 엽서함 탭 활성
export const ReceivedTab: Story = {
  args: {
    currentTab: 'received',
    onTabChange: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const receivedButton = canvas.getByRole('button', { name: '받은 엽서함' });
    await expect(receivedButton).toHaveClass('font-bold');
  },
};

// 4. 탭 클릭 시 onTabChange 호출 확인
export const TabChange: Story = {
  args: {
    currentTab: 'mine',
    onTabChange: (tab) => console.log('탭 변경:', tab),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: '보낸 엽서함' }));
    await userEvent.click(canvas.getByRole('button', { name: '받은 엽서함' }));
    await userEvent.click(canvas.getByRole('button', { name: '보유 엽서함' }));
  },
};