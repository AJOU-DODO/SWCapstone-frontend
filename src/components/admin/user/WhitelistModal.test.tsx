import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import WhitelistModal from "./WhitelistModal";
import { getWhitelists, deleteWhitelist } from "@/lib/adminApi/user";

// 1. 화이트리스트 관련 API 레이어 전원 목킹
vi.mock("@/lib/adminApi/user", () => ({
  getWhitelists: vi.fn(),
  deleteWhitelist: vi.fn(),
}));

// 2. 하위 모달들과의 스위치 상태 검증을 위한 목킹
vi.mock("@/components/admin/user/DeleteConfirmModal", () => ({
  default: ({ isOpen, onConfirm }: any) => 
    isOpen ? (
      <div data-testid="mock-delete-modal">
        <button onClick={onConfirm}>목-확인</button>
      </div>
    ) : null,
}));

vi.mock("@/components/admin/user/PostWhitelistModal", () => ({
  default: ({ isOpen }: any) => 
    isOpen ? <div data-testid="mock-post-modal">목-등록창</div> : null,
}));

describe("WhitelistModal 메인 데이터 라이프사이클 및 하위 모달 연동 테스트", () => {
  const mockData = {
    data: [
      { id: 1, email: "user1@test.com", remark: "테스터1", createdAt: "2026-06-01T00:00:00Z" },
      { id: 2, email: "user2@test.com", remark: "테스터2", createdAt: "2026-06-02T00:00:00Z" },
    ]
  };

  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  // ══════════════════════════════════════════════════════════════
  // TEST 1: [데이터 로드] 마운트 시 비동기 목록 패칭 및 바인딩
  // ══════════════════════════════════════════════════════════════
  it("컴포넌트가 열리면 자동으로 화이트리스트 조회를 요청하고 획득한 데이터를 목록에 뿌려야 한다", async () => {
    vi.mocked(getWhitelists).mockResolvedValue(mockData as any);

    render(<WhitelistModal {...defaultProps} />);

    expect(getWhitelists).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.getByText("user1@test.com")).toBeInTheDocument();
      expect(screen.getByText("user2@test.com")).toBeInTheDocument();
    });
  });

  // ══════════════════════════════════════════════════════════════
  // TEST 2: [예외 분기 플레이스홀더] 데이터가 없을 때 빈 화면 방어
  // ══════════════════════════════════════════════════════════════
  it("서버로부터 내려온 화이트리스트 배열이 0개일 때는 데이터 테이블 대신 빈 안내 문구를 출력해야 한다", async () => {
    vi.mocked(getWhitelists).mockResolvedValue({ data: [] } as any);

    render(<WhitelistModal {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("등록된 이메일이 없습니다.")).toBeInTheDocument();
    });
    expect(screen.queryByText("번호")).not.toBeInTheDocument();
  });

  // ══════════════════════════════════════════════════════════════
  // TEST 3: [교정 완료] 안심하고 무한 반복 돌려도 성공하는 결정론적 테스트
  // ══════════════════════════════════════════════════════════════
  it("특정 행의 삭제 버튼을 누르면 삭제 확인 팝업이 연결되어 노출되고, 최종 확정 시 API를 찔러야 한다", async () => {
    // 확실하게 데이터셋이 박히도록 엄격하게 목 바인딩
    vi.mocked(getWhitelists).mockResolvedValue(mockData as any);
    vi.mocked(deleteWhitelist).mockResolvedValue({ success: true } as any);

    render(<WhitelistModal {...defaultProps} />);

    await waitFor(() => {
      expect(screen.queryByText("user1@test.com")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole("button", { name: "삭제" });
    fireEvent.click(deleteButtons[0]);

    // 1. 하위 DeleteConfirmModal이 열렸는지 감시
    expect(screen.getByTestId("mock-delete-modal")).toBeInTheDocument();

    // 2. 가상 모달 내부의 '확인' 처리 트리거
    fireEvent.click(screen.getByRole("button", { name: "목-확인" }));

    // 3. 부모 상태에 걸려있던 id: 1을 완벽하게 인식해서 API 레이어로 쏘았는지 대조
    await waitFor(() => {
      expect(deleteWhitelist).toHaveBeenCalledWith(1);
    });
  });

  // ══════════════════════════════════════════════════════════════
  // TEST 4: [하위 연동 락: 등록] + 버튼 클릭 시 PostWhitelistModal 마운트
  // ══════════════════════════════════════════════════════════════
  it("우하단 플러스(+) 단추를 누르면 이메일을 추가할 수 있는 PostWhitelistModal이 화면에 나타나야 한다", async () => {
    vi.mocked(getWhitelists).mockResolvedValue({ data: [] } as any);
    render(<WhitelistModal {...defaultProps} />);

    expect(screen.queryByTestId("mock-post-modal")).not.toBeInTheDocument();

    const plusButton = screen.getByRole("button", { name: "+" });
    fireEvent.click(plusButton);

    expect(screen.getByTestId("mock-post-modal")).toBeInTheDocument();
  });
});