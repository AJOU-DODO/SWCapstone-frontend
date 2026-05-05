//신고된 댓글 관리 테이블
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// 데이터는 변경될 수 있음
export interface Reply {
  id: string;
  creatorNickname: string;
  content: string;
  originContent: string;
  latestReportDate: string;
  reportCount: number;
  reportReason: string;
}

export default function ReportNestTable({ nests }: { nests: Reply[] }) {
  return (
    <div className="border border-t-[#54513E] border-x-0 border-b-[#54513E]/50 [&_th]:text-center [&_td]:text-center">
      <Table>
        <TableHeader>
          <TableRow className="border-[#54513E] hover:bg-transparent">
            <TableHead>작성자</TableHead>
            <TableHead>본문 내용</TableHead>
            <TableHead>최초 신고일</TableHead>
            <TableHead>최근 신고일</TableHead>
            <TableHead>신고 수</TableHead>
            <TableHead>신고 사유</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {nests.map((nest) => (
            <TableRow key={nest.id} className="border-[#54513E]/50">
              <TableCell>{nest.creatorNickname}</TableCell>
              <TableCell className="max-w-[150px] truncate">{nest.content}</TableCell>
              <TableCell className="max-w-[150px] truncate">{nest.originContent}</TableCell>
              <TableCell>{nest.latestReportDate}</TableCell>
              <TableCell>{nest.reportCount}</TableCell>
              <TableCell>{nest.reportReason}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}