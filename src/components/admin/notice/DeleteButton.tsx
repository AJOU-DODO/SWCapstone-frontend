'use client';

import { useRouter } from 'next/navigation';
import { deleteNotice } from '@/lib/adminApi/notice';

export default function PublishButton({ id }: { id: number }) {
  const router = useRouter();

  const handleDelete = async () => {
    await deleteNotice(id);
    router.push('/admin/notices');
  };

  return (
    <button
      onClick={handleDelete}
      className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-full hover:bg-red-700"
    >
      삭제하기
    </button>
  );
}