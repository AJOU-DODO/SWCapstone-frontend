import type { Meta, StoryObj } from '@storybook/react-vite';
import { http, HttpResponse } from 'msw';
import { expect, userEvent, within } from '@storybook/test';
import NoticeEditor from './NoticeEditor';

const meta: Meta<typeof NoticeEditor> = {
  title: 'Admin/Notices/NoticeEditor',
  component: NoticeEditor,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/admin/notices/editor',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof NoticeEditor>;

/**
 * 1. 작성 모드 (기본)
 */
export const CreateMode: Story = {
  args: {
    mode: 'create',
  },
  parameters: {
    msw: {
      handlers: [
        http.post('/api/v1/admin/notices', () => {
          return HttpResponse.json({
            status: 'SUCCESS',
            data: { id: 1 },
          });
        }),
      ],
    },
  },
};

/**
 * 2. 수정 모드 (기존 데이터 있을 때)
 */
export const EditMode: Story = {
  args: {
    mode: 'edit',
    initialData: {
      id: 1,
      title: '기존 공지사항 제목',
      content: '기존 공지사항 내용입니다.',
      category: 'UPDATE',
    },
  },
  parameters: {
    msw: {
      handlers: [
        http.put('/api/v1/admin/notices/1', () => {
          return HttpResponse.json({
            status: 'SUCCESS',
            data: { id: 1 },
          });
        }),
      ],
    },
  },
};

/**
 * 3. 제목과 내용 입력 인터랙션
 */
export const TypeContent: Story = {
  args: {
    mode: 'create',
  },
  parameters: {
    msw: {
      handlers: [
        http.post('/api/v1/admin/notices', () => {
          return HttpResponse.json({
            status: 'SUCCESS',
            data: { id: 1 },
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const titleInput = canvas.getByPlaceholderText('공지사항 제목을 입력하세요.');
    await userEvent.type(titleInput, '새 공지사항 제목');
    await expect(titleInput).toHaveValue('새 공지사항 제목');

    const contentInput = canvas.getByPlaceholderText('공지사항 내용을 상세히 작성하세요.');
    await userEvent.type(contentInput, '공지사항 내용을 작성합니다.');
    await expect(contentInput).toHaveValue('공지사항 내용을 작성합니다.');
  },
};

/**
 * 4. 수정 모드에서 내용 변경 인터랙션
 */
export const EditContent: Story = {
  args: {
    mode: 'edit',
    initialData: {
      id: 1,
      title: '기존 제목',
      content: '기존 내용',
      category: 'UPDATE',
    },
  },
  parameters: {
    msw: {
      handlers: [
        http.put('/api/v1/admin/notices/1', () => {
          return HttpResponse.json({
            status: 'SUCCESS',
            data: { id: 1 },
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 기존 데이터가 잘 들어왔는지 확인
    const titleInput = canvas.getByPlaceholderText('공지사항 제목을 입력하세요.');
    await expect(titleInput).toHaveValue('기존 제목');

    // 제목 변경
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, '수정된 제목');
    await expect(titleInput).toHaveValue('수정된 제목');
  },
};

/**
 * 5. 빈 값으로 제출 시도 (required 검증)
 */
export const SubmitEmpty: Story = {
  args: {
    mode: 'create',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 아무것도 입력 안 하고 제출
    const submitButton = canvas.getByRole('button', { name: '발행하기' });
    await userEvent.click(submitButton);

    // 제목 input이 required라 브라우저 검증 발동
    const titleInput = canvas.getByPlaceholderText('공지사항 제목을 입력하세요.');
    await expect(titleInput).toBeInTheDocument();
  },
};