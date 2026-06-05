//게시된 광고 관리 테이블
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Advertisement } from '@/types/indexAdmin';

interface TableProps {
  ads: Advertisement[];
  onRowClick: (id: number) => void;
  selectedId: number | null;
}

export default function ActiveAdvertisementTable({ ads, onRowClick, selectedId }: TableProps) {
  return (
    <div className="border border-t-[#54513E] border-x-0 border-b-[#54513E]/50 [&_th]:text-center [&_td]:text-center">
      <Table>
        <TableHeader>
          <TableRow className="border-[#54513E] hover:bg-transparent">
            <TableHead>작성자</TableHead>
            <TableHead>제목</TableHead>
            <TableHead>생성일</TableHead>
            <TableHead>만료일</TableHead>
            <TableHead>삭제일</TableHead>
            <TableHead>중요도</TableHead>
            <TableHead>누적 노출수</TableHead>
            <TableHead>누적 클릭수</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ads.map((ad) => {
            const isSelected = selectedId === ad.id;
            
            return(
            <TableRow 
              key={ad.id} 
              onClick={(e) => {
                  e.stopPropagation();
                  onRowClick(ad.id);
                }}
              className={`border-[#54513E]/50 cursor-pointer transition-colors ${
                isSelected 
                  ? "bg-[#54513E]/10 hover:bg-[#54513E]/15 font-medium"
                  : "hover:bg-gray-50"
              }`}>
                <TableCell>{ad.advertiserNickname}</TableCell>
                <TableCell className="max-w-[150px] truncate">{ad.title}</TableCell>
                <TableCell >{new Date(ad.createdAt).toLocaleDateString()}</TableCell>
                <TableCell >{new Date(ad.expiredAt).toLocaleDateString()}</TableCell>
                <TableCell >{ad.deletedAt ? new Date(ad.deletedAt).toLocaleDateString()  : '----.--.--'}</TableCell>
                <TableCell>{ad.priorityScore}</TableCell>
                <TableCell>{ad.impressions}</TableCell>
                <TableCell>{ad.clicks}</TableCell>
            </TableRow>
          )})}
        </TableBody>
      </Table>
    </div>
  )
}