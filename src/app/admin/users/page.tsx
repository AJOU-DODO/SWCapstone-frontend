import SearchBar from '@/components/admin/SearchBar';

export default function Page() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] p-10 pr-20 gap-8 h-screen overflow-hidden">
      <div className="justify-between items-center">
        <SearchBar placeholder='유저 ID 혹은 유저 name 검색' /> 
      </div>
    </div>
  )
}
