import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import RejectModal from "./RejectModal";

describe("RejectModal 상태별 인터랙션 및 콜백 차단 기능 테스트", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    title: "광고 심사 거절",
    message: "규정 위반으로 인해 해당 광고 승인을 거절하시겠습니까?",
    isLoading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 1: [연타 방어 락] isLoading 상태의 인터랙션 차단 검증
  // ══════════════════════════════════════════════════════════════
  it("서버 통신 중(isLoading이 true)일 때는 모든 버튼이 무력화되어 연타로 인한 중복 요청을 방어해야 한다", () => {
    // 로딩이 걸려있는 가상 상황 주입
    render(<RejectModal {...defaultProps} isLoading={true} />);

    const closeButton = screen.getByRole("button", { name: "취소" });
    const confirmButton = screen.getByRole("button", { name: "처리 중..." });

    // 1. HTML 속성 상 disabled 락이 확실하게 박혀있는지 대조
    expect(closeButton).toBeDisabled();
    expect(confirmButton).toBeDisabled();

    // 2. 강제로 마우스 클릭 이벤트를 발생시켜도 콜백이 씹히는지 검증
    fireEvent.click(closeButton);
    fireEvent.click(confirmButton);

    expect(defaultProps.onClose).not.toHaveBeenCalled();
    expect(defaultProps.onConfirm).not.toHaveBeenCalled();
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 2: [백드롭 클릭 전파] 바깥 오버레이 영역 타격 검증
  // ══════════════════════════════════════════════════════════════
  it("모달 박스 외부의 어두운 암전 배경 영역을 클릭하면 onClose 콜백이 즉각 트리거되어야 한다", () => {
    const { container } = render(<RejectModal {...defaultProps} />);

    // 어두운 바깥 배경(bg-black/40) 엘리먼트 색출
    const backdrop = container.querySelector(".bg-black\\/40");
    
    if (backdrop) {
      fireEvent.click(backdrop);
      // 외부 클릭 신호가 유실되지 않고 안전하게 부모를 닫는지 검증
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    } else {
      throw new Error("배경 오버레이 엘리먼트를 찾을 수 없습니다.");
    }
  });
});