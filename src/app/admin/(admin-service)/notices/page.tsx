"use client";

import { useState, use } from "react";

import SearchBar from '@/components/admin/SearchBar';
import Pagination from '@/components/admin/Pagination';
import NoticeTable from '@/components/admin/tables/NoticeTable';
import { Notice } from '@/types/indexAdmin';

export default function Page() {
  const [selectedPostId, setSelectedPostId] = useState<string | number | null>(null);

  const notice: Notice[] = [
      { 
        id: 1,
        category: "UPDATE",
        categoryDescription: "업데이트 공지",
        title: "2026.05.22 업데이트 공지",
        content: "공지사항 발행 기능이 추가됐습니다.",
        isPublished: true,
        createdAt: "2026.05.22",
        updatedAt: "2026.05.22",
        deletedAt: null,
      },
      { 
        id: 2,
        category: "UPDATE",
        categoryDescription: "업데이트 공지",
        title: "2026.05.22 업데이트 공지",
        content: "공지사항 발행 기능이 추가됐습니다.",
        isPublished: false,
        createdAt: "2026.05.22",
        updatedAt: "2026.05.22",
        deletedAt: null,
      },
  ]
  return (
    <div className="grid grid-rows-[auto_auto_1fr_auto] p-10 pr-20 gap-8 h-screen overflow-hidden">
          <div className="justify-between items-center">
            <SearchBar placeholder='공지사항 검색' /> 
          </div>

          <div className="overflow-hidden">
                  <NoticeTable notices={notice} onRowClick={setSelectedPostId} />
                </div>
    
          <div className="mt-6 py-4 border-t">
            <Pagination totalPages={10}/>
          </div>
        </div>
  );
}
