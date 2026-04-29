import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface SearchBarProps {
  placeholder?: string; 
}

export default function SearchBar({ placeholder = "검색어를 입력하세요" }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Input 
        type="search" 
        placeholder={placeholder}
        className="h-[7vh] w-full pl-10 rounded-md border-[#2B6340] border-2 focus-visible:ring-1" 
      />

      {/* 아이콘 */}
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2B6340] text-400" />
    </div>
  )
}