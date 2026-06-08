import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RejectButton from "./RejectButton";
import { rejectAdvertisement } from "@/lib/adminApi/advertise";

vi.mock("@/lib/adminApi/advertise", () => ({
  rejectAdvertisement: vi.fn(),
}));

describe("RejectButton 광고 반려 로직 데이터 단위 테스트", () => {
  const defaultProps = {
    adId: 888,
    onSuccess: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ══════════════════════════════════════════════════════════════
  // TEST 1: 공백만 입력했을 때 API 요청 차단 방어벽 검증
  // ══════════════════════════════════════════════════════════════
  it("반려 사유에 의미 없는 공백(스페이스바)만 입력하고 전송하면 API 요청을 차단해야 한다", () => {
    render(<RejectButton {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: "반려하기" }));

    // 실제 코드의 textarea placeholder 텍스트 정규식으로 정확하게 매칭 수정 완료
    const textarea = screen.getByPlaceholderText(/첨부된 이미지의 화질이 너무 낮거나/);
    fireEvent.change(textarea, { target: { value: "     " } });

    const form = screen.getByRole("button", { name: "반려 확정" }).closest("form");
    if (form) fireEvent.submit(form);

    expect(rejectAdvertisement).not.toHaveBeenCalled();
  });

  // ══════════════════════════════════════════════════════════════
  // TEST 2: 반려 사유 좌우 공백 제거(trim) 및 API 호출 페이로드 검증
  // ══════════════════════════════════════════════════════════════
  it("반려 사유 양 끝에 공백이 포함되어 있으면 이를 제거하고 정제된 데이터로 API를 호출해야 한다", async () => {
    vi.mocked(rejectAdvertisement).mockResolvedValueOnce(undefined as any);
    render(<RejectButton {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: "반려하기" }));

    const textarea = screen.getByPlaceholderText(/첨부된 이미지의 화질이 너무 낮거나/);
    fireEvent.change(textarea, { target: { value: "   이미지 화질 저하 및 규정 위반   " } });

    const form = screen.getByRole("button", { name: "반려 확정" }).closest("form");
    if (form) fireEvent.submit(form);

    await waitFor(() => {
      expect(rejectAdvertisement).toHaveBeenCalledWith({
        proposalId: 888,
        rejectReason: "이미지 화질 저하 및 규정 위반",
      });
    });

    expect(defaultProps.onSuccess).toHaveBeenCalledTimes(1);
  });
});