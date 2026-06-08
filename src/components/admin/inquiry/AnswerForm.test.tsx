import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AnswerForm from "./AnswerForm";
import { publishAnswer } from "@/lib/adminApi/inquiry";

vi.mock("@/lib/adminApi/inquiry", () => ({
  publishAnswer: vi.fn(),
}));

const mockRefresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: mockRefresh,
  }),
}));

describe("AnswerForm 문의 답변 등록 로직 정밀 단위 테스트", () => {
  const inquiryId = 123;

  beforeEach(() => {
    vi.clearAllMocks();
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 1: [초기 상태] 안내문 비노출 및 버튼 비활성화 검증
  // ══════════════════════════════════════════════════════════════
  it("초기 렌더링 시 성공/실패 안내 메시지가 없어야 하고, 입력값이 없으므로 등록 버튼은 잠겨있어야 한다", () => {
    const { container } = render(<AnswerForm inquiryId={inquiryId} />);

    const textarea = container.querySelector("textarea");
    const submitButton = screen.getByRole("button", { name: "답변 등록" });

    expect(textarea).toHaveValue("");
    expect(submitButton).toBeDisabled();
    expect(screen.queryByText(/성공적으로 등록/)).not.toBeInTheDocument();
    expect(screen.queryByText(/등록에 실패했습니다/)).not.toBeInTheDocument();
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 2: [공백 방어] 의미 없는 문자열 차단벽 검증
  // ══════════════════════════════════════════════════════════════
  it("텍스트 필드에 공백이나 줄바꿈만 입력되었을 경우 등록 버튼이 활성화되지 않아야 한다", () => {
    const { container } = render(<AnswerForm inquiryId={inquiryId} />);

    const textarea = container.querySelector("textarea");
    const submitButton = screen.getByRole("button", { name: "답변 등록" });

    // 스페이스와 엔터 강제 주입
    if (textarea) fireEvent.change(textarea, { target: { value: "   \n\n   " } });

    expect(submitButton).toBeDisabled();
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 3: [비동기 로딩 락] 제출 중 화면 요소 완전 차단 검증
  // ══════════════════════════════════════════════════════════════
  it("서버로 데이터를 전송 중(isSubmitting)일 때는 입력창과 버튼이 모두 잠기고 글자가 바뀌어야 한다", async () => {
    // API 통신을 대기(Pending) 상태로 고정
    let resolvePublish: any;
    const pendingPromise = new Promise((resolve) => { resolvePublish = resolve; });
    vi.mocked(publishAnswer).mockReturnValueOnce(pendingPromise as any);

    const { container } = render(<AnswerForm inquiryId={inquiryId} />);
    const textarea = container.querySelector("textarea");
    const form = container.querySelector("form");

    if (textarea) fireEvent.change(textarea, { target: { value: "안녕하세요. 문의 주신 내용 답변 드립니다." } });
    if (form) fireEvent.submit(form);

    // 중복 전송이나 텍스트 수정을 막기 위한 트리플 락 검증
    expect(textarea).toBeDisabled();
    expect(screen.getByRole("button", { name: "등록 중..." })).toBeDisabled();

    resolvePublish(); // 대기 해제
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 4: [성공 사이클 완료] 폼 리셋, 안내 노출, 영구 락 검증
  // ══════════════════════════════════════════════════════════════
  it("답변 등록이 성공하면 입력창이 비워지고, 성공 문구가 뜨며, 창과 버튼이 영구적으로 비활성화되어야 한다", async () => {
    vi.mocked(publishAnswer).mockResolvedValueOnce({} as any);
    const { container } = render(<AnswerForm inquiryId={inquiryId} />);

    const textarea = container.querySelector("textarea");
    if (textarea) fireEvent.change(textarea, { target: { value: "완벽한 답변 내용" } });
    
    const form = container.querySelector("form");
    if (form) fireEvent.submit(form);

    // 1. API 호출 정보 일치 확인
    await waitFor(() => {
      expect(publishAnswer).toHaveBeenCalledWith(123, "완벽한 답변 내용");
    });

    // 2. 성공 UI 및 입력 폼 초기화 확인
    expect(screen.getByText(/✓ 답변이 성공적으로 등록되었습니다/)).toBeInTheDocument();
    expect(textarea).toHaveValue("");

    // 3. 완료 상태이므로 더 이상 입력/제출을 못 하도록 셧다운 되었는지 검증
    expect(textarea).toBeDisabled();
    expect(screen.getByRole("button", { name: "답변 등록" })).toBeDisabled();
    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 5: [실패 핸들링] 실패 안내 노출 및 재시도 락 해제 검증
  // ══════════════════════════════════════════════════════════════
  it("등록에 실패하면 에러 문구가 노출되지만, 재시도를 위해 입력창과 버튼의 잠금이 풀려야 한다", async () => {
    vi.mocked(publishAnswer).mockRejectedValueOnce(new Error("네트워크 서버 폭파"));
    const { container } = render(<AnswerForm inquiryId={inquiryId} />);

    const textarea = container.querySelector("textarea");
    if (textarea) fireEvent.change(textarea, { target: { value: "실패할 답변 내용" } });
    
    const form = container.querySelector("form");
    if (form) fireEvent.submit(form);

    // 에러 발생 이후 검증
    await waitFor(() => {
      expect(screen.getByText(/✕ 답변 등록에 실패했습니다/)).toBeInTheDocument();
    });

    // 재수정을 해야 하므로 다시 원래대로 사용 가능한 상태여야 함
    expect(textarea).not.toBeDisabled();
    expect(screen.getByRole("button", { name: "답변 등록" })).not.toBeDisabled();
    expect(textarea).toHaveValue("실패할 답변 내용"); // 입력값도 보존되어야 함
  });


  // ══════════════════════════════════════════════════════════════
  // TEST 6: [실패 후 재시도] 다시 보낼 때 이전 에러 가리기 검증
  // ══════════════════════════════════════════════════════════════
  it("실패 문구가 떠 있는 상태에서 다시 등록을 제출하면 기존 에러 메시지가 화면에서 즉시 청소되어야 한다", async () => {
    // 1. 첫 번째 시도 실패 유도
    vi.mocked(publishAnswer).mockRejectedValueOnce(new Error("첫 실패"));
    const { container } = render(<AnswerForm inquiryId={inquiryId} />);

    const textarea = container.querySelector("textarea");
    if (textarea) fireEvent.change(textarea, { target: { value: "다시 쓰는 답변" } });
    
    const form = container.querySelector("form");
    if (form) fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(/✕ 답변 등록에 실패했습니다/)).toBeInTheDocument();
    });

    // 2. 두 번째 시도 실행 (제출 누르는 시점 펜딩)
    vi.mocked(publishAnswer).mockReturnValueOnce(new Promise(() => {})); // 풀리지 않는 프로미스
    if (form) fireEvent.submit(form);

    // handleSubmit 시작 시점에 setStatus("idle") 처리에 의해 실패 문구가 지워졌는지 즉시 검증
    expect(screen.queryByText(/✕ 답변 등록에 실패했습니다/)).not.toBeInTheDocument();
  });
});