import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SortSection from "./SortSection";

// 1. 하위 컴포넌트(SortFilterGroup) 모킹
vi.mock("@/components/admin/SortFilterGroup", () => {
  return {
    default: ({ options, currentValue, currentOrder, onChange }: any) => (
      <div data-testid="sort-filter-group">
        <span data-testid="current-field">{currentValue}</span>
        <span data-testid="current-order">{currentOrder}</span>
        {options.map((opt: any) => (
          <button 
            key={opt.value} 
            onClick={() => onChange(opt.value)}
            data-testid={`btn-${opt.value}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    ),
  };
});

// 2. useUpdateQuery 커스텀 훅 모킹
const mockUpdateQuery = vi.fn();
let mockSearchParams = new URLSearchParams();

vi.mock("@/lib/hooks/useUpdateQuery", () => ({
  useUpdateQuery: () => ({
    updateQuery: mockUpdateQuery,
    searchParams: mockSearchParams,
  }),
}));

describe("SortSection 컴포넌트 테스트", () => {
  const mockOptions = [
    { label: "최신순", value: "createdAt" },
    { label: "좋아요순", value: "likeCount" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
  });

  // 1. URL 정렬 상태 파싱 검증
  it("URL에 정렬 조건이 있으면 콤마(,)를 기준으로 필드와 방향을 정확히 파싱해야 한다", () => {
    mockSearchParams.set("sort", "likeCount,asc");
    render(<SortSection options={mockOptions} defaultSort="createdAt" />);

    expect(screen.getByTestId("current-field").textContent).toBe("likeCount");
    expect(screen.getByTestId("current-order").textContent).toBe("asc");
  });

  // 2. URL에 정렬 값이 없을 때 fallback 검증
  it("URL에 정렬 조건이 없으면 defaultSort를 따르고 기본 방향은 desc로 설정한다", () => {
    render(<SortSection options={mockOptions} defaultSort="createdAt" />);

    expect(screen.getByTestId("current-field").textContent).toBe("createdAt");
    expect(screen.getByTestId("current-order").textContent).toBe("desc");
  });

  // 3. 새로운 필드 클릭 시 정렬 검증
  it("새로운 정렬 필드를 클릭하면 무조건 desc(내림차순) 문자열로 훅을 호출해야 한다", () => {
    mockSearchParams.set("sort", "createdAt,asc");
    render(<SortSection options={mockOptions} defaultSort="createdAt" />);

    fireEvent.click(screen.getByTestId("btn-likeCount"));

    expect(mockUpdateQuery).toHaveBeenCalledWith({ sort: "likeCount,desc" });
  });

  // 4. 동일 필드 클릭 시 차순 토글 검증
  it("현재 정렬중인 필드를 다시 클릭하면 정렬 방향이 asc와 desc로 교대 전환되어야 한다", () => {
    mockSearchParams.set("sort", "likeCount,desc"); 
    const { rerender } = render(<SortSection options={mockOptions} defaultSort="createdAt" />);

    // 동일한 버튼 연타 -> 오름차순(asc)으로 반전되어야 함
    fireEvent.click(screen.getByTestId("btn-likeCount"));
    expect(mockUpdateQuery).toHaveBeenCalledWith({ sort: "likeCount,asc" });

    // 현재 오름차순(asc) 상태일 때 다시 누르면 내림차순(desc)이 되는지 검증
    vi.clearAllMocks();
    mockSearchParams.set("sort", "likeCount,asc");
    rerender(<SortSection options={mockOptions} defaultSort="createdAt" />);

    fireEvent.click(screen.getByTestId("btn-likeCount"));
    expect(mockUpdateQuery).toHaveBeenCalledWith({ sort: "likeCount,desc" });
  });

  // 5. disableToggle 속성 방어벽 검증
  it("disableToggle이 true이면 동일 필드를 다시 클릭해도 정렬 방향이 바뀌지 않아야 한다", () => {
    mockSearchParams.set("sort", "likeCount,desc");
    render(<SortSection options={mockOptions} defaultSort="createdAt" disableToggle={true} />);

    fireEvent.click(screen.getByTestId("btn-likeCount"));
    expect(mockUpdateQuery).not.toHaveBeenCalled();
  });
});