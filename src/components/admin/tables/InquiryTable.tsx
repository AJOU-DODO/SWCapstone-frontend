//전체 둥지 관리 테이블
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Inquiry } from '@/types/indexAdmin';

interface TableProps {
  inquiries: Inquiry[];
  onRowClick: (id: number) => void;
  selectedId: number | null;
}

export default function InquiryTable({ inquiries, onRowClick, selectedId }: TableProps) {
  return (
    <div className="border border-t-[#54513E] border-x-0 border-b-[#54513E]/50 [&_th]:text-center [&_td]:text-center">
      <Table>
        <colgroup>
          <col className="w-[6%]" />
          <col className="w-[18%]" />
          <col className="w-[40%]" />
          <col className="w-[8%]" />
          <col className="w-[14%]" />
          <col className="w-[14%]" />
        </colgroup>

        <TableHeader>
          <TableRow className="border-[#54513E] hover:bg-transparent">
            <TableHead>문의ID</TableHead>
            <TableHead>작성자</TableHead>
            <TableHead>제목</TableHead>
            <TableHead>문의 상태</TableHead>
            <TableHead>문의 날짜</TableHead>
            <TableHead>답변 날짜</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inquiries.map((inquiry) => {
            return(
            <TableRow 
              key={inquiry.id} 
              onClick={(e) => {
                e.stopPropagation();
                onRowClick(inquiry.id);
              }}
              className={`border-[#54513E]/50 cursor-pointer transition-colors hover:bg-[#54513E]/15 font-medium ${
                inquiry.answeredAt ? "opacity-40" : ""
              } `}>
                <TableCell>{inquiry.id}</TableCell>
                <TableCell>{inquiry.userNickname} {"(" + inquiry.userId + ")"}</TableCell>
                <TableCell className="max-w-[150px] truncate">{"[" + inquiry.typeDescription + "]"} {inquiry.title}</TableCell>
                <TableCell>{inquiry.statusDescription}</TableCell>
                <TableCell>{new Date(inquiry.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{inquiry.answeredAt ? new Date(inquiry.answeredAt).toLocaleDateString()  : '----.--.--'}</TableCell>
            </TableRow>
          )})}
        </TableBody>
      </Table>
    </div>
  )
}