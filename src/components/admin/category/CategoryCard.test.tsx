import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CategoryCard from "./CategoryCard";
import { updateCategory } from "@/lib/adminApi/category";
import { Category } from "@/types/indexAdmin";

// 1. API 의존성 및 Next.js Router 가로채기
vi.mock("@/lib/adminApi/category", () => ({
  updateCategory: vi.fn(),
}));

const mockRefresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: mockRefresh,
  }),
}));

// 테스트용 모의 컴포넌트 선언
vi.mock("@/components/admin/category/EditCategoryButton", () => ({
  default: ({ onEditClick }: { onEditClick: any }) => (
    <button onClick={onEditClick}>수정하기</button>
  ),
}));
vi.mock("@/components/admin/category/DeleteCategoryButton", () => ({
  default: () => <button>삭제하기</button>,
}));

describe("CategoryCard 비즈니스 상태 및 편집 단위 테스트", () => {
  const activeCategory: Category = {
    id: 12,
    name: "자연/캠핑",
    sortOrder: 1,
    createdAt: "2026-01-01T00:00:00.000Z",
    deletedAt: null,
    nestCount: 5,
  };

  const deletedCategory: Category = {
    id: 99,
    name: "사라진 카테고리",
    sortOrder: 2,
    createdAt: "2026-01-01T00:00:00.000Z",
    deletedAt: "2026-06-01T00:00:00.000Z",
    nestCount: 0,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 1: 삭제(Soft Delete)된 카테고리의 UI 셧다운 검증
  // ══════════════════════════════════════════════════════════════
  it("이미 삭제(deletedAt 존재)된 카테고리 카드라면 수정 및 삭제 버튼을 완전히 숨겨야 한다", () => {
    render(<CategoryCard category={deletedCategory} />);

    // 일반 이름은 보여야 함
    expect(screen.getByText("사라진 카테고리")).toBeInTheDocument();

    // 하지만 액션 버튼들은 돔 트리에서 완전히 제거되어 있어야 함
    expect(screen.queryByText("수정하기")).not.toBeInTheDocument();
    expect(screen.queryByText("삭제하기")).not.toBeInTheDocument();
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 2: 수정 모드 진입 시 입력 폼 스위칭 메커니즘 검증
  // ══════════════════════════════════════════════════════════════
  it("수정 버튼을 클릭하면 텍스트가 인풋 창으로 바뀌고 취소/완료 버튼이 등장해야 한다", () => {
    const { container } = render(<CategoryCard category={activeCategory} />);

    // 1. 처음엔 일반 텍스트 상태
    expect(screen.getByText("자연/캠핑")).toBeInTheDocument();
    expect(container.querySelector("input")).not.toBeInTheDocument();

    // 2. 수정 버튼 클릭
    fireEvent.click(screen.getByText("수정하기"));

    // 3. 인풋 창 및 취소/완료 제어 폼 활성화 검증
    expect(container.querySelector("input")).toBeInTheDocument();
    expect(container.querySelector("input")).toHaveValue("자연/캠핑");
    expect(screen.getByText("취소")).toBeInTheDocument();
    expect(screen.getByText("완료")).toBeInTheDocument();
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 3: 의미 없는 공백 입력 시 완료 버튼 차단 검증
  // ══════════════════════════════════════════════════════════════
  it("수정 창에 공백만 입력하거나 전부 지우면 완료 버튼이 비활성화(disabled)되어야 한다", () => {
    const { container } = render(<CategoryCard category={activeCategory} />);

    fireEvent.click(screen.getByText("수정하기"));

    const input = container.querySelector("input");
    const saveButton = screen.getByText("완료");

    // 공백으로 문자열 덮어쓰기
    if (input) fireEvent.change(input, { target: { value: "   " } });

    // 빈 값 처리가 감지되어 버튼이 즉시 잠겨야 함
    expect(saveButton).toBeDisabled();
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 4: 문자열 정제(trim) 가공 후 API 통신 및 화면 동기화 검증
  // ══════════════════════════════════════════════════════════════
  it("수정 완료 시 앞뒤 공백이 잘린 깨끗한 이름으로 수정 API를 찌르고 화면을 갱신해야 한다", async () => {
    vi.mocked(updateCategory).mockResolvedValueOnce({} as any);
    const { container } = render(<CategoryCard category={activeCategory} />);

    fireEvent.click(screen.getByText("수정하기"));

    const input = container.querySelector("input");
    // 좌우 공백 유도 입력
    if (input) fireEvent.change(input, { target: { value: "   수정된 카테고리명   " } });

    // 완료 버튼 클릭
    fireEvent.click(screen.getByText("완료"));

    // 데이터가 정제되어 전달되는지 정밀 검증
    await waitFor(() => {
      expect(updateCategory).toHaveBeenCalledWith(12, {
        name: "수정된 카테고리명",
      });
    });

    // Next.js 라우터 리프레시와 에디팅 모드 해제 조건 검증
    expect(mockRefresh).toHaveBeenCalledTimes(1);
    expect(container.querySelector("input")).not.toBeInTheDocument();
  });
});