"use client";

import SearchBar from '@/components/admin/SearchBar';
import UserTable from '@/components/admin/tables/UserTable';
import Pagination from '@/components/admin/Pagination';
import SortSection from '@/components/admin/SortSection';
import WhitelistModal from '@/components/admin/user/WhitelistModal';
import UserSanctionModal from '@/components/admin/user/UserSanctionModal';
import DeleteSanctionModal from '@/components/admin/user/DeleteSanctionModal';
import PostAdvertiserRole from '@/components/admin/user/PostAdvertiserRole';
import { getUsers, getUserByEmail } from '@/lib/adminApi/user';
import { User } from '@/types/indexAdmin';

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from 'next/navigation';

function AdminUsersPage(){
  const [users, setUsers] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRoleUser, setSelectedRoleUser] = useState<User | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const sort = searchParams.get('sort') || 'createdAt,desc';
  const searchQuery = searchParams.get('search') || null;

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
        if (searchQuery) {
          const res = await getUserByEmail(searchQuery);
          if (res.data) {
            setUsers(res.data);
          } else {
            setUsers([]);
          }
          setTotalPages(1);
          return;
        }

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
  }, [currentPage, sort, searchQuery, refreshTrigger]);

  return (
    <div className="grid grid-rows-[auto_auto_1fr_auto] p-10 pr-20 gap-8 h-screen overflow-hidden">
      <div className="justify-between items-center">
        <SearchBar placeholder='이메일로 유저 검색' /> 
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
        <UserTable users={users} onRowClick={(user) => setSelectedUser(user)} onRoleClick={(user) => setSelectedRoleUser(user)}/>
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

      {selectedUser !== null && (
        selectedUser.isSanctioned ? (
          <DeleteSanctionModal 
            isOpen={true}
            userId={selectedUser.id}
            onClose={() => setSelectedUser(null)}
            setIsUpdated={setRefreshTrigger}
          />
        ) : (
          <UserSanctionModal 
            isOpen={true}
            userId={selectedUser.id}
            onClose={() => setSelectedUser(null)}
            setIsUpdated={setRefreshTrigger}
          />
        )
      )}

      {selectedRoleUser !== null && (
        <PostAdvertiserRole
          isOpen={true}
          userId={selectedRoleUser.id}
          onClose={() => setSelectedRoleUser(null)}
          setIsUpdated={setRefreshTrigger}/>
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
