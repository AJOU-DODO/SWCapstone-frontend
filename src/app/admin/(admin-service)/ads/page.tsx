"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from 'next/navigation';

import AdvertiseTabButton from '@/components/admin/advertise/AdvertiseTabButton';
import AdvertiserList from '@/components/admin/advertise/AdvertiserList';
import AdRequestCard from "@/components/admin/advertise/AdRequestCard";
import AdRequestDetailModal from '@/components/admin/advertise/AdRequestDetailModal';
import ActiveAdvertisementTable from '@/components/admin/tables/ActiveAdvertisementTable';
import IncludeDeletedToggle from '@/components/admin/IncludeDeletedToggle';

import Pagination from '@/components/admin/Pagination';
import { Advertisement, GetAdvertisementStatus, PendingAdvertisement } from '@/types/indexAdmin';
import { getAdvertisements, getAdvertisementList } from '@/lib/adminApi/advertise';

function AdvertisementPage() {
  const [advertisement, setAdvertisement] = useState<Advertisement[]>([]);
  const [pendingAdvertisement, setpendingAdvertisement] = useState<PendingAdvertisement[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAdId, setSelectedAdId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  const [selectedPendingAd, setSelectedPendingAd] = useState<PendingAdvertisement | null>(null);

  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const activeTab = searchParams.get('tab') || 'APPROVED';
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
        console.error('활성 광고 목록 로딩 실패:', error);
      } 
    };

    const fetchPendingAdvertisement = async () => {
      try {
        const data = await getAdvertisementList();
        setpendingAdvertisement(data.data);
      } catch (error) {
        console.error('광고 신청 목록 로딩 실패:', error);
      } 
    };

    if(activeTab === "PENDING") {
      fetchPendingAdvertisement();
    } else {
      fetchAdvertisement();
    }
  }, [activeTab, currentPage, includeDeleted]);

  const handleRowClick = (id: number) => {
    setSelectedAdId(id);
    
    const currentQueries = searchParams.toString();
    const targetUrl = currentQueries 
      ? `/admin/ads/${id}?${currentQueries}` 
      : `/admin/ads/${id}`;

    router.push(targetUrl);
  };


  return (
    <>
    {activeTab === "APPROVED" ? (
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
    ) : (
      <div className="grid grid-rows-[auto_1fr_auto] p-10 pr-20 gap-8 h-screen overflow-hidden">
      <div>
        <AdvertiseTabButton/>
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto min-h-0 w-full items-center">
      <div className="w-full flex flex-col gap-4">
        {pendingAdvertisement.map((item) => (
          <AdRequestCard key={item.id} onClick={() => setSelectedPendingAd(item)} ad={item} />
        ))}
      </div>
    </div>

      <div className="py-4 border-t">
        <Pagination totalPages={totalPages}/>
      </div>

      {selectedPendingAd && (
        <AdRequestDetailModal 
          ad={selectedPendingAd} 
          onClose={() => setSelectedPendingAd(null)}
        />
      )}

    </div>
    )}
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">목록을 로딩 중입니다...</div>}>
      <AdvertisementPage />
    </Suspense>
  );
}
