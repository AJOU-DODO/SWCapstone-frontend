import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, expect } from '@storybook/test';
import type { MyPostcard } from "@/types/indexMypage";
import PostcardGrid from './PostcardGrid';

if (typeof window !== 'undefined') {
  window.AndroidBridge = {
    getNestIds: () => '',
    getAccessToken: () => '',
    getLocation: () => '',
    sendNestIdSelected: () => {},
    requestImageUpload: () => '',
    getNestDetailId: () => '',
    requestPostcardMake: () => console.log('[Mock] 엽서 생성 요청'),
  };
}

const meta: Meta<typeof PostcardGrid> = {
  title: 'Webview/Postcard/PostcardGrid',
  component: PostcardGrid,
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
  args: {
    onItemClick: () => {},
    fetchNextPage: () => {},
    hasNextPage: false,
    isFetchingNextPage: false,
  },
};

export default meta;
type Story = StoryObj<typeof PostcardGrid>;

// ─── Mock Data ───────────────────────────────────────────────

const mockPostcards: MyPostcard[] = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300',
    content: '성수동 카페에서',
    authorNickname: '도도새',
    reactionType: 'HAPPY',
    createdAt: '2025-03-01T10:00:00Z',
    mine: true,
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
    content: '한강에서',
    authorNickname: '도도새',
    reactionType: '',
    createdAt: '2025-04-10T09:00:00Z',
    mine: true,
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300',
    content: '제주도에서',
    authorNickname: '친구새',
    reactionType: 'TOUCHED',
    createdAt: '2025-05-01T08:00:00Z',
    mine: false,
  },
];

// 1. mine 탭 - 엽서 만들기 버튼 + 목록
export const MineTab: Story = {
  args: {
    items: mockPostcards,
    activeTab: 'mine',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 엽서 만들기 버튼 확인
    await expect(canvas.getByText('엽서 만들기')).toBeInTheDocument();

    // 엽서 이미지 개수 확인 (만들기 버튼 제외)
    const images = canvasElement.querySelectorAll('img');
    await expect(images.length).toBe(mockPostcards.length);
  },
};

// 2. mine 탭 - 빈 상태 (만들기 버튼만 표시)
export const MineTabEmpty: Story = {
  args: {
    items: [],
    activeTab: 'mine',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('엽서 만들기')).toBeInTheDocument();

    const images = canvasElement.querySelectorAll('img');
    await expect(images.length).toBe(0);
  },
};

// 3. sent 탭 - reactionType 있는 카드에 하트 표시
export const SentTab: Story = {
  args: {
    items: mockPostcards,
    activeTab: 'sent',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 엽서 만들기 버튼 없음
    const createButton = canvas.queryByText('엽서 만들기');
    await expect(createButton).not.toBeInTheDocument();

    // reactionType 있는 카드(id:1,3)에 하트 아이콘 표시
    // lucide Heart svg 확인
    const hearts = canvasElement.querySelectorAll('svg');
    await expect(hearts.length).toBeGreaterThan(0);
  },
};

// 4. received 탭 - 엽서 만들기 버튼 없음
export const ReceivedTab: Story = {
  args: {
    items: mockPostcards,
    activeTab: 'received',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const createButton = canvas.queryByText('엽서 만들기');
    await expect(createButton).not.toBeInTheDocument();
  },
};

// 5. 다음 페이지 로딩 중
export const LoadingMore: Story = {
  args: {
    items: mockPostcards,
    activeTab: 'mine',
    hasNextPage: true,
    isFetchingNextPage: true,
  },
  play: async ({ canvasElement }) => {
    const spinner = canvasElement.querySelector('.animate-spin');
    await expect(spinner).toBeInTheDocument();

    const endMessage = within(canvasElement).queryByText('모든 엽서를 확인했어요!');
    await expect(endMessage).not.toBeInTheDocument();
  },
};

// 6. 마지막 페이지
export const LastPage: Story = {
  args: {
    items: mockPostcards,
    activeTab: 'mine',
    hasNextPage: false,
    isFetchingNextPage: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('모든 엽서를 확인했어요!')).toBeInTheDocument();

    const spinner = canvasElement.querySelector('.animate-spin');
    await expect(spinner).not.toBeInTheDocument();
  },
};