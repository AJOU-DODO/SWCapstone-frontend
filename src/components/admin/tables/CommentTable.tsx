//신고된 댓글 관리 테이블
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { ReportedCommentList } from '@/types/indexAdmin';

interface TableProps {
  comments: ReportedCommentList[];
  onRowClick: (id: number) => void;
  selectedId: number | null;
}

export default function CommentTable({ comments, onRowClick, selectedId }: TableProps) {
  return (
    <div className="border border-t-[#54513E] border-x-0 border-b-[#54513E]/50 [&_th]:text-center [&_td]:text-center">
      <Table>
        <TableHeader>
          <TableRow className="border-[#54513E] hover:bg-transparent">
            <TableHead>작성자</TableHead>
            <TableHead>본문 내용</TableHead>
            <TableHead>둥지 제목</TableHead>
            <TableHead>최근 신고일</TableHead>
            <TableHead>신고 수</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comments.map((comment) => {
            const isSelected = selectedId === comment.nestId;
            
            return(
            <TableRow 
              key={comment.commentId} 
              onClick={(e) => {
                  e.stopPropagation();
                  onRowClick(comment.nestId);
                }}
              className={`border-[#54513E]/50 cursor-pointer transition-colors ${
                isSelected 
                  ? "bg-[#54513E]/10 hover:bg-[#54513E]/15 font-medium"
                  : "hover:bg-gray-50"
              }`}>
                <TableCell>{comment.authorNickname}</TableCell>
                <TableCell className="max-w-[150px] truncate">{comment.commentContent}</TableCell>
                <TableCell className="max-w-[150px] truncate">{comment.nestTitle}</TableCell>
                <TableCell>{new Date(comment.lastReportedAt).toLocaleDateString()}</TableCell>
                <TableCell>{comment.reportCount}</TableCell>
            </TableRow>
          )})}
        </TableBody>
      </Table>
    </div>
  )
}