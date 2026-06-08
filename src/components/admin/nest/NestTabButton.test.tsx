import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import NestTabButton from "./NestTabButton";
import { useRouter, useSearchParams } from "next/navigation";

// 1. Next.js 내비게이션 훅 레이어 전면 모킹 모듈 세팅
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

describe("NestTabButton URL 쿼리 스트링 연동 및 내비게이션 동기화 기능 테스트", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
    } as any);
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 1: [기본값 락] 쿼리가 없을 때 'all' 활성화 검증
  // ══════════════════════════════════════════════════════════════
  it("URL 주소창에 tab 파라미터가 부재할 경우 '전체' 탭이 기본값으로 지정되어 활성화 스타일이 적용되어야 한다", () => {
    vi.mocked(useSearchParams).mockReturnValue({
      get: vi.fn().mockReturnValue(null), // ?tab= 파라미터가 아예 없는 상황 시뮬레이션
    } as any);

    render(<NestTabButton />);

    const allButton = screen.getByRole("button", { name: "전체" });
    const reportedButton = screen.getByRole("button", { name: "신고" });

    expect(allButton.className).toContain("bg-[#54513E]/70");
    expect(reportedButton.className).not.toContain("bg-[#54513E]/70");
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 2: [액티브 상태 스위칭] 특정 쿼리 주입 시 하이라이트 이동
  // ══════════════════════════════════════════════════════════════
  it("주소창 쿼리가 ?tab=reported 상황일 때는 '신고' 탭 버튼이 하이라이트 처리를 양도받아야 한다", () => {
    vi.mocked(useSearchParams).mockReturnValue({
      get: vi.fn().mockReturnValue("reported"), // ?tab=reported 파라미터 주입 상황 시뮬레이션
    } as any);

    render(<NestTabButton />);

    const allButton = screen.getByRole("button", { name: "전체" });
    const reportedButton = screen.getByRole("button", { name: "신고" });

    expect(reportedButton.className).toContain("bg-[#54513E]/70");
    expect(allButton.className).not.toContain("bg-[#54513E]/70");
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 3: [라우터 인터랙션] 클릭 시 URL 변경 명령 송출 검증
  // ══════════════════════════════════════════════════════════════
  it("특정 탭 단추를 타격하면 Next.js 라우터 갱신 메서드가 알맞은 쿼리 스트링 주소와 함께 송출되어야 한다", () => {
    vi.mocked(useSearchParams).mockReturnValue({
      get: vi.fn().mockReturnValue("all"),
    } as any);

    render(<NestTabButton />);

    const commentTabButton = screen.getByRole("button", { name: "신고 댓글" });
    fireEvent.click(commentTabButton);

    // handleTabChange 동작에 의해 router.push가 지정 포맷 그대로 실행되었는지 대조
    expect(mockPush).toHaveBeenCalledWith("/admin/nests?tab=comments");
    expect(mockPush).toHaveBeenCalledTimes(1);
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 4: [비정상 쿼리 예외 방어] 명세 외 파라미터 주입 시 폴백 검증
  // ══════════════════════════════════════════════════════════════
  it("주소창에 명세되지 않은 이상한 파라미터(?tab=wrong)가 강제로 주입되어도 묵시적 기본값으로 유연하게 폴백되어야 한다", () => {
    vi.mocked(useSearchParams).mockReturnValue({
      get: vi.fn().mockReturnValue("unknown_fallback_value"),
    } as any);

    render(<NestTabButton />);
    
    const allButton = screen.getByRole("button", { name: "전체" });
    const reportedButton = screen.getByRole("button", { name: "신고" });

    // 정의되지 않은 값이 오면 그 어떤 버튼도 하이라이트 스타일을 갖지 않는 방식으로 예외 통제
    expect(allButton.className).not.toContain("bg-[#54513E]/70");
    expect(reportedButton.className).not.toContain("bg-[#54513E]/70");
  });
});