/**
 * page.stories.tsx
 *
 * 관리자 문의사항 관리 페이지 통합 스토리
 *
 * 커버 범위
 *  - /admin/inquiry        : 목록 (InquiryPage)
 *  - /admin/inquiry/[id]   : 상세 + 답변 등록 (InquiryDetailPage)
 *
 * 기술 스택
 *  - Storybook 8 + @storybook/nextjs
 *  - MSW 2 (msw-storybook-addon v2)
 *  - @storybook/test  (userEvent / expect / waitFor)
 *  - Chromatic        (parameters.chromatic)
 *
 * 실제 API 경로 (코드 기준)
 *  GET  /api/v1/admin/inquiries              ← getInquiries  (axios)
 *  GET  /api/v1/admin/inquiries/:id          ← getInquiryDetail (fetch + Bearer)
 *  POST /api/v1/admin/inquiries/:id/answer   ← publishAnswer (axios)
 */

import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, waitFor } from '@storybook/test';
import { http, HttpResponse, delay } from 'msw';
import React, { useState, useEffect, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// 타입 — @/types/indexAdmin 그대로
// ═══════════════════════════════════════════════════════════════════════════════
type InquiryType   = 'ACCOUNT' | 'BUG' | 'SUGGESTION' | 'BUSINESS';
type InquiryStatus = 'PENDING' | 'COMPLETED';

interface Inquiry {
  id: number;
  userId: number;
  userNickname: string;
  type: InquiryType;
  typeDescription: string;
  title: string;
  status: InquiryStatus;
  statusDescription: string;
  createdAt: string;
  answeredAt: string;
}

interface InquiryData {
  content: Inquiry[];
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  empty: boolean;
}

interface InquiryDetail {
  id: number;
  userId: number;
  userNickname: string;
  type: InquiryType;
  typeDescription: string;
  title: string;
  content: string;
  answer: string;
  status: InquiryStatus;
  statusDescription: string;
  createdAt: string;
  answeredAt: string;
}

interface InquiryDetailResponse {
  status: string;
  code: string;
  message: string | null;
  data: InquiryDetail;
}

interface InquiriesApiResponse {
  status: string;
  code: string;
  message: string | null;
  data: InquiryData;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 목 데이터
// ═══════════════════════════════════════════════════════════════════════════════
const MOCK_PENDING: Inquiry[] = [
  {
    id: 1,
    userId: 101,
    userNickname: '홍길동',
    type: 'BUG',
    typeDescription: '버그 신고',
    title: '결제 화면에서 앱이 강제 종료됩니다',
    status: 'PENDING',
    statusDescription: '대기중',
    createdAt: '2025-05-01T10:00:00Z',
    answeredAt: '',
  },
  {
    id: 2,
    userId: 102,
    userNickname: '김철수',
    type: 'ACCOUNT',
    typeDescription: '계정',
    title: '소셜 로그인이 연동되지 않습니다',
    status: 'PENDING',
    statusDescription: '대기중',
    createdAt: '2025-05-03T14:30:00Z',
    answeredAt: '',
  },
  {
    id: 3,
    userId: 103,
    userNickname: '이영희',
    type: 'SUGGESTION',
    typeDescription: '건의사항',
    title: '다크 모드를 지원해주세요',
    status: 'PENDING',
    statusDescription: '대기중',
    createdAt: '2025-05-05T09:15:00Z',
    answeredAt: '',
  },
];

const MOCK_COMPLETED: Inquiry[] = [
  {
    id: 4,
    userId: 104,
    userNickname: '박지수',
    type: 'BUSINESS',
    typeDescription: '비즈니스',
    title: '기업 제휴 문의',
    status: 'COMPLETED',
    statusDescription: '처리완료',
    createdAt: '2025-04-20T11:00:00Z',
    answeredAt: '2025-04-22T15:00:00Z',
  },
  {
    id: 5,
    userId: 105,
    userNickname: '최민준',
    type: 'BUG',
    typeDescription: '버그 신고',
    title: '이미지 업로드 시 오류 발생',
    status: 'COMPLETED',
    statusDescription: '처리완료',
    createdAt: '2025-04-25T08:00:00Z',
    answeredAt: '2025-04-26T10:00:00Z',
  },
];

const makeMockDetail = (id: number, withAnswer = false): InquiryDetail => ({
  id,
  userId: 101,
  userNickname: '홍길동',
  type: 'BUG',
  typeDescription: '버그 신고',
  title: '결제 화면에서 앱이 강제 종료됩니다',
  content:
    '안녕하세요. 결제 진행 중 ERR_PAYMENT_DECLINED 오류와 함께 앱이 꺼집니다. ' +
    'iOS 17.4, 앱 버전 2.3.1 환경에서 재현됩니다.',
  answer: withAnswer
    ? 'v2.3.2 패치에서 수정되었습니다. 업데이트 후 재시도 부탁드립니다.'
    : '',
  status: withAnswer ? 'COMPLETED' : 'PENDING',
  statusDescription: withAnswer ? '처리완료' : '대기중',
  createdAt: '2025-05-01T10:00:00Z',
  answeredAt: withAnswer ? '2025-05-10T09:00:00Z' : '',
});

// API 응답 래퍼
const wrapList = (content: Inquiry[], totalPages = 2): InquiriesApiResponse => ({
  status: 'SUCCESS',
  code: '200',
  message: null,
  data: {
    content,
    last: false,
    totalElements: content.length * totalPages,
    totalPages,
    size: 10,
    number: 0,
    empty: content.length === 0,
  },
});

const wrapDetail = (detail: InquiryDetail): InquiryDetailResponse => ({
  status: 'SUCCESS',
  code: '200',
  message: null,
  data: detail,
});

// ═══════════════════════════════════════════════════════════════════════════════
// MSW 핸들러 팩토리
// ═══════════════════════════════════════════════════════════════════════════════
const API = '/api/v1/admin/inquiries';

/** 정상 응답 — PENDING/COMPLETED 분기, 상세 조회, 답변 등록 모두 성공 */
const handlersNormal = [
  http.get(API, async ({ request }) => {
    const status = new URL(request.url).searchParams.get('status');
    await delay(200);
    return HttpResponse.json(
      wrapList(status === 'COMPLETED' ? MOCK_COMPLETED : MOCK_PENDING)
    );
  }),
  http.get(`${API}/:id`, async ({ params }) => {
    await delay(150);
    return HttpResponse.json(wrapDetail(makeMockDetail(Number(params.id))));
  }),
  http.post(`${API}/:id/answer`, async () => {
    await delay(300);
    return HttpResponse.json({ status: 'SUCCESS', code: '200', message: null, data: null });
  }),
];

/** 이미 답변이 달린 상세 */
const handlersWithAnswer = [
  http.get(API, async ({ request }) => {
    const status = new URL(request.url).searchParams.get('status');
    await delay(200);
    return HttpResponse.json(
      wrapList(status === 'COMPLETED' ? MOCK_COMPLETED : MOCK_PENDING)
    );
  }),
  http.get(`${API}/:id`, async ({ params }) => {
    await delay(150);
    return HttpResponse.json(wrapDetail(makeMockDetail(Number(params.id), true)));
  }),
  http.post(`${API}/:id/answer`, async () => {
    await delay(300);
    return HttpResponse.json({ status: 'SUCCESS', code: '200', message: null, data: null });
  }),
];

/** 빈 목록 */
const handlersEmpty = [
  http.get(API, async () => {
    await delay(150);
    return HttpResponse.json(wrapList([], 0));
  }),
];

/** 목록 API 500 에러 */
const handlersListError = [
  http.get(API, async () => {
    await delay(150);
    return new HttpResponse(null, { status: 500 });
  }),
];

/** 상세 API 500 에러 (목록은 정상) */
const handlersDetailError = [
  http.get(API, async () => {
    await delay(200);
    return HttpResponse.json(wrapList(MOCK_PENDING));
  }),
  http.get(`${API}/:id`, async () => {
    await delay(150);
    return new HttpResponse(null, { status: 500 });
  }),
];

/** 답변 등록만 실패 */
const handlersAnswerFail = [
  http.get(API, async ({ request }) => {
    const status = new URL(request.url).searchParams.get('status');
    await delay(200);
    return HttpResponse.json(
      wrapList(status === 'COMPLETED' ? MOCK_COMPLETED : MOCK_PENDING)
    );
  }),
  http.get(`${API}/:id`, async ({ params }) => {
    await delay(150);
    return HttpResponse.json(wrapDetail(makeMockDetail(Number(params.id))));
  }),
  http.post(`${API}/:id/answer`, async () => {
    await delay(300);
    return new HttpResponse(null, { status: 500 });
  }),
];

/** 목록 무한 대기 — Chromatic 로딩 스냅샷용 */
const handlersLoading = [
  http.get(API, async () => {
    await delay(60_000);
    return HttpResponse.json(wrapList([]));
  }),
];

/** 상세 무한 대기 — Chromatic 로딩 스냅샷용 */
const handlersDetailLoading = [
  http.get(API, async () => {
    await delay(200);
    return HttpResponse.json(wrapList(MOCK_PENDING));
  }),
  http.get(`${API}/:id`, async () => {
    await delay(60_000);
    return HttpResponse.json(wrapDetail(makeMockDetail(1)));
  }),
];

// ═══════════════════════════════════════════════════════════════════════════════
// Stub 컴포넌트
// @storybook/nextjs 를 사용하면 실제 컴포넌트를 그대로 import 해도 됩니다.
// next/navigation (useRouter, useSearchParams, cookies) 은 자동 stub 처리됩니다.
// 아래 stub 은 next 없이도 독립 실행되는 버전입니다.
// ═══════════════════════════════════════════════════════════════════════════════

function StatusBadge({ label, status }: { label: string; status: InquiryStatus }) {
  const isPending = status === 'PENDING';
  return (
    <span
      className={`border-2 px-3 py-0.5 rounded text-sm font-medium cursor-default ${
        isPending
          ? 'border-amber-500 text-amber-600 bg-amber-50'
          : 'border-[#54513E] text-[#54513E] bg-[#54513E]/10'
      }`}
    >
      {label}
    </span>
  );
}

// ── InquiryTabButton ──────────────────────────────────────────────────────────
function InquiryTabButton({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  const cls = (tab: string) =>
    [
      'rounded-sm transition-all border-2 h-[52px] px-8',
      'border-[#54513E] bg-transparent flex items-center text-sm font-semibold cursor-pointer',
      activeTab === tab
        ? 'bg-[#54513E]/70 text-white hover:bg-[#54513E]/80'
        : 'text-[#54513E] hover:bg-[#54513E]/30',
    ].join(' ');

  return (
    <div className="flex gap-2">
      <button className={cls('PENDING')} onClick={() => onTabChange('PENDING')} data-testid="tab-pending">
        대기중
      </button>
      <button className={cls('COMPLETED')} onClick={() => onTabChange('COMPLETED')} data-testid="tab-completed">
        처리완료
      </button>
    </div>
  );
}

// ── InquiryTable ──────────────────────────────────────────────────────────────
function InquiryTable({
  inquiries,
  onRowClick,
  selectedId,
}: {
  inquiries: Inquiry[];
  onRowClick: (id: number) => void;
  selectedId: number | null;
}) {
  if (inquiries.length === 0) {
    return (
      <div
        className="flex items-center justify-center h-full text-gray-400 text-sm"
        data-testid="empty-state"
      >
        문의사항이 없습니다.
      </div>
    );
  }

  return (
    <div className="overflow-auto rounded-lg border border-gray-200" data-testid="inquiry-table">
      <table className="w-full text-sm">
        <thead className="bg-[#54513E]/10 text-[#54513E]">
          <tr>
            {['번호', '유형', '제목', '작성자', '문의일', '상태'].map((h) => (
              <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {inquiries.map((inq, idx) => (
            <tr
              key={inq.id}
              onClick={() => onRowClick(inq.id)}
              data-testid={`inquiry-row-${inq.id}`}
              className={[
                'border-t border-gray-100 cursor-pointer transition-colors',
                selectedId === inq.id
                  ? 'bg-[#54513E]/15'
                  : idx % 2 === 0
                  ? 'bg-white hover:bg-[#54513E]/5'
                  : 'bg-gray-50 hover:bg-[#54513E]/5',
              ].join(' ')}
            >
              <td className="px-4 py-3 text-gray-400">{inq.id}</td>
              <td className="px-4 py-3 text-gray-600">{inq.typeDescription}</td>
              <td className="px-4 py-3 font-medium text-gray-800">{inq.title}</td>
              <td className="px-4 py-3 text-gray-600">{inq.userNickname}</td>
              <td className="px-4 py-3 text-gray-400">
                {new Date(inq.createdAt).toLocaleDateString('ko-KR')}
              </td>
              <td className="px-4 py-3">
                <StatusBadge label={inq.statusDescription} status={inq.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────
function Pagination({
  totalPages,
  currentPage,
  onPageChange,
}: {
  totalPages: number;
  currentPage: number;
  onPageChange: (p: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-1" data-testid="pagination">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          data-testid={`page-btn-${p}`}
          className={[
            'w-8 h-8 rounded text-sm transition-colors',
            currentPage === p
              ? 'bg-[#54513E] text-white'
              : 'border border-gray-200 text-gray-600 hover:bg-gray-100',
          ].join(' ')}
        >
          {p}
        </button>
      ))}
    </div>
  );
}

// ── InquiryDetail (서버 컴포넌트 → stub) ─────────────────────────────────────
function InquiryDetailView({ inquiry }: { inquiry: InquiryDetail }) {
  return (
    <div className="p-6 rounded-lg space-y-3" data-testid="inquiry-detail">
      <div className="flex flex-row justify-between items-start">
        <h1 className="text-2xl font-bold pb-4">
          [{inquiry.typeDescription}]&nbsp;{inquiry.title}
        </h1>
        <StatusBadge label={inquiry.statusDescription} status={inquiry.status} />
      </div>

      <div className="flex flex-row justify-between items-center pb-4 border-b-2 border-[#54513E] text-sm">
        <span>
          <strong>작성자:</strong> {inquiry.userNickname} ({inquiry.userId})
        </span>
        <span>
          <strong>문의일:</strong>{' '}
          {new Date(inquiry.createdAt).toLocaleDateString('ko-KR')}
        </span>
        <span>
          <strong>답변일:</strong>{' '}
          {inquiry.answeredAt
            ? new Date(inquiry.answeredAt).toLocaleDateString('ko-KR')
            : '----.--.--'}
        </span>
      </div>

      <div className="mt-4 p-4 text-gray-700 leading-relaxed" data-testid="inquiry-content">
        Q.&nbsp;{inquiry.content}
      </div>

      <div
        className="mt-4 p-4 border-t border-dashed border-[#54513E] text-gray-700 leading-relaxed"
        data-testid="inquiry-answer-area"
      >
        A.&nbsp;
        {inquiry.answer ? (
          <span data-testid="existing-answer">{inquiry.answer}</span>
        ) : (
          <span className="text-gray-400 italic" data-testid="no-answer">
            아직 답변이 등록되지 않았습니다.
          </span>
        )}
      </div>
    </div>
  );
}

// ── AnswerForm ────────────────────────────────────────────────────────────────
// publishAnswer(inquiryId, answer) 와 동일한 POST 요청을 fetch 로 재현합니다.
function AnswerForm({ inquiryId }: { inquiryId: number }) {
  const [answer, setAnswer]           = useState('');
  const [isSubmitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setSubmitting(true);
    setSubmitStatus('idle');

    try {
      // publishAnswer 의 POST /api/v1/admin/inquiries/:id/answer 와 동일
      const res = await fetch(`/api/v1/admin/inquiries/${inquiryId}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer }),
      });
      if (!res.ok) throw new Error();

      setAnswer('');
      setSubmitStatus('success');
    } catch {
      setSubmitStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-lg space-y-3" data-testid="answer-form">
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={isSubmitting}
        placeholder="답변을 입력하세요."
        data-testid="answer-textarea"
        className={[
          'w-full min-h-[160px] p-4 border border-gray-300 rounded-lg shadow-sm',
          'focus:ring-2 focus:ring-[#54513E] focus:border-[#54513E] outline-none',
          'transition-all text-sm resize-none bg-white text-gray-800',
          isSubmitting ? 'bg-gray-50 cursor-not-allowed' : '',
        ].join(' ')}
      />

      {submitStatus === 'error' && (
        <p className="text-red-500 text-sm" data-testid="answer-error">
          답변 등록에 실패했습니다. 다시 시도해주세요.
        </p>
      )}
      {submitStatus === 'success' && (
        <p className="text-green-600 text-sm" data-testid="answer-success">
          답변이 성공적으로 등록되었습니다.
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || !answer.trim()}
          data-testid="answer-submit"
          className={[
            'px-6 py-2.5 bg-[#54513E] text-white text-sm font-semibold',
            'rounded-lg shadow hover:bg-[#434031] active:scale-95 transition-all',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          ].join(' ')}
        >
          {isSubmitting ? '등록 중...' : '답변 등록'}
        </button>
      </div>
    </form>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 통합 페이지 컴포넌트
// InquiryPage + InquiryDetailPage 를 하나의 state machine 으로 구현합니다.
// next/navigation (router.push, useSearchParams) 을 내부 state 로 대체합니다.
// ═══════════════════════════════════════════════════════════════════════════════
type View = 'list' | 'detail';

interface AdminInquiryPageStubProps {
  /** 초기 탭 (기본값: PENDING) */
  initialTab?: InquiryStatus;
  /** 초기 페이지 (기본값: 1) */
  initialPage?: number;
  /**
   * 상세 화면에서 시작 — /admin/inquiry/:id 직접 진입 시뮬레이션
   * InquiryDetailPage 가 params.id 를 받아 getInquiryDetail 을 호출하는 것과 동일
   */
  initialDetailId?: number;
}

function AdminInquiryPageStub({
  initialTab = 'PENDING',
  initialPage = 1,
  initialDetailId,
}: AdminInquiryPageStubProps) {
  const [activeTab, setActiveTab]       = useState<string>(initialTab);
  const [currentPage, setPage]          = useState(initialPage);
  const [inquiries, setInquiries]       = useState<Inquiry[]>([]);
  const [totalPages, setTotalPages]     = useState(1);
  const [selectedId, setSelectedId]     = useState<number | null>(null);
  const [view, setView]                 = useState<View>(initialDetailId ? 'detail' : 'list');
  const [detail, setDetail]             = useState<InquiryDetail | null>(null);
  const [listLoading, setListLoading]   = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError]   = useState(false);

  // ── 목록 fetch (getInquiries 에 해당) ──────────────────────────────────────
  useEffect(() => {
    if (view !== 'list') return;
    setListLoading(true);
    fetch(`/api/v1/admin/inquiries?status=${activeTab}&page=${currentPage - 1}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((json: InquiriesApiResponse) => {
        setInquiries(json.data.content);
        setTotalPages(json.data.totalPages || 1);
      })
      .catch(() => setInquiries([]))
      .finally(() => setListLoading(false));
  }, [activeTab, currentPage, view]);

  // ── 상세 fetch (getInquiryDetail 에 해당) ─────────────────────────────────
  const fetchDetail = useCallback(async (id: number) => {
    setDetailLoading(true);
    setDetailError(false);
    try {
      // getInquiryDetail 은 fetch + Bearer 헤더를 사용하지만
      // MSW 는 헤더와 무관하게 경로로 인터셉트하므로 동일하게 동작합니다.
      const res = await fetch(`/api/v1/admin/inquiries/${id}`);
      if (!res.ok) throw new Error();
      const json: InquiryDetailResponse = await res.json();
      setDetail(json.data);
    } catch {
      setDetailError(true);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  // initialDetailId 로 직접 진입 시 자동 로드
  useEffect(() => {
    if (initialDetailId) fetchDetail(initialDetailId);
  }, [initialDetailId, fetchDetail]);

  // 탭 전환 — router.push(`/admin/inquiry?tab=${tab}`) 에 해당
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setPage(1);
    setSelectedId(null);
  };

  // 행 클릭 — router.push(`/admin/inquiry/${id}?...`) 에 해당
  const handleRowClick = async (id: number) => {
    setSelectedId(id);
    setView('detail');
    await fetchDetail(id);
  };

  // 목록으로 돌아가기 — Link href={listUrl} 에 해당
  const handleBack = () => {
    setView('list');
    setDetail(null);
    setDetailError(false);
  };

  // ── 목록 화면 (InquiryPage) ────────────────────────────────────────────────
  if (view === 'list') {
    return (
      <div className="grid grid-rows-[auto_1fr_auto] p-10 pr-20 gap-8 h-screen overflow-hidden bg-gray-50">
        {/* InquiryTabButton */}
        <div>
          <InquiryTabButton activeTab={activeTab} onTabChange={handleTabChange} />
        </div>

        {/* InquiryTable */}
        <div className="overflow-hidden">
          {listLoading ? (
            <div
              className="flex items-center justify-center h-full text-gray-400 text-sm"
              data-testid="loading-state"
            >
              목록을 로딩 중입니다...
            </div>
          ) : (
            <InquiryTable
              inquiries={inquiries}
              onRowClick={handleRowClick}
              selectedId={selectedId}
            />
          )}
        </div>

        {/* Pagination */}
        <div className="py-4 border-t">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setPage}
          />
        </div>
      </div>
    );
  }

  // ── 상세 화면 (InquiryDetailPage) ─────────────────────────────────────────
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* Link href={listUrl} 에 해당 */}
      <button
        onClick={handleBack}
        data-testid="back-button"
        className="text-sm font-semibold text-[#54513E] hover:text-black flex items-center gap-1"
      >
        ← 목록으로
      </button>

      {/* 로딩 */}
      {detailLoading && (
        <div
          className="p-6 text-center text-gray-400 text-sm"
          data-testid="detail-loading"
        >
          문의사항을 불러오는 중입니다...
        </div>
      )}

      {/* InquiryDetailPage catch 블록 에러 UI */}
      {detailError && !detailLoading && (
        <div className="p-6 text-center space-y-4" data-testid="detail-error">
          <p className="text-red-500 font-semibold">
            문의사항을 불러오는 데 실패했습니다.
          </p>
          <button
            onClick={handleBack}
            className="text-sm text-[#54513E] underline"
            data-testid="detail-error-back"
          >
            목록으로 이동
          </button>
        </div>
      )}

      {/* 정상: InquiryDetail + AnswerForm */}
      {!detailLoading && !detailError && detail && (
        <>
          <InquiryDetailView inquiry={detail} />

          <div className="border border-gray-100 rounded-xl shadow-sm bg-white">
            <AnswerForm inquiryId={detail.id} />
          </div>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Storybook Meta
// ═══════════════════════════════════════════════════════════════════════════════
const meta: Meta<typeof AdminInquiryPageStub> = {
  title: 'Admin/Inquiry/Page',
  component: AdminInquiryPageStub,
  parameters: {
    layout: 'fullscreen',
    chromatic: { viewports: [1280, 768] },
  },
};

export default meta;
type Story = StoryObj<typeof AdminInquiryPageStub>;

// ═══════════════════════════════════════════════════════════════════════════════
// Stories
// ═══════════════════════════════════════════════════════════════════════════════

// ── 1. 기본 목록 ─────────────────────────────────────────────────────────────
export const DefaultPendingList: Story = {
  name: '① 기본 목록 — 대기중 탭',
  parameters: {
    msw: { handlers: handlersNormal },
    docs: {
      description: {
        story: '최초 진입 시 PENDING 탭이 활성화되고 대기중 문의 3건이 표시됩니다. Chromatic 기준 스냅샷.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // PENDING 탭 활성 스타일
    const pendingTab = canvas.getByTestId('tab-pending');
    await expect(pendingTab).toHaveClass(/bg-\[#54513E\]\/70/);

    // 테이블 렌더링 대기
    await waitFor(() => canvas.getByTestId('inquiry-table'), { timeout: 4000 });

    // 목 데이터 3행
    await expect(canvas.getByTestId('inquiry-row-1')).toBeInTheDocument();
    await expect(canvas.getByTestId('inquiry-row-2')).toBeInTheDocument();
    await expect(canvas.getByTestId('inquiry-row-3')).toBeInTheDocument();

    // COMPLETED 탭은 비활성
    await expect(canvas.getByTestId('tab-completed')).not.toHaveClass(/bg-\[#54513E\]\/70/);

    // 페이지네이션
    await expect(canvas.getByTestId('pagination')).toBeInTheDocument();
  },
};

// ── 2. 탭 전환 ───────────────────────────────────────────────────────────────
export const TabSwitchToCompleted: Story = {
  name: '② 탭 전환 — 대기중 → 처리완료',
  parameters: {
    msw: { handlers: handlersNormal },
    docs: {
      description: {
        story:
          '"처리완료" 탭 클릭 → 탭 스타일 전환 + COMPLETED 목록 로드. ' +
          'InquiryTabButton 이 router.push(`/admin/inquiry?tab=COMPLETED`) 를 호출하는 것과 동일.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => canvas.getByTestId('inquiry-table'), { timeout: 4000 });

    await userEvent.click(canvas.getByTestId('tab-completed'));

    // 탭 스타일 전환
    await waitFor(
      () => expect(canvas.getByTestId('tab-completed')).toHaveClass(/bg-\[#54513E\]\/70/),
      { timeout: 4000 }
    );
    await expect(canvas.getByTestId('tab-pending')).not.toHaveClass(/bg-\[#54513E\]\/70/);

    // COMPLETED 목록 렌더링
    await waitFor(() => canvas.getByTestId('inquiry-row-4'), { timeout: 4000 });
    await expect(canvas.getByTestId('inquiry-row-5')).toBeInTheDocument();

    // PENDING 행 제거
    await expect(canvas.queryByTestId('inquiry-row-1')).not.toBeInTheDocument();
  },
};

// ── 3. 행 클릭 → 상세 화면 이동 ──────────────────────────────────────────────
export const RowClickNavigatesToDetail: Story = {
  name: '③ 행 클릭 — 상세 화면 이동',
  parameters: {
    msw: { handlers: handlersNormal },
    docs: {
      description: {
        story:
          '테이블 행 클릭 시 InquiryDetailPage 구조로 전환됩니다. ' +
          'InquiryDetail(제목·작성자·문의 내용)과 AnswerForm 이 렌더링됩니다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => canvas.getByTestId('inquiry-table'), { timeout: 4000 });
    await userEvent.click(canvas.getByTestId('inquiry-row-1'));

    // 상세 렌더링 대기
    await waitFor(() => canvas.getByTestId('inquiry-detail'), { timeout: 4000 });

    // InquiryDetail 내용 검증
    await expect(canvas.getByText(/결제 화면에서 앱이 강제 종료됩니다/)).toBeInTheDocument();
    await expect(canvas.getByText(/홍길동/)).toBeInTheDocument();
    await expect(canvas.getByTestId('inquiry-content')).toHaveTextContent(/ERR_PAYMENT_DECLINED/);
    await expect(canvas.getByText('대기중')).toBeInTheDocument();

    // AnswerForm 렌더링
    await expect(canvas.getByTestId('answer-form')).toBeInTheDocument();
    await expect(canvas.getByTestId('answer-textarea')).toBeInTheDocument();

    // 빈 textarea → 제출 버튼 비활성
    await expect(canvas.getByTestId('answer-submit')).toBeDisabled();

    // 목록 요소 제거 확인
    await expect(canvas.queryByTestId('inquiry-table')).not.toBeInTheDocument();
    await expect(canvas.queryByTestId('pagination')).not.toBeInTheDocument();
  },
};

// ── 4. 상세 → 목록으로 돌아가기 ──────────────────────────────────────────────
export const DetailBackToList: Story = {
  name: '④ 상세 화면 — "← 목록으로" 버튼',
  parameters: {
    msw: { handlers: handlersNormal },
    docs: {
      description: {
        story:
          'InquiryDetailPage 의 Link href={listUrl} 동작을 검증합니다. ' +
          '클릭 후 목록 화면으로 복귀하고 페이지네이션이 복원됩니다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => canvas.getByTestId('inquiry-table'), { timeout: 4000 });
    await userEvent.click(canvas.getByTestId('inquiry-row-1'));
    await waitFor(() => canvas.getByTestId('inquiry-detail'), { timeout: 4000 });

    await userEvent.click(canvas.getByTestId('back-button'));

    await waitFor(() => canvas.getByTestId('inquiry-table'), { timeout: 4000 });
    await expect(canvas.queryByTestId('inquiry-detail')).not.toBeInTheDocument();
    await expect(canvas.queryByTestId('answer-form')).not.toBeInTheDocument();
    await expect(canvas.getByTestId('pagination')).toBeInTheDocument();
  },
};

// ── 5. 답변 등록 성공 ─────────────────────────────────────────────────────────
export const AnswerSubmitSuccess: Story = {
  name: '⑤ 답변 등록 — 성공',
  parameters: {
    msw: { handlers: handlersNormal },
    docs: {
      description: {
        story:
          'AnswerForm 에 텍스트 입력 후 제출 → POST /api/v1/admin/inquiries/:id/answer 성공 → ' +
          '성공 메시지 표시 + textarea 초기화 + 버튼 재비활성화.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => canvas.getByTestId('inquiry-table'), { timeout: 4000 });
    await userEvent.click(canvas.getByTestId('inquiry-row-1'));
    await waitFor(() => canvas.getByTestId('answer-form'), { timeout: 4000 });

    const textarea  = canvas.getByTestId('answer-textarea');
    const submitBtn = canvas.getByTestId('answer-submit');

    // 입력 → 버튼 활성화
    await userEvent.type(textarea, 'v2.3.2 패치에서 수정되었습니다. 업데이트 후 재시도 부탁드립니다.');
    await expect(submitBtn).not.toBeDisabled();

    await userEvent.click(submitBtn);

    // 성공 메시지
    await waitFor(() => canvas.getByTestId('answer-success'), { timeout: 4000 });
    await expect(canvas.getByTestId('answer-success')).toHaveTextContent(
      '답변이 성공적으로 등록되었습니다.'
    );

    // textarea 초기화 + 버튼 재비활성화
    await expect(textarea).toHaveValue('');
    await expect(submitBtn).toBeDisabled();
  },
};

// ── 6. 빈 내용 제출 방지 ──────────────────────────────────────────────────────
export const AnswerSubmitBlockedWhenEmpty: Story = {
  name: '⑥ 답변 등록 — 빈 내용 제출 방지',
  parameters: {
    msw: { handlers: handlersNormal },
    docs: {
      description: {
        story:
          'AnswerForm 의 !answer.trim() 가드 검증. ' +
          'textarea 가 비어있거나 공백만 있으면 버튼이 disabled 상태를 유지합니다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => canvas.getByTestId('inquiry-table'), { timeout: 4000 });
    await userEvent.click(canvas.getByTestId('inquiry-row-1'));
    await waitFor(() => canvas.getByTestId('answer-form'), { timeout: 4000 });

    const submitBtn = canvas.getByTestId('answer-submit');
    const textarea  = canvas.getByTestId('answer-textarea');

    // 초기 비활성
    await expect(submitBtn).toBeDisabled();

    // 공백 입력 → 여전히 비활성
    await userEvent.type(textarea, '   ');
    await expect(submitBtn).toBeDisabled();

    // 실제 텍스트 → 활성화
    await userEvent.clear(textarea);
    await userEvent.type(textarea, '답변 내용');
    await expect(submitBtn).not.toBeDisabled();
  },
};

// ── 7. 답변 등록 실패 ─────────────────────────────────────────────────────────
export const AnswerSubmitFails: Story = {
  name: '⑦ 답변 등록 — API 실패 (500)',
  parameters: {
    msw: { handlers: handlersAnswerFail },
    docs: {
      description: {
        story:
          'POST /api/v1/admin/inquiries/:id/answer 가 500 반환 → AnswerForm catch 블록 동작. ' +
          '에러 메시지 표시 + textarea 값 유지(재시도 가능).',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => canvas.getByTestId('inquiry-table'), { timeout: 4000 });
    await userEvent.click(canvas.getByTestId('inquiry-row-1'));
    await waitFor(() => canvas.getByTestId('answer-form'), { timeout: 4000 });

    await userEvent.type(canvas.getByTestId('answer-textarea'), '답변 내용입니다.');
    await userEvent.click(canvas.getByTestId('answer-submit'));

    await waitFor(() => canvas.getByTestId('answer-error'), { timeout: 4000 });
    await expect(canvas.getByTestId('answer-error')).toHaveTextContent(
      '답변 등록에 실패했습니다.'
    );

    // 실패 후 textarea 값 유지 (재시도 가능)
    await expect(canvas.getByTestId('answer-textarea')).toHaveValue('답변 내용입니다.');
  },
};

// ── 8. 기존 답변이 있는 상세 화면 ────────────────────────────────────────────
export const DetailWithExistingAnswer: Story = {
  name: '⑧ 상세 화면 — 기존 답변 표시 (처리완료)',
  args: { initialDetailId: 1 },
  parameters: {
    msw: { handlers: handlersWithAnswer },
    docs: {
      description: {
        story:
          '이미 답변이 등록된 문의(status: COMPLETED)의 InquiryDetail. ' +
          'A. 영역에 기존 답변이 표시되고 상태 배지는 "처리완료"입니다. Chromatic 스냅샷.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => canvas.getByTestId('inquiry-detail'), { timeout: 4000 });

    // 기존 답변 표시
    await expect(canvas.getByTestId('existing-answer')).toBeInTheDocument();
    await expect(canvas.queryByTestId('no-answer')).not.toBeInTheDocument();

    // 상태 배지
    await expect(canvas.getByText('처리완료')).toBeInTheDocument();

    // 답변 폼은 여전히 존재 (추가 답변 가능)
    await expect(canvas.getByTestId('answer-form')).toBeInTheDocument();
  },
};

// ── 9. 빈 목록 ───────────────────────────────────────────────────────────────
export const EmptyInquiryList: Story = {
  name: '⑨ 빈 목록 — Empty State',
  parameters: {
    msw: { handlers: handlersEmpty },
    docs: {
      description: {
        story:
          'API 응답의 content 가 [] 일 때 InquiryTable 이 Empty State 메시지를 표시합니다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => canvas.getByTestId('empty-state'), { timeout: 4000 });
    await expect(canvas.getByTestId('empty-state')).toHaveTextContent('문의사항이 없습니다.');
    await expect(canvas.queryByTestId('inquiry-table')).not.toBeInTheDocument();
  },
};

// ── 10. 목록 로딩 상태 (Chromatic) ───────────────────────────────────────────
export const ListLoadingState: Story = {
  name: '⑩ 목록 로딩 상태 (Chromatic)',
  parameters: {
    msw: { handlers: handlersLoading },
    chromatic: { delay: 400, pauseAnimationAtEnd: true },
    docs: {
      description: {
        story: '목록 API 응답 전 로딩 텍스트 UI를 Chromatic 이 캡처합니다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => canvas.getByTestId('loading-state'), { timeout: 2000 });
    await expect(canvas.getByTestId('loading-state')).toBeInTheDocument();
  },
};

// ── 11. 상세 로딩 상태 (Chromatic) ───────────────────────────────────────────
export const DetailLoadingState: Story = {
  name: '⑪ 상세 로딩 상태 (Chromatic)',
  args: { initialDetailId: 1 },
  parameters: {
    msw: { handlers: handlersDetailLoading },
    chromatic: { delay: 400, pauseAnimationAtEnd: true },
    docs: {
      description: {
        story:
          'GET /api/v1/admin/inquiries/:id 응답 전 로딩 UI를 캡처합니다. ' +
          'InquiryDetailPage 의 SSR 로딩 대기 상태에 해당.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => canvas.getByTestId('detail-loading'), { timeout: 2000 });
    await expect(canvas.getByTestId('detail-loading')).toBeInTheDocument();
  },
};

// ── 12. 상세 조회 실패 — InquiryDetailPage catch 블록 ────────────────────────
export const DetailFetchError: Story = {
  name: '⑫ 상세 조회 실패 — catch 블록 에러 UI',
  args: { initialDetailId: 1 },
  parameters: {
    msw: { handlers: handlersDetailError },
    docs: {
      description: {
        story:
          'GET /api/v1/admin/inquiries/:id 가 실패할 때 InquiryDetailPage catch 블록이 렌더링하는 ' +
          '에러 UI와 "목록으로 이동" 링크를 검증합니다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => canvas.getByTestId('detail-error'), { timeout: 4000 });
    await expect(canvas.getByTestId('detail-error')).toHaveTextContent(
      '문의사항을 불러오는 데 실패했습니다.'
    );

    // 에러 화면에서 목록 복귀
    await userEvent.click(canvas.getByTestId('detail-error-back'));
    await waitFor(() => canvas.getByTestId('inquiry-table'), { timeout: 4000 });
    await expect(canvas.queryByTestId('detail-error')).not.toBeInTheDocument();
  },
};

// ── 13. 목록 서버 에러 (500) ──────────────────────────────────────────────────
export const ListServerError: Story = {
  name: '⑬ 목록 서버 에러 — Graceful Degradation',
  parameters: {
    msw: { handlers: handlersListError },
    docs: {
      description: {
        story:
          'GET /api/v1/admin/inquiries 가 500 을 반환할 때 InquiryPage 가 Empty State 로 ' +
          'graceful degradation 합니다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => canvas.getByTestId('empty-state'), { timeout: 4000 });
    await expect(canvas.getByTestId('empty-state')).toBeInTheDocument();
  },
};

// ── 14. 페이지네이션 클릭 ─────────────────────────────────────────────────────
export const PaginationInteraction: Story = {
  name: '⑭ 페이지네이션 — 2페이지 이동',
  parameters: {
    msw: { handlers: handlersNormal },
    docs: {
      description: {
        story:
          '2페이지 버튼 클릭 시 활성 스타일(bg-[#54513E] text-white)로 전환됩니다. ' +
          'Pagination 컴포넌트의 currentPage prop 동작을 검증합니다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => canvas.getByTestId('pagination'), { timeout: 4000 });

    const page1 = canvas.getByTestId('page-btn-1');
    const page2 = canvas.getByTestId('page-btn-2');

    // 1페이지 초기 활성
    await expect(page1).toHaveClass(/bg-\[#54513E\]/);

    await userEvent.click(page2);

    // 2페이지 활성 전환
    await expect(page2).toHaveClass(/bg-\[#54513E\]/);
    await expect(page2).toHaveClass(/text-white/);
    await expect(page1).not.toHaveClass(/text-white/);
  },
};

// ── 15. COMPLETED 탭 초기 진입 (Chromatic) ───────────────────────────────────
export const CompletedTabInitial: Story = {
  name: '⑮ 처리완료 탭 — 초기 진입 (Chromatic)',
  args: { initialTab: 'COMPLETED' },
  parameters: {
    msw: { handlers: handlersNormal },
    chromatic: { viewports: [1280, 768] },
    docs: {
      description: {
        story:
          'COMPLETED 탭으로 직접 진입 시 처리완료 목록이 표시됩니다. ' +
          '탭 활성 스타일과 목록 데이터를 Chromatic 이 캡처합니다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByTestId('tab-completed')).toHaveClass(/bg-\[#54513E\]\/70/);

    await waitFor(() => canvas.getByTestId('inquiry-row-4'), { timeout: 4000 });
    await expect(canvas.getByTestId('inquiry-row-5')).toBeInTheDocument();
    await expect(canvas.queryByTestId('inquiry-row-1')).not.toBeInTheDocument();
  },
};