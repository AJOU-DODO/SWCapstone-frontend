import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useUpdateQuery } from "./useUpdateQuery"; // 👈 실제 파일 경로에 맞게 유지하세요.

// 1. Next.js의 내장 훅들을 모킹.
const mockPush = vi.fn();
let mockSearchParamsString = "";
const mockPathname = "/admin/users";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => mockPathname,
  useSearchParams: () => ({
    toString: () => mockSearchParamsString,
  }),
}));

// 주소창의 파라미터 순서가 달라도 알맹이가 같으면 통과하게 만들어주는 헬퍼 함수
const verifyRouterPushCall = (expectedUrl: string) => {
  const lastCallUrl = mockPush.mock.lastCall?.[0] as string;
  expect(lastCallUrl).toBeDefined();

  const [actualPath, actualQuery] = lastCallUrl.split("?");
  const [expectedPath, expectedQuery] = expectedUrl.split("?");

  // 1. 도메인/경로가 맞는지 확인 (/admin/users)
  expect(actualPath).toBe(expectedPath);

  // 2. 순서 상관없이 파라미터 내용물이 완벽히 일치하는지 객체 형태로 비교
  const actualParams = Object.fromEntries(new URLSearchParams(actualQuery));
  const expectedParams = Object.fromEntries(new URLSearchParams(expectedQuery));
  expect(actualParams).toEqual(expectedParams);
};

describe("useUpdateQuery 커스텀 훅 테스트", () => {
  beforeEach(() => {
    // 호출 횟수와 모킹 데이터를 완전히 리셋하여 테스트 간 간섭을 방지.
    mockPush.mockReset(); 
    mockSearchParamsString = ""; 
  });

  // 케이스 1: 새로운 파라미터 추가 및 기본 페이지 초기화
  it("새로운 파라미터를 업데이트하면 URL에 반영되고 page가 1로 강제 초기화되어야 한다", () => {
    const { result } = renderHook(() => useUpdateQuery());

    act(() => {
      result.current.updateQuery({ sort: "desc", search: "dodo" });
    });

    verifyRouterPushCall("/admin/users?sort=desc&search=dodo&page=1");
  });

  // 케이스 2: 파라미터 삭제 (null 조건)
  it("value를 null로 넘기면 해당 쿼리 파라미터가 URL에서 제거되어야 한다", () => {
    mockSearchParamsString = "sort=desc&tab=active";
    const { result } = renderHook(() => useUpdateQuery());

    act(() => {
      result.current.updateQuery({ sort: null });
    });

    verifyRouterPushCall("/admin/users?tab=active&page=1");
  });

  // 케이스 3: resetPage 옵션을 끌 때 (false)
  it("resetPage 인자에 false를 전달하면 기존 page 번호가 1로 초기화되지 않고 유지되어야 한다", () => {
    mockSearchParamsString = "page=3&sort=asc";
    const { result } = renderHook(() => useUpdateQuery());

    act(() => {
      result.current.updateQuery({ sort: "desc" }, false);
    });

    verifyRouterPushCall("/admin/users?page=3&sort=desc");
  });

  // 케이스 4: 한글 및 특수문자 인코딩 검증 
  it("한글이나 특수문자가 들어간 검색어도 URL 인코딩되어 안전하게 전달되어야 한다", () => {
    const { result } = renderHook(() => useUpdateQuery());

    act(() => {
      result.current.updateQuery({ search: "도도&미미" });
    });

    verifyRouterPushCall("/admin/users?search=%EB%8F%84%EB%8F%84%26%EB%AF%B8%EB%AF%B8&page=1");
  });

  // 케이스 5: 기존 무관한 파라미터 유지 검증
  it("특정 파라미터를 바꿀 때, 기존에 있던 다른 파라미터들은 지워지지 않고 유지되어야 한다", () => {
    mockSearchParamsString = "tab=completed&limit=20&page=2";
    const { result } = renderHook(() => useUpdateQuery());

    act(() => {
      result.current.updateQuery({ sort: "desc" });
    });

    verifyRouterPushCall("/admin/users?tab=completed&limit=20&sort=desc&page=1");
  });
});