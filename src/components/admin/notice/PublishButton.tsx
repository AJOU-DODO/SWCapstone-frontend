'use client';

import { useRouter } from 'next/navigation';
import { publishNotice } from '@/lib/adminApi/notice';

export default function PublishButton({ id }: { id: number }) {
  const router = useRouter();

  const handlePublish = async () => {
    await publishNotice(id);
    router.refresh();
  };

  return (
    <button
      onClick={handlePublish}
      className="px-4 py-2 text-sm font-bold text-white bg-[#2B6340] rounded-full hover:bg-[#204a30]"
    >
      최종 발행하기
    </button>
  );
}