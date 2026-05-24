"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

import SearchBar from '@/components/admin/SearchBar';
import Pagination from '@/components/admin/Pagination';
import NoticeTable from '@/components/admin/tables/NoticeTable';
import NoticeTab from '@/components/admin/notice/NoticeTab';
import { Notice } from '@/types/indexAdmin';
import { getNotices } from '@/lib/adminApi/notice';
import { useSearchParams } from 'next/navigation';

interface PageProps {
  searchParams: Promise<{ status?: string }>; 
}

export default  function Page() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const searchParams = useSearchParams();
  const router = useRouter();

  const filterStatus = searchParams.get('status') ?? 'ALL';
  const currentPage = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const params: { isPublished?: boolean; page: number } = {
          page: currentPage - 1
        };

        if (filterStatus === 'PUBLISHED') {
          params.isPublished = true;
        } else if (filterStatus === 'DRAFT') {
          params.isPublished = false;
        }

        setLoading(true);
        const data = await getNotices(params);
        setNotices(data.data.content);
        setTotalPages(data.data.totalPages || 1);
        console.log(data.data.totalPages);
      } catch (error) {
        console.error('공지사항 목록 로딩 실패:', error);
        alert('목록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, [filterStatus, currentPage]);

  return (
    <div className="grid grid-rows-[auto_auto_1fr_auto_auto] p-10 pr-20 gap-8 h-screen overflow-hidden">
      <div className="justify-between items-center">
        <SearchBar placeholder='공지사항 검색' /> 
      </div>

      <NoticeTab/>

      <div className="w-full h-full min-h-0 overflow-y-auto">
        <NoticeTable notices={notices} onRowClick={(id) => router.push(`/admin/notices/${id}?${searchParams.toString()}`)} />
      </div>

      <div className="flex justify-end items-center">
        <button 
        onClick={() => router.push('/admin/notices/editer')}
        className="flex items-center justify-center w-10 h-10 bg-[#2B6340] text-white rounded-full text-xl font-bold hover:bg-[#1e462d] transition-colors shadow-md">
          +
        </button>
      </div>
    
      <div className="mt-6 py-4 border-t">
        <Pagination totalPages={totalPages}/>
      </div>
    </div>
  );
}
