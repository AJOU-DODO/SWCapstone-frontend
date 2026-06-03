"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from 'next/navigation';

import InquiryTabButton from '@/components/admin/inquiry/InquiryTabButton';
import InquiryTable from '@/components/admin/tables/InquiryTable';
import Pagination from '@/components/admin/Pagination';
import { Inquiry } from '@/types/indexAdmin';
import { getInquiries } from '@/lib/adminApi/inquiry';

function InquiryPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedInquiryId, setSelectedInquiryId] = useState<number | null>(null);

  const router = useRouter();

  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const activeTab = searchParams.get('tab') || 'PENDING';

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const params: { status?: string; page: number } = {
          status: activeTab,
          page: currentPage - 1
        };

        const data = await getInquiries(params);
        setInquiries(data.data.content);
        setTotalPages(data.data.totalPages || 1);
      } catch (error) {
        console.error('문의사항 목록 로딩 실패:', error);
      } 
    };

    fetchInquiries();
  }, [activeTab, searchParams]);

  const handleRowClick = (id: number) => {
    setSelectedInquiryId(id);
    
    const currentQueries = searchParams.toString();
    const targetUrl = currentQueries 
      ? `/admin/inquiry/${id}?${currentQueries}` 
      : `/admin/inquiry/${id}`;

    router.push(targetUrl);
  };

  return (
    <div className="grid grid-rows-[auto_1fr_auto] p-10 pr-20 gap-8 h-screen overflow-hidden">
      <div>
        <InquiryTabButton/>
      </div>

      <InquiryTable inquiries={inquiries} onRowClick={handleRowClick} selectedId={selectedInquiryId}/>

      <div className="py-4 border-t">
        <Pagination totalPages={totalPages}/>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">목록을 로딩 중입니다...</div>}>
      <InquiryPage />
    </Suspense>
  );
}
