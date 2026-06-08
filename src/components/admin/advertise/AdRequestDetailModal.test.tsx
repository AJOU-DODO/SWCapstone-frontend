import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import AdDetailModal from "./AdRequestDetailModal";
import { PendingAdvertisement } from "@/types/indexAdmin";

// 하위 컴포넌트들(ApproveButton, RejectButton) 모킹
vi.mock("@/components/admin/advertise/ApproveButton", () => ({ default: () => <button>승인</button> }));
vi.mock("@/components/admin/advertise/RejectButton", () => ({ default: () => <button>반려</button> }));

describe("AdDetailModal 데이터 예외 방어 단위 테스트", () => {
  const baseAd: PendingAdvertisement = {
    id: 1,
    advertiserId: 42,
    advertiserNickname: "맥도날드",
    title: "새로운 버거 출시 기념 할인",
    content: "선착순 100명만 할인합니다.",
    latitude: 37.1234,
    longitude: 127.1234,
    unlockRadius: 500,
    imageUrls: [], 
    categoryIds: [10, 11],
    categoryNames: ["식당", "햄버거"],
    status: "PENDING", 
    rejectReason: null, 
    createdAt: "2026-06-08T11:00:00.000Z",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 1: 첨부 이미지가 존재할 때 이미지 태그 정상 노출 검증
  // ══════════════════════════════════════════════════════════════
  it("imageUrls 배열에 이미지 주소가 들어있으면, 개수만큼 이미지 태그를 정상적으로 렌더링해야 한다", () => {
    const adWithImages: PendingAdvertisement = {
      ...baseAd,
      imageUrls: ["https://example.com/img1.jpg", "https://example.com/img2.jpg"],
    };

    render(<AdDetailModal ad={adWithImages} onClose={vi.fn()} />);

    expect(screen.getByText("첨부 이미지")).toBeInTheDocument();
    
    // 승인/반려 버튼과 이미지 2개를 포함해서 총 4개의 엘리먼트가 잡히는지 검증
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute("src", "https://example.com/img1.jpg");
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 2: 첨부 이미지가 비어있을 때 크래시 방어 검증
  // ══════════════════════════════════════════════════════════════
  it("imageUrls가 빈 배열일 때 컴포넌트가 터지지 않고 타이틀을 숨겨야 한다", () => {
    const adWithoutImages: PendingAdvertisement = {
      ...baseAd,
      imageUrls: [], // 이미지가 완전히 없는 상태
    };

    // 렌더링 시 map 연산 오류로 인한 백화현상(Crash)이 발생하지 않는지 방어벽 검증
    expect(() => {
      render(<AdDetailModal ad={adWithoutImages} onClose={vi.fn()} />);
    }).not.toThrow();

    // 화면에 '첨부 이미지' 섹션 자체가 그려지지 않았는지 확인
    expect(screen.queryByText("첨부 이미지")).not.toBeInTheDocument();
  });
});