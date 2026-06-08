import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { NestImageScrollSlider } from "./NestImageScrollSlider";

describe("NestImageScrollSlider 인덱스 기반 스크롤 계산 및 렌더링 가드 테스트", () => {
  const mockImages = ["/img1.jpg", "/img2.jpg", "/img3.jpg"];

  // 실제 DOM의 scrollTo 메서드가 jsdom 환경에 없을 수 있으므로 스파이 함수로 대체 매핑
  const mockScrollTo = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    Object.defineProperty(HTMLElement.prototype, "scrollTo", {
      configurable: true,
      value: mockScrollTo,
    });

    Object.defineProperty(HTMLElement.prototype, "clientWidth", {
      configurable: true,
      value: 400,
    });
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 1: [핵심] scrollTo 계산식 (너비 * 인덱스) 검증
  // ══════════════════════════════════════════════════════════════
  it("3번째 썸네일(인덱스 2)을 클릭하면 컨테이너 너비(400px) * 2인 800px 지점으로 smooth 스크롤 명령이 나가야 한다", () => {
    render(<NestImageScrollSlider imageUrls={mockImages} />);

    // 3번째 썸네일 이미지 찾아서 타격
    const thumbnail3 = screen.getByAltText("썸네일 3");
    fireEvent.click(thumbnail3);

    // left = clientWidth(400) * index(2) = 800
    expect(mockScrollTo).toHaveBeenCalledWith({
      left: 800,
      behavior: "smooth",
    });
    expect(mockScrollTo).toHaveBeenCalledTimes(1);
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 2: [이미지 제로 방어] 빈 배열 주입 시 null 반환 검증
  // ══════════════════════════════════════════════════════════════
  it("이미지 주소 배열이 텅 비어있다면 메인 슬라이더 박스조차 화면에 렌더링되지 않고 null 처리가 되어야 한다", () => {
    const { container } = render(<NestImageScrollSlider imageUrls={[]} />);

    // 컴포넌트 내부 최상단 if (imageUrls.length === 0) return null; 조건문 통과 검증
    expect(container.firstChild).toBeNull();
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 3: [썸네일 가드] 이미지 1장일 때 하단 인덱서 은닉 검증
  // ══════════════════════════════════════════════════════════════
  it("이미지가 딱 1장만 존재할 때는 하단 미니 썸네일 내비게이터 바가 화면에 노출되지 않아야 한다", () => {
    render(<NestImageScrollSlider imageUrls={["/only-one.jpg"]} />);

    // 메인 본문 이미지는 그려지되, 하단 조작용 '썸네일 1' 단추는 노출되면 안 됨
    expect(screen.getByAltText("본문 이미지 1")).toBeInTheDocument();
    expect(screen.queryByAltText("썸네일 1")).not.toBeInTheDocument();
  });
});