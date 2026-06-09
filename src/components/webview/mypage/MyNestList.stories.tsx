import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, expect } from '@storybook/test';
import type { MyNestDetail } from "@/types/indexMypage";
import MyNestList from './MyNestList';

const meta: Meta<typeof MyNestList> = {
  title: 'Webview/MyNestList',
  component: MyNestList,
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
    fetchNextPage: () => {},
    hasNextPage: false,
    isFetchingNextPage: false,
  },
};

export default meta;
type Story = StoryObj<typeof MyNestList>;

// ─── Mock Data ───────────────────────────────────────────────

const mockNests: MyNestDetail[] = [
  {
    id: 1,
    title: '성수동 카페 탐방',
    content: '요즘 핫한 성수동 카페들을 둘러봤어요.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=150',
    createdAt: '2025-03-01T10:00:00Z',
    updatedAt: '2025-03-05T12:00:00Z',
    unlocked: true,
  },
  {
    id: 2,
    title: '한강 피크닉',
    content: '봄날 한강에서 돗자리 펴고 쉬었어요.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    createdAt: '2025-04-10T09:00:00Z',
    updatedAt: '2025-04-10T09:00:00Z',
    unlocked: false,
  },
  {
    id: 3,
    title: '썸네일 없는 둥지',
    content: '이미지 없이 텍스트만 있는 카드예요.',
    thumbnailUrl: '',
    createdAt: '2025-05-01T08:00:00Z',
    updatedAt: '2025-05-02T08:00:00Z',
    unlocked: true,
  },
];

// ─── Stories ─────────────────────────────────────────────────

// 1. 빈 상태
export const Empty: Story = {
  args: {
    nestsData: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const emptyMessage = await canvas.findByText('아직 둥지가 없어요!');
    await expect(emptyMessage).toBeInTheDocument();

    const cards = canvas.queryAllByRole('link');
    await expect(cards).toHaveLength(0);
  },
};

// 2. 데이터 있음 + 마지막 페이지
export const WithNests: Story = {
  args: {
    nestsData: mockNests,
    hasNextPage: false,
    isFetchingNextPage: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 카드 개수 확인
    const cards = await canvas.findAllByRole('link');
    await expect(cards).toHaveLength(mockNests.length);

    // 타이틀 렌더링 확인
    await expect(canvas.getByText('성수동 카페 탐방')).toBeInTheDocument();

    // 썸네일 없는 카드도 정상 렌더링 확인
    await expect(canvas.getByText('썸네일 없는 둥지')).toBeInTheDocument();

    // 목록 끝 문구 확인
    await expect(canvas.getByText('모든 둥지를 확인했어요!')).toBeInTheDocument();

    // 스피너 없음 확인 (animate-spin 클래스로 판별)
    const spinner = canvasElement.querySelector('.animate-spin');
    await expect(spinner).not.toBeInTheDocument();
  },
};

// 3. 다음 페이지 로딩 중 (하단 스피너 표시)
export const LoadingMore: Story = {
  args: {
    nestsData: mockNests,
    hasNextPage: true,
    isFetchingNextPage: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 기존 카드는 정상 렌더링
    const cards = await canvas.findAllByRole('link');
    await expect(cards).toHaveLength(mockNests.length);

    // 하단 스피너 표시 확인 (animate-spin 클래스로 판별)
    const spinner = canvasElement.querySelector('.animate-spin');
    await expect(spinner).toBeInTheDocument();

    // 끝 문구는 없어야 함
    const endMessage = canvas.queryByText('모든 둥지를 확인했어요!');
    await expect(endMessage).not.toBeInTheDocument();
  },
};

// 4. 날짜 포맷 확인
export const DateFormat: Story = {
  args: {
    nestsData: [
      {
        id: 99,
        title: '날짜 포맷 테스트',
        content: '날짜가 올바르게 포맷되는지 확인해요.',
        thumbnailUrl: '',
        createdAt: '2025-01-05T00:00:00Z',
        updatedAt: '2025-12-31T00:00:00Z',
        unlocked: true,
      },
    ],
    hasNextPage: false,
    isFetchingNextPage: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText(/작성 2025\.01\.05/)).toBeInTheDocument();
    await expect(canvas.getByText(/수정 2025\.12\.31/)).toBeInTheDocument();
  },
};