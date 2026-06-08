import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "./Pagination"; 

// Next.js 내장 훅 모킹
const mockPathname = "/admin/users";
let mockSearchParamsString = "";

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
  useSearchParams: () => ({
    get: (key: string) => {
      const params = new URLSearchParams(mockSearchParamsString);
      return params.get(key);
    },
    toString: () => mockSearchParamsString,
  }),
}));

describe("Pagination 컴포넌트 테스트", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParamsString = "";
  });

  // ────────────────────────────────────────────────
  // 케이스 1: 5개 단위 그룹 연산 및 이전/다음 버튼 활성화 검증
  // ────────────────────────────────────────────────
  it("6페이지에 진입하면 [6, 7, 8, 9, 10] 범위가 그려지고 이전/다음 버튼이 활성화되어야 한다", () => {
    mockSearchParamsString = "page=6"; 
    render(<Pagination totalPages={15} />);

    expect(screen.queryByRole("link", { name: "5" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "6" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "10" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "11" })).not.toBeInTheDocument();

    const prevButton = screen.getByRole("link", { name: "Go to previous page" });
    expect(prevButton.getAttribute("href")).toBe("/admin/users?page=5");
    
    // 실제 버튼이 작동 가능한 상태인지 검증
    expect(prevButton).not.toHaveAttribute("disabled");
  });

  // ────────────────────────────────────────────────
  // 케이스 2: 최대 페이지 미만일 때 잘리는 경계값 검증
  // ────────────────────────────────────────────────
  it("총 페이지가 3개뿐이면 5개가 아니라 [1, 2, 3]까지만 버튼이 생성되어야 한다", () => {
    render(<Pagination totalPages={3} />); 

    expect(screen.getByRole("link", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "3" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "4" })).not.toBeInTheDocument(); 

    const nextButton = screen.getByRole("link", { name: "Go to next page" });
    expect(nextButton.className).toContain("pointer-events-none");
  });

  // ────────────────────────────────────────────────
  // 케이스 3: 온클릭 콜백 모드 검증 (모달 등에서 쓸 때)
  // ────────────────────────────────────────────────
  it("onPageChange 콜백이 주입되면 링크 이동(#) 대신 해당 함수가 타깃 페이지 번호와 함께 호출되어야 한다", () => {
    const mockOnPageChange = vi.fn();
    
    // totalPages=5, 현재 1페이지, 콜백 주입
    render(<Pagination totalPages={5} currentPage={1} onPageChange={mockOnPageChange} />);

    const pageThreeLink = screen.getByRole("link", { name: "3" });
    
    // href가 단순 해시(#)로 채워지는지 확인
    expect(pageThreeLink.getAttribute("href")).toBe("#");

    // 3페이지 버튼 클릭!
    fireEvent.click(pageThreeLink);

    // 주소 이동 대신 우리가 보낸 함수가 '3'을 품고 실행되었는지 검증
    expect(mockOnPageChange).toHaveBeenCalledTimes(1);
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });
});

// ────────────────────────────────────────────────
  // 케이스 4: 현재 페이지 활성화(Active) 스타일 검증
  // ────────────────────────────────────────────────
  it("현재 페이지 버튼에는 활성화 스타일(bg-[#2B6340])이 적용되어야 한다", () => {
    mockSearchParamsString = "page=3";
    render(<Pagination totalPages={5} />);

    const activeLink = screen.getByRole("link", { name: "3" });
    const inactiveLink = screen.getByRole("link", { name: "1" });

    // 1. 현재 페이지인 3번 버튼은 활성화 클래스가 포함되어야 함
    expect(activeLink.className).toContain("bg-[#2B6340]");
    
    // 2. 다른 페이지 버튼은 해당 클래스가 없어야 함
    expect(inactiveLink.className).not.toContain("bg-[#2B6340]");
  });

  // ────────────────────────────────────────────────
  // 케이스 5: 비정상적인 페이지 범위 방어 테스트 (Boundary)
  // ────────────────────────────────────────────────
  it("현재 페이지(5)가 총 페이지(3)보다 크게 들어와도 크래시가 나지 않고 마지막 그룹을 안전하게 계산해야 한다", () => {
    mockSearchParamsString = "page=5"; // 비정상 주소 입력 상황
    render(<Pagination totalPages={3} />);

    // 에러로 터지지 않고, 3페이지 그룹인 [1, 2, 3]이 정상적으로 렌더링되는지 확인
    expect(screen.getByRole("link", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "3" })).toBeInTheDocument();
  });