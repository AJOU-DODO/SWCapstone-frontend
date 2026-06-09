import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, expect } from '@storybook/test';
import type { MyComment } from "@/types/indexMypage";
import MyCommentList from './MyCommentList';

const meta: Meta<typeof MyCommentList> = {
  title: 'Webview/MyCommentList',
  component: MyCommentList,
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
type Story = StoryObj<typeof MyCommentList>;

// ─── Mock Data ───────────────────────────────────────────────

const mockComments: MyComment[] = [
  {
    id: 1,
    nestId: 10,
    nestTitle: '성수동 카페 탐방',
    content: '저도 거기 가봤는데 정말 좋더라고요!',
    authorNickname: '도도새',
    createdAt: '2025-03-02T10:00:00Z',
  },
  {
    id: 2,
    nestId: 11,
    nestTitle: '한강 피크닉',
    content: '한강 피크닉 최고죠 ㅎㅎ',
    authorNickname: '도도새',
    createdAt: '2025-04-11T09:00:00Z',
  },
  {
    id: 3,
    nestId: 12,
    nestTitle: '제주도 여행기',
    content: '제주도 언제 또 가고싶다.',
    authorNickname: '도도새',
    createdAt: '2025-05-01T08:00:00Z',
  },
];

// ─── Stories ─────────────────────────────────────────────────

// 1. 빈 상태 (comments.length === 0 이면 끝 문구도 안 나옴)
export const Empty: Story = {
  args: {
    commentData: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 카드 없음
    const cards = canvas.queryAllByRole('link');
    await expect(cards).toHaveLength(0);

    // 끝 문구도 없음
    const endMessage = canvas.queryByText('모든 댓글을 확인했어요!');
    await expect(endMessage).not.toBeInTheDocument();

    // 스피너 없음
    const spinner = canvasElement.querySelector('.animate-spin');
    await expect(spinner).not.toBeInTheDocument();
  },
};

// 2. 데이터 있음 + 마지막 페이지
export const WithComments: Story = {
  args: {
    commentData: mockComments,
    hasNextPage: false,
    isFetchingNextPage: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 카드 개수 확인
    const cards = await canvas.findAllByRole('link');
    await expect(cards).toHaveLength(mockComments.length);

    // 댓글 내용 확인
    await expect(canvas.getByText('저도 거기 가봤는데 정말 좋더라고요!')).toBeInTheDocument();

    // 둥지 제목 + 닉네임 확인
    await expect(canvas.getByText(/성수동 카페 탐방 • 도도새/)).toBeInTheDocument();

    // 끝 문구 확인
    await expect(canvas.getByText('모든 댓글을 확인했어요!')).toBeInTheDocument();

    // 스피너 없음
    const spinner = canvasElement.querySelector('.animate-spin');
    await expect(spinner).not.toBeInTheDocument();
  },
};

// 3. 다음 페이지 로딩 중
export const LoadingMore: Story = {
  args: {
    commentData: mockComments,
    hasNextPage: true,
    isFetchingNextPage: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 기존 카드 정상 렌더링
    const cards = await canvas.findAllByRole('link');
    await expect(cards).toHaveLength(mockComments.length);

    // 스피너 표시
    const spinner = canvasElement.querySelector('.animate-spin');
    await expect(spinner).toBeInTheDocument();

    // 끝 문구 없음
    const endMessage = canvas.queryByText('모든 댓글을 확인했어요!');
    await expect(endMessage).not.toBeInTheDocument();
  },
};

// 4. 날짜 포맷 확인
export const DateFormat: Story = {
  args: {
    commentData: [
      {
        id: 99,
        nestId: 99,
        nestTitle: '날짜 테스트 둥지',
        content: '날짜 포맷이 올바른지 확인해요.',
        authorNickname: '도도새',
        createdAt: '2025-01-05T00:00:00Z',
      },
    ],
    hasNextPage: false,
    isFetchingNextPage: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText(/작성 2025\.01\.05/)).toBeInTheDocument();
  },
};