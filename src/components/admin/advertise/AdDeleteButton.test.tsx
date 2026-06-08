import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdDeleteButton from "./AdDeleteButton";
import { deleteAdvertisements } from "@/lib/adminApi/advertise";

// 1. API 호출 함수 모킹
vi.mock("@/lib/adminApi/advertise", () => ({
  deleteAdvertisements: vi.fn(),
}));

describe("DeleteModal 단위 테스트", () => {
  const defaultProps = {
    nestId: 123,
    isOpen: true,
    onClose: vi.fn(),
    onSuccess: vi.fn(),
    title: "삭제 경고",
    message: "정말 삭제하시겠습니까?",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("isOpen이 false이면 아무것도 렌더링하지 않아야 한다", () => {
    const { container } = render(<AdDeleteButton {...defaultProps} isOpen={false} />);
    expect(container.firstChild).toBeNull();
  });

  it("확인 버튼을 클릭하면 API가 호출되고 성공 시 onSuccess 콜백이 실행되어야 한다", async () => {
    // API 성공 상황 가정
    vi.mocked(deleteAdvertisements).mockResolvedValueOnce(undefined);

    render(<AdDeleteButton {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: "확인" }));

    // 1. API가 올바른 id와 함께 호출되었는지 확인
    expect(deleteAdvertisements).toHaveBeenCalledWith(123);

    // 2. 비동기 처리 완료 후 onSuccess가 정상 호출되었는지 확인
    await waitFor(() => {
      expect(defaultProps.onSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it("API 호출 중(isLoading)에는 취소와 확인 버튼이 모두 비활성화되어야 한다", async () => {
    let resolvePromise: any;
    const pendingPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    vi.mocked(deleteAdvertisements).mockReturnValueOnce(pendingPromise);

    render(<AdDeleteButton {...defaultProps} />);

    const cancelBtn = screen.getByRole("button", { name: "취소" });
    const confirmBtn = screen.getByRole("button", { name: "확인" });

    // 클릭 직후 (아직 API 완료 전)
    fireEvent.click(confirmBtn);

    // 두 버튼 모두 disabled 상태인지 확인
    expect(cancelBtn).toBeDisabled();
    expect(confirmBtn).toBeDisabled();

    // 테스트 종료를 위해 프로미스 해제
    resolvePromise();
  });

  it("모달 박스 바깥의 어두운 배경(딤드 레이어)을 클릭하면 onClose 콜백이 실행되어야 한다", () => {
    const { container } = render(<AdDeleteButton {...defaultProps} />);

    // 배경 요소를 지정해서 클릭 (onClick={onClose} 가 걸린 첫 번째 내부 div)
    const backdrop = container.querySelector(".bg-black\\/40");
    if (backdrop) {
      fireEvent.click(backdrop);
    }

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });
});