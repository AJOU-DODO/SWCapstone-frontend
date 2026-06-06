import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, userEvent, expect, waitFor } from '@storybook/test';
import { http, HttpResponse } from 'msw';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import AdDetailHeader from '@/components/admin/advertise/AdDetailHeader';
import NestBody from '@/components/admin/nest/NestDetail/NestBody';
import { AdNestDetailHeader, NestDetailBody } from '@/types/indexAdmin';

// ─────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────
const mockHeader: AdNestDetailHeader = {
  authorId: 1,
  profileImageUrl: 'https://picsum.photos/seed/profile/50/50',
  nestId: 42,
  authorNickname: '스타벅스코리아',
  createdAt: '2026-05-01T10:00:00',
  latitude: 37.4979,
  longitude: 127.0276,
  deleted: false,
};

const mockHeaderDeleted: AdNestDetailHeader = {
  ...mockHeader,
  deleted: true,
};

const mockBody: NestDetailBody = {
  imageUrls: [
    'https://picsum.photos/seed/ad1/600/400',
    'https://picsum.photos/seed/ad2/600/400',
  ],
  categoryNames: ['음식', '이벤트'],
  title: '스타벅스 강남점 광고 게시글',
  content: '강남 스타벅스에서 진행하는 여름 시즌 음료 프로모션입니다. 많은 관심 부탁드립니다.',
  likeCount: 42,
  dislikeCount: 3,
};

// ─────────────────────────────────────────────
// Wrapper Components
// ─────────────────────────────────────────────
function AdsDetailView({ header, body }: { header: AdNestDetailHeader; body: NestDetailBody }) {
  const listUrl = '/admin/ads?page=1';

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <a
        href={listUrl}
        className="text-sm font-semibold text-[#54513E] hover:text-black flex items-center gap-1"
      >
        ← 목록으로
      </a>
      <div className="flex flex-col">
        <AdDetailHeader header={header} listUrl={listUrl} />
        <NestBody body={body} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MSW Handlers
// ─────────────────────────────────────────────
const deleteNestHandler = http.delete('*/api/v1/admin/nests/:nestId', () =>
  HttpResponse.json({ status: 'OK', code: '200', message: null, data: null })
);

// ─────────────────────────────────────────────
// Meta
// ─────────────────────────────────────────────
const meta: Meta<typeof AdsDetailView> = {
  title: 'Admin/Advertisement/AdsDetailPage',
  component: AdsDetailView,
  parameters: {
    layout: 'fullscreen',
    nextjs: { appDirectory: true },
    msw: { handlers: [deleteNestHandler] },
    chromatic: { delay: 300 },
  },
};

export default meta;
type Story = StoryObj<typeof AdsDetailView>;

// ─────────────────────────────────────────────
// Stories
// ─────────────────────────────────────────────

// 1. 기본 렌더 — 헤더/본문 데이터 노출 확인
export const Default: Story = {
  args: { header: mockHeader, body: mockBody },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('스타벅스코리아')).toBeInTheDocument();
    await expect(canvas.getByText('스타벅스 강남점 광고 게시글')).toBeInTheDocument();
    await expect(
      canvas.getByText('강남 스타벅스에서 진행하는 여름 시즌 음료 프로모션입니다. 많은 관심 부탁드립니다.')
    ).toBeInTheDocument();
    await expect(canvas.getByText('# 음식')).toBeInTheDocument();
    await expect(canvas.getByText('# 이벤트')).toBeInTheDocument();
    await expect(canvas.getByText('← 목록으로')).toBeInTheDocument();
  },
};

// 2. deleted: false — 삭제 버튼 미노출
export const WithoutDeleteButton: Story = {
  args: { header: mockHeader, body: mockBody },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole('button', { name: '삭제' })).not.toBeInTheDocument();
  },
};

// 3. deleted: true — 삭제 버튼 노출
export const WithDeleteButton: Story = {
  args: { header: mockHeaderDeleted, body: mockBody },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: '삭제' })).toBeInTheDocument();
  },
};

// 4. 삭제 버튼 클릭 → 삭제 확인 모달 열기
export const OpenDeleteModal: Story = {
  args: { header: mockHeaderDeleted, body: mockBody },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);

    await userEvent.click(canvas.getByRole('button', { name: '삭제' }));

    await waitFor(() =>
      expect(body.getByText('광고 삭제 확인')).toBeInTheDocument()
    );
    await expect(
      body.getByText('정말로 이 콘텐츠를 삭제하시겠습니까?')
    ).toBeInTheDocument();
    await expect(body.getByRole('button', { name: '취소' })).toBeInTheDocument();
    await expect(body.getByRole('button', { name: '확인' })).toBeInTheDocument();
  },
};

// 5. 삭제 모달 — 취소 버튼으로 닫기
export const CloseDeleteModal: Story = {
  args: { header: mockHeaderDeleted, body: mockBody },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);

    await userEvent.click(canvas.getByRole('button', { name: '삭제' }));

    await waitFor(() =>
      expect(body.getByText('광고 삭제 확인')).toBeInTheDocument()
    );

    await userEvent.click(body.getByRole('button', { name: '취소' }));

    await waitFor(() =>
      expect(body.queryByText('광고 삭제 확인')).not.toBeInTheDocument()
    );
  },
};

// 6. 좋아요/싫어요 수치 렌더 확인
export const LikeDislikeCount: Story = {
  args: {
    header: mockHeader,
    body: { ...mockBody, likeCount: 99, dislikeCount: 7 },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('99')).toBeInTheDocument();
    await expect(canvas.getByText('7')).toBeInTheDocument();
  },
};

// 7. 이미지 없는 상태
export const NoImages: Story = {
  args: { header: mockHeader, body: { ...mockBody, imageUrls: [] } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('스타벅스 강남점 광고 게시글')).toBeInTheDocument();
  },
};