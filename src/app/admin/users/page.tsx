import SearchBar from '@/components/admin/SearchBar';
import UserTable from '@/components/admin/UserTable';

export default function Page() {
  //임의의 데이터. 추후 삭제될 부분.
  const users = [
    { id: "1", nickname: "어드민", email: "admin@gmail.com", role: "ADMIN", status: "ACTIVE", created_at: "2023-02-01", num_nest: 27, num_reply: 5},
    { id: "2", nickname: "김도도", email: "kim@example.com", role: "USER", status: "ACTIVE", created_at: "2023-02-01", num_nest: 27, num_reply: 5 },
    { id: "3", nickname: "양아치", email: "badguy@example.com", role: "USER", status: "BANNED", created_at: "2023-02-01", num_nest: 27, num_reply: 5 },
    { id: "4", nickname: "광고주", email: "adv@example.com", role: "ADVERTISER", status: "ACTIVE", created_at: "2023-02-01", num_nest: 27, num_reply: 5 },
  ];

  return (
    <div className="grid grid-rows-[auto_1fr_auto] p-10 pr-20 gap-8 h-screen overflow-hidden">
      <div className="justify-between items-center">
        <SearchBar placeholder='유저 ID 혹은 유저 name 검색' /> 
      </div>

      <div className="overflow-hidden">
        <UserTable users={users} />
      </div>
    </div>
  )
}
