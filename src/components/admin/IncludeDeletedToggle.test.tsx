import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import IncludeDeletedToggle from "./IncludeDeletedToggle";

const mockUpdateQuery = vi.fn();
let mockSearchParams = new URLSearchParams();

vi.mock("@/lib/hooks/useUpdateQuery", () => ({
  useUpdateQuery: () => ({
    updateQuery: mockUpdateQuery,
    searchParams: mockSearchParams,
  }),
}));

describe("IncludeDeletedToggle 컴포넌트 테스트", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
  });

  // 1. 초기 온/오프 상태 동기화 검증
  it("URL 상태에 따라 토글의 초기 온/오프(aria-checked) 상태가 결정되어야 한다", () => {
    mockSearchParams.set("includeDeleted", "true");
    const { rerender } = render(<IncludeDeletedToggle label="토글" />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");

    mockSearchParams.delete("includeDeleted");
    rerender(<IncludeDeletedToggle label="토글" />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
  });

  // 2. 켜기 액션 검증
  it("꺼진 토글을 클릭하면 trueValue를 주소창에 업데이트해야 한다", () => {
    render(<IncludeDeletedToggle label="토글" />);
    fireEvent.click(screen.getByRole("switch"));

    expect(mockUpdateQuery).toHaveBeenCalledWith({ includeDeleted: "true" });
  });

  // 3. 끄기 액션 검증
  it("켜진 토글을 클릭하면 falseValue(null)를 주소창에 업데이트해야 한다", () => {
    mockSearchParams.set("includeDeleted", "true");
    render(<IncludeDeletedToggle label="토글" />);
    fireEvent.click(screen.getByRole("switch"));

    expect(mockUpdateQuery).toHaveBeenCalledWith({ includeDeleted: null });
  });

  // 4. Props 커스텀 분기 검증
  it("queryKey, trueValue, falseValue를 커스텀하게 넘기면 변경된 규칙대로 작동해야 한다", () => {
    mockSearchParams.set("showAll", "Y"); // 커스텀 키/값 주입
    
    const { rerender } = render(
      <IncludeDeletedToggle 
        label="토글" 
        queryKey="showAll" 
        trueValue="Y" 
        falseValue="N" 
      />
    );
    
    // 커스텀 규칙대로 ?showAll=Y를 읽어서 켜졌는지 확인
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");

    // 클릭해서 끌 때 falseValue인 "N"이 전달되는지 확인
    fireEvent.click(screen.getByRole("switch"));
    expect(mockUpdateQuery).toHaveBeenCalledWith({ showAll: "N" });
  });

  // 5. 라벨 클릭 인터랙션 검증
  it("텍스트 라벨을 클릭해도 스위치가 연동되어 훅을 실행해야 한다", () => {
    render(<IncludeDeletedToggle label="글자를눌러봐" />);
    
    // 스위치 버튼이 아니라 글씨(Label)를 타겟팅해서 클릭
    const labelText = screen.getByText("글자를눌러봐");
    fireEvent.click(labelText);

    expect(mockUpdateQuery).toHaveBeenCalledTimes(1);
    expect(mockUpdateQuery).toHaveBeenCalledWith({ includeDeleted: "true" });
  });

  // 6. 비활성화 예외 방어 검증
  it("isDisabled가 true이면 속성이 잠기고 클릭 이벤트를 차단해야 한다", () => {
    render(<IncludeDeletedToggle label="잠긴토글" isDisabled={true} />);

    const switchButton = screen.getByRole("switch");
    expect(switchButton).toBeDisabled();

    // 강제 클릭 시도
    fireEvent.click(switchButton);
    expect(mockUpdateQuery).not.toHaveBeenCalled();
  });
});