import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CommentItem } from "./CommentList";
import { useReportActions } from "@/lib/hooks/useReportActions";

// 2차 중첩 모달(UserSanctionModal) 내부에서 실행하는 실제 외부 API를 목킹
vi.mock("@/lib/adminApi/user", () => ({
  sanctionUser: vi.fn(() => Promise.resolve({ success: true })),
}));

// 커스텀 훅 레이어 목킹 
vi.mock("@/lib/hooks/useReportActions", () => ({
  useReportActions: vi.fn(),
}));

describe("CommentItem 어드민 상태별 권한 버튼 가드 및 액션 훅 연동 테스트", () => {
  const mockHandleReject = vi.fn();
  const mockHandleDelete = vi.fn();
  
  const defaultProps = {
    authorId: 11,
    profileImageUrl: "",
    commentId: 555,
    nickname: "불량유저",
    content: "스팸 광고 내용입니다.",
    reportCount: 15,
    likeCount: 2,
    childrenComments: [],
    createdAt: "2026-06-08T12:00:00Z",
    deleted: false,
    triggerRefresh: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useReportActions).mockImplementation(({ onSuccess }: any) => {
      return {
        handleCommentRejectReport: () => { mockHandleReject(); onSuccess(); },
        handleCommentDelete: (reason: string) => { mockHandleDelete(reason); onSuccess(); },
        isLoading: false,
      } as any;
    });
  });

  // ══════════════════════════════════════════════════════════════
  // TEST 1: [신고 취소 가드] 누적 신고 있을 때만 취소 단추 노출
  // ══════════════════════════════════════════════════════════════
  it("댓글이 삭제되지 않았고 신고 수가 1개 이상 존재할 때만 '취소' 버튼이 노출되어야 한다", () => {
    render(<CommentItem {...defaultProps} reportCount={5} deleted={false} />);

    expect(screen.getByRole("button", { name: "취소" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "삭제" })).toBeInTheDocument();
  });

  // ══════════════════════════════════════════════════════════════
  // TEST 2: [신고 제로 가드] 누적 신고 0개일 때 취소 단추 은닉
  // ══════════════════════════════════════════════════════════════
  it("댓글이 삭제되지 않았더라도 신고 카운트가 0일 때는 '취소(반려)' 버튼이 화면에서 은닉되어야 한다", () => {
    render(<CommentItem {...defaultProps} reportCount={0} deleted={false} />);

    expect(screen.queryByRole("button", { name: "취소" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "삭제" })).toBeInTheDocument();
  });

  // ══════════════════════════════════════════════════════════════
  // TEST 3: [블랙아웃 가드] 이미 삭제된 댓글의 버튼 전면 차단
  // ══════════════════════════════════════════════════════════════
  it("이미 삭제 처리 완료(deleted가 true)된 댓글은 그 어떤 어드민 액션 버튼도 노출해선 안 된다", () => {
    render(<CommentItem {...defaultProps} reportCount={10} deleted={true} />);

    expect(screen.queryByRole("button", { name: "취소" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "삭제" })).not.toBeInTheDocument();
  });

  // ══════════════════════════════════════════════════════════════
  // TEST 4: [액션 브릿지 1] 반려 모달 확정 시 커스텀 훅 호출 연동
  // ══════════════════════════════════════════════════════════════
  it("취소 버튼을 누르고 반려 모달에서 최종 확정하면 커스텀 훅의 handleCommentRejectReport가 호출되어야 한다", async () => {
    render(<CommentItem {...defaultProps} reportCount={3} deleted={false} />);

    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    const rejectConfirmButton = screen.getByRole("button", { name: "확인" });
    fireEvent.click(rejectConfirmButton);

    await waitFor(() => {
      expect(mockHandleReject).toHaveBeenCalledTimes(1);
      expect(defaultProps.triggerRefresh).toHaveBeenCalledTimes(1);
    });
  });

  // ══════════════════════════════════════════════════════════════
  // TEST 5: [액션 브릿지 2] 삭제 모달 확정 시 사유 전달 및 훅 연동
  // ══════════════════════════════════════════════════════════════
  it("삭제 버튼을 누르고 삭제 모달에서 사유와 함께 최종 확정하면 handleCommentDelete 훅으로 사유가 배달되어야 한다", async () => {
    render(<CommentItem {...defaultProps} deleted={false} />);

    fireEvent.click(screen.getByRole("button", { name: "삭제" }));

    const deleteReasonInput = screen.getByPlaceholderText(
      "해당 콘텐츠를 삭제하는 사유를 입력하세요. (미입력시 기본값 적용)"
    );
    fireEvent.change(deleteReasonInput, { target: { value: "부적절한 내용" } });

    const firstConfirmButton = screen.getByRole("button", { name: "확인" });
    fireEvent.click(firstConfirmButton);

    const input = await screen.findByPlaceholderText("해당 유저의 제재 이유를 적어주세요");
    fireEvent.change(input, { target: { value: "부적절한 내용" } });

    const finalSubmitButton = screen.getByRole("button", { name: "제재 및 삭제" });
    fireEvent.click(finalSubmitButton);

    await waitFor(() => {
      expect(mockHandleDelete).toHaveBeenCalledWith("부적절한 내용");
      expect(defaultProps.triggerRefresh).toHaveBeenCalledTimes(1);
    });
  });

  // ══════════════════════════════════════════════════════════════
  // TEST 6: [히트맵 위험군] 누적 신고 20개 이상일 때의 빨간색 매핑
  // ══════════════════════════════════════════════════════════════
  it("신고 수가 위험 기준치인 20개 이상일 때는 고위험 등급인 빨간색 배경 클래스가 박혀야 한다", () => {
    const { container } = render(<CommentItem {...defaultProps} reportCount={20} deleted={false} />);
    const commentRow = container.firstChild as HTMLElement;

    expect(commentRow.className).toContain("bg-red-200/90");
  });

  // ══════════════════════════════════════════════════════════════
  // TEST 7: [히트맵 예외] 이미 삭제 완료된 댓글의 그레이아웃 강제화
  // ══════════════════════════════════════════════════════════════
  it("신고 수가 아무리 많아도 이미 삭제된 댓글(deleted: true)이라면 히트맵을 덮어쓰고 회색 배경이 되어야 한다", () => {
    const { container } = render(<CommentItem {...defaultProps} reportCount={50} deleted={true} />);
    const commentRow = container.firstChild as HTMLElement;

    expect(commentRow).toHaveClass("bg-gray-50");
    expect(commentRow).toHaveClass("opacity-70");
  });
});