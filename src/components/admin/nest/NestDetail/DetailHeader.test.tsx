import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DetailHeader from "./DetailHeader";
import { useReportActions } from "@/lib/hooks/useReportActions";
import { NestDetailHeader } from "@/types/indexAdmin";

// 1. 커스텀 훅 및 모달 의존성 전면 목킹 (비즈니스 액션 가로채기)
vi.mock("@/lib/hooks/useReportActions", () => ({
  useReportActions: vi.fn(),
}));

vi.mock("@/components/admin/nest/RejectModal", () => ({
  default: ({ isOpen, onConfirm }: any) =>
    isOpen ? <button data-testid="mock-reject-submit" onClick={onConfirm}>반려확정</button> : null,
}));

vi.mock("@/components/admin/nest/DeleteModal", () => ({
  default: ({ isOpen, onConfirm }: any) =>
    isOpen ? <button data-testid="mock-delete-submit" onClick={() => onConfirm("사유")}>삭제확정</button> : null,
}));

describe("DetailHeader 삭제 성공 시 연쇄 액션 및 버튼 노출 가드 테스트", () => {
  const mockHandleReject = vi.fn();
  const mockHandleDelete = vi.fn();

  const defaultHeader: NestDetailHeader = {
    nestId: 777,
    authorId: 22,
    authorNickname: "도도새",
    profileImageUrl: "/logo.png",
    createdAt: "2026-06-08T12:00:00Z",
    firstReportedAt: "2026-06-08T13:00:00Z",
    lastReportedAt: "2026-06-08T14:00:00Z",
    deleted: false,
  };

  const defaultProps = {
    header: defaultHeader,
    triggerRefresh: vi.fn(),
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // useReportActions 성공 타이밍에 동기적 연쇄 호출 모사
    vi.mocked(useReportActions).mockImplementation(({ onSuccess }: any) => {
      return {
        handleNestRejectReport: () => { mockHandleReject(); onSuccess(); },
        handleNestDelete: () => { mockHandleDelete(); onSuccess(); },
        isLoading: false,
      } as any;
    });
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 1: [핵심] 게시물 삭제 완료 시 상세 서랍(onClose) 폐쇄 검증
  // ══════════════════════════════════════════════════════════════
  it("게시물 삭제 모달에서 최종 확정을 누르면 새로고침뿐만 아니라 부모의 onClose 콜백까지 트리거되어 창이 닫혀야 한다", () => {
    render(<DetailHeader {...defaultProps} />);

    // 1. 삭제 모달 오픈 후 목킹된 확정 단추 타격
    fireEvent.click(screen.getByRole("button", { name: "삭제" }));
    fireEvent.click(screen.getByTestId("mock-delete-submit"));

    // 2. 훅이 실행되었는지 확인
    expect(mockHandleDelete).toHaveBeenCalledTimes(1);
    
    // 3. 데이터 갱신과 동시에 상세 창이 통째로 닫히는지 검증
    expect(defaultProps.triggerRefresh).toHaveBeenCalledTimes(1);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 2: [가드] 신고 이력이 없는 클린 게시물의 취소 단추 은닉
  // ══════════════════════════════════════════════════════════════
  it("최초 신고일(firstReportedAt)이 빈 문자열 시나리오일 때는 '취소(반려)' 버튼이 화면에서 은닉되어야 한다", () => {
    // 인터페이스 타입 규격(string)을 해치지 않고, 신고가 없는 상태값("" 또는 falsy string) 매핑
    const noReportHeader: NestDetailHeader = { 
      ...defaultProps.header, 
      firstReportedAt: "", 
      lastReportedAt: "" 
    };
    
    render(<DetailHeader {...defaultProps} header={noReportHeader} />);

    // 신고가 들어온 적이 없으므로 반려(취소) 액션 자체가 원천 차단되었는지 확인
    expect(screen.queryByRole("button", { name: "취소" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "삭제" })).toBeInTheDocument();
  });
});