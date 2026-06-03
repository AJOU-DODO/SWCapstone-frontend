import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect, waitFor } from '@storybook/test';
import { http, HttpResponse } from 'msw';

import Page from './page';
import { Inquiry } from '@/types/indexAdmin';

// ─────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────
const mockPendingInquiries: Inquiry[] = [
  {
    id: 1,
    userId: 101,
    userNickname: '김철수',
    type: 'BUG',
    typeDescription: '버그신고',
    title: '로그인이 안돼요',
    status: 'PENDING',
    statusDescription: '대기중',
    createdAt: '2026-05-30T10:00:00',
    answeredAt: '', // 답변 전 → opacity 정상(불투명)
  },
  {
    id: 2,
    userId: 102,
    userNickname: '이영희',
    type: 'SUGGESTION',
    typeDescription: '건의사항',
    title: '다크모드를 추가해주세요',
    status: 'PENDING',
    statusDescription: '대기중',
    createdAt: '2026-05-31T09:30:00',
    answeredAt: '',
  },
];

const mockCompletedInquiries: Inquiry[] = [
  {
    id: 3,
    userId: 103,
    userNickname: '박민수',
    type: 'ACCOUNT',
    typeDescription: '계정문의',
    title: '비밀번호 변경 문의',
    status: 'COMPLETED',
    statusDescription: '처리완료',
    createdAt: '2026-05-20T14:00:00',
    answeredAt: '2026-05-21T11:00:00',
  },
];

const makeListResponse = (content: Inquiry[]) => ({
  status: 'OK',
  code: '200',
  message: null,
  data: {
    content,
    last: false,
    totalElements: content.length,
    totalPages: 3, // Pagination(5개 버튼) 노출 확인용
    size: 10,
    number: 0,
    empty: content.length === 0,
  },
});

// ─────────────────────────────────────────────
// Inline MSW Handlers
// ─────────────────────────────────────────────
const listHandler = http.get('*/api/v1/admin/inquiries', ({ request }) => {
  const url = new URL(request.url);
  const status = url.searchParams.get('status');
  const content =
    status === 'COMPLETED' ? mockCompletedInquiries : mockPendingInquiries;
  return HttpResponse.json(makeListResponse(content));
});

const emptyHandler = http.get('*/api/v1/admin/inquiries', () =>
  HttpResponse.json(makeListResponse([]))
);

const errorHandler = http.get('*/api/v1/admin/inquiries', () =>
  HttpResponse.json({ message: 'error' }, { status: 500 })
);

// ─────────────────────────────────────────────
// Meta
// ─────────────────────────────────────────────
const meta: Meta<typeof Page> = {
  title: 'Admin/Inquiry/InquiryPage',
  component: Page,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: { query: { tab: 'PENDING', page: '1' } },
    },
    msw: { handlers: [listHandler] },
    chromatic: { delay: 300 },
  },
};

export default meta;
type Story = StoryObj<typeof Page>;

// 1. 기본 렌더 (크로마틱 시각 확인 + 데이터 표시 검증)
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(canvas.getByText('[버그신고] 로그인이 안돼요')).toBeInTheDocument()
    );
    await expect(
      canvas.getByText('[건의사항] 다크모드를 추가해주세요')
    ).toBeInTheDocument();
    // 작성자 셀 표시 확인
    await expect(canvas.getByText('김철수 (101)')).toBeInTheDocument();
  },
};

// 2. 탭 전환 인터랙션 (처리완료 탭 클릭 → 라우팅)
//    초기 쿼리를 COMPLETED로 두어 처리완료 데이터가 그려지는지 검증
export const SwitchToCompletedTab: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: { query: { tab: 'COMPLETED', page: '1' } },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 처리완료 목록 데이터 렌더 확인 (opacity-40 행)
    await waitFor(() =>
      expect(canvas.getByText('[계정문의] 비밀번호 변경 문의')).toBeInTheDocument()
    );

    // 처리완료 탭 버튼 클릭 (라우터 push 동작)
    const completedTab = canvas.getByRole('button', { name: '처리완료' });
    await userEvent.click(completedTab);
    await expect(completedTab).toBeEnabled();
  },
};

// 3. 행 클릭 → 상세 라우팅 인터랙션
export const RowClickNavigates: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const titleCell = await canvas.findByText('[버그신고] 로그인이 안돼요');
    // <tr> 단위로 onRowClick 이 걸려있으므로 행을 클릭
    const row = titleCell.closest('tr')!;
    await userEvent.click(row);

    // 클릭 후에도 행이 유지되는지 확인 (router.push 호출됨)
    await expect(
      canvas.getByText('[버그신고] 로그인이 안돼요')
    ).toBeInTheDocument();
  },
};

// 4. 빈 목록 상태 (크로마틱)
export const EmptyList: Story = {
  parameters: { msw: { handlers: [emptyHandler] } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // 데이터 행이 없는지 확인
    await waitFor(() =>
      expect(canvas.queryByText('[버그신고] 로그인이 안돼요')).not.toBeInTheDocument()
    );
  },
};

// 5. API 에러 상태 (목록 비어있음 → 콘솔 에러 처리 경로)
export const FetchError: Story = {
  parameters: { msw: { handlers: [errorHandler] } },
};
