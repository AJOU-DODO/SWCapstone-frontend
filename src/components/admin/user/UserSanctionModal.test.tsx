import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserSanctionModal from "./UserSanctionModal";
import { sanctionUser } from "@/lib/adminApi/user";

// 1. 유저 제재 API 레이어 모킹
vi.mock("@/lib/adminApi/user", () => ({
  sanctionUser: vi.fn(),
}));

// 2. 외부 커스텀 SelectBox 컴포넌트 테스트용 단순화 모킹
vi.mock("@/components/admin/SelectBox", () => ({
  SelectBox: ({ value, onChange, options }: any) => (
    <select 
      data-testid="mock-select-box" 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  ),
}));

describe("UserSanctionModal 커스텀 셀렉트 연동 및 제재 폼 전수 테스트", () => {
  const defaultProps = {
    userId: 999,
    isOpen: true,
    onClose: vi.fn(),
    setIsUpdated: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 1: [셀렉터+페이로드 조합] 커스텀 상태 결합 무결성 검증
  // ══════════════════════════════════════════════════════════════
  it("커스텀 셀렉트 박스에서 '영구 정지'를 선택하고 사유를 입력한 뒤 제출하면 페이로드가 정확히 결합되어 전송되어야 한다", async () => {
    vi.mocked(sanctionUser).mockResolvedValueOnce({} as any);
    render(<UserSanctionModal {...defaultProps} />);

    const selectBox = screen.getByTestId("mock-select-box");
    const reasonInput = screen.getByPlaceholderText("해당 유저의 제재 이유를 적어주세요");
    const submitButton = screen.getByRole("button", { name: "추가하기" });

    // 1. 커스텀 셀렉트박스 값 변경 시뮬레이션
    fireEvent.change(selectBox, { target: { value: "PERMANENT" } });

    // 2. 제재 사유 앞뒤 공백 섞어서 주입
    fireEvent.change(reasonInput, { target: { value: "   상습적인 광고 도배 유저   " } });

    // 3. 서브밋 단추 타격
    fireEvent.click(submitButton);

    // 4. 최종 API 명세 결합 및 .trim() 처리 상태 확인
    expect(sanctionUser).toHaveBeenCalledWith({
      userId: 999,
      body: {
        sanctionType: "PERMANENT",
        reason: "상습적인 광고 도배 유저",
      },
    });

    await waitFor(() => {
      expect(defaultProps.setIsUpdated).toHaveBeenCalledTimes(1);
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 2: [유효성 검증 브레이크] 빈 값 입력 시 버튼 잠금 락 검증
  // ══════════════════════════════════════════════════════════════
  it("제재 사유 인풋창에 공백만 입력되거나 비어있을 때는 추가하기 버튼이 비활성화(disabled) 되어야 한다", () => {
    render(<UserSanctionModal {...defaultProps} />);

    const reasonInput = screen.getByPlaceholderText("해당 유저의 제재 이유를 적어주세요");
    const submitButton = screen.getByRole("button", { name: "추가하기" });

    // 초기 상태 (reason이 비어있을 때) 버튼이 무력화되어 있는지 확인
    expect(submitButton).toBeDisabled();

    // 스페이스바만 입력해 본 상태 시뮬레이션
    fireEvent.change(reasonInput, { target: { value: "     " } });
    
    expect(submitButton).toBeDisabled();
  });
});