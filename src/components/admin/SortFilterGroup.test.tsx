import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SortFilterGroup from "./SortFilterGroup";

describe("SortFilterGroup 컴포넌트 테스트", () => {
  const mockOptions = [
    { label: "등록일순", value: "createdAt" },
    { label: "좋아요순", value: "likeCount" },
  ];

  it("정렬 옵션을 클릭하면 해당 옵션의 value를 담아 onChange 콜백을 호출해야 한다", () => {
    const mockOnChange = vi.fn();
    render(
      <SortFilterGroup
        options={mockOptions}
        currentValue="createdAt"
        currentOrder="desc"
        onChange={mockOnChange}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /좋아요순/ }));

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith("likeCount");
  });

  it("선택된 정렬 조건에만 아이콘(SVG)이 렌더링되어야 한다", () => {
    const { rerender } = render(
      <SortFilterGroup
        options={mockOptions}
        currentValue="createdAt"
        currentOrder="asc"
        onChange={vi.fn()}
      />
    );

    const createdBtn = screen.getByRole("button", { name: /등록일순/ });
    const likeBtn = screen.getByRole("button", { name: /좋아요순/ });

    // 선택되지 않은 버튼에는 아이콘이 없어야 함
    expect(likeBtn.querySelector("svg")).toBeNull();
    // 선택된 버튼에는 아이콘이 렌더링되어야 함
    expect(createdBtn.querySelector("svg")).toBeInTheDocument();

    // 정렬 방향(desc)이 바뀌어도 아이콘이 정상적으로 유지되는지 검증
    rerender(
      <SortFilterGroup
        options={mockOptions}
        currentValue="createdAt"
        currentOrder="desc"
        onChange={vi.fn()}
      />
    );
    
    expect(createdBtn.querySelector("svg")).toBeInTheDocument();
  });
});