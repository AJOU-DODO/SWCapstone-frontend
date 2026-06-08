import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserSanctionModal from "./UserSanctionModal";
import { sanctionUser } from "@/lib/adminApi/user";

// 1. API 통신 레이어 전면 목킹
vi.mock("@/lib/adminApi/user", () => ({
  sanctionUser: vi.fn(),
}));

// 2. 하위 SelectBox 컴포넌트의 단순 바인딩 검증을 위한 가상 목킹
vi.mock("@/components/admin/SelectBox", () => ({
  SelectBox: ({ value, onChange, options }: any) => (
    <select 
      data-testid="mock-select" 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  ),
}));

describe("UserSanctionModal 제재 유무에 따른 조건부 비즈니스 분기 테스트", () => {
  const defaultProps = {
    userId: 999,
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 1: [분기 1 검증] 제재가 'NONE'일 때의 API 호출 차단막
  // ══════════════════════════════════════════════════════════════
  it("제재 유형이 NONE(제재 없음)일 때는 백엔드 API를 호출하지 않고, 즉시 공백 값을 부모 콜백으로 넘겨야 한다", () => {
    render(<UserSanctionModal {...defaultProps} />);

    const select = screen.getByTestId("mock-select");
    fireEvent.change(select, { target: { value: "NONE" } });

    const submitButton = screen.getByRole("button", { name: "삭제하기" });
    fireEvent.click(submitButton);

    expect(sanctionUser).not.toHaveBeenCalled();

    expect(defaultProps.onConfirm).toHaveBeenCalledWith("");
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 2: [분기 2 검증] 실질적 제재 시 페이로드 가공 및 전송 락
  // ══════════════════════════════════════════════════════════════
  it("제재 유형이 NONE이 아닐 때는 입력한 사유를 .trim() 가공하여 API로 전송하고 성공 시에만 콜백을 찔러야 한다", async () => {
    render(<UserSanctionModal {...defaultProps} />);

    const select = screen.getByTestId("mock-select");
    fireEvent.change(select, { target: { value: "SEVEN_DAYS" } });

    const input = screen.getByPlaceholderText("해당 유저의 제재 이유를 적어주세요");
    fireEvent.change(input, { target: { value: "   상습적 도배 및 욕설 유포   " } });

    const submitButton = screen.getByRole("button", { name: "제재 및 삭제" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      // 내부 로직에서 trim() 처리가 정상 작동하는지 검증
      expect(defaultProps.onConfirm).toHaveBeenCalledWith("상습적 도배 및 욕설 유포");
    });
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 3: [연타 방어 및 폼 가드] 사유 공백 시 버튼 차단막 검증
  // ══════════════════════════════════════════════════════════════
  it("제재 유형이 선택되었으나 사유 입력창이 비어있거나 스페이스만 있다면 버튼이 잠겨야 한다", () => {
    render(<UserSanctionModal {...defaultProps} />);

    const select = screen.getByTestId("mock-select");
    fireEvent.change(select, { target: { value: "PERMANENT" } });

    const reasonInput = screen.getByPlaceholderText("해당 유저의 제재 이유를 적어주세요");
    const submitButton = screen.getByRole("button", { name: "제재 및 삭제" });

    // 스페이스 공백만 입력 유도
    fireEvent.change(reasonInput, { target: { value: "     " } });

    // disabled 조건식 `(sanctionType !== 'NONE' && !reason.trim())` 작동 검증
    expect(submitButton).toBeDisabled();
  });
});