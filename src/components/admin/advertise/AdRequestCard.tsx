"use client";

import { PendingAdvertisement } from '@/types/indexAdmin';

export default function AdRequestCard({ ad }:{ad: PendingAdvertisement}) {
  console.log(ad);
  return (
    <div className="flex flex-col bg-white rounded-2xl border border-[#2B6340] border-2 p-5 shadow-sm hover:shadow-md transition-shadow duration-200 w-full h-fit text-left gap-3 cursor-pointer">
      <h4 className="text-base font-bold text-gray-900 truncate">
        {ad.title}
      </h4>

      <p className="text-sm text-gray-500 overflow-hidden text-ellipsis display-webkit-box webkit-line-clamp-2 webkit-box-orient-vertical h-10 line-clamp-2">
        {ad.content}
      </p>

      {/* 구분선 */}
      <hr className="border-gray-300/80" />

      <div className="flex flex-col gap-2 text-xs text-gray-500">
        <div className="flex justify-between items-center">
          <div className='flex flex-row gap-10'>
            <span className={`px-2 py-0.5 rounded-full border text-[11px] font-medium ${ad.status}`}>
              {ad.status}
            </span>
            <span className="font-semibold text-gray-700">{ad.advertiserNickname}</span>
          </div>

          <div className='flex flex-row gap-10'>
            <span className="text-gray-400">
              {new Date(ad.createdAt).toLocaleDateString()}
            </span>
            <span className="text-gray-400 font-mono">
              📍 {ad.latitude.toFixed(4)}, {ad.longitude.toFixed(4)}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}