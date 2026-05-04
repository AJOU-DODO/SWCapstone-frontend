import NestTabButton from '@/components/admin/NestTabButton';
import NestTable, { Nest } from '@/components/admin/NestTable';
import SortSection from '@/components/admin/SortSection';
import Pagination from '@/components/admin/Pagination';

export default async function Page({ searchParams, }: {searchParams: Promise<{ tab?: string }>;}) {
  //게시글 관리 메뉴 파라미터
  const resolvedParams = await searchParams;
  const activeTab = resolvedParams.tab || 'all';

  const nests: Nest[] = [
    { 
      id: "1",
      creatorNickname: "김도도",
      content: "여기 벚쫓이 너무 예...",
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
  
  const report: Nest[] = [
    { 
      id: "1",
      creatorNickname: "김도도",
      content: "안물어봤다요다야이야이야오",
      createdAt: "2023-02-01",
      likeCount: 37,
      replyCount: 5,
      reportCount: 14,
    },
  ]

  //임의 데이터 (페이지네이션을 위한)
  const totalItems = 80; // 전체 유저 수
  const itemsPerPage = 10; // 한 페이지당 보여줄 수
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  //정렬옵션
  const sortOptions = [
    { label: "최신 순", value: "latest" },
    { label: "좋아요 순", value: "likeCount" },
    { label: "댓글 순", value: "replyCount" },
  ];

  return (
    <div className="grid grid-rows-[auto_auto_1fr_auto] p-10 pr-20 gap-8 h-screen overflow-hidden">
      <div>
        <NestTabButton/>
      </div>

      <div>
        <SortSection options={sortOptions} defaultSort='latest'/>
      </div>

      <div className="mt-4">
        {activeTab === 'all' && <NestTable nests={nests}/>}
        {activeTab === 'reported' && <NestTable nests={report}/>}
        {activeTab === 'comments' && <div>신고된댓글</div>}
      </div>

      <div className="mt-6 py-4 border-t">
        <Pagination totalPages={totalPages}/>
      </div>
    </div>
  );
}
