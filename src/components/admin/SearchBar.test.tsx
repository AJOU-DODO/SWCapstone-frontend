import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import SearchBar from "./SearchBar";

// Next.js 라우팅 모킹
const mockPush = vi.fn();
let mockSearchParamsString = "";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => ({
    get: (key: string) => {
      const params = new URLSearchParams(mockSearchParamsString);
      return params.get(key);
    },
    toString: () => mockSearchParamsString,
  }),
}));

describe("SearchBar 컴포넌트 테스트", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParamsString = "";
    // 디바운스(setTimeout) 테스트를 위해 가짜 타이머를 활성화
    vi.useFakeTimers();
  });

  afterEach(() => {
    // 테스트가 끝나면 실제 시간으로 복구합니다.
    vi.useRealTimers();
  });

  // ────────────────────────────────────────────────
  // 케이스 1: 디바운스(500ms) 작동 검증
  // ────────────────────────────────────────────────
  it("글자를 타이핑하는 중에는 router.push가 실행되지 않다가, 500ms가 지나면 딱 1번 실행되어야 한다", () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText("검색어를 입력하세요");

    // 유저가 'dodo'를 연속으로 타이핑하는 상황 시뮬레이션
    fireEvent.change(input, { target: { value: "d" } });
    fireEvent.change(input, { target: { value: "do" } });
    fireEvent.change(input, { target: { value: "dod" } });
    fireEvent.change(input, { target: { value: "dodo" } });

    // 아직 500ms가 안 지났으므로 router.push는 한 번도 호출되면 안 됨
    expect(mockPush).not.toHaveBeenCalled();

    // 2. 시간을 499ms만 살짝 흘려봅니다.
    act(() => {
      vi.advanceTimersByTime(499);
    });
    expect(mockPush).not.toHaveBeenCalled(); // 아직도 실행 안 됨

    // 3. 딱 500ms가 되는 순간
    act(() => {
      vi.advanceTimersByTime(1);
    });

    // 4. 딱 1번만 실행되고, 페이지는 1로 리셋되었는지 확인
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("?search=dodo&page=1");
  });

  // ────────────────────────────────────────────────
  // 케이스 2: 빈 값 입력 시 파라미터 삭제 검증
  // ────────────────────────────────────────────────
  it("검색창의 글자를 모두 지우면 URL에서 search 파라미터가 삭제되어야 한다", () => {
    mockSearchParamsString = "search=apple&page=1"; // 기존 상태
    render(<SearchBar />);
    const input = screen.getByPlaceholderText("검색어를 입력하세요");

    // 글자를 완전히 지움
    fireEvent.change(input, { target: { value: "" } });

    // 500ms 디바운스 타이머 강제 만료
    act(() => {
      vi.runAllTimers();
    });

    // 기존에 존재하던 page=1은 그대로 유지
    expect(mockPush).toHaveBeenCalledWith("?page=1");
  });

  // ────────────────────────────────────────────────
  // 케이스 3: 외부 URL 쿼리 변화 감지 검증 (useEffect)
  // ────────────────────────────────────────────────
  it("뒤로가기 등으로 인해 외부에서 URL search 파라미터가 바뀌면 검색창 입력값도 동기화되어야 한다", () => {
    const { rerender } = render(<SearchBar />);
    const input = screen.getByPlaceholderText("검색어를 입력하세요") as HTMLInputElement;

    expect(input.value).toBe(""); // 처음엔 빈 값

    // 주소창이 갑자기 ?search=banana 로 바뀐 상황 가정하고 컴포넌트 리렌더링
    mockSearchParamsString = "search=banana";
    rerender(<SearchBar />);

    // useEffect가 주소창을 감지해서 인풋 박스 글자를 banana로 바꿔놓았는지 확인
    expect(input.value).toBe("banana");
  });
});