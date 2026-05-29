"use client";

import { useState, use, useEffect } from "react";
import { useSearchParams } from 'next/navigation';

import NestTabButton from '@/components/admin/nest/NestTabButton';
import NestTable from '@/components/admin/tables/NestTable';
import ReportNestTable, { Report } from '@/components/admin/tables/ReportNestTable';
import ReplyTable, { Comments } from '@/components/admin/tables/ReplyTable';
import SortSection from '@/components/admin/SortSection';
import Pagination from '@/components/admin/Pagination';
import NestDetail from '@/components/admin/nest/NestDetail/index';
import IncludeDeletedToggle from '@/components/admin/IncludeDeletedToggle';
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label";

import { NestList } from '@/types/indexAdmin';
import { getNestsAdmin } from '@/lib/adminApi/nest';
import { useUpdateQuery } from "@/hooks/admin/useUpdateQuery";

export default function Page() {

  const [selectedPostId, setSelectedPostId] = useState<string | number | null>(null);
  const [nests, setNests] = useState<NestList[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const { updateQuery } = useUpdateQuery();

  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const sort = searchParams.get('sort') || 'latest';
  const activeTab = searchParams.get('tab') || 'all';
  const includeDeleted = searchParams.get('includeDeleted') || 'ACTIVE_ONLY';

  const isAllMode = includeDeleted === "ALL";

  const [sortBy] = sort.split(',');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const params: { includeDeleted?: string; sort?: string; page: number } = {
          includeDeleted: includeDeleted,
          sort: sortBy,
          page: currentPage - 1
        };

        console.log(params);

        const data = await getNestsAdmin(params);
        setNests(data.data.content);
        setTotalPages(data.data.totalPages || 1);
      } catch (error) {
        console.error('둥지 목록 로딩 실패:', error);
      } 
    };

    fetchUsers();
  }, [searchParams]);
  
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

  //전체 둥지 정렬 옵션
  const nestSortOptions = [
    { label: "최신 순", value: "latest" },
    { label: "좋아요 순", value: "like" },
    { label: "댓글 순", value: "comment" },
    { label: "인기 순", value: "view" },
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

      <div className='flex flex-row justify-between'>
        <div>
          {activeTab === 'all' && <SortSection options={nestSortOptions} defaultSort='latest' disableToggle={true}/>}
          {activeTab === 'reported' && <SortSection options={reportSortOptions} defaultSort='latest'/>}
          {activeTab === 'comments' && <SortSection options={replySortOptions} defaultSort='latest'/>}
        </div>
        <div className="flex flex-row items-center gap-5">
          <div className="flex flex-row items-center gap-2">
            <Checkbox 
              checked={searchParams.get("includeDeleted") === "ALL"} 
              onCheckedChange={(checked) => updateQuery({ includeDeleted: checked ? "ALL" : "ACTIVE_ONLY" })}
              className="data-[state=checked]:bg-[#538752] data-[state=checked]:border-[#538752]"
            />
            <Label htmlFor="all-nest-checkbox" className="text-sm font-medium text-[#54513E] cursor-pointer select-none">
              전체
            </Label>
          </div>
          <IncludeDeletedToggle label="삭제된 둥지 보기" trueValue="DELETED_ONLY" falseValue="ACTIVE_ONLY" isDisabled={isAllMode}/>
        </div>
      </div>

      <div className='w-full h-full grid grid-cols-[1fr_1fr] min-h-0 overflow-y-auto'>
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
