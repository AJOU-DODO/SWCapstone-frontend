import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeleteSanctionModal from "./DeleteSanctionModal";
import { deleteSanctionUser } from "@/lib/adminApi/user";

// 1. 제재 해제 API 레이어 모킹
vi.mock("@/lib/adminApi/user", () => ({
  deleteSanctionUser: vi.fn(),
}));

describe("DeleteSanctionModal 제재 해제 API 및 더블클릭 방어벽 정밀 테스트", () => {
  const defaultProps = {
    userId: 42,
    isOpen: true,
    onClose: vi.fn(),
    setIsUpdated: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 1: [성공 해피 패스] API 연쇄 로직 및 리스트 동기화 검증
  // ══════════════════════════════════════════════════════════════
  it("해제하기 버튼을 누르면 API가 올바른 userId로 호출되고 모달이 닫히며 리스트가 갱신되어야 한다", async () => {
    // API 성공 응답 모킹
    vi.mocked(deleteSanctionUser).mockResolvedValueOnce({} as any);

    render(<DeleteSanctionModal {...defaultProps} />);

    const confirmButton = screen.getByRole("button", { name: "해제하기" });
    fireEvent.click(confirmButton);

    // 1. 프로프로 들어온 고유 userId를 정확히 찔렀는지 대조
    expect(deleteSanctionUser).toHaveBeenCalledWith({ userId: 42 });

    // 2. 부모 컴포넌트의 데이터 리프레시 훅과 onClose가 실행되는지 검증
    await waitFor(() => {
      expect(defaultProps.setIsUpdated).toHaveBeenCalledTimes(1);
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 2: [중복 클릭 방어] isLoading 락 상태 무결성 검증
  // ══════════════════════════════════════════════════════════════
  it("API 요청이 진행 중일 때는 버튼이 무력화(disabled)되고 '등록 중...' 텍스트가 표시되어야 한다", async () => {
    // API 응답을 의도적으로 지연시켜 로딩 상태 유지
    let resolveApi: any;
    const promise = new Promise((resolve) => { resolveApi = resolve; });
    vi.mocked(deleteSanctionUser).mockReturnValueOnce(promise as any);

    render(<DeleteSanctionModal {...defaultProps} />);

    const confirmButton = screen.getByRole("button", { name: "해제하기" });
    const cancelButton = screen.getByRole("button", { name: "취소" });

    // 버튼 타격하여 로딩 상태로 진입 유도
    fireEvent.click(confirmButton);

    // 연타를 막기 위해 락이 올바르게 걸렸는지 검증
    expect(confirmButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
    expect(confirmButton).toHaveTextContent("등록 중...");

    // 약속(Promise) 해제하여 테스트 종료 처리
    resolveApi({});
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 3: [예외 처리 캐치] 백엔드 실패 시 락 해제 상태 복구 검증
  // ══════════════════════════════════════════════════════════════
  it("서버 요청이 에러로 실패하더라도 finally 블록을 통해 로딩이 해제되어 버튼이 다시 켜져야 한다", async () => {
    // 의도적인 500 에러 캐치 유도
    vi.mocked(deleteSanctionUser).mockRejectedValueOnce(new Error("Internal Server Error"));

    render(<DeleteSanctionModal {...defaultProps} />);

    const confirmButton = screen.getByRole("button", { name: "해제하기" });
    fireEvent.click(confirmButton);

    // 실패 후 에러를 catch하고 버튼 자물쇠가 정상적으로 다시 풀리는지 검증
    await waitFor(() => {
      expect(confirmButton).not.toBeDisabled();
      expect(confirmButton).toHaveTextContent("해제하기");
    });
    
    // 에러 상황이므로 부모 창이 닫히거나 갱신되면 안 됨
    expect(defaultProps.onClose).not.toHaveBeenCalled();
    expect(defaultProps.setIsUpdated).not.toHaveBeenCalled();
  });
});