import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AdvertiseTabButton from "./AdvertiseTabButton";
import { useRouter, useSearchParams } from "next/navigation";

// Next.js 내비게이션 훅 모킹
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

describe("AdvertiseTabButton 탭 데이터 및 URL 연동 단위 테스트", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 1: URL 탭 파라미터가 없을 때 fallback 기본값(APPROVED) 검증
  // ══════════════════════════════════════════════════════════════
  it("URL에 tab 쿼리 스트링이 없으면 기본값인 'APPROVED' 상태로 탭을 인식해야 한다", () => {
    // searchParams.get('tab')이 null(파라미터 없음)을 반환한다고 가정
    mockGetParam.mockReturnValue(null);

    render(<AdvertiseTabButton />);

    // 기본값이 APPROVED이므로 '광고글 관리' 버튼에 활성화 스타일 클래스가 붙어있는지 간접 검증
    const approvedBtn = screen.getByRole("button", { name: "광고글 관리" });
    expect(approvedBtn.className).toContain("bg-[#54513E]/70");
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 2: URL 탭 파라미터가 있을 때 정확한 상태 파싱 검증
  // ══════════════════════════════════════════════════════════════
  it("URL 주소창에 ?tab=PENDING 상태가 주어지면 승인 요청 광고 탭을 활성화해야 한다", () => {
    // searchParams.get('tab')이 'PENDING'을 반환한다고 가정
    mockGetParam.mockReturnValue("PENDING");

    render(<AdvertiseTabButton />);

    const pendingBtn = screen.getByRole("button", { name: "승인 요청 광고" });
    expect(pendingBtn.className).toContain("bg-[#54513E]/70");
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 3: 탭 버튼 클릭 시 URL 변경 라우터 호출 검증
  // ══════════════════════════════════════════════════════════════
  it("특정 탭 버튼을 클릭하면 쿼리 스트링 파라미터를 조합하여 올바른 주소로 router.push를 호출해야 한다", () => {
    mockGetParam.mockReturnValue("APPROVED");
    render(<AdvertiseTabButton />);

    // '승인 요청 광고' 탭 클릭 트리거
    fireEvent.click(screen.getByRole("button", { name: "승인 요청 광고" }));

    // 의도한 URL 쿼리 스트링 상태를 가지고 페이지 이동 함수가 실행되었는지 확인
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/admin/ads?tab=PENDING");
  });
});