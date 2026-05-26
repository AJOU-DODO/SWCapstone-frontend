// CategoryPage.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, waitFor, expect, fireEvent } from '@storybook/test';
import { http, HttpResponse } from 'msw';
import Page from './page';

// ────────────────────────────────────────────────
// Mock 데이터
// ────────────────────────────────────────────────
const mockCategories = [
  { id: 1, name: '산책', nestCount: 12, sortOrder: 0, createdAt: '2024-01-01T00:00:00Z', deletedAt: null },
  { id: 2, name: '언덕', nestCount: 45, sortOrder: 1, createdAt: '2024-01-02T00:00:00Z', deletedAt: null },
  { id: 3, name: '식당', nestCount: 8, sortOrder: 2, createdAt: '2024-01-03T00:00:00Z', deletedAt: null },
  { id: 4, name: '휴식', nestCount: 23, sortOrder: 3, createdAt: '2024-01-04T00:00:00Z', deletedAt: null },
  { id: 5, name: '공원', nestCount: 5, sortOrder: 4, createdAt: '2024-02-01T00:00:00Z', deletedAt: null },
  { id: 6, name: '조깅', nestCount: 17, sortOrder: 5, createdAt: '2024-05-01T00:00:00Z', deletedAt: null },
];

const mockCategoriesWithDeleted = [
  ...mockCategories,
  { id: 7, name: '삭제된카테고리', nestCount: 0, sortOrder: 6, createdAt: '2024-09-01T00:00:00Z', deletedAt: '2024-01-01T00:00:00Z' },
];

const getAllCards = (canvasElement: HTMLElement) =>
  Array.from(canvasElement.querySelectorAll<HTMLElement>('div.rounded-xl.shadow-sm.min-w-\\[240px\\]'));

// ────────────────────────────────────────────────
// MSW 핸들러
// ────────────────────────────────────────────────
const handlers = {
  getCategories: (categories = mockCategories) =>
    http.get('/api/v1/admin/categories', () =>
      HttpResponse.json({ data: categories })
    ),
  getCategoriesWithDeleted: (categories = mockCategoriesWithDeleted) =>
    http.get('/api/v1/admin/categories', () =>
      HttpResponse.json({ data: categories })
    ),
  updateOrder: (status = 200) =>
    http.put('/api/v1/admin/categories/orders', async () =>
      status === 200
        ? HttpResponse.json({ success: true })
        : new HttpResponse(null, { status: 500 })
    ),
  createCategory: () =>
    http.post('/api/v1/admin/categories', async ({ request }) => {
      const body = await request.json() as { name: string };
      return HttpResponse.json({ id: 99, name: body.name, nestCount: 0, sortOrder: 99, deletedAt: null });
    }),
};

// ────────────────────────────────────────────────
// Meta
// ────────────────────────────────────────────────
const meta: Meta<typeof Page> = {
  title: 'Admin/Category/Page',
  component: Page,
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        searchParams: { sort: 'sortOrder,desc', includeDeleted: 'true' },
      },
    },
    msw: {
      handlers: [handlers.getCategories(), handlers.updateOrder()],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Page>;

// ────────────────────────────────────────────────
// 1. 기본 렌더링
// ────────────────────────────────────────────────
export const Default: Story = {
  name: '기본 - 카테고리 목록',
  parameters: {
    msw: { handlers: [handlers.getCategories()] },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      expect(canvas.getByText('산책')).toBeInTheDocument();
      expect(canvas.getByText('언덕')).toBeInTheDocument();
      expect(canvas.getByText('식당')).toBeInTheDocument();
    });
  },
};

// ────────────────────────────────────────────────
// 2. 빈 목록
// ────────────────────────────────────────────────
export const Empty: Story = {
  name: '빈 카테고리 목록',
  parameters: {
    msw: { handlers: [handlers.getCategories([])] },
  },
};

// ────────────────────────────────────────────────
// 3. 삭제된 카테고리 포함
// ────────────────────────────────────────────────
export const WithDeleted: Story = {
  name: '삭제된 카테고리 포함',
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        searchParams: { sort: 'sortOrder,desc', includeDeleted: 'true' },
      },
    },
    msw: { handlers: [handlers.getCategoriesWithDeleted()] },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      expect(canvas.getByText('삭제된카테고리')).toBeInTheDocument();
    });
  },
};

// ────────────────────────────────────────────────
// 4. 게시글 수 정렬
// ────────────────────────────────────────────────
export const SortByNestCount: Story = {
  name: '게시글 수 정렬',
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        searchParams: { sort: 'nestCount,desc', includeDeleted: 'true' },
      },
    },
    msw: {
      handlers: [
        handlers.getCategories(
          [...mockCategories].sort((a, b) => b.nestCount - a.nestCount)
        ),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      expect(canvas.queryByText('순서 저장')).not.toBeInTheDocument();
    });
  },
};

// ────────────────────────────────────────────────
// 5. 드래그 후 저장 버튼 노출 (isDirty 상태)
// ────────────────────────────────────────────────
export const AfterDrag: Story = {
  name: '드래그 후 - 저장/취소 버튼 노출',
  parameters: {
    msw: { handlers: [handlers.getCategories(), handlers.updateOrder()] },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 카드 로딩 대기
    await waitFor(() => {
      expect(canvas.getByText('산책')).toBeInTheDocument();
    });

    const cards = getAllCards(canvasElement);
    const source = cards[0];
    const target = cards[2];

    // 드래그 시뮬레이션
    const sourceRect = source.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    await userEvent.pointer([
      { keys: '[MouseLeft>]', target: source, coords: { x: sourceRect.x + 10, y: sourceRect.y + 10 } },
      { target: target, coords: { x: targetRect.x + 10, y: targetRect.y + 10 } },
      { keys: '[/MouseLeft]' },
    ]);
  },
};

