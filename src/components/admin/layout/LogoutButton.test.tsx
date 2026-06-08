import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LogoutButton from "./LogoutButton";
import api from "@/lib/axios";

// 1. Axios 인스턴스 및 라우터 모킹 모듈화
vi.mock("@/lib/axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

const mockReplace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

describe("LogoutButton 인증 파기 및 라우팅 정밀 단위 테스트", () => {
  // 쿠키 스파이 보관용 변수
  let cookieSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();
    // 브라우저의 document.cookie 쓰기 동작을 감시하기 위한 스파이 심기
    cookieSpy = vi.spyOn(document, "cookie", "set");
  });

  afterEach(() => {
    cookieSpy.mockRestore();
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 1: [성공 해피 패스] 정상 로그아웃 시 전체 파기 사이클 검증
  // ══════════════════════════════════════════════════════════════
  it("로그아웃 버튼을 클릭하면 서버에 알림을 보내고 브라우저 토큰 쿠키를 삭제한 뒤 로그인 페이지로 replace 되어야 한다", async () => {
    // API 성공 응답 가로채기
    vi.mocked(api.post).mockResolvedValueOnce({} as any);

    render(<LogoutButton />);
    
    const logoutButton = screen.getByRole("button", { name: "로그아웃" });
    fireEvent.click(logoutButton);

    // 1. 백엔드 세션 파기 API를 정확한 엔드포인트로 찔렀는지 검증
    expect(api.post).toHaveBeenCalledWith("/api/v1/auth/logout", {});

    // 2. 브라우저 저장소의 토큰 쿠키 2종 세트가 수명 만료(max-age=0) 처리되었는지 검증
    await waitFor(() => {
      // 쿠키 스파이에 주입된 문자열 중 핵심 파기 옵션 매칭 확인
      const setCookieCalls = cookieSpy.mock.calls.map((call: any) => call[0]);
      expect(setCookieCalls.some((c: string) => c.includes("accessToken=") && c.includes("max-age=0"))).toBe(true);
      expect(setCookieCalls.some((c: string) => c.includes("refreshToken=") && c.includes("max-age=0"))).toBe(true);
    });

    // 3. 뒤로가기 방지를 위해 replace 메서드로 로그인 페이지 이탈했는지 검증
    expect(mockReplace).toHaveBeenCalledWith("/admin/login");
    expect(mockReplace).toHaveBeenCalledTimes(1);
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 2: [에러 방어벽] 서버 오류 발생 시에도 쿠키 삭제 및 이탈 보장 검증
  // ══════════════════════════════════════════════════════════════
  it("서버 로그아웃 API 요청이 실패(500 등)하더라도 마무리를 위해 쿠키는 강제 파기되고 로그인 페이지로 튕겨야 한다", async () => {
    // 의도적으로 백엔드 서버 통신 에러 발생 유도
    vi.mocked(api.post).mockRejectedValueOnce(new Error("Internal Server Error"));

    render(<LogoutButton />);
    
    const logoutButton = screen.getByRole("button", { name: "로그아웃" });
    fireEvent.click(logoutButton);

    // API는 실패했음을 확인
    expect(api.post).toHaveBeenCalled();

    // 1. catch를 지나 finally 절에 도달하여 쿠키 삭제 동작이 씹히지 않고 실행되었는지 검증
    await waitFor(() => {
      const setCookieCalls = cookieSpy.mock.calls.map((call: any) => call[0]);
      expect(setCookieCalls.some((c: string) => c.includes("accessToken=") && c.includes("max-age=0"))).toBe(true);
      expect(setCookieCalls.some((c: string) => c.includes("refreshToken=") && c.includes("max-age=0"))).toBe(true);
    });

    // 2. 에러 유무와 관계없이 무조건 로그인 화면으로 강제 이송되었는지 검증 (중요)
    expect(mockReplace).toHaveBeenCalledWith("/admin/login");
  });
});