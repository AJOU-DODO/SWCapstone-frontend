// 엽서 표시 컴포넌트 (3개씩 표시)
import Image from 'next/image';
import type { MyPostcard } from "@/types/indexMypage";

export default function PostcardGrid({ items }: { items: MyPostcard[] }) {
  return (
    <div className="grid grid-cols-3 gap-1">
      {items.map((item) => (
        <PostcardItem key={item.id} item={item} />
      ))}
    </div>
  );
}

// components/PostcardItem.tsx
function PostcardItem({ item }: { item: any }) {
  return (
    <div className="aspect-square relative overflow-hidden bg-[#FAF7E4]">
      <Image 
        src={item.imageUrl} 
        alt="엽서 이미지"
        fill
        className="object-cover"
      />
    </div>
  );
}