// ────────────────────────────────────────────────
// 6. 저장 성공
// ────────────────────────────────────────────────
export const SaveSuccess: Story = {
  name: '순서 저장 성공',
  parameters: {
    msw: { handlers: [handlers.getCategories(), handlers.updateOrder(200)] },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => expect(canvas.getByText('산책')).toBeInTheDocument());

    const cards = getAllCards(canvasElement);
    const sourceRect = cards[0].getBoundingClientRect();
    const targetRect = cards[1].getBoundingClientRect();

    await userEvent.pointer([
      { keys: '[MouseLeft>]', target: cards[0], coords: { x: sourceRect.x + 10, y: sourceRect.y + 10 } },
      { target: cards[1], coords: { x: targetRect.x + 10, y: targetRect.y + 10 } },
      { keys: '[/MouseLeft]' },
    ]);

    // 저장 후 버튼 사라짐 확인
    await waitFor(() => {
      expect(canvas.queryByText('순서 저장')).not.toBeInTheDocument();
      expect(canvas.queryByText('취소')).not.toBeInTheDocument();
    });
  },
};

// ────────────────────────────────────────────────
// 7. 저장 실패 → 롤백
// ────────────────────────────────────────────────
export const SaveFailRollback: Story = {
  name: '순서 저장 실패 - 롤백',
  parameters: {
    msw: { handlers: [handlers.getCategories(), handlers.updateOrder(500)] },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => expect(canvas.getByText('산책')).toBeInTheDocument());

    const cards = getAllCards(canvasElement);
    const sourceRect = cards[0].getBoundingClientRect();
    const targetRect = cards[2].getBoundingClientRect();

    await userEvent.pointer([
      { keys: '[MouseLeft>]', target: cards[0], coords: { x: sourceRect.x + 10, y: sourceRect.y + 10 } },
      { target: cards[2], coords: { x: targetRect.x + 10, y: targetRect.y + 10 } },
      { keys: '[/MouseLeft]' },
    ]);

    // 실패 시 원래 순서로 롤백 확인
    await waitFor(() => {
      expect(getAllCards(canvasElement)[0]).toHaveTextContent('산책');
    });
  },
};

// ────────────────────────────────────────────────
// 8. 취소 → 원복
// ────────────────────────────────────────────────
export const CancelOrder: Story = {
  name: '순서 변경 취소 - 원복',
  parameters: {
    msw: { handlers: [handlers.getCategories()] },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => expect(canvas.getByText('산책')).toBeInTheDocument());

    const cards = getAllCards(canvasElement);
    const sourceRect = cards[0].getBoundingClientRect();
    const targetRect = cards[2].getBoundingClientRect();

    await userEvent.pointer([
      { keys: '[MouseLeft>]', target: cards[0], coords: { x: sourceRect.x + 10, y: sourceRect.y + 10 } },
      { target: cards[2], coords: { x: targetRect.x + 10, y: targetRect.y + 10 } },
      { keys: '[/MouseLeft]' },
    ]);

    // 원래 순서로 복원 확인
    await waitFor(() => {
      expect(getAllCards(canvasElement)[0]).toHaveTextContent('산책');
    });
  },
};

// ────────────────────────────────────────────────
// 9. 생성 모달 열기/닫기
// ────────────────────────────────────────────────
export const CreateModalOpen: Story = {
  name: '카테고리 생성 모달 - 열기',
  parameters: {
    msw: { handlers: [handlers.getCategories()] },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => expect(canvas.getByText('산책')).toBeInTheDocument());

    // + 버튼 클릭
    await userEvent.click(canvas.getByRole('button', { name: '+' }));
  },
};

export const CreateModalClose: Story = {
  name: '카테고리 생성 모달 - 닫기',
  parameters: {
    msw: { handlers: [handlers.getCategories()] },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => expect(canvas.getByText('산책')).toBeInTheDocument());

    await userEvent.click(canvas.getByRole('button', { name: '+' }));

    // ESC로 닫기
    await userEvent.keyboard('{Escape}');
  },
};

// ────────────────────────────────────────────────
// 10. 저장 중 상태 (로딩)
// ────────────────────────────────────────────────
export const SavingState: Story = {
  name: '저장 중 상태',
  parameters: {
    msw: {
      handlers: [
        handlers.getCategories(),
        // 응답을 지연시켜 저장 중 UI 확인
        http.put('/api/v1/admin/categories/orders', async () => {
          await new Promise((r) => setTimeout(r, 3000));
          return HttpResponse.json({ success: true });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => expect(canvas.getByText('산책')).toBeInTheDocument());

    const cards = getAllCards(canvasElement);
    const sourceRect = cards[0].getBoundingClientRect();
    const targetRect = cards[1].getBoundingClientRect();

    await userEvent.pointer([
      { keys: '[MouseLeft>]', target: cards[0], coords: { x: sourceRect.x + 10, y: sourceRect.y + 10 } },
      { target: cards[1], coords: { x: targetRect.x + 10, y: targetRect.y + 10 } },
      { keys: '[/MouseLeft]' },
    ]);
  },
};