import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeleteModal from "./DeleteModal";

// 🌟 [핵심 수정] 외부 백엔드 API 함수를 목킹하여 즉시 resolve 되도록 설정합니다.
vi.mock("@/lib/adminApi/user", () => ({
  sanctionUser: vi.fn(() => Promise.resolve({ success: true })),
}));

describe("DeleteModal 중첩 구조 및 제재 사유 전달 무결성 테스트", () => {
  const defaultProps = {
    authorId: 777,
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    title: "콘텐츠 강제 삭제",
    message: "정말로 이 게시글을 삭제하시겠습니까?",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ══════════════════════════════════════════════════════════════
  // TEST 1: [중첩 모달 트리거] 확인 버튼 클릭 시 연쇄 팝업 검증
  // ══════════════════════════════════════════════════════════════
  it("메인 모달의 확인 버튼을 누르면 즉시 onConfirm이 실행되지 않고 하위 제재 모달이 열려야 한다", async () => {
    render(<DeleteModal {...defaultProps} />);

    expect(screen.queryByText("유저 제재 처리")).not.toBeInTheDocument();

    const firstSubmitButton = screen.getByRole("button", { name: "확인" });
    fireEvent.click(firstSubmitButton);

    expect(await screen.findByText("유저 제재 처리")).toBeInTheDocument();
    expect(defaultProps.onConfirm).not.toHaveBeenCalled();
  });

  // ══════════════════════════════════════════════════════════════
  // TEST 2: [데이터 클로저 파이프] 최종 확정 시 사유(reason) 배달 검증
  // ══════════════════════════════════════════════════════════════
  it("삭제 사유를 입력하고 중첩 모달까지 최종 확정하면 입력했던 사유가 부모의 onConfirm으로 전달되어야 한다", async () => {
    render(<DeleteModal {...defaultProps} isOpen={true} />);

    const deleteInput = screen.getByPlaceholderText(
      "해당 콘텐츠를 삭제하는 사유를 입력하세요. (미입력시 기본값 적용)"
    );
    fireEvent.change(deleteInput, { target: { value: "부적절한 내용" } });

    const firstConfirmButton = screen.getByRole("button", { name: "확인" });
    fireEvent.click(firstConfirmButton);

    const sanctionInput = await screen.findByPlaceholderText(
      "해당 유저의 제재 이유를 적어주세요"
    );
    fireEvent.change(sanctionInput, { target: { value: "   부적절한 내용   " } });

    const finalConfirmButton = screen.getByRole("button", { name: "제재 및 삭제" });
    fireEvent.click(finalConfirmButton);

    await waitFor(() => {
      expect(defaultProps.onConfirm).toHaveBeenCalledWith("부적절한 내용");
    });
  });

  // ══════════════════════════════════════════════════════════════
  // TEST 3: [바깥 영역 오버레이 클릭] onClose 락 해제 검증
  // ══════════════════════════════════════════════════════════════
  it("모달 박스 바깥의 어두운 배경 오버레이 영역을 클릭하면 onClose가 트리거되어야 한다", () => {
    const { container } = render(<DeleteModal {...defaultProps} />);

    const backdrop = container.querySelector(".bg-black\\/40");

    if (backdrop) {
      fireEvent.click(backdrop);
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    } else {
      throw new Error("배경 오버레이 엘리먼트를 찾을 수 없습니다.");
    }
  });
});