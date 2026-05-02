import SearchBar from '@/components/admin/SearchBar';
import UserTable from '@/components/admin/UserTable';
import Pagination from '@/components/admin/Pagination';
import UserSortSection from '@/components/admin/UserSortSection';

export default async function Page({ searchParams,}: {searchParams: Promise<{ [key: string]: string | string[] | undefined }>}) {
  //정렬 옵션
  const currentSort = await searchParams;

  //임의의 데이터. (테이블 확인을 위한) 추후 삭제될 부분.
  const users = [
    { id: "1", nickname: "어드민", email: "admin@gmail.com", role: "ADMIN", status: "ACTIVE", created_at: "2023-02-01", num_nest: 27, num_reply: 5},
    { id: "2", nickname: "김도도", email: "kim@example.com", role: "USER", status: "ACTIVE", created_at: "2023-02-01", num_nest: 27, num_reply: 5 },
    { id: "3", nickname: "양아치", email: "badguy@example.com", role: "USER", status: "BANNED", created_at: "2023-02-01", num_nest: 27, num_reply: 5 },
    { id: "4", nickname: "광고주", email: "adv@example.com", role: "ADVERTISER", status: "ACTIVE", created_at: "2023-02-01", num_nest: 27, num_reply: 5 },
  ];

  //임의 데이터 (페이지네이션을 위한)
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  const totalItems = 80; // 전체 유저 수
  const itemsPerPage = 10; // 한 페이지당 보여줄 수
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="grid grid-rows-[auto_auto_1fr_auto] p-10 pr-20 gap-8 h-screen overflow-hidden">
      <div className="justify-between items-center">
        <SearchBar placeholder='유저 ID 혹은 유저 name 검색' /> 
      </div>

      <div>
        <UserSortSection initialSort={currentSort} />
      </div>

      <div className="overflow-hidden">
        <UserTable users={users} />
      </div>

      <div className="mt-6 py-4 border-t">
        <Pagination totalPages={totalPages} currentPage={currentPage}/>
      </div>
    </div>
  )
}
