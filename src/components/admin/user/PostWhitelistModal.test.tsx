import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PostWhitelistModal from "./PostWhitelistModal";
import { postWhitelist } from "@/lib/adminApi/user";

vi.mock("@/lib/adminApi/user", () => ({
  postWhitelist: vi.fn(),
}));

describe("PostWhitelistModal 이메일 공백 정제 및 폼 서브밋 정밀 테스트", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    setIsUpdated: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 1: [공백문자 차단] 빈 값 입력 시 alert 브레이크 검증
  // ══════════════════════════════════════════════════════════════
  it("이메일 입력창이 비어있거나 공백만 가득할 경우 alert을 띄우고 백엔드 API 요청을 중단해야 한다", () => {
    render(<PostWhitelistModal {...defaultProps} />);

    const emailInput = screen.getByPlaceholderText("example@email.com");
    const form = screen.getByRole("button", { name: "추가하기" }).closest("form")!;

    fireEvent.change(emailInput, { target: { value: "    " } });
    fireEvent.submit(form);

    expect(window.alert).toHaveBeenCalledWith("이메일을 입력해 주세요.");
    expect(postWhitelist).not.toHaveBeenCalled();
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 2: [데이터 전처리] 앞뒤 화이트스페이스 trim 처리 검증
  // ══════════════════════════════════════════════════════════════
  it("이메일과 비고 내용의 앞뒤에 섞인 지저분한 공백들이 전송 직전 .trim()으로 완벽히 멸균 처리되어야 한다", async () => {
    vi.mocked(postWhitelist).mockResolvedValueOnce({} as any);
    render(<PostWhitelistModal {...defaultProps} />);

    const emailInput = screen.getByPlaceholderText("example@email.com");
    const remarkInput = screen.getByPlaceholderText(/해당 유저에 대한 메모를 입력하세요/);
    const submitButton = screen.getByRole("button", { name: "추가하기" });

    fireEvent.change(emailInput, { target: { value: "   clean@email.com  " } });
    fireEvent.change(remarkInput, { target: { value: "  admin1  " } }); 
    fireEvent.click(submitButton);

    expect(postWhitelist).toHaveBeenCalledWith({
      email: "clean@email.com",
      remark: "admin1", 
    });

    await waitFor(() => {
      expect(defaultProps.setIsUpdated).toHaveBeenCalledTimes(1);
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });
  });
});