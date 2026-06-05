"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from 'next/navigation';

import AdvertiseTabButton from '@/components/admin/advertise/AdvertiseTabButton';
import AdvertiserList from '@/components/admin/advertise/AdvertiserList';
import ActiveAdvertisementTable from '@/components/admin/tables/ActiveAdvertisementTable';
import IncludeDeletedToggle from '@/components/admin/IncludeDeletedToggle';
import Pagination from '@/components/admin/Pagination';
import { Advertisement, GetAdvertisementStatus } from '@/types/indexAdmin';
import { getAdvertisements } from '@/lib/adminApi/advertise';

export default function Page() {
  const [advertisement, setAdvertisement] = useState<Advertisement[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAdId, setSelectedAdId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const activeTab = searchParams.get('tab') || 'PENDING';
  const includeDeleted = searchParams.get('includeDeleted') || 'ACTIVE';

  useEffect(() => {
    const fetchAdvertisement = async () => {
      try {
        const params: { status: GetAdvertisementStatus; page: number } = {
          status: includeDeleted as GetAdvertisementStatus,
          page: currentPage - 1
        };

        const data = await getAdvertisements(params);
        setAdvertisement(data.data.content);
        setTotalPages(data.data.totalPages || 1);
      } catch (error) {
        console.error('광고 목록 로딩 실패:', error);
      } 
    };

    fetchAdvertisement();
  }, [activeTab, currentPage, includeDeleted]);

  const handleRowClick = (id: number) => {
    setSelectedAdId(id);
    
    console.log(selectedAdId);
  };


  return (
    <div className="grid grid-rows-[auto_auto_1fr_auto] p-10 pr-20 gap-8 h-screen overflow-hidden">
      <div>
        <AdvertiseTabButton/>
      </div>

      <div className="flex flex-row items-center justify-between gap-5">
        <IncludeDeletedToggle label="삭제된 광고 보기" trueValue="DELETED" falseValue="ACTIVE"/>
        <button 
          onClick={() => setIsModalOpen(true)}
          className='border-2 border-[#54513E] rounded-sm px-2 py-1 hover:bg-[#54513E]/30'>
            광고주 리스트
        </button>
      </div>

      <ActiveAdvertisementTable ads={advertisement} onRowClick={handleRowClick} selectedId={selectedAdId}/>

      <div className="py-4 border-t">
        <Pagination totalPages={totalPages}/>
      </div>

      {isModalOpen && (
        <AdvertiserList 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}

    </div>
  );
}
