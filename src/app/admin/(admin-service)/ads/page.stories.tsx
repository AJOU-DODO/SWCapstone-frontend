import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, userEvent, expect, waitFor } from '@storybook/test';
import { http, HttpResponse } from 'msw';

import Page from './page';
import { Advertisement, PendingAdvertisement } from '@/types/indexAdmin';

// ─────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────
const mockAdvertisements: Advertisement[] = [
  {
    id: 1,
    title: '스타벅스 강남점 광고',
    advertiserNickname: '스타벅스코리아',
    createdAt: '2026-05-01T10:00:00',
    expiredAt: '2026-07-01T10:00:00',
    deletedAt: '',
    priorityScore: 5,
    impressions: 1200,
    clicks: 340,
  },
  {
    id: 2,
    title: '맥도날드 신촌점 이벤트',
    advertiserNickname: '맥도날드',
    createdAt: '2026-05-10T09:00:00',
    expiredAt: '2026-06-30T09:00:00',
    deletedAt: '',
    priorityScore: 3,
    impressions: 800,
    clicks: 120,
  },
];

const mockDeletedAdvertisements: Advertisement[] = [
  {
    id: 3,
    title: '삭제된 광고',
    advertiserNickname: '테스트광고주',
    createdAt: '2026-04-01T10:00:00',
    expiredAt: '2026-05-01T10:00:00',
    deletedAt: '2026-05-02T10:00:00',
    priorityScore: 1,
    impressions: 200,
    clicks: 10,
  },
];

const mockPendingAdvertisements: PendingAdvertisement[] = [
  {
    id: 10,
    advertiserId: 201,
    advertiserNickname: '버거킹',
    title: '버거킹 홍대점 오픈 기념 이벤트',
    content: '홍대 신규 매장 오픈을 기념하여 특별 할인 이벤트를 진행합니다. 많은 관심 부탁드립니다.',
    latitude: 37.5563,
    longitude: 126.9238,
    unlockRadius: 100,
    imageUrls: ['https://picsum.photos/seed/ad1/400/300', 'https://picsum.photos/seed/ad2/400/300'],
    categoryIds: [1, 2],
    categoryNames: ['음식', '이벤트'],
    status: 'PENDING',
    rejectReason: null,
    createdAt: '2026-06-01T10:00:00',
  },
  {
    id: 11,
    advertiserId: 202,
    advertiserNickname: '올리브영',
    title: '올리브영 여름 세일',
    content: '여름 맞이 스킨케어 제품 최대 50% 할인.',
    latitude: 37.4979,
    longitude: 127.0276,
    unlockRadius: 150,
    imageUrls: [],
    categoryIds: [3],
    categoryNames: ['뷰티'],
    status: 'PENDING',
    rejectReason: null,
    createdAt: '2026-06-02T11:00:00',
  },
];

// ─────────────────────────────────────────────
// Response Factories
// ─────────────────────────────────────────────
const makePageResponse = (content: Advertisement[]) => ({
  status: 'OK',
  code: '200',
  message: null,
  data: {
    content,
    last: false,
    totalElements: content.length,
    totalPages: 3,
    size: 10,
    number: 0,
    empty: content.length === 0,
  },
});

const makePendingResponse = (content: PendingAdvertisement[]) => ({
  status: 'OK',
  code: '200',
  message: null,
  data: content,
});

const makeAdvertiserResponse = () => ({
  status: 'OK',
  code: '200',
  message: null,
  data: {
    content: [
      {
        userId: 201,
        email: 'bk@example.com',
        nickname: '버거킹광고주',
        allowedAdCount: 3,
        expiredAt: '2027-01-01T00:00:00',
        createdAt: '2026-01-01T00:00:00',
      },
    ],
    totalPages: 1,
  },
});

// ─────────────────────────────────────────────
// MSW Handlers
// ─────────────────────────────────────────────
const activeAdsHandler = http.get('*/api/v1/admin/ads/nests', ({ request }) => {
  const url = new URL(request.url);
  const status = url.searchParams.get('status');
  const content = status === 'DELETED' ? mockDeletedAdvertisements : mockAdvertisements;
  return HttpResponse.json(makePageResponse(content));
});

const pendingAdsHandler = http.get('*/api/v1/admin/ads/proposals', () =>
  HttpResponse.json(makePendingResponse(mockPendingAdvertisements))
);

const advertisersHandler = http.get('*/api/v1/admin/ads/advertisers', () =>
  HttpResponse.json(makeAdvertiserResponse())
);

const emptyActiveHandler = http.get('*/api/v1/admin/ads/nests', () =>
  HttpResponse.json(makePageResponse([]))
);

const emptyPendingHandler = http.get('*/api/v1/admin/ads/proposals', () =>
  HttpResponse.json(makePendingResponse([]))
);

const errorActiveHandler = http.get('*/api/v1/admin/ads/nests', () =>
  HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 })
);

const defaultHandlers = [activeAdsHandler, pendingAdsHandler, advertisersHandler];

