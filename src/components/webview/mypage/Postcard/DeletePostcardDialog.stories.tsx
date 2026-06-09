import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect } from '@storybook/test';
import type { MyPostcard } from "@/types/indexMypage";
import DeletePostcardDialog from './DeletePostcardDialog';

const meta: Meta<typeof DeletePostcardDialog> = {
  title: 'Webview/Postcard/DeletePostcardDialog',
  component: DeletePostcardDialog,
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
type Story = StoryObj<typeof DeletePostcardDialog>;

// ─── Mock Data ───────────────────────────────────────────────

const mockPostcard: MyPostcard = {
  id: 1,
  imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300',
  content: '성수동 카페에서 찍은 사진이에요.',
  authorNickname: '도도새',
  reactionType: '',
  createdAt: '2025-03-01T10:00:00Z',
  mine: true,
};

const baseArgs = {
  isOpen: true,
  postcard: mockPostcard,
  accessToken: 'mock-token',
  activeTab: 'mine' as const,
  onClose: () => console.log('[Mock] 닫기'),
  onSuccess: () => console.log('[Mock] 삭제 성공'),
  onError: () => console.log('[Mock] 삭제 실패'),
};

// 1. 기본 다이얼로그
export const Default: Story = {
  args: baseArgs,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('엽서 삭제')).toBeInTheDocument();
    await expect(canvas.getByText(/정말 이 엽서를 삭제하시겠습니까/)).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: '취소' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: '삭제' })).toBeInTheDocument();
  },
};

// 2. 취소 버튼 클릭
export const CancelClick: Story = {
  args: {
    ...baseArgs,
    onClose: () => console.log('[Mock] 취소 클릭 - 닫기 호출됨'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const cancelButton = canvas.getByRole('button', { name: '취소' });
    await userEvent.click(cancelButton);
  },
};

// 3. isOpen false - 미표시
export const Closed: Story = {
  args: {
    ...baseArgs,
    isOpen: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const dialog = canvas.queryByText('엽서 삭제');
    await expect(dialog).not.toBeInTheDocument();
  },
};

// 4. postcard null - 미표시
export const NullPostcard: Story = {
  args: {
    ...baseArgs,
    postcard: null,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const dialog = canvas.queryByText('엽서 삭제');
    await expect(dialog).not.toBeInTheDocument();
  },
};