"use client";

import { useState } from 'react';

interface ReportChipProps {
  label: string;
  count: number;
  colorType: 'red' | 'amber' | 'blue' | 'gray';
  onClick?: () => void;
  isOpen?: boolean;
}

export default function ReportInfo ({ nestId }: { nestId: any }) {
  const [showOtherDetails, setShowOtherDetails] = useState(false);

  //임시 데이터
  const serverData = {
    stats: {
      pendingAbuseCount: 5,
      pendingSpamCount: 12,
      pendingAdvertisementCount: 77,
      pendingOtherCount: 3,
    },
    otherReportContents: [
      "상업용 블로그 링크 유도글입니다. 제재 부탁드립니다.",
      "특정 개인의 실명이 포함되어 있어서 가려야 할 것 같아요.",
      "위치와 전혀 상관없는 낚시성 정보글입니다.",
      "재미없음.",
      "이상한 위치에 핀을 찍어뒀어요. GPS 조작인 것 같습니다.",
      "신고사유 테스트 메시지 입니다.",
    ]
  };

  return (
    <div>
    <div className="p-4 flex flex-row items-center gap-4 border-b bg-[#E8E4CD] w-full overflow-x-auto">
      {/* 타이틀 영역 */}
      <div className="text-xs font-bold text-[#54513E] flex-shrink-0">
        신고사유
      </div>
      
      <div className="flex flex-row gap-2">
        <ReportChip 
          label="욕설" 
          count={serverData.stats.pendingAbuseCount} 
          colorType="red" 
        />
        <ReportChip 
          label="도배" 
          count={serverData.stats.pendingSpamCount} 
          colorType="amber" 
        />
        <ReportChip 
          label="광고" 
          count={serverData.stats.pendingAdvertisementCount}
          colorType="blue" 
        />
        <ReportChip 
          label="기타" 
          count={serverData.stats.pendingOtherCount} 
          colorType="gray" 
          onClick={() => setShowOtherDetails(!showOtherDetails)} 
          isOpen={showOtherDetails}
        />
      </div>
    </div>

    {showOtherDetails && serverData.otherReportContents.length > 0 && (
      <div className="px-4 pb-4 pt-1 animate-fadeIn bg-[#E8E4CD]">
        <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-[#54513E]/20">
          <div className="text-[11px] font-bold text-[#54513E]/80 mb-2">💡 기타 상세 신고 사유 리스트</div>
          <ul className="list-disc list-inside text-xs text-gray-700 flex flex-col gap-2 pl-1 max-h-[80px] overflow-y-auto pr-1">
            {serverData.otherReportContents.map((content, index) => (
              <li key={index} className="leading-relaxed">
                {content}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )}
    </div>
  )
};

export function ReportChip({ label, count, colorType, onClick, isOpen }: ReportChipProps) {
  if (count <= 0) return null;

  const colorStyles = {
    red: "bg-red-50 text-red-700 border-red-200 text-[11px] bg-red-200/60",
    amber: "bg-amber-50 text-amber-700 border-amber-200 text-[11px] bg-amber-200/60",
    blue: "bg-blue-50 text-blue-700 border-blue-200 text-[11px] bg-blue-200/60",
    gray: `bg-gray-100 text-gray-700 text-[11px] bg-gray-300/60 cursor-pointer transition-all ${
      isOpen ? "border-gray-600 ring-1 ring-gray-400" : "border-gray-300 hover:bg-gray-200"
    }`
  };

  const currentStyle = colorStyles[colorType] || colorStyles.gray;
  const badgeBg = currentStyle.split(" ").pop();

  return (
    <div 
      onClick={onClick} // 🌟 클릭하면 부모가 넘겨준 함수 실행
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium flex-shrink-0 select-none ${currentStyle.replace(badgeBg!, '')}`}
    >
      <span>{label}</span>
      <span className={`font-bold px-1.5 py-0.5 rounded-full ${badgeBg}`}>
        {count}
      </span>
    </div>
  );
}