// ─────────────────────────────────────────────
// Meta
// ─────────────────────────────────────────────
const meta: Meta<typeof Page> = {
  title: 'Admin/Advertisement/AdvertisementPage',
  component: Page,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: { query: { tab: 'APPROVED', page: '1', includeDeleted: 'ACTIVE' } },
    },
    msw: { handlers: defaultHandlers },
    chromatic: { delay: 300 },
  },
};

export default meta;
type Story = StoryObj<typeof Page>;

// ─────────────────────────────────────────────
// Stories
// ─────────────────────────────────────────────

// 1. APPROVED 탭 기본 렌더
export const ApprovedTab: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(canvas.getByText('스타벅스 강남점 광고')).toBeInTheDocument()
    );
    await expect(canvas.getByText('맥도날드 신촌점 이벤트')).toBeInTheDocument();
    await expect(canvas.getByText('스타벅스코리아')).toBeInTheDocument();
  },
};

// 2. PENDING 탭 카드 리스트 렌더
export const PendingTab: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: { query: { tab: 'PENDING', page: '1' } },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(canvas.getByText('버거킹 홍대점 오픈 기념 이벤트')).toBeInTheDocument()
    );
    await expect(canvas.getByText('올리브영 여름 세일')).toBeInTheDocument();
  },
};

// 3. 탭 전환 버튼 클릭
export const SwitchToPendingTab: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(canvas.getByText('스타벅스 강남점 광고')).toBeInTheDocument()
    );
    const pendingTabBtn = canvas.getByRole('button', { name: '승인 요청 광고' });
    await userEvent.click(pendingTabBtn);
    await expect(pendingTabBtn).toBeEnabled();
  },
};

// 4. 테이블 행 클릭 → router.push
export const RowClickNavigates: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const titleCell = await canvas.findByText('스타벅스 강남점 광고');
    await userEvent.click(titleCell.closest('tr')!);
    await expect(canvas.getByText('스타벅스 강남점 광고')).toBeInTheDocument();
  },
};

// 5. 광고주 리스트 모달 — 열기 + 데이터 확인
//    fixed 모달은 document.body에 렌더되므로 within(document.body)로 검증
//    닫기는 AdvertiserList에 별도 버튼이 없으므로 열림 확인까지만 검증
export const AdvertiserListModal: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);

    await waitFor(() =>
      expect(canvas.getByText('스타벅스 강남점 광고')).toBeInTheDocument()
    );

    await userEvent.click(canvas.getByRole('button', { name: '광고주 리스트' }));

    // 모달 헤더 확인
    await waitFor(() =>
      expect(body.getByText('승인된 광고주 목록')).toBeInTheDocument()
    );

    // 광고주 데이터 확인 — nickname을 카드 데이터와 겹치지 않게 '버거킹광고주'로 설정
    await waitFor(() =>
      expect(body.getByText('버거킹광고주')).toBeInTheDocument()
    );
    await expect(body.getByText('bk@example.com')).toBeInTheDocument();
  },
};

// 6. AdRequestCard 클릭 → AdRequestDetailModal 열기/닫기
//    fixed 모달이므로 within(document.body)로 검증
export const PendingAdDetailModal: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: { query: { tab: 'PENDING', page: '1' } },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);

    // 카드 클릭
    const card = await canvas.findByText('버거킹 홍대점 오픈 기념 이벤트');
    await userEvent.click(card);

    // 모달에만 있는 메타 레이블로 열림 확인 ('버거킹'은 카드에도 있어 중복)
    await waitFor(() =>
      expect(body.getByText('해금 반경:')).toBeInTheDocument()
    );
    await expect(body.getByText('음식')).toBeInTheDocument();

    // ✕ 버튼으로 닫기
    await userEvent.click(body.getByRole('button', { name: '✕' }));
    await waitFor(() =>
      expect(body.queryByText('해금 반경:')).not.toBeInTheDocument()
    );
  },
};

// 7. 삭제된 광고 목록 렌더 (includeDeleted=DELETED)
export const DeletedAdsView: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: { query: { tab: 'APPROVED', page: '1', includeDeleted: 'DELETED' } },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(canvas.getByText('삭제된 광고')).toBeInTheDocument()
    );
    await expect(canvas.getByText('테스트광고주')).toBeInTheDocument();
  },
};

// 8. APPROVED 탭 빈 목록
export const EmptyApprovedList: Story = {
  parameters: {
    msw: { handlers: [emptyActiveHandler, pendingAdsHandler, advertisersHandler] },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(canvas.queryByText('스타벅스 강남점 광고')).not.toBeInTheDocument()
    );
  },
};

// 9. PENDING 탭 빈 목록
export const EmptyPendingList: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: { query: { tab: 'PENDING', page: '1' } },
    },
    msw: { handlers: [activeAdsHandler, emptyPendingHandler, advertisersHandler] },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(canvas.queryByText('버거킹 홍대점 오픈 기념 이벤트')).not.toBeInTheDocument()
    );
  },
};

// 10. API 에러 상태
export const FetchError: Story = {
  parameters: {
    msw: { handlers: [errorActiveHandler, pendingAdsHandler, advertisersHandler] },
  },
};