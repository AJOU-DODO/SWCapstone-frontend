"use client";

import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";

interface Props {
  imageUrls: string[];
  title: string;
}

export function ImageSlider({ imageUrls, title }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [currentIndex, setCurrentIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (imageUrls.length === 0) return null;

  return (
    <div className="relative w-full aspect-square bg-[#EDEAE0]">
      <div ref={emblaRef} className="overflow-hidden w-full h-full">
        <div className="flex h-full touch-pan-y">
          {imageUrls.map((url, i) => (
            <div key={i} className="flex-[0_0_100%] relative h-full">
              <Image
                src={url}
                alt={`${title} 이미지 ${i + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority={i === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {imageUrls.length > 1 && (
        <>
          <div className="absolute top-3 right-3 bg-black/50 text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
            {currentIndex + 1} / {imageUrls.length}
          </div>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {imageUrls.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? "w-4 h-1.5 bg-white"
                    : "w-1.5 h-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
