import SearchBar from '@/components/admin/SearchBar';
import UserTable, { User } from '@/components/admin/UserTable';
import Pagination from '@/components/admin/Pagination';
import SortSection from '@/components/admin/SortSection';

export default async function Page({ searchParams,}: {searchParams: Promise<{ [key: string]: string | string[] | undefined }>}) {
  //정렬 옵션
  const currentSort = await searchParams;

  //임의의 데이터. (테이블 확인을 위한) 추후 삭제될 부분.
  const users: User[] = [
    { 
      id: "1", 
      nickname: "어드민", 
      email: "admin@gmail.com", 
      role: "ADMIN", 
      status: "ACTIVE", 
      createdAt: "2023-02-01", 
      numNest: 27, 
      numReply: 5 
    },
    { 
    id: "2", 
    nickname: "김도도", 
    email: "kim@gmail.com", 
    role: "USER", 
    status: "ACTIVE", 
    createdAt: "2023-02-01", 
    numNest: 27, 
    numReply: 5 
    },
    { 
      id: "3", 
      nickname: "양아치", 
      email: "badguy@gmail.com", 
      role: "ADMIN", 
      status: "BANNED", 
      createdAt: "2023-02-01", 
      numNest: 27, 
      numReply: 5 
    },
    { 
    id: "4", 
    nickname: "광고주", 
    email: "adv@gmail.com", 
    role: "ADVERTISER", 
    status: "ACTIVE", 
    createdAt: "2023-02-01", 
    numNest: 27, 
    numReply: 5 
    },
  ]

  //임의 데이터 (페이지네이션을 위한)
  const totalItems = 80; // 전체 유저 수
  const itemsPerPage = 10; // 한 페이지당 보여줄 수
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  //정렬 옵션
  const sortOptions = [
    { label: "유저 ID", value: "id" },
    { label: "가입 날짜", value: "createdAt" },
    { label: "유저 유형", value: "role" },
    { label: "게시글 수", value: "nestCount" },
    { label: "댓글 수", value: "commentCount" },
  ];

  return (
    <div className="grid grid-rows-[auto_auto_1fr_auto] p-10 pr-20 gap-8 h-screen overflow-hidden">
      <div className="justify-between items-center">
        <SearchBar placeholder='유저 ID 혹은 유저 name 검색' /> 
      </div>

      <div>
        <SortSection options={sortOptions} defaultSort='id'/>
      </div>

      <div className="overflow-hidden">
        <UserTable users={users} />
      </div>

      <div className="mt-6 py-4 border-t">
        <Pagination totalPages={totalPages}/>
      </div>
    </div>
  )
}
