import { NestImageScrollSlider } from "./NestImageScrollSlider";
import { ThumbsUp, ThumbsDown } from "lucide-react";

import { NestDetailBody } from '@/types/indexAdmin';

export default function NestBody ({ body }: { body: NestDetailBody }) {

  return (
    <div className="p-4 flex flex-col gap-4 bg-[#E8E4CD]">
      {/* 이미지 슬라이더 영역. */}
      {body?.imageUrls && <NestImageScrollSlider imageUrls={body.imageUrls} />}
      
      {/* 둥지 카테고리 칩 영역 */}
      {body.categoryNames && body.categoryNames.length > 0 && (
        <div className="flex flex-col gap-1.5 pt-1">
          <div className="flex flex-wrap gap-1.5">
            {body.categoryNames.map((category, index) => (
              <div
                key={index}
                className="px-2.5 py-0.5 text-[11px] font-medium text-[#54513E] bg-[#EDEAE0] rounded-md border border-[#54513E]/20 select-none"
              >
                # {category}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 둥지 본문 텍스트 영역 */}
      <div className="text-base text-gray-800 leading-relaxed whitespace-pre-wrap">
        {body.title}
      </div>
      <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
        {body.content}
      </div>

      {/* 좋아요 싫어요 표시 */}
      <div className="flex flex-row items-center gap-4 pt-1 select-none text-xs font-semibold">
        
        {/* 좋아요 */}
        <div className="flex items-center gap-1.5 text-[#2B6340] px-2 py-1 rounded-md border border-blue-100">
          <ThumbsUp size={20} className="stroke-[2.5]" />
          <span> {body.likeCount}</span>
        </div>

        {/* 싫어요 */}
        <div className="flex items-center gap-1.5 text-[#2B6340] px-2 py-1 rounded-md border border-red-100">
          <ThumbsDown size={20} className="stroke-[2.5]" />
          <span> {body.dislikeCount}</span>
        </div>

      </div>
    </div>
  );
};