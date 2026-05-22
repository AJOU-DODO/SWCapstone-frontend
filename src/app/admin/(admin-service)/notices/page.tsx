"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

import SearchBar from '@/components/admin/SearchBar';
import Pagination from '@/components/admin/Pagination';
import NoticeTable from '@/components/admin/tables/NoticeTable';
import { Notice } from '@/types/indexAdmin';
import { getNotices } from '@/lib/adminApi/notice';

export default function Page() {
  const [selectedNoticeId, setSelectedNoticeId] = useState<string | number | null>(null);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);
        const data = await getNotices();
        setNotices(data.data.content);
        console.log(data);
      } catch (error) {
        console.error('공지사항 목록 로딩 실패:', error);
        alert('목록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  return (
    <div className="grid grid-rows-[auto_1fr_auto_auto] p-10 pr-20 gap-8 h-screen overflow-hidden">
      <div className="justify-between items-center">
        <SearchBar placeholder='공지사항 검색' /> 
      </div>

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
