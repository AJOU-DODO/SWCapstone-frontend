// 엽서 표시 컴포넌트 (3개씩 표시)
import Image from 'next/image';
import type { MyPostcard } from "@/types/indexMypage";

interface GridProps {
  items: MyPostcard[];
  onItemClick: (item: MyPostcard) => void; // 클릭 함수 타입 추가
}

export default function PostcardGrid({ items, onItemClick }: GridProps ) {
  return (
    <div className="grid grid-cols-3 gap-1">
      {items.map((item) => (
        <PostcardItem key={item.id} item={item} onClick={() => onItemClick(item)}/>
      ))}
    </div>
  );
}

// components/PostcardItem.tsx
function PostcardItem({ item, onClick }: { item: any, onClick: () => void }) {
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