import Image from "next/image";

import { NestDetailHeader } from '@/types/indexAdmin';

export default function DetailHeader ({ header }: { header: NestDetailHeader }) {

  return (
  <div className="flex flex-row justify-between items-start md:items-end gap-4 p-4 border-b bg-[#E8E4CD] w-full">
    <div className="flex flex-row items-end gap-2 flex-shrink-0">
      <Image 
        src="/DODOLogo.png"
        alt="DODO 로고"
        width={50}
        height={50}
        className="rounded-full object-cover border-2 border-[#54513E]"
      />
      <div className="text-[#54513E] truncate font-medium whitespace-nowrap">
        {header.authorNickname}
      </div>
      <div className="pl-3 text-xs text-gray-500 whitespace-nowrap pb-0.5">
        {new Date(header.createdAt).toLocaleDateString()} {/*생성일*/}
      </div>
    </div>
    <div className="flex flex-row gap-6 md:gap-8 text-xs text-gray-500 flex-1 justify-start md:justify-center whitespace-nowrap pb-0.5">
      <div>
        최초 신고일: {header.firstReportedAt}
      </div>
      <div>
        최근 신고일: {header.lastReportedAt}
      </div>
    </div>
    <div className="flex flex-row gap-2 items-end flex-shrink-0 w-full md:w-auto justify-end">
      <button className="rounded-md border-2 h-9 w-16 border-black text-sm hover:bg-black/5 transition-colors"> 
        취소 
      </button>
      <button className="rounded-md border-2 h-9 w-16 border-black text-sm hover:bg-black/5 transition-colors">
        삭제 
      </button>
    </div>
  </div>
  );
};