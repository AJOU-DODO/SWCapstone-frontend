import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateCategoryModal from "./CreateCategoryModal";
import { postCategory } from "@/lib/adminApi/category";

vi.mock("@/lib/adminApi/category", () => ({
  postCategory: vi.fn(),
}));

const mockRefresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: mockRefresh,
  }),
}));

describe("CreateCategoryModal 생성 로직 및 컴포넌트 테스트", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 1: [렌더링 차단] isOpen이 false일 때 early return 검증
  // ══════════════════════════════════════════════════════════════
  it("isOpen 프롭이 false이면 모달의 그 어떤 요소도 화면에 렌더링되지 않아야 한다", () => {
    const { container } = render(<CreateCategoryModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByText("새 카테고리 생성")).not.toBeInTheDocument();
    expect(container.firstChild).toBeNull();
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 2: [기본 UI 및 초점] 오토포커스 동작 검증
  // ══════════════════════════════════════════════════════════════
  it("모달이 열리면 입력창이 정상 노출되며 문서의 초점(Focus)이 인풋창에 가 있어야 한다", () => {
    const { container } = render(<CreateCategoryModal {...defaultProps} />);

    const input = container.querySelector('input[type="text"]');
    
    expect(input).toBeInTheDocument();
    expect(input).toHaveFocus(); // autoFocus 속성 정상 작동 검증
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 3: [공백 방어벽] 비어있거나 무의미한 문자열 차단 검증
  // ══════════════════════════════════════════════════════════════
  it("카테고리 이름에 공백만 입력했거나 빈 값일 경우 생성하기 버튼이 비활성화되어야 한다", () => {
    const { container } = render(<CreateCategoryModal {...defaultProps} />);

    const input = container.querySelector('input[type="text"]');
    const submitButton = screen.getByRole("button", { name: "생성하기" });

    // 1. 초기 상태 빈 값일 때 버튼 락 확인
    expect(submitButton).toBeDisabled();

    // 2. 의미 없는 스페이스바 공백 주입 후 버튼 락 확인
    if (input) fireEvent.change(input, { target: { value: "     " } });
    expect(submitButton).toBeDisabled();
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 4: [콘텐츠 영역] 팝업 상자 내부 클릭 시 전파 차단 검증
  // ══════════════════════════════════════════════════════════════
  it("모달 내부 콘텐츠 박스를 클릭하면 상위 레이어로 이벤트가 전파되지 않는다", () => {
    const parentClick = vi.fn();
    render(
      <div onClick={parentClick}>
        <CreateCategoryModal {...defaultProps} />
      </div>
    );

    // 흰색 모달 박스 본문 영역 찾기
    const contentBox = screen.getByText("새 카테고리 생성").closest(".max-w-sm");
    if (contentBox) fireEvent.click(contentBox);

    // 상위 div 클릭 이벤트가 깨지지 않고 버블링이 끊겼는지 검증 (e.stopPropagation)
    expect(parentClick).not.toHaveBeenCalled();
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 5: [비동기 로딩 락] 생성 API 호출 중 데이터 수정 및 중복 클릭 차단
  // ══════════════════════════════════════════════════════════════
  it("카테고리 생성 요청 중(isLoading)에는 폼 양식의 모든 입력과 버튼이 대기 상태로 잠겨야 한다", async () => {
    // API 통신 펜딩(Pending) 상태 강제 유도
    let resolvePost: any;
    const pendingPromise = new Promise((resolve) => { resolvePost = resolve; });
    vi.mocked(postCategory).mockReturnValueOnce(pendingPromise as any);

    const { container } = render(<CreateCategoryModal {...defaultProps} />);
    const input = container.querySelector('input[type="text"]');
    const form = container.querySelector("form");

    if (input) fireEvent.change(input, { target: { value: "새로운 카테고리" } });
    if (form) fireEvent.submit(form);

    // 로딩 도중 핵심 인터랙션 요소들이 완벽히 블로킹 되었는지 체크
    expect(input).toBeDisabled();
    expect(screen.getByRole("button", { name: "취소" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "생성 중..." })).toBeDisabled();

    // 펜딩 해제
    resolvePost();
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 6: [생성 완료 후속 처리] 데이터 청소, 닫기, 새로고침 연쇄 반응 검증
  // ══════════════════════════════════════════════════════════════
  it("정상 등록 시 양 끝 공백이 잘린 데이터로 API를 호출하고 폼 리셋, 창 닫기, 리스트 갱신이 실행된다", async () => {
    vi.mocked(postCategory).mockResolvedValueOnce({} as any);
    const { container } = render(<CreateCategoryModal {...defaultProps} />);

    const input = container.querySelector('input[type="text"]');
    // 앞뒤로 공백 삽입
    if (input) fireEvent.change(input, { target: { value: "   푸드/레시피   " } });

    const form = container.querySelector("form");
    if (form) fireEvent.submit(form);

    // 1. 공백이 완전 가공(trim)되어 전송되었는지 검증
    await waitFor(() => {
      expect(postCategory).toHaveBeenCalledWith({ name: "푸드/레시피" });
    });

    // 2. 제출이 완료되었으므로 입력 폼이 빈 값으로 세척되었는지 검증
    expect(input).toHaveValue("");

    // 3. 모달을 닫고 리스트를 새로고침하는 후속 체인이 도는지 검증
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });
});