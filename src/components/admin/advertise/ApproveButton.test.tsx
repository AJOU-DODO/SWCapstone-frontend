import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ApproveButton from "./ApproveButton";
import { approveAdvertisement } from "@/lib/adminApi/advertise";

vi.mock("@/lib/adminApi/advertise", () => ({
  approveAdvertisement: vi.fn(),
}));

const mockAlert = vi.spyOn(window, "alert").mockImplementation(() => {});

describe("ApproveButton 광고 승인 로직 데이터 단위 테스트", () => {
  const defaultProps = {
    adId: 777,
    onSuccess: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ══════════════════════════════════════════════════════════════
  // TEST 1: 광고 만료일 미선택 시 유효성 경고 검증
  // ══════════════════════════════════════════════════════════════
  it("광고 만료일을 선택하지 않고 제출하면 alert 경고창을 띄우고 API 요청을 차단해야 한다", () => {
    render(<ApproveButton {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: "승인하기" }));

    const form = screen.getByRole("button", { name: "최종 승인" }).closest("form");
    if (form) fireEvent.submit(form);

    expect(mockAlert).toHaveBeenCalledWith("광고 만료일을 선택해 주세요.");
    expect(approveAdvertisement).not.toHaveBeenCalled();
  });

  // ══════════════════════════════════════════════════════════════
  // TEST 2: 고정 단계 선택 시 날짜 시간 합성 및 API 페이로드 검증
  // ══════════════════════════════════════════════════════════════
  it("고정 노출도(예: 3단계 60점)를 선택하면 날짜 뒤에 당일 최종 시각을 붙여 ISO 주소로 전송해야 한다", async () => {
    vi.mocked(approveAdvertisement).mockResolvedValueOnce(undefined as any);
    const { container } = render(<ApproveButton {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: "승인하기" }));

    const dateInput = container.querySelector('input[type="date"]');
    const selectBox = container.querySelector('select');
    
    if (dateInput) fireEvent.change(dateInput, { target: { value: "2026-06-15" } });
    if (selectBox) fireEvent.change(selectBox, { target: { value: "60" } });

    const form = screen.getByRole("button", { name: "최종 승인" }).closest("form");
    if (form) fireEvent.submit(form);

    await waitFor(() => {
      expect(approveAdvertisement).toHaveBeenCalledWith({
        proposalId: 777,
        body: {
          expiredAt: "2026-06-15T23:59:59.999Z",
          priorityScore: 60,
        },
      });
    });
  });

  // ══════════════════════════════════════════════════════════════
  // TEST 3: 직접 입력 선택 시 범위를 넘어간 점수의 자동 보정(Clamping) 검증
  // ══════════════════════════════════════════════════════════════
  it("직접 입력으로 100을 초과하는 점수를 입력하고 제출하면 최대치인 100점으로 보정하여 전송해야 한다", async () => {
    vi.mocked(approveAdvertisement).mockResolvedValueOnce(undefined as any);
    const { container } = render(<ApproveButton {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: "승인하기" }));

    const dateInput = container.querySelector('input[type="date"]');
    const selectBox = container.querySelector('select');
    
    if (dateInput) fireEvent.change(dateInput, { target: { value: "2026-06-15" } });
    if (selectBox) fireEvent.change(selectBox, { target: { value: "custom" } });

    // 직접 입력을 골라 동적으로 튀어나온 최신 상태의 number 인풋 타깃팅
    const customInput = container.querySelector('input[type="number"]');
    if (customInput) fireEvent.change(customInput, { target: { value: "150" } });

    const form = screen.getByRole("button", { name: "최종 승인" }).closest("form");
    if (form) fireEvent.submit(form);

    await waitFor(() => {
      expect(approveAdvertisement).toHaveBeenCalledWith({
        proposalId: 777,
        body: {
          expiredAt: "2026-06-15T23:59:59.999Z",
          priorityScore: 100,
        },
      });
    });
  });

  // ══════════════════════════════════════════════════════════════
  // TEST 4: 소수점 입력 시 올바르지 않은 정수 필터링 검증
  // ══════════════════════════════════════════════════════════════
  it("직접 입력 시 소수점(정수가 아닌 수)을 입력하면 경고를 띄우고 전송을 차단해야 한다", () => {
    const { container } = render(<ApproveButton {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: "승인하기" }));

    const dateInput = container.querySelector('input[type="date"]');
    const selectBox = container.querySelector('select');
    
    if (dateInput) fireEvent.change(dateInput, { target: { value: "2026-06-15" } });
    if (selectBox) fireEvent.change(selectBox, { target: { value: "custom" } });

    const customInput = container.querySelector('input[type="number"]');
    if (customInput) fireEvent.change(customInput, { target: { value: "55.5" } });

    const form = screen.getByRole("button", { name: "최종 승인" }).closest("form");
    if (form) fireEvent.submit(form);

    expect(mockAlert).toHaveBeenCalledWith("노출도에 올바른 숫자를 입력해 주세요. (1부터 100 사이의 정수만 가능)");
    expect(approveAdvertisement).not.toHaveBeenCalled();
  });
});