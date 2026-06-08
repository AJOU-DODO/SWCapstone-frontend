import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeleteButton from './DeleteButton'; // 🌟 교정된 이름으로 임포트
import { deleteNotice } from '@/lib/adminApi/notice';
import { useRouter, useSearchParams, ReadonlyURLSearchParams } from 'next/navigation';

// 1. Next.js 훅 및 API 전면 목킹
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

vi.mock('@/lib/adminApi/notice', () => ({
  deleteNotice: vi.fn(),
}));

describe('DeleteButton 공지사항 삭제 컴포넌트 단위 테스트', () => {
  const mockPush = vi.fn();
  const mockId = 42;

  beforeEach(() => {
    vi.clearAllMocks();

    // useRouter 기본 동작 목킹
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
    } as any);

    // URLSearchParams 타입 충돌을 방지하기 위한 ReadonlyURLSearchParams 캐스팅 주입
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams() as unknown as ReadonlyURLSearchParams
    );
  });

  // ══════════════════════════════════════════════════════════════
  // TEST 1: 인터랙션 인터페이스 토글 (모달 개폐 로직)
  // ══════════════════════════════════════════════════════════════
  it('초기에는 모달이 닫혀 있다가 "삭제하기" 버튼을 클릭하면 확인 모달이 나타나야 한다', () => {
    render(<DeleteButton id={mockId} />);

    // 처음엔 모달 내부 타이틀이 화면에 없어야 함
    expect(screen.queryByText('정말 삭제하시겠습니까?')).not.toBeInTheDocument();

    // 트리거 버튼 클릭
    const openButton = screen.getByRole('button', { name: '삭제하기' });
    fireEvent.click(openButton);

    // 모달 활성화 확인
    expect(screen.getByText('정말 삭제하시겠습니까?')).toBeInTheDocument();
  });

  it('모달이 열린 상태에서 "취소" 버튼을 누르면 모달이 닫혀야 한다', () => {
    render(<DeleteButton id={mockId} />);
    
    // 모달 열기
    fireEvent.click(screen.getByRole('button', { name: '삭제하기' }));
    
    // 취소 버튼 클릭
    const cancelButton = screen.getByRole('button', { name: '취소' });
    fireEvent.click(cancelButton);

    // 모달이 사라졌는지 확인
    expect(screen.queryByText('정raw 삭제하시겠습니까?')).not.toBeInTheDocument();
  });

  // ══════════════════════════════════════════════════════════════
  // TEST 2: 비동기 API 요청 및 UI 락(Lock) 상태 검증
  // ══════════════════════════════════════════════════════════════
  it('최종 "삭제" 버튼 클릭 시 API를 호출하고, 통신 중에는 버튼들이 비활성화되어야 한다', async () => {
    // API 펜딩 상태를 유지하기 위한 억제용 프로미스 생성
    let resolveDelete: (value: any) => void = () => {};
    const delayPromise = new Promise((resolve) => { resolveDelete = resolve; });
    vi.mocked(deleteNotice).mockReturnValue(delayPromise as any);

    render(<DeleteButton id={mockId} />);
    
    // 모달 열고 삭제 클릭
    fireEvent.click(screen.getByRole("button", { name: '삭제하기' }));
    const finalDeleteButton = screen.getByRole('button', { name: '삭제' });
    fireEvent.click(finalDeleteButton);

    // 1. 적절한 ID 파라미터 전송 확인
    expect(deleteNotice).toHaveBeenCalledWith(mockId);

    // 2. 더블 서브밋 방지 가드 상태 확인
    expect(finalDeleteButton).toBeDisabled();
    expect(finalDeleteButton).toHaveTextContent('삭제 중...');
    expect(screen.getByRole('button', { name: '취소' })).toBeDisabled();

    // API 통신 완료 시그널 전송
    resolveDelete({ success: true });
    
    // 3. 완료 후 목록 화면 리다이렉션 검증
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/admin/notices');
    });
  });

  // ══════════════════════════════════════════════════════════════
  // TEST 3: URL 컨텍스트 파라미터 (Query String) 보존 라우팅
  // ══════════════════════════════════════════════════════════════
  it('기존에 검색어나 페이지 컨텍스트가 존재했다면 삭제 성공 후에도 해당 쿼리를 유지하며 이동해야 한다', async () => {
    // page=3, keyword=공유 상태 시뮬레이션
    const mockParams = new URLSearchParams('page=3&keyword=공유') as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);
    vi.mocked(deleteNotice).mockReturnValue(Promise.resolve() as any);

    render(<DeleteButton id={mockId} />);
    
    fireEvent.click(screen.getByRole('button', { name: '삭제하기' }));
    fireEvent.click(screen.getByRole('button', { name: '삭제' }));

    // 쿼리 파라미터가 인코딩되어 안전하게 복귀하는지 정밀 매칭
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/admin/notices?page=3&keyword=%EA%B3%B5%EC%9C%A0');
    });
  });
});