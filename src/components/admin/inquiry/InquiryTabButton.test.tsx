import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import InquiryTabButton from "./InquiryTabButton";

// Next.js 내비게이션 모킹 감방 구축
const mockPush = vi.fn();
const mockGetParam = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => ({
    get: mockGetParam,
  }),
}));

describe("InquiryTabButton URL 쿼리 파라미터 연동 정밀 테스트", () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 1: [기본값 분기] 쿼리 스트링이 없을 때 PENDING 활성화 검증
  // ══════════════════════════════════════════════════════════════
  it("URL에 탭 파라미터가 없으면 대기중(PENDING) 버튼이 기본값으로 활성화(text-white 포함)되어야 한다", () => {
    // ?tab= 값이 null을 반환하도록 설정 (쿼리가 없는 상태)
    mockGetParam.mockReturnValue(null);

    render(<InquiryTabButton />);

    const pendingButton = screen.getByRole("button", { name: "대기중" });
    const completedButton = screen.getByRole("button", { name: "처리완료" });

    // PENDING 버튼은 활성화 스타일 클래스를 가지고 있어야 함
    expect(pendingButton).toHaveClass("bg-[#54513E]/70");
    expect(pendingButton).toHaveClass("text-white");

    // COMPLETED 버튼은 비활성화 상태여야 함
    expect(completedButton).not.toHaveClass("text-white");
    expect(completedButton).toHaveClass("text-[#54513E]");
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 2: [상태 동기화] 쿼리 파라미터 변경 시 UI 즉각 반영 검증
  // ══════════════════════════════════════════════════════════════
  it("URL에 tab=COMPLETED 파라미터가 감지되면 처리완료 버튼이 활성화되어야 한다", () => {
    // 주소창이 ?tab=COMPLETED 인 상태를 모킹
    mockGetParam.mockReturnValue("COMPLETED");

    render(<InquiryTabButton />);

    const pendingButton = screen.getByRole("button", { name: "대기중" });
    const completedButton = screen.getByRole("button", { name: "처리완료" });

    // 역으로 COMPLETED 버튼이 켜지고 PENDING이 꺼져야 함
    expect(completedButton).toHaveClass("bg-[#54513E]/70");
    expect(completedButton).toHaveClass("text-white");
    expect(pendingButton).not.toHaveClass("text-white");
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 3: [라우팅 트리거] 처리완료 버튼 클릭 시 URL 변경 감지
  // ══════════════════════════════════════════════════════════════
  it("처리완료 버튼을 클릭하면 주소창 쿼리가 tab=COMPLETED 경로로 변경(router.push) 요청되어야 한다", () => {
    mockGetParam.mockReturnValue("PENDING");
    render(<InquiryTabButton />);

    const completedButton = screen.getByRole("button", { name: "처리완료" });
    fireEvent.click(completedButton);

    // 해당 버튼 클릭 시 라우터가 올바른 쿼리 스트링 주소를 들고 튀는지 확인
    expect(mockPush).toHaveBeenCalledWith("/admin/inquiry?tab=COMPLETED");
    expect(mockPush).toHaveBeenCalledTimes(1);
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 4: [라우팅 트리거] 대기중 버튼 클릭 시 URL 복구 감지
  // ══════════════════════════════════════════════════════════════
  it("대기중 버튼을 클릭하면 주소창 쿼리가 tab=PENDING 경로로 변경(router.push) 요청되어야 한다", () => {
    mockGetParam.mockReturnValue("COMPLETED");
    render(<InquiryTabButton />);

    const pendingButton = screen.getByRole("button", { name: "대기중" });
    fireEvent.click(pendingButton);

    // 대기중 주소로 정확하게 뒤바뀌는지 확인
    expect(mockPush).toHaveBeenCalledWith("/admin/inquiry?tab=PENDING");
    expect(mockPush).toHaveBeenCalledTimes(1);
  });
});