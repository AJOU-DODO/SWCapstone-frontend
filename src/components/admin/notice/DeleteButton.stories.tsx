import type { Meta, StoryObj } from '@storybook/react-vite';
import { http, HttpResponse } from 'msw';
import { expect, userEvent, within } from '@storybook/test';
import DeleteButton from './DeleteButton';

const meta: Meta<typeof DeleteButton> = {
  title: 'Admin/Notices/DeleteButton',
  component: DeleteButton,
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/admin/notices/1',
      },
    },
  },
  args: {
    id: 1,
  },
};

export default meta;
type Story = StoryObj<typeof DeleteButton>;

/**
 * 1. 기본 상태
 */
export const Default: Story = {};

/**
 * 2. 삭제 버튼 클릭 시 모달이 열리는지
 */
export const ModalOpen: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const deleteButton = canvas.getByRole('button', { name: '삭제하기' });
    await userEvent.click(deleteButton);

    // 모달이 열렸는지 확인
    await expect(canvas.getByText('정말 삭제하시겠습니까?')).toBeInTheDocument();
    await expect(canvas.getByText('삭제된 공지사항은 다시 복구할 수 없습니다.')).toBeInTheDocument();
  },
};

/**
 * 3. 모달에서 취소 버튼 클릭 시 모달이 닫히는지
 */
export const ModalClose: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 모달 열기
    await userEvent.click(canvas.getByRole('button', { name: '삭제하기' }));
    await expect(canvas.getByText('정말 삭제하시겠습니까?')).toBeInTheDocument();

    // 취소 버튼 클릭
    await userEvent.click(canvas.getByRole('button', { name: '취소' }));
    await expect(canvas.queryByText('정말 삭제하시겠습니까?')).not.toBeInTheDocument();
  },
};

/**
 * 4. 삭제 성공
 */
export const DeleteSuccess: Story = {
  parameters: {
    msw: {
      handlers: [
        http.delete('/api/v1/admin/notices/1', () => {
          return HttpResponse.json({ status: 'SUCCESS' });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 모달 열기
    await userEvent.click(canvas.getByRole('button', { name: '삭제하기' }));

    // 삭제 버튼 클릭
    await userEvent.click(canvas.getByRole('button', { name: '삭제' }));
  },
};

/**
 * 5. 삭제 실패
 */
export const DeleteError: Story = {
  parameters: {
    msw: {
      handlers: [
        http.delete('/api/v1/admin/notices/1', () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 모달 열기
    await userEvent.click(canvas.getByRole('button', { name: '삭제하기' }));

    // 삭제 버튼 클릭
    await userEvent.click(canvas.getByRole('button', { name: '삭제' }));

    // 삭제 버튼이 다시 활성화되는지 확인
    await expect(canvas.getByRole('button', { name: '삭제' })).not.toBeDisabled();
  },
};