'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { deleteNotice } from '@/lib/adminApi/notice';

export default function PublishButton({ id }: { id: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteNotice(id);
      setIsModalOpen(false);

      const currentQueries = searchParams.toString();

      if (currentQueries) {
        router.push(`/admin/notices?${currentQueries}`);
      } else {
        router.push('/admin/notices');
      }
    } catch (error) {
      console.error(error);
      alert('삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-full hover:bg-red-700"
      >
        삭제하기
      </button>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => !isDeleting && setIsModalOpen(false)} 
          />

          {/* 모달 창 */}
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl transform transition-all flex flex-col gap-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 text-xl font-bold">
              ⚠️
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-gray-900">정말 삭제하시겠습니까?</h3>
              <p className="text-sm text-gray-500">
                삭제된 공지사항은 다시 복구할 수 없습니다.
              </p>
            </div>

            <div className="flex gap-3 mt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                취소
              </button>
              
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isDeleting ? '삭제 중...' : '삭제'}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}