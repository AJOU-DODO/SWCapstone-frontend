"use client";

import { useRef } from "react";

interface Props {
  imageUrls: string[];
}

export function NestImageScrollSlider({ imageUrls }: Props) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (imageUrls.length === 0) return null;

  // 하단 미니 이미지 클릭 시 사진 이동
  const scrollToImage = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const containerWidth = container.clientWidth;
    container.scrollTo({
      left: containerWidth * index,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex flex-col gap-3 my-4">
      <div 
        ref={scrollContainerRef}
        className="w-full h-[300px] bg-[#EDEAE0] rounded-xl border border-[#54513E]/20 overflow-x-auto flex flex-row snap-x snap-mandatory scroll-smooth scrollbar-none"
      >
        {imageUrls.map((url, i) => (
          <div 
            key={i} 
            className="flex-[0_0_100%] h-full relative snap-center p-4"
          >
            <img
              src={url}
              alt={`본문 이미지 ${i + 1}`}
              className="w-full h-full object-contain rounded-lg select-none"
            />
          </div>
        ))}
      </div>

      {/* 하단 미니 썸네일 리스트 */}
      {imageUrls.length > 1 && (
        <div className="flex flex-row gap-2 overflow-x-auto py-1">
          {imageUrls.map((url, i) => (
            <div 
              key={i} 
              onClick={() => scrollToImage(i)}
              className="w-11 h-11 relative flex-shrink-0 rounded-md overflow-hidden border border-gray-300 bg-gray-100 hover:border-[#54513E] cursor-pointer transition-all active:scale-95"
            >
              <img
                src={url}
                alt={`썸네일 ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

    </div>
  );
}