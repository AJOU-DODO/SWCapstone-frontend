import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useReportActions } from "./useReportActions"; 

// 1. 외부 API 모듈들을 모킹.
vi.mock("@/lib/adminApi/nest", () => ({
  updateReportStatus: vi.fn(() => Promise.resolve()),
  deleteNestAdmin: vi.fn(() => Promise.resolve()),
  deleteCommentAdmin: vi.fn(() => Promise.resolve()),
}));

vi.mock("@/lib/adminApi/postcard", () => ({
  deleteReportPostcard: vi.fn(() => Promise.resolve()),
}));

// mock 함수들을 쉽게 쓰기 위해 임포트
import { updateReportStatus, deleteNestAdmin } from "@/lib/adminApi/nest";

describe("useReportActions 커스텀 훅 테스트", () => {
  const mockOnSuccess = vi.fn();
  const targetId = 42;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ────────────────────────────────────────────────
  // 케이스 1: API 호출 성공 및 onSuccess 콜백 실행 검증
  // ────────────────────────────────────────────────
  it("둥지 신고 반려 성공 시 API를 올바른 인자값으로 호출하고 onSuccess를 실행해야 한다", async () => {
    const { result } = renderHook(() =>
      useReportActions({ targetId, onSuccess: mockOnSuccess })
    );

    // 비동기 API 요청을 실행.
    await act(async () => {
      await result.current.handleNestRejectReport();
    });

    // 1. 백엔드 API 함수가 알맞은 포맷으로 호출되었는지 확인
    expect(updateReportStatus).toHaveBeenCalledWith({
      targetType: "NEST",
      targetId: 42,
      newStatus: "REJECTED",
    });

    // 2. 주입한 onSuccess 함수가 실행되었는지 확인
    expect(mockOnSuccess).toHaveBeenCalledTimes(1);
  });

  // ────────────────────────────────────────────────
  // 케이스 2: API 호출 과정 중 isLoading 상태 변화 검증 (waitFor 버전)
  // ────────────────────────────────────────────────
  it("API가 진행 중일 때는 isLoading이 true였다가 완료되면 false가 되어야 한다", async () => {
    // 0.2초 뒤에 성공하는 가짜 비동기 함수
    vi.mocked(deleteNestAdmin).mockImplementationOnce(() => {
      return new Promise<void>((resolve) => setTimeout(resolve, 200));
    });

    const { result } = renderHook(() => useReportActions({ targetId }));

    expect(result.current.isLoading).toBe(false); // [상태 1] 시작 전 false

    // handleNestDelete를 실행 (지연이 있으므로 바로 끝나지 않음)
    act(() => {
      result.current.handleNestDelete("사유 테스트");
    });

    // 1. 실행 직후에는 로딩 중이어야 함
    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    // 2. 0.2초가 지나 API가 완전히 완료된 후에는 다시 false가 되어야 함
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  // ────────────────────────────────────────────────
  // 케이스 3: API 실패(Error) 시 크래시 방지 및 isLoading 클린업 검증
  // ────────────────────────────────────────────────
  it("API 호출이 실패하더라도 에러를 먹고 isLoading은 false로 복구되어야 한다", async () => {
    // API가 에러를 뱉도록 가짜 셋팅
    vi.mocked(deleteNestAdmin).mockRejectedValueOnce(new Error("서버 폭발"));
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { result } = renderHook(() =>
      useReportActions({ targetId, onSuccess: mockOnSuccess })
    );

    await act(async () => {
      await result.current.handleNestDelete();
    });

    // 1. 실패했으니 onSuccess는 실행되면 안 됨
    expect(mockOnSuccess).not.toHaveBeenCalled();

    // 2. 실패했더라도 락이 걸리지 않고 로딩은 끝나야 함
    expect(result.current.isLoading).toBe(false);

    consoleSpy.mockRestore();
  });
});