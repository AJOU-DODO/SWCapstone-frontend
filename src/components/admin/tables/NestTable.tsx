//전체 둥지 관리 테이블
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { NestList } from '@/types/indexAdmin';

interface TableProps {
  nests: NestList[];
  onRowClick: (id: number) => void;
  selectedId: number | null;
}

export default function NestTable({ nests, onRowClick, selectedId }: TableProps) {
  return (
    <div className="border border-t-[#54513E] border-x-0 border-b-[#54513E]/50 [&_th]:text-center [&_td]:text-center">
      <Table>
        <TableHeader>
          <TableRow className="border-[#54513E] hover:bg-transparent">
            <TableHead>작성자</TableHead>
            <TableHead>본문 내용</TableHead>
            <TableHead>작성 날짜</TableHead>
            <TableHead>좋아요 수</TableHead>
            <TableHead>댓글 수 </TableHead>
            <TableHead>신고 수</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {nests.map((nest) => {
            const isSelected = selectedId === nest.nestId;
            
            return(
            <TableRow 
              key={nest.nestId} 
              onClick={(e) => {
                e.stopPropagation();
                onRowClick(nest.nestId);
              }}
              className={`border-[#54513E]/50 cursor-pointer transition-colors ${
                nest.deleted ? "opacity-40" : ""
              } ${
                isSelected 
                  ? "bg-[#54513E]/10 hover:bg-[#54513E]/15 font-medium"
                  : "hover:bg-gray-50"
              }`}>
                <TableCell>{nest.authorNickname}</TableCell>
                <TableCell className="max-w-[150px] truncate">{nest.content}</TableCell>
                <TableCell>{new Date(nest.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{nest.likeCount}</TableCell>
                <TableCell>{nest.commentCount}</TableCell>
                <TableCell>{nest.reportCount}</TableCell>
            </TableRow>
          )})}
        </TableBody>
      </Table>
    </div>
  )
}