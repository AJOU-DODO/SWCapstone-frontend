import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { http, HttpResponse } from 'msw';
import { expect, screen, userEvent, waitFor, within } from '@storybook/test';
import Page from './page';
import { User } from '@/types/indexAdmin';

const mockUsers: User[] = [
  { 
    id: 1, 
    nickname: '홍길동', 
    email: 'hong@example.com',
    role: 'USER', 
    nestCount: 5, 
    commentCount: 10, 
    createdAt: '2026-05-01T00:00:00.000Z',
    sanctionedUntil: null,
    isSanctioned: false,
  },
  { 
    id: 2, 
    nickname: '김철수', 
    email: 'kim@example.com',
    role: 'USER', 
    nestCount: 3, 
    commentCount: 7, 
    createdAt: '2026-05-10T00:00:00.000Z',
    sanctionedUntil: null,
    isSanctioned: false,
  },
  { 
    id: 3, 
    nickname: '이영희', 
    email: 'lee@example.com',
    role: 'ADMIN', 
    nestCount: 0, 
    commentCount: 2, 
    createdAt: '2026-05-15T00:00:00.000Z',
    sanctionedUntil: '2026-06-01T00:00:00.000Z',
    isSanctioned: true,
  },
];

const defaultHandlers = [
  http.get('/api/v1/admin/users', () => {
    return HttpResponse.json({
      data: {
        content: mockUsers,
        totalPages: 3,
      },
    });
  }),
];

const advertiserRoleHandler = http.post('/api/v1/admin/ads/advertisers/:userId', () => {
  return HttpResponse.json({ status: 'OK', code: '200', message: null, data: null });
});

const meta: Meta<typeof Page> = {
  title: 'Admin/Users/ListPage',
  component: Page,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/admin/users',
        query: { page: '1', sort: 'createdAt,desc' },
      },
    },
    msw: { handlers: defaultHandlers },
  },
};

export default meta;
type Story = StoryObj<typeof Page>;

/**
 * 1. 기본 상태 - 유저 목록이 잘 렌더링되는지
 */
export const Default: Story = {};

/**
 * 2. 빈 목록 상태
 */
export const EmptyList: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/v1/admin/users', () => {
          return HttpResponse.json({
            data: { content: [], totalPages: 1 },
          });
        }),
      ],
    },
  },
};

/**
 * 3. 화이트리스트 관리 버튼 클릭 시 모달이 열리는지
 */
export const OpenWhitelistModal: Story = {
  parameters: {
    msw: {
      handlers: [
        ...defaultHandlers,
        http.get('/api/v1/admin/whitelists', () => {
          return HttpResponse.json({ data: [] });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const whitelistButton = canvas.getByRole('button', { name: '화이트리스트 관리' });
    await userEvent.click(whitelistButton);

    await expect(canvas.findByText('관리자 화이트리스트')).resolves.toBeInTheDocument();
  },
};

/**
 * 4. 정렬 버튼 클릭 인터랙션
 */
export const ClickSortButton: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const sortButton = canvas.getByRole('button', { name: '유저 ID' });
    await userEvent.click(sortButton);

    await expect(sortButton).toBeInTheDocument();
  },
};

/**
 * 5. API 에러 상태
 */
export const ApiError: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/v1/admin/users', () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
};

/**
 * 6. 유저 행 클릭 시 제재 모달이 열리는지
 */
export const OpenSanctionModal: Story = {
  parameters: {
    msw: {
      handlers: [
        ...defaultHandlers,
        http.post('/api/v1/admin/users/:userId/sanction', () => {
          return HttpResponse.json({ status: 'SUCCESS' });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const firstRow = await canvas.findByText('홍길동');
    await userEvent.click(firstRow);

    await expect(await screen.findByText('유저 제재 처리')).toBeInTheDocument();
  },
};

/**
 * 7. 제재 모달에서 닫기 클릭 시 모달이 닫히는지
 */
export const CloseSanctionModal: Story = {
  parameters: {
    msw: {
      handlers: defaultHandlers,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const firstRow = await canvas.findByText('홍길동');
    await userEvent.click(firstRow);

    await expect(await screen.findByText('유저 제재 처리')).toBeInTheDocument();

    const closeButton = await screen.findByRole('button', { name: '취소' });
    await userEvent.click(closeButton);

    await expect(screen.queryByText('유저 제재 처리')).not.toBeInTheDocument();
  },
};

/**
 * 8. 역할 셀 클릭 → 광고주 권한 부여 모달 열기
 */
export const OpenAdvertiserRoleModal: Story = {
  parameters: {
    msw: {
      handlers: [...defaultHandlers, advertiserRoleHandler],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);

    await canvas.findByText('홍길동');

    const roleCell = canvas.getAllByText('USER')[0];
    await userEvent.click(roleCell);

    await waitFor(() =>
      expect(body.getByText('광고주 권한 부여')).toBeInTheDocument()
    );
    await expect(
      body.getByPlaceholderText('부여할 광고 게시글 수를 입력하세요 (숫자)')
    ).toBeInTheDocument();
  },
};

/**
 * 9. 광고주 권한 부여 모달 — 취소 버튼으로 닫기
 */
export const CloseAdvertiserRoleModal: Story = {
  parameters: {
    msw: {
      handlers: [...defaultHandlers, advertiserRoleHandler],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);

    await canvas.findByText('홍길동');

    const roleCell = canvas.getAllByText('USER')[0];
    await userEvent.click(roleCell);

    await waitFor(() =>
      expect(body.getByText('광고주 권한 부여')).toBeInTheDocument()
    );

    await userEvent.click(body.getByRole('button', { name: '취소' }));

    await waitFor(() =>
      expect(body.queryByText('광고주 권한 부여')).not.toBeInTheDocument()
    );
  },
};

/**
 * 10. 광고주 권한 부여 모달 — 폼 입력 후 제출
 *     adCount === 0 이면 권한부여 버튼 disabled, 입력 후 활성화 확인
 */
export const SubmitAdvertiserRoleModal: Story = {
  parameters: {
    msw: {
      handlers: [...defaultHandlers, advertiserRoleHandler],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);

    await canvas.findByText('홍길동');

    const roleCell = canvas.getAllByText('USER')[0];
    await userEvent.click(roleCell);

    await waitFor(() =>
      expect(body.getByText('광고주 권한 부여')).toBeInTheDocument()
    );

    const submitBtn = body.getByRole('button', { name: '권한부여' });
    await expect(submitBtn).toBeDisabled();

    const countInput = body.getByPlaceholderText('부여할 광고 게시글 수를 입력하세요 (숫자)');
    await userEvent.clear(countInput);
    await userEvent.type(countInput, '3');

    const dateInput = canvasElement.ownerDocument.querySelector<HTMLInputElement>(
      'input[type="date"]'
    )!;
    await userEvent.type(dateInput, '2027-12-31');

    await waitFor(() => expect(submitBtn).toBeEnabled());

    await userEvent.click(submitBtn);
    await waitFor(() =>
      expect(body.queryByText('광고주 권한 부여')).not.toBeInTheDocument()
    );
  },
};