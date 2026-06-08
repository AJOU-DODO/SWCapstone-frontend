import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NoticeEditor from './NoticeEditor';
import { createNotice, updateNotice } from '@/lib/adminApi/notice';
import { useRouter } from 'next/navigation';

// 1. 외부 API 및 Next 내비게이션 레이어 전면 목킹
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/lib/adminApi/notice', () => ({
  createNotice: vi.fn(),
  updateNotice: vi.fn(),
}));

describe('NoticeEditor 모드별 데이터 상태 및 비즈니스 전송 가도 테스트', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      back: vi.fn(),
    } as any);
  });

  // ══════════════════════════════════════════════════════════════
  // TEST 1: 생성(create) 모드 비즈니스 상태 초기화 및 전송 파이프라인
  // ══════════════════════════════════════════════════════════════
  it('생성 모드일 때는 빈 인풋 상태로 시작하고, 발행 시 createNotice API를 찌른 후 상세로 넘어가야 한다', async () => {
    // 가짜 생성 결과 API 반환값 정의
    vi.mocked(createNotice).mockResolvedValue({
      data: { id: 999 },
    } as any);

    render(<NoticeEditor mode="create" />);

    const titleInput = screen.getByPlaceholderText('공지사항 제목을 입력하세요.');
    const contentInput = screen.getByPlaceholderText('공지사항 내용을 상세히 작성하세요.');
    const submitButton = screen.getByRole('button', { name: '발행하기' });

    expect(titleInput).toHaveValue('');
    expect(contentInput).toHaveValue('');

    fireEvent.change(titleInput, { target: { value: '서버 정기 점검 안내' } });
    fireEvent.change(contentInput, { target: { value: '새벽 2시부터 6시까지 점검입니다.' } });
    
    fireEvent.click(submitButton);

    expect(createNotice).toHaveBeenCalledWith({
      category: 'UPDATE', // 컴포넌트 내 기본값
      title: '서버 정기 점검 안내',
      content: '새벽 2시부터 6시까지 점검입니다.',
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/admin/notices/999');
    });
  });

  // ══════════════════════════════════════════════════════════════
  // TEST 2: 수정(edit) 모드 비즈니스 데이터 프리셋 바인딩 및 업데이트 파이프
  // ══════════════════════════════════════════════════════════════
  it('수정 모드일 때는 전달받은 initialData를 인풋에 선 가공 바인딩하고, 수정 확정 시 updateNotice API를 실행해야 한다', async () => {
    const mockInitialData = {
      id: 77,
      title: '기존 이벤트 공지',
      content: '원래 있던 이벤트 상세 본문 내용입니다.',
      category: 'EVENT',
    };

    vi.mocked(updateNotice).mockResolvedValue({} as any);

    render(<NoticeEditor mode="edit" initialData={mockInitialData} />);

    const titleInput = screen.getByPlaceholderText('공지사항 제목을 입력하세요.');
    const contentInput = screen.getByPlaceholderText('공지사항 내용을 상세히 작성하세요.');
    const submitButton = screen.getByRole('button', { name: '수정하기' });

    // 데이터 주입 무결성 검증 (초기 렌더링 시 값이 채워져 있어야 함)
    expect(titleInput).toHaveValue('기존 이벤트 공지');
    expect(contentInput).toHaveValue('원래 있던 이벤트 상세 본문 내용입니다.');

    fireEvent.change(titleInput, { target: { value: '[수정] 변경된 이벤트 공지' } });

    fireEvent.click(submitButton);

    expect(updateNotice).toHaveBeenCalledWith(77, {
      category: 'EVENT',
      title: '[수정] 변경된 이벤트 공지',
      content: '원래 있던 이벤트 상세 본문 내용입니다.',
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/admin/notices/77');
    });
  });
});