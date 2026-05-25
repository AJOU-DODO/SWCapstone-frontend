"use client";

import SearchBar from '@/components/admin/SearchBar';
import UserTable from '@/components/admin/tables/UserTable';
import Pagination from '@/components/admin/Pagination';
import SortSection from '@/components/admin/SortSection';
import WhitelistModal from '@/components/admin/user/WhitelistModal';
import { getUsers } from '@/lib/adminApi/user';
import { User } from '@/types/indexAdmin';

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from 'next/navigation';

function AdminUsersPage(){
  const [users, setUsers] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get('page')) || 1;
  const sort = searchParams.get('sort') || 'createdAt,desc';

  //정렬 옵션
  const sortOptions = [
    { label: "유저 ID", value: "id" },
    { label: "닉네임", value: "nickname" },
    { label: "유저 유형", value: "role" },
    { label: "게시글 수", value: "nestCount" },
    { label: "댓글 수", value: "commentCount" },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const params: { sort?: string; page: number } = {
          sort: sort,
          page: currentPage - 1
        };

        const data = await getUsers(params);
        setUsers(data.data.content);
        setTotalPages(data.data.totalPages || 1);
      } catch (error) {
        console.error('유저 목록 로딩 실패:', error);
      } 
    };

    fetchUsers();
  }, [searchParams]);

  return (
    <div className="grid grid-rows-[auto_auto_1fr_auto] p-10 pr-20 gap-8 h-screen overflow-hidden">
      <div className="justify-between items-center">
        <SearchBar placeholder='유저 ID 혹은 유저 name 검색' /> 
      </div>

      <div className='flex flex-row justify-between'>
        <SortSection options={sortOptions} defaultSort='id'/>
        <button 
          onClick={() => setIsModalOpen(true)}
          className='border-2 border-[#54513E] rounded-sm px-2 py-1 hover:bg-[#54513E]/30'>
            화이트리스트 관리
        </button>
      </div>

      <div className="w-full h-full min-h-0 overflow-y-auto">
        <UserTable users={users} />
      </div>

      <div className="mt-6 py-4 border-t">
        <Pagination totalPages={totalPages}/>
      </div>

      {isModalOpen && (
        <WhitelistModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}

    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div>페이지 로딩 중...</div>}>
      <AdminUsersPage />
    </Suspense>
  );
}
