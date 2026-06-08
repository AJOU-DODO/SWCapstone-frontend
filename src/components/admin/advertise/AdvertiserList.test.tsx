import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import AdvertiserList from "./AdvertiserList";
import { getAdvertisers } from "@/lib/adminApi/advertise";

// 1. API 호출 함수 모킹
vi.mock("@/lib/adminApi/advertise", () => ({
  getAdvertisers: vi.fn(),
}));

// 2. 하위 페이지네이션 컴포넌트 껍데기 모킹
vi.mock("@/components/admin/Pagination", () => ({
  default: ({ currentPage, onPageChange }: any) => (
    <div data-testid="mock-pagination">
      <button onClick={() => onPageChange(currentPage + 1)} data-testid="next-page-btn">다음페이지</button>
    </div>
  ),
}));

describe("AdvertiserList 페이징 데이터 보정 단위 테스트", () => {
  const mockResponseData = {
    data: {
      content: [
        {
          userId: 1,
          nickname: "광고주A",
          email: "adA@example.com",
          allowedAdCount: 5,
          expiredAt: "2026-12-31T00:00:00.000Z",
          createdAt: "2026-06-01T00:00:00.000Z",
        },
      ],
      totalPages: 3,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 1: UI 페이지 번호 -> API 요청 시 0-Index 보정 계산 검증 (★ 핵심)
  // ══════════════════════════════════════════════════════════════
  it("컴포넌트가 처음 열릴 때(1페이지), API 서버에는 page 파라미터를 0으로 깎아서 요청해야 한다", async () => {
    vi.mocked(getAdvertisers).mockResolvedValueOnce(mockResponseData as any);

    render(<AdvertiserList isOpen={true} onClose={vi.fn()} />);

    // 1페이지 상태이므로 서버에는 1 - 1 = 0 이 찔려야 함
    await waitFor(() => {
      expect(getAdvertisers).toHaveBeenCalledWith({ page: 0 });
    });
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 2: 페이지 변경 시 데이터 보정 연산 연속 검증
  // ══════════════════════════════════════════════════════════════
  it("페이지네이션을 통해 2페이지로 상태가 변경되면, API 서버에는 page: 1로 보정하여 요청해야 한다", async () => {
    vi.mocked(getAdvertisers).mockResolvedValue(mockResponseData as any);

    render(<AdvertiserList isOpen={true} onClose={vi.fn()} />);

    // 가짜 페이지네이션의 '다음페이지' 버튼 클릭 (1페이지 -> 2페이지로 상태 변경 유도)
    const nextBtn = await screen.findByTestId("next-page-btn");
    nextBtn.click();

    // 2페이지 상태이므로 서버에는 2 - 1 = 1 이 찔려야 함
    await waitFor(() => {
      expect(getAdvertisers).toHaveBeenCalledWith({ page: 1 });
    });
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 3: 광고주 데이터가 0개일 때 분기 로직 방어 검증
  // ══════════════════════════════════════════════════════════════
  it("서버에서 내려준 광고주 content 배열이 비어있으면 빈 화면 안내 문구를 노출해야 한다", async () => {
    const emptyResponse = {
      data: {
        content: [],
        totalPages: 1,
      },
    };
    vi.mocked(getAdvertisers).mockResolvedValueOnce(emptyResponse as any);

    render(<AdvertiserList isOpen={true} onClose={vi.fn()} />);

    // '등록된 광고주가 없습니다.' 문구가 정상적으로 방어벽을 치고 렌더링되는지 확인
    const emptyMessage = await screen.findByText("등록된 광고주가 없습니다.");
    expect(emptyMessage).toBeInTheDocument();
  });
});