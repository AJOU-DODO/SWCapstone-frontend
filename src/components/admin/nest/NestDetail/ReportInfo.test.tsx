import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ReportInfo from "./ReportInfo";
import { ReportDetail } from "@/types/indexAdmin";

describe("ReportInfo 신고 통계 기반 칩 은닉 및 토글 아코디언 가드 테스트", () => {
  
  const mockReportData: ReportDetail = {
    targetType: "NEST",
    targetId: 1024,
    stats: {
      pendingAbuseCount: 5, 
      pendingSpamCount: 0, 
      pendingAdvertisementCount: 1,
      pendingOtherCount: 2,
    },
    otherReportContents: [
      "그냥 꼴보기 싫어요.",
      "개인정보가 노출된 게시글입니다."
    ]
  };


  // ══════════════════════════════════════════════════════════════
  // TEST 1: [은닉 가드] count 가 0개인 데이터 원천 차단 검증
  // ══════════════════════════════════════════════════════════════
  it("신고 건수가 0건이거나 아예 데이터가 누락된 사유 카테고리는 화면에 칩 자체가 은닉 처리되어야 한다", () => {
    render(<ReportInfo report={mockReportData} />);

    expect(screen.getByText("욕설")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("광고")).toBeInTheDocument();

    // 20개인 도배는 화면에 그려지면 안됨
    expect(screen.queryByText("도배")).not.toBeInTheDocument();
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 2: [토글 액션] 기타 클릭 시 아코디언 상세 내역 개폐 검증
  // ══════════════════════════════════════════════════════════════
  it("기타 칩을 클릭하면 showOtherDetails 상태가 토글되면서 상세 사유 리스트 구역이 나타나야 한다", () => {
    render(<ReportInfo report={mockReportData} />);

    expect(screen.queryByText("💡 기타 상세 신고 사유 리스트")).not.toBeInTheDocument();

    const otherChip = screen.getByText("기타");
    fireEvent.click(otherChip);

    expect(screen.getByText("💡 기타 상세 신고 사유 리스트")).toBeInTheDocument();
    expect(screen.getByText("그냥 꼴보기 싫어요.")).toBeInTheDocument();
    expect(screen.getByText("개인정보가 노출된 게시글입니다.")).toBeInTheDocument();

    fireEvent.click(otherChip);
    expect(screen.queryByText("💡 기타 상세 신고 사유 리스트")).not.toBeInTheDocument();
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 3: [빈 데이터 가드] 토글이 켜져도 내용 없으면 은닉 검증
  // ══════════════════════════════════════════════════════════════
  it("기타 카운트는 존재하나 실제 상세 텍스트 배열(otherReportContents)이 비어있다면 칩을 눌러도 서랍장이 열리지 않아야 한다", () => {
    const emptyDetailData: ReportDetail = {
      targetType: "NEST",
      targetId: 1025,
      stats: {
        pendingOtherCount: 3, // 카운트는 존재하지만
      },
      otherReportContents: [] // 실제 사유 텍스트 원본이 비어버린 엣지 케이스
    };

    render(<ReportInfo report={emptyDetailData} />);

    // '기타' 칩 클릭
    const otherChip = screen.getByText("기타");
    fireEvent.click(otherChip);

    // 빈 껍데기 박스가 렌더링되어 UI 레이아웃이 깨지는 것을 방지하는 방어막 확인
    expect(screen.queryByText("💡 기타 상세 신고 사유 리스트")).not.toBeInTheDocument();
  });
});