"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from 'next/navigation';

import { PostcardList } from '@/types/indexAdmin';
import { getReportPostcard } from '@/lib/adminApi/postcard';

import SortSection from '@/components/admin/SortSection';
import Pagination from '@/components/admin/Pagination';
import IncludeDeletedToggle from '@/components/admin/IncludeDeletedToggle';
import PostcardGrid from '@/components/admin/postcard/PostcardGrid';
import PostcardSkeleton from '@/components/admin/postcard/PostcardSkeleton';
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label";
import { useUpdateQuery } from "@/hooks/admin/useUpdateQuery";

//정렬 옵션
const sortOptions = [
  { label: "최근 신고 순", value: "RECENT_REPORT" },
  { label: "닉네임", value: "RECENT_CREATED" },
];

export function AdminPostcardPage(){
  const [postcard, setPostcard] = useState<PostcardList[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = () => setRefreshKey(prev => prev + 1);

  const { updateQuery } = useUpdateQuery();

  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const sort = searchParams.get('sort') || 'RECENT_REPORT';
  const statuses = searchParams.get('includeDeleted') || 'PENDING';

  const [sortBy] = sort.split(',');

  const isAllMode = statuses === "PENDING,PROCESSED";

  useEffect(() => {
      setIsLoading(true);
      const fetchPostcard = async () => {
        try {
          const params: { statuses?: string; sort?: string; page: number } = {
            statuses: statuses,
            sort: sortBy,
            page: currentPage - 1
          };
  
          const data = await getReportPostcard(params);
          setPostcard(data.data.content);
          setTotalPages(data.data.totalPages || 1);
        } catch (error) {
          console.error('엽서 목록 로딩 실패:', error);
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchPostcard();
    }, [searchParams, refreshKey]);

  return (
    <div className="grid grid-rows-[auto_1fr_auto] p-10 pr-20 gap-8 h-screen overflow-hidden">

      <div className='flex flex-row justify-between'>
        <SortSection options={sortOptions} defaultSort='RECENT_REPORT' disableToggle={true}/>

        <div className="flex flex-row items-center gap-5">
          <div className="flex flex-row items-center gap-2">
            <Checkbox 
              checked={searchParams.get("includeDeleted") === "PENDING,PROCESSED"} 
              onCheckedChange={(checked) => updateQuery({ includeDeleted: checked ? "PENDING,PROCESSED" : "PENDING" })}
              className="data-[state=checked]:bg-[#538752] data-[state=checked]:border-[#538752]"
            />
            <Label htmlFor="all-nest-checkbox" className="text-sm font-medium text-[#54513E] cursor-pointer select-none">
              전체
            </Label>
          </div>
          <IncludeDeletedToggle label="처리 완료 엽서 보기" trueValue="PROCESSED" falseValue="PENDING" isDisabled={isAllMode}/>
        </div>
      </div>

      <div>
        {isLoading ? (
        <PostcardSkeleton count={10} /> ) : (<PostcardGrid postcards={postcard} triggerRefresh={triggerRefresh}/>)}
      </div>

      <div className="py-4 border-t">
        <Pagination totalPages={totalPages}/>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>페이지 로딩 중...</div>}>
      <AdminPostcardPage />
    </Suspense>
  );
}
