"use client";

import { useState, use } from "react";

import NestTabButton from '@/components/admin/NestTabButton';
import NestTable, { Nest } from '@/components/admin/NestTable';
import ReportNestTable, { Report } from '@/components/admin/ReportNestTable';
import ReplyTable, { Comments } from '@/components/admin/ReplyTable';
import SortSection from '@/components/admin/SortSection';
import Pagination from '@/components/admin/Pagination';
import NestDetail from '@/components/admin/NestDetail/index';

export default function Page({ searchParams, }: {searchParams: Promise<{ tab?: string }>;}) {

  const [selectedPostId, setSelectedPostId] = useState<string | number | null>(null);
  //게시글 관리 메뉴 파라미터
  const resolvedParams = use(searchParams);
  const activeTab = resolvedParams.tab || 'all';

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

  const reply: Comments[] = [
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
    <div 
      onClick={() => setSelectedPostId(null)}
      className="grid grid-rows-[auto_auto_1fr_auto] p-10 pr-20 gap-8 h-screen overflow-hidden">
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

      <div className='w-full h-full grid grid-cols-[1fr_1fr] min-h-0 overflow-hidden'>
        <div className="">
          {activeTab === 'all' && <NestTable nests={nests} onRowClick={setSelectedPostId}/>}
          {activeTab === 'reported' && <ReportNestTable reports={report} onRowClick={setSelectedPostId}/>}
          {activeTab === 'comments' && <ReplyTable comments={reply} onRowClick={setSelectedPostId}/>}
        </div>
        
        {selectedPostId ? (
          <NestDetail postId={selectedPostId}/>
        ) : (
          // 클릭하지 않았을 시 보여주는 대기 영역
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50/50 rounded-xl border border-dashed border-gray-300 p-8 select-none text-center">
            <div className="text-3xl mb-3">🔍</div>
            <p className="text-xs font-bold text-gray-500 mb-1">선택된 항목이 없습니다</p>
            <p className="text-[11px] text-gray-400">
              상세 내용을 확인하시려면 <br />
              왼쪽 테이블에서 원하는 행을 클릭해 주세요.
            </p>
          </div>
        )}
      </div>

      <div className="py-4 border-t">
        <Pagination totalPages={totalPages}/>
      </div>
    </div>
  );
}
