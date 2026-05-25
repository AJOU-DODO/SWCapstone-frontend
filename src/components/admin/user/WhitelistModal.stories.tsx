import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { http, HttpResponse } from 'msw';
import { expect, screen, userEvent, within } from '@storybook/test';
import WhitelistModal from './WhitelistModal';
import { Whitelists } from '@/types/indexAdmin';

const mockWhitelistData: Whitelists[] = [
  { id: 1, email: 'user1@example.com', remark: '첫 번째 테스트 유저', createdAt: '2026-05-01T00:00:00.000Z' },
  { id: 2, email: 'user2@example.com', remark: '두 번째 테스트 유저', createdAt: '2026-05-10T00:00:00.000Z' },
  { id: 3, email: 'user3@example.com', remark: '', createdAt: '2026-05-25T00:00:00.000Z' },
];

const defaultHandlers = [
  http.get('/api/v1/admin/whitelists', () => {
    return HttpResponse.json({ data: mockWhitelistData });
  }),
  http.delete('/api/v1/admin/whitelists/:id', () => {
    return HttpResponse.json({ status: 'SUCCESS' });
  }),
];

const meta: Meta<typeof WhitelistModal> = {
  title: 'Admin/WhitelistModal',
  component: WhitelistModal,
  parameters: {
    layout: 'centered',
    msw: { handlers: defaultHandlers },
  },
  args: {
    isOpen: true,
    onClose: () => console.log('모달 닫힘'),
  },
};

export default meta;
type Story = StoryObj<typeof WhitelistModal>;

/**
 * 1. 기본 상태 - 목데이터 3개가 잘 렌더링되는지
 */
export const DefaultList: Story = {};

/**
 * 2. 빈 목록 상태
 */
export const EmptyList: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/v1/admin/whitelists', () => {
          return HttpResponse.json({ data: [] });
        }),
      ],
    },
  },
};

/**
 * 3. + 버튼 클릭 시 추가 모달이 열리는지
 */
export const OpenAddModal: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const addButton = canvas.getByRole('button', { name: '+' });
    await userEvent.click(addButton);

    const addModalTitle = await screen.findByText('화이트리스트 추가');
    await expect(addModalTitle).toBeInTheDocument();
  },
};

/**
 * 4. 삭제 버튼 클릭 시 삭제 확인 모달이 열리는지
 */
export const OpenDeleteConfirm: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 목데이터 로드 대기
    const deleteButtons = await canvas.findAllByRole('button', { name: '삭제' });
    await userEvent.click(deleteButtons[0]);

    const confirmTitle = await screen.findByText('정말 삭제하시겠습니까?');
    await expect(confirmTitle).toBeInTheDocument();
  },
};

/**
 * 5. 삭제 확인 모달에서 취소 클릭 시 모달이 닫히는지
 */
export const CloseDeleteConfirm: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 삭제 버튼 클릭
    const deleteButtons = await canvas.findAllByRole('button', { name: '삭제' });
    await userEvent.click(deleteButtons[0]);

    // 삭제 확인 모달 열렸는지 확인
    await expect(await screen.findByText('정말 삭제하시겠습니까?')).toBeInTheDocument();

    // 취소 클릭
    const cancelButton = await screen.findByRole('button', { name: '취소' });
    await userEvent.click(cancelButton);

    // 모달 닫혔는지 확인
    await expect(screen.queryByText('정말 삭제하시겠습니까?')).not.toBeInTheDocument();
  },
};