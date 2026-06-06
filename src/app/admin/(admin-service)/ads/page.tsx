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

const MOCKDATA: PendingAdvertisement[] = [{
            "id": 1,
            "advertiserId": 22,
            "advertiserNickname": "test kando",
            "title": "[광고] 광고 타이틀 수정 테스트 ",
            "content": "국방상 또는 국민경제상 긴절한 필요로 인하여 법률이 정하는 경우를 제외하고는, 사영기업을 국유 또는 공유로 이전하거나 그 경영을 통제 또는 관리할 수 없다. 국민경제자문회의의 조직·직무범위 기타 필요한 사항은 법률로 정한다. 국가는 여자의 복지와 권익의 향상을 위하여 노력하여야 한다. 형사피해자는 법률이 정하는 바에 의하여 당해 사건의 재판절차에서 진술할 수 있다.나는 헌법을 준수하고 국가를 보위하며 조국의 평화적 통일과 국민의 자유와 복리의 증진 및 민족문화의 창달에 노력하여 대통령으로서의 직책을 성실히 수행할 것을 국민 앞에 엄숙히 선서합니다. 공공필요에 의한 재산권의 수용·사용 또는 제한 및 그에 대한 보상은 법률로써 하되, 정당한 보상을 지급하여야 한다. 국방상 또는 국민경제상 긴절한 필요로 인하여 법률이 정하는 경우를 제외하고는, 사영기업을 국유 또는 공유로 이전하거나 그 경영을 통제 또는 관리할 수 없다. 국민경제자문회의의 조직·직무범위 기타 필요한 사항은 법률로 정한다. 국가는 여자의 복지와 권익의 향상을 위하여 노력하여야 한다. 형사피해자는 법률이 정하는 바에 의하여 당해 사건의 재판절차에서 진술할 수 있다.나는 헌법을 준수하고 국가를 보위하며 조국의 평화적 통일과 국민의 자유와 복리의 증진 및 민족문화의 창달에 노력하여 대통령으로서의 직책을 성실히 수행할 것을 국민 앞에 엄숙히 선서합니다. 공공필요에 의한 재산권의 수용·사용 또는 제한 및 그에 대한 보상은 법률로써 하되, 정당한 보상을 지급하여야 한다.",
            "latitude": 37.2844251,
            "longitude": 127.0442344,
            "unlockRadius": 200,
            "imageUrls": [
                "https://loremflickr.com/400/400?lock=5104974706822147",
                "https://loremflickr.com/400/400?lock=1021099861210573",
                "https://loremflickr.com/400/400?lock=1021099861210573",
                "https://loremflickr.com/400/400?lock=1021099861210573",
                "https://loremflickr.com/400/400?lock=1021099861210573",
                "https://loremflickr.com/400/400?lock=1021099861210573",
                "https://loremflickr.com/400/400?lock=1021099861210573",
                "https://loremflickr.com/400/400?lock=1021099861210573",
                "https://loremflickr.com/400/400?lock=1021099861210573",
                "https://loremflickr.com/400/400?lock=1021099861210573"
            ],
            "categoryIds": [
                4
            ],
            "categoryNames": [
                "조깅", "풍경", "언덕"
            ],
            "status": "PENDING",
            "rejectReason": null,
            "createdAt": "2026-06-03T14:45:30.94041"
        },
      {
            "id": 2,
            "advertiserId": 22,
            "advertiserNickname": "test kando",
            "title": "[광고] 리스트 표시 테스트 ",
            "content": "UI 확인을 위해 엄청 긴 텍스트를 작성합니다 좀더길게가야할듯 아자뵤뵤뵤뵤뵤뵵뵤뵤뵤뵤뵵뵵ㅂ뵵뵤뵵뵵ㅂ 뵵뵵뵤뵵ㅂ 옹오오오오오 오오오오오오오오오오오옹오오오오오오ㅗㅇ오오오오오ㅗ오오오오오오옹",
            "latitude": 37.2844251,
            "longitude": 127.0442344,
            "unlockRadius": 200,
            "imageUrls": [
                "https://loremflickr.com/400/400?lock=5104974706822147",
                "https://loremflickr.com/400/400?lock=1021099861210573"
            ],
            "categoryIds": [
                4
            ],
            "categoryNames": [
                "조깅"
            ],
            "status": "PENDING",
            "rejectReason": null,
            "createdAt": "2026-06-03T14:45:30.94041"
        }]

export default function Page() {
  const [advertisement, setAdvertisement] = useState<Advertisement[]>([]);
  const [pendingAdvertisement, setpendingAdvertisement] = useState<PendingAdvertisement[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAdId, setSelectedAdId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    
    console.log(selectedAdId);
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
        {MOCKDATA.map((item) => (
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
          onClose={() => setSelectedPendingAd(null)} // 닫으면 다시 null로 만들어 모달을 닫습니다.
        />
      )}

    </div>
    )}
    </>
  );
}
