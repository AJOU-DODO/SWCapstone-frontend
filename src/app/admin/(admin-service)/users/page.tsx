"use client";

import SearchBar from '@/components/admin/SearchBar';
import UserTable from '@/components/admin/tables/UserTable';
import Pagination from '@/components/admin/Pagination';
import SortSection from '@/components/admin/SortSection';
import { getUsers } from '@/lib/adminApi/user';
import { User } from '@/types/indexAdmin';

import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
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

      <div>
        <SortSection options={sortOptions} defaultSort='id'/>
      </div>

      <div className="w-full h-full min-h-0 overflow-y-auto">
        <UserTable users={users} />
      </div>

      <div className="mt-6 py-4 border-t">
        <Pagination totalPages={10}/>
      </div>
    </div>
  )
}
