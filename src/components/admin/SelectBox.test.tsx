import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SelectBox } from "./SelectBox"; 

beforeEach(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

describe("SelectBox 컴포넌트 테스트", () => {
  const mockOptions = [
    { value: "apple", label: "사과" },
    { value: "banana", label: "바나나" },
    { value: "cherry", label: "체리" },
  ];

  // 1. 초기 렌더링 검증
  it("현재 value에 해당하는 올바른 label이 선택창에 표시되어야 한다", () => {
    render(<SelectBox value="banana" onChange={vi.fn()} options={mockOptions} />);
    
    // 처음에 "바나나"라는 글자가 화면(Trigger)에 보여야 함
    expect(screen.getByText("바나나")).toBeInTheDocument();
  });

  // 2. 드롭다운 노출 검증
  it("셀렉트 박스를 클릭하면 모든 옵션 목록이 화면에 노출되어야 한다", async () => {
    render(<SelectBox value="" onChange={vi.fn()} options={mockOptions} />);

    // 처음에는 드롭다운 아이템들이 보이지 않아야 함
    expect(screen.queryByText("사과")).not.toBeInTheDocument();

    // 셀렉트 박스 트리거 클릭!
    const combobox = screen.getByRole("combobox");
    fireEvent.click(combobox);

    // 클릭 후 비동기적으로 레이어가 뜨면서 "사과", "체리"가 화면에 잡혀야 함
    await waitFor(() => {
      expect(screen.getByText("사과")).toBeInTheDocument();
      expect(screen.getByText("체리")).toBeInTheDocument();
    });
  });

  // 3. 옵션 선택 시 onChange 실행 검증
  it("옵션을 클릭하면 해당 옵션의 value와 함께 onChange 콜백이 호출되어야 한다", async () => {
    const mockOnChange = vi.fn();
    render(<SelectBox value="apple" onChange={mockOnChange} options={mockOptions} />);

    // 1. 셀렉트 박스 열기
    fireEvent.click(screen.getByRole("combobox"));

    // 2. 바나나 옵션이 보일 때까지 대기 후 클릭
    const bananaOption = await screen.findByText("바나나");
    fireEvent.click(bananaOption);

    // 3. onChange가 실행되면서 'banana'를 인자로 받았는지 확인
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith("banana");
  });

  // 4. 빈 옵션 배열 입력 시 예외 방어 검증
  it("options가 빈 배열로 들어와도 크래시가 나지 않고 정상 작동해야 한다", () => {
    // 빈 배열을 넣고 렌더링해도 컴포넌트가 폭발하지 않는지 확인
    expect(() => {
      render(<SelectBox value="" onChange={vi.fn()} options={[]} />);
    }).not.toThrow();

    // 기본 플레이스홀더인 "선택"이 잘 보이는지 체크
    expect(screen.getByText("선택")).toBeInTheDocument();
  });
});