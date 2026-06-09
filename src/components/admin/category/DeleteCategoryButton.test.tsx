import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeleteCategoryButton from "./DeleteCategoryButton";
import { deleteCategory } from "@/lib/adminApi/category";
import { Category } from "@/types/indexAdmin";

// API 모킹
vi.mock("@/lib/adminApi/category", () => ({
  deleteCategory: vi.fn(),
}));


describe("DeleteCategoryButton 전체 로직 및 이벤트 전파 정밀 테스트", () => {
  const mockCategory: Category = {
    id: 42,
    name: "리빙/인테리어",
    sortOrder: 3,
    createdAt: "2026-01-01T00:00:00.000Z",
    deletedAt: null,
    nestCount: 2,
  };

  const mockOnRefresh = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 1: [초기 렌더링] 닫힘 상태 기본 UI 확인
  // ══════════════════════════════════════════════════════════════
  it("초기 상태에서는 모달이 닫혀있고 트리거 버튼만 노출되어야 한다", () => {
    render(<DeleteCategoryButton category={mockCategory} onRefresh={mockOnRefresh} />);
    
    expect(screen.getByRole("button", { name: "삭제" })).toBeInTheDocument();
    expect(screen.queryByText("카테고리 삭제 확인")).not.toBeInTheDocument();
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 2: [트리거 버튼 클릭] 모달 오픈 및 상위 이벤트 버블링 차단
  // ══════════════════════════════════════════════════════════════
  it("삭제 버튼 클릭 시 모달이 열리고 부모 요소로 클릭 이벤트가 전파되지 않는다", () => {
    const parentClick = vi.fn();
    render(
      <div onClick={parentClick}>
        <DeleteCategoryButton category={mockCategory} onRefresh={mockOnRefresh} />
      </div>
    );

    fireEvent.click(screen.getByRole("button", { name: "삭제" }));

    expect(screen.getByText("카테고리 삭제 확인")).toBeInTheDocument();
    expect(parentClick).not.toHaveBeenCalled();
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 3: [백드롭 클릭] 어두운 배경 터치 시 창 닫힘 및 버블링 차단
  // ══════════════════════════════════════════════════════════════
  it("모달 백드롭(어두운 배경) 클릭 시 모달이 닫히고 부모로 이벤트가 전파되지 않는다", () => {
    const parentClick = vi.fn();
    render(
      <div onClick={parentClick}>
        <DeleteCategoryButton category={mockCategory} onRefresh={mockOnRefresh} />
      </div>
    );

    // 모달 열기
    fireEvent.click(screen.getByRole("button", { name: "삭제" }));

    // 백드롭(가장 바깥 fixed div) 찾아서 클릭 트리거
    const backdrop = screen.getByText("카테고리 삭제 확인").closest(".fixed");
    if (backdrop) fireEvent.click(backdrop);

    expect(screen.queryByText("카테고리 삭제 확인")).not.toBeInTheDocument();
    expect(parentClick).not.toHaveBeenCalled();
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 4: [콘텐츠 영역 보호] 흰색 팝업 본문 클릭 시 오작동 방지
  // ══════════════════════════════════════════════════════════════
  it("모달 내부 콘텐츠 상자를 클릭하면 이벤트 전파가 차단되며 모달이 닫히지 않는다", () => {
    const parentClick = vi.fn();
    render(
      <div onClick={parentClick}>
        <DeleteCategoryButton category={mockCategory} onRefresh={mockOnRefresh} />
      </div>
    );

    fireEvent.click(screen.getByRole("button", { name: "삭제" }));

    const contentBox = screen.getByText("카테고리 삭제 확인").parentElement;
    if (contentBox) fireEvent.click(contentBox);

    expect(screen.getByText("카테고리 삭제 확인")).toBeInTheDocument();
    expect(parentClick).not.toHaveBeenCalled();
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 5: [취소 버튼 클릭] 작업 철회 및 버블링 차단
  // ══════════════════════════════════════════════════════════════
  it("취소 버튼을 클릭하면 모달이 닫히고 부모로 이벤트가 전파되지 않는다", () => {
    const parentClick = vi.fn();
    render(
      <div onClick={parentClick}>
        <DeleteCategoryButton category={mockCategory} onRefresh={mockOnRefresh} />
      </div>
    );

    fireEvent.click(screen.getByRole("button", { name: "삭제" }));
    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(screen.queryByText("카테고리 삭제 확인")).not.toBeInTheDocument();
    expect(parentClick).not.toHaveBeenCalled();
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 6: [비동기 로딩 락] API 통신 중 중복 클릭 차단 제어벽 검증
  // ══════════════════════════════════════════════════════════════
  it("삭제 요청 중(isLoading)에는 화면의 모든 관련 버튼들이 비활성화(disabled)되어야 한다", async () => {
    let resolveDelete: any;
    const delayPromise = new Promise((resolve) => { resolveDelete = resolve; });
    vi.mocked(deleteCategory).mockReturnValueOnce(delayPromise as any);

    render(<DeleteCategoryButton category={mockCategory} onRefresh={mockOnRefresh} />);

    fireEvent.click(screen.getByRole("button", { name: "삭제" }));
    fireEvent.click(screen.getByRole("button", { name: "확인 및 삭제" }));

    expect(screen.getByRole("button", { name: "삭제 중..." })).toBeDisabled();
    expect(screen.getByRole("button", { name: "취소" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "삭제" })).toBeDisabled();

    resolveDelete();
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 7: [성공 사이클 완료] 데이터 반영, 모달 청소 및 라우터 갱신
  // ══════════════════════════════════════════════════════════════
  it("삭제가 성공적으로 완료되면 모달이 닫히고 리스트가 새로고침되어야 한다", async () => {
    vi.mocked(deleteCategory).mockResolvedValueOnce({} as any);
    render(<DeleteCategoryButton category={mockCategory} onRefresh={mockOnRefresh} />);

    fireEvent.click(screen.getByRole("button", { name: "삭제" }));
    fireEvent.click(screen.getByRole("button", { name: "확인 및 삭제" }));

    await waitFor(() => {
      expect(deleteCategory).toHaveBeenCalledWith(42);
      
      expect(mockOnRefresh).toHaveBeenCalledTimes(1);
      expect(screen.queryByText("카테고리 삭제 확인")).not.toBeInTheDocument();
    });
  });
});