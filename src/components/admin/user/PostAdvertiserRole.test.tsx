import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PostAdvertiserRole from "./PostAdvertiserRole";
import { addAdvertiserAuthority } from "@/lib/adminApi/advertise";

vi.mock("@/lib/adminApi/advertise", () => ({
  addAdvertiserAuthority: vi.fn(),
}));

describe("PostAdvertiserRole 광고주 권한 부여 폼 종합 예외 방어 테스트", () => {
  const defaultProps = {
    userId: 123,
    isOpen: true,
    onClose: vi.fn(),
    setIsUpdated: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-08T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 1: [페이로드 포맷 검증] 날짜 ISO 자율 가공 엔진 테스트
  // ══════════════════════════════════════════════════════════════
  it("폼에 정상적인 데이터를 입력하고 제출하면 날짜가 T23:59:59.999Z 규격의 ISO 포맷으로 정확히 가공되어 전송되어야 한다", async () => {
    vi.mocked(addAdvertiserAuthority).mockResolvedValueOnce({} as any);
    const { container } = render(<PostAdvertiserRole {...defaultProps} />);

    const countInput = screen.getByPlaceholderText(/부여할 광고 게시글 수를 입력하세요/);
    const dateInput = container.querySelector('input[type="date"]') as HTMLInputElement;
    
    fireEvent.change(countInput, { target: { value: "10" } });
    fireEvent.change(dateInput, { target: { value: "2026-06-30" } });
    fireEvent.submit(screen.getByRole("button", { name: "권한부여" }).closest("form")!);

    expect(addAdvertiserAuthority).toHaveBeenCalledWith({
      userId: 123,
      body: { allowedAdCount: 10, expiredAt: "2026-06-30T23:59:59.999Z" },
    });
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 2: [유효성 검증 규칙] adCount 상태 변화에 따른 버튼 락 테스트
  // ══════════════════════════════════════════════════════════════
  it("부여할 광고 게시글 수가 0 이하일 때는 권한부여 버튼이 비활성화(disabled) 되어야 한다", () => {
    render(<PostAdvertiserRole {...defaultProps} />);
    const submitButton = screen.getByRole("button", { name: "권한부여" });
    expect(submitButton).toBeDisabled();
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 3: [연타 및 레이스 컨디션 방어] 로딩 제어막 정상 작동 검증
  // ══════════════════════════════════════════════════════════════
  it("서버 통신 중(isLoading)일 때는 인풋창들과 모든 버튼이 락(disabled) 걸리고 '등록 중...' 텍스트가 나와야 한다", async () => {
    vi.mocked(addAdvertiserAuthority).mockReturnValueOnce(new Promise(() => {}) as any);
    const { container } = render(<PostAdvertiserRole {...defaultProps} />);

    const countInput = screen.getByPlaceholderText(/부여할 광고 게시글 수를 입력하세요/);
    const dateInput = container.querySelector('input[type="date"]') as HTMLInputElement;

    fireEvent.change(countInput, { target: { value: "5" } });
    fireEvent.change(dateInput, { target: { value: "2026-12-31" } });
    fireEvent.submit(screen.getByRole("button", { name: "권한부여" }).closest("form")!);

    expect(countInput).toBeDisabled();
    expect(dateInput).toBeDisabled();
    expect(screen.getByRole("button", { name: "등록 중..." })).toBeDisabled();
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 4: [과거 날짜 선택 제한] min 어트리뷰트 출력 검증
  // ══════════════════════════════════════════════════════════════
  it("날짜 선택창(input[type='date'])의 min 속성에 오늘 날짜가 YYYY-MM-DD 형태로 정확히 박혀있어야 한다", () => {
    const { container } = render(<PostAdvertiserRole {...defaultProps} />);
    const dateInput = container.querySelector('input[type="date"]');

    expect(dateInput).toHaveAttribute("min", "2026-06-08");
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 5: [예외 문자열 파싱] 빈 값 및 정수 변환 검증
  // ══════════════════════════════════════════════════════════════
  it("숫자 인풋창에 빈 문자열이 들어오면 NaN이 아닌 0으로 대체 처리되어 안전하게 바인딩되어야 한다", () => {
    render(<PostAdvertiserRole {...defaultProps} />);
    const countInput = screen.getByPlaceholderText(/부여할 광고 게시글 수를 입력하세요/) as HTMLInputElement;

    fireEvent.change(countInput, { target: { value: "" } });
    expect(countInput.value).toBe(""); 
    
    const submitButton = screen.getByRole("button", { name: "권한부여" });
    expect(submitButton).toBeDisabled();
  });
});