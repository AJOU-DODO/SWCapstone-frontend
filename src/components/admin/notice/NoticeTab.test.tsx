import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NoticeTab from './NoticeTab';
import { useRouter, useSearchParams, ReadonlyURLSearchParams } from 'next/navigation';

// 1. Next.js 내비게이션 훅 목킹
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

describe('NoticeTabs 탭 내비게이션 컨텍스트 및 분기 단위 테스트', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
    } as any);
  });

  // ══════════════════════════════════════════════════════════════
  // TEST 1: URL 파라미터 부재 시의 기본 상태 바인딩 가도
  // ══════════════════════════════════════════════════════════════
  it('주소창에 status 파라미터가 없으면 기본값인 ALL(전체) 탭이 활성화 스타일을 가져야 한다', () => {
    // searchParams.get('status')가 null을 반환하는 상황일때
    const mockParams = {
      get: vi.fn().mockReturnValue(null),
    };
    vi.mocked(useSearchParams).mockReturnValue(mockParams as unknown as ReadonlyURLSearchParams);

    render(<NoticeTab />);

    const allTab = screen.getByRole('button', { name: '전체' });
    const draftTab = screen.getByRole('button', { name: '임시 저장' });

    expect(allTab.className).toContain('border-[#2B6340]');
    expect(draftTab.className).not.toContain('border-[#2B6340]');
  });

  // ══════════════════════════════════════════════════════════════
  // TEST 2: URL 명시적 파라미터 주입에 따른 컨텍스트 매핑
  // ══════════════════════════════════════════════════════════════
  it('주소창의 status 파라미터가 DRAFT일 경우 임시 저장 탭이 활성화되어야 한다', () => {
    // searchParams.get('status')가 'DRAFT'를 반환하는 상황일때
    const mockParams = {
      get: vi.fn().mockReturnValue('DRAFT'),
    };
    vi.mocked(useSearchParams).mockReturnValue(mockParams as unknown as ReadonlyURLSearchParams);

    render(<NoticeTab />);

    const allTab = screen.getByRole('button', { name: '전체' });
    const draftTab = screen.getByRole('button', { name: '임시 저장' });

    expect(draftTab.className).toContain('border-[#2B6340]');
    expect(allTab.className).not.toContain('border-[#2B6340]');
  });

  // ══════════════════════════════════════════════════════════════
  // TEST 3: 클릭 인터랙션 시 조건부 라우팅 분기 로직 (ALL vs Specific)
  // ══════════════════════════════════════════════════════════════
  it('특정 탭이나 전체 탭을 누르면 알맞은 URL 조건으로 라우터 push가 실행되어야 한다', () => {
    const mockParams = { get: vi.fn().mockReturnValue(null) };
    vi.mocked(useSearchParams).mockReturnValue(mockParams as unknown as ReadonlyURLSearchParams);

    render(<NoticeTab />);

    const publishedTab = screen.getByRole('button', { name: '발행 완료' });
    const allTab = screen.getByRole('button', { name: '전체' });

    fireEvent.click(publishedTab);
    expect(mockPush).toHaveBeenCalledWith('/admin/notices?status=PUBLISHED');

    mockPush.mockClear();

    fireEvent.click(allTab);
    expect(mockPush).toHaveBeenCalledWith('/admin/notices');
  });
});