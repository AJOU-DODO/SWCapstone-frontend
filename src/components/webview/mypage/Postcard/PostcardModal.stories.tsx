import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect } from '@storybook/test';
import type { MyPostcard } from "@/types/indexMypage";
import PostcardModal from './PostcardModal';

const meta: Meta<typeof PostcardModal> = {
  title: 'Webview/Postcard/PostcardModal',
  component: PostcardModal,
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
type Story = StoryObj<typeof PostcardModal>;

// ─── Mock Data ───────────────────────────────────────────────

const mockPostcard: MyPostcard = {
  id: 1,
  imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
  content: '성수동 카페에서 찍은 사진이에요.',
  authorNickname: '도도새',
  reactionType: '',
  createdAt: '2025-03-01T10:00:00Z',
  mine: true,
};

const mockPostcardWithReaction: MyPostcard = {
  ...mockPostcard,
  reactionType: 'HAPPY',
};

const baseArgs = {
  isOpen: true,
  postcardData: mockPostcard,
  accessToken: 'mock-token',
  onClose: () => console.log('[Mock] 닫기'),
  onEditClick: () => console.log('[Mock] 수정 클릭'),
  onDeleteClick: () => console.log('[Mock] 삭제 클릭'),
  onReportClick: () => console.log('[Mock] 신고 클릭'),
};

// 1. mine 탭 - 수정/삭제 버튼 표시
export const MineTab: Story = {
  args: {
    ...baseArgs,
    activeTab: 'mine',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('button', { name: /수정/ })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: /삭제/ })).toBeInTheDocument();

    // 신고 버튼 없음
    const reportButton = canvas.queryByRole('button', { name: /신고/ });
    await expect(reportButton).not.toBeInTheDocument();
  },
};

// 2. sent 탭 - reactionType 있을 때 감정 표시
export const SentTabWithReaction: Story = {
  args: {
    ...baseArgs,
    activeTab: 'sent',
    postcardData: mockPostcardWithReaction,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 감정 이모지 표시 확인
    await expect(canvas.getByText('😊')).toBeInTheDocument();
    await expect(canvas.getByText('HAPPY')).toBeInTheDocument();

    // 수정/삭제/신고 없음
    await expect(canvas.queryByRole('button', { name: /수정/ })).not.toBeInTheDocument();
    await expect(canvas.queryByRole('button', { name: /신고/ })).not.toBeInTheDocument();
  },
};

// 3. sent 탭 - reactionType 없을 때
export const SentTabNoReaction: Story = {
  args: {
    ...baseArgs,
    activeTab: 'sent',
    postcardData: mockPostcard,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('아직 감정을 남기지 않았어요.')).toBeInTheDocument();
  },
};

// 4. received 탭 - 리액션 버튼 + 신고 버튼 표시
export const ReceivedTab: Story = {
  args: {
    ...baseArgs,
    activeTab: 'received',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 리액션 안내 문구
    await expect(canvas.getByText('당신의 감정을 엽서에 남겨주세요!')).toBeInTheDocument();

    // 신고 버튼
    await expect(canvas.getByRole('button', { name: /신고/ })).toBeInTheDocument();

    // 수정/삭제 없음
    await expect(canvas.queryByRole('button', { name: /수정/ })).not.toBeInTheDocument();
    await expect(canvas.queryByRole('button', { name: /삭제/ })).not.toBeInTheDocument();
  },
};

// 5. 닫기 버튼 클릭
export const CloseButton: Story = {
  args: {
    ...baseArgs,
    activeTab: 'mine',
    onClose: () => console.log('[Mock] 닫기 호출됨'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const closeButton = canvas.getByRole('button', { name: '✕' });
    await expect(closeButton).toBeInTheDocument();
    await userEvent.click(closeButton);
  },
};

// 6. isOpen false - 모달 미표시
export const Closed: Story = {
  args: {
    ...baseArgs,
    activeTab: 'mine',
    isOpen: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const modal = canvas.queryByText('성수동 카페에서 찍은 사진이에요.');
    await expect(modal).not.toBeInTheDocument();
  },
};