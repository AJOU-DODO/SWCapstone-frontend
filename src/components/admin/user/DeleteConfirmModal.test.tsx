import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DeleteConfirmModal from "./DeleteConfirmModal";

describe("DeleteConfirmModal 중첩 팝업 이벤트 버블링 및 액션 정밀 테스트", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 1: [조건부 렌더링] false 일 때 무조건 트래시 아웃 검증
  // ══════════════════════════════════════════════════════════════
  it("isOpen이 false인 상태로 주입되면 화면에 그 어떤 요소도 렌더링되지 않는 null이어야 한다", () => {
    render(<DeleteConfirmModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByText("정말 삭제하시겠습니까?")).not.toBeInTheDocument();
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 2: [이벤트 버블링 차단] stopPropagation 전파 방어벽 검증
  // ══════════════════════════════════════════════════════════════
  it("흰색 모달 본문 영역을 클릭했을 때는 상위 배경으로 이벤트가 흐르지 않아야(stopPropagation) 한다", () => {
    render(<DeleteConfirmModal {...defaultProps} />);

    // 1. 글자 영역을 들고 와서 클릭
    const modalContent = screen.getByText("정말 삭제하시겠습니까?");
    fireEvent.click(modalContent);

    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 3: [배경 타격 이탈] 바깥 영역 클릭 시 닫힘 시그널 검증
  // ══════════════════════════════════════════════════════════════
  it("모달 박스 바깥의 어두운 배경(딤드 영역)을 클릭하면 모달 닫기(onClose)가 정상 호출되어야 한다", () => {
    render(<DeleteConfirmModal {...defaultProps} />);

    // 안내 텍스트의 상위 부모 래퍼를 조준하기 위해 텍스트가 아닌 '삭제하시겠습니까' 뒤 배경 요소를 타격
    const backdrop = screen.getByText("정말 삭제하시겠습니까?").closest(".fixed");
    
    if (backdrop) {
      fireEvent.click(backdrop);
    }

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 4: [최종 액션 시그널] 삭제하기 버튼 클릭 무결성 검증
  // ══════════════════════════════════════════════════════════════
  it("삭제하기 버튼을 최종 클릭하면 상위 비즈니스 로직인 onConfirm이 정확히 트리거되어야 한다", () => {
    render(<DeleteConfirmModal {...defaultProps} />);

    const confirmButton = screen.getByRole("button", { name: "삭제하기" });
    fireEvent.click(confirmButton);

    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });
});