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
  const [selectedNoticeId, setSelectedNoticeId] = useState<string | number | null>(null);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const router = useRouter();

  const filterStatus = searchParams.get('status') ?? 'ALL';

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const params: { isPublished?: boolean } = {};

        if (filterStatus === 'PUBLISHED') {
          params.isPublished = true;
        } else if (filterStatus === 'DRAFT') {
          params.isPublished = false;
        }

        setLoading(true);
        const data = await getNotices(params);
        setNotices(data.data.content);
      } catch (error) {
        console.error('공지사항 목록 로딩 실패:', error);
        alert('목록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, [filterStatus]);

  return (
    <div className="grid grid-rows-[auto_auto_1fr_auto_auto] p-10 pr-20 gap-8 h-screen overflow-hidden">
      <div className="justify-between items-center">
        <SearchBar placeholder='공지사항 검색' /> 
      </div>

      <NoticeTab/>

      <div className="overflow-hidden">
        <NoticeTable notices={notices} onRowClick={(id) => router.push(`/admin/notices/${id}`)} />
      </div>

      <div className="flex justify-end items-center">
        <button 
        onClick={() => router.push('/admin/notices/editer')}
        className="flex items-center justify-center w-10 h-10 bg-[#2B6340] text-white rounded-full text-xl font-bold hover:bg-[#1e462d] transition-colors shadow-md">
          +
        </button>
      </div>
    
      <div className="mt-6 py-4 border-t">
        <Pagination totalPages={10}/>
      </div>
    </div>
  );
}
