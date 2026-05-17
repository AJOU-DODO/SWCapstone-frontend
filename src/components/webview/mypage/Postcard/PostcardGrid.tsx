// 엽서 표시 컴포넌트 (3개씩 표시)
import Image from 'next/image';
import type { MyPostcard } from "@/types/indexMypage";
import { ImagePlus, Images } from 'lucide-react';
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Spinner from "@/components/webview/Spinner";

interface GridProps {
  items: MyPostcard[];
  activeTab: 'mine' | 'sent' | 'received';
  onItemClick: (item: MyPostcard) => void; // 클릭 함수 타입 추가
  fetchNextPage: () => void;
  hasNextPage: boolean; 
  isFetchingNextPage: boolean;
}

export default function PostcardGrid({ items, activeTab, onItemClick, fetchNextPage, hasNextPage, isFetchingNextPage }: GridProps ) {
  const { ref, inView } = useInView();
  
  useEffect(() => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);
  
  console.log("ActiveTap: ", activeTab);

  const handleCreatePostcard = () => {
    if (window && window.AndroidBridge.requestPostcardMake) {
      window.AndroidBridge.requestPostcardMake();
    } else {
      console.log("안드로이드 브릿지가 연결되지 않았습니다.");
    }
   console.log("엽서 생성 요청");
  };
  return (
    <div>
      <div className="grid grid-cols-3 gap-1">
        {activeTab === 'mine' && (
          <div 
            onClick={handleCreatePostcard}
            className="aspect-square flex flex-col items-center justify-center bg-gray-200 border-2 border-dashed border-[#54513E] cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <ImagePlus size={24} color="#54513E" />
            <span className="text-xs text-[#54513E] mt-1">엽서 만들기</span>
          </div>
        )}

        {items.map((item) => (
          <PostcardItem key={item.id} item={item} onClick={() => onItemClick(item)}/>
        ))}
      </div>
      <div ref={ref} className="flex w-full justify-center items-end h-14">
        {isFetchingNextPage && <Spinner size="sm" />}
        {!isFetchingNextPage && !hasNextPage && items.length > 0 && (
          <p className="text-xs text-[#54513E] pb-2">모든 엽서를 확인했어요!</p>
        )}
      </div>
    </div>
  );
}

// components/PostcardItem.tsx
function PostcardItem({ item, onClick }: { item: MyPostcard, onClick: () => void }) {
  return (
    <div className="aspect-square relative overflow-hidden bg-[#FAF7E4]">
      <Image 
        onClick={onClick}
        src={item.imageUrl} 
        alt="엽서 이미지"
        fill
        className="object-cover"
      />
    </div>
  );
}