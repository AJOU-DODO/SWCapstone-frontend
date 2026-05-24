import type { Meta, StoryObj } from '@storybook/react-vite';
import { http, HttpResponse } from 'msw';
import Page from './page';

// Mock 데이터 정의 (백엔드 API 규격에 맞춤)
const mockNotices = [
  { id: 1, title: '공지사항 첫 번째 (발행 완료)', published: true, createdAt: '2026-05-01' },
  { id: 2, title: '공지사항 두 번째 (임시 저장)', published: false, createdAt: '2026-05-02' },
  { id: 3, title: '공지사항 세 번째 (발행 완료)', published: true, createdAt: '2026-05-03' },
  { id: 4, title: '공지사항 네 번째 (발행 완료)', published: true, createdAt: '2026-05-04' },
  { id: 5, title: '공지사항 다섯 번째 (임시 저장)', published: false, createdAt: '2026-05-05' },
];

const meta: Meta<typeof Page> = {
  title: 'Admin/Notices/ListPage',
  component: Page,
  parameters: {
    layout: 'fullscreen',
    // 💡 Next.js 14/15 내장 네비게이션 Mocking 규칙
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/admin/notices',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Page>;

/**
 * 1. 기본 상태: 전체 목록 조회 (ALL)
 */
export const Default: Story = {
  parameters: {
    nextjs: {
      navigation: {
        query: { status: 'ALL', page: '1' },
      },
    },
    msw: {
      handlers: [
        http.get('/api/v1/admin/notices', () => {
          return HttpResponse.json({
            data: {
              content: mockNotices,
              totalPages: 5,
            },
          });
        }),
      ],
    },
  },
};

/**
 * 2. 필터 상태: 발행 완료 목록 조회 (PUBLISHED)
 */
export const PublishedFilter: Story = {
  parameters: {
    nextjs: {
      navigation: {
        query: { status: 'PUBLISHED', page: '1' },
      },
    },
    msw: {
      handlers: [
        http.get('/api/v1/admin/notices', ({ request }) => {
          const url = new URL(request.url);
          const isPublished = url.searchParams.get('isPublished');

          // 검증: 오직 true 상태만 필터링해서 내려줌
          const filtered = mockNotices.filter((n) => n.published === true);

          return HttpResponse.json({
            data: {
              content: filtered,
              totalPages: 2,
            },
          });
        }),
      ],
    },
  },
};

/**
 * 3. 필터 상태: 임시 저장 목록 조회 (DRAFT)
 */
export const DraftFilter: Story = {
  parameters: {
    nextjs: {
      navigation: {
        query: { status: 'DRAFT', page: '1' },
      },
    },
    msw: {
      handlers: [
        http.get('/api/v1/admin/notices', () => {
          const filtered = mockNotices.filter((n) => n.published === false);
          return HttpResponse.json({
            data: {
              content: filtered,
              totalPages: 1,
            },
          });
        }),
      ],
    },
  },
};

/**
 * 4. 페이징 상태: 3페이지로 직접 진입했을 때
 */
export const PageThree: Story = {
  parameters: {
    nextjs: {
      navigation: {
        query: { status: 'ALL', page: '3' },
      },
    },
    msw: {
      handlers: [
        http.get('/api/v1/admin/notices', ({ request }) => {
          const url = new URL(request.url);
          const page = url.searchParams.get('page'); // 백엔드로 2가 전달되었는지 확인 가능 (currentPage - 1 로직)

          // 3페이지임을 보여주기 위해 살짝 바꾼 타이틀 모킹 데이터 반환
          const pageThreeNotices = mockNotices.map((n) => ({
            ...n,
            title: `[3페이지] ${n.title}`,
          }));

          return HttpResponse.json({
            data: {
              content: pageThreeNotices,
              totalPages: 5,
            },
          });
        }),
      ],
    },
  },
};

/**
 * 5. 예외 상태: 데이터가 아예 없을 때 (Empty)
 */
export const EmptyList: Story = {
  parameters: {
    nextjs: {
      navigation: {
        query: { status: 'ALL', page: '1' },
      },
    },
    msw: {
      handlers: [
        http.get('/api/v1/admin/notices', () => {
          return HttpResponse.json({
            data: {
              content: [],
              totalPages: 1,
            },
          });
        }),
      ],
    },
  },
};

/**
 * 6. 에러 상태: 서버 통신 실패 (Error)
 */
export const ApiError: Story = {
  parameters: {
    nextjs: {
      navigation: {
        query: { status: 'ALL', page: '1' },
      },
    },
    msw: {
      handlers: [
        http.get('/api/v1/admin/notices', () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
};