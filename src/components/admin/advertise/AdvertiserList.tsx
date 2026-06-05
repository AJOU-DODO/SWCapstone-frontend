"use client";

import { getAdvertisers } from '@/lib/adminApi/advertise';
import { useEffect, useState } from "react";
import { AdvertiserList as Advertiser } from '@/types/indexAdmin';

import Pagination from '@/components/admin/Pagination';

interface WhitelistModalProps {
  isOpen: boolean;
  onClose: () => void; // 모달을 닫는 함수 타입
}

export default function AdvertiserList ({ isOpen, onClose }: WhitelistModalProps) {
  const [advertiserList, setadvertiserList] = useState<Advertiser[]>([]);
  const [modalPage, setModalPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      try {

        const data = await getAdvertisers({ page: modalPage - 1 });
        console.log(modalPage);
        setadvertiserList(data.data.content);
        setTotalPages(data.data.totalPages || 1);
      } catch (error) {
        console.error('광고주 목록 로딩 실패:', error);
      } 
    };

    fetchUsers();
  }, [modalPage]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-2xl p-6 w-[70vw] h-[80vh] max-h-[80vh] overflow-hidden shadow-xl transform transition-all flex flex-col gap-4 text-center">
        <h3>승인된 광고주 목록</h3>
        
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0">
          {advertiserList.length > 0 && (
            <div className="grid grid-cols-[1fr_1fr_3fr_1fr_2fr_2fr] gap-3 px-3 py-1.5 text-xs font-semibold text-gray-500 border-b-2 border-gray-200 bg-gray-50/50">
              <div>번호</div>
              <div>닉네임</div>
              <div>이메일 주소</div>
              <div>작성 가능한 광고 수 </div>
              <div className="text-center">만료일</div>
              <div className="text-center">생성일</div>
            </div>
          )}
          {advertiserList.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-8">등록된 광고주가 없습니다.</p>
          ) : (
            advertiserList.map((item) => (
              <div 
                key={item.userId}
                className="grid grid-cols-[1fr_1fr_3fr_1fr_2fr_2fr] gap-3 bg-gray-50 p-3 rounded-sm border border-gray-100 items-center"
              >
                <span className="text-sm text-gray-700 font-medium">{item.userId}</span>
                <span className="text-sm text-gray-700 font-medium">{item.nickname}</span>
                <span className="text-sm text-gray-700 font-medium">{item.email}</span>
                <span className="text-sm text-gray-700 font-medium">{item.allowedAdCount}</span>
                <span className='text-sm text-gray-700 font-medium'>{new Date(item.expiredAt).toLocaleDateString()}</span>
                <span className='text-sm text-gray-700 font-medium'>{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
            ))
          )}
        </div>
        <Pagination 
          totalPages={totalPages} 
          currentPage={modalPage} 
          onPageChange={(page) => setModalPage(page)} 
        />
      </div>
    </div>
  );
}