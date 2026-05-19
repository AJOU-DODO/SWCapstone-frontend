import NestTabButton from '@/components/admin/NestTabButton';
import NestTable, { Nest } from '@/components/admin/NestTable';
import ReportNestTable, { Report } from '@/components/admin/ReportNestTable';
import ReplyTable, { Reply } from '@/components/admin/ReplyTable';
import SortSection from '@/components/admin/SortSection';
import Pagination from '@/components/admin/Pagination';
import NestDetail from '@/components/admin/NestDetail/index';

export default async function Page({ searchParams, }: {searchParams: Promise<{ tab?: string }>;}) {
  //게시글 관리 메뉴 파라미터
  const resolvedParams = await searchParams;
  const activeTab = resolvedParams.tab || 'all';
  const selectedPostId = 1; // TODO: 반드시 데이터 값 바꾸기 (nestId랑 연결)

  const nests: Nest[] = [
    { 
      id: "1",
      creatorNickname: "김도도",
      content: "여기 벚쫓이 너무 예쁘고 좋으네요 가나다라마바사 아자차카타파하",
      createdAt: "2023-02-01",
      likeCount: 37,
      replyCount: 5,
      reportCount: 0,
    },
    { 
      id: "2",
      creatorNickname: "김도도",
      content: "여기 벚쫓이 너무 예...",
      createdAt: "2023-02-01",
      likeCount: 37,
      replyCount: 5,
      reportCount: 0,
    },
    { 
      id: "3",
      creatorNickname: "김도도",
      content: "여기 벚쫓이 너무 예...",
      createdAt: "2023-02-01",
      likeCount: 37,
      replyCount: 5,
      reportCount: 0,
    },
    { 
      id: "4",
      creatorNickname: "김도도",
      content: "여기 벚쫓이 너무 예...",
      createdAt: "2023-02-01",
      likeCount: 37,
      replyCount: 5,
      reportCount: 0,
    },
  ]
  
  const report: Report[] = [
    { 
      id: "1",
      creatorNickname: "김도도",
      content: "안물어봤다요다야이야이야오",
      createdAt: "2023-02-01",
      latestReportDate: "2023-02-01",
      reportCount: 5,
      reportReason: "욕설",
    },
  ]

  const reply: Reply[] = [
    { 
      id: "1",
      creatorNickname: "김도도",
      content: "너는그게예쁘냐?눈이어떻게됐네ㅉ",
      originContent: "여기 벚꽃이 너무 예쁘네요 다들 한번 구경오세요",
      latestReportDate: "2023-02-01",
      reportCount: 10,
      reportReason: "욕설",
    },
  ]

  //임의 데이터 (페이지네이션을 위한)
  const totalItems = 80; // 전체 유저 수
  const itemsPerPage = 10; // 한 페이지당 보여줄 수
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  //전체 둥지 정렬 옵션
  const nestSortOptions = [
    { label: "최신 순", value: "latest" },
    { label: "좋아요 순", value: "likeCount" },
    { label: "댓글 순", value: "replyCount" },
    { label: "인기 순", value: "viewCount" },
  ];

  //신고 둥지 정렬 옵션
  const reportSortOptions = [
    { label: "최근 신고일", value: "latest" },
    { label: "최초 신고일", value: "createdAt" },
    { label: "신고 수", value: "reportCount" },
    { label: "제재 유저", value: "userType" },
  ];

  //신고 댓글 정렬 옵션
  const replySortOptions = [
    { label: "최근 신고일", value: "latest" },
    { label: "제재 유저", value: "userType" },
    { label: "신고수", value: "reportCount" },
    { label: "둥지", value: "nestId" },
  ];

  return (
    <div className="grid grid-rows-[auto_auto_1fr_auto] p-10 pr-20 gap-8 h-screen overflow-hidden">
      <div>
        <NestTabButton/>
      </div>

      <div>
        <div>
          {activeTab === 'all' && <SortSection options={nestSortOptions} defaultSort='latest'/>}
          {activeTab === 'reported' && <SortSection options={reportSortOptions} defaultSort='latest'/>}
          {activeTab === 'comments' && <SortSection options={replySortOptions} defaultSort='latest'/>}
        </div>
      </div>

      <div className='w-full h-full grid grid-cols-[1fr_1fr]'>
        <div className="">
          {activeTab === 'all' && <NestTable nests={nests}/>}
          {activeTab === 'reported' && <ReportNestTable nests={report}/>}
          {activeTab === 'comments' && <ReplyTable nests={reply}/>}
        </div>
        
        <NestDetail postId={selectedPostId}/>
      </div>

      <div className="py-4 border-t">
        <Pagination totalPages={totalPages}/>
      </div>
    </div>
  );
}
