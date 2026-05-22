//공지사항 관리 테이블
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Notice } from '@/types/indexAdmin';


interface TableProps {
  notices: Notice[];
  onRowClick: (id: string | number) => void;
}

export default function NoticeTable({ notices, onRowClick }: TableProps) {
  return (
    <div className="border border-t-[#54513E] border-x-0 border-b-[#54513E]/50 [&_th]:text-center [&_td]:text-center">
      <Table>
        <TableHeader>
          <TableRow className="border-[#54513E] hover:bg-transparent">
            <TableHead>공지사항 번호</TableHead>
            <TableHead>구분</TableHead>
            <TableHead>제목</TableHead>
            <TableHead>작성일자</TableHead>
            <TableHead>수정일자</TableHead>
            <TableHead>발행 여부</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notices.map((notice) => (
            <TableRow 
              key={notice.id} 
              onClick={(e) => {
                e.stopPropagation();
                onRowClick(notice.id);
              }}
              className="border-[#54513E]/50">
                <TableCell>{notice.id}</TableCell>
                <TableCell>{notice.categoryDescription}</TableCell>
                <TableCell className="max-w-[150px] truncate">{notice.title}</TableCell>
                <TableCell>{notice.createdAt}</TableCell>
                <TableCell>{notice.updatedAt}</TableCell>
                <TableCell>{notice.isPublished ? 'O' : 'X'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}