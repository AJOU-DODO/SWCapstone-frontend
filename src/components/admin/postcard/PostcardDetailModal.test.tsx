import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import PostcardDetailModal from "./PostcardDetailModal";
import { getReportDetail } from "@/lib/adminApi/nest";
import { PostcardList } from "@/types/indexAdmin";

// 1. 비동기 데이터 패칭 API 레이어 모킹
vi.mock("@/lib/adminApi/nest", () => ({
  getReportDetail: vi.fn(),
}));

// 2. 내부 인터랙션 훅은 최소한의 깡통으로 대체 (스토리북에서 검증할 영역)
vi.mock("@/lib/hooks/useReportActions", () => ({
  useReportActions: () => ({
    handlePostcardRejectReport: vi.fn(),
    handlePostcardDelete: vi.fn(),
    isLoading: false,
  }),
}));

// Next.js Image 컴포넌트 경량화 모킹
vi.mock("next/image", () => ({
  default: (props: any) => <img {...props} />,
}));

describe("PostcardDetailModal 비동기 데이터 사유 맵핑 테스트 (정밀 타입 반영)", () => {
  const basePostcard: PostcardList = {
    authorId: 99,
    postcardId: 77,
    authorNickname: "도도새",
    content: "엽서 본문 내용",
    imageUrl: "/test-image.jpg",
    createdAt: "2026-06-01T00:00:00Z",
    firstReportedAt: "2026-06-02T00:00:00Z",
    lastReportedAt: "2026-06-03T00:00:00Z",
    reportCount: 5,
    reasons: ["SPAM" as any],
    deleted: false,
  };

  const defaultProps = {
    onClose: vi.fn(),
    triggerRefresh: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 1: [기타 사유 성공] 데이터 패칭 및 문구 결합 검증
  // ══════════════════════════════════════════════════════════════
  it("reasons 배열 내에 'OTHER'가 존재할 경우, 정확한 파라미터로 상세 조회를 요청하고 문구를 결합해야 한다", async () => {
    // 백엔드 성공 데이터 결과 모킹
    vi.mocked(getReportDetail).mockResolvedValueOnce({
      data: { otherReportContents: ["정치적 분란 유도"] },
    } as any);

    // OTHER 사유 주입
    const postcardWithOther: PostcardList = { 
      ...basePostcard, 
      reasons: ["SPAM" as any, "OTHER" as any] 
    };
    
    render(<PostcardDetailModal {...defaultProps} postcard={postcardWithOther} />);

    // API 호출 인자(targetType, targetId) 검증
    expect(getReportDetail).toHaveBeenCalledWith({ 
      targetType: "POSTCARD", 
      targetId: 77 
    });

    // 화면에 '기타: [사유]' 형태로 최종 데이터가 안전하게 파싱되었는지 검증
    await waitFor(() => {
      expect(screen.getByText("기타: 정치적 분란 유도")).toBeInTheDocument();
    });
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 2: [기타 사유 실패] 에러 캐치 핸들링 방어벽 검증
  // ══════════════════════════════════════════════════════════════
  it("상세 사유 API 호출이 실패(Error)하더라도 컴포넌트가 다운되지 않고 대체 안내 문구를 띄워야 한다", async () => {
    // 의도적인 네트워크 타임아웃 셧다운 발생 유도
    vi.mocked(getReportDetail).mockRejectedValueOnce(new Error("Network Error"));

    const postcardWithOther: PostcardList = { 
      ...basePostcard, 
      reasons: ["OTHER" as any] 
    };
    
    render(<PostcardDetailModal {...defaultProps} postcard={postcardWithOther} />);

    // 예외 처리 문구 정상 출력 검증
    await waitFor(() => {
      expect(screen.getByText("OTHER (상세 사유 로드 실패)")).toBeInTheDocument();
    });
  });
});