"use client";

import { useState, use, useEffect } from "react";
import { useSearchParams } from 'next/navigation';

import NestTabButton from '@/components/admin/nest/NestTabButton';
import NestTable from '@/components/admin/tables/NestTable';
import ReportNestTable from '@/components/admin/tables/ReportNestTable';
import CommentTable from '@/components/admin/tables/CommentTable';
import SortSection from '@/components/admin/SortSection';
import Pagination from '@/components/admin/Pagination';
import NestDetail from '@/components/admin/nest/NestDetail/index';
import IncludeDeletedToggle from '@/components/admin/IncludeDeletedToggle';
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label";

import { NestList, ReportedNestList, ReportedCommentList } from '@/types/indexAdmin';
import { getNestsAdmin, getReportedNests, getReportedComments } from '@/lib/adminApi/nest';
import { useUpdateQuery } from "@/hooks/admin/useUpdateQuery";

export default function Page() {

  const [selectedPostId, setSelectedPostId] = useState<string | number | null>(null);
  const [nests, setNests] = useState<NestList[]>([]);
  const [reportedNests, setReportedNests] = useState<ReportedNestList[]>([]);
  const [reportedComments, setReportedComments] = useState<ReportedCommentList[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const { updateQuery } = useUpdateQuery();

  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const sort = searchParams.get('sort') || 'latest';
  const activeTab = searchParams.get('tab') || 'all';
  const includeDeleted = searchParams.get('includeDeleted') || 'ACTIVE_ONLY';

  const isAllMode = includeDeleted === "ALL";

  const [sortBy] = sort.split(',');

  // 전체 둥지 get
  useEffect(() => {
    if (activeTab !== 'all') return

    const fetchAllNests = async () => {
      try {
        const params: { includeDeleted?: string; sort?: string; page: number } = {
          includeDeleted: includeDeleted,
          sort: sortBy,
          page: currentPage - 1
        };

        const data = await getNestsAdmin(params);
        setNests(data.data.content);
        setTotalPages(data.data.totalPages || 1);
      } catch (error) {
        console.error('둥지 목록 로딩 실패:', error);
      } 
    };

    fetchAllNests();
  }, [activeTab, searchParams]);

  // 신고된 둥지 get
  useEffect(() => {
    if (activeTab !== 'reported') return

    const fetchReportedNests = async () => {
      try {
        const params: { sort?: string; page: number } = {
          sort: sortBy,
          page: currentPage - 1
        };

        const data = await getReportedNests(params);
        setReportedNests(data.data.content);
        setTotalPages(data.data.totalPages || 1);
      } catch (error) {
        console.error('신고된 둥지 목록 로딩 실패:', error);
      } 
    };

    fetchReportedNests();
  }, [activeTab, searchParams]);

  // 신고된 댓글 get
  useEffect(() => {
    if (activeTab !== 'comments') return

    const fetchReportedComments = async () => {
      try {
        const params: { sort?: string; page: number } = {
          sort: sortBy,
          page: currentPage - 1
        };

        const data = await getReportedComments(params);
        setReportedComments(data.data.content);
        setTotalPages(data.data.totalPages || 1);
      } catch (error) {
        console.error('신고된 댓글 목록 로딩 실패:', error);
      } 
    };

    fetchReportedComments();
  }, [activeTab, searchParams]);

  //전체 둥지 정렬 옵션
  const nestSortOptions = [
    { label: "최신 순", value: "latest" },
    { label: "좋아요 순", value: "like" },
    { label: "댓글 순", value: "comment" },
    { label: "인기 순", value: "view" },
  ];

  //신고 둥지 정렬 옵션
  const reportSortOptions = [
    { label: "최근 신고일", value: "LATEST_REPORT" },
    { label: "최초 신고일", value: "FIRST_REPORT" },
    { label: "신고 수", value: "REPORT_COUNT" },
    { label: "처리 상태", value: "STATUS" },
  ];

  //신고 댓글 정렬 옵션
  const replySortOptions = [
    { label: "최근 신고일", value: "LATEST_REPORT" },
    { label: "신고 수", value: "REPORT_COUNT" },
    { label: "둥지", value: "NEST_ID" },
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
          {activeTab === 'reported' && <SortSection options={reportSortOptions} defaultSort='LATEST_REPORT' disableToggle={true}/>}
          {activeTab === 'comments' && <SortSection options={replySortOptions} defaultSort='LATEST_REPORT' disableToggle={true}/>}
        </div>

        {activeTab === 'all' &&
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
        }
      </div>

      <div className='w-full h-full grid grid-cols-[1fr_1fr] min-h-0'>
        <div className="overflow-y-auto">
          {activeTab === 'all' && <NestTable nests={nests} onRowClick={setSelectedPostId}/>}
          {activeTab === 'reported' && <ReportNestTable reports={reportedNests} onRowClick={setSelectedPostId}/>}
          {activeTab === 'comments' && <CommentTable comments={reportedComments} onRowClick={setSelectedPostId}/>}
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
