"use client";

import { PendingAdvertisement } from '@/types/indexAdmin';

import ApproveButton from "@/components/admin/advertise/ApproveButton";
import RejectButton from "@/components/admin/advertise/RejectButton";

interface AdDetailModalProps {
  ad: PendingAdvertisement;
  onClose: () => void;
}

export default function AdDetailModal({ ad, onClose }: AdDetailModalProps) {
  return (
    // 배경 레이어 (바깥 클릭 시 닫힘)
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" 
      onClick={onClose}
    >
      {/* 모달 본체 (내부 클릭 시 이벤트 전파 방지) */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[85vh] flex flex-col gap-4 text-left shadow-xl overflow-hidden"
      >
        {/* 헤더 영역 */}
        <div className="flex justify-between items-start border-b border-gray-100 pb-3">
          <div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full border bg-amber-50 text-amber-700 border-amber-200">
              {ad.status}
            </span>
            <h3 className="text-xl font-bold text-gray-900 mt-2">{ad.title}</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* 스크롤 가능한 본문 영역 */}
        <div className="flex-1 flex flex-col gap-4 pr-1 min-h-0 text-sm text-gray-700 leading-relaxed overflow-hidden">
          {/* 광고 정보 메타 데이터 */}
          <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl text-xs text-gray-600 flex-shrink-0">
            <div><span className="font-semibold text-gray-400">광고주 닉네임:</span> {ad.advertiserNickname}</div>
            <div><span className="font-semibold text-gray-400">신청일:</span> {new Date(ad.createdAt).toLocaleString()}</div>
            <div><span className="font-semibold text-gray-400">위치 좌표:</span> 📍 {ad.latitude}, {ad.longitude}</div>
            <div><span className="font-semibold text-gray-400">해금 반경:</span> {ad.unlockRadius}m</div>
            <div className="col-span-2">
              <span className="font-semibold text-gray-400">카테고리:</span>{" "}
              {ad.categoryNames.map((cat) => (
                <span key={cat} className="inline-block bg-[#54513E] px-1.5 py-0.5 rounded mr-1 text-[11px] text-white">
                  {cat}
                </span>
              ))}
            </div>
          </div>

          <div className='flex-1 overflow-y-auto space-y-4 pr-1 min-h-0'>
            {/* 이미지 영역 (이미지가 있을 경우에만 렌더링) */}
            {ad.imageUrls && ad.imageUrls.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-semibold text-xs text-gray-400">첨부 이미지</h5>
                <div className="grid grid-cols-2 gap-2">
                  {ad.imageUrls.map((url, index) => (
                    <img 
                      key={index} 
                      src={url} 
                      alt={`첨부이미지 ${index + 1}`} 
                      className="w-full h-40 object-cover rounded-xl border border-gray-100"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>


          {/* 광고 상세 내용 */}
          <div className="whitespace-pre-wrap py-2 overflow-y-auto">
            {ad.content}
          </div>

        {/* 하단 버튼 영역 (어드민 액션) */}
        <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
          <RejectButton 
            adId={ad.id}
            onSuccess={() => {
              onClose();
              window.location.reload();
            }}
          />
          <ApproveButton 
            adId={ad.id} 
            onSuccess={() => {
              onClose();
              window.location.reload();
            }}
          />
        </div>
      </div>
    </div>
  );
}